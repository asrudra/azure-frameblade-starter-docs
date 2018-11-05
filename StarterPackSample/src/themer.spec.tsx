import * as React from 'react';
import { shallow } from 'enzyme';
import { receiveMessage } from './app/services/portalEnvironmentService';
import { Theme, Themer } from './themer';

describe('themer', () => {
    context('initialization', () => {
        it ('matches snapshot', () => {
            const wrapper = shallow(<Themer/>);
            expect(wrapper).toMatchSnapshot();
        });
    
        it('initializes to light theme', () => {
            const wrapper = shallow(<Themer/>);
            expect(wrapper.state('theme')).toEqual(Theme.light);
        });
    });

    context('theme switching', () => {

        it ('switches to dark theme', () => {
            const messageEvent = {
                data: { 
                    data: {
                        requestId: 'themeChange',
                        responseBody: 'dark',
                    },
                    signature: 'portalEnvironmentFrameSignature'
                },
                origin: 'https://localhost'
            };
            const wrapper = shallow(<Themer/>);
            expect(wrapper.find('div.theme-light').exists()).toEqual(true);
            receiveMessage(messageEvent as MessageEvent);
    
            wrapper.update();
            expect(wrapper.find('div.theme-dark').exists()).toEqual(true);
            expect(wrapper.state('theme')).toEqual(Theme.dark);
        });

        it ('switches to light theme', () => {
            const messageEvent = {
                data: { 
                    data: {
                        requestId: 'themeChange',
                        responseBody: 'light',
                    },
                    signature: 'portalEnvironmentFrameSignature'
                },
                origin: 'https://localhost'
            };
            
            const wrapper = shallow(<Themer/>);
            wrapper.setState({
                theme: Theme.dark
            });
            
            wrapper.update();
            expect(wrapper.find('div.theme-dark').exists()).toEqual(true);
            receiveMessage(messageEvent as MessageEvent);
            
            wrapper.update();
            expect(wrapper.find('div.theme-light').exists()).toEqual(true);
            expect(wrapper.state('theme')).toEqual(Theme.light);
        });
    });
});