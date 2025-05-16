import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AssistantsModule } from './assistants/assistants.module';
import { BranchesModule } from './branches/branches.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AssistantsModule,
    BranchesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
