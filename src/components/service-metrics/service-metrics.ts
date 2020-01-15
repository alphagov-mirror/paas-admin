import * as cw from '@aws-sdk/client-cloudwatch-node';
import * as rg from '@aws-sdk/client-resource-groups-tagging-api-node';

import { mapValues } from 'lodash';
import moment from 'moment';
import CloudFoundryClient from '../../lib/cf';
import {
  CloudFrontMetricDataGetter,
  cloudfrontMetricNames,

  ElastiCacheMetricDataGetter,
  elasticacheMetricNames,

  ElasticsearchMetricDataGetter,
  elasticsearchMetricNames,

  RDSMetricDataGetter,
  rdsMetricNames,
} from '../../lib/metric-data-getters';
import { IMetricSerie } from '../../lib/metrics';
import roundDown from '../../lib/moment/round';
import PromClient from '../../lib/prom';
import { IParameters, IResponse } from '../../lib/router';
import { IContext } from '../app';
import { CLOUD_CONTROLLER_ADMIN, CLOUD_CONTROLLER_GLOBAL_AUDITOR, CLOUD_CONTROLLER_READ_ONLY_ADMIN } from '../auth';
import { fromOrg, IBreadcrumb } from '../breadcrumbs';
import { drawLineGraph, summariseSerie } from '../charts/line-graph';
import { UserFriendlyError } from '../errors';

import cloudfrontMetricsTemplate from './cloudfront-service-metrics-csv.njk';
import cloudfrontServiceMetricsTemplate from './cloudfront-service-metrics.njk';

import elasticacheMetricsTemplate from './elasticache-service-metrics-csv.njk';
import elasticacheServiceMetricsTemplate from './elasticache-service-metrics.njk';

import elasticsearchMetricsTemplate from './elasticsearch-service-metrics-csv.njk';
import elasticsearchServiceMetricsTemplate from './elasticsearch-service-metrics.njk';

import rdsMetricsTemplate from './rds-service-metrics-csv.njk';
import rdsServiceMetricsTemplate from './rds-service-metrics.njk';

import unsupportedServiceMetricsTemplate from './unsupported-service-metrics.njk';
import { getPeriod } from './utils';

interface IRange {
  readonly period: moment.Duration;
  readonly rangeStart: moment.Moment;
  readonly rangeStop: moment.Moment;
}

export async function resolveServiceMetrics(ctx: IContext, params: IParameters): Promise<IResponse> {
  const rangeStop = moment();
  const timeRanges: {[key: string]: moment.Moment} = {
    '1h': rangeStop.clone().subtract(1, 'hour'),
    '3h': rangeStop.clone().subtract(3, 'hours'),
    '12h': rangeStop.clone().subtract(12, 'hours'),
    '24h': rangeStop.clone().subtract(24, 'hours'),
    '7d': rangeStop.clone().subtract(7, 'days'),
    '30d': rangeStop.clone().subtract(30, 'days'),
  };
  const rangeStart = timeRanges[params.offset] || timeRanges['24h'];

  return {
    status: 302,
    redirect: ctx.linkTo('admin.organizations.spaces.services.metrics.view', {
      organizationGUID: params.organizationGUID,
      spaceGUID: params.spaceGUID,
      serviceGUID: params.serviceGUID,
      rangeStart: rangeStart.format('YYYY-MM-DD[T]HH:mm'),
      rangeStop: rangeStop.format('YYYY-MM-DD[T]HH:mm'),
    }),
  };
}

