import 'jest';
import 'jest-plugin-context';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { IpFilterMenuBar } from './ipFilterMenuBar';

describe('ipFilter/components/ListViewMenu', () => {
    context('props/isSaveDisabled && props/isRevertDisabled', () => {
        it('should disable save and revert buttons when disabled props are true', () => {
            const disabled = true;
            const wrapper = shallow(<IpFilterMenuBar isSaveDisabled={disabled} isRevertDisabled={disabled} onSaveClick={jest.fn()} onRevertClick={jest.fn()} t={jest.fn()} onTestClick={jest.fn()}/>);

            const buttons = wrapper.props().items;
            expect(buttons[0].disabled).toBeTruthy(); // save button
            expect(buttons[1].disabled).toBeTruthy(); // revert button
            expect(buttons[2].disabled).toBeFalsy(); // test button
            expect(wrapper).toMatchSnapshot();
        });

        it('should enable save and revert buttons when disabled props are false', () => {
            const disabled = false;
            const wrapper = shallow(<IpFilterMenuBar isSaveDisabled={disabled} isRevertDisabled={disabled} onSaveClick={jest.fn()} onRevertClick={jest.fn()} t={jest.fn()} onTestClick={jest.fn()}/>);

            const buttons = wrapper.props().items;
            expect(buttons[0].disabled).toBeFalsy(); // save button
            expect(buttons[1].disabled).toBeFalsy(); // revert button
            expect(buttons[2].disabled).toBeFalsy(); // test button
            expect(wrapper).toMatchSnapshot();
        });
    });

    context('props/onSaveClick', () => {
        it('should trigger onSaveClick event', () => {
            const saveCallBack = jest.fn();
            const wrapper = mount(<IpFilterMenuBar isSaveDisabled={false} isRevertDisabled={false} onSaveClick={saveCallBack} onRevertClick={jest.fn()} t={jest.fn()} onTestClick={jest.fn()}/>);

            wrapper.find('.ipFilter-save-button').first().simulate('click');
            wrapper.update();

            expect(saveCallBack.mock.calls.length).toEqual(1);
            expect(wrapper).toMatchSnapshot();
        });
    });

    context('props/onRevertClick', () => {
        it('should trigger onRevertClick event', () => {
            const revertCallBack = jest.fn();
            const wrapper = mount(<IpFilterMenuBar isSaveDisabled={false} isRevertDisabled={false} onSaveClick={jest.fn()} onRevertClick={revertCallBack} t={jest.fn()} onTestClick={jest.fn()}/>);

            wrapper.find('.ipFilter-revert-button').first().simulate('click');
            wrapper.update();

            expect(revertCallBack.mock.calls.length).toEqual(1);
            expect(wrapper).toMatchSnapshot();
        });
    });

    context('props/onTestClick', () => {
        it('should trigger onRevertClick event', () => {
            const testButtonCallBack = jest.fn();
            const wrapper = mount(<IpFilterMenuBar isSaveDisabled={false} isRevertDisabled={false} onSaveClick={jest.fn()} onRevertClick={jest.fn()} t={jest.fn()} onTestClick={testButtonCallBack}/>);

            wrapper.find('.ipFilter-test-button').first().simulate('click');
            wrapper.update();

            expect(testButtonCallBack.mock.calls.length).toEqual(1);
            expect(wrapper).toMatchSnapshot();
        });
    });
});
