
import { LandformType, TerrainParams, MeshData } from '../types';
import { SimpleNoise } from './noise';

export const generateTerrain = (params: TerrainParams): MeshData => {
  const { size, resolution, maxHeight, type, noiseScale, roughness, distortion, seed, baseThickness } = params;
  
  const noise = new SimpleNoise(seed); 
  const shapeNoise = new SimpleNoise(seed + 999); 
  
  const segments = resolution;
  const positions = new Float32Array((segments + 1) * (segments + 1) * 3);
  const heights = new Float32Array((segments + 1) * (segments + 1));
  const indices = new Uint32Array(segments * segments * 6);

  const step = size / segments;
  const halfSize = size / 2;

  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      const x = i * step - halfSize;
      const z = j * step - halfSize;
      
      const nx = i / segments;
      const ny = j / segments;
      
      const dx = nx - 0.5;
      const dy = ny - 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy) * 2;
      
      const dnx = nx + shapeNoise.noise2D(nx * 2, ny * 2) * distortion * 0.3;
      const dny = ny + shapeNoise.noise2D(ny * 2, nx * 2) * distortion * 0.3;
      const warpedDist = Math.sqrt(Math.pow(dnx - 0.5, 2) + Math.pow(dny - 0.5, 2)) * 2;

      let h = 0;
      let amplitude = 1;
      let frequency = noiseScale;
      for (let oct = 0; oct < 4; oct++) {
        h += noise.noise2D(nx * frequency, ny * frequency) * amplitude;
        amplitude *= roughness;
        frequency *= 2;
      }
      h = (h + 1) / 2;

      switch (type) {
        case LandformType.ISLAND: {
          const mask = Math.max(0, 1 - warpedDist * 1.4);
          h = Math.pow(h, 0.7) * mask;
          break;
        }
        case LandformType.ARCHIPELAGO: {
          const islandNoise = Math.pow((shapeNoise.noise2D(dnx * 6, dny * 6) + 1) / 2, 2);
          const mask = Math.max(0, 1 - dist * 1.3);
          h = islandNoise > (0.55 - distortion * 0.2) ? (islandNoise - 0.3) * 2.5 * h * mask : 0;
          break;
        }
        case LandformType.BAY: {
          const shoreline = 0.4 + shapeNoise.noise2D(ny * 2, 0) * distortion * 0.3;
          const mask = nx > shoreline ? Math.min(1, (nx - shoreline) * 6) : 0;
          h = h * mask;
          break;
        }
        case LandformType.CAPE: {
          // Cap: Una punta afilada que entra al mar
          const centerline = 0.5 + shapeNoise.noise2D(nx * 2, seed) * distortion * 0.2;
          const lengthLimit = 0.75;
          const taper = Math.pow(Math.max(0, lengthLimit - nx), 1.2);
          const width = taper * (0.3 + distortion * 0.1);
          const mask = Math.max(0, 1 - Math.abs(ny - centerline) / width);
          h = h * mask * (1 - nx * 0.6);
          break;
        }
        case LandformType.PENINSULA: {
          // Península: Massa de terra bulbosa connectada a un costat
          const center = { x: 0.4 + distortion * 0.1, y: 0.5 + shapeNoise.noise2D(seed, 0) * 0.1 };
          const blobDist = Math.sqrt(Math.pow(dnx - center.x, 2) + Math.pow(dny - center.y, 2) * 0.8) * 2.5;
          const blobMask = Math.max(0, 1 - blobDist);
          // Connexió al costat esquerre (nx=0)
          const connectionWidth = 0.2 + distortion * 0.1;
          const connectionMask = nx < 0.4 ? Math.max(0, 1 - Math.abs(ny - center.y) / connectionWidth) : 0;
          const combinedMask = Math.max(blobMask, connectionMask);
          h = Math.pow(h, 0.8) * combinedMask;
          break;
        }
        case LandformType.PLATEAU: {
          const bnx = Math.abs(dnx - 0.5) * 2;
          const bny = Math.abs(dny - 0.5) * 2;
          const boxDist = Math.max(bnx, bny);
          const plateauMask = Math.max(0, 1 - Math.pow(boxDist, 10));
          h = (h * 0.15 + 0.85) * plateauMask;
          if (h > 0.7) h = 0.7 + (h - 0.7) * 0.05; 
          break;
        }
        case LandformType.VALLEY: {
          const vPath = 0.5 + shapeNoise.noise2D(nx * 1.2, seed) * distortion * 0.4;
          const valleyMask = Math.pow(Math.abs(ny - vPath), 0.7) * 2.5;
          h = h * Math.min(1, valleyMask);
          break;
        }
        case LandformType.MOUNTAIN: {
          const peakMask = Math.max(0, 1 - warpedDist * 1.6);
          h = Math.pow(h, 0.4) * Math.pow(peakMask, 2);
          break;
        }
        case LandformType.RANGE: {
          const rPath = 0.5 + shapeNoise.noise2D(nx * 1.5, seed) * distortion * 0.4;
          const ridgeDist = Math.abs(ny - rPath);
          const ridgeMask = Math.max(0, 1 - ridgeDist * 4);
          h = Math.pow(h, 0.5) * ridgeMask;
          break;
        }
        case LandformType.GLACIAL_VALLEY: {
          const gPath = 0.5 + shapeNoise.noise2D(nx, seed) * distortion * 0.2;
          const valleyFloor = Math.pow(Math.abs(ny - gPath) * 2.5, 2);
          h = (h * 0.3 + 0.7) * Math.min(1, valleyFloor);
          break;
        }
        case LandformType.LAKES: {
          const lakeN = shapeNoise.noise2D(dnx * 4, dny * 4);
          const threshold = -0.15 - distortion * 0.2;
          h = lakeN < threshold ? 0.02 : (h * 0.4 + (lakeN - threshold));
          h *= (1 - dist * 0.5);
          break;
        }
        case LandformType.ISTHMUS: {
          const bridgeY = 0.5 + Math.sin(nx * Math.PI) * (distortion * 0.2);
          const bridgeWidth = 0.05 + Math.pow(nx - 0.5, 2) * 2.8;
          const mask = Math.max(0, 1 - Math.abs(ny - bridgeY) / bridgeWidth);
          h = h * mask;
          break;
        }
        case LandformType.CANYON: {
          const baseH = 0.85 + h * 0.15;
          const cPath = 0.5 + shapeNoise.noise2D(nx * 2, seed) * distortion * 0.4;
          const cWidth = 0.07 + distortion * 0.05;
          const distToC = Math.abs(ny - cPath);
          const cut = distToC < cWidth ? Math.pow(distToC / cWidth, 0.5) : 1;
          const boxMask = Math.max(0, 1 - Math.pow(Math.max(Math.abs(nx-0.5)*2, Math.abs(ny-0.5)*2), 20));
          h = baseH * cut * boxMask;
          break;
        }
        case LandformType.VOLCANO: {
          const vMask = Math.pow(Math.max(0, 1 - warpedDist * 1.4), 1.6);
          const cSize = 0.13 + distortion * 0.05;
          const crater = warpedDist < cSize ? Math.pow(warpedDist / cSize, 2.8) : 1;
          h = vMask * crater + (h * 0.15 * vMask);
          break;
        }
      }

      const finalHeight = (h * maxHeight) + baseThickness;
      const idx = (i * (segments + 1) + j);
      
      positions[idx * 3] = x;
      positions[idx * 3 + 1] = finalHeight;
      positions[idx * 3 + 2] = z;
      heights[idx] = finalHeight;
    }
  }

  let count = 0;
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + j;
      const b = (i + 1) * (segments + 1) + j;
      const c = (i + 1) * (segments + 1) + (j + 1);
      const d = i * (segments + 1) + (j + 1);

      indices[count++] = a;
      indices[count++] = d;
      indices[count++] = b;

      indices[count++] = b;
      indices[count++] = d;
      indices[count++] = c;
    }
  }

  return { positions, indices, heights };
};
