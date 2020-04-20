CREATE TABLE "files" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" serial PRIMARY KEY,
  "recipe_id" integer,
  "file_id" integer NOT NULL
);

CREATE TABLE "chefs" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "file_id" integer,
  "created_at" timestamp NOT NULL
);

CREATE TABLE "recipes" (
  "id" serial PRIMARY KEY,
  "chef_id" integer NOT NULL,
  "title" text NOT NULL,
  "ingredients" text NOT NULL,
  "preparation" text NOT NULL,
  "information" text,
  "created_at" timestamp NOT NULL
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");
