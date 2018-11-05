import reducer from './reducers';
import { fetchIpFiltersAction, saveIpFiltersAction } from './actions';

describe('ipFilter/reducers', () => {
    it('handles IP_FILTER/FETCH_STARTED action', () => {
        const action = fetchIpFiltersAction.started();

        expect(reducer(undefined, action).toJS()).toEqual({
            error: false,
            fetched: false,
            fetching: true,
            filterRules: []
        });
    });

    it('handles IP_FILTER/FETCH_DONE action', () => {
        const action = fetchIpFiltersAction.done({
            result: {
                filterRules: [{
                    ipMask: '123.123.123.1/22',
                    name: 'filter-one'
                }]
            }
        });

        expect(reducer(undefined, action).toJS()).toEqual({
            error: false,
            fetched: true,
            fetching: false,
            filterRules: action.payload.result.filterRules
        });
    });

    it('handles IP_FILTER/FETCH_FAILED action', () => {
        const action = fetchIpFiltersAction.failed({
            error: {
                code: -1
            }
        });

        expect(reducer(undefined, action).toJS()).toEqual({
            error: true,
            fetched: false,
            fetching: false,
            filterRules: []
        });
    });

    it('handles IP_FILTER/SAVE_STARTED action', () => {
        const action = saveIpFiltersAction.started({});

        expect(reducer(undefined, action).toJS()).toEqual({
            error: false,
            fetched: false,
            fetching: true,
            filterRules: []
        });
    });

    it('handles IP_FILTER/SAVE_DONE action', () => {
        const action = saveIpFiltersAction.done({
            params: {},
            result: {
                filterRules: [{
                    ipMask: '123.123.123.1/22',
                    name: 'filter-one'
                }]
            }
        });

        expect(reducer(undefined, action).toJS()).toEqual({
            error: false,
            fetched: true,
            fetching: false,
            filterRules: action.payload.result.filterRules
        });
    });

    it('handles IP_FILTER/SAVE_FAILED action', () => {
        const action = saveIpFiltersAction.failed({
            error: {
                code: -1
            },
            params: {}
        });

        expect(reducer(undefined, action).toJS()).toEqual({
            error: true,
            fetched: false,
            fetching: false,
            filterRules: []
        });
    });
});