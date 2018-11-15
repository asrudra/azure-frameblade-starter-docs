import * as React from 'react';
import { AzureSubscriptionsView } from './azureSubscriptionsView';
import { testWithLocalizationContext } from '../../shared/utils/testHelpers';
import { mount } from 'enzyme';
import { AzureSubscriptionsMenuBar } from './azureSubscriptionsMenuBar';

describe('azureSubscriptionsView', () => {

    context('snapshot', () => {
        it('matches snapshot when no error present', () => {
            const wrapper = testWithLocalizationContext(
                <AzureSubscriptionsView
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={jest.fn()}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={false}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={''}
                />);

            expect(wrapper).toMatchSnapshot();
        });

        it('matches snapshot when error present', () => {
            const wrapper = testWithLocalizationContext(
                <AzureSubscriptionsView
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={jest.fn()}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={false}
                    errorFetchingAzureSubscriptions={true}
                    nextLink={''}
                />);

            expect(wrapper).toMatchSnapshot();
        });
    });

    context('componentDidMount', () => {
        it('calls fetch if hasFetched equals false and isFetching equals false', () => {
            const mockFetch = jest.fn();
            testWithLocalizationContext(
                <AzureSubscriptionsView
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={mockFetch}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={false}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={''}
                />);

            expect(mockFetch).toHaveBeenCalledWith('');
        });

        it('does not call fetch if hasFetched equals true', () => {
            const mockFetch = jest.fn();
            testWithLocalizationContext(
                <AzureSubscriptionsView
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={mockFetch}
                    hasFetchedAzureSubscriptions={true}
                    isFetchingAzureSubscriptions={false}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={''}
                />);

            expect(mockFetch).not.toHaveBeenCalled();
        });

        it ('does not call fetch if isFetching equals true', () => {
            const mockFetch = jest.fn();
            testWithLocalizationContext(
                <AzureSubscriptionsView
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={mockFetch}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={true}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={''}
                />);

            expect(mockFetch).not.toHaveBeenCalled();
        });
    });

    context('render/load-more-button', () => {
        it('calls fetchAzureSubscriptions with next link on loadMore button click', () => {
            const mockFetch = jest.fn();
            const wrapper = testWithLocalizationContext(
                <AzureSubscriptionsView
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={mockFetch}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={true}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={'nextLink'}
                />);

            wrapper.find('.load-more-button').simulate('click');
            expect(mockFetch).toHaveBeenCalledWith('nextLink');
        });
    });

    context ('render/AzureSubscriptionsMenuBar', () => {
        it('calls fetchAzureSubscriptions with empty next link on refresh click', () => {
            const mockFetch = jest.fn();
            const wrapper = testWithLocalizationContext(
                <AzureSubscriptionsView
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={mockFetch}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={true}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={'nextLink'}
                />);

            wrapper.find(AzureSubscriptionsMenuBar).prop('onRefreshClick')();
            expect(mockFetch).toHaveBeenCalledWith('');
        });
    });
});
