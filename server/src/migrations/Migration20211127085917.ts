import { Migration } from '@mikro-orm/migrations';

export class Migration20211127085917 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "update_at" timestamptz(0) not null, "created_at" timestamptz(0) not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

}
