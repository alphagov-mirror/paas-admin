import { groupBy, mapValues, values } from 'lodash';
import React, { Fragment, ReactElement } from 'react';

import { bytesToHuman } from '../../layouts/helpers';
import { KIBIBYTE } from '../../layouts/constants';

export interface IQuote {
  readonly events: ReadonlyArray<IBillableEvent>;
  readonly exVAT: number;
  readonly incVAT: number;
}

export interface IResourceItem {
  readonly memoryInMB: string;
  readonly numberOfNodes: string;
  readonly planGUID: string;
  readonly storageInMB: string;
}

export interface ICalculatorState {
  readonly monthOfEstimate: string;
  readonly rangeStart: string;
  readonly rangeStop: string;
  readonly items: ReadonlyArray<IResourceItem>;
  readonly plans: ReadonlyArray<IPricingPlan>;
}

interface IStateFieldsProperties {
  readonly items: ReadonlyArray<IResourceItem>;
  readonly rangeStart: string;
  readonly rangeStop: string;
  readonly remove?: number;
}

interface ICalculatorPageProperties {
  readonly state: ICalculatorState;
  readonly quote: IQuote;
}

interface IPlansProperties {
  readonly plans: ReadonlyArray<IPricingPlan>;
  readonly serviceName: string;
  readonly state: ICalculatorState;
}

function orderPlans(planA: IPricingPlan, planB: IPricingPlan): number {
  const versionRegex = /\d+(.\d+)?/;
  const versionA: number = parseFloat((planA.planName.match(versionRegex) || ['0'])[0]);
  const versionB: number = parseFloat((planB.planName.match(versionRegex) || ['0'])[0]);

  // istanbul ignore next
  if (versionA !== versionB) {
    return versionB - versionA;
  }

  const sizeRegex = /xlarge|large|medium|small|tiny/;
  const sizeA: string = (planA.planName.match(sizeRegex) || ['unknown'])[0];
  const sizeB: string = (planB.planName.match(sizeRegex) || ['unknown'])[0];

  /* eslint-disable sort-keys */
  const sizeMapping: {readonly [key: string]: number} = {
    'xlarge': 5,
    'large': 4,
    'medium': 3,
    'small': 2,
    'tiny': 1,
    'unknown': 0,
  };
  /* eslint-enable sort-keys */

  const sizeValA: number = sizeMapping[sizeA] || 0;
  const sizeValB: number = sizeMapping[sizeB] || 0;

  return sizeValB - sizeValA;
}

function niceServiceName(planName: string): string {
  if (planName === 'postgres') {
    return 'Postgres';
  }

  const niceServiceNames: {readonly [key: string]: string} = {
    'app': 'Compute',
    'aws-s3-bucket': 'Amazon S3',
    'elasticsearch': 'Elasticsearch',
    'influxdb': 'InfluxDB',
    'mysql': 'MySQL',
    'postgres': 'Postgres',
    'redis': 'Redis',
  };

  return niceServiceNames[planName] || planName;
}

function appInstanceDescription(memoryInMB: number, instances: number): ReactElement {
  const precisionFactor = memoryInMB > KIBIBYTE && memoryInMB < KIBIBYTE * 2 ? 1 : 0;
  return <>
    {instances.toFixed(0)} app instance{instances === 1 ? '' : 's'}
    {' '}
    with
    {' '}
    {bytesToHuman(memoryInMB * 1024 * 1024, precisionFactor)} of memory
  </>;
}

function StateFields(props: IStateFieldsProperties): ReactElement {
  return (
    <>
      <input type="hidden" name="rangeStart" value={props.rangeStart} />
      <input type="hidden" name="rangeStop" value={props.rangeStop} />
      {props.items.map((item, index) =>
        props.remove !== index ? (
          <Fragment key={index}>
            <input
              type="hidden"
              name={`items[${index}][planGUID]`}
              value={item.planGUID}
            />
            <input
              type="hidden"
              name={`items[${index}][numberOfNodes]`}
              value={item.numberOfNodes}
            />
            <input
              type="hidden"
              name={`items[${index}][memoryInMB]`}
              value={item.memoryInMB}
            />
          </Fragment>
        ) : (
          <Fragment key={index}></Fragment>
        ),
      )}
    </>
  );
}

