import { Controller, Post } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { Get } from '@nestjs/common';
import { WalletRestAPI } from '@binance/wallet';

@Controller('binance')
export class BinanceController {
    constructor(private readonly binance_service: BinanceService) {}

    @Post('create-order')
    async createOrder(){
        const payload = {
            merchantTradeNo: 'order-001',
            orderAmount: 0.50,
            currency: 'USDT',
            goods: {
                goodsType: '01',
                goodsCategory: 'D000',
                referenceGoodsId: 'example-product',
                goodsName: 'Example',
                goodsDetail: 'Descripción del producto',
            },
        };
        return await this.binance_service.createOrder(payload);  
    }
}
