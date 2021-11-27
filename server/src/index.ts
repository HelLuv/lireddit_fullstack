import {MikroORM} from "@mikro-orm/core";
import express from "express";
import mikroConfig from './mikro-orm.config';
import {APP_PORT} from "./constants";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {HelloResolver} from "./resolvers/hello";
import {PostResolver} from "./resolvers/post";
import {UserResolver} from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({em: orm.em})
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({app})

  app.get('/', ((_, res) => {
    res.send('hello');
  }))
  app.listen(APP_PORT, () => {
    console.log(`server started at localhost:${APP_PORT}`);
  })
}
main().catch((err) => console.error(err));

console.log('sup guys');