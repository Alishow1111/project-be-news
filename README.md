# Northcoders News API

Here is a link to the hosted API: https://nc-news-2.onrender.com

This is the a API for a real-world news service similar to that of Reddit. 
There is articles, comments on each articles, topics for each article as well as users who can insert their comments.
For exmaple https://nc-news-2.onrender.com/api/users will return all users stored.

## How to Clone 
In your terminal enter the command :
```
git clone https://github.com/Alishow1111/project-be-news.git 
```

## Install Dependancies
In your terminal enter the command: 
```
npm run install
```

## Setup .env files
Create three .env files (.env.test, .env.development).

In both files add PGDATABASE=, with the respective names of the databases found in setup.sql.

## Seed Database
Firstly, Setup up the Database:

```
npm run setup-dbs
```

Then seed databases:

```
npm run seed
npm run seed-prod
```

## Run Tests
In your terminal, enter the command:

```
npm run test
```

## Minimum versions for dependancies
<b>Node.js</b>: 20.8.1

<b>Postgres</b>: 14.9


