// src/ppu/index.js
export class PPU {
  constructor(memory, ctx) {
    this.memory    = memory;
    this.ctx       = ctx;
    this.imageData = ctx.createImageData(240, 160);
  }

  render() {
    const data = this.imageData.data;
    const base = 0x06000000; // Mode 3 framebuffer start

    for (let y = 0; y < 160; y++) {
      for (let x = 0; x < 240; x++) {
        const addr  = base + 2 * (y * 240 + x);
        const pix16 = this.memory.read16(addr);

        // extract 5-bit channels
        const r5 =  pix16        & 0x1F;
        const g5 = (pix16 >>>  5) & 0x1F;
        const b5 = (pix16 >>> 10) & 0x1F;

        // expand to 8-bit
        const r8 = (r5 << 3) | (r5 >>> 2);
        const g8 = (g5 << 3) | (g5 >>> 2);
        const b8 = (b5 << 3) | (b5 >>> 2);

        const i = (y * 240 + x) * 4;
        data[i]   = r8;
        data[i+1] = g8;
        data[i+2] = b8;
        data[i+3] = 255;
      }
    }

    this.ctx.putImageData(this.imageData, 0, 0);
  }
}
