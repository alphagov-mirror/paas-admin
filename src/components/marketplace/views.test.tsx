import { shallow } from 'enzyme';
import React from 'react';

import { MarketplaceItemPage } from './views';
import { IService } from '../../lib/cf/types';

describe(MarketplaceItemPage, () => {
  const service = {
    entity: {
      label: 'test',
      extra: {
        displayName: 'Test',
      },
    },
  } as unknown as IService;

  it('should prefer the display name', () => {
    const markup = shallow(<MarketplaceItemPage service={service} />);
    expect(markup.find('h1').text()).toContain('Test');
    expect(markup.find('h1').text()).not.toContain('test');
  });
});
