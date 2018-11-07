import reducer from './reducers';
import { clearAzureSubscriptionsAction, fetchAzureSubscriptionsAction } from './actions';

describe('azureSubscriptions/reducers', () => {
    it('handles AZURE_SUBSCRIPTIONS/CLEAR action', () => {
        const action = clearAzureSubscriptionsAction;

        expect(reducer(undefined, action).toJS()).toEqual({
            azureSubscriptions: [],
            error: false,
            fetched: false,
            fetching: false,
            nextLink: ''
        });
    });

    it('handles AZURE_SUBSCRIPTIONS/FETCH_STARTED action', () => {
        const action = fetchAzureSubscriptionsAction.started({ nextLink: ''});

        expect(reducer(undefined, action).toJS()).toEqual({
            azureSubscriptions: [],
            error: false,
            fetched: false,
            fetching: true,
            nextLink: ''
        });
    });

    it('handles AZURE_SUBSCRIPTIONS/FETCH_DONE action', () => {

        const action = fetchAzureSubscriptionsAction.done({
            params: {},
            result: {
                azureSubscriptions: [ { id: '12' }],
                nextLink: 'nextLink'
            }
        });

        expect(reducer(undefined, action).toJS()).toEqual({
            azureSubscriptions: action.payload.result.azureSubscriptions,
            error: false,
            fetched: true,
            fetching: false,
            nextLink: action.payload.result.nextLink
        });
    });

    it('handles AZURE_SUBSCRIPTIONS/FETCH_FAILED action', () => {
        const action = fetchAzureSubscriptionsAction.failed({
            error: {
                code: -1
            },
            params: {}
        });

        expect(reducer(undefined, action).toJS()).toEqual({
            azureSubscriptions: [],
            error: true,
            fetched: false,
            fetching: false,
            nextLink: ''
        });
    });
});