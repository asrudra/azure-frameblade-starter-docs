import { createSelector, Selector } from 'reselect';
import { IpFilterRule } from '@iotHubControlPlane/lib/models';
import { IM } from '../types';
import { IpFilterStateInterface } from './state';
import { InternetProtocolFilterRuleViewModel } from './viewModel/internetProtocolFilterRuleViewModel';

const getFilterRules: Selector<IM<IpFilterStateInterface>, IpFilterRule[]> = (state) => state.get('filterRules', []);
const getFetchingStatus: Selector<IM<IpFilterStateInterface>, boolean> = (state) => state.get('fetching', false);
const getFetchedStatus: Selector<IM<IpFilterStateInterface>, boolean> = (state) => state.get('fetched', false);
const getErrorStatus: Selector<IM<IpFilterStateInterface>, boolean> = (state) => state.get('error', false);

export const getFilterRulesSelector = createSelector(
    [getFilterRules],
    (filterRules) => {
        return filterRules.map((filterRule, index) => {
            return new InternetProtocolFilterRuleViewModel(filterRule, index);
        });
    }
);

export const getFetchingStatusSelector = createSelector(
    [getFetchingStatus],
    (fetching) => {
        return fetching;
    }
);

export const getFetchedStatusSelector = createSelector(
    [getFetchedStatus],
    (fetched) => {
        return fetched;
    }
);

export const getErrorStatusSelector = createSelector(
    [getErrorStatus],
    (error) => {
        return error;
    }
);