// src/memory/index.js
export class MemoryBus {
  constructor() {
    // 16 MB main RAM, plus 96 KB VRAM
    this.ram  = new Uint8Array(0x1000000);
    this.vram = new Uint8Array(0x18000);
    this.rom  = null;
  }

  loadROM(buffer) {
    this.rom = new Uint8Array(buffer);
  }

  read8(addr) {
    addr = addr >>> 0;

    // 0x06000000–0x06017FFF : VRAM
    if (addr >= 0x06000000 && addr < 0x06000000 + this.vram.length) {
      return this.vram[addr - 0x06000000];
    }

    // 0x08000000–… : Cartridge ROM
    if (this.rom
        && addr >= 0x08000000
        && addr < 0x08000000 + this.rom.length) {
      return this.rom[addr - 0x08000000];
    }

    // Default: main RAM
    return this.ram[addr & 0xFFFFFF];
  }

  write8(addr, value) {
    addr = addr >>> 0;

    // VRAM writes
    if (addr >= 0x06000000 && addr < 0x06000000 + this.vram.length) {
      this.vram[addr - 0x06000000] = value & 0xFF;
      return;
    }

    // ignore writes to ROM
    if (addr >= 0x08000000 && this.rom) {
      console.warn(`Attempt to write ROM @ ${addr.toString(16)}`);
      return;
    }

    // main RAM writes
    this.ram[addr & 0xFFFFFF] = value & 0xFF;
  }

  read16(addr) {
    return this.read8(addr) | (this.read8(addr + 1) << 8);
  }

  read32(addr) {
    return this.read16(addr) | (this.read16(addr + 2) << 16);
  }
}
