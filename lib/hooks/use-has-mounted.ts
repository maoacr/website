import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only once the component has hydrated on the client.
 *
 * Prefers `useSyncExternalStore` over the common
 * `useState(false) + useEffect(() => setState(true))` pattern: it lets
 * the server snapshot ("not mounted") and client snapshot ("mounted")
 * differ without ever calling setState from inside an effect body.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
