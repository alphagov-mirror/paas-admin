import express from 'express';
import lodash from 'lodash';

import * as testData from '../src/lib/cf/cf.test.data';
import {app as defaultApp} from '../src/lib/cf/test-data/app';
import {auditEvent as defaultAuditEvent} from '../src/lib/cf/test-data/audit-event';
import {org as defaultOrg, v3Org as defaultV3Org} from '../src/lib/cf/test-data/org';
import {wrapResources, wrapV3Resources} from '../src/lib/cf/test-data/wrap-resources';
import {IStubServerPorts} from './index';

const kek = {
  "pagination": {
     "total_results": 7,
     "total_pages": 1,
     "first": {
        "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_offerings?page=1&per_page=50"
     },
     "last": {
        "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_offerings?page=1&per_page=50"
     },
     "next": null,
     "previous": null
  },
  "resources": [
     {
        "guid": "c4b909c5-73ed-4b8a-901d-4ad4774b6942",
        "name": "cdn-route",
        "description": "Custom domains, CDN caching, and TLS certificates with automatic renewal",
        "available": true,
        "bindable": true,
        "broker_service_offering_metadata": "{\n  \"displayName\": \"CDN Route\",\n  \"documentationUrl\": \"https://docs.cloud.service.gov.uk/deploying_services/use_a_custom_domain/#managing-custom-domains-using-the-cdn-route-service\"\n}",
        "broker_service_offering_id": "8478b533-2b59-4007-8494-2feec5970f94",
        "tags": [],
        "requires": [],
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z",
        "plan_updateable": true,
        "shareable": false,
        "links": {
           "self": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_offerings/c4b909c5-73ed-4b8a-901d-4ad4774b6942"
           },
           "service_plans": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_plans?service_offering_guids=c4b909c5-73ed-4b8a-901d-4ad4774b6942"
           },
           "service_broker": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_brokers/d5bd2f22-f9a2-485e-aa8a-92dcc4fcc05e"
           }
        },
        "relationships": {
           "service_broker": {
              "data": {
                 "name": "cdn-broker",
                 "guid": "d5bd2f22-f9a2-485e-aa8a-92dcc4fcc05e"
              }
           }
        }
     },
     {
        "guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "name": "postgres",
        "description": "AWS RDS PostgreSQL service",
        "available": true,
        "bindable": true,
        "broker_service_offering_metadata": "{\n  \"displayName\": \"AWS RDS Postgres\",\n  \"longDescription\": \"AWS RDS postgres service\",\n  \"providerDisplayName\": \"Amazon Web Services\",\n  \"documentationUrl\": \"https://aws.amazon.com/documentation/rds/\",\n  \"supportUrl\": \"https://forums.aws.amazon.com/forum.jspa?forumID=60\"\n}",
        "broker_service_offering_id": "ce71b484-d542-40f7-9dd4-5526e38c81ba",
        "tags": [
           "postgres",
           "relational"
        ],
        "requires": [],
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z",
        "plan_updateable": true,
        "shareable": false,
        "links": {
           "self": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_offerings/bb039bb8-3fe0-4beb-bef8-f1bffe427381"
           },
           "service_plans": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_plans?service_offering_guids=bb039bb8-3fe0-4beb-bef8-f1bffe427381"
           },
           "service_broker": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_brokers/6e8366ce-3916-4598-a504-9abb36675bb1"
           }
        },
        "relationships": {
           "service_broker": {
              "data": {
                 "name": "rds-broker",
                 "guid": "6e8366ce-3916-4598-a504-9abb36675bb1"
              }
           }
        }
     },
     {
        "guid": "db34de77-65f5-41a7-b85f-86a2427276b6",
        "name": "mysql",
        "description": "AWS RDS MySQL service",
        "available": true,
        "bindable": true,
        "broker_service_offering_metadata": "{\n  \"displayName\": \"AWS RDS MySQL\",\n  \"longDescription\": \"AWS RDS MySQL service\",\n  \"providerDisplayName\": \"Amazon Web Services\",\n  \"documentationUrl\": \"https://aws.amazon.com/documentation/rds/\",\n  \"supportUrl\": \"https://forums.aws.amazon.com/forum.jspa?forumID=60\"\n}",
        "broker_service_offering_id": "4b888513-1dc3-4b9b-bdcd-51f4c03675a4",
        "tags": [
           "mysql",
           "relational"
        ],
        "requires": [],
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z",
        "plan_updateable": true,
        "shareable": false,
        "links": {
           "self": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_offerings/db34de77-65f5-41a7-b85f-86a2427276b6"
           },
           "service_plans": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_plans?service_offering_guids=db34de77-65f5-41a7-b85f-86a2427276b6"
           },
           "service_broker": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_brokers/6e8366ce-3916-4598-a504-9abb36675bb1"
           }
        },
        "relationships": {
           "service_broker": {
              "data": {
                 "name": "rds-broker",
                 "guid": "6e8366ce-3916-4598-a504-9abb36675bb1"
              }
           }
        }
     },
     {
        "guid": "87b197ed-c0c8-4695-80c5-0e4f17420341",
        "name": "aws-s3-bucket",
        "description": "Object storage with AWS S3",
        "available": true,
        "bindable": true,
        "broker_service_offering_metadata": "{\n  \"displayName\": \"AWS S3 Object Store\",\n  \"documentationUrl\": \"https://docs.cloud.service.gov.uk/#s3\",\n  \"longDescription\": \"AWS S3 Object Store\",\n  \"providerDisplayName\": \"GOV.UK PaaS\",\n  \"supportUrl\": \"https://www.cloud.service.gov.uk/support.html\"\n}",
        "broker_service_offering_id": "36880794-1682-4a4b-8771-be655904237d",
        "tags": [
           "s3"
        ],
        "requires": [],
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z",
        "plan_updateable": false,
        "shareable": false,
        "links": {
           "self": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_offerings/87b197ed-c0c8-4695-80c5-0e4f17420341"
           },
           "service_plans": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_plans?service_offering_guids=87b197ed-c0c8-4695-80c5-0e4f17420341"
           },
           "service_broker": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_brokers/c7fb34c4-7e02-45c1-b810-ee5357a74584"
           }
        },
        "relationships": {
           "service_broker": {
              "data": {
                 "name": "s3-broker",
                 "guid": "c7fb34c4-7e02-45c1-b810-ee5357a74584"
              }
           }
        }
     },
     {
        "guid": "d967dd5b-05e6-48a1-a6c2-38cf8f437a32",
        "name": "redis",
        "description": "AWS ElastiCache Redis service",
        "available": true,
        "bindable": true,
        "broker_service_offering_metadata": "{\n  \"displayName\": \"Redis\",\n  \"imageUrl\": \"https://redis.io/images/redis-white.png\",\n  \"longDescription\": \"AWS ElastiCache Redis cluster\",\n  \"providerDisplayName\": \"GOV.UK PaaS\",\n  \"documentationUrl\": \"https://docs.cloud.service.gov.uk/#redis\",\n  \"supportUrl\": \"https://www.cloud.service.gov.uk/support.html\"\n}",
        "broker_service_offering_id": "7b94ab02-478f-4c1b-95d8-21522672930b",
        "tags": [
           "elasticache",
           "redis"
        ],
        "requires": [],
        "created_at": "2020-01-29T11:20:28Z",
        "updated_at": "2020-01-29T11:20:28Z",
        "plan_updateable": true,
        "shareable": false,
        "links": {
           "self": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_offerings/d967dd5b-05e6-48a1-a6c2-38cf8f437a32"
           },
           "service_plans": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_plans?service_offering_guids=d967dd5b-05e6-48a1-a6c2-38cf8f437a32"
           },
           "service_broker": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_brokers/4574d979-86e3-4cfb-8797-7e65cf9344ee"
           }
        },
        "relationships": {
           "service_broker": {
              "data": {
                 "name": "elasticache-broker",
                 "guid": "4574d979-86e3-4cfb-8797-7e65cf9344ee"
              }
           }
        }
     },
     {
        "guid": "a66f252c-582a-4254-984a-c5e2d1bf4b6e",
        "name": "elasticsearch",
        "description": "Elasticsearch instances provisioned via Aiven",
        "available": true,
        "bindable": true,
        "broker_service_offering_metadata": "{\n  \"displayName\": \"Elasticsearch\",\n  \"providerDisplayName\": \"GOV.UK PaaS\",\n  \"supportUrl\": \"https://www.cloud.service.gov.uk/support\"\n}",
        "broker_service_offering_id": "1b45c99b-c90d-45b8-918d-9fb7dcb4beec",
        "tags": [],
        "requires": [],
        "created_at": "2020-01-29T11:21:41Z",
        "updated_at": "2020-01-29T11:21:41Z",
        "plan_updateable": true,
        "shareable": false,
        "links": {
           "self": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_offerings/a66f252c-582a-4254-984a-c5e2d1bf4b6e"
           },
           "service_plans": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_plans?service_offering_guids=a66f252c-582a-4254-984a-c5e2d1bf4b6e"
           },
           "service_broker": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_brokers/811aa545-7bfc-410c-b869-e23132b5b38c"
           }
        },
        "relationships": {
           "service_broker": {
              "data": {
                 "name": "aiven-broker",
                 "guid": "811aa545-7bfc-410c-b869-e23132b5b38c"
              }
           }
        }
     },
     {
        "guid": "8240a3d2-07f1-4411-bf3c-8c523962b6e2",
        "name": "influxdb",
        "description": "InfluxDB instances provisioned via Aiven",
        "available": true,
        "bindable": true,
        "broker_service_offering_metadata": "{\n  \"displayName\": \"InfluxDB\",\n  \"providerDisplayName\": \"GOV.UK PaaS\",\n  \"supportUrl\": \"https://www.cloud.service.gov.uk/support\"\n}",
        "broker_service_offering_id": "9e91681d-d9ae-4ab4-9b1e-8b8fbb54ce52",
        "tags": [],
        "requires": [],
        "created_at": "2020-01-29T11:21:41Z",
        "updated_at": "2020-01-29T11:21:41Z",
        "plan_updateable": true,
        "shareable": false,
        "links": {
           "self": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_offerings/8240a3d2-07f1-4411-bf3c-8c523962b6e2"
           },
           "service_plans": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_plans?service_offering_guids=8240a3d2-07f1-4411-bf3c-8c523962b6e2"
           },
           "service_broker": {
              "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_brokers/811aa545-7bfc-410c-b869-e23132b5b38c"
           }
        },
        "relationships": {
           "service_broker": {
              "data": {
                 "name": "aiven-broker",
                 "guid": "811aa545-7bfc-410c-b869-e23132b5b38c"
              }
           }
        }
     }
  ]
};

