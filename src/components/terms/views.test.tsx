import cheerio from 'cheerio';
import { shallow } from 'enzyme';
import React from 'react';

import { TermsPage } from './views';

const title = 'Test certificate';
const content = `# ${title}

* [See example](https://example.com)
* [Another example](https://example.com)

1. Visit first example
1. Visit the other example`;

describe(TermsPage, () => {
  it('should be capable of parsing markdown content', () => {
    const markup = shallow(
      <TermsPage content={content} csrf="CSRF_TOKEN" name={title} />,
    );
    const $ = cheerio.load(markup.html());
    expect(
      markup
        .find('input')
        .filter({ name: '_csrf' })
        .prop('value'),
    ).toEqual('CSRF_TOKEN');
    expect(
      markup
        .find('input')
        .filter({ name: 'document_name' })
        .prop('value'),
    ).toEqual(title);
    expect($('h1').hasClass('govuk-heading-xl')).toBe(true);
    expect($('h1').text()).toEqual(title);
    expect($('ul').hasClass('govuk-list')).toBe(true);
    expect($('ul').hasClass('govuk-list--bullet')).toBe(true);
    expect($('ol').hasClass('govuk-list')).toBe(true);
    expect($('ol').hasClass('govuk-list--number')).toBe(true);
    expect($('a').hasClass('govuk-link')).toBe(true);
    expect(
      $('a')
        .first()
        .text(),
    ).toEqual('See example');
  });
});
