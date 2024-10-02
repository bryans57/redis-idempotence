# redis-idempotence

Library to easily implement the idempotence model in an api made in fastify.

## Installation

```bash
yarn add redis-idempotence
```

## Implementation (handler)

Import the **handler** method from **redis-idempotence** and define the values like this:

```typescript
import { handler } from 'redis-idempotence';

const exampleRouteHandler = handler({
    serviceName: 'cm-service-example-name',
    keyId: ['key1', 'key2'],
    expireTime? : 60,
});
```

### Explain fields

|     Field     | Description                                                                                                                                                                                                                                                                                                               |
|:-------------:|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `serviceName` | Name of the service, used as the name of the collection within the Redis instance. It is recommended to use the service name to avoid conflicts if the Redis instance is shared.                                                                                                                                          |
|    `keyId`    | The name of the property that contains the request identifier. This property must exist in the request body (*The key identifier can be create for many properties*). For example, the body should include a field `key1` and `key2` that holds the identifier like `${serviceName}_${keyId}` where `keyId` = `key1-key2` |
| `expireTime`  | Expiration time of the key in seconds, by default it is 21600 - Equivalent to 6 hours.                                                                                                                                                                                                                                    |

### Implementation of the route

Finally, we implement the route in the following way:

```typescript
application.post(`/example-route`, exampleRouteHandler, exampleRoute);
```

If you use schemas or any other additional configuration, you can implement it in the following way:

```typescript
application.post(
    `/example-route`,
    { schema: your - schema, ...exampleRouteHandler },
    exampleRoute,
);
```

### Note

You must have a redis instance ready for the library to work. Define the following values as environment variables:
`REDIS_HOST` and `REDIS_PORT`

## Implementation (Cacheable)

Sometimes we have a method than we want to cache the response because it is call many times in our project with the same
arguments, for this case we can use the `Cacheable` method
like a decorator.

```typescript
import { Cacheable } from 'redis-idempotence';

export class ExampleDAO {
    private db = // Your database - Remember it's a example

        // Remember it's only a example
    @Cacheable('exampleKey', { expireTime: 60, unless: (result) => result === null })

    async getExampleData(date: string): Promise<ExampleDTO> { // Read Warning
        const sqlQuery = `SELECT example_data FROM example_table WHERE date = $1`;

        const response = await this.db.oneOrNone<ExampleDTO>(sqlQuery, [
            date,
        ]);
        return response;
    }
}
```

### Explain fields

|    Field     | Description                                                                                                                                                                                                                                                                                                                                        |
|:------------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `keyPrefix`  | This is the key identifier that will be complement for a sha256, that it's the arguments you send in the method, if the hash is equal it will return the same data of last time                                                                                                                                                                    |
|  `options`   | This is the options for the cache, you can define the expiration time and a function to validate the response, if the function return true the response will be cached.                                                                                                                                                                            |
| `expireTime` | Expiration time of the key in seconds, by default it is 21600 - Equivalent to 6 hours.                                                                                                                                                                                                                                                             |
|   `unless`   | This is a function that will be executed with the response of the method, if the function return true the response will be cached. By default **unless** is: `(result: any) => boolean = () => false`, so they will to save all the information, that include null, if you want to save only valid data you can add the validation of the example. |

### Warning

You have to be careful with the arguments you send in the method, if you send a object and it have data that change many
like a date, the hash will be different and the cache will not work.

For example, a complete format of the date it like: `2022-01-01T01:02:03.000Z`, (_Date change every second_) if you send
a date with this format the cache will not work, you can send the date with the format `2022-01-01` and it will work.

## REDIS_CONNECTION_LOCAL_ENV

This is an environment variable that must be defined, its value is boolean and will be`true` when the redis to be used
is defined locally, that is, within the same docker container as the application(docker compose ). Here is an example:

_File docker - compose.yml_

```yml
version: '3.7'
services:
    redis:
        image: redis:7.0.4
        restart: always
        command: redis-server --bind 0.0.0.0
```

In this case the redis is defined in the docker-compose, in the same file the container of our application will be
defined. REDIS_CONNECTION_LOCAL_ENV will have a value of `true` and will refer to the redis container called `redis` the
connection will be automatic.

If the redis is defined in another container, the value of REDIS_CONNECTION_LOCAL_ENV will be `false` and the
`REDIS_HOST` and `REDIS_PORT` environment variables must be defined.

## License

MIT - You can see the license [here](LICENSE)
