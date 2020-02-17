## Scaffold

```bash
$ npm i -g @nest/cli
$ nest new --directory .
```

## Installation

```bash
$ npm install
```

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

## Create a controller using CLI

```bash
$ nest g controller cats
```

## Terms

1. Controller : Receive specific request for the application

    - Always belongs to a module.
      ```javascript
      @Module({ controllers: [CatsController ]})
      export class AppModule {}
      ```
   - (Decorator) @Controller: associate class with required metadata and enable Nest to create a routing map.
   - (Decorator) @Get(Post,Put,Delete etc.): Http request method decorator tells Nest to create a handler for a specific endpoint for HTTP requests.
   - (Decorator) @Req/@Res: Decorator to use native response handling method.
      (Lose compatibility with Nest feature, such as interceptors and the `@HttpCode()` decorator.)
   - (Decorator) @HttpCode: Decorator to change default status code (Get is 200, Post is 201 by default)
   - (Decorator) @Param: Define routes with parameters.
   - (Decorator) @Query: Define routes with query parameters.
   - (Decorator) @Body: Define client params passed to routes.
   - (Decorator) @Redirect: Redirect a response to a specific URL.

     - By returning an object from route handler will override any arguments passed to @Redirect decorator.
       ```json
       {
         "url": string,
         "statusCode": number
       }
       ```

   - Async supported (Observable also possible)

     ```javascript
       @Get()
       async findAll(): Promise<any[]> {
         return new Promise((resolve) => {
           setTimeout(resolve, 2000);
         }).then(function () {
           return ['cat1', 'cat2'];
         })
     ```

   - Request payloads

     - Determine the DTO(Data Transfer Object. is an object how the data will be sent over network.)
     - DTO can be written via Typescript interfaces, or by simple classes(Recommended).

   - Handlig Errors

     - (Decorator) HttpException
     - (Decorator) HttpStatus
     - example

       ```javascript
       @Get
       async findAll() {
         throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
       }
       ```

   - Exception filters

     - Using when you want to delegate full control over error handling
     - (Decorator) @Catch(HttpException): Telling Nest that this filter looking for exceptions of type `HttpException`.
     - (Decorator) @Catch(): In order to catch every exception leave the parameter list empty e.g., `@Catch()`
     - Binding filters

       ```javascript
       @Post
       @UseFilters(HttpExceptionFilter) // Filters by classes reduces memory usage instead of instances when possible.
       getError() { throw new ForbiddenException() } // HttpExceptionFilter에서 처리한다.
       ```

     - Different scope: It can be scoped at different levels: method/controlller/global

       - Controller scoped filter
         ```javascript
         @UseFilters(new HttpExceptionFilter())
         export class CatsController {}
         ```
       - Global scoped filter
         ```javascript
         async function bootstrap() {
           ...
           app.useGlobalFilters(new HttpExceptionFilter());
         }
         ```

     - [More details ](https://docs.nestjs.com/exception-filters)

2. Providers : Receive specific request for the application     
