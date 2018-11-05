import 'jest';
import context from 'jest-plugin-context';
import * as utilities from '../utilities/ipUtilities';
import { InternetProtocolFilterRuleViewModel } from './internetProtocolFilterRuleViewModel';

describe('internetProtocolFilterRuleViewModel', () => {
    const model = new InternetProtocolFilterRuleViewModel(
        {
            action: 'accept',
            filterName: '',
            ipMask: '',
        },
        1
    );

    describe('getDuplicates', () => {
        it ('returns duplicates', () => {
            const models = [
                new InternetProtocolFilterRuleViewModel({ action: 'accept', filterName: 'duplicate', ipMask: ''}, 1),
                new InternetProtocolFilterRuleViewModel({ action: 'accept', filterName: 'duplicate', ipMask: ''}, 2),
                new InternetProtocolFilterRuleViewModel({ action: 'accept', filterName: 'notDuplicate', ipMask: ''}, 3)
            ];

            expect(InternetProtocolFilterRuleViewModel.getDuplicates(models).has('duplicate')).toEqual(true);
        });
    });

    describe('#validateName', () => {
        context('isBlank validation', () => {
            [undefined, null, ''].forEach((input) => {
                it(`sets validationMessageKey when filterName is '${input}'`, () => {
                    model.filterRule.filterName = input;
                    model.validateName(new Set<string>());

                    expect(model.nameValidation.isValid).toEqual(false);
                    expect(model.nameValidation.validationMessageKey).toEqual('ipFilter.filterName.validation.isBlank');
                });
            });
        });

        context('duplicate validation', () => {
            it('sets name validation to { isValid: false, validationMessageKey: isDuplicate } when filterName has duplicate', () => {
                    const duplicateName = 'duplicate';
                    const duplicates: Set<string> = new Set<string>();
                    duplicates.add(duplicateName);
                    
                    model.filterRule.filterName = duplicateName;
                    model.validateName(duplicates);
                    expect(model.nameValidation.isValid).toEqual(false);
                    expect(model.nameValidation.validationMessageKey).toEqual('ipFilter.filterName.validation.isDuplicate');
            });

            it ('sets name validation to { isValid: true, validationMessageKey: undefined } when filterName has no duplicate present', () => {
                const duplicates: Set<string> = new Set<string>();
                duplicates.add('duplicate');
                
                model.filterRule.filterName = 'notDuplicates';
                model.validateName(duplicates);
                expect(model.nameValidation.isValid).toEqual(true);
                expect(model.nameValidation.validationMessageKey).toBe(undefined);

            });

            it ('sets name validation to { isValid: true, validationMessageKey: undefined } when validateName has no duplicates provided', () => {
                const duplicateName = 'duplicate';
                const duplicates: Set<string> = new Set<string>();
                duplicates.add(duplicateName);
                
                model.filterRule.filterName = duplicateName;
                model.validateName(new Set<string>());
                expect(model.nameValidation.isValid).toEqual(true);
                expect(model.nameValidation.validationMessageKey).toBe(undefined);
            });
        });

        context('length validation', () => {
            it('sets name validation to { isValid: false, validationMessageKey: exceedsAllowedLength } when filterName length is more than 128 characters', () => {
                model.filterRule.filterName = new Array(130).join('x');
                model.validateName(new Set<string>());

                expect(model.nameValidation.isValid).toEqual(false);
                expect(model.nameValidation.validationMessageKey).toEqual('ipFilter.filterName.validation.exceedsAllowedLength');
            });

            it('sets name validation to { isValid: true, validationMessageKey: undefined } when filterName length is less than 128 characters', () => {
                model.filterRule.filterName = new Array(128).join('x');
                model.validateName(new Set<string>());

                expect(model.nameValidation.isValid).toEqual(true);
                expect(model.nameValidation.validationMessageKey).toBeUndefined();
            });

            it('sets name validation to { isValid: true, validationMessageKey: undefined } when filterName length is equal to 128 characters', () => {
                model.filterRule.filterName = new Array(129).join('x');
                model.validateName(new Set<string>());

                expect(model.nameValidation.isValid).toEqual(true);
                expect(model.nameValidation.validationMessageKey).toBeUndefined();
            });
        });

        context('regex validation', () => {
            it('sets name validation to { isValid: false, validationMessageKey: hasInvalidCharacter } when filterName contains special character', () => {
                model.filterRule.filterName = '$pecialChar';

                model.validateName(new Set<string>());
                expect(model.nameValidation.isValid).toEqual(false);
                expect(model.nameValidation.validationMessageKey).toEqual('ipFilter.filterName.validation.hasInvalidCharacters');
            });

            it('sets name validation to { isValid: false, validationMessageKey: hasInvalidCharacter } whe filterName contains space', () => {
                model.filterRule.filterName = '$pecial Char';

                model.validateName(new Set<string>());
                expect(model.nameValidation.isValid).toEqual(false);
                expect(model.nameValidation.validationMessageKey).toEqual('ipFilter.filterName.validation.hasInvalidCharacters');
            });

            it('sets name validation to { isValid: true, validationMessageKey: undefined } when filterName contains no special characters', () => {
                model.filterRule.filterName = 'filter_home';

                model.validateName(new Set<string>());
                expect(model.nameValidation.isValid).toEqual(true);
                expect(model.nameValidation.validationMessageKey).toBeUndefined();
            });
        });
    });

    describe('#validateAddressRange', () => {
        context('isBlank validation', () => {
            [undefined, null, ''].forEach((input) => {
                it(`sets addressRangeValidation to { isValid: false, validationMessageKey: isBlank} when when ipMask is '${input}'`, () => {
                    model.filterRule.ipMask = input;

                    model.validateAddressRange();
                    expect(model.addressRangeValidation.isValid).toEqual(false);
                    expect(model.addressRangeValidation.validationMessageKey).toEqual('ipFilter.ipMask.validation.isBlank');
                });
            });
        });

        context('length validation', () => {
            it('sets addressRangeValidation to { isValid: false, validationMessageKey: isIncorrectLength} when ipMask length is less than 7 characters', () => {
                model.filterRule.ipMask = new Array(7).join('x');

                model.validateAddressRange();
                expect(model.addressRangeValidation.isValid).toEqual(false);
                expect(model.addressRangeValidation.validationMessageKey).toEqual('ipFilter.ipMask.validation.isIncorrectLength');
            });

            it('sets addressRangeValidation to { isValid: false, validationMessageKey: isIncorrectLength} when ipMask length is more than 28 characters', () => {
                model.filterRule.ipMask = new Array(30).join('x');

                model.validateAddressRange();
                expect(model.addressRangeValidation.isValid).toEqual(false);
                expect(model.addressRangeValidation.validationMessageKey).toEqual('ipFilter.ipMask.validation.isIncorrectLength');
            });

            it(`sets addressRangeValidation to { isValid: true, validationMessageKey: undefined} when ipMask is valid and it's length is in between 7 and 28 characters`, () => {
                ['123.123.121.12', '123.123.102.1/2'].forEach((ipMask) => {
                    model.filterRule.ipMask = ipMask;

                    model.validateAddressRange();
                    expect(model.addressRangeValidation.isValid).toEqual(true);
                    expect(model.addressRangeValidation.validationMessageKey).toBeUndefined();
                });
            });
        });

        context('ip mask validation', () => {
            const spy = jest.spyOn(utilities, 'validateMask');

            it('sets validationMessageKey when validateMask returns false', () => {
                spy.mockReturnValue({ isValid: false });
                model.filterRule.ipMask = new Array(10).join('x');
                model.validateAddressRange();

                expect(spy).toHaveBeenCalledWith(model.filterRule.ipMask);
                expect(model.addressRangeValidation.isValid).toEqual(false);
                expect(model.addressRangeValidation.validationMessageKey).toEqual('ipFilter.ipMask.validation.isIncorrectFormat');
            });

            it('sets validationMessageKey when validateMask returns true', () => {
                spy.mockReturnValue({ isValid: true });
                model.filterRule.ipMask = new Array(10).join('x');
                model.validateAddressRange();

                expect(spy).toHaveBeenCalledWith(model.filterRule.ipMask);
                expect(model.addressRangeValidation.isValid).toEqual(true);
                expect(model.addressRangeValidation.validationMessageKey).toBeUndefined();
            });
        });
    });
});
