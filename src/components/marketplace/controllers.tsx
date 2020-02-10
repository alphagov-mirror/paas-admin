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
    parameters: JSON.parse(service.broker_service_offering_metadata),
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

  const [rawService, rawPlans] = await Promise.all([
    cf.v3service(params.serviceGUID),
    cf.servicePlans(params.serviceGUID),
  ]);

  const service = {
    ...rawService,
    parameters: JSON.parse(rawService.broker_service_offering_metadata),
  };

  const plans = rawPlans
    .filter(plan => plan.entity.active)
    .map(plan => ({
      ...plan,
      parameters: JSON.parse(plan.entity.extra),
    }));

  const versions = [...new Set(plans.map(plan => plan.parameters.AdditionalMetadata?.version))]
    .sort()
    .reverse();

  const template = new Template(
    ctx.viewContext,
    `Marketplace - Service - ${service.parameters.displayName || service.name}`,
  );

  template.breadcrumbs = [
    {
      text: 'Marketplace',
      href: ctx.linkTo('marketplace.view'),
    },
    {
      text: service.parameters.displayName || service.name,
    },
  ];

  return {
    body: template.render(<MarketplaceItemPage
      linkTo={ctx.linkTo}
      service={service}
      plans={plans}
      version={params.version || versions[0]}
      versions={versions}
    />),
  };
}
