import express from 'express';
import routes from './routes'
import { globalErrorHandler } from './utils/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger'
const app = express();


app.use('api/',routes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(globalErrorHandler)

export default app;