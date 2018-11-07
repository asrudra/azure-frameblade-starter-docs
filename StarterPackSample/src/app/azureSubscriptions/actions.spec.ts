import { clearAzureSubscriptionsAction, fetchAzureSubscriptionsAction } from './actions';

describe('clearAzureSubscriptionsAction', () => {
    context('clearAzureSubscriptionsAction', () => {
        it('returns AZURE_SUBSCRIPTIONS/CLEAR action object', () => {
            expect(clearAzureSubscriptionsAction.type).toEqual('AZURE_SUBSCRIPTIONS/CLEAR');
        });
    });
});

describe('fetchAzureSubscriptionsAction', () => {
    context('fetchAzureSubscriptions.started', () => {
        it('returns AZURE_SUBSCRIPTIONS/FETCH_STARTED action object', () => {
            expect(fetchAzureSubscriptionsAction.started({ nextLink: ''})).toEqual({
                payload: {
                    nextLink: ''
                },
                type: 'AZURE_SUBSCRIPTIONS/FETCH_STARTED'
            });
        });
    });

    context('fetchAzureSubscriptions.done', () => {
        it('returns AZURE_SUBSCRIPTIONS/FETCH_DONE action object', () => {
            expect(fetchAzureSubscriptionsAction.done({ params: {}, result: { azureSubscriptions: [], nextLink: '' }})).toEqual({
                payload: {
                    params: {},
                    result: {
                        azureSubscriptions: [],
                        nextLink: ''
                    }
                },
                type: 'AZURE_SUBSCRIPTIONS/FETCH_DONE',
            });
        });
    });

    context('fetchAzureSubscriptions.failed', () => {
        it('returns AZURE_SUBSCRIPTIONS/FETCH_FAILED action object', () => {
            expect(fetchAzureSubscriptionsAction.failed({ params: {}, error: { code: -1 }})).toEqual({
                error: true,
                payload: {
                    error: {
                        code: -1
                    },
                    params: {}
                },
                type: 'AZURE_SUBSCRIPTIONS/FETCH_FAILED',
            });
        });
    });
});
