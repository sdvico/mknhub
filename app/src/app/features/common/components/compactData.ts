/* eslint-disable @typescript-eslint/no-explicit-any */
import { isString } from 'lodash';
import qs from 'querystring';

type TDictionary = Record<string, any>;

function ensureObject(input: string | TDictionary): TDictionary {
  return isString(input) ? qs.parse(input, '&', '=') : input ?? {};
}

export default function compactData(
  obj1: TDictionary | string | undefined,
  obj2: TDictionary | string | undefined,
  convertObject?: boolean,
): Record<string, any> {
  const valueObj = typeof obj2 === 'object' ? { ...obj2 } : obj2;

  if (convertObject && typeof valueObj === 'object') {
    Object.keys(valueObj).map(key => {
      if (typeof valueObj[key] === 'object') {
        valueObj[key] = valueObj[key]?.value;
      }
    });
  }

  const result = {};
  const x = ensureObject(obj1);
  const y = ensureObject(valueObj);

  for (const key in x) {
    let value = x[key];

    if (isString(value) && /^:\w+$/.test(value)) {
      value = y[value.substr(1)];
    }

    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}
