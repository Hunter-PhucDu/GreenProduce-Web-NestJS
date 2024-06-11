import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export type OtpDocument = Otp & Document;

@Schema({
  collection: 'Otps',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  minimize: false,
})
export class Otp {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, type: String })
  otp: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.plugin(mongoosePaginate);

// Delete after 10 minuts
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
