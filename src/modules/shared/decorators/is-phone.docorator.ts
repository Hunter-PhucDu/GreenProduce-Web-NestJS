import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';

@ValidatorConstraint({ async: true })
export class IsPhoneConstraint implements ValidatorConstraintInterface {
  validate(text: string) {
    return isValidPhoneNumber(text, 'VN');
  }
}

export function IsPhone(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsPhoneConstraint,
    });
  };
}
