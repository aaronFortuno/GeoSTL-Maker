
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Center } from '@react-three/drei';
import { MeshData, TerrainParams } from '../types';
import * as THREE from 'three';

interface ViewerProps {
  meshData: MeshData;
  params: TerrainParams;
}

const SolidTerrainMesh: React.FC<ViewerProps> = ({ meshData, params }) => {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const { positions, indices } = meshData;
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    geo.computeVertexNormals();
    return geo;
  }, [meshData]);

  const skirtGeometry = useMemo(() => {
    const { positions } = meshData;
    const res = params.resolution;
    const sidePositions: number[] = [];
    const sideIndices: number[] = [];
    
    const addSide = (idxA: number, idxB: number, reverse: boolean = false) => {
      const start = sidePositions.length / 3;
      sidePositions.push(positions[idxA * 3], positions[idxA * 3 + 1], positions[idxA * 3 + 2]);
      sidePositions.push(positions[idxB * 3], positions[idxB * 3 + 1], positions[idxB * 3 + 2]);
      sidePositions.push(positions[idxA * 3], 0, positions[idxA * 3 + 2]);
      sidePositions.push(positions[idxB * 3], 0, positions[idxB * 3 + 2]);
      
      if (!reverse) {
        sideIndices.push(start, start + 2, start + 1);
        sideIndices.push(start + 1, start + 2, start + 3);
      } else {
        sideIndices.push(start, start + 1, start + 2);
        sideIndices.push(start + 1, start + 3, start + 2);
      }
    };

    for(let i=0; i<res; i++) {
      addSide(i * (res+1), (i+1) * (res+1), true); 
      addSide(i * (res+1) + res, (i+1) * (res+1) + res, false); 
      addSide(i, i+1, false); 
      addSide(res * (res+1) + i, res * (res+1) + (i+1), true); 
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(sidePositions, 3));
    geo.setIndex(sideIndices);
    geo.computeVertexNormals();
    return geo;
  }, [meshData, params.resolution]);

  const bottomGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(params.size, params.size);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, [params.size]);

  return (
    <Center top>
      <group>
        <mesh geometry={geometry}>
          <meshStandardMaterial color="#3b82f6" roughness={0.6} metalness={0.1} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={skirtGeometry}>
          <meshStandardMaterial color="#1d4ed8" roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={bottomGeometry} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1e293b" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Center>
  );
};

const Viewer: React.FC<ViewerProps> = ({ meshData, params }) => {
  return (
    <div className="w-full h-full bg-slate-50 relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[params.size * 1.2, params.size, params.size * 1.2]} fov={45} />
        <OrbitControls makeDefault minDistance={10} maxDistance={params.size * 5} />
        
        <ambientLight intensity={0.7} />
        <directionalLight position={[100, 150, 50]} intensity={1.2} castShadow />
        <pointLight position={[-params.size, params.size, -params.size]} intensity={0.5} />
        
        <SolidTerrainMesh meshData={meshData} params={params} />
        
        <Grid 
          infiniteGrid 
          fadeDistance={500} 
          sectionColor="#94a3b8" 
          cellColor="#cbd5e1" 
          cellSize={10} 
          sectionSize={50}
        />
        <Environment preset="park" />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-600 border border-slate-200 shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          VISOR 3D ACTIU
        </div>
      </div>
    </div>
  );
};

export default Viewer;
