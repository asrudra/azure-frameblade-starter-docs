import rootReducer from './reducer';
import azureSubscriptionsReducer from '../azureSubscriptions/reducers';
import { fetchAzureSubscriptionsAction, clearAzureSubscriptionsAction } from '../azureSubscriptions/actions';
import { AzureSubscriptionsStateInitial } from '../azureSubscriptions/state';

describe('rootReducer', () => {
    context('azureSubscriptions actions', () => {
        [fetchAzureSubscriptionsAction.started({ nextLink: ''}), clearAzureSubscriptionsAction].forEach((action) => {
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