import { all, fork } from 'redux-saga/effects';
import azureSubscriptionSaga from '../azureSubscriptions/saga';

export default function* rootSaga() {
    yield all([
        fork(azureSubscriptionSaga)
    ]);
}