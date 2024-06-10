import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ERole } from '../enums/auth.enum';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { DeliveryInfo } from './deliveryInfo.schema';
import { ESex } from '../enums/user.enum';

export type UserDocument = User & Document;

@Schema({
  collection: 'Users',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User {
  @Prop({ required: false, type: String })
  avatar?: string;

  @Prop({ type: String, required: true, unique: true })
  userName: string;

  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ required: false, unique: true })
  phone: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, enum: ESex, default: ESex.FEMALE })
  sex: ESex;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: DeliveryInfo.name }], default: [] })
  deliveryInfo?: DeliveryInfo[];

  @Prop({ type: String, required: true, enum: ERole })
  role: ERole;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
UserSchema.index({ userName: 1 });
UserSchema.index({ email: 1 });
