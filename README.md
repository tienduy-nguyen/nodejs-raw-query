# Back-end exercise

[![Unit tests](https://github.com/tienduy-nguyen/nodejs-raw-query/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/tienduy-nguyen/nodejs-raw-query/actions/workflows/unit-tests.yml)
[![Integration tests](https://github.com/tienduy-nguyen/nodejs-raw-query/actions/workflows/integration-tests.yml/badge.svg)](https://github.com/tienduy-nguyen/nodejs-raw-query/actions/workflows/integration-tests.yml)
[![E2e tests](https://github.com/tienduy-nguyen/nodejs-raw-query/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/tienduy-nguyen/nodejs-raw-query/actions/workflows/e2e-tests.yml)
[![Build](https://github.com/tienduy-nguyen/nodejs-raw-query/actions/workflows/build.yml/badge.svg)](https://github.com/tienduy-nguyen/nodejs-raw-query/actions/workflows/build.yml)

---

The goal of this exercise is to see if you're confortable with JavaScript and/or TypeScript and are used to writing functional, well **tested** and **documented** API endpoints.

We'll be working on a micro service, called `users-service`, which is responsible for all CRUD operations on the `Users` table in the `Exercise` database. We'll use sqlite in this exercise as it requires no setup.

The exercise is divided in steps. Each step will be reviewed independently using pull requests.

## Setup

1. Fork the repo
2. Clone the repo on your computer
3. Install the dependencies

## Description

<details>
<summary>Click here to expand</summary>


1. Create the Users table

```
Users
- userId PRIMARY KEY
- firstName
- lastName
- fullName
- email
- birthdate
- street
- city
- country
- zip
- status ENUM (ACTIVE/LOCKED/CLOSED)
- createdAt
- updatedAt
```

2. Write the CRUD endpoints
3. Add an authentication layer using JWT. We'll assume that an another service is responsible for generating valid JWTs.
4. Write a script to insert a bunch of test data
5. Add a second table named UserSettings following the following schema:

```
UserSettings
- userSettingId PRIMARY KEY
- userId FOREIGN KEY
- hasSubscribedToNewsletter
- defaultCurrency
```

6. Write the CRUD endpoints for this new table
7. Allow the user's GET endpoint to return the userSettings alongside the user object

### Requisites

- All endpoints must be tested
- All endpoints must be documented
- All endpoints should validate their inputs

### How to use sqlite3/sqlite

`sqlite3` is a wrapper around SQLite but doesn't provide a promise based API. Therefore, we use another wrapper which is `sqlite` which offers a Promise API around `sqlite3`.

- Run mutations

```
// INSERT, CREATE TABLE, UPDATE etc.
await db.run(sqlMutation)
```

- Run queries

```
// Get one item
await db.get(sqlQuery)
// Get several items
await db.all(sqlQuery)
```


</details>

## Features

- Auth with [jwt](https://github.com/auth0/node-jsonwebtoken) + [session](https://github.com/expressjs/session)
- Full testing features: Unit test, integration tests, end to end tests
- Only raw query & mutation with [sqlite3](https://github.com/mapbox/node-sqlite3)
- CI-CD with [Github actions](https://github.com/features/actions)
- Dependency injection with [tsyringe](https://github.com/microsoft/tsyringe)
- Clean architecture with Model-Service-Controller pattern