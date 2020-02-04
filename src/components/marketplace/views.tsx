import React, { ReactElement } from 'react';

import { CommandLineAlternative, Tick } from '../../layouts/partials';
import { IServicePlan, IV3Service } from '../../lib/cf/types';
import { RouteLinker } from '../app';

import cloudLogo from './icons/cloud.png';
import cdnLogo from './icons/cdn.png';
import elasticsearchLogo from './icons/elasticsearch.png';
import influxdbLogo from './icons/influxdb.png';
import mysqlLogo from './icons/mysql.png';
import postgresLogo from './icons/postgres.png';
import redisLogo from './icons/redis.png';
import s3Logo from './icons/s3.png';

interface IV3ServiceEnchanced extends IV3Service {
  readonly additionalMetadata: {
    readonly [key: string]: any;
  };
}

interface IMarketplaceItemPageProperties {
  readonly service: IV3ServiceEnchanced;
  readonly plans: ReadonlyArray<IServicePlan>;
}

interface IMarketplacePageProperties {
  readonly linkTo: RouteLinker;
  readonly services: ReadonlyArray<IV3ServiceEnchanced>;
}

interface IServiceDetails {
  readonly [serviceLabel: string]: {
    readonly description?: string;
    readonly image: string;
    readonly imageTitle: string;
    readonly usecase?: ReadonlyArray<string>;
  };
}

interface IPlanProperties {
  readonly plan: IServicePlan;
}

interface ILogoProperties {
  readonly image: string;
  readonly imageTitle: string;
  readonly label?: string;
}

interface IPlanTabProperties {
  readonly plans: ReadonlyArray<IServicePlan>;
}

interface ITabProperties {
  readonly active: boolean;
  readonly href: string;
  readonly children: string;
}

const serviceDetails: IServiceDetails = {
  'cdn-route': {
    description: `Content Distribution Network (CDN) is a geographically distributed network of proxy servers and their 
    data centers. The goal is to provide high availability and high performance by distributing the service spatially
    relative to end-users.`,
    image: cdnLogo,
    imageTitle: 'Amazon Web Services - CloudFront - Official Logo',
    usecase: [
      'Bring your own Domain',
      'Highly available static content distribution',
    ],
  },
  'postgres': {
    description: `Postgres, is a free and open-source relational database management system (RDBMS) emphasizing
    extensibility and technical standards compliance. It is designed to handle a range of workloads, from single
    machines to data warehouses or Web services with many concurrent users.`,
    image: postgresLogo,
    imageTitle: 'PostgreSQL - Official Logo',
  },
  'mysql': {
    description: 'MySQL is an open-source relational database management system (RDBMS).',
    image: mysqlLogo,
    imageTitle: 'MySQL - Official Logo',
  },
  'aws-s3-bucket': {
    description: `Amazon Simple Storage Service (AWS S3) is a service offered by Amazon Web Services (AWS) that provides
    object storage through a web service interface.`,
    image: s3Logo,
    imageTitle: 'Amazon Web Services - S3 Bucket - Official Logo',
    usecase: [
      'Assets storage',
      'File Uploads persistance',
    ],
  },
  'redis': {
    description: `Redis is an in-memory data structure project implementing a distributed, in-memory key-value database
    with optional durability. Redis supports different kinds of abstract data structures, such as strings, lists, maps,
    sets, sorted sets, HyperLogLogs, bitmaps, streams, and spatial indexes.`,
    image: redisLogo,
    imageTitle: 'Redis - Official Logo',
    usecase: [
      'Cache',
      'Session management',
      'Queues',
    ],
  },
  'elasticsearch': {
    description: `Elasticsearch is a search engine based on the Lucene library. It provides a distributed,
    multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents.`,
    image: elasticsearchLogo,
    imageTitle: 'ElasticSearch - Official Logo',
    usecase: [
      'Search engines',
    ],
  },
  'influxdb': {
    description: `InfluxDB is optimized for fast, high-availability storage and retrieval of time series data in fields
    such as operations monitoring, application metrics, Internet of Things sensor data, and real-time analytics. It also
    has support for processing data from Graphite.`,
    image: influxdbLogo,
    imageTitle: 'InfluxDB - Official Logo',
    usecase: [
      'Metrics',
      'Prometheus',
      'Grafana',
    ],
  },
};

function planStorage(plan: IServicePlan): string {
  const matches = plan.entity.description.match(/([0-9]+[A-Z]+) Storage/);

  return (matches && matches[1]) || 'N/A';
}

function planConnections(plan: IServicePlan): string {
  const matches = plan.entity.description.match(/([0-9]+) Concurrent Connections/);

  return (matches && matches[1]) || 'N/A';
}

function planCost(plan: IServicePlan): string {
  const metadata = plan.entity.extra?.costs;
  if (!metadata) {
    return 'free';
  }

  const cost = metadata[0]?.amount.usd;
  const period = metadata[0]?.unit.toLowerCase();

  return `$${cost} per ${period}`;
}

export function Tab(props: ITabProperties): ReactElement {
  const classess = ['govuk-tabs__list-item'];
  if (props.active) {
    classess.push('govuk-tabs__list-item--selected');
  }

  return (
    <li className={classess.join(' ')}>
      <a href={props.href} className="govuk-link">
        {props.children}
      </a>
    </li>
  );
}

