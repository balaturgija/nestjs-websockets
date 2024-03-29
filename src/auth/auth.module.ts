import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailExists } from './validators/user-email-exists.validator';
import { RolesModule } from '../roles/roles.module';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
    imports: [
        UsersModule,
        RolesModule,
        WalletsModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, EmailExists, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
