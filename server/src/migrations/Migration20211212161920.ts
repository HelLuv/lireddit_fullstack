import { Migration } from '@mikro-orm/migrations';

export class Migration20211212161920 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "email" text not null;');
    this.addSql('alter table "user" drop constraint if exists "user_id_check";');
    this.addSql('alter table "user" alter column "id" type varchar(255) using ("id"::varchar(255));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');

    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
