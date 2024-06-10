import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Payment, PaymentDocument } from '../schemas/payment.schema';

@Injectable()
export class PaymentModel {
  constructor(@InjectModel(Payment.name) public model: PaginateModel<PaymentDocument>) {}

  async save(payment: Payment, session?: any) {
    const createdPayment = new this.model(payment);
    return createdPayment.save({ session });
  }
}
