import { call, put } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { AzureSubscription } from '../../services/models/azureSubscription';
import { AzureSubscriptionsInterface } from '../state';
import { ContinuingResultSet } from '../../services/models/continuingResultSet';
import { clearAzureSubscriptionsAction, fetchAzureSubscriptionsAction } from '../actions';
import { getSetting } from '../../services/portalEnvironmentService';
import { getAzureSubscriptions } from '../../services/azureService';
import { EnvironmentSettingNames } from '../../services/models/environmentSettingNames';

export function* fetchAzureSubscriptionsSaga(action: Action<Partial<AzureSubscriptionsInterface>>) {
   
    if (!action.payload.nextLink) {
        put(clearAzureSubscriptionsAction);
    }

    const authorizationToken = yield call(getSetting, EnvironmentSettingNames.AUTHORIZATION_TOKEN);
    const armEndpoint = yield call(getSetting, EnvironmentSettingNames.ARM_ENDPOINT);
   
    try {
        const resultSet: ContinuingResultSet<AzureSubscription> = yield call(getAzureSubscriptions, {
            armEndpoint,
            authorizationToken,
            nextLink: action.payload.nextLink                
        });

        yield put(fetchAzureSubscriptionsAction.done({
            params: action.payload,
            result: {
                azureSubscriptions: resultSet.items,
                nextLink: resultSet.nextLink
            }
        }));
    } catch (e) {
        yield put(fetchAzureSubscriptionsAction.failed({
            error: { code: -1 },
            params: action.payload
        }));
    }
}
