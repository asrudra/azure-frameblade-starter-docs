import { all, fork } from 'redux-saga/effects';
import ipFilterSaga from '../ipfilter/saga';

export default function* rootSaga() {
    yield all([
        fork(ipFilterSaga)
    ]);
}