import { Injectable } from '@nestjs/common';
import { Wallet, WalletRestAPI } from '@binance/wallet';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto'


@Injectable()
export class BinanceService {
  private apiKey;
  private apiSecret;
  private endpoint;
  constructor(private readonly configService: ConfigService){
    this.apiKey = this.configService.get<string>('BINANCE_API_KEY');
    this.apiSecret = this.configService.get<string>('BINANCE_API_SECRET');
    this.endpoint = 'https://bpay.binanceapi.com/binancepay/openapi/v3/order';
  }
    
    
  async createOrder(orderPayload: any): Promise<any> {
    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    const payloadStr = JSON.stringify(orderPayload);

    const message = 'timestamp=1578963600000';
    
    const signature = crypto
      .createHmac('sha512', this.apiSecret)
      .update(message)
      .digest('hex');

    const headers = {
      'Content-Type': 'application/json',
      'BinancePay-Timestamp': timestamp,
      'BinancePay-Nonce': nonce,
      'BinancePay-Certificate-SN': this.apiKey,
      'BinancePay-Signature': signature,
    };

    try {
      const response = await axios.post(this.endpoint, orderPayload, { headers, maxBodyLength: Infinity });
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear la orden:', error.response?.data || error.message);
      throw error;
    }
  }
}
