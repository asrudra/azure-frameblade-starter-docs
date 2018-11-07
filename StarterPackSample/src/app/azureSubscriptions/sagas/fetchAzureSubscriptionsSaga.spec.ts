import { cloneableGenerator } from 'redux-saga/utils';
import { put, call } from 'redux-saga/effects';
import { fetchAzureSubscriptionsSaga } from './fetchAzureSubscriptionsSaga';
import { clearAzureSubscriptionsAction, fetchAzureSubscriptionsAction } from '../actions';
import { getSetting } from '../../services/portalEnvironmentService';
import { EnvironmentSettingNames } from '../../services/models/environmentSettingNames';
import { getAzureSubscriptions } from '../../services/azureService';
import { AzureSubscription } from '../../services/models/azureSubscription';
import { ContinuingResultSet } from '../../services/models/continuingResultSet';

describe('fetchAzureSubscriptionsSaga', () => {

    context('nextLink is null (new or refresh scenario)', () => {
        const nextLink = '';
        const authorizationToken = 'armToken';
        const armEndpoint = 'armEndpoint';
        let fetchAzureSubscriptionsSagaGenerator;

        beforeAll(() => {
            fetchAzureSubscriptionsSagaGenerator = cloneableGenerator(fetchAzureSubscriptionsSaga)(fetchAzureSubscriptionsAction.started({ nextLink }));
        });

        it('creates put effect to clear subscriptions', () => {
            expect(fetchAzureSubscriptionsSagaGenerator.next()).toEqual({
                done: false,
                value: put(clearAzureSubscriptionsAction())
            });
        });

        it('creates call effect to get authorizationToken', () => {
            expect(fetchAzureSubscriptionsSagaGenerator.next()).toEqual({
                done: false,
                value: call(getSetting, EnvironmentSettingNames.AUTHORIZATION_TOKEN)
            });
        });

        it('creates call effect to get armEndpoint', () => {
            expect(fetchAzureSubscriptionsSagaGenerator.next(authorizationToken)).toEqual({
                done: false,
                value: call(getSetting, EnvironmentSettingNames.ARM_ENDPOINT)
            });
        });

        it ('creates call effect to get azureSubscriptions', () => {
            expect(fetchAzureSubscriptionsSagaGenerator.next(armEndpoint)).toEqual({
                done: false,
                value: call(getAzureSubscriptions, {
                    armEndpoint,
                    authorizationToken,
                    nextLink
                })
            });
        });

        context('successful fetch', () => {
            it('dispatch put effect for AZURE_SUBSCRIPTIONS/FETCH_DONE action after getting subscriptions', () => {

                const clone = fetchAzureSubscriptionsSagaGenerator.clone();
                const mockResponse: ContinuingResultSet<AzureSubscription> = {
                    items: [{
                        id: '12'
                    }],
                    nextLink: 'nextLink'
                };

                expect(clone.next(mockResponse)).toEqual({
                    done: false,
                    value: put({
                        payload: {
                            params: { nextLink },
                            result: {
                                azureSubscriptions: mockResponse.items,
                                nextLink: mockResponse.nextLink
                            }
                        },
                        type: 'AZURE_SUBSCRIPTIONS/FETCH_DONE'
                    })
                });

                expect(clone.next().done).toBeTruthy();
            });
        });

        context('unsuccessful fetch', () => {
            it('dispatch put effect for AZURE_SUBSCRIPTIONS/FETCH_FAILED action after getting subscriptions errors', () => {

                const clone = fetchAzureSubscriptionsSagaGenerator.clone();
                const error = {code: -1};

                expect(clone.throw(error)).toEqual({
                    done: false,
                    value: put({
                        error: true,
                        payload: {
                            error,
                            params: { nextLink }
                        },
                        type: 'AZURE_SUBSCRIPTIONS/FETCH_FAILED'
                    })
                });

                expect(clone.next().done).toBeTruthy();
            });
        });
    });

    context('nextLink is not null', () => {
        it('does not create put effect to clear subscriptions', () => {
            const fetchAzureSubscriptionsSagaGenerator = cloneableGenerator(fetchAzureSubscriptionsSaga)(fetchAzureSubscriptionsAction.started({ nextLink: 'nextLink' }));
            expect(fetchAzureSubscriptionsSagaGenerator.next()).toEqual({
                done: false,
                value: call(getSetting, EnvironmentSettingNames.AUTHORIZATION_TOKEN)
            });
        });
    });
});
