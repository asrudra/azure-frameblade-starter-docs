import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { AzureSubscriptionsStateType, AzureSubscriptionsStateInitial } from './state';
import { fetchAzureSubscriptionsAction } from './actions';

const reducer = reducerWithInitialState<AzureSubscriptionsStateType>(AzureSubscriptionsStateInitial())
    .case(fetchAzureSubscriptionsAction.started, (state: AzureSubscriptionsStateType) => {
        return state.merge({
            fetched: false,
            fetching: true
        });
    })
    .case(fetchAzureSubscriptionsAction.done, (state: AzureSubscriptionsStateType, payload: any) => { // tslint:disable-line: no-any
        return state.merge({
            azureSubscriptions: payload.result.azureSubscriptions,
            error: false,
            fetched: true,
            fetching: false,
            
        });
    })
    .case(fetchAzureSubscriptionsAction.failed, (state: AzureSubscriptionsStateType) => {
        return state.merge({
            error: true,
            fetched: false,
            fetching: false
        });
    });
    
export default reducer;