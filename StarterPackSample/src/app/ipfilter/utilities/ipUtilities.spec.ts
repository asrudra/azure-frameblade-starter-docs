import 'jest';
import 'jest-plugin-context';
import { checkIpAddressInRange, compare, validateMask, validateName, validateIpAddress, IPAddress } from './ipUtilities';
import { IpFilterRule, IpFilterActionType } from 'microsoft-azure-devices-iothub-controlplane20180401/lib/models';

describe('compare', () => {
    context('falsy filters', () => {
        it('should return true if both are null', () => {
            expect(compare(null, null)).toEqual(true);
        });

        it('should return true if both are undefined', () => {
            expect(compare(undefined, undefined)).toEqual(true);
        });

        it('should return false if they are not the same falsy value', () => {
            expect(compare(null, undefined)).toEqual(false);
        });
    });

    context('logically equal/not equal filters', () => {
        const filterA: IpFilterRule = {
            action: IpFilterActionType.Accept,
            ipMask: '1.1.1.1/24',
            filterName: 'test'
        };
        const filterB: IpFilterRule = {
            action: IpFilterActionType.Accept,
            ipMask: '1.1.1.1/24',
            filterName: 'test'
        };
        const filterC: IpFilterRule = {
            action: IpFilterActionType.Reject,
            ipMask: '1.1.1.1/24',
            filterName: 'test'
        };
        const filterD: IpFilterRule = {
            action: IpFilterActionType.Accept,
            ipMask: '1.1.1.1/23',
            filterName: 'test'
        };
        const filterE: IpFilterRule = {
            action: IpFilterActionType.Accept,
            ipMask: '1.1.1.1/23',
            filterName: 'test2'
        };
        it('should return true if logically similar', () => {
            expect(compare(filterA, filterB)).toEqual(true);
        });

        it('should return true if physically equal', () => {
            expect(compare(filterA, filterA)).toEqual(true);
        });

        it('should return false if not similar', () => {
            expect(compare(filterA, filterC)).toEqual(false);
            expect(compare(filterA, filterD)).toEqual(false);
            expect(compare(filterA, filterE)).toEqual(false);
        })
    })
});

describe('validateMask', () => {
    describe('scenarios without CIDR', () => {
        it('returns false when ip4 address contains too many octets', () => {
            expect(validateMask('127.0.0.0.0').isValid).toEqual(false);
        });

        it('returns false when ip4 address contains alphanumeric combination', () => {
            expect(validateMask('127.0.0.abc').isValid).toEqual(false);
        });

        it('returns false given any address', () => {
            expect(validateMask('0.0.0.0').isValid).toEqual(false);
        });

        it('returns false given invalid address number', () => {
            expect(validateMask('127.0.0.256').isValid).toEqual(false);
        });

        it('returns true given valid IP address', () => {
            expect(validateMask('127.0.0.0').isValid).toEqual(true);
        });
    });

    describe('scenarios with CIDR', () => {
        it('returns false if more than a single slash present', () => {
            expect(validateMask('127.0.0.1/2/2').isValid).toEqual(false);
        });

        it('returns false when ip4 address contains out of bound octet', () => {
            expect(validateMask('127.0.0.256/2').isValid).toEqual(false);
        });

        it('returns false when cidr Mask is not a number', () => {
            expect(validateMask('127.0.0.1/a').isValid).toEqual(false);
        });

        it('returns false when IP Address is any address and CIDR is not 0', () => {
            expect(validateMask('0.0.0.0/23').isValid).toEqual(false);
        });

        it('returns false when IP Address is not any address and CIDR is 0', () => {
            expect(validateMask('127.1.1.1/0').isValid).toEqual(false);
        });

        it('returns false when CIDR exceeds 32', () => {
            expect(validateMask('127.1.1.1/34').isValid).toEqual(false);
        });

        it('returns true when IP Address is not any address and CIDR is not 0', () => {
            expect(validateMask('127.1.1.1/23').isValid).toEqual(true);
        });
    });

    describe('invalid mask', () => {
        it('returns false for empty mask', () => {
            expect(validateMask('  ').isValid).toBe(false);
        });

        it('returns false for short mask', () => {
            expect(validateMask('1.1.1.').isValid).toBe(false);
        });

        it('returns false for long mask', () => {
            expect(validateMask('255.255.255.255/255.255.255.255').isValid).toBe(false);
        });

        it('returns false for invalid ip before mask', () => {
            expect(validateMask('256.256.256.256').isValid).toBe(false);
        });
    });
});

describe('checkIpAddressInRange', () => {
    context('returns false if input IP address is not valid', () => {
        [undefined, null, '', '1233'].map((input) => {
            it(`returns false if input is ${input}`, () => {
                expect(checkIpAddressInRange(input, '131.107.159.1/27')).toEqual(false);
            });
        });
    });

    context('returns true if input IP address falls inside subnet range', () => {
        const subnet = '131.107.159.1/27';
        ['131.107.159.1', '131.107.159.10', '131.107.159.31', '131.107.159.32'].map((input) => {
            it(`returns true for input Ip address - ${input} and subnet - ${subnet}`, () => {
                expect(checkIpAddressInRange(input, subnet)).toEqual(true);
            });
        });
    });

    context('returns false if input IP address falls outside subnet range', () => {
        const subnet = '131.107.159.1/27';
        ['131.107.159.0', '131.107.159.33'].map((input) => {
            it(`returns true for input Ip address - ${input} and subnet - ${subnet}`, () => {
                expect(checkIpAddressInRange(input, subnet)).toEqual(false);
            });
        });
    });

    context('behaves as expected when subnet is just a simple IP address', () => {
        it('returns true if input IP address and subnet IP address are same', () => {
            expect(checkIpAddressInRange('131.107.159.31', '131.107.159.31')).toEqual(true);
        });

        it('returns false when input IP address and subnet IP address are not equal', () => {
            expect(checkIpAddressInRange('131.107.159.31', '131.107.159.21')).toEqual(false);
        });

        it('returns false if subnet is not a valid IP', () => {
            expect(checkIpAddressInRange('131.107.159.31', '131.107.159.256')).toEqual(false);
        });
    });
});

describe('validateIPAddress', () => {
    context('validates correct ipv4 address', () => {
        ['127.0.0.1', '0.0.0.0', '255.255.255.255'].map((input) => {
            it(`returns true for input Ip address - ${input}`, () => {
                expect(validateIpAddress(input)).toBe(true);
            });
        });
    });

    context('returns false for incorrect ipv4 addresses', () => {
        ['256.0.0.1', '253.2.0.1999', '1.1.1.1.1'].map((input) => {
            it(`returns false for input Ip address - ${input}`, () => {
                expect(validateIpAddress(input)).toBe(false);
            });
        });
    });
});