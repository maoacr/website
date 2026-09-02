/**
 * Exercises the access-token rules that protect private blog posts.
 *
 * Run with: npm run verify:access
 *
 * These are the checks that decide whether a stranger can read a private
 * post, so they're worth proving rather than assuming. `lib/blog/token.ts`
 * is deliberately free of Next.js and Notion imports so it can be driven
 * directly here, with no server and no network.
 */
import { ACCESS_TTL_MS, signAccess, tokenIsValid } from "../lib/blog/token.ts";

const POST_ID = "203d1a2c-1111-2222-3333-444455556666";
const PASSWORD = "correct horse battery staple";
const NOW = 1_800_000_000_000;

let failures = 0;

function check(description: string, actual: boolean, expected: boolean) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "  ok  " : " FAIL "} ${description}`);
}

const fresh = signAccess(POST_ID, PASSWORD, NOW);

check("a freshly issued token is accepted", tokenIsValid(POST_ID, PASSWORD, fresh, NOW), true);

check(
  "it still works one second before the TTL elapses",
  tokenIsValid(POST_ID, PASSWORD, fresh, NOW + ACCESS_TTL_MS - 1000),
  true,
);

check(
  "it is refused one second after the TTL elapses",
  tokenIsValid(POST_ID, PASSWORD, fresh, NOW + ACCESS_TTL_MS + 1000),
  false,
);

check(
  "a token whose timestamp was edited forward is refused",
  tokenIsValid(
    POST_ID,
    PASSWORD,
    `${NOW + ACCESS_TTL_MS * 10}.${fresh.split(".")[1]}`,
    NOW + ACCESS_TTL_MS * 5,
  ),
  false,
);

check(
  "a token minted for another post is refused",
  tokenIsValid(POST_ID, PASSWORD, signAccess("some-other-post", PASSWORD, NOW), NOW),
  false,
);

check(
  "a token stops working once the Notion password changes",
  tokenIsValid(POST_ID, "a new password", fresh, NOW),
  false,
);

check("an invented token is refused", tokenIsValid(POST_ID, PASSWORD, "true", NOW), false);

check(
  "a token dated in the future is refused",
  tokenIsValid(POST_ID, PASSWORD, signAccess(POST_ID, PASSWORD, NOW + 60_000), NOW),
  false,
);

console.log(failures === 0 ? "\nAll access-token checks passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
