import {Connection, EntityManager, IDatabaseDriver} from "@mikro-orm/core";
import {Request, Response} from "express";
import session, {Session, SessionData} from "express-session";
import {Redis} from "ioredis";

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request & {
    session: Session & Partial<SessionData> & { userId: string };
  };
  res: Response;
  redis: Redis
}