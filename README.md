# user-web

### npm install

#### Run on local
    - copy file .env.exemple => .env
    - npm start

#### Run on server:
    Build environment:
    development: npm run build:dev
    staging: npm run build:stg
    production: npm run build:prod
##### npm run server

### Note
##### Set env for app
    - Set env key name with format: PREFIX_{KEY_NAME}. PREFIX default in app is "VITE"
    - Exemple: VITE_API_URL=http://localhost:3000/api
    - Using env in app with: 'import.meta.env.ENV_KEY_NAME'