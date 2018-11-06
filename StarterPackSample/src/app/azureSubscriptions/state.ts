import { Record } from 'immutable';
import { IM, BaseState } from '../types';
import { AzureSubscription } from '../services/models/azureSubscription';

export interface AzureSubscriptionsInterface {
    azureSubscriptions: AzureSubscription[];
    nextLink: string;
}

export interface AzureSubscriptionsStateInterface extends BaseState, AzureSubscriptionsInterface {}
export type AzureSubscriptionsStateType = IM<AzureSubscriptionsStateInterface>;

export const AzureSubscriptionsStateInitial = Record<AzureSubscriptionsStateInterface>({
    azureSubscriptions: [],
    error: false,
    fetched: false,
    fetching: false,
    nextLink: ''
});