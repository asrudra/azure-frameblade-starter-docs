import { IotHubClient } from 'microsoft-azure-devices-iothub-controlplane20180401';
import { IotHubDescription } from '@iotHubControlPlane/lib/models';
import { getIotHubClientInstance } from './factories/iotHubClientFactory';
import { AzureResource } from './models/azureResource';

export interface GetIotHubDescriptionParameters {
    armEndpoint: string;
    authorizationToken: string;
    resource: AzureResource;
}
export function getIotHubDescription(parameters: GetIotHubDescriptionParameters): Promise<IotHubDescription> {
    
    const  client = getIotHubClientInstance({
        baseUri: parameters.armEndpoint,
        subscriptionId: parameters.resource.subscriptionId,
        token: parameters.authorizationToken
    });

    return client.iotHubResource.get(
        parameters.resource.resourceGroupName,
        parameters.resource.resourceName
    );
}

export interface UpdateIotHubDescriptionParameters {
    armEndpoint: string;
    authorizationToken: string;
    iotHubDescription: IotHubDescription;
    resource: AzureResource;
}
export function updateIotHubDescription(parameters: UpdateIotHubDescriptionParameters, iotHubClient?: IotHubClient): Promise<IotHubDescription> {

    const client = getIotHubClientInstance({
        baseUri: parameters.armEndpoint,
        subscriptionId: parameters.resource.subscriptionId,
        token: parameters.authorizationToken
    });
      
    return client.iotHubResource.createOrUpdate(
        parameters.resource.resourceGroupName,
        parameters.resource.resourceName,
        parameters.iotHubDescription
    );
}