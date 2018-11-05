import actionCreatorFactory from 'typescript-fsa';
import { IpFilterInterface } from './state';
import { FETCH_SUFFIX, SAVE_SUFFIX } from '../constants';

const IP_FILTER_ACTION_PREFIX = 'IP_FILTER';

const actionCreator = actionCreatorFactory(IP_FILTER_ACTION_PREFIX);

const fetchIpFiltersAction = actionCreator.async<void, IpFilterInterface, {code: number}>(FETCH_SUFFIX);
const saveIpFiltersAction = actionCreator.async<Partial<IpFilterInterface>, IpFilterInterface, {code: number}>(SAVE_SUFFIX);

export { fetchIpFiltersAction, saveIpFiltersAction };