---
title: "Serverless Shiny en Google Cloud"
author: "Augusto Hassel"
date: 2020-06-15T18:45:14-03:00
featured: true
image: "/img/blog/2020-06-13 ServerlessShinyenGoogleCloud/serverless-logo.png"
description: "Cómo lograr una aplicación Shiny en Kubernetes usando Google Cloud Run for Anthos"
tags: ["Google Cloud", "Cloud Run", "Cloud Run for Anthos", "Anthos", "Docker", "Docker-Hub", "Kubernetes", "Shiny"]
category: "Archivo / R"
---

> **TL;DR**: Es posible usar **Cloud Run** para deployar una aplicación en **Shiny**, aunque si necesitás websocket tendrás que dar una vuelta más y usar **Cloud Run for Anthos** para subir la aplicación a un cluster de **Kubernetes**. Esta es mi aplicación: [demo.hasselpunk.com/rRofex](https://demo.hasselpunk.com/rRofex) y aquí está el código en [GitHub](https://github.com/augustohassel/Demo-ShinyDockerRun).

La idea con la que arranqué a escribir este post fue ir mencionando las cosas que fui haciendo para lograr correr una aplicación de Shiny en Google Cloud usando Cloud Run en vez de levantar una máquina virtual que contenga al servidor.

Hasta el momento, me he encontrado trabajando con [Cloud Run](https://cloud.google.com/run) para subir APIs y, en conjunto con [Cloud Scheduler](https://cloud.google.com/scheduler) para automatizar operaciones, pero esta fue mi primera vez usándolo con [Shiny](https://shiny.rstudio.com/). 

### Alguna terminología

- **[Cloud Build](https://cloud.google.com/cloud-build)**: es un servicio que se usa para definir el flujo de trabajo a partir de eventos, por ejemplo: cuando se actualiza un repositorio en GitHub (una acción) se ejecuta la creación de una imagen (mediante un Dockerfile) que se deploya posteriormente en Cloud Run.
- **Cloud Run**: es una plataforma que te permite gestionar contenedores y abstraerte de la infraestructura donde están corriendo. 
- **Cloud Scheduler**: es un servicio de Google que te permite planificar tareas, como por ejemplo, ejecutar un proceso que esté corriendo en Cloud Run.
- **[Cloud Run for Anthos](https://cloud.google.com/anthos/run)**: es una plataforma que te permite integrar Cloud Run dentro de un entorno de Kubernetes.
- **[Kubernetes](https://cloud.google.com/kubernetes-engine)**: es una plataforma que permite orquestar múltiples contenedores entre clusters de máquinas virtuales.

### El camino

Antes de iniciar la travesía, me propuse el siguiente plan de acción:

1. Crear un nuevo repositorio en DockerHub que contenga una nueva imagen basada en [augustohassel/r_ubuntu](https://hub.docker.com/r/augustohassel/r_ubuntu) con Shiny incluido. Voy a mantener la decisión de no usar **rocker/shiny** por dos motivos: primero, está basada en Debian y en producción uso Ubuntu y segundo, me gusta aprender a hacerlo desde cero para entender qué estoy haciendo!
2. Armar un **Dockerfile** que exponga una aplicación de Shiny y que funcione localmente usando como base la imagen que creamos en el punto anterior.
3. Organizar un archivo de configuración (*cloudbuild.yaml*) que cree automáticamente el recurso en **Cloud Run**.
4. Listo! ... listo?

#### 1. El nuevo repositorio en DockerHub

Aprovechando esta situación armé un nuevo repo que contiene también el tidyverse. La decisión de cargarlo en esta etapa, si bien es discutible, la tomé porque normalmente en cualquier aplicación de Shiny que armo trabajo con el tidyverse y, si tuviese que instalarlo al momento de crear la imagen de la aplicación, tardaría una eternidad.

Ya he escrito anteriormente sobre el proceso que me llevó a [armar mi primer repositorio en DockerHub](/blog/miprimerrepositorioendocker/), así que están invitados a leerlo. 

Por lo pronto, la imagen la van a poder encontrar aquí: [r-shiny en Docker Hub](https://hub.docker.com/r/augustohassel/r-shiny).

#### 2. Dockerizando Shiny

La aplicación que voy a subir es la que armé para una presentación de la librería [rRofex](https://matbarofex.github.io/rRofex). 

No es el objetivo de este posteo explicar en qué consiste, pero si quieren replicarla localmente pueden hacerlo rápidamente con el siguiente Gist dentro de RStudio:

```r
shiny::runGist(gist = "https://gist.github.com/augustohassel/4eea614f80a8bbc548b2b4c3c5edd7c3")
```

El Dockerfile que permite correr localmente la aplicación lo van a encontrar en GitHub, junto con el resto de los archivos de este posteo: [GitHub Demo-ShinyDockerRun](https://github.com/augustohassel/Demo-ShinyDockerRun).

```dockerfile
FROM augustohassel/r-shiny

# Cargo librerias
RUN R --slave -e "install.packages('remotes')"
RUN R --slave -e "remotes::install_github('rstudio/httpuv')"

# Llevo la aplicacion
RUN mkdir -p /srv/shiny-server
RUN rm -rf /srv/shiny-server/*
COPY app /srv/shiny-server/app

# Modifico la configuracion
COPY shiny-server.conf /etc/shiny-server/shiny-server.conf

# Creo el ejecutable
COPY shiny-server.sh /usr/bin/shiny-server.sh
RUN chmod +x /usr/bin/shiny-server.sh

RUN sudo usermod -a -G staff shiny

RUN mkdir -p /home/shiny/paquetes
COPY paquetes.R /home/shiny/paquetes/

RUN Rscript /home/shiny/paquetes/paquetes.R

EXPOSE 8080

CMD ["/usr/bin/shiny-server.sh"]
```

#### 3. A la nube!

Ahora que tenemos todo funcionando localmente, es el momento de probarlo en la nube y para esto vamos a usar [Cloud Run](https://cloud.google.com/run?hl=es) que es una solución "serverless" de Google. 

Primero tenemos que crear un *disparador* con **Cloud Build** y asociarlo con nuestro repositorio de GitHub:

<p align="center" class="my-6">
  <img src="/img/blog/2020-06-13 ServerlessShinyenGoogleCloud/cloud-build-1.png" alt="Cloud Build Triggers" class="rounded-xl shadow-md max-w-full sm:max-w-lg h-auto" />
</p>

Para que todo funcione, el repositorio tiene que contener los siguientes archivos (además de la aplicación propiamente dicha):

- **Dockerfile**: secuencia para construir la imagen que se usará en el contenedor.
- **cloudbuild.yaml**: contiene los pasos que va a usar Cloud Build para deployar la aplicación.
- **shiny-server.conf**: configuración del server de Shiny.
- **shiny-server.sh**: ejecutable que arrancará la aplicación de Shiny.

Ahora, cada vez que actualicemos nuestro repositorio en GitHub, se van a ejecutar las tareas que se encuentren en el archivo *cloudbuild.yaml*:

<p align="center" class="my-6">
  <img src="/img/blog/2020-06-13 ServerlessShinyenGoogleCloud/cloud-build-2.png" alt="Cloud Build Ejecución" class="rounded-xl shadow-md max-w-full sm:max-w-lg h-auto" />
</p>

Para subir la aplicación a Cloud Run, tenemos dos formas: la primera es **manualmente** en Cloud Run y la segunda **proporcionando el archivo `cloudbuild.yaml`** que contendrá todos los pasos para que se ejecute por sí solo! 

```yaml
# cloudbuild.yaml
steps:
  # build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-f', 'Dockerfile', '-t', 'gcr.io/augusto-hassel/demo-shiny', '.']
  # push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/augusto-hassel/demo-shiny']
  # Deploy container image to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      [
        'run',
        'deploy',
        'demo-shiny',
        '--image',
        'gcr.io/augusto-hassel/demo-shiny',
        '--region',
        'us-central1',
        '--platform',
        'managed',
        '--quiet',
        '--allow-unauthenticated'
      ]
images:
  - gcr.io/augusto-hassel/demo-shiny

timeout: 14400s
```

Si llegaron hasta acá, entonces la aplicación probablemente les ha funcio... no...

#### 4. Lis... Alerta! Calzada resbaladiza...

[Cloud Run no soporta Websocket](https://cloud.google.com/run/docs/issues#grpc_websocket) y lastimosamente mi aplicación lo necesita para funcionar...

<p align="center" class="my-6">
  <img src="/img/blog/2020-06-13 ServerlessShinyenGoogleCloud/dontwork.gif" alt="Error de websocket en Cloud Run" class="rounded-xl shadow-md max-w-full sm:max-w-lg h-auto" />
</p>

Si bien Shiny Server posee otros protocolos que logran 'bypasear' este impedimento, en mi caso particular la aplicación lo usa para obtener información de otra API. 

Si no fuese por este detalle, se podría haber resuelto según sugieren en el issue cargado al repo oficial de [Shiny en GitHub](https://github.com/rstudio/shiny/issues/2455).

##### Una luz de esperanza: Docker Run for Anthos 🚀

Por lo que estuve investigando, websocket está soportado si uno corre Cloud Run en un entorno de [Kubernetes](https://cloud.google.com/kubernetes-engine?hl=es), así que manos a la obra!

> ¿Qué es Kubernetes? Bueno, en simples palabras es una plataforma que administra los contenedores de los cuales venimos hablando. Esto nos va a permitir, por ejemplo, tener réplicas de un contenedor distribuido en varias máquinas, las cuales se pueden autoescalar dependiendo del tráfico y el procesamiento que estén necesitando.

Para que funcione en Kubernetes primero tuvimos que **crear un cluster de máquinas** (usé los parámetros por defecto de Google Cloud) y luego **habilitar algunos parámetros según me fueron requiriendo** en Cloud Run (habilitar Cloud Run for Anthos por ejemplo). 

Finalmente, tuvimos que **modificar el YAML** ligeramente para ejecutar la imagen en el cluster que recién creamos:

```yaml
# cloudbuild.yaml
steps:
  # build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-f', 'Dockerfile', '-t', 'gcr.io/augusto-hassel/demo-shiny', '.']
  # push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/augusto-hassel/demo-shiny']
  # Deploy container image to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      [
        'run',
        'deploy',
        'demo-shiny',
        '--image',
        'gcr.io/augusto-hassel/demo-shiny',
        '--cluster',
        'my-first-cluster-1',
        '--cluster-location',
        'us-central1-c',
        '--platform',
        'gke'
      ]
images:
  - gcr.io/augusto-hassel/demo-shiny

timeout: 14400s
```

Lo último fue seguir el siguiente tutorial para que se pueda acceder con un dominio personalizado: [habilitar las conexiones HTTPS y los certificados TLS automáticos](https://cloud.google.com/run/docs/gke/auto-tls?hl=es).

El resultado queda a la vista: 

> **Mi primer aplicación de Shiny corriendo en Kubernetes: [demo.hasselpunk.com/rRofex](https://demo.hasselpunk.com/rRofex) 😍**

PD: si este blog te sirvió, me podés invitar un café con el siguiente botón!  
PD2: Cambié la ubicación de la APP, en este momento no está corriendo en Kubernetes para disminuir costos únicamente, pero es válido todo el posteo si es que quieren colocar su propia aplicación en Kubernetes!

<div class="mt-8 pt-6 border-t border-md-outline-variant/30 flex justify-start">
  <a href="https://www.buymeacoffee.com/augustohassel" target="_blank" rel="noopener noreferrer" class="inline-block transition-transform hover:scale-105">
    <img src="https://cdn.buymeacoffee.com/buttons/arial-blue.png" alt="Buy Me A Coffee" height="38" class="h-10 w-auto" />
  </a>
</div>

