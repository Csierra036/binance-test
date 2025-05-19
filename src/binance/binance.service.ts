import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BinanceService {
  private apiKey: string;
  private apiSecret: string;
  private endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.checkEnvConfig('BINANCE_API_KEY');
    this.apiSecret = this.checkEnvConfig('BINANCE_API_SECRET');
    this.endpoint = 'https://bpay.binanceapi.com/binancepay/openapi/v3/order';
  }


  private checkEnvConfig(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`This variable is requeried: ${key}`);
    }
    return value;
  }


  private signPayload(payload: any, timestamp: any, nonce: string): string {
    const dataToSign = `${timestamp}\n${nonce}\n${payload}\n`;
    return crypto.createHmac("sha512", this.apiSecret).update(dataToSign).digest("hex").toUpperCase();
  }


  private generateMerchantTradeNo(): string {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
    return `${timestamp}${randomSuffix}`;
  }


  async createBinancePayOrder() {
    const timestamp = Date.now().toString(); 
    const nonce = uuidv4().replace(/-/g, ''); //ID not repeteable
    const merchantTradeNo = this.generateMerchantTradeNo();
    const payload = {
      env: {
        terminalType: "WEB",
      },
      merchantTradeNo: merchantTradeNo,
      orderAmount: 0.10,
      currency: "USDT",
      description: "very good Ice Cream",
      goodsDetails: [
        {
          goodsType: "01",
          goodsCategory: "D000",
          referenceGoodsId: "7876763A3B",
          goodsName: "Ice Cream",
          goodsDetail: "Greentea ice cream cone",
        },
      ],
    };

    const payloadStr = JSON.stringify(payload);
    const signature = this.signPayload(payloadStr, timestamp, nonce);

    try {
      const response = await axios.post(
        this.endpoint,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "BinancePay-Timestamp": timestamp.toString(),
            "BinancePay-Nonce": nonce,
            "BinancePay-Certificate-SN": this.apiKey,
            "BinancePay-Signature": signature,
          },
        }
      );

      const data = response.data;
      console.log("Response data:", data);
      console.log("Response status:", response.status);
      if (data.status === "SUCCESS") {
        return {
          statusCode: 201,
          message: "Order create successfully.",
          checkoutUrl: data.data.checkoutUrl,
          orderId: data.data.orderId,
          tradeNo: nonce
        };
      } else {
        return {
          statusCode: 400,
          message: "Error in create the order",
          error: data
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error in the request: ",
        error: error.response?.data || error.message
      };
    }
  }
}