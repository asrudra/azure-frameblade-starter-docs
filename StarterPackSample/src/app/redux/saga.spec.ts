import 'jest';
import { all, fork } from 'redux-saga/effects';
import rootSaga from './saga';
import ipFilterSaga from '../ipfilter/saga';

describe('saga', () => {
    it('runs ipFilterSaga in a fork', () => {
        const generator = rootSaga();

        expect(generator.next()).toEqual({
            done: false,
            value: all([fork(ipFilterSaga)])
        });

        expect(generator.next().done).toBeTruthy();
    });
});