const kek2 = {
  "guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
  "name": "postgres",
  "description": "AWS RDS PostgreSQL service",
  "available": true,
  "bindable": true,
  "broker_service_offering_metadata": "{\n  \"displayName\": \"AWS RDS Postgres\",\n  \"longDescription\": \"AWS RDS postgres service\",\n  \"providerDisplayName\": \"Amazon Web Services\",\n  \"documentationUrl\": \"https://aws.amazon.com/documentation/rds/\",\n  \"supportUrl\": \"https://forums.aws.amazon.com/forum.jspa?forumID=60\"\n}",
  "broker_service_offering_id": "ce71b484-d542-40f7-9dd4-5526e38c81ba",
  "tags": [
    "postgres",
    "relational"
  ],
  "requires": [

  ],
  "created_at": "2020-01-29T11:15:23Z",
  "updated_at": "2020-01-29T11:15:23Z",
  "plan_updateable": true,
  "shareable": false,
  "links": {
    "self": {
      "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_offerings/bb039bb8-3fe0-4beb-bef8-f1bffe427381"
    },
    "service_plans": {
      "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_plans?service_offering_guids=bb039bb8-3fe0-4beb-bef8-f1bffe427381"
    },
    "service_broker": {
      "href": "https://api.rafalp.dev.cloudpipeline.digital/v3/service_brokers/6e8366ce-3916-4598-a504-9abb36675bb1"
    }
  },
  "relationships": {
    "service_broker": {
      "data": {
        "name": "rds-broker",
        "guid": "6e8366ce-3916-4598-a504-9abb36675bb1"
      }
    }
  }
};

