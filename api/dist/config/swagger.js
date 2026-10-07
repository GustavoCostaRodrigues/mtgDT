// api/src/config/swagger.ts
export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Magic: The Gathering Deck Tracker API',
        version: '1.0.0',
        description: 'Documentação interativa dos endpoints da API MTG-DT',
    },
    servers: [
        {
            url: '/',
            description: 'Servidor Atual',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Insira o token JWT retornado no login/registro',
            },
        },
    },
    paths: {
        // =========================================================================
        // AUTH
        // =========================================================================
        '/api/auth/register': {
            post: {
                summary: 'Registra um novo usuário',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'email', 'password', 'confirmPassword'],
                                properties: {
                                    name: { type: 'string', example: 'Gustavo Costa' },
                                    email: { type: 'string', format: 'email', example: 'gustavo@exemplo.com' },
                                    password: { type: 'string', example: 'senha123' },
                                    confirmPassword: { type: 'string', example: 'senha123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Usuário cadastrado com sucesso' },
                    400: { description: 'Dados inválidos' },
                },
            },
        },
        '/api/auth/login': {
            post: {
                summary: 'Autentica o usuário e retorna o token JWT',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email', example: 'gustavo@exemplo.com' },
                                    password: { type: 'string', example: 'senha123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Login bem-sucedido' },
                    401: { description: 'Credenciais inválidas' },
                },
            },
        },
        '/api/auth/me': {
            get: {
                summary: 'Retorna dados do perfil autenticado e plano',
                tags: ['Auth'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Dados do perfil carregados' },
                    401: { description: 'Token inválido ou não fornecido' },
                },
            },
            patch: {
                summary: 'Atualiza nome, foto ou senha do usuário',
                tags: ['Auth'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Gustavo Costa' },
                                    avatarUrl: { type: 'string', example: 'https://exemplo.com/avatar.jpg' },
                                    password: { type: 'string', example: 'novaSenha123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Perfil atualizado com sucesso' },
                    400: { description: 'Dados inválidos' },
                    401: { description: 'Não autorizado' },
                },
            },
        },
        '/api/auth/me/avatar': {
            delete: {
                summary: 'Remove o avatar do usuário',
                tags: ['Auth'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Avatar removido' },
                    401: { description: 'Não autorizado' },
                },
            },
        },
        // =========================================================================
        // CARDS
        // =========================================================================
        '/api/cards': {
            post: {
                summary: 'Importa e salva uma carta do Scryfall no banco de dados',
                tags: ['Cards'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['scryfallId'],
                                properties: {
                                    scryfallId: {
                                        type: 'string',
                                        format: 'uuid',
                                        example: '0000579f-7b35-4ed3-b44c-db2a538066fe',
                                        description: 'UUID da carta obtido do Scryfall',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Carta importada e persistida com sucesso' },
                    400: { description: 'Payload inválido' },
                    404: { description: 'Carta não encontrada no Scryfall' },
                    500: { description: 'Erro interno ao salvar no banco' },
                },
            },
        },
        '/api/cards/search': {
            get: {
                summary: 'Busca cartas pelo nome no catálogo Scryfall',
                tags: ['Cards'],
                parameters: [
                    {
                        name: 'q',
                        in: 'query',
                        required: true,
                        schema: { type: 'string', example: 'Sol Ring' },
                        description: 'Nome ou termo de busca da carta (mínimo 2 caracteres)',
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer', default: 15 },
                        description: 'Limite de resultados (máximo 50)',
                    },
                ],
                responses: {
                    200: { description: 'Lista de cartas encontradas' },
                    400: { description: 'Parâmetro de busca inválido' },
                },
            },
        },
        '/api/cards/{id}': {
            get: {
                summary: 'Obtém detalhes de uma carta por ID do banco',
                tags: ['Cards'],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        description: 'ID numérico (bigint) da carta no cache',
                    },
                ],
                responses: {
                    200: { description: 'Detalhes da carta' },
                    400: { description: 'ID inválido' },
                    404: { description: 'Carta não encontrada' },
                },
            },
        },
        // =========================================================================
        // DECKS
        // =========================================================================
        '/api/decks': {
            get: {
                summary: 'Lista todos os decks do usuário autenticado',
                tags: ['Decks'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Lista de decks com contagem de cartas' },
                    401: { description: 'Não autorizado' },
                },
            },
            post: {
                summary: 'Cria um novo deck (valida limite de plano)',
                tags: ['Decks'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'format'],
                                properties: {
                                    name: { type: 'string', example: 'Meu Deck Commander' },
                                    format: {
                                        type: 'string',
                                        enum: ['standard', 'modern', 'commander', 'pauper', 'pioneer', 'legacy', 'vintage', 'casual'],
                                        example: 'commander',
                                    },
                                    description: { type: 'string', example: 'Deck focado em tokens' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Deck criado com sucesso' },
                    400: { description: 'Dados inválidos' },
                    401: { description: 'Não autorizado' },
                    403: { description: 'Limite de decks atingido para o plano' },
                },
            },
        },
        '/api/decks/{id}': {
            get: {
                summary: 'Obtém detalhes do deck com suas cartas agrupadas',
                tags: ['Decks'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'UUID do deck',
                    },
                ],
                responses: {
                    200: { description: 'Detalhes do deck com lista de cartas' },
                    401: { description: 'Não autorizado' },
                    404: { description: 'Deck não encontrado' },
                },
            },
            patch: {
                summary: 'Atualiza informações básicas do deck',
                tags: ['Decks'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'UUID do deck',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Novo Nome do Deck' },
                                    description: { type: 'string', example: 'Nova descrição' },
                                    format: { type: 'string', example: 'commander' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Deck atualizado com sucesso' },
                    400: { description: 'Dados inválidos' },
                    401: { description: 'Não autorizado' },
                    404: { description: 'Deck não encontrado' },
                },
            },
            delete: {
                summary: 'Exclui o deck e suas alocações',
                tags: ['Decks'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'UUID do deck',
                    },
                ],
                responses: {
                    200: { description: 'Deck excluído com sucesso' },
                    401: { description: 'Não autorizado' },
                    404: { description: 'Deck não encontrado' },
                },
            },
        },
        '/api/decks/{id}/cards': {
            post: {
                summary: 'Adiciona uma carta ao deck',
                tags: ['Decks - Cartas'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'UUID do deck',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['cardId', 'quantity', 'category'],
                                properties: {
                                    cardId: { type: 'string', description: 'ID da carta no catálogo' },
                                    quantity: { type: 'integer', minimum: 1, example: 1 },
                                    category: {
                                        type: 'string',
                                        enum: ['mainboard', 'sideboard', 'commander', 'companion'],
                                        example: 'mainboard',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Carta adicionada ao deck' },
                    400: { description: 'Dados inválidos' },
                    401: { description: 'Não autorizado' },
                },
            },
        },
        '/api/decks/{id}/cards/{cardId}': {
            patch: {
                summary: 'Atualiza quantidade ou categoria de uma carta no deck',
                tags: ['Decks - Cartas'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'UUID do deck',
                    },
                    {
                        name: 'cardId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID da carta',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    quantity: { type: 'integer', minimum: 1, example: 2 },
                                    category: {
                                        type: 'string',
                                        enum: ['mainboard', 'sideboard', 'commander', 'companion'],
                                        example: 'commander',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Carta do deck atualizada' },
                    400: { description: 'Dados inválidos' },
                    401: { description: 'Não autorizado' },
                },
            },
            delete: {
                summary: 'Remove uma carta do deck',
                tags: ['Decks - Cartas'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'UUID do deck',
                    },
                    {
                        name: 'cardId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID da carta',
                    },
                ],
                responses: {
                    200: { description: 'Carta removida do deck' },
                    401: { description: 'Não autorizado' },
                },
            },
        },
    },
};
