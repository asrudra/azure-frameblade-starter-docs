import 'jest';
import { generateMessage } from './ipFilterViewContainer';
import { IpFilterStateInitial } from '../state';

describe('generateMessage', () => {
    const translationMap = {
        'ipFilter.infoMessages.retrievePending': 'retrieve pending',
        'ipFilter.infoMessages.updateFailure': 'update failure',
        'ipFilter.infoMessages.updatePending': 'update pending',
        'ipFilter.infoMessages.updateSuccess': 'update success',
    };

    const mockTranslationFunction = (input: string) => {
        return translationMap[input];
    };

    it('returns update failure message when state.error is true', () => {
        expect(generateMessage(IpFilterStateInitial({ error: true }), mockTranslationFunction)).toEqual('update failure');
    });

    it('returns update success message when state.fetched is true and state.error is false', () => {
        expect(generateMessage(IpFilterStateInitial({ fetched: true, error: false }), mockTranslationFunction)).toEqual('update success');
    });

    it('returns update pending message when state.fetching is true and state.error is false', () => {
        expect(generateMessage(IpFilterStateInitial({ fetching: true, fetched: false, error: false }), mockTranslationFunction)).toEqual('update pending');
    });

    it('returns retrieve pending message when state.fetched, state.fetching both are false', () => {
        expect(generateMessage(IpFilterStateInitial({ fetching: false, fetched: false, error: false }), mockTranslationFunction)).toEqual('retrieve pending');
    });
});
