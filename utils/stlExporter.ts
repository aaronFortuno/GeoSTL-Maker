
import { MeshData, TerrainParams } from '../types';

/**
 * Generates an ASCII STL string from heightmap data
 * Includes a solid base for 3D printing
 */
export const exportToSTL = (mesh: MeshData, params: TerrainParams): string => {
  const { positions, indices } = mesh;
  const { size, resolution } = params;
  const segments = resolution;
  const halfSize = size / 2;

  let stl = "solid GeoTerrain\n";

  const writeFacet = (v1: number[], v2: number[], v3: number[]) => {
    // Basic normal calculation (not strictly required for many slicers but good practice)
    // For simplicity in this educational tool, we'll use a dummy normal
    stl += `  facet normal 0 0 0\n`;
    stl += `    outer loop\n`;
    stl += `      vertex ${v1[0].toFixed(4)} ${v1[1].toFixed(4)} ${v1[2].toFixed(4)}\n`;
    stl += `      vertex ${v2[0].toFixed(4)} ${v2[1].toFixed(4)} ${v2[2].toFixed(4)}\n`;
    stl += `      vertex ${v3[0].toFixed(4)} ${v3[1].toFixed(4)} ${v3[2].toFixed(4)}\n`;
    stl += `    endloop\n`;
    stl += `  endfacet\n`;
  };

  const getPos = (idx: number) => [positions[idx * 3], positions[idx * 3 + 1], positions[idx * 3 + 2]];

  // 1. Export top surface
  for (let i = 0; i < indices.length; i += 3) {
    writeFacet(getPos(indices[i]), getPos(indices[i + 1]), getPos(indices[i + 2]));
  }

  // 2. Export base (bottom surface at y=0)
  // Two large triangles for the bottom
  writeFacet([-halfSize, 0, -halfSize], [-halfSize, 0, halfSize], [halfSize, 0, halfSize]);
  writeFacet([-halfSize, 0, -halfSize], [halfSize, 0, halfSize], [halfSize, 0, -halfSize]);

  // 3. Export sides
  // Iterating through edges to close the mesh
  for (let i = 0; i < segments; i++) {
    // Edge at j=0
    const aTop = i * (segments + 1);
    const bTop = (i + 1) * (segments + 1);
    const aBot = [positions[aTop * 3], 0, positions[aTop * 3 + 2]];
    const bBot = [positions[bTop * 3], 0, positions[bTop * 3 + 2]];
    writeFacet(getPos(aTop), aBot, bBot);
    writeFacet(getPos(aTop), bBot, getPos(bTop));

    // Edge at j=segments
    const cTop = i * (segments + 1) + segments;
    const dTop = (i + 1) * (segments + 1) + segments;
    const cBot = [positions[cTop * 3], 0, positions[cTop * 3 + 2]];
    const dBot = [positions[dTop * 3], 0, positions[dTop * 3 + 2]];
    writeFacet(getPos(cTop), dBot, cBot);
    writeFacet(getPos(cTop), getPos(dTop), dBot);

    // Edge at i=0
    const eTop = i;
    const fTop = i + 1;
    const eBot = [positions[eTop * 3], 0, positions[eTop * 3 + 2]];
    const fBot = [positions[fTop * 3], 0, positions[fTop * 3 + 2]];
    writeFacet(getPos(eTop), fBot, eBot);
    writeFacet(getPos(eTop), getPos(fTop), fBot);

    // Edge at i=segments
    const gTop = segments * (segments + 1) + i;
    const hTop = segments * (segments + 1) + (i + 1);
    const gBot = [positions[gTop * 3], 0, positions[gTop * 3 + 2]];
    const hBot = [positions[hTop * 3], 0, positions[hTop * 3 + 2]];
    writeFacet(getPos(gTop), gBot, hBot);
    writeFacet(getPos(gTop), hBot, getPos(hTop));
  }

  stl += "endsolid GeoTerrain\n";
  return stl;
};

export const downloadFile = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};
