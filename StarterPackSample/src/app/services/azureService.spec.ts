import axios from 'axios';
import { getAzureSubscriptions } from './azureService';

jest.mock('axios');

describe('AzureService', () => { 
    
    context('getAzureSubscriptions', () => {

        // tslint:disable-next-line:no-any
        (axios as any).get.mockResolvedValue({
            data: {
                items: [],
                nextLink: ''
            }
        });

        it ('calls get on subscriptions endpoint', () => {
           
            getAzureSubscriptions({
                armEndpoint: 'https://endpoint',
                authorizationToken: 'authorizationToken',
                nextLink: ''
            }).then((value) => {
                expect(value.items.length).toEqual(0);
                expect(value.nextLink).toEqual('');
            });

            expect(axios.get).toBeCalledWith('https://endpoint/subscriptions?api-version=2016-06-01', {
                headers: {
                    Authorization: 'Bearer authorizationToken',
                    ContentType: 'application/json'
                }
            });
        });

        it ('calls next link when provided', () => {

            getAzureSubscriptions({
                armEndpoint: 'https://endpoint',
                authorizationToken: 'authorizationToken',
                nextLink: 'https://nextLink'
            }).then((value) => {
                expect(value.items.length).toEqual(0);
                expect(value.nextLink).toEqual('');
            });

            expect(axios.get).toBeCalledWith('https://nextLink', {
                headers: {
                    Authorization: 'Bearer authorizationToken',
                    ContentType: 'application/json'
                }
            });

        });

        it ('returns next link', () => {
            // tslint:disable-next-line:no-any
            (axios as any).get.mockResolvedValue({
                data: {
                    items: [],
                    nextLink: 'nextLink'
                }
            });

            getAzureSubscriptions({
                armEndpoint: 'https://endpoint',
                authorizationToken: 'authorizationToken',
                nextLink: ''
            }).then((value) => {
                expect(value.items.length).toEqual(0);
                expect(value.nextLink).toEqual('nextLink');
            });
        });

        it ('throws error when http client has exception', async () => {
            // tslint:disable-next-line:no-any
            (axios as any).get.mockImplementation(() => Promise.reject('mock Error'));

            expect.assertions(1);
            try {
                await getAzureSubscriptions({
                    armEndpoint: 'https://endpoint',
                    authorizationToken: 'authorizationToken',
                    nextLink: ''
                });
            } catch (e) {
                expect(e).toBeTruthy();
            }
        });
    });
});