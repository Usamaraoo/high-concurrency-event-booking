import envConfig from './config/envConfig';
import app from './app';
import { myDataSource } from './config/db/db';
import { redisClient } from './config/redis';


export const initializeDataSource = async () => {
    try {
        await myDataSource.initialize()
        console.log("🔌 Database connected")
        await redisClient.connect();
        console.log('🔌 Redis connected');
        app.listen(envConfig.server.port, () => {
            console.log(`Port: ${envConfig.server.port}`);
            console.log(`Server: running on ${envConfig.server.base_url}:${envConfig.server.port} `)
            console.log(`health check /health`);
            console.log(`Api Documentation /api-docs`);
        });

    } catch (error) {
        console.error("Error during Data Source initialization", error)
    }
}


initializeDataSource()