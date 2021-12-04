import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {MyContext} from "../types";
import {User} from "../entities/User";
import argon2 from "argon2";
import {UsernamePasswordInput, UserResponse} from "./types/user";
import {validateRegister} from "../utils/validateRegister";

@Resolver()
export class UserResolver {

  @Query(() => User, {nullable: true})
  async me(@Ctx() {res, req, em}: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }

    return await em.findOne(User, {id: req.session.userId})
  }


  @Mutation(() => UserResponse)
  async userRegister(
    @Arg('input') input: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(input);
    if (errors) {
      return {errors}
    }

    const hashedPassword = await argon2.hash(input.password);
    const user = em.create(User, {
      username: input.username,
      password: hashedPassword
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "User already exist",
            },
          ],
        };
      }
    }


    req.session.userId = '' + user.id;

    return {user};
  }

  @Mutation(() => UserResponse)
  async userLogin(
    @Arg('input') input: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {username: input.username});
    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: "this username doesn't exist"
        }]
      }
    }

    const valid = await argon2.verify(user.password, input.password);
    if (!valid) {
      return {
        errors: [{
          field: 'password',
          message: "Invalid password"
        }]
      }
    }

    await em.persistAndFlush(user);

    req.session.userId = '' + user.id;

    return {user};
  }
}


