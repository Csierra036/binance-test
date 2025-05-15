import { Controller, Post } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { Get } from '@nestjs/common';
import { WalletRestAPI } from '@binance/wallet';

@Controller('binance')
export class BinanceController {
    constructor(private readonly binance_service: BinanceService) {}

    @Post()
    async createOrder(){
        const payload = {
            merchantTradeNo: `order-${Date.now()}`,
            orderAmount: 0.05,
            currency: 'USDT',
            goods: {
                goodsType: '01',
                goodsCategory: 'D000',
                referenceGoodsId: 'example-product',
                goodsName: 'Ejemplo',
                goodsDetail: 'Descripción del producto',
            },
        };
        return await this.binance_service.createOrder(payload);  
    }
}