const kek3 = {
  "total_results": 35,
  "total_pages": 1,
  "prev_url": null,
  "next_url": null,
  "resources": [
    {
      "metadata": {
        "guid": "c312f010-442f-49e5-aa23-e5116cd49919",
        "url": "/v2/service_plans/c312f010-442f-49e5-aa23-e5116cd49919",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:30Z"
      },
      "entity": {
        "name": "tiny-unencrypted-9.5",
        "free": true,
        "description": "5GB Storage, NOT BACKED UP, Dedicated Instance, Max 50 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.t2.micro.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "AWS RDS"] }),
        "unique_id": "5f2eec8a-0cad-4ab9-b81e-d6adade2fd42",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/c312f010-442f-49e5-aa23-e5116cd49919/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "2803557a-f443-474f-b97f-a396f8d2ae27",
        "url": "/v2/service_plans/2803557a-f443-474f-b97f-a396f8d2ae27",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:30Z"
      },
      "entity": {
        "name": "small-9.5",
        "free": false,
        "description": "20GB Storage, Dedicated Instance, Storage Encrypted, Max 200 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.t2.small.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 0.039 }, "unit": "HOUR" }] }),
        "unique_id": "2611d776-9991-4940-a755-880eafbc33a0",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/2803557a-f443-474f-b97f-a396f8d2ae27/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "7ae0fb56-637d-4a59-a7b7-40371d36d677",
        "url": "/v2/service_plans/7ae0fb56-637d-4a59-a7b7-40371d36d677",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:30Z"
      },
      "entity": {
        "name": "small-ha-9.5",
        "free": false,
        "description": "20GB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 200 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.t2.small.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "AWS RDS"], "costs": [{ "amount": { "usd": 0.078 }, "unit": "HOUR" }] }),
        "unique_id": "d9f1d61d-0a65-45ad-8fc9-88c921d038d2",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/7ae0fb56-637d-4a59-a7b7-40371d36d677/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "a104f885-404c-41bf-a90b-0596d2cd579b",
        "url": "/v2/service_plans/a104f885-404c-41bf-a90b-0596d2cd579b",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:31Z"
      },
      "entity": {
        "name": "medium-9.5",
        "free": false,
        "description": "100GB Storage, Dedicated Instance, Storage Encrypted, Max 500 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.large.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 0.201 }, "unit": "HOUR" }] }),
        "unique_id": "17ef8670-5134-4ae6-b7fc-9ee8e52394c5",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/a104f885-404c-41bf-a90b-0596d2cd579b/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "fa6396c0-5901-47ab-80dd-9167d0f65578",
        "url": "/v2/service_plans/fa6396c0-5901-47ab-80dd-9167d0f65578",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:31Z"
      },
      "entity": {
        "name": "medium-ha-9.5",
        "free": false,
        "description": "100GB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 500 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.large.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 0.402 }, "unit": "HOUR" }] }),
        "unique_id": "8d50ccc5-707c-4306-be8f-f59a158eb736",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/fa6396c0-5901-47ab-80dd-9167d0f65578/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "66602294-2dd2-4b71-bc67-4da24aafcb24",
        "url": "/v2/service_plans/66602294-2dd2-4b71-bc67-4da24aafcb24",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:32Z"
      },
      "entity": {
        "name": "large-9.5",
        "free": false,
        "description": "512GB Storage, Dedicated Instance, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.2xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 0.806 }, "unit": "HOUR" }] }),
        "unique_id": "8ea15f55-fbd2-41a3-a679-482d67a3d9ea",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/66602294-2dd2-4b71-bc67-4da24aafcb24/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "13ee4bd2-f882-4ee6-8e9f-0d2040d54546",
        "url": "/v2/service_plans/13ee4bd2-f882-4ee6-8e9f-0d2040d54546",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:31Z"
      },
      "entity": {
        "name": "large-ha-9.5",
        "free": false,
        "description": "512GB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.2xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 1.612 }, "unit": "HOUR" }] }),
        "unique_id": "620055b3-fe7c-46fc-87ad-c7d8f4fe7f34",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/13ee4bd2-f882-4ee6-8e9f-0d2040d54546/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "112d73b5-bdd8-4c43-9880-dc3a449efe9c",
        "url": "/v2/service_plans/112d73b5-bdd8-4c43-9880-dc3a449efe9c",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:32Z"
      },
      "entity": {
        "name": "xlarge-9.5",
        "free": false,
        "description": "2TB Storage, Dedicated Instance, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.4xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 1.612 }, "unit": "HOUR" }] }),
        "unique_id": "3cb1947e-1df5-4483-8e9e-07c9294f9347",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/112d73b5-bdd8-4c43-9880-dc3a449efe9c/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "1ce2d100-0497-44a4-aabc-5bbb8b2f768b",
        "url": "/v2/service_plans/1ce2d100-0497-44a4-aabc-5bbb8b2f768b",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:32Z"
      },
      "entity": {
        "name": "xlarge-ha-9.5",
        "free": false,
        "description": "2TB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.4xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 3.224 }, "unit": "HOUR" }] }),
        "unique_id": "a91c8e59-8869-42fd-8a99-8989151d7353",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/1ce2d100-0497-44a4-aabc-5bbb8b2f768b/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "8bd3ae95-9282-4201-863c-c10f35bf1303",
        "url": "/v2/service_plans/8bd3ae95-9282-4201-863c-c10f35bf1303",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z"
      },
      "entity": {
        "name": "small-unencrypted-9.5",
        "free": false,
        "description": "20GB Storage, Dedicated Instance, Max 200 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.t2.small.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "AWS RDS"], "costs": [{ "amount": { "usd": 0.039 }, "unit": "HOUR" }] }),
        "unique_id": "b7d0a368-ac92-4eff-9b8d-ab4ba45bed0e",
        "public": false,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/8bd3ae95-9282-4201-863c-c10f35bf1303/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "4d8bbe3b-0312-4cf8-b01a-73340de98a4f",
        "url": "/v2/service_plans/4d8bbe3b-0312-4cf8-b01a-73340de98a4f",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z"
      },
      "entity": {
        "name": "small-ha-unencrypted-9.5",
        "free": false,
        "description": "20GB Storage, Dedicated Instance, Highly Available, Max 200 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.t2.small.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "AWS RDS"], "costs": [{ "amount": { "usd": 0.078 }, "unit": "HOUR" }] }),
        "unique_id": "359bcb39-0264-46bd-9120-0182c3829067",
        "public": false,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/4d8bbe3b-0312-4cf8-b01a-73340de98a4f/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "6647ef4e-6a57-44a1-b3bb-22d4a349b910",
        "url": "/v2/service_plans/6647ef4e-6a57-44a1-b3bb-22d4a349b910",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z"
      },
      "entity": {
        "name": "medium-unencrypted-9.5",
        "free": false,
        "description": "100GB Storage, Dedicated Instance, Max 500 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.large.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "AWS RDS"], "costs": [{ "amount": { "usd": 0.201 }, "unit": "HOUR" }] }),
        "unique_id": "9b882524-ab58-4c18-b501-d2a3f4619104",
        "public": false,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/6647ef4e-6a57-44a1-b3bb-22d4a349b910/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "bdd95ce1-0954-468a-bf38-35b583f05ea6",
        "url": "/v2/service_plans/bdd95ce1-0954-468a-bf38-35b583f05ea6",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z"
      },
      "entity": {
        "name": "medium-ha-unencrypted-9.5",
        "free": false,
        "description": "100GB Storage, Dedicated Instance, Highly Available, Max 500 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.large.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "AWS RDS"], "costs": [{ "amount": { "usd": 0.402 }, "unit": "HOUR" }] }),
        "unique_id": "bf5b99c2-7990-4b66-b341-1bb83566d76e",
        "public": false,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/bdd95ce1-0954-468a-bf38-35b583f05ea6/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "dbc91bd7-4845-440d-b7b0-dfc8efefc65e",
        "url": "/v2/service_plans/dbc91bd7-4845-440d-b7b0-dfc8efefc65e",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z"
      },
      "entity": {
        "name": "large-unencrypted-9.5",
        "free": false,
        "description": "512GB Storage, Dedicated Instance, Max 5000 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.2xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "AWS RDS"], "costs": [{ "amount": { "usd": 0.806 }, "unit": "HOUR" }] }),
        "unique_id": "238a1328-4f77-4b70-9bd9-2cdbbfb999c8",
        "public": false,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/dbc91bd7-4845-440d-b7b0-dfc8efefc65e/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "756c72d1-cef7-4e07-86d1-3297bad4c9f6",
        "url": "/v2/service_plans/756c72d1-cef7-4e07-86d1-3297bad4c9f6",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z"
      },
      "entity": {
        "name": "large-ha-unencrypted-9.5",
        "free": false,
        "description": "512GB Storage, Dedicated Instance, Highly Available, Max 5000 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.2xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "AWS RDS"], "costs": [{ "amount": { "usd": 1.612 }, "unit": "HOUR" }] }),
        "unique_id": "dfe4ab2b-2069-41a5-ba08-2be21b0c76d3",
        "public": false,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/756c72d1-cef7-4e07-86d1-3297bad4c9f6/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "5ff0664e-ea83-4425-80ff-f664035c752a",
        "url": "/v2/service_plans/5ff0664e-ea83-4425-80ff-f664035c752a",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z"
      },
      "entity": {
        "name": "xlarge-unencrypted-9.5",
        "free": false,
        "description": "2TB Storage, Dedicated Instance, Max 5000 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.4xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "AWS RDS"], "costs": [{ "amount": { "usd": 1.612 }, "unit": "HOUR" }] }),
        "unique_id": "1065c353-54dd-4f6b-a5b4-a4b5aa4575c6",
        "public": false,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/5ff0664e-ea83-4425-80ff-f664035c752a/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "9dc450fc-be48-4785-89d8-ccc003262a56",
        "url": "/v2/service_plans/9dc450fc-be48-4785-89d8-ccc003262a56",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:23Z"
      },
      "entity": {
        "name": "xlarge-ha-unencrypted-9.5",
        "free": false,
        "description": "2TB Storage, Dedicated Instance, Highly Available, Max 5000 Concurrent Connections. Postgres Version 9.5. DB Instance Class: db.m4.4xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 9.5 server", "AWS RDS"], "costs": [{ "amount": { "usd": 3.224 }, "unit": "HOUR" }] }),
        "unique_id": "7119925f-518d-4263-96ac-16990295aad6",
        "public": false,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/9dc450fc-be48-4785-89d8-ccc003262a56/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "cae3926e-d364-4eec-8c49-07342420874b",
        "url": "/v2/service_plans/cae3926e-d364-4eec-8c49-07342420874b",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:33Z"
      },
      "entity": {
        "name": "tiny-unencrypted-10",
        "free": true,
        "description": "5GB Storage, NOT BACKED UP, Dedicated Instance, Max 50 Concurrent Connections. Postgres Version 10. DB Instance Class: db.t2.micro.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 10 server", "AWS RDS"] }),
        "unique_id": "11f779fa-425c-4c86-9530-d0aebcb3c3e6",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/cae3926e-d364-4eec-8c49-07342420874b/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "453c9c1d-4b44-4f3b-8f39-b6847adfa777",
        "url": "/v2/service_plans/453c9c1d-4b44-4f3b-8f39-b6847adfa777",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:33Z"
      },
      "entity": {
        "name": "small-10",
        "free": false,
        "description": "20GB Storage, Dedicated Instance, Storage Encrypted, Max 200 Concurrent Connections. Postgres Version 10. DB Instance Class: db.t2.small.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 10 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 0.039 }, "unit": "HOUR" }] }),
        "unique_id": "a68e4934-6c37-4f10-89b2-6388df093221",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/453c9c1d-4b44-4f3b-8f39-b6847adfa777/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "9e6400b6-1e9a-4b5c-b257-46a959d7dd8e",
        "url": "/v2/service_plans/9e6400b6-1e9a-4b5c-b257-46a959d7dd8e",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:33Z"
      },
      "entity": {
        "name": "small-ha-10",
        "free": false,
        "description": "20GB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 200 Concurrent Connections. Postgres Version 10. DB Instance Class: db.t2.small.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 10 server", "AWS RDS"], "costs": [{ "amount": { "usd": 0.078 }, "unit": "HOUR" }] }),
        "unique_id": "b2ef068e-5937-4522-ab97-758f6e9ce0ff",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/9e6400b6-1e9a-4b5c-b257-46a959d7dd8e/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "9fb64dfa-e87c-453e-8064-1b0d070a8b35",
        "url": "/v2/service_plans/9fb64dfa-e87c-453e-8064-1b0d070a8b35",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:33Z"
      },
      "entity": {
        "name": "medium-10",
        "free": false,
        "description": "100GB Storage, Dedicated Instance, Storage Encrypted, Max 500 Concurrent Connections. Postgres Version 10. DB Instance Class: db.m4.large.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 10 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 0.201 }, "unit": "HOUR" }] }),
        "unique_id": "d9e7b133-e584-4a9b-bef9-c53c2f2142f6",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/9fb64dfa-e87c-453e-8064-1b0d070a8b35/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "68a93054-9eb6-4ee9-be66-81e6da9e74f5",
        "url": "/v2/service_plans/68a93054-9eb6-4ee9-be66-81e6da9e74f5",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:34Z"
      },
      "entity": {
        "name": "medium-ha-10",
        "free": false,
        "description": "100GB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 500 Concurrent Connections. Postgres Version 10. DB Instance Class: db.m4.large.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 10 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 0.402 }, "unit": "HOUR" }] }),
        "unique_id": "0c89ea29-e6b3-44be-9b39-85cd42c3911e",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/68a93054-9eb6-4ee9-be66-81e6da9e74f5/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "f777b1fb-07c7-44d6-8ea6-be67429216f2",
        "url": "/v2/service_plans/f777b1fb-07c7-44d6-8ea6-be67429216f2",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:34Z"
      },
      "entity": {
        "name": "large-10",
        "free": false,
        "description": "512GB Storage, Dedicated Instance, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 10. DB Instance Class: db.m4.2xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 10 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 0.806 }, "unit": "HOUR" }] }),
        "unique_id": "da44b024-52bd-459f-8078-38591d574c90",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/f777b1fb-07c7-44d6-8ea6-be67429216f2/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "a8c7c627-a27c-4f1c-a7ad-8f4ae0442085",
        "url": "/v2/service_plans/a8c7c627-a27c-4f1c-a7ad-8f4ae0442085",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:34Z"
      },
      "entity": {
        "name": "large-ha-10",
        "free": false,
        "description": "512GB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 10. DB Instance Class: db.m4.2xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 10 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 1.612 }, "unit": "HOUR" }] }),
        "unique_id": "4140d479-601a-4585-ae1e-df67a9fa6b36",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/a8c7c627-a27c-4f1c-a7ad-8f4ae0442085/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "51dffcd8-8fe8-4186-b930-36a495e61ff9",
        "url": "/v2/service_plans/51dffcd8-8fe8-4186-b930-36a495e61ff9",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:35Z"
      },
      "entity": {
        "name": "xlarge-10",
        "free": false,
        "description": "2TB Storage, Dedicated Instance, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 10. DB Instance Class: db.m4.4xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 10 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 1.612 }, "unit": "HOUR" }] }),
        "unique_id": "43b01f78-0c9f-482e-b77f-e28189ccd870",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/51dffcd8-8fe8-4186-b930-36a495e61ff9/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "3d91efd2-5c4c-452b-bde4-1e0ba2e6d908",
        "url": "/v2/service_plans/3d91efd2-5c4c-452b-bde4-1e0ba2e6d908",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:35Z"
      },
      "entity": {
        "name": "xlarge-ha-10",
        "free": false,
        "description": "2TB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 10. DB Instance Class: db.m4.4xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 10 server", "Storage Encrypted", "AWS RDS"], "costs": [{ "amount": { "usd": 3.224 }, "unit": "HOUR" }] }),
        "unique_id": "2f6df103-8216-4bc4-bb38-a6422e03c981",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/3d91efd2-5c4c-452b-bde4-1e0ba2e6d908/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "0f1e4b2e-421c-4d1c-8934-7aa26877808a",
        "url": "/v2/service_plans/0f1e4b2e-421c-4d1c-8934-7aa26877808a",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:35Z"
      },
      "entity": {
        "name": "tiny-unencrypted-11",
        "free": true,
        "description": "5GB Storage, NOT BACKED UP, Dedicated Instance, Max 50 Concurrent Connections. Postgres Version 11. DB Instance Class: db.t3.micro.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 11 server", "AWS RDS"] }),
        "unique_id": "9adbd87b-1ce8-4f9b-8562-b57041988fbe",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/0f1e4b2e-421c-4d1c-8934-7aa26877808a/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "1bb86098-24e8-4610-aeac-e9ae10679641",
        "url": "/v2/service_plans/1bb86098-24e8-4610-aeac-e9ae10679641",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:36Z"
      },
      "entity": {
        "name": "small-11",
        "free": false,
        "description": "100GB Storage, Dedicated Instance, Storage Encrypted, Max 200 Concurrent Connections. Postgres Version 11. DB Instance Class: db.t3.small.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 11 server", "Storage Encrypted", "AWS RDS"] }),
        "unique_id": "b3fe2e1d-ffc5-4c35-8083-8c2b397b1e72",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/1bb86098-24e8-4610-aeac-e9ae10679641/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "c6265bfb-ef24-4794-a7fe-5042549509f8",
        "url": "/v2/service_plans/c6265bfb-ef24-4794-a7fe-5042549509f8",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:36Z"
      },
      "entity": {
        "name": "small-ha-11",
        "free": false,
        "description": "100GB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 200 Concurrent Connections. Postgres Version 11. DB Instance Class: db.t3.small.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 11 server", "AWS RDS"] }),
        "unique_id": "9ec72113-5955-4385-96ad-52ef777c10fe",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/c6265bfb-ef24-4794-a7fe-5042549509f8/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "5408ae5d-b22c-48fb-9e89-c6aef25f1387",
        "url": "/v2/service_plans/5408ae5d-b22c-48fb-9e89-c6aef25f1387",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:36Z"
      },
      "entity": {
        "name": "medium-11",
        "free": false,
        "description": "100GB Storage, Dedicated Instance, Storage Encrypted, Max 500 Concurrent Connections. Postgres Version 11. DB Instance Class: db.m5.large.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 11 server", "Storage Encrypted", "AWS RDS"] }),
        "unique_id": "e1dac552-b77b-4ae8-8d72-2d6186bf3380",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/5408ae5d-b22c-48fb-9e89-c6aef25f1387/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "96e7891c-3141-45eb-adda-c092e09a6212",
        "url": "/v2/service_plans/96e7891c-3141-45eb-adda-c092e09a6212",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:37Z"
      },
      "entity": {
        "name": "medium-ha-11",
        "free": false,
        "description": "100GB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 500 Concurrent Connections. Postgres Version 11. DB Instance Class: db.m5.large.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 11 server", "Storage Encrypted", "AWS RDS"] }),
        "unique_id": "8bdac429-5789-4ee7-ac2e-8800c94ac747",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/96e7891c-3141-45eb-adda-c092e09a6212/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "a71fa900-782f-45fc-92a9-7d48274f3363",
        "url": "/v2/service_plans/a71fa900-782f-45fc-92a9-7d48274f3363",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:37Z"
      },
      "entity": {
        "name": "large-11",
        "free": false,
        "description": "512GB Storage, Dedicated Instance, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 11. DB Instance Class: db.m5.2xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 11 server", "Storage Encrypted", "AWS RDS"] }),
        "unique_id": "07faed7b-3ed9-4904-af64-8e0b75e1e355",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/a71fa900-782f-45fc-92a9-7d48274f3363/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "4fa538df-7e9e-40d4-bc21-dab9dd84881f",
        "url": "/v2/service_plans/4fa538df-7e9e-40d4-bc21-dab9dd84881f",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:37Z"
      },
      "entity": {
        "name": "large-ha-11",
        "free": false,
        "description": "512GB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 11. DB Instance Class: db.m5.2xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 11 server", "Storage Encrypted", "AWS RDS"] }),
        "unique_id": "1826881e-31a2-46ca-997d-d920eb9ecd20",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/4fa538df-7e9e-40d4-bc21-dab9dd84881f/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "1c6971fa-8996-456f-b190-76e9feb41ac9",
        "url": "/v2/service_plans/1c6971fa-8996-456f-b190-76e9feb41ac9",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:38Z"
      },
      "entity": {
        "name": "xlarge-11",
        "free": false,
        "description": "2TB Storage, Dedicated Instance, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 11. DB Instance Class: db.m5.4xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 11 server", "Storage Encrypted", "AWS RDS"] }),
        "unique_id": "0cc655f7-337b-4caf-9544-cbea6f30ccd4",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/1c6971fa-8996-456f-b190-76e9feb41ac9/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    },
    {
      "metadata": {
        "guid": "c233e436-cf06-4d81-9530-4e5132a62c76",
        "url": "/v2/service_plans/c233e436-cf06-4d81-9530-4e5132a62c76",
        "created_at": "2020-01-29T11:15:23Z",
        "updated_at": "2020-01-29T11:15:38Z"
      },
      "entity": {
        "name": "xlarge-ha-11",
        "free": false,
        "description": "2TB Storage, Dedicated Instance, Highly Available, Storage Encrypted, Max 5000 Concurrent Connections. Postgres Version 11. DB Instance Class: db.m5.4xlarge.",
        "service_guid": "bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "extra": JSON.stringify({ "bullets": ["Dedicated Postgres 11 server", "Storage Encrypted", "AWS RDS"] }),
        "unique_id": "31cd6855-62b4-4786-925a-8df2c7f98f97",
        "public": true,
        "bindable": true,
        "plan_updateable": null,
        "active": true,
        "maximum_polling_duration": null,
        "maintenance_info": {},
        "service_url": "/v2/services/bb039bb8-3fe0-4beb-bef8-f1bffe427381",
        "service_instances_url": "/v2/service_plans/c233e436-cf06-4d81-9530-4e5132a62c76/service_instances",
        "schemas": {
          "service_instance": {
            "create": {
              "parameters": {}
            },
            "update": {
              "parameters": {}
            }
          },
          "service_binding": {
            "create": {
              "parameters": {}
            }
          }
        }
      }
    }
  ]
};

