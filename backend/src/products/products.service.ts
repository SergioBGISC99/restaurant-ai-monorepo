import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import * as fs from 'fs';
// import * as csvParser from 'csv-parser';
import csvParser = require('csv-parser');

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, userId: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: dto.branchId },
    });

    if (!branch || branch.userId !== userId) {
      throw new ForbiddenException(
        'No puedes agregar productos a esta sucursal',
      );
    }

    return this.prisma.product.create({ data: dto });
  }

  async findAll(branchId: string) {
    return this.prisma.product.findMany({
      where: { branchId, isActive: true },
    });
  }

  async update(id: string, dto: UpdateProductDto, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const branch = await this.prisma.branch.findUnique({
      where: { id: product.branchId },
    });

    if (branch?.userId !== userId) {
      throw new ForbiddenException(
        'No puedes modificar productos en esta sucursal',
      );
    }

    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const branch = await this.prisma.branch.findUnique({
      where: { id: product.branchId },
    });

    if (branch?.userId !== userId) {
      throw new ForbiddenException(
        'No puedes eliminar productos en esta sucursal',
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async importFromCsv(path: string, branchId: string, userId: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch || branch.userId !== userId) {
      throw new ForbiddenException(
        'No autorizado para importar en esta sucursal',
      );
    }

    const results: { name: string; price: number }[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .pipe(csvParser())
        .on('data', (data) => {
          if (data.name && data.price) {
            results.push({
              name: data.name,
              price: parseFloat(data.price),
            });
          }
        })
        .on('end', () => {
          (async () => {
            try {
              const created = await this.prisma.product.createMany({
                data: results.map((p) => ({ ...p, branchId })),
                skipDuplicates: true,
              });
              resolve({ count: created.count });
            } catch (err) {
              reject(new Error(err));
            } finally {
              fs.unlinkSync(path);
            }
          })();
        })
        .on('error', (err) => reject(new Error(err.message)));
    });
  }
}
