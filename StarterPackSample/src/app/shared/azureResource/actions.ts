import { actionCreatorFactory } from 'typescript-fsa';
import { FETCH_SUFFIX, UPDATE_SUFFIX } from '../../constants';
import { AzureResourceInterface } from './state';

const AZURE_RESOURCE_ACTION_PREFIX = 'AZURE_RESOURCE';

const actionCreator = actionCreatorFactory(AZURE_RESOURCE_ACTION_PREFIX);

const fetchAzureResourceDataAction = actionCreator.async<{}, AzureResourceInterface, {}>(FETCH_SUFFIX);
const updateAzureResourceDataAction = actionCreator<Partial<AzureResourceInterface>>(UPDATE_SUFFIX);

export { fetchAzureResourceDataAction, updateAzureResourceDataAction };