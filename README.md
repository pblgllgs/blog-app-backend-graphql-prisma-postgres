## Graphql backend blog-app

### apollo-server
### graphql
### jwt
### postgres
### prisma
### validator

installation:

```
npm install
```

Copy, rename the file _.env.example_ to _.env_ and complete the configuration:

```
DATABASE_URL=
JWT_SECRET=
```

Start the server:

```
npm start:dev
```	
endpoint:
```
http://localhost:4000/graphql
```
Documentation for the graphql endpoint in the root folfer of the project:

```
blog-app-graphql-prisma-postgres.postman_collection.json
```
this file is importable in the postman app to test the graphql endpoint.

start prisma stidio

```
npm run prisma:studio
```