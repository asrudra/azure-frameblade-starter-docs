import { all, fork } from 'redux-saga/effects';
import ipFilterSaga from '../ipfilter/saga';
import azureSubscriptionSaga from '../azureSubscriptions/saga';

export default function* rootSaga() {
    yield all([
        fork(ipFilterSaga),
        fork(azureSubscriptionSaga)
    ]);
}