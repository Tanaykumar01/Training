import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors(
    {
        credentials: true,
    }
));
app.use(bodyParser.json());

// import routes
import userRoutes from './routes/user.routes.js';

// use routes
app.use('/api/user', userRoutes);


export { app };