import { Migration } from '@mikro-orm/migrations';

export class Migration20211126175701 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "title" text not null, "created_at" timestamptz(0) not null, "update_at" timestamptz(0) not null);');
  }

}
