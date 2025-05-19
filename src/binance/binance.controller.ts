import { Controller, Post } from '@nestjs/common';
import { BinanceService } from './binance.service';


@Controller('binance')
export class BinanceController {
    constructor(private readonly binance_service: BinanceService) {}

    @Post('create-order')
    async createOrder() {
        return this.binance_service.createBinancePayOrder();
    }
}
