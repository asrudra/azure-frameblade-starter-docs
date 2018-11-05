import { IpFilterRule } from '@iotHubControlPlane/lib/models';
import { validateMask } from '../utilities/ipUtilities';
import { InputValidation } from './inputValidation';
import { ResourceKeys } from '../../../localization/resourceKeys';

export class InternetProtocolFilterRuleViewModel {
    public key: number;
    public filterRule: IpFilterRule;
    public nameValidation?: InputValidation;
    public addressRangeValidation?: InputValidation;

    constructor(filterRule: IpFilterRule, key: number) {
        this.filterRule = filterRule;
        this.key = key;
    }

    public static getDuplicates(filterRuleViewModels: InternetProtocolFilterRuleViewModel[]): Set<string> {
        const duplicateNames: Set<string> = new Set<string>();
        const allNames: Set<string> = new Set<string>();
    
        filterRuleViewModels.forEach((filterRuleViewModel) => {
            if (allNames.has(filterRuleViewModel.filterRule.filterName)) {
                duplicateNames.add(filterRuleViewModel.filterRule.filterName);
            } else {
                allNames.add(filterRuleViewModel.filterRule.filterName);
            }
        });
    
        return duplicateNames;
    }

    public validateName(duplicates: Set<string>) {

        if (!this.filterRule.filterName) {
            this.nameValidation = {
                isValid: false,
                validationMessageKey: ResourceKeys.ipFilter.filterName.validation.isBlank
            };
            return;
        }

        if (this.filterRule.filterName.length > 128) {
            this.nameValidation = {
                isValid: false,
                validationMessageKey: ResourceKeys.ipFilter.filterName.validation.exceedsAllowedLength
            };
            return;
        }

        const allowedCharacters = new RegExp('^[A-Za-z0-9-:.+%_#*?!(),=@;\']{1,128}$');
        if (!allowedCharacters.test(this.filterRule.filterName)) {
            this.nameValidation = {
                isValid: false,
                validationMessageKey: ResourceKeys.ipFilter.filterName.validation.hasInvalidCharacters
            };
            return;
        }

        if (duplicates.has(this.filterRule.filterName)) {
            this.nameValidation = {
                isValid: false,
                validationMessageKey: ResourceKeys.ipFilter.filterName.validation.isDuplicate
            };
            return;
        }

        this.nameValidation = {
            isValid: true
        };
    }

    public validateAddressRange() {

        if (!this.filterRule.ipMask) {
            this.addressRangeValidation = {
                isValid: false,
                validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isBlank
            };
            return;
        }

        if (this.filterRule.ipMask.length < 7) {
            this.addressRangeValidation = {
                isValid: false,
                validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectLength
            };
            return;
        }

        if (this.filterRule.ipMask.length > 28) {
            this.addressRangeValidation = {
                isValid: false,
                validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectLength
            };
            return;
        }

        if (!validateMask(this.filterRule.ipMask).isValid) {
            this.addressRangeValidation = {
                isValid: false,
                validationMessageKey: ResourceKeys.ipFilter.ipMask.validation.isIncorrectFormat
            };
            return;
        }

        this.addressRangeValidation = {
            isValid: true
        };
    }
}
