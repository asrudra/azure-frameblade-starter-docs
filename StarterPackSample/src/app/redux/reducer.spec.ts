import rootReducer from './reducer';
import azureSubscriptionsReducer from '../azureSubscriptions/reducers';
import { fetchAzureSubscriptionsAction } from '../azureSubscriptions/actions';
import { AzureSubscriptionsStateInitial } from '../azureSubscriptions/state';

describe('rootReducer', () => {
    context('azureSubscriptions actions', () => {
        [fetchAzureSubscriptionsAction.started()].forEach((action) => {
            it(`invokes azure subscriptions reducer on ${action.type}`, () => {
                expect(
                    rootReducer(
                        {
                            azureSubscriptions: AzureSubscriptionsStateInitial()
                        },
                        action
                    ).azureSubscriptions
                ).toEqual(azureSubscriptionsReducer(AzureSubscriptionsStateInitial(), action));
            }); 
        });
    });
});