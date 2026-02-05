
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { LandformType, TerrainParams, MeshData } from './types';
import { generateTerrain } from './utils/terrainGenerator';
import { exportToSTL, downloadFile } from './utils/stlExporter';
import Viewer from './components/Viewer';

const App: React.FC = () => {
  const [params, setParams] = useState<TerrainParams>({
    type: LandformType.ISLAND,
    size: 100,
    maxHeight: 25,
    resolution: 64,
    noiseScale: 4.0,
    roughness: 0.5,
    distortion: 0.4,
    seed: Math.floor(Math.random() * 100000),
    baseThickness: 3.0,
  });

  const [meshData, setMeshData] = useState<MeshData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const generateTimer = useRef<number | null>(null);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    if (generateTimer.current) window.clearTimeout(generateTimer.current);
    
    generateTimer.current = window.setTimeout(() => {
      const data = generateTerrain(params);
      setMeshData(data);
      setIsGenerating(false);
    }, 20);
  }, [params]);

  const handleRandomSeed = () => {
    setParams({ ...params, seed: Math.floor(Math.random() * 100000) });
  };

  const handleDownload = () => {
    if (!meshData) return;
    const stlString = exportToSTL(meshData, params);
    const fileName = `GeoSTL_${params.type.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_s${params.seed}.stl`;
    downloadFile(stlString, fileName);
  };

  useEffect(() => {
    handleGenerate();
  }, [params, handleGenerate]);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-50">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 p-6 overflow-y-auto flex flex-col shadow-xl z-20">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M8 3.935A9 9 0 1116.065 19.065M8 3.935a8.963 8.963 0 018.13-1.13" />
              </svg>
            </div>
            GeoSTL Maker
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Disseny de Relleus 3D</p>
        </div>

        <div className="space-y-5 flex-1 pr-2">
          {/* Landform Selection */}
          <section>
            <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-wider">Accident Geogràfic</label>
            <div className="relative">
              <select 
                className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                value={params.type}
                onChange={(e) => setParams({ ...params, type: e.target.value as LandformType })}
              >
                {Object.values(LandformType).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </section>

          {/* Seed Control */}
          <section>
            <label className="block text-xs font-black text-slate-500 uppercase mb-2 tracking-wider">Codi de Generació (Seed)</label>
            <div className="flex gap-2">
              <input 
                type="number"
                className="flex-1 p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={params.seed}
                onChange={(e) => setParams({ ...params, seed: parseInt(e.target.value) || 0 })}
              />
              <button 
                onClick={handleRandomSeed}
                className="p-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-colors shadow-sm"
                title="Aleatori"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>
          </section>

          {/* Parameters Sliders */}
          <section className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <div className="flex justify-between text-[10px] font-black mb-1.5 text-slate-400 uppercase tracking-tighter">
                <label>Mida Base ({params.size}mm)</label>
              </div>
              <input type="range" min="20" max="250" step="5" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" value={params.size} onChange={(e) => setParams({ ...params, size: parseInt(e.target.value) })} />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-black mb-1.5 text-slate-400 uppercase tracking-tighter">
                <label>Altura Màxima ({params.maxHeight}mm)</label>
              </div>
              <input type="range" min="5" max="100" step="1" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" value={params.maxHeight} onChange={(e) => setParams({ ...params, maxHeight: parseInt(e.target.value) })} />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-black mb-1.5 text-slate-400 uppercase tracking-tighter">
                <label>Distorsió / Sinuositat ({Math.round(params.distortion * 100)}%)</label>
              </div>
              <input type="range" min="0" max="1" step="0.01" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" value={params.distortion} onChange={(e) => setParams({ ...params, distortion: parseFloat(e.target.value) })} />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-black mb-1.5 text-slate-400 uppercase tracking-tighter">
                <label>Complexitat Detall ({Math.round(params.roughness * 100)}%)</label>
              </div>
              <input type="range" min="0.1" max="0.8" step="0.05" className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" value={params.roughness} onChange={(e) => setParams({ ...params, roughness: parseFloat(e.target.value) })} />
            </div>
          </section>

          <section className="pt-2 border-t border-slate-100">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Resolució de la malla</label>
            <div className="grid grid-cols-4 gap-2">
              {[32, 64, 96, 128].map(res => (
                <button 
                  key={res} 
                  onClick={() => setParams({...params, resolution: res})}
                  className={`text-[10px] font-black py-2 rounded-lg border transition-all ${params.resolution === res ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                >
                  {res}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <button 
            onClick={handleDownload}
            disabled={!meshData || isGenerating}
            className={`w-full py-4 px-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
              !meshData || isGenerating ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descarregar STL
          </button>
          
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[10px] text-slate-500 font-bold leading-tight">
              Llicència: <span className="text-slate-900">GNU GPL</span>
            </p>
            <p className="text-[10px] text-slate-500 font-bold leading-tight">
              Autoria: <span className="text-slate-900">Aarón Fortuño (afortun8@xtec.cat) amb Gemini AI</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Preview */}
      <main className="flex-1 relative flex items-center justify-center overflow-hidden bg-slate-100/50">
        {meshData ? (
          <Viewer meshData={meshData} params={params} />
        ) : (
          <div className="flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-400 font-black animate-pulse uppercase tracking-[0.2em] text-[10px]">Calculant Geometria...</p>
          </div>
        )}
        
        {isGenerating && (
          <div className="absolute top-6 right-6 z-30 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Recalculant...</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
