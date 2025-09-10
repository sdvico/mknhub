export const GlobalKey = {
  URL_OPEN_APP: 'URL_OPEN_APP',
};
interface State {
  URL_OPEN_APP?: string;
  [key: string]: number | string | undefined;
}

export const GlobalState: State = {};

export const setGlobalState = (key: string, value: number | string) => {
  GlobalState[key] = value;
};

export const getGlobalState = (key: string): number | string | undefined => {
  return GlobalState[key];
};
