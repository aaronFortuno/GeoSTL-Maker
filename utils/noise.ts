
// A simple procedural noise helper to avoid external dependencies for basic terrain
export class SimpleNoise {
  private p: number[] = new Array(512);
  constructor(seed: number = Math.random()) {
    const permutation = new Array(256).fill(0).map((_, i) => i);
    
    // Use a simple deterministic shuffle based on the seed
    let s = seed;
    const lcg = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    // Shuffle the permutation table
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(lcg() * (i + 1));
      [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }

    for (let i = 0; i < 512; i++) {
      this.p[i] = permutation[i & 255];
    }
  }

  private fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
  private lerp(t: number, a: number, b: number) { return a + t * (b - a); }
  private grad(hash: number, x: number, y: number, z: number) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = this.fade(x);
    const v = this.fade(y);
    const A = this.p[X] + Y, AA = this.p[A], AB = this.p[A + 1];
    const B = this.p[X + 1] + Y, BA = this.p[B], BB = this.p[B + 1];

    return this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, 0),
                                     this.grad(this.p[BA], x - 1, y, 0)),
                        this.lerp(u, this.grad(this.p[AB], x, y - 1, 0),
                                     this.grad(this.p[BB], x - 1, y - 1, 0)));
  }
}
