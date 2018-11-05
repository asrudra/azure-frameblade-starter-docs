import { call, put, CallEffect } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { IpFilterRule, IotHubDescription } from '@iotHubControlPlane/lib/models';
import { saveIpFiltersAction } from '../actions';
import { getIotHubSaga, updateIotHubSaga } from '../../shared/azureResource/sagas/iotHubClientSaga';
import { IpFilterInterface } from '../state';

export function* saveIpFilters(iPFilterRules: IpFilterRule[]): IterableIterator<IpFilterRule | CallEffect | undefined> {
    const hub: IotHubDescription = yield call(getIotHubSaga);

    if (!!hub.properties) {
        hub.properties.ipFilterRules = iPFilterRules;
    }

    const updated: IotHubDescription = yield call(updateIotHubSaga, hub);
    return updated.properties && updated.properties.ipFilterRules;
}

export function* saveIpFiltersSaga(action: Action<Partial<IpFilterInterface>>) {
    try {
        const result: IpFilterRule[] = yield call(saveIpFilters, action.payload.filterRules);
        yield put(saveIpFiltersAction.done({
            params: {},
            result: {
                filterRules: result
            }
        }));
    } catch (error) {
        yield put(saveIpFiltersAction.failed({
            error,
            params: {}
        }));
    }
}
