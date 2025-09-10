/* eslint-disable @typescript-eslint/no-explicit-any */
import { isString } from 'lodash';
import qs from 'querystring';

export default function compactUrl(url: string, data: Record<string, any> | string | undefined): string {
  if (!url) {
    return '';
  }

  data = isString(data) ? qs.parse(data as string, '&', '=') : data;

  return url.replace(/(:\w+)/gi, token => {
    return data[token.substr(1)];
  });
}
