import {
    Controller,
    Post,
    Body,
    Inject,
    HttpCode,
    Res,
    Param,
    Get,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { AuthUser } from '../../auth/decorators/auth-user.decorator';
import { Roles } from '../../auth/decorators/role.decorator';
import { Role } from '../../constants';
import { AuctionsService } from '../services/auctions.service';
import { CreateAuctionDto } from '../dto/create-auction.dto';
import { Response } from 'express';
import { RobotExistsPipe } from '../../robots/pipes/robot-exists.pipe';
import { AuctionExistsPipe } from '../pipes/auction-exist.pipe';
import { AuctionUsersServices } from '../services/auction-users.service';
import { RobotAuctionStatusPipe } from '../../robots/pipes/robot-auction.pipe';
import { Pagination } from '../../base/decorators/pagination.decorator';
import { AuctionAuthChallenge } from '../../auth/decorators/auction-auth-challenge.decorator';
import { AuctionAuthGuard } from '../../auth/guards/auction.auth.guard';

@Controller('auctions')
export class AuctionsController {
    constructor(
        private readonly auctionsService: AuctionsService,
        private readonly authService: AuthService,
        private readonly auctionUsersService: AuctionUsersServices,
        @Inject('SERIALIZER') private readonly serializer: any
    ) {}

    @Get()
    @HttpCode(200)
    @AuctionAuthChallenge()
    @Roles(Role.Engineer, Role.Collector)
    @Pagination()
    async get(
        @Query('page', ParseIntPipe) page = 1,
        @Query('size', ParseIntPipe) size = 10,
        @Query('direction') direction
    ) {
        const paginationItems = await this.auctionsService.paginate(
            page,
            size,
            direction
        );
        return this.serializer.serialize(
            'batteriesPagination',
            paginationItems
        );
    }

    @Post(':robotId')
    @HttpCode(201)
    @AuctionAuthChallenge()
    @Roles(Role.Engineer)
    async create(
        @Res() res: Response,
        @AuthUser() user,
        @Param(
            'robotId',
            RobotExistsPipe,
            RobotAuctionStatusPipe,
            AuctionExistsPipe
        )
        robotId: string,
        @Body() createAuctionDto: CreateAuctionDto
    ) {
        const auction = await this.auctionsService.create(
            robotId,
            createAuctionDto.startAmount
        );
        const token = await this.authService.createToken({
            user: user,
            auctionId: auction.id,
        });
        const auctionUser = await this.auctionUsersService.create(
            user.id,
            auction.id
        );
        res.header('auction-token', token);
        res.send(
            this.serializer.serialize('auctions', {
                id: auction.id,
            })
        );
    }

    @Post('/join/:id')
    @HttpCode(201)
    @UseGuards(AuctionAuthGuard)
    @AuctionAuthChallenge()
    @Roles(Role.Collector)
    async join(
        @Res() res: Response,
        @AuthUser() user,
        @Param('id', AuctionExistsPipe) id: string
    ) {
        const auction = await this.auctionsService.getById(id);
        const auctionToken = await this.authService.createToken({
            user: user,
            auctionId: auction.id,
        });
        await this.auctionUsersService.create(auctionToken, user.id, id);
        res.header('auction-token', auctionToken);
        res.send(
            this.serializer.serialize('auctions', {
                id: auction.id,
            })
        );
    }

// check case if user already join on auction, and after rejoin check wallet amount on token
// case if user are biding on multiple auctions
