import actionCreatorFactory from 'typescript-fsa';
import { AzureSubscriptionsInterface } from './state';
import { FETCH_SUFFIX, CLEAR_SUFFIX } from '../constants';

const AZURE_SUBSCRIPTIONS_ACTION_PREFIX = 'AZURE_SUBSCRIPTIONS';
const actionCreator = actionCreatorFactory(AZURE_SUBSCRIPTIONS_ACTION_PREFIX);

const clearAzureSubscriptionsAction = actionCreator<void>(CLEAR_SUFFIX);
const fetchAzureSubscriptionsAction = actionCreator.async<Partial<AzureSubscriptionsInterface>, AzureSubscriptionsInterface, {code: number}>(FETCH_SUFFIX);

export { clearAzureSubscriptionsAction, fetchAzureSubscriptionsAction };