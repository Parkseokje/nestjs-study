# Nestjs study

I personally looked at the nestjs site for the study. All content belongs to nestjs.

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

## Controller

Receive specific request for the application

- Create a controller using CLI

  ```bash
  $ nest g controller cats
  ```

- Always belongs to a module.

  ```javascript
  @Module({ controllers: [CatsController] })
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

      ```javascript
      export class CreateCatDto {
        readonly name: string;
        readonly age: number;
        readonly breed: string;
      }

      @Post()
      create(@Body() createCatDto: CreateCatDto) {}
      ```

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

## Providers

Providers are plain JavaScript classes with an `@Injectable()` decorator.

- Service: Service is responsible for data storage and retrieval.
- Create a service using CLI

  ```bash
  $ npx nest g service cats
  ```

- (Decorator) @Injectable(): Attaches metadata, which tells Nest that this class is a Nest provider.

  ```javascript
  @Injectable()
  export class CatsService {}
  ```

- Injected through the class constructor.

  ```javascript
  export class CatsController {
    constructor(private readonly catsService: CatsService) {
      // Both declare and initialize the catsService member immediately in the same location.
      // Returning the existing instance if it has already been requested elsewhere
    }
  }
  ```

  - Dependency injection:

    - DI is Inversion of control(IoC) technique wherein you delegate instantiation of dependencies to the IoC container(NestJS runtime system)
    - `@Injectable()` decorator declares the class as a class that can be managed by the Nest IoC container.
    - [Angular documentation](https://angular.io/guide/dependency-injection)
    - [Custom providers](https://docs.nestjs.com/fundamentals/custom-providers)

  - Scopes: [Read more](https://docs.nestjs.com/fundamentals/injection-scopes)

- (Decorator) @Optional: If you have dependencied which do not necessarily have to be resolve, Optional provider can be used

  ```javascript
  export class HttpService<T> {
    constructor(
      @Optional() @Inject('HTTP_OPTIONS') private readonly httpClient: T) {}
    )
  }
  ```

- Property-based injection

  If top-level class depends on either one or multiple providers, instead of passing them all the way up by calling `super()` in sub-classes
  from the contructor, you can use `@Inject()` decorator at the property level. But if your class doesn't extend another provider, you should
  always prefer using `contructor-based injection`.

  ```javascript
  @Injectable()
  export class HttpService<T> {
    @Inject('HTTP_OPTIONS')
    private readonly httpClient: T;
  }
  ```

- Provider registration

  ```javascript
  @Module({
    controllers: [CatsController],
    providers: [CatService]
  })
  ```

## Modules

A Class annotated with a `@Module` decorator.

- (Decorator) @Module: Provides metadata that Nest makes use of to organize the application structure. It takes a single object whose
  properties describe the module

  - providers
  - controllers
  - imports
  - exports

- Feature Module

  A feature module simply organizes code relevant for a specific feature, keeping code organized.

  ```javascript
  // cats/cats.module.ts
  @Module({
    controllers: [CatsController],
    providers: [CatsService],
  })
  export class CatsModule {}
  ```

- Shared modules

  Once created it can be reused by any module.
  In order to do that, we first need to export service.
  any module that imports CatsModule has access to CatsService
  and will share the **same instance** with all other modules that import it as well.

  ```javascript
  @Module({
    ...
    exports: [CatsService]
  })
  export class CatsModule {}
  ```

- Module re-exporting

  Modules can re-export modules that they import.

  ```javascript
  @Module({
    imports: [CommonModule],
    exports: [CommonModule]
  })
  export class CoreModule {}
  ```

- Dependency injection

  A module class can inject providers. (e.g., for configuation purposes)
  But modules classes themselves cannot be injected as providers due to circular dependency.

  ```javascript
  export class CatsModule {
    constructor(private readonly catsService: CatsService) {}
  }
  ```

- Global modules

  When you want to provide a set of providers which should be available everywhere(e.g., helpers, database connections etc.), make the module global with the `@Global` decorator.
  Global modules should be registered only once, generally by the root or core module.
  Making everything global is not a good design decition. `imports` is generally the preferred way.

  ```javascript
  @Global()
  @Module({
    ...
  })
  export class CatsModule {}
  ```

- Dynamic modules

  This feature enables you to easily create customizable modules that can register and configure providers dynamically.

  ```javascript
  @Module({
    providers: [Connection]
  })
  export class DatabaseModule {
    static forRoot(entties = [], options?): DynamicModule {
      const providers = createDatabaseProviders(options, entities);
      return {
        module: DatabaseModule,
        providers: providers,
        exports: providers
      }
    }
  }

  @Module({
    imports: [DatabaseModule.forRoot([User])]
  })
  export class AppModule {}
  ```

  - [Dynamic module deep dive](https://docs.nestjs.com/fundamentals/dynamic-modules)
  - [Working example](https://github.com/nestjs/nest/tree/master/sample/25-dynamic-modules)

- Create a module using CLI

  ```bash
  $ npx nest g module cats
  ```
