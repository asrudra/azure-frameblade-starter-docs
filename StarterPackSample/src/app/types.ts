import { Record } from 'immutable';
import { Reducer } from 'redux';
import { AzureResourceInterface } from './shared/azureResource/state';
import { IpFilterStateInterface } from './ipfilter/state';

export type IM<T> = Record<T> & Readonly<T>;
// tslint:disable:no-any
export type func = (...args: any[]) => any;
// tslint:enable:no-any
export type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends func ? K : never }[keyof T];
export type NonFunctionPropertyNames<T> = { [K in keyof T ]: T[K] extends func ? never: K }[keyof T];
export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
type StateInterfaceItem<T> = IM<T> | Reducer<IM<T>>;

export interface BaseState {
    error: boolean;
    fetched: boolean;
    fetching: boolean;
}

export interface StateInterface {
    azureResource: StateInterfaceItem<AzureResourceInterface>;
    ipFilter: StateInterfaceItem<IpFilterStateInterface>;
}