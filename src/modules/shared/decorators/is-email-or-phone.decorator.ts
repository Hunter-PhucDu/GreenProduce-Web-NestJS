import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';

@ValidatorConstraint({ async: true })
export class IsEmailOrPhoneConstraint implements ValidatorConstraintInterface {
  validate(text: string) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(text) || isValidPhoneNumber(text, 'VN');
  }
}

export function IsEmailOrPhone(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsEmailOrPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailOrPhoneConstraint,
    });
  };
}
