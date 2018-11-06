import { call, put, CallEffect } from 'redux-saga/effects';
import { getAzureSubscriptions } from '../../services/azureService';
import { getSetting } from '../../services/portalEnvironmentService';
import { EnvironmentSettingNames } from '../../services/models/environmentSettingNames';
import { fetchAzureSubscriptionsAction } from '../actions';
import { AzureSubscription } from '../../services/models/azureSubscription';
import { ContinuingResultSet } from '../../services/models/continuingResultSet';

function* getAzureSubscriptionsSaga(): IterableIterator<ContinuingResultSet<AzureSubscription> | CallEffect | undefined> {
    
    const authorizationToken = yield call(getSetting, EnvironmentSettingNames.AUTHORIZATION_TOKEN);
    const armEndpoint = yield call(getSetting, EnvironmentSettingNames.ARM_ENDPOINT);
    const resultSet: ContinuingResultSet<AzureSubscription> = yield call(getAzureSubscriptions, {
        armEndpoint,
        authorizationToken,
        nextLink: ''                
    });

    return resultSet;
}

export function* fetchAzureSubscriptionsSaga() {
    try {
        const result = yield call(getAzureSubscriptionsSaga);
        yield put(fetchAzureSubscriptionsAction.done({
            result: {
                azureSubscriptions: result.items,
                nextLink: result.nextLink
            }
        }));
    } catch (e) {
        yield put(fetchAzureSubscriptionsAction.failed({error: {code: -1}}));
    }
}
