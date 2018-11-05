import 'jest';
import * as React from 'react';
import { shallow } from 'enzyme';
import { Router } from './router';

describe('router', () => {
    describe('snapshot', () => {
        it ('matches snapshot', () => {
            const wrapper = shallow(<Router/>);
            expect(wrapper).toMatchSnapshot();
        });
    });
});