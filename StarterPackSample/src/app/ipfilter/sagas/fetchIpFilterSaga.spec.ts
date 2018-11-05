import 'jest';
import context from 'jest-plugin-context';
import { cloneableGenerator } from 'redux-saga/utils';
import { call, put } from 'redux-saga/effects';
import { IpFilterActionType, IpFilterRule } from '@iotHubControlPlane/lib/models';
import { fetchIpFiltersSaga, getIpFiltersSaga } from './fetchIpFiltersSaga';
import { getIotHubSaga } from '../../shared/azureResource/sagas/iotHubClientSaga';

describe('fetchIpFilterSaga', () => {
    const fetchIpFilterSagaGenerator = cloneableGenerator(fetchIpFiltersSaga)();

    it('creates call effect for getIpFiltersSaga', () => {
        expect(fetchIpFilterSagaGenerator.next()).toEqual({
            done: false,
            value: call(getIpFiltersSaga)
        });
    });

    context('successful fetch', () => {
        it('dispatches put effect for IP_FILTER/FETCH_DONE action after getting ipFilters through getIpFiltersSaga', () => {
            const generator = fetchIpFilterSagaGenerator.clone();
            const mockIpFilteRules: IpFilterRule[] = [
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

            expect(generator.next(mockIpFilteRules)).toEqual({
                done: false,
                value: put({
                    payload: {
                        result: {
                            filterRules: mockIpFilteRules
                        }
                    },
                    type: 'IP_FILTER/FETCH_DONE'
                })
            });

            expect(generator.next().done).toBeTruthy();
        });
    });

    context('unsuccessful fetch', () => {
        it('dispatches put effect for IP_FILTERS/FETCH_FAILED action if getIpFiltersSaga throws error', () => {
            const generator = fetchIpFilterSagaGenerator.clone();
            const error = {code: -1};

            expect(generator.throw(error)).toEqual({
                done: false,
                value: put({
                    error: true,
                    payload: {
                        error
                    },
                    type: 'IP_FILTER/FETCH_FAILED'
                })
            });

            expect(generator.next().done).toBeTruthy();
        });
    });
});

describe('getIpFiltersSaga', () => {
    const getIpFiltersSagaGenerator = getIpFiltersSaga();
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

    it('creates call effect for getIotHubSaga', () => {
        expect(getIpFiltersSagaGenerator.next()).toEqual({
            done: false,
            value: call(getIotHubSaga)
        });
    });

    it('returns ipFilters', () => {
        const hub = {
            properties: {
                ipFilterRules: mockIpFilterRules
            }
        };

        expect(getIpFiltersSagaGenerator.next(hub)).toEqual({
            done: true,
            value: mockIpFilterRules
        });
    });
});
