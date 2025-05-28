// src/cpu/index.js
export class CPU {
  constructor(memory) {
    this.memory = memory;
    this.regs   = new Uint32Array(16); // R0–R15
    this.cpsr   = 0;                   // status register
  }

  step() {
    // TODO: fetch, decode, execute one ARM/Thumb instruction
    // Example stub:
    // const pc     = this.regs[15];
    // const opcode = this.memory.read32(pc);
    // this.regs[15] += 4;
  }
}
