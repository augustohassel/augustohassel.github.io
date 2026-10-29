# Guía de Desarrollo y Gobernanza para Agentes y Desarrolladores (AGENTS.md)

Este documento define la arquitectura, normas operativas, flujo de trabajo con Git y convenciones para cualquier agente de inteligencia artificial (como Antigravity) o desarrollador humano que colabore en este repositorio.

---

## 1. Propósito y Visión del Proyecto

- **Repositorio**: `augustohassel/augustohassel.github.io`
- **Dominio en producción**: [www.hasselpunk.com](https://www.hasselpunk.com)
- **Propósito**: Sitio web personal, portfolio profesional y blog de **Augusto Hassel**.
- **Stack tecnológico**:
  - **Framework**: Astro 5 (Static Site Generation - SSG).
  - **Estilos**: Tailwind CSS siguiendo las pautas de **Material Design 3 (Material You)**.
  - **Entorno de ejecución**: Node.js 22 LTS containerizado mediante **Dev Containers** (`.devcontainer/`).
  - **Despliegue y Hosting**: GitHub Pages automatizado mediante **GitHub Actions** al integrar en `master`.

---

## 2. Principios No Negociables

1. **Validación Local Primero**:
   - Todo cambio de código debe compilarse y validarse localmente mediante build (`npm run build`) o linter (`npm run lint`) antes de considerarse completo o someterse a revisión.
2. **Sin Git Push Automático**:
   - El agente tiene estrictamente prohibido ejecutar `git push` hacia cualquier repositorio remoto sin la aprobación explícita y previa del usuario.
3. **Commits Claros y Atómicos**:
   - Utilizar mensajes de commit bajo la convención de **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
4. **Respeto a la Privacidad y Cero Secretos**:
   - Nunca incluir credenciales, tokens personales, API keys ni información confidencial en archivos de código, issues o mensajes de commit.
5. **Preservación del Dominio y Slugs Históricos**:
   - El archivo `CNAME` (`www.hasselpunk.com`) y los slugs de las publicaciones históricas del blog deben preservarse para garantizar que ningún enlace externo se rompa.

---

## 3. Estrategia de Ramas y Ciclo de Vida de Issues

El repositorio sigue un modelo de integración continua con dos ramas principales protegidas:

- **`master`**: Rama de **producción**. Representa el estado estable desplegado en GitHub Pages. Nunca se commitea directamente en `master`.
- **`dev`**: Rama de **integración y desarrollo base**. Todos los cambios y tareas se originan e integran aquí.
- **Ramas de tareas (`issue/<n>`)**:
  - Todo desarrollo o corrección se realiza en una rama nombrada exactamente `issue/<n>`, donde `<n>` es el número del issue en GitHub (ej: `issue/2`).
  - La rama `issue/<n>` se crea **siempre a partir de `dev` actualizado**:
    ```bash
    git checkout dev
    git pull origin dev
    git checkout -b issue/<n>
    ```
  - Los Pull Requests de tareas se integran hacia `dev`. Al completarse el merge, la rama `issue/<n>` se elimina.
  - La promoción a producción se realiza mediante Pull Request desde `dev` hacia `master`.
  - Si el usuario solicita explícitamente trabajar directo en `dev` sin abrir un issue, se aplica el protocolo de trabajo sin issue manteniendo commits atómicos y validación local.

---

## 4. Orquestación Escalonada y Subagentes de Solo Lectura

El trabajo se dimensiona en tres niveles de complejidad según la cantidad de archivos y ambigüedad de reglas:

| Nivel | Criterio | Relevamiento Inicial | Implementación | Auditoría Pre-PR |
| :--- | :--- | :--- | :--- | :--- |
| **Liviano** | 1 a 2 archivos, cambio directo sin ambigüedad. | Agente principal releva directamente. | Agente principal implementa y valida. | Agente principal audita diff y status. |
| **Estándar** | 2 a 3 archivos con lógica o reglas de negocio abiertas. | Se invoca subagente `analista` (solo lectura). | Agente principal implementa y valida. | Se invoca subagente `supervisor` en **modo estándar** sobre el diff antes del PR. |
| **Profundo** | Más de 3 archivos, cambios arquitectónicos o refactors. | Se invoca subagente `analista` para cruzar glosario, decisiones y código. | Agente principal persiste plan (`<!-- plan-trabajo issue=<n> -->`), implementa y valida. | Se invoca subagente `supervisor` en **modo profundo** (auditoría estándar + simplificación de código). |

- **Escalamiento automático**: Si un trabajo comienza en nivel `Liviano` pero supera los 2 archivos o incorpora lógica compleja, escala automáticamente a `Estándar` o `Profundo`, activando las revisiones correspondientes.
- **Subagentes en solo lectura**: `analista` y `supervisor` nunca escriben código ni crean ramas; el agente principal es el único interlocutor y escritor.

---

## 5. Glosario de Dominio y Decisiones de Arquitectura

- **Glosario en tiempo real (`docs/glosario.md`)**:
  - Todo término nuevo, entidad de dominio o jerga del proyecto se documenta en `docs/glosario.md` en el momento en que se define o aclara, sin postergarlo para el cierre de la tarea.
  - Si surge una inconsistencia entre un requerimiento y el glosario, se advierte para alinear definiciones.
- **Registro de decisiones (`docs/decisiones/`)**:
  - Toda elección técnica difícil de revertir, que sorprenda sin contexto y surja de alternativas reales se registra como ADR ligero en `docs/decisiones/`.

---

## 6. Reglas Transversales de Calidad

1. **Lectura completa de skills**: Leer cada `SKILL.md` y sus referencias de principio a fin antes de ejecutar cualquier acción.
2. **Diagramas de flujo (`mermaid`)**: Representar visualmente mediante diagramas de flujo (`flowchart TD` o `LR`) cualquier proceso que involucre pasos condicionales o cambios de estado, señalando dudas con `[Por confirmar]`.
3. **Instrucciones de prueba paso a paso**: Todo reporte o PR debe incluir instrucciones claras indicando:
   - Dónde ejecutarlo (directorio o contenedor).
   - Comando o acción exacta.
   - Qué resultado se observa si funciona correctamente.
   - Dónde mirar si se presenta un fallo.

---

## 7. Entorno Devcontainer

El proyecto provee una configuración reproducible en `.devcontainer/devcontainer.json` basada en Node.js 22 LTS y utilidades esenciales (`git`, `curl`, `gh cli`), exponiendo el puerto `4321` para el servidor de desarrollo de Astro. Todo agente o desarrollador puede operar dentro del contenedor sin alterar dependencias en el sistema anfitrión.

