# RUNAS LUMÍNICAS V11.1 — HOTFIX NETLIFY

Correcciones:
- El comando de compilación ahora es `vite build`.
- Se corrigió `tsconfig.node.json`.
- Se ampliaron los patrones de inclusión de TypeScript.
- El proyecto mantiene todos los archivos dentro de `src`.

## Importante al subir a GitHub

El repositorio debe mostrar estas carpetas y archivos en la raíz:

```text
src/
package.json
index.html
vite.config.ts
netlify.toml
```

Dentro de `src/` deben verse:

```text
App.tsx
main.tsx
components/
engine/
store/
styles/
```

Si GitHub no muestra la carpeta `src`, la carga quedó incompleta.

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20
