import * as React from 'react';
import { TranslationFunction } from 'i18next';
import { IColumn, DefaultButton, DetailsList, CheckboxVisibility, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { LocalizationContextConsumer, LocationContextInterface } from '../../contexts/localizationContext';
import { AzureSubscription } from '../../services/models/azureSubscription';
import { AzureSubscriptionsMenuBar } from './azureSubscriptionsMenuBar';
import { ResourceKeys } from '../../../localization/resourceKeys';

export interface AzureSubscriptionsViewProps {
    azureSubscriptions: AzureSubscription[];
    errorFetchingAzureSubscriptions: boolean;
    fetchAzureSubscriptions: (nextLink: string) => void;
    hasFetchedAzureSubscriptions: boolean;
    isFetchingAzureSubscriptions: boolean;
    nextLink: string;
}

export class AzureSubscriptionsView extends React.Component<AzureSubscriptionsViewProps, {}> {

    constructor(props: AzureSubscriptionsViewProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        if (this.props.isFetchingAzureSubscriptions || this.props.hasFetchedAzureSubscriptions) {
                return;
        }

        this.props.fetchAzureSubscriptions('');
    }

    private createListColumn = (name: string, localizationKey: string, t: TranslationFunction) => {
        return {
            fieldName: name,
            key: name,
            maxWidth: 300,
            minWidth: 100,
            name: t(localizationKey),
        };
    }

    public generateSubscriptionListColumns(t: TranslationFunction): IColumn[] {
        return [
            this.createListColumn('id', ResourceKeys.azureSubscriptions.subscriptionsTable.id, t),
            this.createListColumn('displayName', ResourceKeys.azureSubscriptions.subscriptionsTable.displayName, t),
            this.createListColumn('state', ResourceKeys.azureSubscriptions.subscriptionsTable.state, t),
            this.createListColumn('authorizationSource', ResourceKeys.azureSubscriptions.subscriptionsTable.authorizationSource, t)
        ];
    }

    public render(): JSX.Element {
        const { errorFetchingAzureSubscriptions, isFetchingAzureSubscriptions, nextLink } = this.props;

        return (
            <LocalizationContextConsumer>
                {(context: LocationContextInterface) => (
                    <div className="listViewDisplay">
                        <div className="listViewDisplay-header">
                            <AzureSubscriptionsMenuBar
                                onRefreshClick={this.refreshHandler}
                                refreshDisabled={isFetchingAzureSubscriptions}
                            />

                            {errorFetchingAzureSubscriptions &&
                                <MessageBar
                                    className="listViewDisplay-message"
                                    messageBarType={MessageBarType.warning}
                                >
                                    {context.t(ResourceKeys.azureSubscriptions.errors.failedToGetSubscriptions)}
                                </MessageBar>
                            }
                        </div>

                        <div className="listViewDisplay-body">
                            <div className="listViewDisplay-content">
                                <p>
                                    {context.t(ResourceKeys.azureSubscriptions.header.description)}
                                </p>
                            </div>

                            <div className="listViewDisplay-content">
                                <DetailsList
                                    setKey="subscriptions"
                                    checkboxVisibility={CheckboxVisibility.hidden}
                                    items={this.props.azureSubscriptions}
                                    columns={this.generateSubscriptionListColumns(context.t)}
                                />
                            </div>

                            {nextLink &&
                                <div className="listViewDisplay-content">
                                    <DefaultButton
                                        className="load-more-button"
                                        text={context.t(ResourceKeys.azureSubscriptions.subscriptionsTable.loadMore.text)}
                                        disabled={!this.props.nextLink}
                                        onClick={this.loadMoreHandler}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                )}
            </LocalizationContextConsumer>

        );
    }

    private loadMoreHandler = (): void => {
        this.props.fetchAzureSubscriptions(this.props.nextLink);
    }

    private refreshHandler = (): void => {
        this.props.fetchAzureSubscriptions('');
    }
}
