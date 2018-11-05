import { Subscription } from '../shared/models/subscription';

export interface GetSubscriptionParameters {
    apiVersion: string;
    authorizationToken: string;
}
export function getSubscriptions(getSubscriptionParameters: GetSubscriptionParameters): Promise<Subscription[]> {
    throw Error('not implemented');
}
