import 'reflect-metadata';
import { DataSource } from "typeorm"
import envConfig from "../envConfig";
import { User } from '../../modules/user';
import { Booking } from '../../modules/booking';
import { Event } from '../../modules/event';

export const myDataSource = new DataSource({
    type: "postgres",
    host: envConfig.database.host,
    port: envConfig.database.port,
    username: envConfig.database.username,
    password: envConfig.database.password,
    database: envConfig.database.dbName,
    entities: [User, Event, Booking],
    logging: true,
    migrations: ["src/migrations/*.ts"],
    synchronize: false,
})

