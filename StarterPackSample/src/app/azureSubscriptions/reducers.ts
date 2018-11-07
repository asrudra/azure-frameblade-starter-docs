import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { AzureSubscriptionsStateType, AzureSubscriptionsStateInitial } from './state';
import { fetchAzureSubscriptionsAction, clearAzureSubscriptionsAction } from './actions';

const reducer = reducerWithInitialState<AzureSubscriptionsStateType>(AzureSubscriptionsStateInitial())

    .case(clearAzureSubscriptionsAction, (state: AzureSubscriptionsStateType) => {
        return state.merge({
            azureSubscriptions: [],
            nextLink: ''
        });
    })
    .case(fetchAzureSubscriptionsAction.started, (state: AzureSubscriptionsStateType) => {
        return state.merge({
            fetched: false,
            fetching: true
        });
    })
    .case(fetchAzureSubscriptionsAction.done, (state: AzureSubscriptionsStateType, payload: any) => { // tslint:disable-line: no-any

        const newArray = [...state.azureSubscriptions, ...payload.result.azureSubscriptions];
        return state.merge({
            azureSubscriptions: newArray,
            error: false,
            fetched: true,
            fetching: false,
            nextLink: payload.result.nextLink            
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