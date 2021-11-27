import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";
import {MyContext} from "../types";
import {User} from "../entities/User";
import argon2 from "argon2";
import {UsernamePasswordInput, UserResponse} from "./types/user";
import {validateRegister} from "../utils/validateRegister";

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async userRegister(
    @Arg('input') input: UsernamePasswordInput,
    @Ctx() {em}: MyContext
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
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    return {user};
  }

  @Mutation(() => UserResponse)
  async userLogin(
    @Arg('input') input: UsernamePasswordInput,
    @Ctx() {em}: MyContext
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
          message: "incorrect password"
        }]
      }
    }
    return {user};
  }
}


