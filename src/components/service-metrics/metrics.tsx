import React from 'react';

import { IMetricSerie, IMetricSerieSummary } from '../../lib/metrics';
import { drawLineGraph } from '../charts/line-graph';
import { IMetricProperties } from './views';

interface ISeries {
  readonly [key: string]: ReadonlyArray<IMetricSerie>;
}

interface ISummaries {
  readonly [key: string]: ReadonlyArray<IMetricSerieSummary>;
}

export function cloudFrontMetrics(
  series: ISeries,
  summaries: ISummaries,
  downloadLink: string,
): ReadonlyArray<IMetricProperties> {
  return [
    {
      id: 'requests',
      format: 'number',
      title: 'Requests',
      description: 'How many HTTP requests your CDN route service has served.',
      chart: drawLineGraph('HTTP requests', 'Number', '.2s', series.mRequests),
      units: 'Number',
      metric: 'mRequests',
      summaries: summaries.mRequests,
      downloadLink,
    },
    {
      id: 'total-error-rate',
      format: 'percentile',
      title: 'Total error rate',
      description: `The percentages of HTTP responses with either a 4XX or 5XX HTTP status code, which can represent a
        client or a server error.`,
      chart: drawLineGraph(
        'percentage of HTTP requests with either a 4XX or 5XX status code',
        'Percent',
        '.1s',
        series.mTotalErrorRate,
      ),
      units: 'Percent',
      metric: 'mTotalErrorRate',
      summaries: summaries.mTotalErrorRate,
      downloadLink,
    },
    {
      id: '4xx-error-rate',
      format: 'percentile',
      title: '4xx error rate',
      description: 'The percentages of HTTP responses with a 4XX HTTP status code, which represents a client error.',
      chart: drawLineGraph(
        'percentage of HTTP requests with a 4XX status code', 'Percent', '.1s', series.m4xxErrorRate,
      ),
      units: 'Percent',
      metric: 'm4xxErrorRate',
      summaries: summaries.m4xxErrorRate,
      downloadLink,
    },
    {
      id: '5xx-error-rate',
      format: 'percentile',
      title: '5xx error rate',
      description: 'The percentages of HTTP responses with a 5XX HTTP status code, which represents a server error.',
      chart: drawLineGraph(
        'percentage of HTTP requests with a 5XX status code', 'Percent', '.1s', series.m5xxErrorRate,
      ),
      units: 'Percent',
      metric: 'm5xxErrorRate',
      summaries: summaries.m5xxErrorRate,
      downloadLink,
    },
    {
      id: 'bytes-uploaded',
      format: 'bytes',
      title: 'Bytes uploaded',
      description: 'The number of bytes sent to your applications by the CDN route service.',
      chart: drawLineGraph('number of bytes sent to the origin', 'Bytes', '.2s', series.mBytesUploaded),
      units: 'Bytes',
      metric: 'mBytesUploaded',
      summaries: summaries.mBytesUploaded,
      downloadLink,
    },
    {
      id: 'bytes-downloaded',
      format: 'bytes',
      title: 'Bytes downloaded',
      description: 'The number of bytes received from your applications by the CDN route service.',
      chart: drawLineGraph('number of bytes received from the origin', 'Bytes', '.2s', series.mBytesDownloaded),
      units: 'Bytes',
      metric: 'mBytesDownloaded',
      summaries: summaries.mBytesDownloaded,
      downloadLink,
    },
  ];
}