export async function viewServiceMetrics(ctx: IContext, params: IParameters): Promise<IResponse> {
  const cf = new CloudFoundryClient({
    accessToken: ctx.token.accessToken,
    apiEndpoint: ctx.app.cloudFoundryAPI,
    logger: ctx.app.logger,
  });

  const isAdmin = ctx.token.hasAnyScope(
    CLOUD_CONTROLLER_ADMIN,
    CLOUD_CONTROLLER_READ_ONLY_ADMIN,
    CLOUD_CONTROLLER_GLOBAL_AUDITOR,
  );

  if (!params.rangeStart || !params.rangeStop) {
    return {
      status: 302,
      redirect: ctx.linkTo(
        'admin.organizations.spaces.services.metrics.view', {
          organizationGUID: params.organizationGUID,
          spaceGUID: params.spaceGUID,
          serviceGUID: params.serviceGUID,
          rangeStart: moment().subtract(24, 'hours').format('YYYY-MM-DD[T]HH:mm'),
          rangeStop: moment().format('YYYY-MM-DD[T]HH:mm'),
        }),
    };
  }

  const {rangeStart, rangeStop, period} = parseRange(params.rangeStart, params.rangeStop);

  const [isManager, isBillingManager, userProvidedServices, space, organization] = await Promise.all([
    cf.hasOrganizationRole(params.organizationGUID, ctx.token.userID, 'org_manager'),
    cf.hasOrganizationRole(params.organizationGUID, ctx.token.userID, 'billing_manager'),
    cf.userServices(params.spaceGUID),
    cf.space(params.spaceGUID),
    cf.organization(params.organizationGUID),
  ]);

  const isUserProvidedService = userProvidedServices.some(s => s.metadata.guid === params.serviceGUID);

  const service = isUserProvidedService ?
  await cf.userServiceInstance(params.serviceGUID) :
  await cf.serviceInstance(params.serviceGUID);

  const serviceLabel = isUserProvidedService ? 'User Provided Service'
  : (await cf.service(service.entity.service_guid)).entity.label;

  const breadcrumbs: ReadonlyArray<IBreadcrumb> = fromOrg(ctx, organization, [
    {
      text: space.entity.name,
      href: ctx.linkTo('admin.organizations.spaces.services.list', {
        organizationGUID: organization.metadata.guid,
        spaceGUID: space.metadata.guid,
      }),
    },
    { text: service.entity.name },
  ]);

  const defaultTemplateParams = {
    routePartOf: ctx.routePartOf,
    linkTo: ctx.linkTo,
    context: ctx.viewContext,
    organization,
    service,
    serviceLabel,
    space,
    isAdmin,
    isBillingManager,
    isManager,
    breadcrumbs,
    period,
    rangeStart,
    rangeStop,
    downloadLink: ctx.linkTo('admin.organizations.spaces.services.metrics.download', {
      organizationGUID: organization.metadata.guid,
      spaceGUID: space.metadata.guid,
      serviceGUID: service.metadata.guid,
      rangeStart,
      rangeStop,
    }),
  };

  let template;
  let metricSeries;

  switch (serviceLabel) {
    case 'User Provided Service':
      return {
        body: unsupportedServiceMetricsTemplate.render(defaultTemplateParams),
      };
    case 'cdn-route':
      const cloudfrontMetricSeries = await new CloudFrontMetricDataGetter(
        new cw.CloudWatchClient({
          region: 'us-east-1',
          endpoint: ctx.app.awsCloudwatchEndpoint,
        }),
        new rg.ResourceGroupsTaggingAPIClient({
          region: 'us-east-1',
          endpoint: ctx.app.awsResourceTaggingAPIEndpoint,
        }),
      ).getData(cloudfrontMetricNames, params.serviceGUID, period, rangeStart, rangeStop);

      template = cloudfrontServiceMetricsTemplate;
      metricSeries = cloudfrontMetricSeries;

      break;
    case 'mysql':
    case 'postgres':
      const rdsMetricSeries = await new RDSMetricDataGetter(
        new cw.CloudWatchClient({
          region: ctx.app.awsRegion,
          endpoint: ctx.app.awsCloudwatchEndpoint,
        }),
      ).getData(rdsMetricNames, params.serviceGUID, period, rangeStart, rangeStop);

      template = rdsServiceMetricsTemplate;
      metricSeries = rdsMetricSeries;

      break;
    case 'redis':
      const elasticacheMetricSeries = await new ElastiCacheMetricDataGetter(
        new cw.CloudWatchClient({
          region: ctx.app.awsRegion,
          endpoint: ctx.app.awsCloudwatchEndpoint,
        }),
      ).getData(elasticacheMetricNames, params.serviceGUID, period, rangeStart, rangeStop);

      template = elasticacheServiceMetricsTemplate;
      metricSeries = elasticacheMetricSeries;

      break;
    case 'elasticsearch':
      const elasticsearchMetricSeries = await new ElasticsearchMetricDataGetter(
        new PromClient(
          ctx.app.prometheusEndpoint,
          ctx.app.prometheusUsername,
          ctx.app.prometheusPassword,
          ctx.app.logger,
        ),
      ).getData(elasticsearchMetricNames, params.serviceGUID, period, rangeStart, rangeStop);

      template = elasticsearchServiceMetricsTemplate;
      metricSeries = elasticsearchMetricSeries;

      break;
    default:
      throw new Error(`Unrecognised service label ${serviceLabel}`);
  }

  const metricSummaries = mapValues(metricSeries, s => s.map(summariseSerie));

  return {
    body: template.render({
      ...defaultTemplateParams,
      drawLineGraph,
      metricSeries,
      metricSummaries,
    }),
  };
}

