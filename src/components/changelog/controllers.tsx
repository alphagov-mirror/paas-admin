import React from 'react';
import frontMatter from 'front-matter';

import { IContext } from '../app';
import { IParameters, IResponse } from '../../lib/router';
import { Template } from '../../layouts';

import { Changelog, ILog } from './views';

interface IRawAttributes {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [key: string]: any;
}

export function parseContents(content: string): ILog {
  const data = frontMatter(content) as { readonly body: string; readonly attributes: IRawAttributes };
  const timestamp = Date.parse(data.attributes.date);

  if (isNaN(timestamp)) {
    throw new Error('Valid date in a format of `YYYY-MM-DD hh:mm:ss` is required.');
  }

  return {
    attributes: {
      ...data.attributes,
      date: new Date(timestamp),
    },
    body: data.body,
  };
}

export async function view(ctx: IContext, _params: IParameters): Promise<IResponse> {
  const log = [...ctx.app.changelog]
    .sort((lA, lB) => lA.attributes.date.getTime() - lB.attributes.date.getTime()).reverse();

  const template = new Template(ctx.viewContext, 'Changelog');

  return {
    body: template.render(
      <Changelog
        log={log}
      />,
    ),
  };
}
