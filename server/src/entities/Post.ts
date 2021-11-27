import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";


@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({type: 'text'})
  title!: string;

  @Field(() => String)
  @Property({type: 'date'})
  createdAt = new Date();

  @Field(() => String)
  @Property({type: 'date', onUpdate: () => new Date()})
  updateAt = new Date();

}