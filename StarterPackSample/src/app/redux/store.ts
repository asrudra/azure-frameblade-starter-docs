import { createLogger } from 'redux-logger';
import * as Immutable from 'immutable';
import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducer';
import rootSaga from './saga';
import { StateInterface } from '../types';

const middlewares = [];

if (process.env.NODE_ENV === `development`) {
    const stateTransformer = (state: StateInterface) => {
        const s = Immutable.fromJS(state);
        return s.toJS();
    };

    const logger = createLogger({
        stateTransformer
    });

    middlewares.push(logger);
}

const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(...middlewares)
    )
);
sagaMiddleware.run(rootSaga);

export default store;