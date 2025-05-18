import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddItemDto } from './dto/add-item.dto';
import { OrderStatus } from '@prisma/client';
import { OpenAiAssitantService } from 'src/openai/openai-assistant.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private openai: OpenAiAssitantService,
  ) {}

  async create(dto: CreateOrderDto, userId: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: dto.branchId },
    });

    if (!branch || branch.userId !== userId) {
      throw new ForbiddenException('No autorizado para esta sucursal');
    }

    const { threadId, messages } = await this.openai.processNewConversation(
      `Hola soy ${dto.userName} y me gustaría hacer un pedido.`,
    );

    const order = await this.prisma.order.create({
      data: {
        userName: dto.userName,
        userPhone: dto.userPhone,
        branchId: dto.branchId,
        openaiThreadId: threadId,
      },
    });

    return {
      order,
      assistantmMessages: messages,
    };
  }

  async addItem(dto: AddItemDto, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Orden no encontrada');

    return this.prisma.orderItem.create({
      data: {
        orderId,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });
  }

  async findByBranch(branchId: string) {
    return this.prisma.order.findMany({
      where: {
        branchId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
