import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { AzureResourceStateInitial, AzureResourceInterface, AzureResourceStateType } from './state';
import { updateAzureResourceDataAction } from './actions';

const reducer = reducerWithInitialState<AzureResourceStateType>(AzureResourceStateInitial())
    .case(updateAzureResourceDataAction, (state: AzureResourceStateType, payload: Partial<AzureResourceInterface>) => {
        return state.merge({
            authorizationToken: payload.authorizationToken,
            resourceGroupName: payload.resourceGroupName,
            resourceId: payload.resourceId,
            resourceName: payload.resourceName,
            subscriptionId: payload.subscriptionId,
            timeStamp: payload.timeStamp
        });
    });

export default reducer;
