import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BatteriesModule } from './batteries/batteries.module';
import { DatabaseModule } from './database/database.module';
import { RobotsModule } from './robots/robots.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { BidsModule } from './bids/bids.module';
import { AuctionsModule } from './auctions/auctions.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { RequestBodyValidatePipe } from './base/pipes/request-body-validation.pipe';
import { BaseModule } from './base/base.module';
import { BatteryPaginationModel } from './batteries/models/battery-pagination.model';
import { RobotPaginationModel } from './robots/models/robot-pagination.model';
import { AuctionPaginationModel } from './auctions/models/auction-pagination.model';
import { GlobalHttpExceptionsFilter } from './base/filters/GlobalHttpExceptions.filter';

@Module({
    imports: [
        // load and parse env file
        ConfigModule.forRoot({
            envFilePath: [`./env`],
            isGlobal: true,
            cache: true,
        }),
        BaseModule,
        AuthModule,
        DatabaseModule,
        BatteriesModule,
        RobotsModule,
        WalletsModule,
        RolesModule,
        UsersModule,
        AuthModule,
        BidsModule,
        AuctionsModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_PIPE,
            useClass: RequestBodyValidatePipe,
        },
        {
            provide: APP_FILTER,
            useClass: GlobalHttpExceptionsFilter,
        },
    ],
})
export class AppModule implements OnModuleInit {
    constructor(@Inject('SERIALIZER') private readonly serializer: any) {}
    onModuleInit(): any {
        this.serializer.register('users', {
            id: 'id',
            links: {
                self: function (data) {
                    return '/users/' + data.id;
                },
            },
        });
        this.serializer.register('batteries', { id: 'id' });
        this.serializer.register('robots', { id: 'id' });
        this.serializer.register('auctions', { id: 'id' });
        this.serializer.register('wallets', { id: 'id' });
        this.serializer.register('bids', { id: 'id' });
        this.serializer.register('batteriesPagination', {
            beforeSerialize: (data: BatteryPaginationModel) => {
                return {
                    page: parseInt(data.size + ''),
                    size: parseInt(data.page + ''),
                    total: data.total,
                    items: data.items,
                };
            },
            id: 'id',
            links: {
                self(data: BatteryPaginationModel) {
                    return `/batteries?page=${data.page}&size=${data.size}`;
                },
                next(data: BatteryPaginationModel) {
                    return `batteries?page=${data.page + 1}&size=${data.size}`;
                },
                previous(data: BatteryPaginationModel) {
                    return `batteries?page=${
                        data.page - 1 === 0 ? 1 : data.page - 1
                    }&size=${data.size}`;
                },
            },
        });
        this.serializer.register('robotsPagination', {
            beforeSerialize: (data: RobotPaginationModel) => {
                return {
                    page: parseInt(data.size + ''),
                    size: parseInt(data.page + ''),
                    total: data.total,
                    items: data.items,
                };
            },
            id: 'id',
            links: {
                self(data: RobotPaginationModel) {
                    return `/robots?page=${data.page}&size=${data.size}`;
                },
                next(data: RobotPaginationModel) {
                    return `robots?page=${data.page + 1}&size=${data.size}`;
                },
                previous(data: RobotPaginationModel) {
                    return `robots?page=${
                        data.page - 1 === 0 ? 1 : data.page - 1
                    }&size=${data.size}`;
                },
            },
        });
        this.serializer.register('auctionsPagination', {
            beforeSerialize: (data: AuctionPaginationModel) => {
                return {
                    page: parseInt(data.size + ''),
                    size: parseInt(data.page + ''),
                    total: data.total,
                    items: data.items,
                };
            },
            id: 'id',
            links: {
                self(data: AuctionPaginationModel) {
                    return `/auctions?page=${data.page}&size=${data.size}`;
                },
                next(data: AuctionPaginationModel) {
                    return `auctions?page=${data.page + 1}&size=${data.size}`;
                },
                previous(data: AuctionPaginationModel) {
                    return `auctions?page=${
                        data.page - 1 === 0 ? 1 : data.page - 1
                    }&size=${data.size}`;
                },
            },
        });
    }
}
