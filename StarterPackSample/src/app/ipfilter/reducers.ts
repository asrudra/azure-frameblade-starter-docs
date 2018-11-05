import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { IpFilterStateInitial, IpFilterStateType } from './state';
import { fetchIpFiltersAction, saveIpFiltersAction } from './actions';

const reducer = reducerWithInitialState<IpFilterStateType>(IpFilterStateInitial())
    .case(fetchIpFiltersAction.started, (state: IpFilterStateType) => {
        return state.merge({
            fetched: false,
            fetching: true
        });
    })
    .case(fetchIpFiltersAction.done, (state: IpFilterStateType, payload: any) => { // tslint:disable-line: no-any
        return state.merge({
            error: false,
            fetched: true,
            fetching: false,
            filterRules: payload.result.filterRules
        });
    })
    .case(fetchIpFiltersAction.failed, (state: IpFilterStateType) => {
        return state.merge({
            error: true,
            fetched: false,
            fetching: false
        });
    })
    .case(saveIpFiltersAction.started, (state: IpFilterStateType) => {
        return state.merge({
            fetched: false,
            fetching: true
        });
    })
    .case(saveIpFiltersAction.done, (state: IpFilterStateType, payload: any) => { // tslint:disable-line: no-any
        return state.merge({
            error: false,
            fetched: true,
            fetching: false,
            filterRules: payload.result.filterRules
        });
    })
    .case(saveIpFiltersAction.failed, (state: IpFilterStateType) => {
        return state.merge({
            error: true,
            fetched: false,
            fetching: false
        });
    });

export default reducer;