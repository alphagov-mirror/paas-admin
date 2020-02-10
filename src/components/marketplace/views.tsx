import React, { ReactElement } from 'react';

import { CommandLineAlternative, Tick } from '../../layouts/partials';
import { IServicePlan, IV3Service } from '../../lib/cf/types';
import { RouteLinker } from '../app';

import cloudLogo from './icons/cloud.png';
import cdnLogo from './icons/cdn.png';
import elasticsearchLogo from './icons/elasticsearch.svg';
import influxdbLogo from './icons/influxdb.png';
import mysqlLogo from './icons/mysql.png';
import postgresLogo from './icons/postgres.png';
import redisLogo from './icons/redis.png';
import s3Logo from './icons/s3.png';

interface IV3ServiceEnchanced extends IV3Service {
  readonly parameters: {
    readonly [key: string]: any;
  };
}

interface IEnchancedServicePlan extends IServicePlan {
  readonly parameters: {
    readonly [key: string]: any;
  };
}

interface ICustomMetadata {
  readonly backups?: boolean;
  readonly bullets?: ReadonlyArray<string>;
  readonly concurrentConnections?: number;
  readonly costs?: ReadonlyArray<{
    readonly amount: {
      readonly usd: number;
    };
    readonly unit: string;
  }>;
  readonly displayName?: string;
  readonly encrypted?: boolean;
  readonly highlyAvailable?: boolean;
  readonly memory?: {
    readonly amount: number;
    readonly unit: string;
  };
  readonly storage?: {
    readonly amount: number;
    readonly unit: string;
  };
}

