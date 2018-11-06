import { all, fork } from 'redux-saga/effects';
import rootSaga from './saga';
import azureSubscriptionsSaga from '../azureSubscriptions/saga';

describe('saga', () => {
    it('runs azureSubscriptionsSaga in a fork', () => {
        const generator = rootSaga();

        expect(generator.next()).toEqual({
            done: false,
            value: all([fork(azureSubscriptionsSaga)])
        });

        expect(generator.next().done).toBeTruthy();
    });
});
