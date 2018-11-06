import actionCreatorFactory from 'typescript-fsa';
import { AzureSubscriptionsInterface } from './state';
import { FETCH_SUFFIX } from '../constants';

const AZURE_SUBSCRIPTIONS_ACTION_PREFIX = 'AZURE_SUBSCRIPTIONS';

const actionCreator = actionCreatorFactory(AZURE_SUBSCRIPTIONS_ACTION_PREFIX);
const fetchAzureSubscriptionsAction = actionCreator.async<void, AzureSubscriptionsInterface, {code: number}>(FETCH_SUFFIX);

export { fetchAzureSubscriptionsAction };