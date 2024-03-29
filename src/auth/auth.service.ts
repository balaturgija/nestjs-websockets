import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcryptjs';
import { CreatedUserModel } from './models/create-user.model';

@Injectable()
export class AuthService {
    /**
     *
     */
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async create(
        username: string,
        email: string,
        password: string,
        role: string
    ) {
        const result = await this.usersService.create(
            username,
            email,
            password,
            role
        );

        return new CreatedUserModel(result.username, result.email);
    }

    async findUserByEmail(email: string) {
        return await this.usersService.findUserByEmail(email);
    }

    async createToken(tokenOptions: any): Promise<string> {
        return await this.jwtService.signAsync(tokenOptions);
    }

    async validatePassword(
        inputPassword: string,
        usersPasword: string
    ): Promise<boolean> {
        return await bcrypt.compare(inputPassword, usersPasword);
    }
}
