# 🚀 Mis demos en el Twitch de Midudev 🤓

¡Hola developer! 👋🏻 En este repo encontrarás todas las demos que te mostré durante mi Twitch con Midudev. Prepárate para aprender sobre contenedores y Docker de forma práctica y divertida. 🐳✨


## 🗓️ Agenda

- [🤔 ¿Por qué me interesa aprender contenedores?](#-por-qué-me-interesa-aprender-contenedores)
- [🐳 ¿Qué es Docker?](#-qué-es-docker)
- [🔰 ¿Por dónde empiezo?](#-por-dónde-empiezo)
- [🛠️ Mi primer contenedor](#🛠️-mi-primer-contenedor)
- [🌐 Cómo accedo a él desde el exterior](#-cómo-accedo-a-él-desde-el-exterior)
- [📦 Cómo creo un contenedor de mi aplicación](#-cómo-creo-un-contenedor-de-mi-aplicación)
- [🗄️ Un contenedor de una base de datos](#-un-contenedor-de-una-base-de-datos)
- [💾 Y cómo guardo los datos](#-y-cómo-guardo-los-datos)
- [🔗 Cómo conecto varios contenedores](#-cómo-conecto-varios-contenedores)
- [🧩 Docker Compose](#-docker-compose)
- [✨ Otros usos](#-otros-usos)
    - [💻 Dev Containers](#dev-containers)
    - [🤖 IA > Docker Model Runner](#ia--docker-model-runner)
    - [🧠 MCP Servers](#mcp-servers)

---

### 🤔 ¿Por qué me interesa aprender contenedores?

¿Te suena el típico "en mi máquina funciona"? 😅 Los contenedores son la solución para asegurarte de que tu aplicación funcione igual en cualquier entorno: desarrollo, producción o testing. Incluyen todo lo necesario para ejecutarla (código, dependencias, librerías, etc.), evitando problemas de compatibilidad y haciendo tu vida como developer mucho más fácil. ¡No te lo pierdas! 🚀

---

### 🐳 ¿Qué es Docker?

Docker es tanto una empresa como un software. Cuando hablamos de Docker, nos referimos a una plataforma que facilita crear, desplegar y ejecutar aplicaciones en contenedores. Ganó popularidad porque simplificó muchísimo el trabajo con contenedores para los desarrolladores. ¡Un must en tu toolbox! 🧰

---

### 🔰 ¿Por dónde empiezo?

Lo más sencillo para empezar es instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/). Es una app gráfica para gestionar tus contenedores fácilmente. Una vez instalada, verás el icono de Docker 🐳 en tu barra de tareas y podrás crear, iniciar, detener y eliminar contenedores, además de ver logs y estadísticas.

Aunque la interfaz gráfica es útil, te recomiendo aprender la línea de comandos 💻, ya que es más potente y flexible. Docker Desktop incluye un terminal integrado listo para usar. ¡No hay excusas! 😉

---

### 🛠️ Mi primer contenedor

Con Docker Desktop instalado, ¡vamos a crear nuestro primer contenedor! Usaremos la imagen oficial de Nginx (un servidor web muy popular). Abre el terminal integrado y ejecuta:

```bash
docker run nginx
```

Esto descargará la imagen de Nginx (si no la tienes) y creará un contenedor. Verás los logs en el terminal indicando que Nginx está funcionando. Pero aún no podrás acceder desde el navegador... ¡Vamos a solucionarlo! 🌐

---

### 🌐 Cómo accedo a él desde el exterior

Para acceder a Nginx desde tu navegador, necesitas exponer el puerto del contenedor al de tu máquina. Usa la opción `-p`:

```bash
docker run -p 8080:80 nginx
```

Ahora sí, abre tu navegador en `http://localhost:8080` y verás Nginx funcionando. ¡Genial! 🎉

Y ahora, si quisieramos hacer lo mismo sin sacrificar tu terminal, puedes usar la opción `-d` para ejecutar el contenedor en segundo plano:

```bash
docker run -d -p 8080:80 nginx
```

---

### 📦 Cómo creo un contenedor de mi aplicación

En este repo tienes una app de ejemplo en el directorio `app` (una API REST con Node.js y Express). 

Antes de pensar en contenerizarla, asegúrate de que funciona correctamente en tu máquina. Puedes probarla ejecutando:

```bash
cd app
npm install
npm run dev
```

y una vez que esté corriendo, accede a `http://localhost:3000` para ver la API en acción. Y puedes usar la extensión REST Client y este archivo `client.http` para probar los endpoints.

Pero espera! Esta aplicación necesita de una base de datos para funcionar, por lo que podemos hacer uso de imágenes de Docker de terceros para poder tener una base de datos MongoDB corriendo en un contenedor.

### 🗄️ Un contenedor de una base de datos

Normalmente, tu app necesita una base de datos. Lo ideal es que esté en un contenedor separado. Por ejemplo, para MongoDB:

```bash
docker run --name mongo -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=heroes_user \
    -e MONGO_INITDB_ROOT_PASSWORD=heroes_password \
    -d mongo
```

Como puedes ver, a un contenedor se le pueden pasar variables de entorno para configurarlo. En este caso, estamos creando un usuario y contraseña para MongoDB.

Ahora ya tenenmos MongoDB corriendo en un contenedor. Puedes conectarte desde Visual Studio Code de forma sencilla usando la extensión "MongoDB for VS Code".

Nuestra app ya está configurada para poder buscar esta base de datos utilizando el archivo `.env` que contiene la URL de conexión a MongoDB:

```
MONGODB_URI=mongodb://heroes_user:heroes_password@localhost:27017
```

Perfecto! Ahora que hemos conseguido que nuestra app se conecte a la base de datos MongoDB, podemos hacer que nuestra app también corra en un contenedor.

### Cómo creo un contenedor de mi aplicación

Para contenerizar nuestra app, necesitamos crear un `Dockerfile` en el directorio `app`. [Como el que ya tenemos en este repo](app/Dockerfile). 

Este está compuesto de diferentes instrucciones que le indican a Docker cómo construir la imagen de nuestra app. Aquí tienes un resumen de las instrucciones más importantes:

- `FROM`: Define la imagen base (en este caso, Node.js).
- `WORKDIR`: Establece el directorio de trabajo dentro del contenedor.
- `COPY`: Copia archivos del host al contenedor.
- `RUN`: Ejecuta comandos dentro del contenedor (como instalar dependencias).
- `EXPOSE`: Expone un puerto del contenedor (en este caso, el 3000).
- `CMD`: Define el comando por defecto que se ejecutará al iniciar el contenedor (en este caso, iniciar la app con `npm run dev`).

y ejecuta:

```bash
docker build -t heroes-api .
```

Cuando este proceso se ejecuta podrás ver todo el proceso de construcción de la imagen. Si todo va bien, tendrás una imagen llamada `heroes-api` lista para usar. 🎉

Pero esto es solo el primer paso. Con ello conseguimos tener una imagen que podremos usar tantas veces como contenedores queramos de nuestra app.

Para ejecutar un contenedor a partir de esta imagen, usamos el comando `docker run`:

```bash
docker run -p 3000:3000 heroes-api
```

Sin embargo, este contenedor no sabe dónde está la base de datos MongoDB. Necesitamos conectarlo a ella.

### 🔗 Cómo conecto varios contenedores

Así que ahora podría volver a intentar ejecutar el contenedor de mi app pero esta vez conectando a la base de datos MongoDB:

```bash
docker run -p 3000:3000 --link mongo:mongo -e MONGODB_URI=mongodb://heroes_user:heroes_password@mongo:27017 heroes-api
```

De esta forma tan sencilla, mi app ya puede conectarse a MongoDB. ¡Y listo! Ahora tienes tu app y base de datos corriendo en contenedores. 🎉

---

### 💾 Y cómo guardo los datos

Pero todavía no hemos terminado, porque si en algún momento mi contenedor de MongoDB se elimina, perderé todos los datos. 😱 

Por defecto, los datos de MongoDB se guardan en un volumen temporal (si borras el contenedor, se pierden). Así que vamos a configurar este un poquito mejor. Vamos a pararlo y eliminarlo:

```bash
docker stop mongo
docker rm mongo
```


Para persistir los datos, usa un volumen:

```bash
docker run --name mongo -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=heroes_user \
    -e MONGO_INITDB_ROOT_PASSWORD=heroes_password \
    -v mongo-data:/data/db \
    -d mongo
```

Así los datos se guardan en el volumen `mongo-data` y no se pierden. ¡Tus datos a salvo! 🛡️

Para probarlo, volvamos a crear un contenedor de nuestra app:

```bash
docker run -p 3000:3000 --link mongo:mongo -e MONGODB_URI=mongodb://heroes_user:heroes_password@mongo:27017 heroes-api
```

Añadamos algunos héroes a la base de datos y luego eliminemos el contenedor de MongoDB:

```bash
docker stop mongo
docker rm mongo
```

Ahora volvamos a crear el contenedor de MongoDB con el volumen:

```bash
docker run --name mongo -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=heroes_user \
    -e MONGO_INITDB_ROOT_PASSWORD=heroes_password \
    -v mongo-data:/data/db \
    -d mongo
```

Y si ahora volvemos a ejecutar nuestra app:

```bash
docker run -p 3000:3000 --link mongo:mongo -e MONGODB_URI=mongodb://heroes_user:heroes_password@mongo:27017 heroes-api
``` 

¡Verás que los héroes siguen ahí! 🎉

---

### 🧩 Docker Compose

Hasta ahora hemos creado contenedores de forma individual, lo cual es genial para aprender pero puede volverse un poquito tedioso 😅. Sobre todo cuando tienes varios contenedores. Es por ello que te interesa también aprender a utilizar Docker Compose. Una herramienta que hace ya bastante tiempo forma parte de Docker que nos permite levantar entornos completos con un único comando, y que además te permite comprender mejor la relación entre los contenedores y la configuración que se necesita.

Docker Compose te permite definir y ejecutar aplicaciones multi-contenedor con un solo archivo `compose.yml`. [Aquí tienes un ejemplo en este repo](compose.yml). Es ideal para proyectos con varios servicios. 🧩

Para usarlo, asegúrate de tener Docker Compose instalado (viene con Docker Desktop). Luego, en el directorio raíz del repo, ejecuta:

```bash
docker compose up
```

Pero eso no es todo, imaginate que además quieres seguir modificando tu app mientras Docker Compose hace su trabajo y que el contenedor se actualice automáticamente. Para ello, puedes usar la opción `--watch`:

```bash
docker compose up --watch
```

---

### ✨ Otros usos

Los contenedores no solo sirven para desplegar apps. Mira estos ejemplos:

#### 💻 Dev Containers

Crea entornos de desarrollo reproducibles usando contenedores. Así todo tu equipo trabaja igual, sin "en mi máquina funciona". Puedes usarlos con VS Code o GitHub Codespaces. [Más info aquí](https://code.visualstudio.com/docs/devcontainers/containers).

#### 🤖 IA > Docker Model Runner

Ejecuta modelos de IA en contenedores, aislando recursos y facilitando la portabilidad:

```bash
docker model run --model <model-name> --input <input-data>
```

Ideal para modelos que requieren mucha memoria o recursos. 🧠

#### 🧠 MCP Servers

Los MCP (Model Context Protocol) Servers también pueden ejecutarse en contenedores. Docker Desktop incluye el `MCP Toolkit` para gestionarlos fácilmente. [Más info en la documentación oficial](https://docs.docker.com/desktop/mcp-toolkit/).

---

### 🏁 Conclusión

Docker es una herramienta poderosa para crear, desplegar y ejecutar aplicaciones en contenedores. En este repo tienes ejemplos para apps, bases de datos y otros servicios. Si quieres aprender más sobre Docker y tecnologías DevOps como Kubernetes o Terraform, te recomiendo el [Bootcamp de DevOps de Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio). ¡Nos vemos en el siguiente stream! 🚀💛
