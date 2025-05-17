import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('CLIENTE')
  create(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.productsService.create(dto, req.user.sub);
  }

  @Get('branch/:id')
  @Roles('ADMIN', 'CLIENTE')
  findAll(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findAll(id);
  }

  @Patch(':id')
  @Roles('CLIENTE')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    return this.productsService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  @Roles('CLIENTE')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.productsService.remove(id, req.user.sub);
  }
}
