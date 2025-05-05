import { Controller } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { Get } from '@nestjs/common';
import { WalletRestAPI } from '@binance/wallet';

@Controller('binance')
export class BinanceController {
    constructor(private readonly binance_service: BinanceService) {}

    @Get('get-account-info')
    getAccountInfo(): Promise<WalletRestAPI.AccountInfoResponse> {
        return this.binance_service.GetAccountInfo();
    }
    
    @Get('check-wallet')
    getWallet(): Promise<WalletRestAPI.QueryUserWalletBalanceResponse >{
        return this.binance_service.GetCheck();
    }
}
