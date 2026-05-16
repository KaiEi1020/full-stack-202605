import { Migration } from '@mikro-orm/migrations';

export class Migration20260516102026 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "applications" ("id" uuid not null, "job_id" varchar(255) not null, "resume_id" varchar(255) not null, "status" text not null default 'PENDING', "screening_status" text not null default 'PENDING', "screening_stage" varchar(255) null, "screening_error_message" varchar(255) null, "screening_started_at" timestamptz null, "screening_finished_at" timestamptz null, "overall_score" int null, "skill_score" int null, "experience_score" int null, "education_score" int null, "ai_comment" varchar(255) null, "score_history_json" varchar(255) null, "event_history_json" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "applications" add constraint "applications_status_check" check ("status" in ('PENDING', 'PASSED', 'INTERVIEWING', 'HIRED', 'REJECTED'));`);
    this.addSql(`alter table "applications" add constraint "applications_screening_status_check" check ("screening_status" in ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED'));`);

    this.addSql(`create table "jobs" ("id" uuid not null, "title" varchar(255) not null, "description" varchar(255) not null, "required_skills_json" varchar(255) not null, "preferred_skills_json" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`create table "resumes" ("id" uuid not null, "name" varchar(255) null, "phone" varchar(255) null, "email" varchar(255) null, "city" varchar(255) null, "resume_summary" varchar(255) null, "highlighted_strengths" varchar(255) null, "highlighted_weaknesses" varchar(255) null, "original_name" varchar(255) null, "storage_path" varchar(255) null, "mime_type" varchar(255) null, "size_bytes" int null, "page_count" int null, "raw_text" varchar(255) null, "cleaned_text" varchar(255) null, "parse_status" text not null default 'PENDING', "parse_error_message" varchar(255) null, "parsed_at" timestamptz null, "basic_info_json" varchar(255) null, "education_json" varchar(255) null, "work_experience_json" varchar(255) null, "skills_json" varchar(255) null, "project_json" varchar(255) null, "raw_model_output" varchar(255) null, "corrected_json" varchar(255) null, "extracted_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`);
    this.addSql(`alter table "resumes" add constraint "resumes_parse_status_check" check ("parse_status" in ('PENDING', 'SUCCEEDED', 'FAILED'));`);

    this.addSql(`create table "users" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
    this.addSql(`alter table "users" add constraint "users_phone_unique" unique ("phone");`);
  }

}
