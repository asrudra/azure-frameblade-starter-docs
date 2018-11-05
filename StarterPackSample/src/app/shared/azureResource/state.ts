import { Record } from 'immutable';
import { AzureResource } from '../../services/models/azureResource';
import { IM } from '../../types';

const OFFSET_IN_MINUTES = 15;

export interface AzureResourceInterface extends AzureResource {
    authorizationToken: string;
    timeStamp: number;
}

export type AzureResourceStateType = IM<AzureResourceInterface>;

export const AzureResourceStateInitial = Record<AzureResourceInterface>({
    authorizationToken: '',
    resourceGroupName: '',
    resourceId: '',
    resourceName: '',
    subscriptionId: '',
    timeStamp: new Date().getTime() - (OFFSET_IN_MINUTES * 60 * 1000)
});