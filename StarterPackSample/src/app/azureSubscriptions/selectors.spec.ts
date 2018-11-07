import { getAzureSubscriptionsSelector, getFetchedStatusSelector, getFetchingStatusSelector, getErrorStatusSelector, getNextLinkSelector } from './selectors';
import { AzureSubscriptionsStateInitial } from './state';
import { AzureSubscription } from '../services/models/azureSubscription';

describe('getAzureSubscriptionsSelector', () => {
    it('return array from state', () => {
        const azureSubscriptions: AzureSubscription[] = [
            { id: '1'},
            { id: '1'}
        ];
        const state = AzureSubscriptionsStateInitial({
           azureSubscriptions
        });

        expect(getAzureSubscriptionsSelector(state)).toEqual(azureSubscriptions);
    });
});

describe('getFetchingStatusSelector', () => {
    it('returns value of fetching', () => {
        const fetching = Math.random() >= 0.5;
        const state = AzureSubscriptionsStateInitial({
            fetching
        });

        expect(getFetchingStatusSelector(state)).toEqual(fetching);
    });
});

describe('getFetchedStatusSelector', () => {
    it('returns value of fetched', () => {
        const fetched = Math.random() >= 0.5;
        const state = AzureSubscriptionsStateInitial({
            fetched
        });

        expect(getFetchedStatusSelector(state)).toEqual(fetched);
    });
});

describe('getErrorStatusSelector', () => {
    it('returns error value', () => {
        const error = Math.random() >= 0.5;
        const state = AzureSubscriptionsStateInitial({
            error
        });

        expect(getErrorStatusSelector(state)).toEqual(error);
    });
});

describe('getNextLinkSelector', () => {
    it('return array from state', () => {
        const nextLink: string = 'nextLink1';
        const state = AzureSubscriptionsStateInitial({
            nextLink
        });

        expect(getNextLinkSelector(state)).toEqual(nextLink);
    });
});