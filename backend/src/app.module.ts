import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssistantsModule } from './assistants/assistants.module';
import { BranchesModule } from './branches/branches.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AssistantsModule,
    BranchesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
