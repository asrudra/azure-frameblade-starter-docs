import * as React from 'react';
import IPFilterViewContainer from './app/ipfilter/components/ipFilterViewContainer';
import { EnvironmentSettingNames } from './app/services/models/environmentSettingNames';
import { getSetting } from './app/services/portalEnvironmentService';

interface RouterState {
    routeName: string;
}

const ROUTE_COMPONENT_MAPPING = {
    ipFilter: <IPFilterViewContainer/>
};

export class Router extends React.Component<{}, RouterState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            routeName: ''
        };
    }

    public componentWillMount() {
        getSetting(EnvironmentSettingNames.ROUTE_NAME).then((routeName: string) => this.setState({ routeName }));
    }

    public render(): JSX.Element {
        return ROUTE_COMPONENT_MAPPING[this.state.routeName] ||  <div/>;
    }
}
