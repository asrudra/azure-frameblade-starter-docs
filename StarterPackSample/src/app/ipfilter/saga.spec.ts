import 'jest';
import { all, takeEvery } from 'redux-saga/effects';
import rootSaga from './saga';
import { fetchIpFiltersSaga } from './sagas/fetchIpFiltersSaga';
import { saveIpFiltersSaga } from './sagas/saveIpFiltersSaga';

describe('ipFIlter/saga/rootSaga', () => {
    it('runs saveIpFilterSaga and fetchIpFilterSaga in parallel', () => {
        const rootSagaGenerator = rootSaga();
        expect(rootSagaGenerator.next()).toEqual({
            done: false,
            value: all([
                takeEvery('IP_FILTER/FETCH_STARTED', fetchIpFiltersSaga),
                takeEvery('IP_FILTER/SAVE_STARTED', saveIpFiltersSaga)
            ])
        });

        expect(rootSagaGenerator.next().done).toEqual(true)
    });
});
