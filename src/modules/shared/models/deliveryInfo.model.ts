import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { DeliveryInfo, DeliveryInfoDocument } from '../schemas/deliveryInfo.schema';

@Injectable()
export class DeliveryInfoModel {
  constructor(@InjectModel(DeliveryInfo.name) public model: PaginateModel<DeliveryInfoDocument>) {}

  async save(deliveryInfo: DeliveryInfo) {
    const createdDeliveryInfo = new this.model(deliveryInfo);
    return createdDeliveryInfo.save();
  }
}
