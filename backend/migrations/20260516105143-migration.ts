import { Migration } from '@mikro-orm/migrations';

export class Migration20260516105143 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table "applications" add "deleted_at" timestamptz null;`);

    this.addSql(`alter table "jobs" add "deleted_at" timestamptz null;`);

    this.addSql(`alter table "resumes" add "deleted_at" timestamptz null;`);

    this.addSql(`alter table "users" add "created_at" timestamptz not null, add "updated_at" timestamptz not null, add "deleted_at" timestamptz null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "applications" drop column "deleted_at";`);

    this.addSql(`alter table "jobs" drop column "deleted_at";`);

    this.addSql(`alter table "resumes" drop column "deleted_at";`);

    this.addSql(`alter table "users" drop column "created_at", drop column "updated_at", drop column "deleted_at";`);
  }

}
