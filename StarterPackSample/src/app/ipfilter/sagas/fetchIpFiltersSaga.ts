import { IotHubDescription, IpFilterRule } from '@iotHubControlPlane/lib/models';
import { call, put, CallEffect } from 'redux-saga/effects';
import { fetchIpFiltersAction } from '../actions';
import { getIotHubSaga } from '../../shared/azureResource/sagas/iotHubClientSaga';

export function* getIpFiltersSaga(): IterableIterator<IpFilterRule[] | CallEffect | undefined> {
    const hub: IotHubDescription = yield call(getIotHubSaga);

    return hub.properties && hub.properties.ipFilterRules;
}

export function* fetchIpFiltersSaga() {
    try {
        const result = yield call(getIpFiltersSaga);
        yield put(fetchIpFiltersAction.done({
            result: {
                filterRules: result
            }
        }));
    } catch (e) {
        yield put(fetchIpFiltersAction.failed({error: {code: -1}}));
    }
}
