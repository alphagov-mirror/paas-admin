import moment from 'moment';
import React, { Fragment, ReactElement } from 'react';
import Markdown from 'react-markdown';

import { DATE, renderers } from '../../layouts';

export interface ILog {
  readonly body: string;
  readonly attributes: {
    readonly date: Date;
  };
}

interface IChangelogProperties {
  readonly log: ReadonlyArray<ILog>;
}

export function Changelog(props: IChangelogProperties): ReactElement {
  return <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <h1 className="govuk-heading-xl">Changelog</h1>

      <p className="govuk-body">Find out what your friendly neighbourhood GOV.UK PaaS team has been up to recently!</p>

      {props.log.map((log, index) => <Fragment key={index}>
        <h2 id={log.attributes.date.toISOString()} className="govuk-heading-l">
          <time dateTime={log.attributes.date.toISOString()}>
            {moment(log.attributes.date).format(DATE)}
          </time>
        </h2>
        <Markdown renderers={renderers}>{log.body}</Markdown>
      </Fragment>)}
    </div>

    <div className="govuk-grid-column-one-third">
      <ul className="govuk-list">
        {props.log.map((log, index) => <li key={index}>
          <a className="govuk-link" href={`#${log.attributes.date.toISOString()}`}>
            {moment(log.attributes.date).format(DATE)}
          </a>
        </li>)}
      </ul>
    </div>
  </div>;
}
