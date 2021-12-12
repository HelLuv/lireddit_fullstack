import {Field, InputType, ObjectType} from "type-graphql";
import {User} from "../../entities/User";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]

  @Field(() => User, {nullable: true})
  user?: User
}

@ObjectType()
export class UserForgotPasswordResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[];
  @Field(() => Boolean, {nullable: true})
  res?: boolean;
  @Field(() => String, {nullable: true})
  msg?: string;
}
