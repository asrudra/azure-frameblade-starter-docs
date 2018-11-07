import * as React from 'react';
import { TranslationFunction } from 'i18next';
import { AzureSubscription } from '../../services/models/azureSubscription';

export interface AzureSubscriptionsViewProps {
    azureSubscriptions: AzureSubscription[];
    fetchAzureSubscriptions: (nextLink: string) => void;
    nextLink: string;
    t: TranslationFunction;
}

export class AzureSubscriptionsView extends React.Component<AzureSubscriptionsViewProps, {}> {

    constructor(props: AzureSubscriptionsViewProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        this.props.fetchAzureSubscriptions('');
    }

    public render(): JSX.Element {
        return (
            <div>
                {this.props.azureSubscriptions.map((azureSubscription) => <div key={azureSubscription.id}>{azureSubscription.id}</div>)}
            </div>
        );
    }
}