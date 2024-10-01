{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
  ];

  env = {
    POSTGRESQL_CONN_STRING = "postgresql://user:mypassword@localhost:5432/dataconnect?sslmode=disable";
  };
  
  idx.extensions = [
    "mtxr.sqltools"
    "mtxr.sqltools-driver-pg"
    "GraphQL.vscode-graphql-syntax"
    "GoogleCloudTools.firebase-dataconnect-vscode"
  ];

  services.postgres = {
    extensions = ["pgvector"];
    enable = true;
  };
  
  idx = {
    workspace = {
      onCreate = {
        update-firebase = "npm install -D firebase-tools";
        postgres = ''
          psql --dbname=postgres -c "ALTER USER \"user\" PASSWORD 'mypassword';"
          psql --dbname=postgres -c "CREATE DATABASE dataconnect;"
          psql --dbname=dataconnect -c "CREATE EXTENSION vector;"
        '';
        npm-install = "cd app && npm i && npm i firebase@latest";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--prefix" "./app" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}