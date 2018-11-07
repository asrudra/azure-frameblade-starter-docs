import * as React from 'react';
import { TranslationFunction } from 'i18next';
import { IColumn, DefaultButton, DetailsList, CheckboxVisibility, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { AzureSubscription } from '../../services/models/azureSubscription';
import { AzureSubscriptionsMenuBar } from './azureSubscriptionsMenuBar';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface AzureSubscriptionsViewProps {
    azureSubscriptions: AzureSubscription[];
    fetchAzureSubscriptions: (nextLink: string) => void;
    hasFetchedAzureSubscriptions: boolean;
    isFetchingAzureSubscriptions: boolean;
    errorFetchingAzureSubscriptions: boolean;
    nextLink: string;
    t: TranslationFunction;
}

export class AzureSubscriptionsView extends React.Component<AzureSubscriptionsViewProps, {}> {

    constructor(props: AzureSubscriptionsViewProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        if (this.props.isFetchingAzureSubscriptions || 
            this.props.hasFetchedAzureSubscriptions) {
                return;
        }
            
        this.props.fetchAzureSubscriptions('');
        
    }

    public generateSubscriptionListColumns(): IColumn[] {
        return [
            {
                fieldName: 'id',
                key: 'id',
                maxWidth: 300,
                minWidth: 100,
                name: this.props.t(ResourceKeys.azureSubscriptions.subscriptionsTable.id),
            },
            {
                fieldName: 'displayName',
                key: 'displayName',
                maxWidth: 300,
                minWidth: 100,
                name: this.props.t(ResourceKeys.azureSubscriptions.subscriptionsTable.displayName),
            },
            {
                fieldName: 'state',
                key: 'state',
                maxWidth: 300,
                minWidth: 100,
                name: this.props.t(ResourceKeys.azureSubscriptions.subscriptionsTable.state),
            },
            {
                fieldName: 'authorizationSource',
                key: 'authorizationSource',
                maxWidth: 300,
                minWidth: 100,
                name: this.props.t(ResourceKeys.azureSubscriptions.subscriptionsTable.authorizationSource),
            },
        ];
    }

    public render(): JSX.Element {
        const { t, errorFetchingAzureSubscriptions, isFetchingAzureSubscriptions, nextLink } = this.props;

        return (
            <div className="listViewDisplay">
                <div className="listViewDisplay-header">    
                    <AzureSubscriptionsMenuBar 
                        onRefreshClick={this.refreshHandler}
                        refreshDisabled={isFetchingAzureSubscriptions}
                        t={this.props.t}
                    />

                    {errorFetchingAzureSubscriptions &&
                        <MessageBar
                            className="listViewDisplay-message"
                            messageBarType={MessageBarType.warning}
                        >
                            {t(ResourceKeys.azureSubscriptions.errors.failedToGetSubscriptions)}
                        </MessageBar>
                    }
                </div>

                <div className="listViewDisplay-body">
                    <div className="listViewDisplay-content">
                        <p>
                            {t(ResourceKeys.azureSubscriptions.header.description)}
                        </p>
                    </div>

                    <div className="listViewDisplay-content">
                        <DetailsList
                            setKey="subscriptions"
                            checkboxVisibility={CheckboxVisibility.hidden}
                            items={this.props.azureSubscriptions}
                            columns={this.generateSubscriptionListColumns()}
                        />
                    </div>

                    {nextLink && 
                        <div className="listViewDisplay-content">
                            <DefaultButton
                                text={t(ResourceKeys.azureSubscriptions.subscriptionsTable.loadMore.text)}
                                disabled={!this.props.nextLink}
                                onClick={this.loadMoreHandler}
                            />
                        </div>
                    }
                </div>
            </div>
        );
    }

    public loadMoreHandler = (): void => {
        this.props.fetchAzureSubscriptions(this.props.nextLink);
    }

    public refreshHandler = (): void => {
        this.props.fetchAzureSubscriptions('');
    }
}