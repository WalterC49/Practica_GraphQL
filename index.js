import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";

import "./config/env.js";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js";
import User from "./models/user.js";
import { PORT } from "./config/env.js";
connectDB();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/",
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  "/",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;
      if (auth && auth.toLowerCase().startsWith("bearer ")) {
        const token = auth.substring(7); // split(" ")[1]
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(id).populate("friends");
        return { currentUser };
      }
    },
  })
);

httpServer.listen(PORT, () =>
  console.log(`Server is now running on http://localhost:${PORT}`)
);
