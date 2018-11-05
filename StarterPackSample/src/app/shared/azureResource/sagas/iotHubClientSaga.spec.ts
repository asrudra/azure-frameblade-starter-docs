import 'jest';
import context from 'jest-plugin-context';
import { cloneableGenerator } from 'redux-saga/utils';
import { IotHubDescription } from '@iotHubControlPlane/lib/models';
import { call, select, put } from 'redux-saga/effects';
import { resourceCheckSaga, getIotHubSaga, updateIotHubSaga } from './iotHubClientSaga';
import { getAzureResourceSelector } from '../selectors';
import { AzureResourceStateInitial } from '../state';
import { EnvironmentSettingNames } from '../../../services/models/environmentSettingNames';
import { getSetting, getAzureResource } from '../../../services/portalEnvironmentService';
import { getIotHubDescription, updateIotHubDescription } from '../../../services/iotHubService';

function createMockResource(timeStamp: number = new Date().getTime()) {
    return AzureResourceStateInitial({
        authorizationToken: 'authorization-token',
        resourceGroupName: 'resource-group-name',
        resourceId: 'resource-id',
        resourceName: 'resource_name',
        subscriptionId: 'subscription-id',
        timeStamp
    });
}

describe('resourceCheckSaga', () => {
    const oldResource = createMockResource(new Date().getTime() - 10.1 * 60 * 1000).toJS();
    const newResource = createMockResource(new Date().getTime() - 9.9 * 60 * 1000).toJS();
    const token = 'token';
    let resourceCheckSagaGenerator;

    beforeAll(() => {
        resourceCheckSagaGenerator = cloneableGenerator(resourceCheckSaga)();
    });

    it('creates select effect for getAzureResourceSelector', () => {
        expect(resourceCheckSagaGenerator.next()).toEqual({
            done: false,
            value: select(getAzureResourceSelector)
        });
    });

    context('last resource fetch was more than 10 mins ago', () => {
        let generator;

        beforeAll(() => {
            generator = resourceCheckSagaGenerator.clone();
        });

        it('creates call effect to get authorization token', () => {
            expect(generator.next(oldResource)).toEqual({
                done: false,
                value: call(getSetting, EnvironmentSettingNames.AUTHORIZATION_TOKEN)
            });
        });

        it('creates call effect to get azure resource', () => {
            expect(generator.next(token)).toEqual({
                done: false,
                value: call(getAzureResource)
            });
        });

        it('dispatches put effect for AZURE_RESOURCE/UPDATE', () => {
            expect(generator.next(newResource)).toEqual({
                done: false,
                value: put({
                    payload: newResource,
                    type: 'AZURE_RESOURCE/UPDATE'
                })
            });
        });

        it('returns azure resource', () => {
            expect(generator.next()).toEqual({
                done: true,
                value: newResource
            });
        });
    });

    context('last resource fetch was less than 10 mins ago', () => {
        let generator;

        beforeAll(() => {
            generator = resourceCheckSagaGenerator.clone();
        });

        it('returns azure resource after getting resource through selector', () => {
            expect(generator.next(newResource)).toEqual({
                done: true,
                value: newResource
            });
        });
    });
});

describe('getIotHubSaga', () => {
    let getIotHubSagagenerator;
    const resource = createMockResource();
    const armEndpointUri = 'arm-endpoint-uri';

    beforeAll(() => {
        getIotHubSagagenerator = getIotHubSaga();
    });

    it('creates call effect for resourceCheckSaga', () => {
        expect(getIotHubSagagenerator.next()).toEqual({
            done: false,
            value: call(resourceCheckSaga)
        });
    });

    it('creates call effect to get ARM endpoint', () => {
        expect(getIotHubSagagenerator.next(resource)).toEqual({
            done: false,
            value: call(getSetting, EnvironmentSettingNames.ARM_ENDPOINT)
        });
    });

    it('creates call effect to get iotHub instance', () => {
        expect(getIotHubSagagenerator.next(armEndpointUri)).toEqual({
            done: false,
            value: call(getIotHubDescription, {
                armEndpoint: armEndpointUri,
                authorizationToken: 'authorization-token',
                resource: {
                    resourceGroupName: 'resource-group-name',
                    resourceId: 'resource-id',
                    resourceName: 'resource_name',
                    subscriptionId: 'subscription-id'
                }
            })
        });

        expect(getIotHubSagagenerator.next().done).toBeTruthy(); // tslint:disable-line: no-console
    });
});

describe('updateIotHubSaga', () => {
    const resource = createMockResource();
    const armEndpointUri = 'arm-endpoint-uri';
    const hub: IotHubDescription = {};
    let generator;

    beforeAll(() => {
        generator = updateIotHubSaga(hub);
    });

    it('creates call effect for resourceCheckSaga', () => {
        expect(generator.next()).toEqual({
            done: false,
            value: call(resourceCheckSaga)
        });
    });

    it('creates call effect to get ARM endpoint', () => {
        expect(generator.next(resource)).toEqual({
            done: false,
            value: call(getSetting, EnvironmentSettingNames.ARM_ENDPOINT)
        });
    });

    it('creates call effect to update iotHub instance', () => {
        expect(generator.next(armEndpointUri)).toEqual({
            done: false,
            value: call(updateIotHubDescription, {
                armEndpoint: armEndpointUri,
                authorizationToken: 'authorization-token',
                iotHubDescription: {},
                resource: {
                    resourceGroupName: 'resource-group-name',
                    resourceId: 'resource-id',
                    resourceName: 'resource_name',
                    subscriptionId: 'subscription-id'
                }
            })
        });

        expect(generator.next().done).toBeTruthy();
    });
});
