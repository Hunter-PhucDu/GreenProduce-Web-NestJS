import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { EPaymentStatus } from '../enums/payment.enum';

export type PaymentDocument = Payment & Document;

@Schema({
  collection: 'Payments',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Payment {
  @Prop({ required: true, type: Number })
  orderCode: number;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: String, enum: EPaymentStatus, default: EPaymentStatus.PENDING })
  status: EPaymentStatus;

  @Prop({ required: true, type: String })
  payos_paymentLinkId: string;

  @Prop({ required: true, type: String })
  payos_checkoutUrl: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.plugin(mongoosePaginate);
