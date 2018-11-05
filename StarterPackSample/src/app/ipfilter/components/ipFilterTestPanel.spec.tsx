import 'jest';
import context from 'jest-plugin-context';
import * as React from 'react';
import { shallow } from 'enzyme';
import { IpFilterRule, IpFilterActionType } from '@iotHubControlPlane/lib/models';
import { IpFilterTestPanel } from './ipFilterTestPanel';
import { InternetProtocolFilterRuleViewModel } from '../viewModel/internetProtocolFilterRuleViewModel';

let mockTranslationFunction;
let translationMap;

beforeAll(() => {
    translationMap = {
        'ipFilter.testIpAddress.errorMessage': 'validation error',
        'ipFilter.testPanelMessages.acceptedAction': 'allowed',
        'ipFilter.testPanelMessages.matches.prefix': 'This IP address is',
        'ipFilter.testPanelMessages.matches.suffix': 'by the following filter:',
        'ipFilter.testPanelMessages.noMatch': 'No Result Found',
        'ipFilter.testPanelMessages.rejectedAction': 'blocked'
    };

    mockTranslationFunction = (input: string) => {
        return translationMap[input];
    };
});

afterAll(() => {
    translationMap = undefined;
    mockTranslationFunction = undefined;
});

describe('ipFilter/components/ipFilterTestPanel', () => {
    context('snapshot', () => {
        it('matches snapshot', () => {
            const wrapper = shallow(<IpFilterTestPanel onDismissClick={jest.fn()} t={jest.fn()} filterRuleViewModels={[]}/>);

            expect(wrapper).toMatchSnapshot();
        });
    });

    context('state/initial', () => {
        it('should initialize state properly', () => {
            const wrapper = shallow(<IpFilterTestPanel onDismissClick={jest.fn()} t={jest.fn()} filterRuleViewModels={[]}/>);

            expect(wrapper.state()).toEqual({
                affectedIpFilter: undefined,
                ipAddress: '',
                showResult: false,
                validationMessage: ''
            });
        });
    });

    context('state/ipAddress', () => {
        it('should change based on user input', () => {
            const wrapper = shallow(<IpFilterTestPanel onDismissClick={jest.fn()} t={jest.fn()} filterRuleViewModels={[]}/>);
            let state = wrapper.state() as any; //tslint:disable-line
            expect(state.ipAddress).toEqual('');

            const textInput = wrapper.find('.ipFilter-testPanel-ipAddress-textField');
            textInput.simulate('changed', '123');

            state = wrapper.state();
            expect(state.ipAddress).toEqual('123');

            textInput.simulate('changed', '123.123.123.1');

            state = wrapper.state();
            expect(state.ipAddress).toEqual('123.123.123.1');
        });
    });

    context('state/validationMessage', () => {
        it('should add/remove validation message based on whether ip address input is valid or not', () => {
            const wrapper = shallow(<IpFilterTestPanel onDismissClick={jest.fn()} t={mockTranslationFunction} filterRuleViewModels={[]}/>);
            let state = wrapper.state() as any; //tslint:disable-line
            expect(state.validationMessage).toEqual('');

            const textInput = wrapper.find('.ipFilter-testPanel-ipAddress-textField');
            textInput.simulate('changed', '123');

            state = wrapper.state();
            expect(state.validationMessage).toEqual('validation error');

            textInput.simulate('changed', '123.123.123.1');

            state = wrapper.state();
            expect(state.validationMessage).toEqual('');
        });
    });

    context('render/verifyButton', () => {
        it('disables/enables verify button based on whether ip address input is valid or not', () => {
            const wrapper = shallow(<IpFilterTestPanel onDismissClick={jest.fn()} t={mockTranslationFunction} filterRuleViewModels={[]}/>);

            const textInput = wrapper.find('.ipFilter-testPanel-ipAddress-textField');
            let verifyButton = wrapper.find('.ipFilter-testPanel-verify-button').first();

            expect(verifyButton.props().disabled).toBeTruthy();

            textInput.simulate('changed', '123.123.123.1');
            wrapper.update();
            verifyButton = wrapper.find('.ipFilter-testPanel-verify-button').first();
            expect(verifyButton.props().disabled).toBeFalsy();

            textInput.simulate('changed', '123');
            wrapper.update();
            verifyButton = wrapper.find('.ipFilter-testPanel-verify-button').first();
            expect(verifyButton.props().disabled).toBeTruthy();
        });
    });

    context('render/testResults', () => {
        it('shows no result message for valid ip address input on verify button click when none of the filter filterRules are affected', () => {
            const wrapper = shallow(<IpFilterTestPanel onDismissClick={jest.fn()} t={mockTranslationFunction} filterRuleViewModels={[]}/>);

            let results = wrapper.find('.ipFilter-testPanel-results');

            expect(results.text()).toEqual('');

            wrapper.find('.ipFilter-testPanel-ipAddress-textField').simulate('changed', '123.123.123.1');
            wrapper.update();
            wrapper.find('.ipFilter-testPanel-verify-button').first().simulate('click');
            wrapper.update();
            results = wrapper.find('.ipFilter-testPanel-results');
            expect(results.text()).toEqual('No Result Found');
            expect(wrapper).toMatchSnapshot();
        });

        it('shows results for valid ip address input on verify button click when given ip address is blocked by any of the filter rules', () => {
            const mockFilterRuleViewModels: InternetProtocolFilterRuleViewModel[] = [
                new InternetProtocolFilterRuleViewModel(
                    {
                        action: IpFilterActionType.Accept,
                        filterName: 'filter_one',
                        ipMask: '127.127.123.1/28'
                    },
                    1
                ),
                new InternetProtocolFilterRuleViewModel(
                    {
                        action: IpFilterActionType.Reject,
                        filterName: 'filter_two',
                        ipMask: '127.127.123.2/20'
                    },
                    2
                )
            ];

            const wrapper = shallow(<IpFilterTestPanel onDismissClick={jest.fn()} t={mockTranslationFunction} filterRuleViewModels={mockFilterRuleViewModels}/>);

            const results = wrapper.find('.ipFilter-testPanel-results');

            expect(results.text()).toEqual('');

            wrapper.find('.ipFilter-testPanel-ipAddress-textField').simulate('changed', '127.127.123.6');
            wrapper.update();
            wrapper.find('.ipFilter-testPanel-verify-button').first().simulate('click');
            wrapper.update();

            expect(wrapper.find('.ipFilter-testPanel-results-match-found-message').text()).toEqual('This IP address is blocked by the following filter:');
            expect(wrapper.find('.ipFilter-testPanel-results-filter-name').text()).toEqual('filter_two');
            expect(wrapper.find('.ipFilter-testPanel-results-ipMask').text()).toEqual('(127.127.123.2/20)');
            expect(wrapper).toMatchSnapshot();
        });

        it('shows results for valid ip address input on verify button click when given ip address is allowed by any of the filter rules', () => {
            const mockFilterRuleViewModels: InternetProtocolFilterRuleViewModel[] = [
                new InternetProtocolFilterRuleViewModel(
                    {
                        action: IpFilterActionType.Reject,
                        filterName: 'filter_two',
                        ipMask: '127.127.123.2/20'
                    },
                    2
                ),
                new InternetProtocolFilterRuleViewModel(
                    {
                        action: IpFilterActionType.Accept,
                        filterName: 'filter_one',
                        ipMask: '127.127.123.1/28'
                    },
                    1
                )
            ];

            const wrapper = shallow(<IpFilterTestPanel onDismissClick={jest.fn()} t={mockTranslationFunction} filterRuleViewModels={mockFilterRuleViewModels}/>);

            const results = wrapper.find('.ipFilter-testPanel-results');

            expect(results.text()).toEqual('');

            wrapper.find('.ipFilter-testPanel-ipAddress-textField').simulate('changed', '127.127.123.6');
            wrapper.update();
            wrapper.find('.ipFilter-testPanel-verify-button').first().simulate('click');
            wrapper.update();

            expect(wrapper.find('.ipFilter-testPanel-results-match-found-message').text()).toEqual('This IP address is allowed by the following filter:');
            expect(wrapper.find('.ipFilter-testPanel-results-filter-name').text()).toEqual('filter_one');
            expect(wrapper.find('.ipFilter-testPanel-results-ipMask').text()).toEqual('(127.127.123.1/28)');
            expect(wrapper).toMatchSnapshot();
        });
    });
});
