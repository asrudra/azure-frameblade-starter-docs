import { createSelector, Selector } from 'reselect';
import { IM } from '../types';
import { AzureSubscriptionsStateInterface } from './state';
import { AzureSubscription } from '../services/models/azureSubscription';

const getAzureSubscriptions: Selector<IM<AzureSubscriptionsStateInterface>, AzureSubscription[]> = (state) => state.get('azureSubscriptions', false);
const getFetchingStatus: Selector<IM<AzureSubscriptionsStateInterface>, boolean> = (state) => state.get('fetching', false);
const getFetchedStatus: Selector<IM<AzureSubscriptionsStateInterface>, boolean> = (state) => state.get('fetched', false);
const getErrorStatus: Selector<IM<AzureSubscriptionsStateInterface>, boolean> = (state) => state.get('error', false);

export const getAzureSubscriptionsSelector = createSelector(
    [getAzureSubscriptions],
    (azureSubscriptions) => {
        return azureSubscriptions;
    }
);

export const getFetchingStatusSelector = createSelector(
    [getFetchingStatus],
    (fetching) => {
        return fetching;
    }
);

export const getFetchedStatusSelector = createSelector(
    [getFetchedStatus],
    (fetched) => {
        return fetched;
    }
);

export const getErrorStatusSelector = createSelector(
    [getErrorStatus],
    (error) => {
        return error;
    }
);