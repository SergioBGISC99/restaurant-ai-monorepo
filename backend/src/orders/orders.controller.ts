import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { OrderStatus, Role } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddItemDto } from './dto/add-item.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.CLIENTE)
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.create(dto, req.user.sub);
  }

  @Post(':orderId/items')
  @Roles(Role.CLIENTE)
  addItem(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() dto: AddItemDto,
  ) {
    return this.ordersService.addItem(dto, orderId);
  }

  @Get('branch/:branchId')
  @Roles(Role.CLIENTE)
  findByBranch(@Param('branchId', ParseUUIDPipe) branchId: string) {
    return this.ordersService.findByBranch(branchId);
  }

  @Patch(':orderId/status/:status')
  @Roles(Role.CLIENTE)
  updateStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Param('status', ParseUUIDPipe) status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(orderId, status);
  }
}
