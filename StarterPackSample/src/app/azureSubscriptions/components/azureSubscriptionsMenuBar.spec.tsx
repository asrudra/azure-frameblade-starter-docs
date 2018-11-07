import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { AzureSubscriptionsMenuBar } from './azureSubscriptionsMenuBar';

describe('azureSubscriptionsMenuBar', () => {
    
    context('disables/enables command(s)', () => {
        it('disables refresh when refreshDisabled equals true', () => {
            const wrapper = shallow(<AzureSubscriptionsMenuBar t={jest.fn()} refreshDisabled={true} onRefreshClick={jest.fn()} />);
            const buttons = wrapper.props().items;
            expect(buttons[0].disabled).toEqual(true);
            expect(wrapper).toMatchSnapshot();
        });

        it('enables refresh when refreshDisabled equals false', () => {
            const wrapper = shallow(<AzureSubscriptionsMenuBar t={jest.fn()} refreshDisabled={false} onRefreshClick={jest.fn()} />);
            const buttons = wrapper.props().items;
            expect(buttons[0].disabled).toEqual(false);
            expect(wrapper).toMatchSnapshot();
        });
    });

    context('calls command handlers', () => {
        it('calls mock refreshCallback on refresh command click', () => {
            const refreshCallback = jest.fn();
            const wrapper = mount(<AzureSubscriptionsMenuBar t={jest.fn()} refreshDisabled={false} onRefreshClick={refreshCallback} />);
            wrapper.find('.ms-Button').first().simulate('click');
            wrapper.update();

            expect(refreshCallback).toHaveBeenCalled();
            expect(wrapper).toMatchSnapshot();
        });
    });
});