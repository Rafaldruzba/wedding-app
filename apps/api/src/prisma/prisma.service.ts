import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// Używamy Twojej ścieżki, która działa
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // Tworzymy instancję klienta jako publiczną właściwość
  public readonly client: PrismaClient;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: true }
          : { rejectUnauthorized: false },
    });

    const adapter = new PrismaPg(pool);

    // Inicjalizujemy klienta z adapterem (tak jak w Twoim działającym kodzie)
    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    // Łączymy się przy starcie modułu
    await this.client.$connect();
  }

  async onModuleDestroy() {
    // Sprzątamy połączenie przy wyłączaniu apki
    await this.client.$disconnect();
  }
}
