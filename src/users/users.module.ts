import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module';
import { WalletsModule } from '../wallets/wallets.module';
import { DatabaseModule } from '../database/database.module';
import { UsersRepository } from './users.repository';

@Module({
    imports: [RolesModule, WalletsModule, DatabaseModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {}
