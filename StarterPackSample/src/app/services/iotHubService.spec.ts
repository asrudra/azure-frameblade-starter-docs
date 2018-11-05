import 'jest';
import { IotHubSku, IotHubSkuTier  } from '@iotHubControlPlane/lib/models';
import { IotHubResource } from '@iotHubControlPlane/lib/operations/iotHubResource';
import { getIotHubDescription, updateIotHubDescription } from './iotHubService';

describe('iotHubService', () => {
    context('getIotHubDescription', () => {
        it ('executes iotHubResource.get', () => {
            const parameters = {
                armEndpoint: 'armEndpoint',
                authorizationToken: 'authorizationToken',
                resource: {
                    resourceGroupName: 'resourceGroupName',
                    resourceId: 'resourceId',
                    resourceName: 'resourceName',
                    subscriptionId: 'subscriptionId'
                }
            };

            const spy = jest.spyOn(IotHubResource.prototype, 'get');
            const result = getIotHubDescription(parameters);
            expect(spy).toHaveBeenCalledWith(parameters.resource.resourceGroupName, parameters.resource.resourceName);
        });
    });
    
    context('setIotHubDescription', () => {
        it ('executes iotHubResource.createOrUpdate', () => {
            const parameters = {
                armEndpoint: 'armEndpoint',
                authorizationToken: 'authorizationToken',
                iotHubDescription: {
                    etag: 'etag',
                    id: 'resourceId',
                    location: 'eastUS',
                    properties: {
                        ipFilterRules: []
                    },
                    sku: {
                        capacity: 100000,
                        name: IotHubSku.F1,
                        tier: IotHubSkuTier.Standard
                    }
                },
                resource: {
                    resourceGroupName: 'resourceGroupName',
                    resourceId: 'resourceId',
                    resourceName: 'resourceName',
                    subscriptionId: 'subscriptionId'
                }
            };

            const spy = jest.spyOn(IotHubResource.prototype, 'createOrUpdate');
            const result = updateIotHubDescription(parameters);
            expect(spy).toHaveBeenCalledWith(parameters.resource.resourceGroupName, parameters.resource.resourceName, parameters.iotHubDescription);
        });
    });
});