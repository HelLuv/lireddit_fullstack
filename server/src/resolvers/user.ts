import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {MyContext} from "../types";
import {User} from "../entities/User";
import argon2 from "argon2";
import {UsernamePasswordInput, UserResponse} from "./types/user";
import {validateRegister} from "../utils/validateRegister";
import {COOKIE_NAME} from "../constants";
import {sign} from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import verifyJWT from "../utils/verify_JWT_token";

@Resolver()
export class UserResolver {

  @Query(() => User, {nullable: true})
  async currentUser(@Ctx() {em, req}: MyContext): Promise<User | null> {
    let token = req?.headers?.cookie?.split("=")[1];

    let user = undefined;
    if (token) {
      const {sub}: any = jwt.verify(token, "keep_it_secret");
      user = await em.findOne(User, {id: sub});
    } else if (req?.headers?.authorization) {
      let token = req?.headers?.authorization;
      const {sub}: any = jwt.verify(token, "keep_it_secret");
      user = await em.findOne(User, {id: sub});
    } else {
      user = null
    }

    return user;
  }


  @Mutation(() => UserResponse)
  async userRegister(
    @Arg('input') input: UsernamePasswordInput,
    @Ctx() {em, req, res}: MyContext
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

    res.setHeader("Set-Cookie", `${COOKIE_NAME}=${user.id}`)
    req.session.userId = '' + user.id;

    return {user};
  }

  @Mutation(() => UserResponse)
  async userLogin(
    @Arg('input') input: UsernamePasswordInput,
    @Ctx() {em, req, res}: MyContext
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

    const token = sign({sub: user.id}, "keep_it_secret");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // and won't be usable outside of my domain
      maxAge: 1000 * 60 * 60 * 24, //10 years
    });
    res.setHeader("Authorization", `Bearer ${token}`);

    req.session.userId = '' + user.id;

    return {user};
  }
}


