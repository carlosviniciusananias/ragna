create extension if not exists vector;

create table if not exists documents (
  id serial primary key,
  content text,
  embedding vector(384),
  path text,
  chunk_index integer
);