export function PlanTab(props: IPlanTabProperties): ReactElement {
  return (
    <div className="govuk-tabs" data-module="govuk-tabs">
      <h2 className="govuk-tabs__title">Contents</h2>

      <ul className="govuk-tabs__list">
        <Tab
          active={false}
          href="#"
        >
          Version 11
        </Tab>
        <Tab
          active={true}
          href="#"
        >
          Version 10
        </Tab>
        <Tab
          active={false}
          href="#"
        >
          Version 9
        </Tab>
      </ul>

      <section className="govuk-tabs__panel">
        <table className="govuk-table">
          <caption className="govuk-table__caption">Version 10</caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">Plan</th>
              <th scope="col" className="govuk-table__header">Highly Available</th>
              <th scope="col" className="govuk-table__header">Backups</th>
              <th scope="col" className="govuk-table__header">Encrypted</th>
              <th scope="col" className="govuk-table__header govuk-table__header--numeric">Connections</th>
              <th scope="col" className="govuk-table__header govuk-table__header--numeric">Space</th>
              <th scope="col" className="govuk-table__header govuk-table__header--numeric">Price</th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {props.plans.map((plan, index) => (
              <tr className="govuk-table__row" key={index}>
                <th scope="row" className="govuk-table__header">{plan.entity.name}</th>
                <td className="govuk-table__cell">{plan.entity.name.includes('ha') ? <Tick /> : null}</td>
                <td className="govuk-table__cell">
                  {!plan.entity.description.includes('NOT BACKED UP') ? <Tick /> : null}
                </td>
                <td className="govuk-table__cell">
                  {plan.entity.description.includes('Encrypted') ? <Tick /> : null}
                </td>
                <td className="govuk-table__cell govuk-table__cell--numeric">
                  {planConnections(plan)}
                </td>
                <td className="govuk-table__cell govuk-table__cell--numeric">
                  {planStorage(plan)}
                </td>
                <td className="govuk-table__cell govuk-table__cell--numeric">
                  {planCost(plan)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Logo(props: ILogoProperties): ReactElement {
  return (
    <figure>
      <div>
        <img src={props.image} alt={props.imageTitle} />
      </div>

      <figcaption>{props.label}</figcaption>
    </figure>
  );
}

export function MarketplaceItemPage(props: IMarketplaceItemPageProperties): ReactElement {
  return (
    <div className="govuk-grid-row service-details">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">
          <span className="govuk-caption-xl">GOV.UK PaaS Marketplace</span>
          {props.service.additionalMetadata.displayName || props.service.name}
        </h1>

        <p className="govuk-body">{serviceDetails[props.service.name]?.description || props.service.description}</p>

        <dl className="govuk-summary-list govuk-summary-list--no-border">
          {props.service.additionalMetadata.providerDisplayName ? <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Provider</dt>
            <dd className="govuk-summary-list__value">
              {props.service.additionalMetadata.providerDisplayName}
            </dd>
          </div> : null}

          {serviceDetails[props.service.name]?.usecase?.length ? <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Usecase</dt>
            <dd className="govuk-summary-list__value">
              <ul className="govuk-list">
                {serviceDetails[props.service.name]?.usecase.map((usecase, index) => <li key={index}>{usecase}</li>)}
              </ul>
            </dd>
          </div> : null}

          {props.service.additionalMetadata.documentationUrl ? <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Documentation</dt>
            <dd className="govuk-summary-list__value">
              <a href={props.service.additionalMetadata.documentationUrl} className="govuk-link">
                {props.service.additionalMetadata.documentationUrl}
              </a>
            </dd>
          </div> : null}

          {props.service.tags.length ? <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Tags</dt>
            <dd className="govuk-summary-list__value">
              <ul className="govuk-list">
                {props.service.tags.map((tag, index) => <li key={index}>{tag}</li>)}
              </ul>
            </dd>
          </div> : null}
        </dl>
      </div>

      <div className="govuk-grid-column-one-third">
        <Logo
          image={serviceDetails[props.service.name].image || cloudLogo}
          imageTitle={`${serviceDetails[props.service.name].imageTitle || 'Missing service logo'}`}
        />
      </div>

      <div className="govuk-grid-column-full">
        <PlanTab plans={props.plans.filter(plan => plan.entity.name.includes('10'))} />

        <CommandLineAlternative>{`cf marketplace -s ${props.service.name}`}</CommandLineAlternative>
      </div>
    </div>
  );
}

export function MarketplacePage(props: IMarketplacePageProperties): ReactElement {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">GOV.UK PaaS Marketplace</h1>

        <p className="govuk-body">
          List of services currently supported by GOV.UK PaaS.
        </p>

        <p className="govuk-body">
          Find out more about each service by going through to the description page.
        </p>

        <ul className="govuk-list marketplace-list">
          {props.services.map((service, index) => (
            <li key={index}>
              <a href={props.linkTo('marketplace.service', {
                serviceGUID: service.guid,
              })} className="govuk-link">
                <Logo
                  image={serviceDetails[service.name].image || cloudLogo}
                  imageTitle={`${serviceDetails[service.name].imageTitle || 'Missing service logo'}`}
                  label={service.additionalMetadata.displayName || service.name}
                />
              </a>
            </li>
          ))}
        </ul>

        <CommandLineAlternative>cf marketplace</CommandLineAlternative>
      </div>
    </div>
  );
}
