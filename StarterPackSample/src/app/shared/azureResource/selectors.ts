import { Selector } from 'reselect';
import { AzureResourceInterface } from './state';
import { IM, StateInterface } from '../../types';

export const getAzureResourceSelector: Selector<StateInterface, AzureResourceInterface> =
    (state) => {
        const resourceState = state.azureResource as IM<AzureResourceInterface>;
        return resourceState.toObject();
    };
