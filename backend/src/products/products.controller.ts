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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return cb(new Error('Solo archivos CSV permitidod'), false);
        }
        cb(null, true);
      },
    }),
  )
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('branchId') branchId: string,
    @Req() req: any,
  ) {
    return this.productsService.importFromCsv(
      file.path,
      branchId,
      req.user.sub,
    );
  }
}
