import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import routes from './routes/index.js';
import db from './config/connection.js';
import resolvers from './schema/resolvers.js';
import typeDefs from './schema/typeDefs.js';
import { getDirname } from './services/dirname.js';
import type { Request } from 'express';

const app = express();
const PORT = process.env.PORT ?? 3001;

const __dirname = getDirname(import.meta.url);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

interface MyContext {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
  req: Request;
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = authenticateToken({ req });
        return { user, req };
      }
    }),
  );

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();