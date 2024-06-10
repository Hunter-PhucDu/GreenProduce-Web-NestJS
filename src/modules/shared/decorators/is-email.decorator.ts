import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsEmailConstraint implements ValidatorConstraintInterface {
  validate(text: string) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(text);
  }
}

export function IsEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailConstraint,
    });
  };
}
