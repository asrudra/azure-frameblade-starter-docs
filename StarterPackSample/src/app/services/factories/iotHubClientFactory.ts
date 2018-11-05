import { IotHubClient } from '@iotHubControlPlane/lib/iotHubClient';
import { TokenCredentials } from 'ms-rest-js';

interface ClientInstance {
    client: IotHubClient;
    token: string;
}

export interface NewIotHubClientParameters {
    baseUri?: string;
    subscriptionId: string;
    token: string;
    tokenType?: string;
}

const iotHubClientInstances: Map<string, ClientInstance> = new Map<string, ClientInstance>();
export function getIotHubClientInstance(parameters: NewIotHubClientParameters): IotHubClient {
    let clientInstance = iotHubClientInstances.get(parameters.subscriptionId);
    if (!clientInstance || clientInstance.token !== parameters.token) {
        clientInstance = {
            client: generateClient(parameters),
            token: parameters.token
        };
        iotHubClientInstances.set(parameters.subscriptionId, clientInstance);
    }

    return clientInstance.client;
}

function generateClient(parameters: NewIotHubClientParameters) {
    const tokenCredentials = new TokenCredentials(parameters.token, !parameters.tokenType ? 'Bearer' : parameters.tokenType);
    if (!parameters.baseUri) { 
        return new IotHubClient(tokenCredentials, parameters.subscriptionId);
    }

    return new IotHubClient(tokenCredentials, parameters.subscriptionId, parameters.baseUri);
}