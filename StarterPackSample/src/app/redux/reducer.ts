import { combineReducers, ReducersMapObject } from 'redux';
import ipFilterReducer from '../ipfilter/reducers';
import azureResourceReducer from '../shared/azureResource/reducers';
import azureSubscriptionsReducer from '../azureSubscriptions/reducers';
import { StateInterface } from '../types';

export const reducerMap: ReducersMapObject<StateInterface> = {
    azureResource: azureResourceReducer,
    azureSubscriptions: azureSubscriptionsReducer,
    ipFilter: ipFilterReducer
};

export default combineReducers(
    reducerMap
);