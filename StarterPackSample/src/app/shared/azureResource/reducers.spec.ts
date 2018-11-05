import reducer from './reducers';
import { updateAzureResourceDataAction } from './actions';

describe('azureResouce/reducers', () => {
    it('handles AZURE_RESOURCE/UPDATE action', () => {
        const action = updateAzureResourceDataAction({
            authorizationToken: 'AUTH_TOKEN',
            resourceGroupName: 'RESOURCE_GROUP_NAME',
            resourceId: 'RESOURCE_ID',
            resourceName: 'RESOURCE_NAME',
            subscriptionId: 'SUBSCRIPTION_ID',
            timeStamp: new Date().getTime()
        });

        expect(reducer(undefined, action).toJS()).toEqual({
            authorizationToken: action.payload.authorizationToken,
            resourceGroupName: action.payload.resourceGroupName,
            resourceId: action.payload.resourceId,
            resourceName: action.payload.resourceName,
            subscriptionId: action.payload.subscriptionId,
            timeStamp: action.payload.timeStamp
        });
    });
});