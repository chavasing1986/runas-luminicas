# RUNAS LUMÍNICAS V11

Aplicación web React + TypeScript + Three.js que genera una runa vertical personalizada para cada nombre.

## Requisitos

- Node.js 20 LTS
- npm
- GitHub
- Netlify

## Desarrollo local

```bash
npm install
npm run dev
```

## Compilar

```bash
npm run build
```

## Publicación automática con GitHub + Netlify

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos de esta carpeta.
3. En Netlify elige **Add new site → Import an existing project**.
4. Conecta GitHub y selecciona el repositorio.
5. Netlify detectará automáticamente:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Publica.

Cada cambio enviado a la rama principal de GitHub activará una nueva publicación automática en Netlify.

## Estructura principal

```text
src/
├── components/
├── engine/
├── store/
├── styles/
├── App.tsx
└── main.tsx
```

## Motor rúnico

Cada nombre controla:

- eje central;
- bucles;
- barras;
- corona;
- cierre;
- repeticiones;
- microgestos;
- brillo;
- proporciones;
- código ADN geométrico.

## Modos visuales

- Ceremonial
- Técnico
- Minimalista
- Joviano
