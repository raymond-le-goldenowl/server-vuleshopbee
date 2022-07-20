# Server vuleshopbee

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
# install packages
$ npm install
```

## Connect database

- Use **Postgres** to create a database with name is **vuleshopbee**
- Set `synchronize = true` in ormconfig.ts at root folder and update username, password, port
- Insert values for `roles` table

  | Table `Roles` | text  | value |
  | ------------- | :---: | :---: |
  | row 1         | user  | user  |
  | row 2         | admin | admin |

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

<!-- 
table role: [
  row(1) [user, user],
  row(2) [admin, admin]
]
 -->