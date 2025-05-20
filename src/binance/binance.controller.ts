import { Controller, Post } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { CreateOrder } from './dto/create.order.dto';
import { Body } from '@nestjs/common';
@Controller('binance')
export class BinanceController {
    constructor(private readonly binance_service: BinanceService) {}

    @Post('create-order')
    async createOrder(@Body() CreateOrder: CreateOrder) {
        return this.binance_service.createBinancePayOrder(CreateOrder);
    }
}
