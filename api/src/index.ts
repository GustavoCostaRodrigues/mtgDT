import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import cors from 'cors';
import { authRouter } from './submodules/auth/auth.routes.js';
import { decksRouter } from './submodules/decks/decks.routes.js';
import { cardsRouter } from './submodules/cards/cards.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Habilita CORS para permitir que o Swagger e o frontend conversem com a API
app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da aplicação
app.use('/api/auth', authRouter);
app.use('/api/decks', decksRouter);
app.use('/api/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação Swagger em http://localhost:${PORT}/api/docs`);
});