import {dictionary} from './dictionary';
import {toolDictionary} from './dictionary-tool';
import type {Locale} from './types';

export function translate(key: string, locale: Locale): string {
  if (locale === 'en') return key;
  const entry = dictionary[key] ?? toolDictionary[key];
  if (!entry) return key;
  return entry[locale] ?? key;
}

/** Translate a status key that may include a trailing ` (n/m)` progress suffix. */
export function translateProgress(message: string, t: (key: string) => string): string {
  const match = /^(.*)( \(\d+\/\d+\))$/.exec(message);
  if (!match) return t(message);
  return `${t(match[1])}${match[2]}`;
}
