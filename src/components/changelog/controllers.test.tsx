import { parseContents } from './controllers';

describe(parseContents, () => {
  it('should pickout the attributes correctly', () => {
    const content = [
      '---',
      'date: 2020-01-01 12:00:00',
      'test: true',
      '---',
      '# Test',
      '',
      'Testing the contents of the file...',
      '---',
      'Footer',
    ].join('\n');

    const data = parseContents(content);
    expect(data).not.toBeUndefined();
    expect(data.body).not.toContain('date: ');
    expect(data.body).not.toContain('test: ');
    expect(data.body).toContain('# Test');
    expect(data.body).toContain('---');
    expect(data.body).toContain('Footer');
    expect(data.attributes).toHaveProperty('date');
    expect(data.attributes.date.getTime() / 1000).toEqual(1577880000);
  });

  it('should not parse the contents if the attributes are missing', () => {
    const content = [
      '# Test',
      '',
      'Testing the contents of the file...',
      '---',
      'Footer',
    ].join('\n');

    expect(() => { parseContents(content); }).toThrowError();
  });
});
