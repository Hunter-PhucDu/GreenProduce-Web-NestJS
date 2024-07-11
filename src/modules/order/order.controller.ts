import { Body, Controller, Post, Put, UseGuards, Param, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiSuccessPaginationResponse,
  ApiSuccessResponse,
} from '../../modules/shared/decorators/api-success-response.decorator';
import { Roles } from '../../modules/shared/decorators/role.decorator';
import { ERole } from '../../modules/shared/enums/auth.enum';
import { JwtAuthGuard } from '../../modules/shared/gaurds/jwt.guard';
import { RolesGuard } from '../../modules/shared/gaurds/role.gaurd';
import { ValidateObjectId } from '../../modules/shared/validators/id.validator';
import { IJwtPayload } from '../../modules/shared/interfaces/auth.interface';
import {
  CreateOrderRequestDto,
  UpdateOrderStatusForAdminRequestDto,
  UpdateOrderStatusForUserRequestDto,
} from './dtos/request.dto';
import { OrderResponseDto, OrdersResponseDto } from './dtos/response.dto';
import { OrderService } from './order.service';

@Controller('orders')
@ApiTags('Order')
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('')
  @Roles([ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Create new order',
    description: 'Create new order',
  })
  @ApiSuccessResponse({ dataType: OrderResponseDto })
  async createOrder(@Body() body: CreateOrderRequestDto, @Req() req): Promise<OrderResponseDto> {
    const user: IJwtPayload = req.user;
    return await this.orderService.createOrder(user, body);
  }

  @Get('get/:orderId')
  @Roles([ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get order  details',
    description: 'Get order  details',
  })
  @ApiSuccessResponse({ dataType: OrderResponseDto })
  async getCourse(@Param('orderId', new ValidateObjectId()) orderId: string, @Req() req): Promise<OrderResponseDto> {
    const user: IJwtPayload = req.user;
    return await this.orderService.getUserOrder(user, orderId);
  }

  @Get('orders')
  @Roles([ERole.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get orders details',
    description: 'Get orders details for admin',
  })
  @ApiSuccessPaginationResponse({ dataType: OrdersResponseDto })
  async geUserOrders(): Promise<OrderResponseDto[]> {
    return await this.orderService.getOrders();
  }

  @Get('')
  @Roles([ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get orders details',
    description: 'Get orders details',
  })
  @ApiSuccessPaginationResponse({ dataType: OrdersResponseDto })
  async getUserOrders(@Req() req): Promise<OrderResponseDto[]> {
    const user: IJwtPayload = req.user;
    return await this.orderService.getUserOrders(user);
  }

  @Put(':orderId/status/user')
  @Roles([ERole.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update order status for user',
  })
  @ApiSuccessResponse({ dataType: OrderResponseDto })
  async updateOrderStatusUser(
    @Param('orderId', new ValidateObjectId()) orderId: string,
    @Req() req,
    @Body() updateOrderStatusDto: UpdateOrderStatusForUserRequestDto,
  ): Promise<OrderResponseDto> {
    const user: IJwtPayload = req.user;
    return await this.orderService.updateOrderStatusUser(user, orderId, updateOrderStatusDto);
  }

  @Put(':orderId/status/admin')
  @Roles([ERole.ADMIN])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Update order status',
    description: 'Update order status for admin',
  })
  @ApiSuccessResponse({ dataType: OrderResponseDto })
  async updateOrderStatusAdmin(
    @Param('orderId', new ValidateObjectId()) orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusForAdminRequestDto,
  ): Promise<OrderResponseDto> {
    return await this.orderService.updateOrderStatusAdmin(orderId, updateOrderStatusDto);
  }
}
