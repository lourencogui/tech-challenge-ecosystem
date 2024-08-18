import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    username: 'postgres',
    database: 'tech-challenge-ecosystem',
    host: 'db',
    port: 5432,

    migrations: ['infra/database/migrations/*.js'],
    seeds: [],
    seedTracking: false,
    factories: [],
};

export const dataSource = new DataSource(options);