import "server-only";
import { isFullBlock } from "@notionhq/client";
import type { BlockObjectResponse } from "@notionhq/client";
import { notion } from "./client";
import type { NotionBlock } from "./types";

/**
 * Notion pages don't come back as one flat, complete tree — `children.list`
 * paginates siblings, and any block with `has_children: true` (nested
 * lists, toggles, quotes with sub-content) needs its own follow-up call to
 * get its children. This walks the whole thing recursively so the renderer
 * downstream just gets a plain tree and never has to think about Notion's
 * fetch mechanics.
 */
export async function getPageBlocks(blockId: string): Promise<NotionBlock[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });
    blocks.push(...response.results.filter(isFullBlock));
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return Promise.all(
    blocks.map(async (block) => ({
      ...block,
      children: block.has_children ? await getPageBlocks(block.id) : undefined,
    })),
  );
}
