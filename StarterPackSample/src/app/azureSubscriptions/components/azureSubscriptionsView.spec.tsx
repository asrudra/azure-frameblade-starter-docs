import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { AzureSubscriptionsView } from './azureSubscriptionsView';

describe('azureSubscriptionsView', () => {
    
    context('snapshot', () => {
        it('matches snapshot when no error present', () => {
            const wrapper = shallow(
                <AzureSubscriptionsView 
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={jest.fn()}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={false}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={''}
                    t={jest.fn()}
                />);
            expect(wrapper).toMatchSnapshot();
        });

        it('matches snapshot when error present', () => {
            const wrapper = shallow(
                <AzureSubscriptionsView 
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={jest.fn()}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={false}
                    errorFetchingAzureSubscriptions={true}
                    nextLink={''}
                    t={jest.fn()}
                />);
            expect(wrapper).toMatchSnapshot();
        });
    });

    context('componentDidMount', () => {
        it('calls fetch if hasFetched equals false and isFetching equals false', () => {
            const mockFetch = jest.fn();
            shallow(
                <AzureSubscriptionsView 
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={mockFetch}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={false}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={''}
                    t={jest.fn()}
                />);
            
            expect(mockFetch).toHaveBeenCalledWith('');            
        });

        it('does not call fetch if hasFetched equals true', () => {
            const mockFetch = jest.fn();
            shallow(
                <AzureSubscriptionsView 
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={mockFetch}
                    hasFetchedAzureSubscriptions={true}
                    isFetchingAzureSubscriptions={false}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={''}
                    t={jest.fn()}
                />);
            
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it ('does not call fetch if isFetching equals true', () => {
            const mockFetch = jest.fn();
            shallow(
                <AzureSubscriptionsView 
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={mockFetch}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={true}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={''}
                    t={jest.fn()}
                />);
            
            expect(mockFetch).not.toHaveBeenCalled();
        });
    });

    context('loadMoreHandler', () => {
        it('calls fetchAzureSubscriptions with next link', () => {
            const mockFetch = jest.fn();
            const wrapper = shallow(
                <AzureSubscriptionsView 
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={mockFetch}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={true}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={'nextLink'}
                    t={jest.fn()}
                />);
            
            // tslint:disable-next-line:no-any
            (wrapper.instance() as any).loadMoreHandler();
            expect(mockFetch).toHaveBeenCalledWith('nextLink');
        });
    });

    context ('refreshHandler', () => {
        it('calls fetchAzureSubscriptions with empty next link', () => {
            const mockFetch = jest.fn();
            const wrapper = shallow(
                <AzureSubscriptionsView 
                    azureSubscriptions={[]}
                    fetchAzureSubscriptions={mockFetch}
                    hasFetchedAzureSubscriptions={false}
                    isFetchingAzureSubscriptions={true}
                    errorFetchingAzureSubscriptions={false}
                    nextLink={'nextLink'}
                    t={jest.fn()}
                />);
            
            // tslint:disable-next-line:no-any
            (wrapper.instance() as any).refreshHandler();
            expect(mockFetch).toHaveBeenCalledWith('');
        });
    });
});