export function rdsMetrics(
  series: ISeries,
  summaries: ISummaries,
  downloadLink: string,
): ReadonlyArray<IMetricProperties> {
  return [
    {
      id: 'free-disk-space',
      format: 'bytes',
      title: 'Free disk space',
      description: `How much hard disk space your database has remaining. If your database runs out of disk space it
        will stop working.`,
      chart: drawLineGraph('bytes of free disk space', 'Bytes', '.2s', series.mFreeStorageSpace),
      units: 'Bytes',
      metric: 'mFreeStorageSpace',
      summaries: summaries.mFreeStorageSpace,
      downloadLink,
    },
    {
      id: 'cpu-utilisation',
      format: 'percentile',
      title: 'CPU Utilisation',
      description: <>
        How much computational work your database is doing. High CPU Utilisation may indicate you need to optimise your
        database queries or <a
          href="https://docs.cloud.service.gov.uk/deploying_services/postgresql/#upgrade-postgresql-service-plan"
          className="govuk-link">
          update your service to use a bigger plan
        </a>.
      </>,
      chart: drawLineGraph('percentage CPU Utilisation', 'Percent', '.1r', series.mCPUUtilization),
      units: 'Percent',
      metric: 'mCPUUtilization',
      summaries: summaries.mCPUUtilization,
      downloadLink,
    },
    {
      id: 'database-connections',
      title: 'Database Connections',
      description: <>
        How many open connections there are to your database. High values may indicate problems with your applications'
        connection management, or that you need to <a
          href="https://docs.cloud.service.gov.uk/deploying_services/postgresql/#upgrade-postgresql-service-plan"
          className="govuk-link">
          update your service to use a bigger plan
        </a>. Zero values may indicate the database is unavailable, or that your applications cannot connect to the
        database.
      </>,
      chart: drawLineGraph('number of database connections', 'Number', '.1r', series.mDatabaseConnections),
      units: 'Number',
      metric: 'mDatabaseConnections',
      summaries: summaries.mDatabaseConnections,
      downloadLink,
    },
    {
      id: 'freeable-memory',
      format: 'bytes',
      title: 'Freeable Memory',
      description: <>
        How much <abbr title="Random Access Memory">RAM</abbr> the <abbr title="Virtual Machine">VM</abbr> your
        database is running on has remaining. Values near zero may indicate you need to optimise your database queries
        or <a href="https://docs.cloud.service.gov.uk/deploying_services/postgresql/#upgrade-postgresql-service-plan"
          className="govuk-link">
          update your service to use a bigger plan
        </a>.
      </>,
      chart: drawLineGraph('bytes of freeable memory (RAM)', 'Bytes', '.2s', series.mFreeableMemory),
      units: 'Bytes',
      metric: 'mFreeableMemory',
      summaries: summaries.mFreeableMemory,
      downloadLink,
    },
    {
      id: 'read-iops',
      title: <>Read <abbr title="Input / Output Operations per Second">IOPS</abbr></>,
      description: <>
        How many read operations your database is performing per second. Databases are limited to a number of <abbr
          title="Input / Output Operations per Second">IOPS</abbr> (read + write) based on how big their hard disk is.
        You get 3 <abbr title="Input / Output Operations per Second">IOPS</abbr> per <abbr title="GibiByte">GiB</abbr>,
        so a 100 GiB database would be limited to 300 IOPS. If it looks like your database is hitting its IOPS limit
        you may need to <a
          href="https://docs.cloud.service.gov.uk/deploying_services/postgresql/#upgrade-postgresql-service-plan"
          className="govuk-link">
          update your service to use a bigger plan
        </a>.
      </>,
      chart: drawLineGraph('number of read IOPS', 'Number', '.2r', series.mReadIOPS),
      units: 'Number',
      metric: 'mReadIOPS',
      summaries: summaries.mReadIOPS,
      downloadLink,
    },
    {
      id: 'write-iops',
      title: <>Write <abbr title="Input / Output Operations per Second">IOPS</abbr></>,
      description: <>
        How many write operations your database is performing per second. Databases are limited to a number of <abbr
          title="Input / Output Operations per Second">IOPS</abbr> (read + write) based on how big their hard disk is.
        You get 3 <abbr title="Input / Output Operations per Second">IOPS</abbr> per <abbr title="GibiByte">GiB</abbr>,
        so a 100 GiB database would be limited to 300 IOPS. If it looks like your database is hitting its IOPS limit
        you may need to <a
          href="https://docs.cloud.service.gov.uk/deploying_services/postgresql/#upgrade-postgresql-service-plan"
          className="govuk-link">
          update your service to use a bigger plan
        </a>.
      </>,
      chart: drawLineGraph('number of write IOPS', 'Number', '.2r', series.mWriteIOPS),
      units: 'Number',
      metric: 'mWriteIOPS',
      summaries: summaries.mWriteIOPS,
      downloadLink,
    },
  ];
}

