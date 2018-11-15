import * as React from 'react';
import { shallow } from 'enzyme';

export const testWithLocalizationContext = (Target: JSX.Element, enzymeWrapper: any = shallow) => { // tslint:disable-line:no-any
    const outerWrapper = shallow(Target); // tslint:disable-line:no-any
    const Children = outerWrapper.props().children;
    return enzymeWrapper(<Children t={jest.fn()}/>);
};
