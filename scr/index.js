import { CPU }       from './cpu/index.js';
import { MemoryBus } from './memory/index.js';
import { PPU }       from './ppu/index.js';

const canvas   = document.getElementById('screen');
const ctx      = canvas.getContext('2d');
const romInput = document.getElementById('romInput');

const memory = new MemoryBus();
const cpu    = new CPU(memory);
const ppu    = new PPU(memory, ctx);

function frame() {
  cpu.step();    // run one instruction
  ppu.render();  // draw a fresh frame
  requestAnimationFrame(frame);
}

romInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    memory.loadROM(reader.result);
    cpu.regs[15] = 0x08000000;  // start at reset vector
    console.log('ROM loaded, starting at 0x08000000');
    requestAnimationFrame(frame);
  };
  reader.readAsArrayBuffer(file);
});