export async function downloadServiceMetrics(ctx: IContext, params: IParameters): Promise<IResponse> {
  const cf = new CloudFoundryClient({
    accessToken: ctx.token.accessToken,
    apiEndpoint: ctx.app.cloudFoundryAPI,
    logger: ctx.app.logger,
  });

  const isAdmin = ctx.token.hasAnyScope(
    CLOUD_CONTROLLER_ADMIN,
    CLOUD_CONTROLLER_READ_ONLY_ADMIN,
    CLOUD_CONTROLLER_GLOBAL_AUDITOR,
  );

  if (!params.rangeStart || !params.rangeStop || !params.metric || !params.units) {
    return {
      status: 302,
      redirect: ctx.linkTo(
        'admin.organizations.spaces.services.metrics.view', {
          organizationGUID: params.organizationGUID,
          spaceGUID: params.spaceGUID,
          serviceGUID: params.serviceGUID,
          rangeStart: moment().subtract(24, 'hours').format('YYYY-MM-DD[T]HH:mm'),
          rangeStop: moment().format('YYYY-MM-DD[T]HH:mm'),
        }),
    };
  }

  const {rangeStart, rangeStop, period} = parseRange(params.rangeStart, params.rangeStop);

  const [isManager, isBillingManager, userProvidedServices, space, organization] = await Promise.all([
    cf.hasOrganizationRole(params.organizationGUID, ctx.token.userID, 'org_manager'),
    cf.hasOrganizationRole(params.organizationGUID, ctx.token.userID, 'billing_manager'),
    cf.userServices(params.spaceGUID),
    cf.space(params.spaceGUID),
    cf.organization(params.organizationGUID),
  ]);

  const isUserProvidedService = userProvidedServices.some(s => s.metadata.guid === params.serviceGUID);

  const service = isUserProvidedService ?
  await cf.userServiceInstance(params.serviceGUID) :
  await cf.serviceInstance(params.serviceGUID);

  const serviceLabel = isUserProvidedService ? 'User Provided Service'
  : (await cf.service(service.entity.service_guid)).entity.label;

  const defaultTemplateParams = {
    routePartOf: ctx.routePartOf,
    linkTo: ctx.linkTo,
    context: ctx.viewContext,
    organization,
    service,
    serviceLabel,
    space,
    isAdmin,
    isBillingManager,
    isManager,
    period,
    rangeStart,
    rangeStop,
  };

  const name = `${serviceLabel}-metrics-${params.metric}-${params.rangeStart}-${params.rangeStop}.csv`;

  let template: typeof import('*.njk');
  let metricData: ReadonlyArray<IMetricSerie> | undefined;

  switch (serviceLabel) {
    case 'cdn-route':
      const cloudfrontMetricSeries = await new CloudFrontMetricDataGetter(
        new cw.CloudWatchClient({
          region: 'us-east-1',
          endpoint: ctx.app.awsCloudwatchEndpoint,
        }),
        new rg.ResourceGroupsTaggingAPIClient({
          region: 'us-east-1',
          endpoint: ctx.app.awsResourceTaggingAPIEndpoint,
        }),
      ).getData([params.metric], params.serviceGUID, period, rangeStart, rangeStop);

      template = cloudfrontMetricsTemplate;
      metricData = cloudfrontMetricSeries[params.metric];

      break;
    case 'mysql':
    case 'postgres':
      const rdsMetricSeries = await new RDSMetricDataGetter(
        new cw.CloudWatchClient({
          region: ctx.app.awsRegion,
          endpoint: ctx.app.awsCloudwatchEndpoint,
        }),
      ).getData([params.metric], params.serviceGUID, period, rangeStart, rangeStop);

      template = rdsMetricsTemplate;
      metricData = rdsMetricSeries[params.metric];

      break;
    case 'redis':

      const elasticacheMetricSeries = await new ElastiCacheMetricDataGetter(
        new cw.CloudWatchClient({
          region: ctx.app.awsRegion,
          endpoint: ctx.app.awsCloudwatchEndpoint,
        }),
      ).getData([params.metric], params.serviceGUID, period, rangeStart, rangeStop);

      template = elasticacheMetricsTemplate;
      metricData = elasticacheMetricSeries[params.metric];

      break;
    case 'elasticsearch':

      const elasticsearchMetricSeries = await new ElasticsearchMetricDataGetter(
        new PromClient(
          ctx.app.prometheusEndpoint,
          ctx.app.prometheusUsername,
          ctx.app.prometheusPassword,
          ctx.app.logger,
        ),
      ).getData([params.metric], params.serviceGUID, period, rangeStart, rangeStop);

      template = elasticsearchMetricsTemplate;
      metricData = elasticsearchMetricSeries[params.metric];

      break;
    default:
      throw new Error(`Unrecognised service label ${serviceLabel}`);
  }

  if (typeof metricData === 'undefined') {
    throw new Error(`Did not get metric ${params.metric} for ${serviceLabel}`);
  }

  return {
    mimeType: 'text/csv',
    download: {
      name,
      data: template.render({
        ...defaultTemplateParams,
        units: params.units,
        metricData,
      }),
    },
  };
}

function parseRange(start: string, stop: string): IRange {
  const rangeStart = moment(start);
  const rangeStop = moment(stop);
  if (rangeStart.isBefore(rangeStop.clone().subtract(1, 'year').subtract(1, 'week'))) {
    throw new UserFriendlyError('Invalid time range provided. Cannot handle more than a year of metrics');
  }

  if (rangeStop.isBefore(moment().subtract(1, 'years').subtract(1, 'week')) || rangeStart.isBefore(moment().subtract(1, 'years').subtract(1, 'week'))) {
    throw new UserFriendlyError('Invalid time range provided. Cannot handle over a year old metrics');
  }

  if (rangeStop.isBefore(rangeStart)) {
    throw new UserFriendlyError('Invalid time range provided');
  }

  const period = moment.duration(getPeriod(rangeStart, rangeStop), 'seconds');

  return { period, rangeStart: roundDown(rangeStart, period), rangeStop: roundDown(rangeStop, period) };
}
