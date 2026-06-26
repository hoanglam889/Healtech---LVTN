import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoices } from '../entities/Invoices';
import { Appointments } from '../entities/Appointments';

import { VnpayModule } from 'nestjs-vnpay';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ignoreLogger, HashAlgorithm } from 'vnpay';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoices, Appointments]),
    VnpayModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        tmnCode: configService.get<string>('VNP_TMN_CODE') || 'VNPAY',
        secureSecret: configService.get<string>('VNP_HASH_SECRET') || 'VNPAYSECRET',
        vnpayHost: 'https://sandbox.vnpayment.vn',
        testMode: true,
        hashAlgorithm: HashAlgorithm.SHA512,
        enableLog: true,
        loggerFn: ignoreLogger,
      }),
    })
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
