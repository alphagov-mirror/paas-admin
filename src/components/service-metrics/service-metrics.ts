import { IContext } from '../app';
import CloudFoundryClient from '../../lib/cf';
import { CLOUD_CONTROLLER_ADMIN, CLOUD_CONTROLLER_GLOBAL_AUDITOR, CLOUD_CONTROLLER_READ_ONLY_ADMIN } from '../auth';
import { IParameters, IResponse } from '../../lib/router';
import { fromOrg, IBreadcrumb } from '../breadcrumbs';
import serviceMetricsTemplate from './service-metrics.njk';
import * as cw from "@aws-sdk/client-cloudwatch-node";

export async function viewServiceMetricImage(ctx: IContext, params: IParameters): Promise<IResponse> {
    const cloudWatch = new cw.CloudWatchClient({ region: 'eu-west-1' })
    const cmd = new cw.GetMetricWidgetImageCommand({
        MetricWidget: JSON.stringify({
          metrics: [
            [ "AWS/RDS", params.metricDimension, "DBInstanceIdentifier", `rdsbroker-${params.serviceGUID}` ],
          ],
          yAxis: {left: { min: 0} },
          start: "-PT168H",
          title: " ",
          legend: {position: "hidden"},
        })
      })
    const data = await cloudWatch.send(cmd)

    return {
        body: Buffer.from(data.MetricWidgetImage!),
        mimeType: 'image/png',
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

    return {
        body: serviceMetricsTemplate.render({
            routePartOf: ctx.routePartOf,
            linkTo: ctx.linkTo,
            context: ctx.viewContext,
            organization,
            service,
            space,
            isAdmin,
            isBillingManager,
            isManager,
            breadcrumbs,
        }),
    };
}
