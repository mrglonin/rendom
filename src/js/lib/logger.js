export function createLogger(scope) {
  const prefix = `[Freedom/${scope}]`;

  return {
    debug(message, payload) {
      console.log(prefix, message, payload ?? "");
    },
    info(message, payload) {
      console.info(prefix, message, payload ?? "");
    },
    warn(message, payload) {
      console.warn(prefix, message, payload ?? "");
    },
    error(message, payload) {
      console.error(prefix, message, payload ?? "");
    },
  };
}
