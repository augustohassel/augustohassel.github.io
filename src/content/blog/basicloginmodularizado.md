---
title: "Basic LogIn Modularizado"
author: "Augusto Hassel"
date: 2020-02-21T01:45:14-03:00
featured: true
image: "/img/login.jpeg"
description: "Cómo armar un login básico modular en Shiny"
tags: ["Modules", "Shiny", "Dashboard", "BusinessIntelligence"]
category: "Archivo / R"
---

> Para los ansiosos como yo: aquí el [proyecto en GitHub](https://github.com/augustohassel/BasicLogInModule) desde donde pueden obtener una versión básica funcional! 😄

Siendo este mi primer posteo, va a existir mucha referencia a desarrollos que me encantaría poder explayar pero prometo intentar mantenerme concentrado y, en todo caso, si gustan, continuaré explayándome en otra ocasión. 

### La motivación

Desde el momento en que empecé a armar tableros en Shiny me encontré con la necesidad de brindar permisos a usuarios. Esto significa que un usuario pueda, además de ver o no el contenido completo del sitio, obtener distintos tipos de acceso incluso dentro de las aplicaciones. 

Sé que existen servicios como [Auth0](https://auth0.com/) o, si tienen suerte, la versión paga de [Shiny Server Pro](https://docs.rstudio.com/shiny-server/#authentication-security) desde la cual pueden validar usuarios usando LDAP, Active Directory y otros. Incluso también podrían usar [Shiny Proxy](https://www.shinyproxy.io/configuration/#authentication), el cual es open source, para que la validación del usuario quede en manos de alguno de los tantos métodos existentes. 

Por curiosidad, y en ciertos momentos por necesidad, fui creando un log-in que pudiese manejar no solo el ingreso del usuario, sino también los distintos tipos de permisos internos y vistas disponibles una vez dentro de la aplicación. 

Este es el resultado!

<p align="center" class="my-6">
  <img src="/img/login.gif" alt="Demo de Login Modularizado en Shiny" class="rounded-xl shadow-md max-w-full h-auto" />
</p>

***

### Supuestos y definiciones

1. [Modules!](https://shiny.rstudio.com/articles/modules.html) Básicamente los módulos son como funciones que generan una UI de Shiny y contienen la lógica del servidor asociada. Pero la verdadera magia se da en que, a diferencia de las funciones, estos solucionan el problema del **namespace**, o sea, **podemos reutilizar un mismo módulo múltiples veces dentro de una misma aplicación sin preocuparnos por que los IDs de inputs y outputs sean distintos**!
2. *¿Tiene sentido que una función de log-in esté modularizada si solo será usada una sola vez dentro de la aplicación?* Podría no estar modularizada! Pero... me parece un buen caso de uso para empezar a aprender sobre módulos, al mismo tiempo que es más sencillo para organizar el código y también para compartirlo.

### Manos a la obra!

Actualmente **cargo módulos de dos maneras distintas** dependiendo de si el módulo es específico del tablero en que me encuentro trabajando o si es transversal a todos los tableros (en el caso del login, es el mismo módulo para todos mis tableros). 

Con la **primer opción** guardo todos los módulos en una carpeta llamada "modules" y luego hago un source desde *global.R*: `invisible(lapply(list.files(path = "modules", full.names = T), source))`. 

Con la **segunda opción** guardo los módulos en un repositorio en GitHub y luego hago un source del contenido directamente desde ahí! Con esto me aseguro de que solo tengo que modificar en un solo lugar y esto afecta a todos los tableros! Algo así sería:

```r
eval(
  GET(url = "https://api.github.com/repos/XXXXX.R", 
      authenticate("username", "token"), 
      accept(type = "application/vnd.github.v3.raw")) %>%
    content(as = "text") %>%
    parse(file = "", n = NA)
)
```

Un módulo se compone de dos partes, muy similar a una aplicación de Shiny, la primera es una función que genera la interfaz y la segunda la que contiene la lógica. 

#### Module UI

En nuestro caso, es bastante sencilla, porque en realidad la UI la genero también desde la función del server con renderUI. Esto lo hago para poder disparar el Modal!

```r
login_ui <- function(id) {
  ns <- NS(id)
  tagList(
    uiOutput(ns("modal_login"))
  )
}
```

Acá lo importante es recordar que los inputs se envuelven con un `ns()`, esto crea posteriormente la magia para que no se repitan con otros IDs del mismo módulo en otro lugar de la aplicación!

#### Module Server

El modal que muestra el login contiene la información típica, **pide un usuario y una contraseña**, y además permite volver a resetear el password! Si quieren probar el reseteo del password en funcionamiento, pueden hacerlo pidiéndome un usuario para la [versión demo del BO Companion](https://demo.hasselpunk.com/), donde básicamente se envía un correo usando algún SMTP (*yo uso mailgun o mandrill según el cliente*) al correo registrado y luego se lee el hash que se genera en el link en la URL para verificar que el usuario en efecto fue el que pidió el cambio de contraseña.

Los usuarios creados para la versión demo están cargados en el *server.R* y son: 

| Usuario | Contraseña |
| :--- | :--- |
| `demo` | `demo` |
| `juan` | `juan` |
| `pedro` | `pedro` |

> **Aclaración**: solo por ser un caso de ejemplo estoy guardando los usuarios en un data frame en el server. En producción lo tengo todo en bases de datos en la nube en GCloud.

A la función del server `function(input, output, session, usuarios_full, usuarios_validos)` se le pasan dos listados, el *listado completo de usuarios* y los *usuarios válidos del tablero en cuestión*. Los permisos específicos dentro del tablero se evalúan en otro lugar! 

Hay un **observer** que *controla el botón de login* y efectúa todas las validaciones correspondientes! Prueben con usuarios que no estén en el listado o incluso con todos los usuarios... hay uno que no tiene permiso para ingresar! En cada caso se da un aviso sobre lo que está sucediendo.

```r
  observeEvent(input$login, {
    
    shinyjs::disable("login")
    
    if (input$usuario=="") {
      sendSweetAlert(session = session, title = "Mmm...", text = "Debe colcar un usuario para acceder!", type = "warning")
    } else if (full_users() %>% filter(UserName == input$usuario) %>% nrow() == 0) {
      sendSweetAlert(session = session, title = "Mmm...", text = "El usuario no existe!", type = "warning")
    } else if (valid_users() %>% filter(UserName == input$usuario) %>% nrow() == 0) {
      sendSweetAlert(session = session, title = "Mmm...", text = "El usuario no posee acceso a este tablero!", type = "warning")
    } else if (valid_users() %>% filter(UserName == input$usuario) %>% pull(Password) %>% is.na()) {
      sendSweetAlert(session = session, title = "Mmm...", text = HTML("Debe setear una contraseña, hable con el admin!"), type = "warning", html = T)
    } else {
      pass_ok <- identical(valid_users() %>% filter(UserName==input$usuario) %>% pull(Password), digest::digest(object = input$password, algo = "sha1", serialize = F))
      
      if (pass_ok) {
        sendSweetAlert(session = session, title = "Bienvenido!", type = "success")
        
        return_values$user <- valid_users() %>% filter(UserName==input$usuario) %>% pull(UserId)
        return_values$person <- valid_users() %>% filter(UserName==input$usuario) %>% pull(PersonaId)
        return_values$permiso <- valid_users() %>% filter(UserName==input$usuario) %>% pull(Permiso)
        
        removeModal()
        
      } else if (!pass_ok) {
        sendSweetAlert(session = session, title = "Error!", text = HTML("Contraseña Incorrecta"), type = "error", html = T)
      }
    }
    
    shinyjs::enable("login")
  })
```

**Si el password que tenemos registrado del usuario se condice con el password que el usuario está ingresando, entonces será un login exitoso!**  
`identical(valid_users() %>% filter(UserName==input$usuario) %>% pull(Password), digest::digest(object = input$password, algo = "sha1", serialize = F))`

Otra cosa importante a tener en cuenta que sucede al final de la función es que se devuelven valores reactivos dentro de un `return_values`. Estos me ayudarán luego en la aplicación principal a tener registradas variables globales como ser el usuario que se está logueando.

### Y ahora la aplicación principal!

En la aplicación principal tenemos que realizar dos tareas, primero en el UI y luego en el SERVER.  

#### En el UI

Aquí agregamos una sola línea!

```r
login_ui("login")
```

**login_ui** tiene un solo parámetro, y es el ID, que en este caso estamos eligiendo como `id = 'login'`. Esta es la magia que mencionamos al comienzo, si quisiéramos usar el mismo módulo con distintos parámetros, solamente tendríamos que preocuparnos por que este ID sea distinto!

#### En el SERVER

Aquí suceden dos cosas importantes, primero llamamos al módulo, pasando el ID que elegimos anteriormente, y le pasamos los parámetros relevantes (habíamos dicho que eran los usuarios completos y los que tenían permiso):

```r
login_result <- callModule(module = login,
                           id = "login", 
                           usuarios_full = usuarios_full, 
                           usuarios_validos = usuarios_validos)
```

Luego se brindan los permisos en consecuencia de lo que se haya obtenido. Esto significa que voy a usar `shinyjs` para mostrar u ocultar partes de la aplicación y también el menú será distinto según el permiso que tenga el usuario gracias a `renderMenu`:

```r
observe({
  req(!is_null(login_result$permiso))
  req(!is_null(login_result$person))
  req(!is_null(login_result$user))
  
  if (login_result$permiso %in% c(1)) { # permiso total
    # menu
    output$menu <- renderMenu({
      sidebarMenu(
        menuItem(text = "Tab", tabName = "first_page", icon = icon("skull"))
      )
    })
    
    # accesos
    shinyjs::hide("login_page", anim = T, animType = "slide")
    shinyjs::show("first_page_show") # paginas
  } 
  
  global_id_persona(login_result$person)
  global_id_usuario_dashboard(login_result$user)
})
```

Así es como llegamos al final y logramos tener un log-in básico modularizado! Si hacen un clone del repositorio y corren la aplicación de Shiny, van a poder interactuar y seguramente verán algunas cosas extras que están dando vuelta.

Espero que haya servido este primer posteo! Todo feedback es bienvenido!

> **Bonus Track**: Sigo a varios repositorios interesantes sobre Shiny en GitHub: miralos [aquí](https://github.com/augustohassel?tab=stars)

<div class="mt-8 pt-6 border-t border-md-outline-variant/30 flex justify-start">
  <a href="https://www.buymeacoffee.com/augustohassel" target="_blank" rel="noopener noreferrer" class="inline-block transition-transform hover:scale-105">
    <img src="https://cdn.buymeacoffee.com/buttons/arial-blue.png" alt="Buy Me A Coffee" height="38" class="h-10 w-auto" />
  </a>
</div>

