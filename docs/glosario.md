# Glosario de Dominio — HasselPunk

Este documento reúne las entidades, conceptos técnicos y jerga funcional del sitio personal y ecosistema de desarrollo de Augusto Hassel (`www.hasselpunk.com`).

---

### HasselPunk
- **Definición**: Identidad digital, marca personal y nombre de dominio histórico de Augusto Hassel para su sitio web y blog profesional.
- **Alcance / Propósito**: Nombre del proyecto y del sitio web publicado en [www.hasselpunk.com](https://www.hasselpunk.com).
- **Lo que NO es**: No es un producto comercial independiente ni una organización externa.

---

### Astro
- **Definición**: Framework web enfocado en contenido y rendimiento mediante arquitectura de islas y generación de sitios estáticos (SSG).
- **Alcance / Propósito**: Motor principal del sitio a partir de la versión 5, responsable de compilar el contenido Markdown y componentes UI en HTML/CSS altamente optimizado.
- **Lo que NO es**: No es una Single Page Application (SPA) pesada ni depende de un servidor Node.js en tiempo de ejecución.

---

### Material Design 3 (Material You)
- **Definición**: Sistema de diseño desarrollado por Google que enfatiza la personalización dinámica de color, contraste accesible, elevaciones sutiles y bordes redondeados.
- **Alcance / Propósito**: Guía visual y conceptual para los estilos, tipografía, paleta de colores y componentes del sitio (implementado mediante Tailwind CSS).
- **Lo que NO es**: No impone una dependencia obligatoria de librerías propietarias cerradas; se aplica siguiendo sus especificaciones de diseño.

---

### Devcontainer
- **Definición**: Especificación abierta que define un contenedor Docker completo de desarrollo con todas las herramientas, extensiones y dependencias configuradas.
- **Alcance / Propósito**: Proveer un entorno aislado y 100% reproducible basado en Node.js 22 LTS para que cualquier agente o desarrollador ejecute el proyecto sin contaminar el sistema host.
- **Lo que NO es**: No es el contenedor que se ejecuta en producción (la producción se compila a archivos estáticos puros para GitHub Pages).

---

### Antigravity
- **Definición**: Entorno y plataforma de desarrollo asistida por agentes autónomos de IA de Google DeepMind.
- **Alcance / Propósito**: Asistente principal de codificación, auditoría y resolución de tareas sobre el repositorio, operando en coordinación con subagentes especializados (`analista`, `supervisor`).
- **Lo que NO es**: No actúa de forma autónoma sin supervisión del usuario en acciones críticas (como push a ramas remotas).

---

### Skills Personales (AgentToolkit)
- **Definición**: Conjunto estandarizado de capacidades, reglas y flujos de trabajo empaquetados para agentes de IA (gestión de issues, ramas, revisiones y ciclo de vida Git).
- **Alcance / Propósito**: Estandarizar la forma en que los agentes analizan (`analista`), implementan y auditan (`supervisor`) cada tarea en el repositorio.
- **Lo que NO es**: No son librerías de runtime del sitio web, sino herramientas exclusivas del entorno de desarrollo de agentes.

---

### GitHub Pages
- **Definición**: Servicio de hosting de sitios estáticos de GitHub que sirve archivos HTML/CSS/JS directamente desde un repositorio.
- **Alcance / Propósito**: Infraestructura de producción para alojar `www.hasselpunk.com`, actualizado mediante un pipeline automatizado de GitHub Actions.
- **Lo que NO es**: No ejecuta backend dinámico, base de datos ni procesamiento del lado del servidor.

