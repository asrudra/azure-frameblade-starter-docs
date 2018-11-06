import axios, { AxiosRequestConfig } from 'axios';
import { ContinuingResultSet } from './models/continuingResultSet';
import { AzureSubscription } from './models/azureSubscription';

export interface GetSubscriptionParameters {
    armEndpoint: string;
    authorizationToken: string;
    nextLink: string;
}
export function getAzureSubscriptions(parameters: GetSubscriptionParameters): Promise<ContinuingResultSet<AzureSubscription>> {
    const url: string = parameters.nextLink ? parameters.nextLink : `${parameters.armEndpoint}/subscriptions?api-version=2016-06-01`;
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${parameters.authorizationToken}`,
            ContentType: 'application/json'
        }
    };
    
    return axios.get(url, config)
        .then((response) => {
            return {
                items: response.data.value,
                nextLink: response.data.nextLink ? response.data.nextLink : '',
            };
        })
        .catch((error) => {
            throw Error(error);
        });
}