function mockCF(app: express.Application, config: IStubServerPorts): express.Application {
  const { apiPort } = config;

  const info = JSON.stringify({
    name: "",
    build: "",
    support: "https://youtu.be/ZZ5LpwO-An4",
    version: 0,
    description: "",
    authorization_endpoint: `http://0:${apiPort}`,
    token_endpoint: `http://0:${apiPort}`,
    min_cli_version: null,
    min_recommended_cli_version: null,
    app_ssh_endpoint: null,
    app_ssh_host_key_fingerprint: null,
    app_ssh_oauth_client: null,
    doppler_logging_endpoint: null,
    api_version: "2.128.0",
    osbapi_version: "2.14",
    user: "default-stub-api-user"
  });

  app.get('/v2/info', (_, res) => res.send(info));

  app.get('/v2/organizations/:guid',        (_, res) => res.send(JSON.stringify(defaultOrg())));
  app.get('/v2/organizations/:guid/spaces', (_, res) => res.send(testData.spaces));

  app.get('/v2/organizations', (_, res) => res.send(JSON.stringify(
    wrapResources(
      lodash.merge(defaultOrg(), {entity: {name: 'an-org'}}),
    ),
  )));
  app.get('/v3/organizations', (_, res) => res.send(JSON.stringify(
    wrapV3Resources(
      lodash.merge(defaultV3Org(), {name: 'an-org'}),
      lodash.merge(defaultV3Org(), {name: 'a-different-org', guid: 'a-different-org'}),
    ),
  )));

  app.get('/v2/quota_definitions'                    , (_, res) => res.send(testData.organizationQuotas));
  app.get('/v2/quota_definitions'                    , (_, res) => res.send(testData.organizationQuota));
  app.get('/v2/quota_definitions/:guid'              , (_, res) => res.send(testData.organizationQuota));

  app.get('/v2/spaces/:guid/apps', (_, res) => res.send(JSON.stringify(wrapResources(defaultApp()))));
  app.get('/v2/apps/:guid',        (_, res) => res.send(JSON.stringify(defaultApp())));

  app.get('/v2/apps/:guid/summary'                   , (_, res) => res.send(testData.appSummary));
  app.get('/v2/spaces/:guid'                         , (_, res) => res.send(testData.space));
  app.get('/v2/spaces/:guid/summary'                 , (_, res) => res.send(testData.spaceSummary));
  app.get('/v2/space_quota_definitions/:guid'        , (_, res) => res.send(testData.spaceQuota));
  app.get('/v2/spaces/:guid/service_instances'       , (_, res) => res.send(testData.services));
  app.get('/v2/service_instances/:guid'              , (_, res) => res.send(testData.serviceInstance));
  app.get('/v2/service_plans/:guid'                  , (_, res) => res.send(testData.servicePlan));
  app.get('/v2/services/:guid/service_plans'         , (_, res) => res.send(kek3));
  app.get('/v2/user_provided_service_instances'      , (_, res) => res.send(testData.userServices));
  app.get('/v2/user_provided_service_instances/:guid', (_, res) => res.send(testData.userServiceInstance));
  app.get('/v2/users/uaa-id-253/spaces'              , (_, res) => res.send(testData.spaces));
  app.get('/v2/users/uaa-id-253/summary'             , (_, res) => res.send(testData.userSummary));
  app.get('/v2/organizations/:guid/user_roles'       , (_, res) => res.send(testData.userRolesForOrg));
  app.get('/v2/spaces/:guid/user_roles'              , (_, res) => res.send(testData.userRolesForSpace));
  app.get('/v2/stacks'                               , (_, res) => res.send(testData.stacks));
  app.get('/v2/stacks/:guid'                         , (_, res) => res.send(testData.stack));
  
  app.get('/v3/service_offerings'                    , (_, res) => res.send(kek));
  app.get('/v3/service_offerings/:guid'              , (_, res) => res.send(kek2));
  app.get('/v3/audit_events/:guid' , (_, res) => res.send(JSON.stringify(defaultAuditEvent())));
  app.get('/v3/audit_events'       , (req, res) => {
    const page = parseInt(req.param('page', '1'), 10);

    const predefinedResources = [
      [lodash.merge(defaultAuditEvent(), {type: 'first-page'}), defaultAuditEvent()],
      [lodash.merge(defaultAuditEvent(), {type: 'middle-page'}), defaultAuditEvent()],
      [lodash.merge(defaultAuditEvent(), {type: 'last-page'}), defaultAuditEvent()],
    ];

    res.send(JSON.stringify({
      pagination: {
        total_pages: predefinedResources.length,
        total_results: lodash.flatten(predefinedResources).length,
        next: page === 3 ? undefined : { href: `/v3/audit_events?page=${page + 1}` },
      },
      resources: (1 <= page && page <= 3) ? predefinedResources[page - 1] : [],
    }));
  });

  return app;
}

export default mockCF;
