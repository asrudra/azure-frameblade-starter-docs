import { Action } from 'typescript-fsa';
import { IotHubDescription } from '@iotHubControlPlane/lib/models';
import { call, put, select, SelectEffect, CallEffect, PutEffect } from 'redux-saga/effects';
import { getAzureResourceSelector } from '../selectors';
import { AzureResourceInterface } from '../state';
import { EnvironmentSettingNames } from '../../../services/models/environmentSettingNames';
import { getSetting, getAzureResource } from '../../../services/portalEnvironmentService';
import { getIotHubDescription, updateIotHubDescription } from '../../../services/iotHubService';
import { updateAzureResourceDataAction } from '../actions';

const ELAPSED_THRESHOLD_IN_MINUTES = 10;

export function* resourceCheckSaga(): IterableIterator<SelectEffect | CallEffect | PutEffect<Action<Partial<AzureResourceInterface>>>> {
    let resource: AzureResourceInterface = yield select(getAzureResourceSelector);

    const elapsed = new Date().getTime() - resource.timeStamp;

    if (elapsed > (ELAPSED_THRESHOLD_IN_MINUTES * 60 * 1000)) {
        const token = yield call(getSetting, EnvironmentSettingNames.AUTHORIZATION_TOKEN);
        const azureResource = yield call(getAzureResource);
        resource.authorizationToken = token;
        resource.timeStamp = new Date().getTime();
        resource = {...resource, ...azureResource};
        yield put(updateAzureResourceDataAction(resource));
    }

    return resource;
}

export function* getIotHubSaga() {
    const resource: AzureResourceInterface = yield call(resourceCheckSaga);
    const armEndpointUri: string = yield call(getSetting, EnvironmentSettingNames.ARM_ENDPOINT);

    return yield call(getIotHubDescription, {
        armEndpoint: armEndpointUri,
        authorizationToken: resource.authorizationToken,
        resource: {
            resourceGroupName: resource.resourceGroupName,
            resourceId: resource.resourceId,
            resourceName: resource.resourceName,
            subscriptionId: resource.subscriptionId
        }
    });
}

export function* updateIotHubSaga(hub: IotHubDescription) {
    const resource = yield call(resourceCheckSaga);
    const armEndpointUri = yield call(getSetting, EnvironmentSettingNames.ARM_ENDPOINT);

    return yield call(updateIotHubDescription, {
        armEndpoint: armEndpointUri,
        authorizationToken: resource.authorizationToken,
        iotHubDescription: hub,
        resource: {
            resourceGroupName: resource.resourceGroupName,
            resourceId: resource.resourceId,
            resourceName: resource.resourceName,
            subscriptionId: resource.subscriptionId
        }
    });
}