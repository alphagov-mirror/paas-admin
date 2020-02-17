import React from 'react';
import { shallow } from 'enzyme';

import { Changelog } from './views';

describe(Changelog, () => {
  it('should parse changelog correctly', () => {
    const log = [
      {
        attributes: { date: new Date('2020-01-02 12:00:00') },
        body: 'Changed another thing',
      },
      {
        attributes: { date: new Date('2020-01-01 12:00:00') },
        body: 'Changed a thing',
      },
    ];
    const markup = shallow(<Changelog log={log} />);

    expect(markup.find('h2').first()).toHaveText('January 2nd 2020');
    expect(markup.children().at(2).render().hasClass('govuk-body')).toBe(true);
    expect(markup.children().at(2).render().text()).toEqual('Changed another thing');

    expect(markup.children().at(4).render().text()).toEqual('Changed a thing');
  });
});