interface IMarketplaceItemPageProperties {
  readonly linkTo: RouteLinker;
  readonly service: IV3ServiceEnchanced;
  readonly plans: ReadonlyArray<IEnchancedServicePlan>;
  readonly version?: string;
  readonly versions: ReadonlyArray<string>;
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

interface ILogoProperties {
  readonly image: string;
  readonly imageTitle: string;
  readonly label?: string;
}

interface IPlanTabProperties {
  readonly linkTo: RouteLinker;
  readonly plans: ReadonlyArray<IEnchancedServicePlan>;
  readonly serviceGUID: string;
  readonly version?: string;
  readonly versions: ReadonlyArray<string>;
}

interface ITabProperties {
  readonly active: boolean;
  readonly href: string;
  readonly children: string;
}

interface ITableRowProperties {
  readonly data: ICustomMetadata;
  readonly name: string;
  readonly canBeHighlyAvailable: boolean;
  readonly providesBackups: boolean;
  readonly canBeEncrypted: boolean;
  readonly limitsMemory: boolean;
  readonly limitsStorage: boolean;
  readonly hasCosts: boolean;
  readonly limitsConcurrentConnections: boolean;
}

const serviceDetails: IServiceDetails = {
  'cdn-route': {
    image: cdnLogo,
    imageTitle: 'Amazon Web Services - CloudFront - Official Logo',
  },
  'postgres': {
    image: postgresLogo,
    imageTitle: 'PostgreSQL - Official Logo',
  },
  'mysql': {
    image: mysqlLogo,
    imageTitle: 'MySQL - Official Logo',
  },
  'aws-s3-bucket': {
    image: s3Logo,
    imageTitle: 'Amazon Web Services - S3 Bucket - Official Logo',
  },
  'redis': {
    image: redisLogo,
    imageTitle: 'Redis - Official Logo',
  },
  'elasticsearch': {
    image: elasticsearchLogo,
    imageTitle: 'ElasticSearch - Official Logo',
  },
  'influxdb': {
    image: influxdbLogo,
    imageTitle: 'InfluxDB - Official Logo',
  },
};

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

function TableRow(props: ITableRowProperties): ReactElement {
  const costs = props.data.costs || [];

  return (
    <tr className="govuk-table__row">
      <th scope="row" className="govuk-table__header">{props.name}</th>

      {props.canBeHighlyAvailable
        ? <td className="govuk-table__cell">
            {props.data.highlyAvailable ? <Tick /> : null}
          </td>
        : null}
      {props.providesBackups
        ? <td className="govuk-table__cell">
            {props.data.backups ? <Tick /> : null}
          </td>
        : null}
      {props.canBeEncrypted
        ? <td className="govuk-table__cell">
            {props.data.encrypted ? <Tick /> : null}
          </td>
        : null}
      {props.limitsConcurrentConnections
        ? <td className="govuk-table__cell govuk-table__cell--numeric">
            {props.data.concurrentConnections}
          </td>
        : null}
      {props.limitsMemory
        ? <td className="govuk-table__cell govuk-table__cell--numeric">
            {props.data.memory?.amount}
            {props.data.memory?.unit}
          </td>
        : null}
      {props.limitsStorage
        ? <td className="govuk-table__cell govuk-table__cell--numeric">
            {props.data.storage?.amount}
            {props.data.storage?.unit}
          </td>
        : null}
      {props.hasCosts
        ? <td className="govuk-table__cell govuk-table__cell--numeric">
            {costs[0]?.amount.usd}
            {costs[0]?.unit}
          </td>
        : null}
    </tr>
  );
}

export function PlanTab(props: IPlanTabProperties): ReactElement {
  const canBeHA = props.plans.some(plan => plan?.parameters.AdditionalMetadata?.highlyAvailable !== undefined);
  const providesBackups = props.plans.some(plan => plan?.parameters.AdditionalMetadata?.backups !== undefined);
  const canBeEncrypted = props.plans.some(plan => plan?.parameters.AdditionalMetadata?.encrypted !== undefined);
  const limitsMemory = props.plans.some(plan => plan?.parameters.AdditionalMetadata?.memory !== undefined);
  const limitsStorage = props.plans.some(plan => plan?.parameters.AdditionalMetadata?.storage !== undefined);
  const hasCosts = props.plans.some(plan => plan?.parameters.AdditionalMetadata?.costs !== undefined);
  const limitsCC = props.plans.some(plan => plan?.parameters.AdditionalMetadata?.concurrentConnections !== undefined);

  return (
    <div className="govuk-tabs" data-module="govuk-tabs">
      <h2 className="govuk-tabs__title">Contents</h2>

      <ul className="govuk-tabs__list">
        {props.versions.map((version, index) => (
          <Tab key={index} active={version === props.version} href={props.linkTo('marketplace.service', {
            serviceGUID: props.serviceGUID,
            version,
          })}>
            {`Version ${version}`}
          </Tab>
        ))}
      </ul>

      <section className="govuk-tabs__panel">
        <table className="govuk-table">
          <caption className="govuk-table__caption">Version {props.version}</caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">Plan</th>
              {canBeHA
                ? <th scope="col" className="govuk-table__header">Highly Available</th>
                : null}
              {providesBackups
                ? <th scope="col" className="govuk-table__header">Backups</th>
                : null}
              {canBeEncrypted
                ? <th scope="col" className="govuk-table__header">Encrypted</th>
                : null}
              {limitsCC
                ? <th scope="col" className="govuk-table__header govuk-table__header--numeric">Connections</th>
                : null}
              {limitsMemory
                ? <th scope="col" className="govuk-table__header govuk-table__header--numeric">Memory</th>
                : null}
              {limitsStorage
                ? <th scope="col" className="govuk-table__header govuk-table__header--numeric">Space</th>
                : null}
              {hasCosts
                ? <th scope="col" className="govuk-table__header govuk-table__header--numeric">Price</th>
                : null}
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {props.plans.map((plan, index) => (
              <TableRow key={index}
                data={plan.parameters.AdditionalMetadata || {}}
                name={plan.parameters.displayName || plan.entity.name}
                canBeHighlyAvailable={canBeHA}
                providesBackups={providesBackups}
                canBeEncrypted={canBeEncrypted}
                limitsMemory={limitsMemory}
                limitsStorage={limitsStorage}
                hasCosts={hasCosts}
                limitsConcurrentConnections={limitsCC}
              />
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
          {props.service.parameters.displayName || props.service.name}
        </h1>

        <p className="govuk-body">{props.service.parameters.longDescription}</p>

        <dl className="govuk-summary-list govuk-summary-list--no-border">
          {props.service.parameters.providerDisplayName ? <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Provider</dt>
            <dd className="govuk-summary-list__value">
              {props.service.parameters.providerDisplayName}
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

          {props.service.parameters.documentationUrl ? <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Documentation</dt>
            <dd className="govuk-summary-list__value">
              <ul className="govuk-list">
                <li>
                  <a href={props.service.parameters.documentationUrl} className="govuk-link">
                    {props.service.parameters.documentationUrl}
                  </a>
                </li>
                {props.service.parameters.AdditionalMetadata?.otherDocumentation?.map(
                  (docs: string, index: number) => (
                    <li key={index}>
                      <a href={docs} className="govuk-link">{docs}</a>
                    </li>
                  ))}
              </ul>
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
        <PlanTab
          linkTo={props.linkTo}
          plans={props.version
            ? props.plans.filter(plan => plan.parameters.AdditionalMetadata.version === props.version)
            : props.plans}
          serviceGUID={props.service.guid}
          version={props.version}
          versions={props.versions}
        />

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
                  image={serviceDetails[service.name]?.image || cloudLogo}
                  imageTitle={`${serviceDetails[service.name]?.imageTitle || 'Missing service logo'}`}
                  label={service.parameters.displayName || service.name}
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
