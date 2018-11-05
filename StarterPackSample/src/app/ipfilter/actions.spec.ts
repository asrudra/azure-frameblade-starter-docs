import 'jest';
import context from 'jest-plugin-context';
import { fetchIpFiltersAction, saveIpFiltersAction } from './actions';

describe('fetchIpFiltersAction', () => {
    context('fetchIpFiltersAction.started', () => {
        it('returns IP_FILTER/FETCH_STARTED action object', () => {
            expect(fetchIpFiltersAction.started().type).toEqual('IP_FILTER/FETCH_STARTED');
        });
    });

    context('fetchIpFiltersAction.done', () => {
        it('returns IP_FILTER/FETCH_DONE action object', () => {
            expect(fetchIpFiltersAction.done({ result: { filterRules: [] }})).toEqual({
                payload: {
                    result: {
                        filterRules: []
                    }
                },
                type: 'IP_FILTER/FETCH_DONE',
            });
        });
    });

    context('fetchIpFiltersAction.failed', () => {
        it('returns IP_FILTER/FETCH_FAILED action object', () => {
            expect(fetchIpFiltersAction.failed({ error: { code: -1 }})).toEqual({
                error: true,
                payload: {
                    error: {
                        code: -1
                    }
                },
                type: 'IP_FILTER/FETCH_FAILED',
            });
        });
    });
});

describe('saveIpFiltersAction', () => {
    context('saveIpFiltersAction.started', () => {
        it('returns IP_FILTER/SAVE_STARTED action object', () => {
            expect(saveIpFiltersAction.started({ filterRules: []})).toEqual({
                payload: {
                    filterRules: []
                },
                type: 'IP_FILTER/SAVE_STARTED'
            });
        });
    });

    context('saveIpFiltersAction.done', () => {
        it('returns IP_FILTER/SAVE_DONE action object', () => {
            expect(saveIpFiltersAction.done({ params: {}, result: { filterRules: [] }})).toEqual({
                payload: {
                    params: {},
                    result: {
                        filterRules: []
                    }
                },
                type: 'IP_FILTER/SAVE_DONE',
            });
        });
    });

    context('saveIpFiltersAction.failed', () => {
        it('returns IP_FILTER/SAVE_FAILED action object', () => {
            expect(saveIpFiltersAction.failed({ params: {}, error: { code: -1 }})).toEqual({
                error: true,
                payload: {
                    error: {
                        code: -1
                    },
                    params: {}
                },
                type: 'IP_FILTER/SAVE_FAILED',
            });
        });
    });
});
