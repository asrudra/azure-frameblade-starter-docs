import 'jest';
import context from 'jest-plugin-context';
import { fetchAzureResourceDataAction, updateAzureResourceDataAction } from './actions';
import { AzureResourceStateInitial } from './state';

describe('fetchAzureResourceDataAction', () => {
    context('fetchAzureResourceDataAction.started', () => {
        it('returns AZURE_RESOURCE/FETCH_STARTED action object', () => {
            expect(fetchAzureResourceDataAction.started({}).type).toEqual('AZURE_RESOURCE/FETCH_STARTED');
        });
    });

    context('fetchAzureResourceDataAction.done', () => {
        it('returns AZURE_RESOURCE/FETCH_DONE action object', () => {
            const azureResourceState = AzureResourceStateInitial({});
            expect(fetchAzureResourceDataAction.done({ params: {}, result: azureResourceState})).toEqual({
                payload: {
                    params: {},
                    result: azureResourceState
                },
                type: 'AZURE_RESOURCE/FETCH_DONE',
            });
        });
    });

    context('fetchAzureResourceDataAction.failed', () => {
        it('returns AZURE_RESOURCE/FETCH_FAILED action object', () => {
            expect(fetchAzureResourceDataAction.failed({ params: {}, error: { code: -1 }})).toEqual({
                error: true,
                payload: {
                    error: {
                        code: -1
                    },
                    params: {}
                },
                type: 'AZURE_RESOURCE/FETCH_FAILED',
            });
        });
    });
});

describe('updateAzureResourceDataAction', () => {
    it('returns AZURE_RESOURCE/UPDATE action object', () => {
        const azureResourceState = AzureResourceStateInitial({});

        expect(updateAzureResourceDataAction(azureResourceState)).toEqual({
            payload: azureResourceState,
            type: 'AZURE_RESOURCE/UPDATE'
        });
    });
});
