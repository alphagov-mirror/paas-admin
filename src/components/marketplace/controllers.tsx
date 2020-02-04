import React from 'react';

import { IContext } from '../app';
import { IParameters, IResponse } from '../../lib/router';
import { MarketplaceItemPage, MarketplacePage } from './views';
import { Template } from '../../layouts';
import CloudFoundryClient from '../../lib/cf';

export async function listServices(ctx: IContext, _params: IParameters): Promise<IResponse> {
  const cf = new CloudFoundryClient({
    accessToken: ctx.token.accessToken,
    apiEndpoint: ctx.app.cloudFoundryAPI,
    logger: ctx.app.logger,
  });

  const rawServices = await cf.services();
  const services = rawServices.map(service => ({
    ...service,
    additionalMetadata: JSON.parse(service.broker_service_offering_metadata),
  }));

  const template = new Template(ctx.viewContext, 'Marketplace');

  return {
    body: template.render(<MarketplacePage
      linkTo={ctx.linkTo}
      services={services}
    />),
  };
}

export async function viewService(ctx: IContext, params: IParameters): Promise<IResponse> {
  const cf = new CloudFoundryClient({
    accessToken: ctx.token.accessToken,
    apiEndpoint: ctx.app.cloudFoundryAPI,
    logger: ctx.app.logger,
  });

  const [rawService, plans] = await Promise.all([
    cf.v3service(params.serviceGUID),
    cf.servicePlans(params.serviceGUID),
  ]);

  const service = {
    ...rawService,
    additionalMetadata: JSON.parse(rawService.broker_service_offering_metadata),
  };

  const template = new Template(
    ctx.viewContext,
    `Marketplace - Service - ${service.additionalMetadata.displayName || service.name}`,
  );

  template.breadcrumbs = [
    {
      text: 'Marketplace',
      href: ctx.linkTo('marketplace.view'),
    },
    {
      text: service.additionalMetadata.displayName || service.name,
    },
  ];

  return {
    body: template.render(<MarketplaceItemPage
      service={service}
      plans={plans}
    />),
  };
}
