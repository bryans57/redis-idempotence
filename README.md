# cm-idempotencia

Librería para implementar fácilmente el modelo de idempotencia en una api hecha en fastify.

## Instalación

```bash
yarn add cm-idempotencia
```

## Implementación

Importar el método **handler** de **cm-idempotencia** y definir los valores asi:

```typescript
import { handler } from 'cm-idempotencia';

const exampleRouteHandler = handler({
    serviceName: 'cm-service-example-name',
    keyId: ['key1', 'key2'], // Puedes colocar multiples  accesos del objeto y el los concatenara para realizar una llave unica -> Ejemplo: key1-key2
    isPubsub: false, // Solo cambia el mensaje de respuesta, por default va false
    expireTime: 60, // Tiempo de expiracion de la llave en segundos, por default va 21600 - Equivale a 6 hora
});
```

**Implementación de las dependencias de la librería**

Buscar la función en nuestro código donde se tenga implementado el servidor (Express, Fastify, etc). Y llamar la función `dependenciasIdempotencia()`, se puede llamar en cualquier parte de la ejecución del flujo de la aplicación, la idea principal es que se ejecute siempre que inicia nuestro servidor.

**Ejemplo Fastify**

```typescript
import { application } from './Application';
import { createDependencyContainer } from '@configuration';
import { dependenciasIdempotencia } from 'cm-idempotencia'; //Importar la funcion desde la libreria
import { ENV } from '@util';

const start = async () => {
    // Iniciar el servidor
    const port = ENV.PORT;
    try {
        const server = await application.listen(port, '0.0.0.0');
        createDependencyContainer();
        dependenciasIdempotencia(); //Llamar la funcion mencionada despues de iniciar el servidor
        console.log(`Application running on ${server}`);
    } catch (error) {
        console.error(error);
        await application.close();
    }
};
start();
```

#### Campos

-   `serviceName`: Nombre del servicio, esto sera usado como nombre de la colección dentro de la instancia de redis. Se puede pasar cualquier nombre pero se recomienda que sea el nombre del servicio para envitar conflictos en caso de que la instancia de redis sea compartida.
-   `keyId`: El nombre de la propiedad que contiene el identificador de la petición, el nombre que se le pase tiene que existir en el body de la petición. Siguiendo este ejemplo, en el body tiene que existir un campo `process_id` que contiene el un identificador único de la petición, de lo contrario habrá un error.
-   `isPubsub`: En caso que sea por un topic de PubSub.

Después cuando se defina la ruta se utiliza el **handler** de esta manera:

```ts
application.post(`/example-route`, exampleRouteHandler, exampleRoute);
```

#### NOTA:

Se debe tener una instancia de redis lista para que la libreria pueda funcionar. Definir como variables de entorno los siguientes valores: `REDIS_HOST` y `REDIS_PORT`

## REDIS_CONNECTION_LOCAL_ENV

Esta es una variable de entorno que debe ser definida, su valor es boleano y será `true` cuando el redis a utilizar este definido localmente, ósea dentro del mismo contenedor de docker de la aplicación (docker compose). A continuación un ejemplo:

_Archivo docker-compose.yml_

```yml
version: '3.7'
services:
    redis:
        image: redis:7.0.4
        restart: always
        command: redis-server --bind 0.0.0.0
```

En este caso el redis esta definido en el docker-compose, en el mismo archivo estará definido el contenedor de nuestra aplicación. REDIS_CONNECTION_LOCAL_ENV tendrá un valor de `true` y hará referencia al contenedor de redis llamado `redis` la conexión será automática.

Si el redis es externo y necesitamos el `REDIS_HOST` y `REDIS_PORT` entonces REDIS_CONNECTION_LOCAL_ENV tendrá un valor de `false`
