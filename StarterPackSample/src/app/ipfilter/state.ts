import { IpFilterRule } from '@iotHubControlPlane/lib/models';
import { Record } from 'immutable';
import { IM, BaseState } from '../types';

export interface IpFilterInterface {
    filterRules: IpFilterRule[];
}

export interface IpFilterStateInterface extends BaseState, IpFilterInterface {}

export type IpFilterStateType = IM<IpFilterStateInterface>;

export const IpFilterStateInitial = Record<IpFilterStateInterface>({
    error: false,
    fetched: false,
    fetching: false,
    filterRules: []
});
