import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'vuleshopbee',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  // logging: true,
};

export default config;
