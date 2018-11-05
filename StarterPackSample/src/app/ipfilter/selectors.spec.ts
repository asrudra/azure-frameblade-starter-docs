import 'jest';
import { IpFilterActionType } from '@iotHubControlPlane/lib/models';
import { getFetchedStatusSelector, getFetchingStatusSelector, getErrorStatusSelector, getFilterRulesSelector } from './selectors';
import { IpFilterStateInitial } from './state';
import { InternetProtocolFilterRuleViewModel } from './viewModel/internetProtocolFilterRuleViewModel';

describe('getFetchingStatusSelector', () => {
    it('returns value of fetching', () => {
        const fetching = Math.random() >= 0.5;
        const state = IpFilterStateInitial({
            fetching
        });

        expect(getFetchingStatusSelector(state)).toEqual(fetching);
    });
});

describe('getFetchedStatusSelector', () => {
    it('returns value of fetched', () => {
        const fetched = Math.random() >= 0.5;
        const state = IpFilterStateInitial({
            fetched
        });

        expect(getFetchedStatusSelector(state)).toEqual(fetched);
    });
});

describe('getErrorStatusSelector', () => {
    it('returns error value', () => {
        const error = Math.random() >= 0.5;
        const state = IpFilterStateInitial({
            error
        });

        expect(getErrorStatusSelector(state)).toEqual(error);
    });
});

describe('getFilterRulesSelector', () => {
    it('returns filter rules', () => {
        const filterRules = [{
            action: IpFilterActionType.Accept,
            filterName: 'filter_one',
            ipMask: '123.123.123.4/8'
        },
        {
            action: IpFilterActionType.Reject,
            filterName: 'filter_two',
            ipMask: '213.213.213.2/4'
        }];

        const state = IpFilterStateInitial({
            filterRules
        });

        const result = getFilterRulesSelector(state);

        expect(result[0]).toEqual(
            new InternetProtocolFilterRuleViewModel(filterRules[0], 0)
        );

        expect(result[1]).toEqual(
            new InternetProtocolFilterRuleViewModel(filterRules[1], 1));
    });
});
