import { generateUuid } from 'ms-rest-js';
import { AzureResource } from './models/azureResource';
import { EnvironmentSettingNames } from './models/environmentSettingNames';

declare var frameSignature: string;
export let initialized: boolean = false;
export let parentOrigin: string;
export let promiseResolutions: Map<string, (value?: any | PromiseLike<any>) => void>; // tslint:disable-line: no-any
export let registeredActions: Map<string, (value: any) => void>; // tslint:disable-line: no-any    

export function registerActionOnChange(changeType: string, action: (value: any) => void): void {  // tslint:disable-line: no-any
    if (!initialized) {
        initialize();
    }
    
    registeredActions.set(changeType, action);  
}

export function getSetting(settingName: EnvironmentSettingNames): Promise<string> {
    return executeSettingRequest(settingName);
}

export function getAzureResource(): Promise<AzureResource> {
    return executeSettingRequest(EnvironmentSettingNames.AZURE_RESOURCE);
}

export function receiveMessage(event: MessageEvent) {
    if (event.origin.toLowerCase() !== parentOrigin) {
        return;
    }

    const msg = event.data;
    if (!msg || msg.signature !== frameSignature) {
        return;
    }

    const promise = promiseResolutions.get(msg.data.requestId);
    if (promise) {
        promise(msg.data.responseBody);
        promiseResolutions.delete(msg.data.requestId);
        return;
    }

    const registeredAction = registeredActions.get(msg.data.requestId);
    if (registeredAction) {
        registeredAction(msg.data.responseBody);
    }
}

function executeSettingRequest<T>(settingName: string): Promise<T> {
    if (!initialized) {
        initialize();
    }

    const requestUniqueId = generateUuid();
    const settingPromise = new Promise<T>((resolve, reject) => {
        window.parent.postMessage(
        {
            data: {
                requestId: requestUniqueId,
            },
            kind: settingName,
            signature: frameSignature
        }, 
        parentOrigin);
        promiseResolutions.set(requestUniqueId, resolve);
    });

    return settingPromise;
}

export function initialize(locationSearch?: string) {
    promiseResolutions = new Map<string, (value?: any | PromiseLike<any>) => void>();  // tslint:disable-line: no-any
    registeredActions = new Map<string, (value: any) => void>(); // tslint:disable-line: no-any
    
    if (!locationSearch) {
        locationSearch = window.location.search;
    }
    
    parentOrigin = getParentOrigin(locationSearch);
    if (isTrustedOrigin(parentOrigin)) {
        window.addEventListener('message', receiveMessage);
        window.parent.postMessage(
            {
                kind: 'ready',
                signature: frameSignature
            }, 
            parentOrigin); 
    }
    initialized = true;    
    
}

export function getParentOrigin(locationSearch: string): string {

    const queryStringMap = () => {
        const query = locationSearch.substring(1);
        const parameterList = query.split('&');
        const map: Map<string, string> = new Map();
        for (const item of parameterList) {
            const pair = item.split('=');
            map[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return map;
    };
    
    const trustedAuthorityKey = 'trustedAuthority';
    return queryStringMap()[trustedAuthorityKey] || '';
}

export function isTrustedOrigin(originToVerify: string): boolean {
    
    const allowedParentOrigins: string[] = [
        'localhost', 
        'ms.portal.azure.com',
        'portal.azure.com',
        'portal.azure.us',
        'portal.azure.cn',
        'portal.microsoftazure.de',
        'df.onecloud.azure-test.net'
    ];

    const trustedAuthority = (originToVerify.split('//')[1] || '').toLowerCase();

    return allowedParentOrigins.some((origin: string) => {
        return origin === trustedAuthority;
    });
}