export function elastiCacheMetrics(
  series: ISeries,
  summaries: ISummaries,
  downloadLink: string,
): ReadonlyArray<IMetricProperties> {
  return [
    {
      id: 'cpu-utilisation',
      format: 'percentile',
      title: 'CPU Utilisation',
      description: <>
        How much computational work redis is doing. High CPU Utilisation may indicate you need to reduce your usage or
        {' '}
        <a href="https://docs.cloud.service.gov.uk/deploying_services/redis/#redis-service-plans"
          className="govuk-link">
          update your service to use a bigger plan
        </a>.
      </>,
      chart: drawLineGraph('percentage CPU Utilisation', 'Percent', '.2r', series.mCPUUtilization),
      units: 'Percent',
      metric: 'mCPUUtilization',
      summaries: summaries.mCPUUtilization,
      downloadLink,
    },
    {
      id: 'memory-used',
      format: 'bytes',
      title: 'Memory used',
      description: `The total amount of memory redis is using to store your data and redis'
        internal buffers. If redis reaches its memory limit and cannot evict any
        keys it will return errors when executing commands that increase memory
        use.`,
      chart: drawLineGraph('bytes used for the cache', 'Bytes', '.2s', series.mBytesUsedForCache),
      units: 'Bytes',
      metric: 'mBytesUsedForCache',
      summaries: summaries.mBytesUsedForCache,
      downloadLink,
    },
    {
      id: 'swap-memory-used',
      format: 'bytes',
      title: 'Swap memory used',
      description: <>
        If redis is running low on memory it will start to swap memory onto the hard disk.
        If redis is using more than 50 <abbr title="MegaBytes">MB</abbr> of swap memory you may need to reduce your
        usage or <a href="https://docs.cloud.service.gov.uk/deploying_services/redis/#redis-service-plans"
          className="govuk-link">
          update your service to use a bigger plan
        </a>.
      </>,
      chart: drawLineGraph('bytes used in swap memory', 'Bytes', '.2s', series.mSwapUsage),
      units: 'Bytes',
      metric: 'mSwapUsage',
      summaries: summaries.mSwapUsage,
      downloadLink,
    },
    {
      id: 'evictions',
      title: 'Evictions',
      description: `Redis will evict keys when it reaches its configured memory limit. It will try to remove less
        recently used keys first, but only among keys that have an EXPIRE set. If there are no keys left to evict
        redis will return errors when executing commands that increase memory use.`,
      chart: drawLineGraph('number of keys evicted by Redis', 'Number', '.2s', series.mEvictions),
      units: 'Number',
      metric: 'mEvictions',
      summaries: summaries.mEvictions,
      downloadLink,
    },
    {
      id: 'connection-count',
      title: 'Connection count',
      description: `How many open connections there are to redis. High values may indicate problems with your
        applications'; connection management. Zero values may indicate that redis is unavailable, or that your
        applications cannot connect to the database.`,
      chart: drawLineGraph('number of connections to Redis', 'Number', '.2r', series.mCurrConnections),
      units: 'Number',
      metric: 'mCurrConnections',
      summaries: summaries.mCurrConnections,
      downloadLink,
    },
    {
      id: 'cache-hits',
      title: 'Cache hits',
      description: 'The number of successful key lookups.',
      chart: drawLineGraph('number of cache hits', 'Number', '.2s', series.mCacheHits),
      units: 'Number',
      metric: 'mCacheHits',
      summaries: summaries.mCacheHits,
      downloadLink,
    },
    {
      id: 'cache-misses',
      title: 'Cache misses',
      description: 'The number of unsuccessful key lookups.',
      chart: drawLineGraph('number of cache misses', 'Number', '.2s', series.mCacheMisses),
      units: 'Number',
      metric: 'mCacheMisses',
      summaries: summaries.mCacheMisses,
      downloadLink,
    },
    {
      id: 'item-count',
      title: 'Item count',
      description: 'The number of items in redis.',
      chart: drawLineGraph('number of cache misses', 'Number', '.2s', series.mCurrItems),
      units: 'Number',
      metric: 'mCurrItems',
      summaries: summaries.mCurrItems,
      downloadLink,
    },
    {
      id: 'network-bytes-in',
      format: 'bytes',
      title: 'Network bytes in',
      description: 'The number of bytes redis has read from the network.',
      chart: drawLineGraph(
        'number of bytes redis has read from the network', 'Bytes', '.2s', series.mNetworkBytesIn,
      ),
      units: 'Bytes',
      metric: 'mNetworkBytesIn',
      summaries: summaries.mNetworkBytesIn,
      downloadLink,
    },
    {
      id: 'network-bytes-out',
      format: 'bytes',
      title: 'Network bytes out',
      description: 'The number of bytes sent by redis.',
      chart: drawLineGraph('number of bytes sent by redis', 'Bytes', '.2s', series.mNetworkBytesOut),
      units: 'Bytes',
      metric: 'mNetworkBytesOut',
      summaries: summaries.mNetworkBytesOut,
      downloadLink,
    },
  ];
}

