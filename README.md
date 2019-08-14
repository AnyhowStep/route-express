# `route-express`

A thin wrapper around [`express`](https://github.com/expressjs/express) that
uses [`route-declaration`](https://github.com/anyhowstep/route-declaration) and [`type-mapping`](https://github.com/anyhowstep/type-mapping) to implement compile-time, and run-time type-safe API endpoints.

Maps/validates incoming request param, query, body, header data during compile-time and run-time.

Maps/validates outgoing response data during compile-time and run-time.

Provides compile-time type-safe `res.locals` manipulation.

-----

### Goals

+ Compile-time type safety

  Using `route-declaration`, you may implement routes and have
  TypeScript check it during compile-time and give helpful error messages.

(TODO: More goals)

-----

### Installation

```
npm install --save route-express
```

Additionally, you may want,

```
npm install --save route-declaration type-mapping
```

-----

### Basic Usage

See [this](test/run-time/input/example/declaration+client+my-express/todo-list.ts) for a basic
server+client implementation using `type-mapping`, `route-declaration`, `route-client` and `route-express`.

See [this](test/run-time/input/example/express+axios/todo-list.ts) for the same basic
server+client implementation using `type-mapping`, `axios` and `express`.

```ts
import * as routeExpress from "route-express";
import * as http from "http";

//Backwards compatible with require("express")();
const app = routeExpress.app();
app.createRoute(/*a route-declaration route*/)
    .voidHandler((req, res, next) => {
        //Do some processing here,
        //the following are run through type-mapping before this handler is run,
        //They are compile-time and run-time type-safe
        req.params
        req.query
        req.body
        req.headers
        //The following is compile-time safe
        //but does not have run-time checks
        res.locals
        //res.json() is wrapped and the response
        //is run through type-mapping before
        //being sent to the client.
        //It is compile-time and run-time type-safe
        res.json({
            some : "data",
        });
        next();
    });

http.createServer(app).listen(9001, () => {
    console.log("Server started");
});
```

With `@types/express`, you cannot guarantee compile-time or run-time type-safety
for your handlers.

With `route-express`, you can.

-----

### Handlers

This package leaves most of `express`' features untouched.

You may still use `express`' `app.use()/router.use()` and pass in handlers
and it will behave as expected.

This package adds its own `route` implementation, and `handler` implementation
that uses `express` under the hood.

-----

### `express` Handlers

Express has two kinds of handlers (also called `middleware`),

+ Request Handler
+ Error Handler

A request handler is one of the following,
```ts
//You *MUST* have 0-3 arguments!
//Your `function.length` must be `0,1,2,3`
type ExpressRequestHandler = (
    | () => void
    | (req) => void
    | (req, res) => void
    | (req, res, next) => void
);
```

An error handler is the following,
```ts
//You *MUST* have 4 arguments!
//Your `function.length` must be `4`
type ExpressErrorHandler = (
    (err, req, res, next) => void
);
```

`express` requires `function.length` to be a specific value and checks it
during run-time to know what kind of handler you are trying to use.

This may have surprising effects if one of your handlers has an optional 4th or 5th argument.

This also means you cannot have an error handler with 0,1,2,3 arguments.

-----

When adding handlers to express, you may specify a `path` for the handler.
The handler is then applied to the path and sub-paths when a request comes in.

When a `path` is not specified, the default is `/` (root path).

-----

Handlers added using `.use()` are called `express` handlers.

-----

### `route-express` Handlers

While `express` supports 2 types of handlers, this package supports 8 types.
They are all converted to `express` handlers behind the scenes.

The following methods exist to add handlers to an `app`, `router` or `route`
created with `route-express`,

+ `.voidHandler(handler)`
+ `.errorVoidHandler(handler)`
+ `.valueHandler<NextLocalsT>(handler)`
+ `.errorValueHandler<NextLocalsT>(handler)`
+ `.asyncVoidHandler(handler)`
+ `.asyncErrorVoidHandler(handler)`
+ `.asyncValueHandler<NextLocalsT>(handler)`
+ `.asyncErrorValueHandler<NextLocalsT>(handler)`

One method exists for each handler type so we do not check `function.length` during run-time.

-----

Handlers added using `.xxxHandler()` are called `route-express` handlers.

-----

There are two kinds of `route-express` handlers.

+ pre-route validation handlers
+ post-route validation handlers

-----

A pre-route validation handler is added to the `app` or `router`.
They are called pre-route validation because they are invoked before
`req.params, req.query, req.body, req.headers` are validated by `type-mapping`.

These pre-route validation handlers are good for checking authentication headers,
wrapping `res.json`, logging, etc.

These handlers are applied to all routes added to the `app` or `router`.

-----

A post-route validation handler is added to a `route`.
They are invoked after `req.params, req.query, req.body, req.headers` are validated by `type-mapping`.

These handlers are specific to the `route` they are added to.

-----

### `express` Handlers vs `route-express` Handlers

`route-express` handlers are **NOT** meant to replace `express` handlers.

`express` handlers are run as long as the `path` of the handler matches the path of the request.
Even if the request will result in an automatic 404 (No handler calls `res.end()`), the handlers are run.

`route-express` handlers are only run when a route created with `.createRoute(routeDeclaration)`
matches the path of the request. If no such route exists, they are skipped.

Refer to the tests [here](test/run-time/input/app/handler) for handler execution order.

In general,

1. `express` handlers added before `route-express` sub-apps/routers are run
1. For each `route-express` sub-app/router, if a `.createRoute()` route matches the request path,
   1. Pre-route validation `route-express` handlers are run
   1. Validation on `req.params, req.query, req.body, req.headers` is run
   1. Post-route validation `route-express` handlers are run
1. `express` handlers added after `route-express` sub-apps/routers are run

-----

### Types of `route-express` Handlers

The 8 types of `route-express` handlers are detailed below.

-----

#### `RequestVoidHandler`

The `.voidHandler()` method adds a `RequestVoidHandler = (req, res, next) => void|undefined`.

Think of it as being the same as an `ExpressRequestHandler`,
without the run-time `function.length` check.

If you try to return anything other than `void|undefined`, the compiler will give you an error.
This is different from `express().use()` that lets you return a `Promise` or `boolean` by accident.
Normally, returning anything other than `void|undefined` is an unintentional bug.

The `next` parameter is the same as `express`' `next` parameter.

-----

#### `ErrorVoidHandler`

The `.errorVoidHandler()` method adds an `ErrorVoidHandler = (err, req, res, next) => void|undefined`.

Think of it as being the same as an `ExpressErrorHandler`,
without the run-time `function.length` check.

If you try to return anything other than `void|undefined`, the compiler will give you an error.
This is different from `express().use()` that lets you return a `Promise` or `boolean` by accident.
Normally, returning anything other than `void|undefined` is an unintentional bug.

The `next` parameter is the same as `express`' `next` parameter.

-----

#### `RequestValueHandler<>`

The `.valueHandler<NextLocalsT>()` method adds a `RequestValueHandler<NextLocalsT> = (req, res, next) => void|undefined`.

This is converted to an `ExpressRequestHandler` under the hood.

This lets you manipulate the `res.locals` object (meant to store variables local to the request)
in a compile-time type-safe way.

If you try to return anything other than `void|undefined`, the compiler will give you an error.
This is different from `express().use()` that lets you return a `Promise` or `boolean` by accident.
Normally, returning anything other than `void|undefined` is an unintentional bug.

The `next` parameter is **NOT** the same as `express`' `next` parameter.

The `next` parameter is an object with two methods,

+ `next.success(nextLocals : NextLocalsT)`

  Performs a deep merge on `res.locals` and `nextLocals`.
  Will not let you change values, only merge objects.

+ `next.failure(err : any)`

  The same as calling `next(err)` in `express`

-----

#### `ErrorValueHandler<>`

The `.errorValueHandler<NextLocalsT>()` method adds an `ErrorValueHandler<NextLocalsT> = (err, req, res, next) => void|undefined`.

This is converted to an `ExpressErrorHandler` under the hood.

This lets you manipulate the `res.locals` object (meant to store variables local to the request)
in a compile-time type-safe way.

If you try to return anything other than `void|undefined`, the compiler will give you an error.
This is different from `express().use()` that lets you return a `Promise` or `boolean` by accident.
Normally, returning anything other than `void|undefined` is an unintentional bug.

The `next` parameter is **NOT** the same as `express`' `next` parameter.

The `next` parameter is an object with two methods,

+ `next.success(nextLocals : NextLocalsT)`

  Performs a deep merge on `res.locals` and `nextLocals`.
  Will not let you change values, only merge objects.

+ `next.failure(err : any)`

  The same as calling `next(err)` in `express`

-----

#### `AsyncRequestVoidHandler`

The `.asyncVoidHandler()` method adds an `AsyncRequestVoidHandler = (req, res) => Promise<void|undefined>`.

This is converted to an `ExpressRequestHandler` under the hood.

If you try to return anything other than `Promise<void|undefined>`, the compiler will give you an error.

There is no `next` parameter.

If the `Promise` resolves, it calls `next()`.

If the `Promise` rejects, it calls `next(err)`.

-----

#### `AsyncErrorVoidHandler`

The `.asyncErrorVoidHandler()` method adds an `AsyncErrorVoidHandler = (err, req, res) => Promise<void|undefined>`.

This is converted to an `ExpressErrorHandler` under the hood.

If you try to return anything other than `Promise<void|undefined>`, the compiler will give you an error.

There is no `next` parameter.

If the `Promise` resolves, it calls `next()`.

If the `Promise` rejects, it calls `next(err)`.

-----

#### `AsyncRequestValueHandler<>`

The `.asyncValueHandler<NextLocalsT>()` method adds an `AsyncRequestValueHandler<NextLocalsT> = (req, res) => Promise<NextLocalsT>`.

This is converted to an `ExpressRequestHandler` under the hood.

This lets you manipulate the `res.locals` object (meant to store variables local to the request)
in a compile-time type-safe way.

There is no `next` parameter.

If the `Promise` resolves, it performs a deep merge on `res.locals` and the result.
This will not let you change values, only merge objects.

If the `Promise` rejects, it calls `next(err)`, internally.

-----

#### `AsyncErrorValueHandler<>`

The `.asyncErrorValueHandler<NextLocalsT>()` method adds an `AsyncErrorValueHandler<NextLocalsT> = (err, req, res) => Promise<NextLocalsT>`.

This is converted to an `ExpressErrorHandler` under the hood.

This lets you manipulate the `res.locals` object (meant to store variables local to the request)
in a compile-time type-safe way.

If you try to return anything other than `void|undefined`, the compiler will give you an error.
This is different from `express().use()` that lets you return a `Promise` or `boolean` by accident.
Normally, returning anything other than `void|undefined` is an unintentional bug.

There is no `next` parameter.

If the `Promise` resolves, it performs a deep merge on `res.locals` and the result.
This will not let you change values, only merge objects.

If the `Promise` rejects, it calls `next(err)`, internally.

-----

### App

With `express`, an app is created like so,
```ts
import * as express from "express";
const app = express();
```

With `route-express`, an app is created like so,
```ts
import * as routeExpress from "route-express";
const app = routeExpress.app();
```

-----

The `app` created with `route-express` may be used like a regular `app` from `express`.
However, the `route-express` app comes with additional methods not found on `express`.

+ `.voidHandler(handler)`
+ `.errorVoidHandler(handler)`
+ `.valueHandler<NextLocalsT>(handler)`
+ `.errorValueHandler<NextLocalsT>(handler)`
+ `.asyncVoidHandler(handler)`
+ `.asyncErrorVoidHandler(handler)`
+ `.asyncValueHandler<NextLocalsT>(handler)`
+ `.asyncErrorValueHandler<NextLocalsT>(handler)`
+ `.createSubApp(path? : string)`
+ `.createRouter(path? : string)`
+ `.createRoute(routeDeclaration)`

See the **`route-express` Handlers** section for more details about handlers.

The `.createSubApp(path? : string)` method creates a `route-express` app and adds it as a sub-app straight away.
It also applies its pre-route validation handlers to the sub-app.

The `.createRouter(path? : string)` method creates a `route-express` router and adds it to the app straight away.
It also applies its pre-route validation handlers to the router.

The `.createRoute(routeDeclaration)` method creates a `route-express` route on the app.
It applies its pre-route validation handlers to the router.
These handlers will only be run if the request path matches a created route.

-----

### Sub-App

With `express`, a sub-app is created like so,
```ts
import * as express from "express";
const app = express();
const subApp = express();
app.use("/some/path", subApp);
```

With `route-express`, a sub-app is created like so,
```ts
import * as routeExpress from "route-express";
const app = routeExpress.app();
const subApp1 = app.createSubApp("/some/path");

//Also supports `express` style
const subApp2 = routeExpress.app();
app.use("/some/path", subApp2);
```

`subApp1` in the `route-express` example is different from the `subApp` in the `express` example.
The `xxxHandler()` of `app` are applied to `subApp1`.

`subApp2` in the `route-express` example is exactly the same as the `subApp` in the `express` example.
The `xxxHandler()` of `app` are **not** applied to `subApp2`.

-----

### Router

With `express`, a router is created like so,
```ts
import * as express from "express";
const app = express();
const router = express.Router();
app.use("/some/path", router);
```

With `route-express`, a router is created like so,
```ts
import * as routeExpress from "route-express";
const app = routeExpress.app();
const router1 = app.createRouter("/some/path");

//Also supports `express` style
const router2 = routeExpress.router();
app.use("/some/path", router2);
```

`router1` in the `route-express` example is different from the `router` in the `express` example.
The `xxxHandler()` of `app` are applied to `router1`.

`router2` in the `route-express` example is exactly the same as the `router` in the `express` example.
The `xxxHandler()` of `app` are **not** applied to `router2`.

-----

The `router` created with `route-express` may be used like a regular `router` from `express`.
However, the `route-express` router comes with additional methods not found on `express`.

+ `.voidHandler(handler)`
+ `.errorVoidHandler(handler)`
+ `.valueHandler<NextLocalsT>(handler)`
+ `.errorValueHandler<NextLocalsT>(handler)`
+ `.asyncVoidHandler(handler)`
+ `.asyncErrorVoidHandler(handler)`
+ `.asyncValueHandler<NextLocalsT>(handler)`
+ `.asyncErrorValueHandler<NextLocalsT>(handler)`
+ `.createRoute(routeDeclaration)`

See the **`route-express` Handlers** section for more details about handlers.

The `.createRoute(routeDeclaration)` method creates a `route-express` route on the router.
It applies its pre-route validation handlers to the route.
These handlers will only be run if the request path matches a created route.

-----

### Route

An `express` route and `route-express` route are completely different concepts.

+ An `express` route may have handlers added to **many** methods via `.post(), .get(), .put(), .delete(), etc.`
+ A `route-express` route may have handlers added the **one** method specified by the `routeDeclaration`.

They are not compatible in any way (for now).

-----

The `route` created with `route-express` has the following methods,

+ `.voidHandler(handler)`
+ `.valueHandler<NextLocalsT>(handler)`
+ `.asyncVoidHandler(handler)`
+ `.asyncValueHandler<NextLocalsT>(handler)`

See the **`route-express` Handlers** section for more details about handlers.

At the moment, no post-route validation handler may be an error handler.

-----

### Contributing

(TODO)

-----

### Tests

```
npm run sanity-check
```

The above command rebuilds this package and runs the compile-time and run-time tests.

-----

# Cookbook

(TODO)