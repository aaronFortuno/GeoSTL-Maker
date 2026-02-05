
export enum LandformType {
  ISLAND = 'Illa',
  ARCHIPELAGO = 'Arxipèlag',
  BAY = 'Badia',
  CAPE = 'Cap',
  PENINSULA = 'Península',
  VALLEY = 'Vall',
  PLATEAU = 'Podi / Meseta',
  MOUNTAIN = 'Muntanya',
  RANGE = 'Serralada',
  GLACIAL_VALLEY = 'Vall Glaciar (U)',
  LAKES = 'Sistema de Llacs',
  ISTHMUS = 'Istme',
  CANYON = 'Canyó',
  VOLCANO = 'Volcà'
}

export interface TerrainParams {
  type: LandformType;
  size: number; // in mm
  maxHeight: number; // in mm
  resolution: number; // segments
  noiseScale: number;
  roughness: number;
  distortion: number; // 0 to 1
  seed: number; // integer
  baseThickness: number; // mm
}

export interface MeshData {
  positions: Float32Array;
  indices: Uint32Array;
  heights: Float32Array;
}
