import 'jest';
import { getAzureResourceSelector } from './selectors';
import { AzureResourceStateInitial } from './state';
import { IpFilterStateInitial } from '../../ipFilter/state';

describe('getAzureResourceSelector', () => {
    it('returns value of azureResource as json object', () => {
        const azureResourceState = AzureResourceStateInitial();
        const state = {
            azureResource: azureResourceState,
            ipFilter: IpFilterStateInitial()
        };

        expect(getAzureResourceSelector(state)).toEqual(azureResourceState.toJS());
    });
});
