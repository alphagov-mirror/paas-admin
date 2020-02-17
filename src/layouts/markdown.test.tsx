import { shallow } from 'enzyme';
import React from 'react';

import { Heading } from './markdown';

describe(Heading, () => {
  it('should be capable to display correct heading', () => {
    expect(
      shallow(<Heading level={1}>TEST</Heading>).matchesElement(
        <h1 className="govuk-heading-xl">TEST</h1>,
      ),
    ).toBe(true);
    expect(
      shallow(<Heading level={2}>TEST</Heading>).matchesElement(
        <h2 className="govuk-heading-l">TEST</h2>,
      ),
    ).toBe(true);
    expect(
      shallow(<Heading level={3}>TEST</Heading>).matchesElement(
        <h3 className="govuk-heading-m">TEST</h3>,
      ),
    ).toBe(true);
    expect(
      shallow(<Heading level={4}>TEST</Heading>).matchesElement(
        <h4 className="govuk-heading-s">TEST</h4>,
      ),
    ).toBe(true);
    expect(
      shallow(<Heading level={5}>TEST</Heading>).matchesElement(
        <p className="govuk-body">TEST</p>,
      ),
    ).toBe(true);
  });
});
