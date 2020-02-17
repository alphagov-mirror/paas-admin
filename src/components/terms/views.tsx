import React, { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';

import { renderers } from '../../layouts';

interface ITermsPageProperties {
  readonly csrf: string;
  readonly name: string;
  readonly content: string;
}

export function TermsPage(props: ITermsPageProperties): ReactElement {
  return (
    <form method="post" action="/agreements">
      <input type="hidden" name="_csrf" value={props.csrf} />

      <ReactMarkdown
        className="md"
        source={props.content}
        renderers={renderers}
      />

      <input type="hidden" name="document_name" value={props.name} />

      <button className="govuk-button" data-module="govuk-button" type="submit">
        Agree
      </button>
    </form>
  );
}
