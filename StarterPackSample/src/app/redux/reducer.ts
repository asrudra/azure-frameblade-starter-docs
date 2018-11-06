import { combineReducers, ReducersMapObject } from 'redux';
import azureSubscriptionsReducer from '../azureSubscriptions/reducers';
import { StateInterface } from '../types';

export const reducerMap: ReducersMapObject<StateInterface> = {
    azureSubscriptions: azureSubscriptionsReducer,
};

export default combineReducers(
    reducerMap
);