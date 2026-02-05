
# GeoSTL Maker

GeoSTL Maker és una eina educativa interactiva per dissenyar i generar models 3D procedimentals d'accidents geogràfics. L'objectiu principal és facilitar la creació de material didàctic per a escoles i instituts, permetent exportar els models a format STL per a la seva posterior impressió en 3D.

## Característiques

- **Varietat Geogràfica**: Genera illes, arxipèlags, badies, caps, penínsules, muntanyes, serralades, canyons, volcans i més.
- **Generació Procedimental**: Basat en soroll de Perlin millorat per obtenir formes realistes i orgàniques.
- **Control de Seed**: Permet replicar dissenys exactes mitjançant un codi numèric.
- **Actualització en Temps Real**: Visualitza els canvis en els paràmetres (mida, altura, distorsió, detall) de forma instantània.
- **Visor 3D Interactiu**: Explora el model generat abans de descarregar-lo.
- **Exportació STL**: Genera fitxers STL sòlids i optimitzats per a impressió 3D.

## Funcionament

1. **Selecció de Tipus**: Tria l'accident geogràfic que vols estudiar des del menú desplegable.
2. **Ajust de Paràmetres**:
   - **Mida Base**: Dimensions de la placa de suport.
   - **Altura Màxima**: Escala vertical del relleu.
   - **Distorsió**: Controla com de sinuoses o orgàniques són les línies de costa i valls.
   - **Complexitat Detall**: Defineix la rugositat i el nivell de detall del terreny.
3. **Seed**: Si vols un disseny nou del mateix tipus, prem el botó de randomitzar seed o escriu un número manualment.
4. **Resolució**: Tria la densitat de la malla (més resolució implica més detall però fitxers més pesants).
5. **Descàrrega**: Quan estiguis satisfet, prem "Descarregar STL" per obtenir el fitxer per al teu laminador (slicer).

## Instal·lació

Aquesta és una aplicació web basada en React. Per executar-la localment:

1. Assegura't de tenir instal·lat **Node.js**.
2. Descomprimeix el projecte en una carpeta.
3. Instal·la les dependències:
   ```bash
   npm install
   ```
4. Executa el servidor de desenvolupament:
   ```bash
   npm run dev
   ```
5. Obre el navegador a l'adreça indicada (normalment `http://localhost:5173`).

## Llicència i Autoria

**Llicència**: GNU GPL  
**Autoria**: Aarón Fortuño (afortun8@xtec.cat) amb l'ajuda de Gemini AI.
