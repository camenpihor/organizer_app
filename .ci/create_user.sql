CREATE ROLE :db_user LOGIN PASSWORD :'db_password';
ALTER USER :db_user CREATEDB;
