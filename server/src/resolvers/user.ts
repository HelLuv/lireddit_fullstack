import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {MyContext} from "../types";
import {User} from "../entities/User";
import argon2 from "argon2";
import {UserForgotPasswordResponse, UsernamePasswordInput, UserResponse} from "./types/user";
import {validateRegister} from "../utils/validateRegister";
import {COOKIE_NAME, JWT_SECRET} from "../constants";
import {sign} from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import {sendEmail} from "../utils/sendEmail";
import schema from "../validations";
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
    @Arg('inputs') inputs: UsernamePasswordInput,
    @Ctx() {em, res}: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(inputs);
    if (errors) {
      return {errors}
    }

    const hashedPassword = await argon2.hash(inputs.password);
    const user = em.create(User, {
      username: inputs.username,
      email: inputs.email,
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

    const token = sign({sub: user.id}, "keep_it_secret");
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
    });
    res.setHeader("Authorization", `Bearer ${token}`);

    return {user};
  }

  @Mutation(() => UserResponse)
  async userLogin(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() {em, req, res}: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, usernameOrEmail.includes('@') ? {email: usernameOrEmail} : {username: usernameOrEmail});

    if (!user) {
      return {
        errors: [{
          field: 'usernameOrEmail',
          message: "username or email doesn't exist"
        }]
      }
    }

    const valid = await argon2.verify(user.password, password);
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
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
    });
    res.setHeader("Authorization", `Bearer ${token}`);

    req.session.userId = '' + user.id;

    return {user};
  }

  @Mutation(() => Boolean)
  userLogout(
    @Ctx()
      {
        res
      }
      :
      MyContext
  ) {
    res.clearCookie(COOKIE_NAME);
    return true;
  }

  @Mutation(() => UserForgotPasswordResponse)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() {em}: MyContext
  ): Promise<UserForgotPasswordResponse> {
    try {
      await schema.emailSchema.validate({email});
    } catch (error) {
      return {
        errors: [
          {
            field: error.path,
            message: error.errors[0],
          },
        ],
      };
    }
    const user = await em.findOne(User, {email: email});

    if (!user)
      return {
        res: true,
        msg: "If any account with that Email Exists, Reset password link has been sent on your given email.",
      };

    const tokenSetDate = new Date();
    const tokenExpiresTimeStamp = tokenSetDate.setDate(tokenSetDate.getDate() + 3);

    const tokenExpiresDate = new Date(tokenExpiresTimeStamp);
    const token = sign({sub: user.id, expires: tokenExpiresDate}, JWT_SECRET);
    await em.nativeUpdate(User, {email}, {forgotPassToken: token});
    const changePassHTML = `<a href="http://localhost:3000/change-password/${token}">Reset Password💫</a>`;
    await sendEmail(email, changePassHTML);

    return {
      res: true,
      msg: "If any account with that Email Exists, Reset password link has been sent on your given email.",
    };
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() {em}: MyContext
  ): Promise<UserResponse> {
    try {
      await schema.passwordSchema.validate({newPassword});
    } catch (error) {
      return {
        errors: [
          {
            field: error.path,
            message: error.errors[0],
          },
        ],
      };
    }

    const decoded: any = verifyJWT(token);
    const userIdNum = String(decoded?.sub);
    const tokenExpired = new Date(decoded?.expires);
    const today = new Date();
    if (today > tokenExpired) {
      return {
        errors: [
          {
            field: "token",
            message: "Token Expired",
          },
        ],
      };
    }
    const user = await em.findOne(User, {id: userIdNum});
    if (user?.forgotPassToken !== token) {
      return {
        errors: [
          {
            field: "token",
            message: "Token Expired",
          },
        ],
      };
    }
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User No longer exists",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(newPassword);
    const UpdatedForgotPassToken = "Your token is now Expired";
    await em.nativeUpdate(User,
      {id: userIdNum},
      {password: hashedPassword, forgotPassToken: UpdatedForgotPassToken}
    );
    return {
      user,
    };
  }
}


