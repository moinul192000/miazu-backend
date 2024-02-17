# Project Name

## Description

This is a NestJS framework based project and uses TypeORM for database operations. The project is set up with Docker for easy development and deployment.
This project was developed as a part of Miazu's internal Operations and to manage stocks, orders and customer data easily. 


## Setup

1. Clone the repository.
2. Install dependencies using `yarn install` or `npm install`.
3. Copy `.env.example` to `.env` and update the environment variables as needed.
4. Run the database migrations using `npm run typeorm migration:run` or `yarn typeorm migration:run`.
5. Start the development server using `npm run start:dev` or `yarn start:dev`.

## Usage

After setting up the project, you can access the API endpoints as defined in the various modules in the `src/` directory. Use the Swagger UI for easy interaction with the API.

## License

This project is licensed under the terms of the MIT license. 

## Acknowledgements

This project wouldn't have been possible without the help of the following projects:

- [NestJS](https://github.com/nestjs/nest): A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [TypeORM](https://github.com/typeorm/typeorm): An ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript.
- [Docker](https://github.com/docker/docker-ce): Docker CE (Community Edition) is the strip down version of Docker EE (Enterprise Edition).
- [JWT](https://github.com/auth0/node-jsonwebtoken): JsonWebToken implementation for node.js.
- [Swagger](https://github.com/swagger-api/swagger-ui): Swagger UI is a collection of HTML, JavaScript, and CSS assets that dynamically generate beautiful documentation from a Swagger-compliant API.
- [awesome-nest-boilerplate](https://github.com/NarHakobyan/awesome-nest-boilerplate): Awesome NestJS Boilerplate 😍, Typescript 💪, Postgres 🎉, TypeORM 🥳

We are grateful for their work and contributions to the open-source community.
