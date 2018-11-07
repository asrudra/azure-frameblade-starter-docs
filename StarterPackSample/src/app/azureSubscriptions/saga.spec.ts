import { all, takeEvery } from 'redux-saga/effects';
import rootSaga from './saga';
import { fetchAzureSubscriptionsSaga } from './sagas/fetchAzureSubscriptionsSaga';

describe('azureSubscriptions/saga/rootSaga', () => {
    it('runs fetchAzureSubscriptionsSaga', () => {
        const rootSagaGenerator = rootSaga();
        expect(rootSagaGenerator.next()).toEqual({
            done: false,
            value: all([
                takeEvery('AZURE_SUBSCRIPTIONS/FETCH_STARTED', fetchAzureSubscriptionsSaga),
            ])
        });

        expect(rootSagaGenerator.next().done).toEqual(true);
    });
});
