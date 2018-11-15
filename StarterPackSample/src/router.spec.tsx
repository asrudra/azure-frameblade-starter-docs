import 'jest';
import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Router } from './router';
import * as EnvironmentService from './app/services/portalEnvironmentService';

describe('router', () => {
    describe('snapshot', () => {
        it ('matches snapshot', () => {
            const wrapper = shallow(<Router/>);

            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('componentWillMount', () => {
        it('calls EnvironmentService to get routeName', async () => {
            const spy = jest.spyOn(EnvironmentService, 'getSetting').mockResolvedValue('my-route');

            const wrapper  = mount(<Router/>);

            expect(wrapper).toBeDefined();
            expect((wrapper.state() as any).routeName).toEqual(''); // tslint:disable-line: no-any
            expect(spy).toHaveBeenNthCalledWith(1, 'routeName');

            await Promise.resolve();
            expect((wrapper.state() as any).routeName).toEqual('my-route'); // tslint:disable-line: no-any
        });
    });
});
