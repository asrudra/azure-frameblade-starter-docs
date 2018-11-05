import 'jest';
import context from 'jest-plugin-context';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { MessageBarType, MessageBar, MessageBarButton, Shimmer } from 'office-ui-fabric-react';
import { IpFilterActionType } from '@iotHubControlPlane/lib/models';
import { IpFilterView, IpFilterViewProps, IpFilterViewState } from './ipFilterView';
import { InternetProtocolFilterRuleViewModel } from '../viewModel/internetProtocolFilterRuleViewModel';
import { IpFilterTestPanel, IpFilterTestPanelProps } from './ipFilterTestPanel';
import { IpFilterMenuBar, IpFilterMenuBarProps } from './ipFilterMenuBar';
import { IpFilterList, IpFilterListProps } from './ipFilterList';

const mockFilterRules = [
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

describe('ipFilter/components/ipFilterView', () => {
    context('snapshot', () => {
        it('matches snapshot', () => {
            const wrapper = shallow(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

            expect(wrapper).toMatchSnapshot();
        });
    });

    context('constructor', () => {
        it('initializes internal state properly', () => {
            const wrapper = shallow(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

            expect(wrapper.state()).toEqual({
                filterRuleViewModels: mockFilterRules,
                informationBar: {
                    message: 'mock_message',
                    show: false,
                    type: MessageBarType.info
                },
                initialFilterRuleViewModels: mockFilterRules,
                isConfirmingRevert: false,
                isDirty: false,
                isLoading: false,
                newItemIndex: 2,
                requestMade: false,
                showOverlay: false,
                showTestPanel: false
            });
        });
    });

    context('componentDidMount', () => {
        it('calls props.fetch on componentDidMount', () => {
            const mockFetch = jest.fn();
            const componentDidMountSpy = jest.spyOn(IpFilterView.prototype, 'componentDidMount');

            shallow(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={mockFetch} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

            expect(componentDidMountSpy).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });
    });

    context('getDerivedStateFromProps', () => {
        const props: IpFilterViewProps = {
            fetch: jest.fn(),
            filterRuleViewModels: mockFilterRules,
            informationBarMessage: 'mock-message',
            isLoading: false,
            save: jest.fn(),
            t: jest.fn()
        };

        const state =  {
            filterRuleViewModels: [],
            informationBar: {
                message: 'mock',
                show: false,
                type: MessageBarType.info
            },
            initialFilterRuleViewModels: [],
            isConfirmingRevert: false,
            isDirty: false,
            isLoading: false,
            newItemIndex: 0,
            requestMade: false,
            showOverlay: false,
            showTestPanel: false
        };

        it('returns derived state properly on initialization when isDirty is false', () => {
            state.isDirty = false;

            expect(IpFilterView.getDerivedStateFromProps(props, state)).toEqual({
                filterRuleViewModels: mockFilterRules,
                initialFilterRuleViewModels: mockFilterRules,
                newItemIndex: 2,
                showOverlay: false
            });
        });

        it('returns derived state properly when component gets updated props after successful save', () => {
            state.isDirty = true;
            state.requestMade = true;

            expect(IpFilterView.getDerivedStateFromProps(props, state)).toEqual({
                filterRuleViewModels: mockFilterRules,
                informationBar: {
                    show: true,
                    type: MessageBarType.success
                },
                initialFilterRuleViewModels: mockFilterRules,
                isDirty: false,
                newItemIndex: 2,
                requestMade: false,
                showOverlay: false
            });
        });

        it('returns null when isDirty is true but no save request was made', () => {
            state.isDirty = true;
            state.requestMade = false;

            expect(IpFilterView.getDerivedStateFromProps(props, state)).toBeNull();
        });
    });

    context('updateRuleHandler', () => {
        const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

        it ('updates filterName and nameValidation when given filterName update', () => {
            const component = wrapper.instance() as IpFilterView;
            component.updateRuleHandler(
            {
                filterName: 'newFilterName'
            }, 
            mockFilterRules[0]);

            const state = wrapper.state() as IpFilterViewState;
            expect(state.isDirty).toEqual(true);
            expect(state.filterRuleViewModels[0].filterRule.filterName).toEqual('newFilterName');
            expect(state.filterRuleViewModels[0].nameValidation.isValid).toEqual(true);
        });

        it ('updates ipMask and addressValidation when given filterName update', () => {
            const component = wrapper.instance() as IpFilterView;
            component.updateRuleHandler(
            {
                ipMask: '10.0.0.1'
            }, 
            mockFilterRules[0]);

            const state = wrapper.state() as IpFilterViewState;
            expect(state.isDirty).toEqual(true);
            expect(state.filterRuleViewModels[0].filterRule.ipMask).toEqual('10.0.0.1');
            expect(state.filterRuleViewModels[0].addressRangeValidation.isValid).toEqual(true);
        });

        it ('updates action state', () => {
            const component = wrapper.instance() as IpFilterView;
            component.updateRuleHandler(
            {
                action: IpFilterActionType.reject
            }, 
            mockFilterRules[0]);

            const state = wrapper.state() as IpFilterViewState;
            expect(state.isDirty).toEqual(true);
            expect(state.filterRuleViewModels[0].filterRule.IpFilterActionType).toEqual(IpFilterActionType.reject);
        });

        it ('adds and removes duplicate name validations to all duplicates', () => {
            const component = wrapper.instance() as IpFilterView;
            component.updateRuleHandler(
            {
                filterName: 'filter_two'
            }, 
            mockFilterRules[0]);

            let state = wrapper.state() as IpFilterViewState;
            expect(state.isDirty).toEqual(true);
            expect(state.filterRuleViewModels[0].nameValidation.isValid).toEqual(false);
            expect(state.filterRuleViewModels[1].nameValidation.isValid).toEqual(false);

            component.updateRuleHandler(
            {
                filterName: 'filter_one'
            }, 
            state.filterRuleViewModels[0]);

            state = wrapper.state() as IpFilterViewState;
            expect(state.filterRuleViewModels[0].nameValidation.isValid).toEqual(true);
            expect(state.filterRuleViewModels[1].nameValidation.isValid).toEqual(true);
        });
    });

    context('remove rule handler', () => { 
        it('removes duplicate validation when duplicate removed ', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);
            const component = wrapper.instance() as IpFilterView;
            component.updateRuleHandler(
            {
                filterName: 'filter_two'
            }, 
            mockFilterRules[0]);

            let state = wrapper.state() as IpFilterViewState;
            expect(state.filterRuleViewModels[0].nameValidation.isValid).toEqual(false);
            expect(state.filterRuleViewModels[1].nameValidation.isValid).toEqual(false);
            
            component.removeRuleHandler(state.filterRuleViewModels[0]);
            state = wrapper.state() as IpFilterViewState;
            expect(state.filterRuleViewModels.length).toEqual(1);
            expect(state.filterRuleViewModels[0].nameValidation.isValid).toEqual(true);
        });
    });

    context('render/testPanel', () => {
        it('renders testPanel when showTestPanel state is true', () => {
            const mocktranslationFn = jest.fn();
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={mocktranslationFn}/>);

            expect(wrapper.find(IpFilterTestPanel).length).toEqual(0);

            wrapper.setState({ showTestPanel: true });

            expect(wrapper.find(IpFilterTestPanel).length).toEqual(1);
            const testPanelProps = wrapper.find(IpFilterTestPanel).instance().props as IpFilterTestPanelProps;
            expect(testPanelProps.filterRuleViewModels).toEqual(mockFilterRules);
            expect(testPanelProps.t).toEqual(mocktranslationFn);
            expect(wrapper).toMatchSnapshot();
        });

        it('updates showTestPanel state to false on testPanel dismiss', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);
            wrapper.setState({ showTestPanel: true });
            wrapper.find(IpFilterTestPanel).prop('onDismissClick')();

            const state = wrapper.state() as IpFilterViewState;
            expect(state.showTestPanel).toEqual(false);
        });
    });

    context('render/menuBar', () => {
        it('enables revert button only when isDirty state is true', () => {
            const mocktranslationFn = jest.fn();
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={mocktranslationFn}/>);

            const state = wrapper.state() as IpFilterViewState;
            expect(state.isDirty).toEqual(false);

            expect(wrapper.find(IpFilterMenuBar).length).toEqual(1);
            const menuBarProps = wrapper.find(IpFilterMenuBar).instance().props as IpFilterMenuBarProps;
            expect(menuBarProps.isRevertDisabled).toEqual(true);
            expect(menuBarProps.t).toEqual(mocktranslationFn);

            wrapper.setState({isDirty: true});
            const updatedMenuBarProps = wrapper.find(IpFilterMenuBar).instance().props as IpFilterMenuBarProps;
            expect(updatedMenuBarProps.isRevertDisabled).toEqual(false);
        });

        it('enables save button only when isDirty state is true and all filters are valid', () => {
            const mocktranslationFn = jest.fn();
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={mocktranslationFn}/>);

            const state = wrapper.state() as IpFilterViewState;
            expect(state.isDirty).toEqual(false);
            expect(state.filterRuleViewModels).toEqual(mockFilterRules);

            expect(wrapper.find(IpFilterMenuBar).length).toEqual(1);
            const menuBarProps = wrapper.find(IpFilterMenuBar).instance().props as IpFilterMenuBarProps;
            expect(menuBarProps.isSaveDisabled).toEqual(true);

            const invalidRuleModel = new InternetProtocolFilterRuleViewModel(
                {
                    action: IpFilterActionType.reject,
                    filterName: '$$$$$',
                    ipMask: 'invalid'
                },
                3
            );
          
            invalidRuleModel.validateName(new Set<string>());
            invalidRuleModel.validateAddressRange();
            wrapper.setState({
                filterRuleViewModels: [...mockFilterRules, invalidRuleModel],
                isDirty: true
            });

            let updatedMenuBarProps = wrapper.find(IpFilterMenuBar).instance().props as IpFilterMenuBarProps;
            expect(updatedMenuBarProps.isSaveDisabled).toEqual(true);

            const validFilterRule = new InternetProtocolFilterRuleViewModel(
                {
                    action: IpFilterActionType.reject,
                    filterName: 'valid_name',
                    ipMask: '127.0.0.1'
                },
                3
            );
            
            validFilterRule.validateName(new Set<string>());
            validFilterRule.validateAddressRange();

            wrapper.setState({
                filterRuleViewModels: [...mockFilterRules, validFilterRule],
                isDirty: true
            });

            updatedMenuBarProps = wrapper.find(IpFilterMenuBar).instance().props as IpFilterMenuBarProps;
            expect(updatedMenuBarProps.isSaveDisabled).toEqual(false);
        });

        it('invokes props.save on save button click', () => {
            const mockSave = jest.fn();
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={mockSave} informationBarMessage={'mock_message'} t={jest.fn()}/>);
            wrapper.setState({ isDirty: true });
            wrapper.find(IpFilterMenuBar).prop('onSaveClick')();

            const state = wrapper.state() as IpFilterViewState;
            expect(state.informationBar.show).toEqual(true);
            expect(state.informationBar.type).toEqual(MessageBarType.info);
            expect(state.requestMade).toEqual(true);
            expect(state.showOverlay).toEqual(true);
            expect(mockSave).toHaveBeenCalledWith([
                {
                    action: IpFilterActionType.Accept,
                    filterName: 'filter_one',
                    ipMask: '127.127.123.1/28'
                },
                {
                    action: IpFilterActionType.Reject,
                    filterName: 'filter_two',
                    ipMask: '127.127.123.2/20'
                }
            ]);
        });

        it('sets showTestPanel to true on test button click', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn()} informationBarMessage={'mock_message'} t={jest.fn()}/>);
            wrapper.setState({ isDirty: true });
            wrapper.find(IpFilterMenuBar).prop('onTestClick')();

            const state = wrapper.state() as IpFilterViewState;
            expect(state.showTestPanel).toEqual(true);
        });

        it('sets isConfirmingRevert to true on revert button click', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn()} informationBarMessage={'mock_message'} t={jest.fn()}/>);
            wrapper.setState({ isDirty: true });
            wrapper.find(IpFilterMenuBar).prop('onRevertClick')();

            const state = wrapper.state() as IpFilterViewState;
            expect(state.showOverlay).toEqual(true);
            expect(state.isConfirmingRevert).toEqual(true);
        });
    });

    context('render/infoMessageBar', () => {
        it('renders messageBar when informationBar.show state is true', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

            expect(wrapper.find(MessageBar).length).toEqual(0);

            wrapper.setState({ informationBar: { show: true }});

            expect(wrapper.find(MessageBar).length).toEqual(1);
            expect(wrapper).toMatchSnapshot();
        });

        it('updates informationBar.show state to false on dismiss click', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);
            wrapper.setState({ informationBar: { show: true }});
            wrapper.find(MessageBar).prop('onDismiss')();

            const state = wrapper.state() as IpFilterViewState;
            expect(state.informationBar.show).toEqual(false);
        });
    });

    context('render/revertMessageBar', () => {
        it('renders revertmessageBar when isConfirmingRevert state is true', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

            expect(wrapper.find('.listViewDisplay-revert-message').length).toEqual(0);

            wrapper.setState({ isConfirmingRevert: true });

            expect(wrapper.find(MessageBarButton).length).toEqual(2);
            expect(wrapper).toMatchSnapshot();
        });

        it('reverts filterRuleViewModels state to initial on revert click', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);
            wrapper.setState({
                filterRuleViewModels: [],
                isConfirmingRevert: true,
                isDirty: true,
                showOverlay: true
            });

            wrapper.find('.listViewDisplay-revert-button').first().simulate('click');

            const state = wrapper.state() as IpFilterViewState;
            expect(state.filterRuleViewModels).toEqual(mockFilterRules);
            expect(state.isConfirmingRevert).toEqual(false);
            expect(state.isDirty).toEqual(false);
            expect(state.showOverlay).toEqual(false);
            expect(wrapper.find('.listViewDisplay-revert-message').length).toEqual(0);
        });

        it('cancels reverts on cancelRevert click', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);
            wrapper.setState({
                isConfirmingRevert: true,
                showOverlay: true
            });

            wrapper.find('.listViewDisplay-cancel-revert-button').first().simulate('click');

            const state = wrapper.state() as IpFilterViewState;
            expect(state.isConfirmingRevert).toEqual(false);
            expect(state.showOverlay).toEqual(false);
            expect(wrapper.find('.listViewDisplay-revert-message').length).toEqual(0);
        });

        it('dismisses RevertMessageBar on dismiss click', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);
            wrapper.setState({
                informationBar: {
                    show: false
                },
                isConfirmingRevert: true,
                showOverlay: true
            });

            wrapper.find(MessageBar).prop('onDismiss')();

            const state = wrapper.state() as IpFilterViewState;
            expect(state.isConfirmingRevert).toEqual(false);
            expect(state.showOverlay).toEqual(false);
        });
    });

    context('render/Shimmer', () => {
        it('renders shimmer elements when props.isLoading is true and props.filterRuleViewModels does not have any item', () => {
            const wrapper = shallow(<IpFilterView filterRuleViewModels={[]} isLoading={true} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

            expect(wrapper.find(Shimmer).length).toEqual(3);
            expect(wrapper).toMatchSnapshot();

            wrapper.setProps({
                filterRuleViewModels: mockFilterRules
            });

            expect(wrapper.find(Shimmer).length).toEqual(0);

            wrapper.setProps({
                filterRuleViewModels: [],
                isLoading: false
            });

            expect(wrapper.find(Shimmer).length).toEqual(0);
        });
    });

    context('render/IpFilterList', () => {
        it('renders IpFilterList', () => {
            const mocktranslationFn = jest.fn();
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={mocktranslationFn}/>);

            const ipFilterListProps = wrapper.find(IpFilterList).instance().props as IpFilterListProps;
            expect(ipFilterListProps.filterRuleViewModels).toEqual(mockFilterRules);
            expect(ipFilterListProps.t).toEqual(mocktranslationFn);
        });

        it('invokes removeRuleHandler on rule removal', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

            wrapper.find(IpFilterList).prop('onRuleRemoved')(mockFilterRules[0]);

            const state = wrapper.state() as IpFilterViewState;
            expect(state.filterRuleViewModels).toEqual([mockFilterRules[1]]);
            expect(state.isDirty).toEqual(true);
        });

        it('invokes updateRuleHandler on rule change', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);
            const updatedFilterRule = {
                action: IpFilterActionType.Reject,
                filterName: 'updated_name',
                ipMask: '123.156.123.1/5'
            };

            wrapper.find(IpFilterList).prop('onRuleChanged')(updatedFilterRule, mockFilterRules[0]);

            const state = wrapper.state() as IpFilterViewState;
            expect(state.isDirty).toEqual(true);
            expect(state.filterRuleViewModels[0].filterRule).toEqual(updatedFilterRule);
            expect(state.filterRuleViewModels[0].key).toEqual(1);
            expect(state.filterRuleViewModels[0].nameValidation.isValid).toEqual(true);
            expect(state.filterRuleViewModels[0].addressRangeValidation.isValid).toEqual(true);
        });

        it('invokes reorderRuleHandler on rule reorder', () => {
            const wrapper = mount(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

            wrapper.find(IpFilterList).prop('onRuleMoved')(0, 1);

            const state = wrapper.state() as IpFilterViewState;
            expect(state.isDirty).toEqual(true);
            expect(state.filterRuleViewModels).toEqual([
                mockFilterRules[1],
                mockFilterRules[0]
            ]);
        });
    });

    context('render/addButton', () => {
        it('disables add button when filterRuleViewModels length is greater than 9', () => {
            const wrapper = shallow(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

            expect(wrapper.find('.ipFilter-add-button').first().props().disabled).toEqual(false);

            wrapper.setProps({ filterRuleViewModels: new Array(10) });
            expect(wrapper.find('.ipFilter-add-button').first().props().disabled).toEqual(true);

            wrapper.setProps({ filterRuleViewModels: new Array(9) });
            expect(wrapper.find('.ipFilter-add-button').first().props().disabled).toEqual(false);
        });

        it('invokes addClickHandler on add button click', () => {
            const wrapper = shallow(<IpFilterView filterRuleViewModels={mockFilterRules} isLoading={false} fetch={jest.fn()} save={jest.fn(([]) => null)} informationBarMessage={'mock_message'} t={jest.fn()}/>);

            wrapper.find('.ipFilter-add-button').first().simulate('click');

            const state = wrapper.state() as IpFilterViewState;

            expect(state.isDirty).toEqual(true);
            expect(state.newItemIndex).toEqual(3);
            expect(state.filterRuleViewModels[0]).toEqual(mockFilterRules[0]);
            expect(state.filterRuleViewModels[1]).toEqual(mockFilterRules[1]);
            expect(state.filterRuleViewModels[2].filterRule).toEqual({
                action: IpFilterActionType.Reject,
                filterName: '',
                ipMask: ''
            });
        });
    });
});
