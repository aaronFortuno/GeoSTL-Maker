
# GeoSTL Maker (GitHub Pages Edition)

Aquesta versió de l'aplicació està optimitzada per funcionar directament al navegador sense necessitat de Node.js ni cap eina de compilació.

## Com publicar a GitHub Pages

1. **Crea un repositori** a GitHub.
2. **Puja el fitxer `index.html`** (tot el codi està contingut aquí per màxima compatibilitat).
3. Ves a **Settings > Pages** al teu repositori.
4. Selecciona la branca `main` i la carpeta `/ (root)` com a font.
5. Prem **Save**. En un minut, la teva web estarà activa a `https://el-teu-usuari.github.io/el-teu-repositori/`.

## Per què no necessita Node.js?

- **ES Modules (ESM)**: Utilitzem la capacitat nativa dels navegadors moderns per carregar mòduls de JavaScript.
- **esm.sh**: Les dependències (React, Three.js) es carreguen directament des d'un CDN global.
- **htm**: En lloc de JSX (que requereix Node per compilar), utilitzem `htm`, que permet escriure plantilles similars a JSX que s'executen nativament.

## Llicència i Autoria

**Llicència**: GNU GPL  
**Autoria**: Aarón Fortuño (afortun8@xtec.cat) amb Gemini AI.
