import type { ReactNode } from "react";
import type { NotionBlock } from "@/lib/notion/types";

// Notion's rich_text is a run-array with per-run annotations, not markup —
// this is the one shared function every text-bearing block goes through so
// bold/italic/code/links look consistent everywhere instead of each block
// type reinventing it.
function RichText({ richText }: { richText: unknown }) {
  const runs = Array.isArray(richText) ? richText : [];
  return (
    <>
      {runs.map((run, i) => {
        const text = run?.plain_text ?? "";
        const ann = run?.annotations ?? {};
        const href = run?.href as string | undefined;
        let node: ReactNode = text;
        if (ann.code) {
          node = (
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-signal">
              {node}
            </code>
          );
        }
        if (ann.bold) node = <strong className="font-semibold text-fg">{node}</strong>;
        if (ann.italic) node = <em>{node}</em>;
        if (ann.strikethrough) node = <s>{node}</s>;
        if (ann.underline) node = <u>{node}</u>;
        if (href) {
          node = (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-signal underline decoration-signal/40 underline-offset-2 hover:decoration-signal"
            >
              {node}
            </a>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function renderChildren(children: NotionBlock[] | undefined) {
  if (!children?.length) return null;
  return <NotionBlockRenderer blocks={children} />;
}

function Block({ block }: { block: NotionBlock }) {
  const value = block[block.type] as Record<string, unknown> | undefined;

  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-base leading-relaxed text-fg/90">
          <RichText richText={value?.rich_text} />
        </p>
      );

    case "heading_1":
      return (
        <h2 className="mt-10 font-display text-3xl font-semibold tracking-tight text-fg">
          <RichText richText={value?.rich_text} />
        </h2>
      );

    case "heading_2":
      return (
        <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight text-fg">
          <RichText richText={value?.rich_text} />
        </h3>
      );

    case "heading_3":
      return (
        <h4 className="mt-6 font-display text-xl font-semibold text-fg">
          <RichText richText={value?.rich_text} />
        </h4>
      );

    case "bulleted_list_item":
      return (
        <li className="ml-5 list-disc marker:text-signal">
          <RichText richText={value?.rich_text} />
          {renderChildren(block.children)}
        </li>
      );

    case "numbered_list_item":
      return (
        <li className="ml-5 list-decimal marker:text-signal">
          <RichText richText={value?.rich_text} />
          {renderChildren(block.children)}
        </li>
      );

    case "quote":
      return (
        <blockquote className="border-l-2 border-signal pl-4 italic text-muted">
          <RichText richText={value?.rich_text} />
        </blockquote>
      );

    case "callout": {
      const icon = value?.icon as { emoji?: string } | undefined;
      return (
        <div className="flex gap-3 rounded-xl border border-border bg-surface p-4">
          {icon?.emoji && <span aria-hidden="true">{icon.emoji}</span>}
          <p className="text-sm leading-relaxed text-fg/90">
            <RichText richText={value?.rich_text} />
          </p>
        </div>
      );
    }

    case "code": {
      const richText = (value?.rich_text as { plain_text: string }[] | undefined) ?? [];
      return (
        <pre className="overflow-x-auto rounded-xl border border-border bg-surface p-4 font-mono text-sm text-fg">
          <code>{richText.map((r) => r.plain_text).join("")}</code>
        </pre>
      );
    }

    case "image": {
      const external = value?.external as { url: string } | undefined;
      const file = value?.file as { url: string } | undefined;
      const src = value?.type === "external" ? external?.url : file?.url;
      const captionRuns = (value?.caption as { plain_text: string }[] | undefined) ?? [];
      const caption = captionRuns.map((r) => r.plain_text).join("");
      if (!src) return null;
      return (
        <figure className="my-2">
          {/* Plain <img>, not next/image: Notion-hosted files are served
              from short-lived signed URLs, which don't play well with
              next/image's own caching/optimization layer. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={caption || ""}
            loading="lazy"
            className="w-full rounded-xl border border-border"
          />
          {caption && (
            <figcaption className="mt-2 text-center text-xs text-muted">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "divider":
      return <hr className="border-border" />;

    default:
      return null;
  }
}

type ListRun = { kind: "list"; tag: "ul" | "ol"; blocks: NotionBlock[] };
type SingleRun = { kind: "single"; block: NotionBlock };

// Notion gives us a flat sibling array — five consecutive
// `bulleted_list_item` blocks are five separate objects, not one list with
// five items. Group runs of the same list type together so they render as
// a single <ul>/<ol> instead of N one-item lists (which is both visually
// wrong and announced wrong by screen readers).
function groupRuns(blocks: NotionBlock[]): (ListRun | SingleRun)[] {
  const runs: (ListRun | SingleRun)[] = [];
  for (const block of blocks) {
    const tag = block.type === "bulleted_list_item" ? "ul" : block.type === "numbered_list_item" ? "ol" : null;
    const last = runs[runs.length - 1];
    if (tag && last?.kind === "list" && last.tag === tag) {
      last.blocks.push(block);
    } else if (tag) {
      runs.push({ kind: "list", tag, blocks: [block] });
    } else {
      runs.push({ kind: "single", block });
    }
  }
  return runs;
}

export function NotionBlockRenderer({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <div className="space-y-4">
      {groupRuns(blocks).map((run) =>
        run.kind === "list" ? (
          <run.tag key={run.blocks[0].id} className="space-y-1">
            {run.blocks.map((block) => (
              <Block key={block.id} block={block} />
            ))}
          </run.tag>
        ) : (
          <Block key={run.block.id} block={run.block} />
        ),
      )}
    </div>
  );
}
