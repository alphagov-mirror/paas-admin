import cheerio from 'cheerio';
import { shallow } from 'enzyme';
import React from 'react';

import { GIBIBYTE, KIBIBYTE, MEBIBYTE, TEBIBYTE } from './constants';
import {
  Abbreviation,
  bytesToHuman,
  capitalize,
  conditionallyDisplay,
  percentage,
} from './helpers';

describe(percentage, () => {
  it('should do the right thing', () => {
    expect(percentage(5, 100)).toEqual('5.0%');
    expect(percentage(100, 5)).toEqual('2000.0%');
  });
});

describe(bytesToHuman, () => {
  it('should do the right thing', () => {
    const bytes = cheerio.load(shallow(<span>{bytesToHuman(5.3)}</span>).html());
    const kibibytes = cheerio.load(shallow(<span>{bytesToHuman(5.3 * KIBIBYTE)}</span>).html());
    const mebibytes = cheerio.load(shallow(<span>{bytesToHuman(5.3 * MEBIBYTE)}</span>).html());
    const gibibytes = cheerio.load(shallow(<span>{bytesToHuman(5.3 * GIBIBYTE)}</span>).html());
    const tebibytes = cheerio.load(shallow(<span>{bytesToHuman(5.3 * TEBIBYTE)}</span>).html());
    expect(bytes('span').html()).toContain(
      '5 <abbr role="tooltip" tabindex="0" data-module="tooltip" aria-label="bytes">B</abbr>',
    );
    expect(kibibytes('span').html()).toContain(
      '5.30 <abbr role="tooltip" tabindex="0" data-module="tooltip" aria-label="kibibytes">KiB</abbr>',
    );
    expect(mebibytes('span').html()).toContain(
      '5.30 <abbr role="tooltip" tabindex="0" data-module="tooltip" aria-label="mebibytes">MiB</abbr>',
    );
    expect(gibibytes('span').html()).toContain(
      '5.30 <abbr role="tooltip" tabindex="0" data-module="tooltip" aria-label="gibibytes">GiB</abbr>',
    );
    expect(tebibytes('span').html()).toContain(
      '5.30 <abbr role="tooltip" tabindex="0" data-module="tooltip" aria-label="tebibytes">TiB</abbr>',
    );
  });
});

describe(conditionallyDisplay, () => {
  it('should do the right thing', () => {
    const OK = conditionallyDisplay(true, <p>OK</p>);
    const notOK = conditionallyDisplay(false, <p>OK</p>);

    expect(shallow(OK).html()).toEqual('<p>OK</p>');
    expect(notOK).toBeUndefined();
  });
});

describe(capitalize, () => {
  it('should do the right thing', () => {
    expect(capitalize('test')).toEqual('Test');
  });
});

describe(Abbreviation, () => {
  it('it should render the abbreviation tooltip correctly', () => {
    const output = <Abbreviation description="For the win">FTW</Abbreviation>;
    const $ = cheerio.load(shallow(output).html());
    expect($('abbr').attr('tabindex')).toBe('0');
    expect($('abbr').text()).toBe('FTW');
    expect($('abbr').attr('aria-label')).toBe('For the win');
    expect($('abbr').attr('role')).toBe('tooltip');
  });
});
