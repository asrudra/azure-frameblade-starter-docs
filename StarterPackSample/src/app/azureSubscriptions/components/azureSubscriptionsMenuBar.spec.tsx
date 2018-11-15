import * as React from 'react';
import { mount } from 'enzyme';
import { AzureSubscriptionsMenuBar } from './azureSubscriptionsMenuBar';
import { testWithLocalizationContext } from '../../shared/utils/testHelpers';

describe('azureSubscriptionsMenuBar', () => {
    context('disables/enables command(s)', () => {
        it('disables refresh when refreshDisabled equals true', () => {
            const wrapper = testWithLocalizationContext(<AzureSubscriptionsMenuBar refreshDisabled={true} onRefreshClick={jest.fn()}/>);

            const buttons = wrapper.props().items;
            expect(buttons[0].disabled).toEqual(true);
            expect(wrapper).toMatchSnapshot();
        });

        it('enables refresh when refreshDisabled equals false', () => {
            const wrapper = testWithLocalizationContext(<AzureSubscriptionsMenuBar refreshDisabled={false} onRefreshClick={jest.fn()}/>);

            const buttons = wrapper.props().items;
            expect(buttons[0].disabled).toEqual(false);
            expect(wrapper).toMatchSnapshot();
        });
    });

    context('calls command handlers', () => {
        it('calls mock refreshCallback on refresh command click', () => {
            const refreshCallback = jest.fn();
            const wrapper = testWithLocalizationContext(<AzureSubscriptionsMenuBar refreshDisabled={false} onRefreshClick={refreshCallback}/>, mount);

            wrapper.find('.ms-Button').first().simulate('click');
            wrapper.update();

            expect(refreshCallback).toHaveBeenCalledTimes(1);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
