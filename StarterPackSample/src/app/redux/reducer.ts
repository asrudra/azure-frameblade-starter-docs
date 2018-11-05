import { combineReducers, ReducersMapObject } from 'redux';
import ipFilterReducer from '../ipfilter/reducers';
import azureResourceReducer from '../shared/azureResource/reducers';
import { StateInterface } from '../types';

export const reducerMap: ReducersMapObject<StateInterface> = {
    azureResource: azureResourceReducer,
    ipFilter: ipFilterReducer
};

export default combineReducers(
    reducerMap
);