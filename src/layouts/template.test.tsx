import React from 'react';
import { Template } from './template';

describe(Template, () => {
  it('should be able to render GOV.UK frontend correctly', async () => {
    const template = new Template({
      csrf: 'qwertyuiop-1234567890',
      location: 'eu-west-2',
      isPlatformAdmin: false,
    }, 'TEST CASE');
    const markup = template.render(<p>This is just a test</p>);

    expect(markup).toContain('<!DOCTYPE html>');
    expect(markup).toContain('<html lang=en class="govuk-template">');
    expect(markup).toContain('<head>');
    expect(markup).toContain('<title lang="en">TEST CASE</title>');
    expect(markup).toContain('<meta name="csrf-token" content="qwertyuiop-1234567890" />');
    expect(markup).toContain('<body class="govuk-template__body">');
    expect(markup).toContain('<p>This is just a test</p>');
  });
});