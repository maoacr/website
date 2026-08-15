import "server-only";
import { Client, isFullDatabase, isFullDataSource } from "@notionhq/client";
import { NOTION_API_KEY, NOTION_DATABASE_ID } from "./config";

// Single shared instance — the SDK client is stateless besides the auth
// header, so there's no reason to construct one per request.
export const notion = new Client({ auth: NOTION_API_KEY });

export type NotionSchema = {
  dataSourceId: string;
  /** e.g. { Status: "status", Category: "select", Tags: "multi_select" } */
  propertyTypes: Record<string, string>;
};

// As of Notion API version 2025-09-03, a database no longer holds rows
// directly — it wraps one or more "data sources", and querying/filtering
// happens against a data source id, not the database id. For a database
// created the normal way (one table, not a multi-source merge) there's
// exactly one data source, so this resolves it once and reuses it.
//
// It also reads the data source's real property schema instead of
// assuming column types. This matters concretely for "Status": Notion has
// two different property kinds that look identical in the UI — a generic
// `select` and the built-in `status` type (grouped To-do/In Progress/
// Complete board columns) — and the API filter shape is NOT the same for
// both (`{ select: { equals } }` vs `{ status: { equals } }`). Guessing
// wrong doesn't fail softly, it throws a 400 from the Notion API. Reading
// the schema once and building the filter from it removes the guess.
let schemaPromise: Promise<NotionSchema> | null = null;

export function resolveSchema(): Promise<NotionSchema> {
  if (!schemaPromise) {
    schemaPromise = notion.databases
      .retrieve({ database_id: NOTION_DATABASE_ID })
      .then(async (database) => {
        if (!isFullDatabase(database) || database.data_sources.length === 0) {
          throw new Error(
            `Notion database ${NOTION_DATABASE_ID} has no queryable data source — check the integration has access and the database isn't empty/archived.`,
          );
        }
        const dataSourceId = database.data_sources[0].id;

        const dataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
        if (!isFullDataSource(dataSource)) {
          throw new Error(
            `Notion data source ${dataSourceId} came back partial — the integration may be missing "read content" capability.`,
          );
        }

        const propertyTypes: Record<string, string> = {};
        for (const [name, config] of Object.entries(dataSource.properties)) {
          propertyTypes[name] = config.type;
        }

        assertRequiredProperties(propertyTypes);
        return { dataSourceId, propertyTypes };
      });
  }
  return schemaPromise;
}

// Every property name below is typed by hand in lib/notion/posts.ts (Notion
// has no compile-time contract with your database — anyone can rename a
// column in the Notion UI tomorrow). Without this check, a rename surfaces
// as a raw Notion 400 buried in a Next.js prerender stack trace ("Could not
// find sort property with name or id: X"), which doesn't say what the
// *actual* column is named. This turns that into one clear error with the
// real property list attached, right where the mismatch happened.
const REQUIRED_PROPERTIES = ["Title", "Status", "lang", "Published Date"];

function assertRequiredProperties(propertyTypes: Record<string, string>) {
  const missing = REQUIRED_PROPERTIES.filter((name) => !(name in propertyTypes));
  if (missing.length > 0) {
    const available = Object.keys(propertyTypes).sort().join(", ");
    throw new Error(
      `Notion database is missing expected propert${missing.length > 1 ? "ies" : "y"}: ${missing.join(", ")}. ` +
        `Property names are case/space-sensitive. Columns actually found: ${available}. ` +
        `Either rename the column(s) in Notion to match, or update the name(s) in lib/notion/posts.ts.`,
    );
  }
}
