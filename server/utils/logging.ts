// @ts-nocheck
export function useLogError(...message) {
  const nitro = useNitroApp();
  nitro.$logger.error(message);
}
export function useLogInfo(...message) {
  const nitro = useNitroApp();
  nitro.$logger.info(message);
}