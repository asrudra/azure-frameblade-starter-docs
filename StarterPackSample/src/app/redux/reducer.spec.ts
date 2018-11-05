import 'jest'; 
import rootReducer from './reducer';
import ipFilterReducer from '../ipfilter/reducers';
import { fetchIpFiltersAction, saveIpFiltersAction } from '../ipfilter/actions';
import { IpFilterStateInitial } from '../ipfilter/state';

describe('rootReducer', () => {
    context('ipFilter actions', () => {
        [fetchIpFiltersAction.started(), saveIpFiltersAction.started({filterRules: []})].forEach((action) => {
            it(`invokes ipFilterReducer on ${action.type}`, () => {
                expect(
                    rootReducer(
                        {
                            azureResource: null,
                            ipFilter: IpFilterStateInitial()
                        },
                        action
                    ).ipFilter
                ).toEqual(ipFilterReducer(IpFilterStateInitial(), action));
            }); 
        });
    });
});