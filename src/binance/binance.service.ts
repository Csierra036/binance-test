import { Injectable } from '@nestjs/common';
import { Wallet, WalletRestAPI } from '@binance/wallet';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BinanceService {
    private client: Wallet

    //Constructor
    constructor(private readonly configService: ConfigService){
        const apiKey = this.configService.get<string>('BINANCE_API_KEY');
        const apiSecret = this.configService.get<string>('BINANCE_API_SECRET');

        if (!apiKey || !apiSecret) {
            throw new Error('Missing Binance API key or secret in configuration');
        }

        const configurationRestAPI = {
            apiKey,
            apiSecret,
        };

        this.client = new Wallet({ configurationRestAPI });
    }
    //functions

    GetAccountInfo(): Promise<WalletRestAPI.AccountInfoResponse> {
        return this.client.restAPI
          .accountInfo()
          .then((res) => res.data())
          .then((data: WalletRestAPI.AccountInfoResponse) => {
            return data;
          })
          .catch((err) => {
            console.error(err);
            throw new Error('Failed to fetch Binance account info');
          });
      }

    GetCheck(): Promise<WalletRestAPI.QueryUserWalletBalanceResponse> {
    return this.client.restAPI.queryUserWalletBalance()
        .then((res) => res.data())
        .then((data: WalletRestAPI.QueryUserWalletBalanceResponse) => {
        return data;
        })
        .catch((err) => {
        console.error(err);
        throw new Error('Failed to fetch Binance account info');
        });
    }
}
