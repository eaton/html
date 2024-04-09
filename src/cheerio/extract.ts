import { toCheerio } from './to-cheerio.js';
import * as cheerio from 'cheerio';

import {
  cheerioJsonMapper,
  JsonTemplateObject as ExtractTemplateObject,
  JsonTemplate as ExtractTemplate,
  Options as ExtractOptions,
} from 'cheerio-json-mapper';

import { pipeFnMap } from './pipes.js';

export {
  type JsonTemplateObject as ExtractTemplateObject,
  type JsonTemplate as ExtractTemplate,
  type PipeFn as ExtractPipe,
  type Options as ExtractOptions,
  type PipeInput as ExtractPipeInput,
} from 'cheerio-json-mapper';

type MappedReturn<T> = (T extends [] ? Record<string, unknown>[] : Record<string, unknown>);

/**
 * Uses cheerio to extract structured data from markup
 */
export async function extract<T extends ExtractTemplate>(
  input: string | Buffer,
  template: T,
  options: Partial<ExtractOptions> = {}
): Promise<MappedReturn<T>> {
  if (options) {
    options.pipeFns = { ...options.pipeFns, ...pipeFnMap};
  } else {
    options = { pipeFns: pipeFnMap };
  }

  return cheerioJsonMapper(input.toString(), template, options) as Promise<MappedReturn<T>>;
}

/**
 * Uses cheerio to to extract data from markup, with XML parsing rules
 */
export async function extractXml<T extends ExtractTemplate>(
  input: string | Buffer,
  template: T,
  options: Partial<ExtractOptions> = {}
): Promise<MappedReturn<T>> {
  if (options) {
    options.pipeFns = { ...options.pipeFns, ...pipeFnMap};
  } else {
    options = { pipeFns: pipeFnMap };
  }

  const dom = toCheerio(input.toString(), { xml: true, xmlMode: true })(':root');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return cheerioJsonMapper(dom, template, options) as Promise<MappedReturn<T>>;
}
