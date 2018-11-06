import { all, takeEvery } from 'redux-saga/effects';
import { fetchAzureSubscriptionsAction } from './actions';
import { fetchAzureSubscriptionsSaga } from './sagas/fetchAzureSubscriptionsSaga';

export default function* rootSaga() {
    yield all([
        takeEvery(fetchAzureSubscriptionsAction.started.type, fetchAzureSubscriptionsSaga),
    ]);
}