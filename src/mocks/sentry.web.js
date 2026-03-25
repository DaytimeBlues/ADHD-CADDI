const passthrough = (value) => value;

export const init = () => undefined;
export const captureException = () => undefined;
export const captureMessage = () => undefined;
export const withScope = (callback) =>
  callback?.({ setTag: passthrough, setContext: passthrough });

const sentryWeb = {
  init,
  captureException,
  captureMessage,
  withScope,
};

export default sentryWeb;