export function elasticSearchMetrics(
  series: ISeries,
  summaries: ISummaries,
  downloadLink: string,
): ReadonlyArray<IMetricProperties> {
  return [
    {
      id: 'load-average',
      format: 'number',
      title: 'Load average',
      description: <>
        How much computational work elasticsearch is doing. High load average may indicate you need to reduce your
        usage or <a
          href="https://docs.cloud.service.gov.uk/deploying_services/elasticsearch/#upgrade-elasticsearch-service-plan"
          className="govuk-link">
          update your service to use a bigger plan
        </a>.
      </>,
      chart: drawLineGraph('load average', 'Load', '.2r', series.loadAvg),
      units: 'Load',
      metric: 'loadAvg',
      summaries: summaries.loadAvg,
      downloadLink,
    },
    {
      id: 'elasticsearch-indices-count',
      format: 'number',
      title: 'Elasticsearch indices count',
      description: <>
        The number of indices present in elasticsearch. Large number of indices may indicate a bug in your application
        or require you to <a
          href="https://docs.cloud.service.gov.uk/deploying_services/elasticsearch/#upgrade-elasticsearch-service-plan"
          className="govuk-link">
          update your service to use a bigger plan
        </a>.
      </>,
      chart: drawLineGraph('elasticsearch indices count', 'Number', '.2r', series.elasticsearchIndicesCount),
      units: 'Number',
      metric: 'elasticsearchIndicesCount',
      summaries: summaries.elasticsearchIndicesCount,
      downloadLink,
    },
    {
      id: 'memory',
      format: 'number',
      title: 'Memory usage',
      description: <>
        Percentage of allocated memory elasticsearch is using. High values may indicate you need to optimise your
        elasticsearch queries or <a
          href="https://docs.cloud.service.gov.uk/deploying_services/elasticsearch/#upgrade-elasticsearch-service-plan"
          className="govuk-link">
          update your service to use a bigger plan
        </a>.
      </>,
      chart: drawLineGraph('memory', 'Percent', '.2r', series.memoryUsed),
      units: 'Percent',
      metric: 'memoryUsed',
      summaries: summaries.memoryUsed,
      downloadLink,
    },
    {
      id: 'disk-usage',
      format: 'number',
      title: 'Disk usage',
      description: <>
        Percentage of allocated storage elasticsearch is using. If elasticsearch runs out of disk space, the service
        will stop working. High values may indicate you need to reduce elasticsearch usage or <a
          href="https://docs.cloud.service.gov.uk/deploying_services/elasticsearch/#upgrade-elasticsearch-service-plan"
          className="govuk-link">
          update your service to use a bigger plan
        </a>.
      </>,
      chart: drawLineGraph('disk', 'Percent', '.2r', series.diskUsed),
      units: 'Percent',
      metric: 'diskUsed',
      summaries: summaries.diskUsed,
      downloadLink,
    },
    {
      id: 'disk-reads',
      format: 'number',
      title: 'Disk read rate',
      description: 'The average number of disk read operations elasticsearch is performing per second.',
      chart: drawLineGraph('disk reads', 'Reads per second', '.2r', series.diskReads),
      units: 'Reads per second',
      metric: 'diskReads',
      summaries: summaries.diskReads,
      downloadLink,
    },
    {
      id: 'disk-writes',
      format: 'number',
      title: 'Disk write rate',
      description: 'The average number of disk write operations elasticsearch is performing per second.',
      chart: drawLineGraph('disk writes', 'Writes per second', '.2r', series.diskWrites),
      units: 'Writes per second',
      metric: 'diskWrites',
      summaries: summaries.diskWrites,
      downloadLink,
    },
    {
      id: 'network-in',
      format: 'number',
      title: 'Network in',
      description: 'The number of bytes received by elasticsearch.',
      chart: drawLineGraph('network bytes received', 'Bytes per second', '.2r', series.networkIn),
      units: 'Bytes per second',
      metric: 'networkIn',
      summaries: summaries.networkIn,
      downloadLink,
    },
    {
      id: 'network-out',
      format: 'number',
      title: 'Network out',
      description: 'The number of bytes sent by elasticsearch.',
      chart: drawLineGraph('network bytes send', 'Bytes per second', '.2r', series.networkOut),
      units: 'Bytes per second',
      metric: 'networkOut',
      summaries: summaries.networkOut,
      downloadLink,
    },
  ];
}
