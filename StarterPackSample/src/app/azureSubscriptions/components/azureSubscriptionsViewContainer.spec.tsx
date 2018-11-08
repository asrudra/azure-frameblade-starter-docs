
import { Record } from 'immutable';
import { mapStateToProps, mapDispatchToProps } from './azureSubscriptionsViewContainer';
import * as selectors from '../selectors';
import { StateInterface } from '../../types';

const state: StateInterface = {
    azureSubscriptions: Record({
        azureSubscriptions: [],
        error: false,
        fetched: false,
        fetching: false,
        nextLink: ''           
    })
};

const subscriptions = [
    { id: 'one'},
    { id: 'two'},
];

describe('generateMessage', () => {
    beforeAll(() => {
        jest.spyOn(selectors, 'getAzureSubscriptionsSelector').mockReturnValue(subscriptions);
        jest.spyOn(selectors, 'getNextLinkSelector').mockReturnValue('nextLink');
        jest.spyOn(selectors, 'getFetchedStatusSelector').mockReturnValue(true);
        jest.spyOn(selectors, 'getFetchingStatusSelector').mockReturnValue(true);
        jest.spyOn(selectors, 'getErrorStatusSelector').mockReturnValue(true);
    });

    it('assigns state to props', () => {
        const result = mapStateToProps(state, null);
        expect(result.azureSubscriptions).toEqual(subscriptions);
        expect(result.nextLink).toEqual('nextLink');
        expect(result.errorFetchingAzureSubscriptions).toEqual(true);
        expect(result.hasFetchedAzureSubscriptions).toEqual(true);
        expect(result.isFetchingAzureSubscriptions).toEqual(true);
    });

    it('assigns dispatch to props', () => {
        const dispatch = jest.fn();
        mapDispatchToProps(dispatch).fetchAzureSubscriptions('nextLink1');
        expect(dispatch.mock.calls[0][0]).toEqual({ 
            payload: {
                nextLink: 'nextLink1'
            },
            type: 'AZURE_SUBSCRIPTIONS/FETCH_STARTED'
        });
    });
});
