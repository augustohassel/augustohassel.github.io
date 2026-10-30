# 0001: Sistema de Diseño Material Design 3, Paleta Tonal y Theming Claro/Oscuro

- **Fecha**: 2026-10-30
- **Estado**: Aceptada

## Contexto y Problema
El sitio web personal y portfolio de Augusto Hassel (`www.hasselpunk.com`) requería un sistema visual moderno, sobrio y accesible que reemplace los estilos estáticos heredados de Hugo. Era indispensable soportar modo claro y modo oscuro, conmutación fluida sin destello visual (FOUC), tipografía auto-hospedada para privacidad y rendimiento, y una estructura de componentes modulares reutilizables para los próximos hitos de Bio, Portfolio y Blog.

## Alternativas Evaluadas
1. **Librerías de componentes prediseñados pesadas (MUI / Material Web Components)**:
   - *Ventajas*: Implementación directa de componentes complejos con especificación completa de Google.
   - *Desventajas*: Alto peso en JavaScript cliente, incompatibilidad parcial con la arquitectura estática pura de Astro 5 (islas) y pérdida de control granular sobre estilos Tailwind CSS.
2. **Carga remota de Google Fonts y Tailwind con modo oscuro básico (`media`)**:
   - *Ventajas*: Configuración mínima inicial.
   - *Desventajas*: Fuga de privacidad (envío de IPs de visitantes a servidores de Google), dependencia de conectividad externa durante el build/devcontainer, e imposibilidad de que el usuario elija y guarde su preferencia de modo manual si difiere del sistema operativo.
3. **Tokens semánticos M3 sobre Tailwind CSS, `@fontsource/inter` y conmutación accesible con script anti-FOUC**:
   - *Ventajas*: Generación estática pura (cero runtime de framework JS innecesario), cumplimiento riguroso de WCAG 2.1 AA en contraste, fuentes auto-hospedadas offline y respetuosas de la privacidad, persistencia en `localStorage` con fallback seguro para No-JS y navegación restringida.
   - *Desventajas*: Requiere definir y mapear manualmente los roles de color semánticos de M3 en CSS y Tailwind.

## Decisión Adoptada
Se adopta la **Alternativa 3**:
- Mapeo de paleta tonal basada en semilla Verde Esmeralda/Teal (`#006a60` en modo claro y `#53dbca` en modo oscuro) con roles semánticos Material Design 3 (`primary`, `surface`, `surface-container`, `outline`, etc.).
- Modo oscuro gestionado mediante `darkMode: 'class'` en Tailwind, complementado con fallback automático en CSS `@media (prefers-color-scheme: dark)` para entornos sin JavaScript.
- Script bloqueante inline liviano en el `<head>` de `BaseLayout.astro` para evitar FOUC, encapsulando accesos a `localStorage` en bloques `try/catch` para prevenir fallas por `SecurityError`.
- Componentes modulares accesibles: `Header`, `Footer`, `ThemeToggle`, `Card`, `Badge` y `Button` con soporte para alto contraste forzado (`forced-colors: active`).
- Fuente `Inter` auto-hospedada mediante el paquete `@fontsource/inter`.

## Consecuencias y Trade-offs
- **Positivas**: Cero FOUC, puntuación óptima en Google Lighthouse (Performance y Accesibilidad), código 100% auditable y compatible con Devcontainers sin red externa.
- **Trade-offs**: Cada nuevo componente debe utilizar los tokens semánticos definidos (`bg-md-surface`, `text-md-on-surface`, `border-md-outline-variant`) en lugar de colores hardcodeados de Tailwind (`bg-slate-900`) para garantizar coherencia en ambos temas.

