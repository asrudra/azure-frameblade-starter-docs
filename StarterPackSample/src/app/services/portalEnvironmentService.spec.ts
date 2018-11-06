import { EnvironmentSettingNames } from './models/environmentSettingNames';
import * as portalEnvironmentService from './portalEnvironmentService';

const expectedOrigin: string = 'https://localhost';
const frameSignatureTest: string = 'portalEnvironmentFrameSignature';

describe('portalEnvironmentService', () => {

    context('getParentOrigin', () => {
        it('returns domain given trustedAuthority query string', () => {
            expect(portalEnvironmentService.getParentOrigin('?trustedAuthority=https://localhost')).toEqual(expectedOrigin);
        });
        
        it('returns empty string given missing query string', () => {
            expect(portalEnvironmentService.getParentOrigin('')).toEqual('');
        });
        
        it('returns empty string given malformed query string', () => {
            expect(portalEnvironmentService.getParentOrigin('?TrustAuthority=https://localhost')).toEqual('');
        });
        
        it('returns empty string given query string without trusted authority', () => {
            expect(portalEnvironmentService.getParentOrigin('?get=thing')).toEqual('');
        });
    });

    context('isTrustedOrigin', () => {
        it ('returns true for allowed origins', () => {
            const allowedOrigins: string[] = [
                'https://localhost', 
                'https://ms.portal.azure.com',
                'https://portal.azure.com',
                'https://portal.azure.us',
                'https://portal.azure.cn',
                'https://portal.microsoftazure.de',
                'https://df.onecloud.azure-test.net'
            ];

            allowedOrigins.forEach((origin) => {
                expect(portalEnvironmentService.isTrustedOrigin(origin)).toEqual(true);
            });
        });

        it ('returns false for disallowed origins', () => {

            const allowedOrigins: string[] = [
                'https://xss.com', 
                'https://crossiterus.en.us',
                'https://cromulet.site.tumblr.net',
                'https://ms.portal.azure.com.notMyDomain',
                'notAfullUrl'
            ];

            allowedOrigins.forEach((origin) => {
                expect(portalEnvironmentService.isTrustedOrigin(origin)).toEqual(false);
            });
        });
    });
  
    context('ensureInitialized', () => {

        it('does not post ready message when parent origin is trusted', () => {
            portalEnvironmentService.initialize('?trustedAuthority=https://notmyDomain');
            expect(window.parent.postMessage).toHaveBeenCalledTimes(0);
            expect(portalEnvironmentService.initialized).toEqual(true);
        });
    
        it('posts ready message when parent origin is trusted', () => {
            portalEnvironmentService.initialize();
            expect(window.parent.postMessage).toHaveBeenCalled();
            expect(portalEnvironmentService.initialized).toEqual(true);
        });
    });

    context('registerActionOnChange', () => {
        let valueToUpdate: number = 0;

        it('ensures initialization', () => {
            portalEnvironmentService.registerActionOnChange('testChange', (result) => { valueToUpdate = (result as number); });
            expect(portalEnvironmentService.initialized).toEqual(true);
            expect(portalEnvironmentService.parentOrigin).toBe(expectedOrigin);
            expect(portalEnvironmentService.promiseResolutions).not.toBe(undefined);
            expect(portalEnvironmentService.registeredActions).not.toBe(undefined);
            expect(window.addEventListener).toHaveBeenCalled();
            expect(window.postMessage).toHaveBeenCalled();
        });

        it('registers callback', () => {
            expect(portalEnvironmentService.registeredActions.has('testChange')).toEqual(true);
        });

        it ('does not execute callback when origin does not match', () => {
            const messageEvent = {
                data: { 
                    data: {
                        requestId: 'testChange',
                        responseBody: 1,
                    },
                    signature: frameSignatureTest
                },
                origin: 'https://notExpected'
            };
            portalEnvironmentService.receiveMessage(messageEvent as MessageEvent);
            expect(valueToUpdate).toEqual(0);
        });

        it ('does not execute callback when frame signature does not match', () => {
            const messageEvent = {
                data: { 
                    data: {
                        requestId: 'testChange',
                        responseBody: 1,
                    },
                    signature: 'notFrameSignature'
                },
                origin: expectedOrigin
            };
            portalEnvironmentService.receiveMessage(messageEvent as MessageEvent);
            expect(valueToUpdate).toEqual(0);
        });

        it ('does not execute callback when unregistered message type received', () => {
            const messageEvent = {
                data: { 
                    data: {
                        requestId: 'notTestChange',
                        responseBody: 1,
                    },
                    signature: frameSignatureTest
                },
                origin: expectedOrigin
            };
            portalEnvironmentService.receiveMessage(messageEvent as MessageEvent);
            expect(valueToUpdate).toEqual(0);
        });

        it('performs operation when message received', () => {
            const messageEvent = {
                data: { 
                    data: {
                        requestId: 'testChange',
                        responseBody: 1,
                    },
                    signature: frameSignatureTest
                },
                origin: expectedOrigin
            };
            portalEnvironmentService.receiveMessage(messageEvent as MessageEvent);
            expect(valueToUpdate).toEqual(1);
            expect(portalEnvironmentService.registeredActions.has('testChange')).toEqual(true);
        });
    });

    context('getSetting', () => {
        it('initializes and registers promise', () => {
            portalEnvironmentService.getSetting(EnvironmentSettingNames.ARM_ENDPOINT);
            expect(portalEnvironmentService.initialized).toEqual(true);
            expect(portalEnvironmentService.parentOrigin).toBe(expectedOrigin);
            expect(portalEnvironmentService.promiseResolutions).not.toBe(undefined);
            expect(portalEnvironmentService.registeredActions).not.toBe(undefined);
            expect(window.addEventListener).toHaveBeenCalled();
            expect(window.postMessage).toHaveBeenCalled();
        });

        it('registers callback', () => {
            expect(portalEnvironmentService.promiseResolutions.size).toEqual(1);
        });

        it('completes promise and removes from registry when message received', () => {
            const firstEntry = portalEnvironmentService.promiseResolutions.keys().next().value;
            const messageEvent = {
                data: { 
                    data: {
                        requestId: firstEntry,
                        responseBody: 1,
                    },
                    signature: frameSignatureTest
                },
                origin: expectedOrigin
            };
            portalEnvironmentService.receiveMessage(messageEvent as MessageEvent);
            expect(portalEnvironmentService.promiseResolutions.has(firstEntry)).toEqual(false);
            expect(portalEnvironmentService.promiseResolutions.size).toEqual(0);
        });
    });
});