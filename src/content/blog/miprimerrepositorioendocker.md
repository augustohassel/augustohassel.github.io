---
title: "Mi Primer Repositorio en Docker"
author: "Augusto Hassel"
date: 2020-04-14T23:45:14-03:00
featured: true
image: "/img/blog/MiPrimerRepositorioEnDocker/docker_pull_home.png"
description: "Cómo usar Docker-Compose y crear nuestra primer imagen en Docker Hub"
tags: ["API", "PlumbeR", "Docker", "Docker-Compose", "Docker-Hub", "Ubuntu", "Linux"]
category: "Archivo / R"
---

> **TL;DR**: La imagen que he creado pueden encontrarla aquí: [augustohassel/r_ubuntu en Docker Hub](https://hub.docker.com/r/augustohassel/r_ubuntu)

Este posteo no lo tenía planificado y surge de querer bajar a *papel* varias lecciones aprendidas luego de **no poder** resolver un problema y tener que realizar un *workaround* en torno al mismo.

<p align="center" class="my-6">
  <img src="/img/blog/MiPrimerRepositorioEnDocker/docker_pull_0.png" alt="Docker Hub" class="rounded-xl shadow-md max-w-full sm:max-w-lg h-auto" />
</p>

### El desafío

El objetivo que tenía por delante era desarrollar una API que generase un informe para ciertos clientes según ciertos parámetros. En sí, no era algo complicado, además ya hemos visto [cómo generar una API con **Plumber**](/blog/exponiendofuncionesderenlanube-parte_1/), y [armar informes con **RMarkdown** y encapsularlo todo con **Docker**](/blog/exponiendofuncionesderenlanube-parte_2/). 

El problema vino cuando necesité acceder a una base de datos de MSSQL (SQL Server) desde dentro del contenedor de Docker. Y ustedes dirán... **¿dónde está el problema?** No debería haber tenido ninguno, ya que tanto localmente como en producción puedo conectarme sin ningún inconveniente. Tampoco encontré la respuesta al por qué no pude, pero a fines prácticos, tampoco importa... 

Me di cuenta que la imagen que estaba utilizando de R estaba basada en Debian y, después de pasar varias horas investigando, viendo las versiones de los drivers, debuggeando, etc., no me quedó más remedio que suponer que si generaba mi propia imagen de R corriendo en Ubuntu, entonces quizás salvaría el problema y podría continuar mi trabajo... además, no les voy a mentir, **quería probar armar mi propia imagen**! Al final de cuentas uso Ubuntu en producción y replicar mi entorno era lo más razonable. No había motivo para sumar Debian al pool de entornos que tengo corriendo... Windows 10, Windows Server y Ubuntu son suficientes!

Probablemente en este punto estés pensando *"quizás con unas horas más de investigación lo hubieras resuelto..."*. No lo sé... pero **tenemos que considerar el costo de la obstinación y analizar el beneficio potencial para poder tomar esta decisión**. En mi situación, decidí avanzar con otra solución.

### 2 chats

Fueron dos charlas con compañeros de trabajo las que me impulsaron por este camino y las puedo resumir así:

- "¿Cómo lo estás corriendo?" - P.V.
- "El problema no es Docker" - [Nico Lino](https://twitter.com/NicolasLin0)

Muchas gracias a ambos por la guía que me brindaron! 👏

#### ¿Cómo lo estás corriendo?

Lo primero que me preguntaron era si estaba corriendo con **[Docker-Compose](https://docs.docker.com/compose/)** o con **[Kubernetes](https://cloud.google.com/kubernetes-engine?hl=es)**... "Ni una, ni otra"... (en realidad esta no fue mi respuesta, pero queda para el imaginario 😑) 

Frente a la situación de no lograr conectarme a la DB desde el proceso de R, supuse que tenía que habilitar algún puerto, modificar algo en el Dockerfile o en el comando "docker run"... como no sabía cómo empezar, frente a esta situación me dijeron *"por qué no usás docker-compose, te va a simplificar mucho la existencia"*. Tenía razón! 💡

> ¿Qué es **Docker Compose**? Es una herramienta que sirve para automatizar la implementación de los contenedores de Docker. La idea es poder organizar el inicio, cierre y distintas configuraciones directamente desde un único archivo YAML.

Para esto, primero vamos a tener que instalar **Docker Compose** en nuestra máquina siguiendo los pasos que se encuentran en [Docker Compose Install](https://docs.docker.com/compose/install/).

Posteriormente vamos a crear el archivo YAML. Aquí solamente voy a detenerme para mostrarles el archivo que generé para correr la API del posteo anterior (aprovecho para comentarles que actualicé el repositorio en GitHub para que tenga ya estos cambios, por si lo quieren probar):

```yaml
version: '3'

services:
  api:
    build: 
      context: . 
    command: Rscript main.R 
    ports:
      - "8000:8000" 
    container_name: api-demo
```

Hay muchas más opciones, y recomiendo que investiguen en la documentación oficial, pero básicamente aquí lo que estoy haciendo es decir **desde dónde tiene que construir el contenedor**, **el puerto que tiene que exponerse** y **los comandos que se tienen que correr** una vez que esté construido el contenedor. 

En este caso estoy levantando solo un contenedor, pero con el mismo archivo podría estar levantando una configuración bastante más compleja! (Vamos a valorar haber aprendido esto ahora, cuando más adelante logremos correr todo en Kubernetes!)

Atentos que he removido el último renglón que tenía en el archivo del Dockerfile, ya que es el mismo comando que aparece ahora en 'command' y he creado una copia llamada `DockerfileRun` con el mero propósito de que me siga funcionando el build en Google Cloud.

#### El problema no es Docker

Esto lo confirmamos en el momento en que logramos hacer un telnet / ping a la DB desde adentro del contenedor. De esta segunda charla, lo importante fueron **todos los comandos que tuve que repetir una y otra vez** para hacer funcionar y debuggear la aplicación. Aquí el resumen:

1. Para generar la imagen: `sudo docker-compose build`
2. Para crear el contenedor: `sudo docker-compose up -d --remove-orphans`. La *d* significa detached y sirve para que se levante el contenedor dejándonos libre la consola para seguir trabajando. El comando `--remove-orphans` sirve para eliminar cualquier servicio que haya quedado creado de alguna versión anterior.
3. Para ver los logs: `sudo docker-compose logs -f`
4. Para ingresar a un contenedor: `sudo docker exec -it NOMBRE /bin/bash`
5. Para dar de baja los servicios: `sudo docker-compose down`

### ¿Y el primer repositorio en Docker?

Después de ver varios ejemplos, logré recopilar la información necesaria para armar mi propia imagen con una base de Ubuntu y los drivers adecuados para conectarme a SQL Server. Si quieren ver cómo armé el Dockerfile, pueden verlo en [GitHub DockerfileRUbuntu](https://github.com/augustohassel/DockerfileRUbuntu/blob/master/Dockerfile).

El repositorio de Docker Hub lo vinculé con mi repositorio en GitHub, de esta manera cada vez que actualizo el primero se genera una nueva versión de la imagen en Docker Hub. 

Para probarlo solamente tienen que correr los siguientes comandos:

1. **Bajarse la imagen**: `sudo docker pull augustohassel/r_ubuntu`

<p align="center" class="my-6">
  <img src="/img/blog/MiPrimerRepositorioEnDocker/docker_pull_1.png" alt="Docker Pull" class="rounded-xl shadow-md max-w-full sm:max-w-lg h-auto" />
</p>

2. **Crear el contenedor**: `sudo docker run -it --rm augustohassel/r_ubuntu`

<p align="center" class="my-6">
  <img src="/img/blog/MiPrimerRepositorioEnDocker/docker_pull_2.png" alt="Docker Run" class="rounded-xl shadow-md max-w-full sm:max-w-lg h-auto" />
</p>

### Lo logramos!

Ahora tenemos nuestra propia imagen subida a Docker Hub para que otros en nuestro equipo la puedan usar! 🙌

> **PD**: les dejo el error que no logré resolver... 
> 
> `<Rcpp::exception: nanodbc/nanodbc.cpp:983: 00000: [Microsoft][ODBC Driver 17 for SQL Server]TCP Provider: Error code 0x2746 [Microsoft][ODBC Driver 17 for SQL Server]Client unable to establish connection [Microsoft][ODBC Driver 17 for SQL Server]Invalid connection string attribute >`
>
> Quizás alguien tenga la solución! 

<div class="mt-8 pt-6 border-t border-md-outline-variant/30 flex justify-start">
  <a href="https://www.buymeacoffee.com/augustohassel" target="_blank" rel="noopener noreferrer" class="inline-block transition-transform hover:scale-105">
    <img src="https://cdn.buymeacoffee.com/buttons/arial-blue.png" alt="Buy Me A Coffee" height="38" class="h-10 w-auto" />
  </a>
</div>

