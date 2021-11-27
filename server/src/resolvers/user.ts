import {Arg, Ctx, Field, InputType, Mutation, Resolver} from "type-graphql";
import {MyContext} from "../types";
import {User} from "../entities/User";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('input') input: UsernamePasswordInput,
    @Ctx() {em}: MyContext
  ): Promise<User> {
    const hashedPassword = await argon2.hash(input.password);
    const user = em.create(User, {
      username: input.username,
      password: hashedPassword
    });
    await em.persistAndFlush(user);
    return user;
  }
}


