import { seedEvents } from "../../modules/event/event.service";
import { seedUser } from "../../modules/user/user.service"
import { redisClient } from "../redis";
import { myDataSource } from "./db";

export const seedDb = async () => {
    await myDataSource.initialize();
    console.log('🔌 Database connected');
    await redisClient.connect();
    console.log('🔌 Redis connected');
    console.log('🌱 Seeding database...');
    const userId = await seedUser()
    console.log('Seeded users')
    await seedEvents(userId!)
}


seedDb().catch(console.error).finally(() => process.exit());