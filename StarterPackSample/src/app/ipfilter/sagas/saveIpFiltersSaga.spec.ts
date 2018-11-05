import 'jest';
import context from 'jest-plugin-context';
import { cloneableGenerator } from 'redux-saga/utils';
import { call, put } from 'redux-saga/effects';
import { IpFilterActionType, IpFilterRule } from '@iotHubControlPlane/lib/models';
import { saveIpFiltersSaga, saveIpFilters } from './saveIpFiltersSaga';
import { getIotHubSaga, updateIotHubSaga } from '../../shared/azureResource/sagas/iotHubClientSaga';
import { saveIpFiltersAction } from '../actions';

describe('saveIpFiltersSaga', () => {
    const mockIpFilterRules: IpFilterRule[] = [
        {
            action: IpFilterActionType.Accept,
            filterName: 'filter_one',
            ipMask: '127.127.123.1/28',
        },
        {
            action: IpFilterActionType.Reject,
            filterName: 'filter_two',
            ipMask: '127.127.123.2/20',
        }
    ];

    const saveIpFiltersSagaGenerator = cloneableGenerator(saveIpFiltersSaga)(saveIpFiltersAction.started({filterRules: mockIpFilterRules}));

    it('creates call effect for saveIpFilters saga', () => {
        expect(saveIpFiltersSagaGenerator.next()).toEqual({
            done: false,
            value: call(saveIpFilters, mockIpFilterRules)
        });
    });

    context('successful fetch', () => {
        it('dispatches put effect for IP_FILTER/SAVE_DONE action after saving ipFilters through saveIpFilters saga', () => {
            const generator = saveIpFiltersSagaGenerator.clone();
            expect(generator.next(mockIpFilterRules)).toEqual({
                done: false,
                value: put({
                    payload: {
                        params: {},
                        result: {
                            filterRules: mockIpFilterRules
                        }
                    },
                    type: 'IP_FILTER/SAVE_DONE'
                })
            });

            expect(generator.next().done).toBeTruthy();
        });
    });

    context('unsuccessful fetch', () => {
        it('dispatches put effect for IP_FILTERS/SAVE_FAILED action if saveIpFilters saga throws error', () => {
            const generator = saveIpFiltersSagaGenerator.clone();
            const error = { code: -1 };

            expect(generator.throw(error)).toEqual({
                done: false,
                value: put({
                    error: true,
                    payload: {
                        error,
                        params: {}
                    },
                    type: 'IP_FILTER/SAVE_FAILED'
                })
            });

            expect(generator.next().done).toBeTruthy();
        });
    });
});

describe('saveIpFilters', () => {
    const mockIpFilterRules: IpFilterRule[] = [
        {
            action: IpFilterActionType.Accept,
            filterName: 'filter_one',
            ipMask: '127.127.123.1/28',
        },
        {
            action: IpFilterActionType.Reject,
            filterName: 'filter_two',
            ipMask: '127.127.123.2/20',
        }
    ];

    const hub = {
        properties: {
            ipFilterRules: mockIpFilterRules
        }
    };

    const saveIpFiltersGenerator = saveIpFilters(mockIpFilterRules);

    it('creates call effect for getIotHubsaga', () => {
        expect(saveIpFiltersGenerator.next()).toEqual({
            done: false,
            value: call(getIotHubSaga)
        });
    });

    it('creates call effect to updateIotHubSaga with hub information', () => {
        expect(saveIpFiltersGenerator.next(hub)).toEqual({
            done: false,
            value: call(updateIotHubSaga, hub)
        });
    });

    it('returns updated ipFilterRules', () => {
        expect(saveIpFiltersGenerator.next(hub)).toEqual({
            done: true,
            value: mockIpFilterRules
        });
    });
});