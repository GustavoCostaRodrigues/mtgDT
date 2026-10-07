import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import cors from 'cors';
import { authRouter } from './submodules/auth/auth.routes.js';
import { decksRouter } from './submodules/decks/decks.routes.js';
import { cardsRouter } from './submodules/cards/cards.routes.js';
import { collectionRouter } from './submodules/collection/collection.routes.js'; // <-- 1. Importe aqui

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
app.use('/api/collection', collectionRouter); // <-- 2. Registre a rota aqui

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação Swagger em http://localhost:${PORT}/api/docs`);
});