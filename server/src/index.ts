import 'reflect-metadata';
import {MikroORM} from "@mikro-orm/core";
import express from "express";
import mikroConfig from './mikro-orm.config';
import {__prod__, APP_PORT, COOKIE_NAME} from "./constants";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {HelloResolver} from "./resolvers/hello";
import {PostResolver} from "./resolvers/post";
import {UserResolver} from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from 'connect-redis';
import {MyContext} from "./types";
import cors from "cors";


declare module 'express-session' {
  interface Session {
    userId: string;
  }
}

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  // await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();


  app.use(cors({
    credentials: true,
    origin: ["http://localhost:4000", "https://studio.apollographql.com"],
  }));
  app.set("trust proxy", 1);
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years for store cookie
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: true, // __prod__ // cookie only works in https,
        domain: "http://localhost:4000"
      },
      saveUninitialized: false,
      secret: 'invwoupqpuiwbvpzxcnk',
      resave: false
    })
  );


  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({req, res}): MyContext => ({em: orm.em, res, req, redis})
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({app, path: "/", cors: false})

  app.get('/', ((_, res) => {
    res.send('hello');
  }))

  app.listen(APP_PORT, () => {
    console.log(`server started at localhost:${APP_PORT} 💜`);
  })
};

main().catch((err) => console.error(err));
