import 'jest';
import { IotHubClient } from '@iotHubControlPlane/lib/iotHubClient';
import { getIotHubClientInstance } from './iotHubClientFactory'; 

describe('iotHubClientFactory', () => {
    context('getInstance', () => {
        it ('gives instance', () => {
            expect(getIotHubClientInstance({
                baseUri: 'baseUri',
                subscriptionId: 'subscriptionId',
                token: 'token',
                tokenType: 'tokenType'
            })).toBeInstanceOf(IotHubClient);
        });

        it('sets token type when token type undefined', () => {
            expect(getIotHubClientInstance({
                baseUri: 'baseUri',
                subscriptionId: 'subscriptionId2',
                token: 'token'
            })).toBeInstanceOf(IotHubClient);
        });

        it ('gives same instance when called twice', () => {
            const client = getIotHubClientInstance({
                baseUri: 'baseUri',
                subscriptionId: 'subscriptionId3',
                token: 'token',
                tokenType: 'tokenType'
            });

            const secondClient = getIotHubClientInstance({
                baseUri: 'baseUri',
                subscriptionId: 'subscriptionId3',
                token: 'token',
                tokenType: 'tokenType'
            });

            expect(client).toEqual(secondClient);
        });

        it ('gives new instance when called with different subscription', () => {
            const client = getIotHubClientInstance({
                baseUri: 'baseUri',
                subscriptionId: 'subscriptionId4',
                token: 'token',
                tokenType: 'tokenType'
            });

            const secondClient = getIotHubClientInstance({
                baseUri: 'baseUri',
                subscriptionId: 'subscriptionId5',
                token: 'token',
                tokenType: 'tokenType'
            });

            expect(client).not.toEqual(secondClient);
        });

        it ('gives instance when base Uri not specified', () => {
            expect(getIotHubClientInstance({
                subscriptionId: 'subscriptionId6',
                token: 'token',
                tokenType: 'tokenType'
            })).toBeInstanceOf(IotHubClient);
        });
    });
});