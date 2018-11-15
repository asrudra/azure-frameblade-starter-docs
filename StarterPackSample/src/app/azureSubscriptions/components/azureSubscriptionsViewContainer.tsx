import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AnyAction } from 'typescript-fsa';
import { AzureSubscriptionsView, AzureSubscriptionsViewProps } from './azureSubscriptionsView';
import { AzureSubscriptionsStateInterface } from '../state';
import { fetchAzureSubscriptionsAction } from '../actions';
import { IM, NonFunctionProperties, FunctionProperties, StateInterface } from '../../types';
import { getAzureSubscriptionsSelector, getNextLinkSelector, getFetchedStatusSelector, getFetchingStatusSelector, getErrorStatusSelector } from '../selectors';

export const mapStateToProps = (state: StateInterface): NonFunctionProperties<Partial<AzureSubscriptionsViewProps>> => {
    const azureSubscriptionsState = state.azureSubscriptions as IM<AzureSubscriptionsStateInterface>;
    return {
        azureSubscriptions: getAzureSubscriptionsSelector(azureSubscriptionsState),
        errorFetchingAzureSubscriptions: getErrorStatusSelector(azureSubscriptionsState),
        hasFetchedAzureSubscriptions: getFetchedStatusSelector(azureSubscriptionsState),
        isFetchingAzureSubscriptions: getFetchingStatusSelector(azureSubscriptionsState),
        nextLink: getNextLinkSelector(azureSubscriptionsState)
    };
};

export const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): FunctionProperties<Partial<AzureSubscriptionsViewProps>> => {
    return {
        fetchAzureSubscriptions: (nextLink: string) => dispatch(fetchAzureSubscriptionsAction.started({nextLink}))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AzureSubscriptionsView);
