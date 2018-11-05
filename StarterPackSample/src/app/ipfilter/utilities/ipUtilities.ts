import { IpFilterRule } from '@iotHubControlPlane/lib/models';
import { InputValidation } from '../viewModel/inputValidation';
import { ResourceKeys } from '../../../localization/resourceKeys';

// Only match IPv4 addresses.
const ip4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export function compare(filterA: IpFilterRule, filterB: IpFilterRule) {
    return (filterA === filterB) || 
        (
            !!filterA && 
            !!filterB && 
            filterA.action === filterB.action &&
            filterA.filterName === filterB.filterName &&
            filterA.ipMask === filterB.ipMask
        );
}

export function validateMask(mask: string): InputValidation {
    const trimmedMask = mask.trim();

    if (!trimmedMask) {
        return {
            isValid: false,
            validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isBlank
        };
    }

    if (trimmedMask.length < 7) {
        return {
            isValid: false,
            validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectLength
        };
    }

    if (trimmedMask.length > 28) {
        return {
            isValid: false,
            validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectLength
        };
    }

    const ipArr = trimmedMask.split('/');

    if (ipArr.length > 2) {
        return { isValid: false, validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectFormat};
    }

    const ipMatch = ipArr[0].match(ip4Regex);
    if (!ipMatch) {
        return { isValid: false, validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectFormat};
    }

    const ipAddrOctets = ipMatch.slice(1, 5);

    // Default CIDR.
    let cidr = 32;
    const ipAddress: IPAddress = new IPAddress(ipAddrOctets);
    // If CIDR is present in the mask.
    if (ipArr.length > 1) {
        cidr = Number(ipArr[1]);
        if (isNaN(cidr)) {
            return { isValid: false, validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectFormat };
        }

        if (cidr > 32) {
            return { isValid: false, validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectFormat };
        }

        if (ipAddress.isAnyIPAddress() && cidr !== 0) {
            return { isValid: false, validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectFormat };
        }

        if (cidr === 0 && !ipAddress.isAnyIPAddress()) {
            return { isValid: false, validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectFormat };
        }
    } else {
        if (ipAddress.isAnyIPAddress()) {
            return { isValid: false, validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectFormat };
        }
    }

    return { isValid: true };
}

export function validateIpAddress(ipAddress: string): boolean {
    return ip4Regex.test(ipAddress);
 }

export function checkIpAddressInRange(ipAddress: string, subnet: string): boolean {
    if (!validateIpAddress(ipAddress)) {
        return false;
    }
    const mask = subnet.match(/^(.*?)\/(\d{1,2})$/);
    if (!!mask) {
        const inputIpAddress = convertIpToInt(ipAddress);
        const startingIpAddress = convertIpToInt(mask[1]);
        const maskRange = Math.pow(2, 32 - parseInt(mask[2], 10));
        return (inputIpAddress >= startingIpAddress) && (inputIpAddress <= startingIpAddress + maskRange - 1);
    } else if (subnet.match(ip4Regex)) {
        return ipAddress === subnet;
    }
    return false;
}

function convertIpToInt(ipAddress: string): number {
    const ipOctets = ipAddress.split('.').map((octet) => parseInt(octet, 10));
    return ((((((ipOctets[0]) * 256) + (ipOctets[1])) * 256) + (ipOctets[2])) * 256) + (ipOctets[3]);
}

export class IPAddress {
    public decimalOctets: number[];

    // Change to take a string input, parse and throw error if parsing fails.
    constructor(ipAddrOctets: string[]) {
        // Normalize all octets to avoid the case where some octet is of type 00 (regex would allow that).
        this.decimalOctets = ipAddrOctets.map<number>((octet: string) => {
            return Number(octet);
        });
    }

    public isAnyIPAddress(): boolean {

        return this.decimalOctets.reduce<boolean>((a: boolean, b: number) => a && (b === 0), true);
    }
}