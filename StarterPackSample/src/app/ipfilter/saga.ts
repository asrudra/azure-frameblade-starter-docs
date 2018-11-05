import { all, takeEvery } from 'redux-saga/effects';
import { saveIpFiltersAction, fetchIpFiltersAction } from './actions';
import { fetchIpFiltersSaga } from './sagas/fetchIpFiltersSaga';
import { saveIpFiltersSaga } from './sagas/saveIpFiltersSaga';

export default function* rootSaga() {
    yield all([
        takeEvery(fetchIpFiltersAction.started.type, fetchIpFiltersSaga),
        takeEvery(saveIpFiltersAction.started.type, saveIpFiltersSaga)
    ]);
}