function Plans(props: IPlansProperties): ReactElement {
  return (
    <>
      {values(
        mapValues(groupBy(props.plans, 'serviceName'), (plans, serviceName) => (
          <tr key={serviceName} className="govuk-table__row">
            <td className="govuk-table__cell">
              {niceServiceName(props.serviceName)}
            </td>
            <td className="govuk-table__cell ">
              <form className="paas-service-selection" method="get">
                <StateFields
                  items={props.state.items}
                  rangeStart={props.state.rangeStart}
                  rangeStop={props.state.rangeStop}
                />
                {plans.length > 1 ? (
                  <div className="govuk-form-group">
                    <select
                      className="govuk-select govuk-!-width-full"
                      id={`service-${props.serviceName}`}
                      name={`items[${props.state.items.length}][planGUID]`}
                    >
                      {plans.slice().sort(orderPlans).map(plan => (
                        <option key={plan.planGUID} value={plan.planGUID}>
                          {niceServiceName(plan.planName)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <input
                      type="hidden"
                      name={`items[${props.state.items.length}][planGUID]`}
                      value={plans[0].planGUID}
                    />
                    {props.serviceName === 'app' ? (
                      <>
                        <div style={{ width: '46%' }}>
                          <div className="govuk-form-group">
                            <select
                              className="govuk-select govuk-!-width-full"
                              id={'nodes-app'}
                              name={`items[${props.state.items.length}][numberOfNodes]`}
                            >
                              <option value="1">1 app instance</option>
                              <option value="2">2 app instances</option>
                              <option value="3">3 app instances</option>
                              <option value="4">4 app instances</option>
                              <option value="8">8 app instances</option>
                              <option value="16">16 app instances</option>
                              <option value="32">32 app instances</option>
                              <option value="64">64 app instances</option>
                              <option value="128">128 app instances</option>
                            </select>
                          </div>
                        </div>
                        <div
                          style={{
                            float: 'left',
                            marginLeft: '14px',
                            width: '46%',
                          }}
                        >
                          <div className="govuk-form-group">
                            <select
                              className="govuk-select govuk-!-width-full"
                              id={'mem-app'}
                              name={`items[${props.state.items.length}][memoryInMB]`}
                            >
                              <option value="64">64 MiB of memory</option>
                              <option value="128">128 MiB of memory</option>
                              <option value="256">256 MiB of memory</option>
                              <option value="1024">1.0 GiB of memory</option>
                              <option value="1536">1.5 GiB of memory</option>
                              <option value="2048">2.0 GiB of memory</option>
                              <option value="4096">4.0 GiB of memory</option>
                              <option value="8192">8.0 GiB of memory</option>
                              <option value="16384">16.0 GiB of memory</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
                <button type="submit" className="paas-link-button">
                  + Add
                </button>
              </form>
            </td>
          </tr>
        )),
      )}
    </>
  );
}

export function CalculatorPage(props: ICalculatorPageProperties): ReactElement {
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <h1 className="paas-heading-l">Estimate your monthly costs</h1>

          <p className="paas-calculator-lede">
            Service teams usually run 3 environments, such as: <br />{' '}
            Production, Integration and Staging.
          </p>
        </div>
      </div>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds paas-service-list">
          <div className="scrollable-table-container">
            <table className="govuk-table">
            <thead>
              <th>Service</th>
              <th>Select options</th>
            </thead>
            <tbody className="govuk-table__body">
              {values(
                mapValues(
                  groupBy(props.state.plans, 'serviceName'),
                  (plans, serviceName) => (
                    <Plans
                      key={serviceName}
                      plans={plans}
                      serviceName={serviceName}
                      state={props.state}
                    />
                  ),
                ),
              )}
            </tbody>
          </table>
          </div>
        </div>

        <div className="govuk-grid-column-one-third paas-summary-section">
          <h2>Estimated cost</h2>

          <p>Prices excluding VAT:</p>

          <table>
            <caption>Services added</caption>
            {props.quote.events.map((event, index) => (
              <Fragment key={index}>
                <tr>
                  <td className="paas-service-heading">{niceServiceName(event.resourceType)}</td>
                  <td>
                    <form method="get">
                      <StateFields
                        items={props.state.items}
                        rangeStart={props.state.rangeStart}
                        rangeStop={props.state.rangeStop}
                        remove={index}
                      />
                      <button
                        className="paas-remove-button"
                        type="submit"
                        arria-label="Remove"
                      >
                        &times;
                      </button>
                    </form>
                  </td>
                </tr>
                <tr className="paas-service-items">
                  <td>
                    {
                      event.resourceType === 'app'
                      ? appInstanceDescription(event.memoryInMB, event.numberOfNodes)
                      : event.resourceName
                    }
                  </td>
                  <td className="paas-service-price">
                    £{event.price.exVAT.toFixed(2)}
                  </td>
                </tr>
              </Fragment>
            ))}
            {props.quote.exVAT > 0 ? (
              <tr className="paas-admin-fee">
                <td>Admin fee of 10%</td>
                <td className="paas-service-price">
                  £{((props.quote.exVAT / 100) * 10).toFixed(2)}
                </td>
              </tr>
            ) : (
              <></>
            )}
          </table>

          <p className="paas-total">Estimated monthly cost</p>

          <p className="paas-price">
            £{(props.quote.exVAT + (props.quote.exVAT / 100) * 10).toFixed(2)}
          </p>
          <p className="paas-month">per month</p>

          <details className="govuk-details" role="group">
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                Why costs may vary
              </span>
            </summary>
            <div className="govuk-details__text">
              <p>
                The estimate assumes constant usage at the levels provided by
                you.
              </p>
              <p>
                CPU/Postgres and MySQL are charged based on hourly consumption
                and may change based on exchange rates.
              </p>
              <p>
                Valid {props.state.monthOfEstimate}. Estimates are subject to
                change.
              </p>
            </div>
          </details>
        </div>
      </div>
    </>
  );
}
