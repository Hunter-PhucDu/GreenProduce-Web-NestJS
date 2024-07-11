import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { IJwtPayload } from '../../modules/shared/interfaces/auth.interface';
import {
  CreateOrderRequestDto,
  UpdateOrderStatusForAdminRequestDto,
  UpdateOrderStatusForUserRequestDto,
} from './dtos/request.dto';
import { OrderResponseDto } from './dtos/response.dto';
import { Types } from 'mongoose';
import { OrderModel } from 'modules/shared/models/order.model';
import { ProductVariantModel } from 'modules/shared/models/productVariant.model';
import { CartItemModel } from 'modules/shared/models/cartItem.model';

@Injectable()
export class OrderService {
  constructor(
    private readonly cartItemModel: CartItemModel,
    private readonly orderModel: OrderModel,
    private readonly productVariantModel: ProductVariantModel,
  ) {}

  async createOrder(user: IJwtPayload, createOrderDto: CreateOrderRequestDto): Promise<OrderResponseDto> {
    try {
      const userId = new Types.ObjectId(user._id);

      let totalAmount = 0;
      const cartItems = [];
      for (const productId of createOrderDto.products) {
        const cartItem = await this.cartItemModel.model.findById(productId).exec();

        if (!cartItem) {
          throw new BadRequestException(`CartItem with ID ${productId} not found`);
        }
        cartItems.push(cartItem);
        const productVariant = await this.productVariantModel.model.findById(cartItem.productVariantId).exec();
        if (!productVariant) {
          throw new BadRequestException(`Product variant with ID ${cartItem.productVariantId} not found`);
        }

        totalAmount += productVariant.price * cartItem.quantity;
      }

      const newOrder = await this.orderModel.model.create({
        owner: userId,
        products: cartItems,
        totalAmount: totalAmount,
        deliveryInfo: createOrderDto.deliveryInfo,
        paymentMethod: createOrderDto.paymentMethod,
        orderDate: new Date(),
        status: 'PENDING',
        ...createOrderDto,
      });

      return plainToClass(OrderResponseDto, {
        ...newOrder.toObject(),
        products: cartItems,
      });
    } catch (error) {
      throw new BadRequestException(`Error while creating order: ${error.message}`);
    }
  }

  async getUserOrder(user: IJwtPayload, orderId: string): Promise<OrderResponseDto> {
    try {
      const order = await this.orderModel.model.findById(orderId);
      if (!order) {
        throw new BadRequestException('Order does not exist');
      }
      if (order.owner.toString() !== user._id) {
        throw new BadRequestException('You do not have permission to view this order');
      }
      return plainToInstance(OrderResponseDto, order.toObject());
    } catch (e) {
      throw new BadRequestException(`Error while getting order details: ${e.message}`);
    }
  }

  async getUserOrders(user: IJwtPayload): Promise<OrderResponseDto[]> {
    try {
      const userId = new Types.ObjectId(user._id);
      const ordersDoc = await this.orderModel.model.find({ owner: userId }).exec();

      return plainToInstance(
        OrderResponseDto,
        ordersDoc.map((order) => order.toObject()),
      );
    } catch (e) {
      throw new BadRequestException(`Error while getting orders: ${e.message}`);
    }
  }

  async getOrders(): Promise<OrderResponseDto[]> {
    try {
      const ordersDoc = await this.orderModel.model.find().exec();

      return plainToInstance(
        OrderResponseDto,
        ordersDoc.map((order) => order.toObject()),
      );
    } catch (e) {
      throw new BadRequestException(`Error while getting orders: ${e.message}`);
    }
  }

  async updateOrderStatusUser(
    user: IJwtPayload,
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusForUserRequestDto,
  ): Promise<OrderResponseDto> {
    try {
      const allowedStatusMap = {
        PENDING: ['CANCELLED'],
        SHIPPED: ['RETURNED'],
      };

      const updatedOrder = await this.orderModel.model.findById(orderId);

      if (!updatedOrder) {
        throw new BadRequestException('Order not found');
      }

      if (updatedOrder.owner.toString() !== user._id) {
        throw new BadRequestException('You do not have permission to view this order');
      }

      if (!Object.keys(allowedStatusMap).includes(updatedOrder.status)) {
        throw new BadRequestException(`Invalid status change for order in status ${updatedOrder.status}`);
      }

      if (!allowedStatusMap[updatedOrder.status].includes(updateOrderStatusDto.status)) {
        throw new BadRequestException(
          `Invalid status change from ${updatedOrder.status} to ${updateOrderStatusDto.status}`,
        );
      }

      if (updatedOrder.status === 'DELIVERED') {
        throw new BadRequestException('Cannot return an already delivered order');
      }

      updatedOrder.status = updateOrderStatusDto.status;
      await updatedOrder.save();

      return plainToClass(OrderResponseDto, updatedOrder.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating order status for user: ${error.message}`);
    }
  }

  async updateOrderStatusAdmin(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusForAdminRequestDto,
  ): Promise<OrderResponseDto> {
    try {
      const allowedStatus = [
        'PENDING',
        'PROCESSING',
        'CONFIRMED',
        'READY_FOR_SHIPPING',
        'CANCELLED',
        'SHIPPING',
        'SHIPPED',
        'DELIVERED',
        'RETURNED',
      ];

      if (!allowedStatus.includes(updateOrderStatusDto.status)) {
        throw new BadRequestException('Invalid status change for admin');
      }

      const updatedOrder = await this.orderModel.model.findById(orderId);

      if (!updatedOrder) {
        throw new BadRequestException('Order not found');
      }

      updatedOrder.status = updateOrderStatusDto.status;
      await updatedOrder.save();

      return plainToClass(OrderResponseDto, updatedOrder.toObject());
    } catch (error) {
      throw new BadRequestException(`Error while updating order status for admin: ${error.message}`);
    }
  }
}
