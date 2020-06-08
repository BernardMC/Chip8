let currentOpCode = null;
let timerId = null;
//Base 64 audio from : https://stackoverflow.com/questions/35497243/how-to-make-a-short-beep-in-javascript-that-can-be-called-repeatedly-on-a-page
const sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="); 
let fontArray = new Uint8Array([
  0xf0,
  0x90,
  0x90,
  0x90,
  0xf0, // 0
  0x20,
  0x60,
  0x20,
  0x20,
  0x70, // 1
  0xf0,
  0x10,
  0xf0,
  0x80,
  0xf0, // 2
  0xf0,
  0x10,
  0xf0,
  0x10,
  0xf0, // 3
  0x90,
  0x90,
  0xf0,
  0x10,
  0x10, // 4
  0xf0,
  0x80,
  0xf0,
  0x10,
  0xf0, // 5
  0xf0,
  0x80,
  0xf0,
  0x90,
  0xf0, // 6
  0xf0,
  0x10,
  0x20,
  0x40,
  0x40, // 7
  0xf0,
  0x90,
  0xf0,
  0x90,
  0xf0, // 8
  0xf0,
  0x90,
  0xf0,
  0x10,
  0xf0, // 9
  0xf0,
  0x90,
  0xf0,
  0x90,
  0x90, // A
  0xe0,
  0x90,
  0xe0,
  0x90,
  0xe0, // B
  0xf0,
  0x80,
  0x80,
  0x80,
  0xf0, // C
  0xe0,
  0x90,
  0x90,
  0x90,
  0xe0, // D
  0xf0,
  0x80,
  0xf0,
  0x80,
  0xf0, // E
  0xf0,
  0x80,
  0xf0,
  0x80,
  0x80 // F
]);
let memory = new Uint8Array(4096);
let Vregisters = new Uint8Array(16);
let indexRegister = 0;
let programCounter = 0;
let videoDisplay = new Uint8Array(64 * 32);
let delayTimer = 0;
let soundTimer = 0;
let stack = new Uint16Array(16);
let stackPointer = 0;
let keyStatus = new Uint8Array(16);
let romCode = null;
let wideRom = null;
let parsableRom = null;
let drawFlag = false;
let lastTimeCalled = null;
const time = new Date();
let keysPressed = {
  "1": false,
  "2": false,
  "3": false,
  "4": false,
  q: false,
  w: false,
  e: false,
  r: false,
  a: false,
  s: false,
  d: false,
  f: false,
  z: false,
  x: false,
  c: false,
  v: false
};

let keyMap = {
  0x1: "1",
  0x2: "2",
  0x3: "3",
  0xc: "4",
  0x4: "q",
  0x5: "w",
  0x6: "e",
  0xd: "r",
  0x7: "a",
  0x8: "s",
  0x9: "d",
  0xe: "f",
  0xa: "z",
  0x0: "x",
  0xb: "c",
  0xf: "v"
};

function addToPointer(pointer, value) {
  if (pointer + value > 0xfff) {
    pointer = pointer + value - 0xfff - 1;
    return pointer;
  }
  pointer += value;
  return pointer;
}

function subFromProgramCounter(value) {
  if (programCounter - value < 0) {
    programCounter = 0xfff + (programCounter - value);
    return;
  }
  programCounter -= value;
}

async function getRom() {
  const response = await fetch(
    "https://cdn.glitch.com/1749964c-1292-4b7b-9396-0fb906858f51%2FChip8%20emulator%20Logo%20%5BGarstyciuks%5D.ch8"
  );
  const blob = await response.blob();
  return await new Response(blob).arrayBuffer();
}

async function loadRom(url){
  const response = await fetch(url);
  const blob = await response.blob();
  return await new Response(blob).arrayBuffer();
}

function checkIsKeyPresses(key) {
  return keysPressed[keyMap[key]];
}

function fetchOpcode() {
  let opcode = (memory[programCounter] << 8) | memory[programCounter + 1];
  return opcode;
}

function waitForKeycode() {
  //I will wait here somehow
}

function decodeOpcode() {}

function executeOpcode() {
  programCounter = addToPointer(programCounter, 2);
}

function updateTimers() {
  if (delayTimer > 0) {
    delayTimer--;
  }

  if (soundTimer > 0) {
    if (soundTimer == 1) {
      sound.play();
    }
    soundTimer--;
  }
}

function initialize() {
  programCounter = 0x200; // Program counter starts at 0x200
  opcode = 0; // Reset current opcode
  indexRegister = 0; // Reset index register
  stackPointer = 0; // Reset stack pointer
  memory.fill(0);
  for (const key in keysPressed)
    {
      keysPressed[key] = false;
    }

  for (let i = 0; i < fontArray.length; i++) {
    memory[i] = fontArray[i];
  }

  Vregisters.fill(0);
  stack.fill(0);
  videoDisplay.fill(0);
  if (timerId)
    {
      clearInterval(timerId);
    }
  timerId = setInterval(() => {
    updateTimers()
  },
  16);
}

function emulateCycle() {
  // Fetch opcode
  let opcode = fetchOpcode();
  let VX = (opcode & 0x0f00) >> 8;
  let VY = (opcode & 0x00f0) >> 4;
  // Decode opcode
  switch (opcode & 0xf000) {
    // Some opcodes //
    case 0x0000:
      {
        switch (opcode & 0x00ff) {
          case 0x00ee: //00EE:	Return from a subroutine
            {
              stackPointer = stackPointer - 1;
              programCounter = stack[stackPointer];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x00e0: {
            //00E0: Clear screen
            videoDisplay.fill(0);
            programCounter = addToPointer(programCounter, 2);
            drawFlag = true;
          }
        }
      }
      break;
    case 0x1000: //1NNN:	Jump to address NNN
      {
        programCounter = opcode & 0x0fff;
      }
      break;
    case 0x2000: //2NNN:	Execute subroutine starting at address NNN
      {
        stack[stackPointer] = programCounter;
        stackPointer++;
        programCounter = opcode & 0x0fff;
      }
      break;
    case 0x3000: //3XNN:	Skip the following instruction if the value of register VX equals NN
      {
        if (Vregisters[VX] == (opcode & 0x00ff)) {
          programCounter = addToPointer(programCounter, 4);
        } else {
          programCounter = addToPointer(programCounter, 2);
        }
      }
      break;
    case 0x4000: // 4XNN:	Skip the following instruction if the value of register VX is not equal to NN
      {
        if (Vregisters[VX] != (opcode & 0x00ff)) {
          programCounter = addToPointer(programCounter, 4);
        } else {
          programCounter = addToPointer(programCounter, 2);
        }
      }
      break;
    case 0x5000: // 5XY0:	Skip the following instruction if the value of register VX is equal to the value of register VY
      {
        if (Vregisters[VX] == Vregisters[VY]) {
          programCounter = addToPointer(programCounter, 4);
        } else {
          programCounter = addToPointer(programCounter, 2);
        }
      }
      break;
    case 0x6000: // 6XNN: Store number NN in register VX
      {
        Vregisters[VX] = opcode & 0x00ff;
        programCounter = addToPointer(programCounter, 2);
      }
      break;
    case 0x7000:
      {
        // 7XNN: Add the value NN to register VX
        Vregisters[VX] += opcode & 0x00ff;
        programCounter = addToPointer(programCounter, 2);
      }
      break;
    case 0x8000: // registry ops
      {
        switch (opcode & 0x000f) {
          case 0x0000:
            {
              Vregisters[VX] = Vregisters[VY];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0001: //8XY1:	Set VX to VX OR VY
            {
              Vregisters[VX] = Vregisters[VX] | Vregisters[VY];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0002: //8XY2:	Set VX to VX AND VY
            {
              Vregisters[VX] = Vregisters[VX] & Vregisters[VY];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0003: //8XY3:	Set VX to VX XOR VY
            {
              Vregisters[VX] = Vregisters[VX] ^ Vregisters[VY];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0004:
            {
              if (Vregisters[VY] > 0xff - Vregisters[VX]) {
                Vregisters[0xf] = 1; //carry
              } else {
                Vregisters[0xf] = 0;
              }
              Vregisters[VX] += Vregisters[VY];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0005: //8XY5	Subtract the value of register VY from register VX
            {
              if (Vregisters[VY] > Vregisters[VX]) {
                Vregisters[0xf] = 0; //borrow
              } else {
                Vregisters[0xf] = 1;
              }
              Vregisters[VX] = Vregisters[VX] - Vregisters[VY];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0006: //8XY6:    Store the value of register VY shifted right one bit in register VX
            {
              Vregisters[0xf] = Vregisters[VY] & 1;
              Vregisters[VX] = Vregisters[VY] >> 1;
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0007: //8XY7: Set register VX to the value of VY minus VX
            {
              if (Vregisters[VY] > Vregisters[VX]) {
                Vregisters[0xf] = 1; //borrow
              } else {
                Vregisters[0xf] = 0;
              }
              Vregisters[VX] = Vregisters[VY] - Vregisters[VX];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x000e: // 8XYE:	Store the value of register VY shifted left one bit in register VX
            {
              Vregisters[0xf] = Vregisters[VY] >> 7;
              Vregisters[VX] = Vregisters[VY] << 1;
              programCounter = addToPointer(programCounter, 2);
            }
            break;
        }
      }
      break;
    case 0x9000: // 9XY0:	Skip the following instruction if the value of register VX is not equal to the value of register VY
      {
        if (Vregisters[VX] != Vregisters[VY]) {
          programCounter = addToPointer(programCounter, 4);
        } else {
          programCounter = addToPointer(programCounter, 2);
        }
      }
      break;
    case 0xa000: {
      // ANNN: Sets I to the address NNN
      // Execute opcode
      indexRegister = opcode & 0x0fff;
      programCounter = addToPointer(programCounter, 2);
      break;
    }
    case 0xb000: // BNNN:	Jump to address NNN + V0
      {
        programCounter = 0;
        programCounter = addToPointer(
          programCounter,
          (opcode & 0x0fff) + Vregisters[0]
        );
      }
      break;
    case 0xc000: // CXNN:	Set VX to a random number with a mask of NN
      {
        Vregisters[VX] = Math.floor(Math.random() * 0xff) & (opcode & 0x00ff);
        programCounter = addToPointer(programCounter, 2);
      }
      break;
    case 0xd000:
      //DXYN	Draw a sprite at position VX, VY with N bytes of sprite data starting at the address stored in I
      //Set VF to 01 if any set pixels are changed to unset, and 00 otherwise
      {
        let x = Vregisters[VX];
        let y = Vregisters[VY];
        let height = opcode & 0x000f;
        let pixel;

        Vregisters[0xf] = 0;
        for (let yline = 0; yline < height; yline++) {
          pixel = memory[indexRegister + yline];
          for (let xline = 0; xline < 8; xline++) {
            if ((pixel & (0x80 >> xline)) != 0) {
              if (videoDisplay[x + xline + (y + yline) * 64] == 1) {
                Vregisters[0xf] = 1;
              }
              videoDisplay[x + xline + (y + yline) * 64] ^= 1;
            }
          }
        }

        drawFlag = true;
        programCounter = addToPointer(programCounter, 2);
      }
      break;
    case 0xe000:
      {
        switch (opcode & 0x00ff) {
          case 0x009e: // EX9E:	Skip the following instruction if the key corresponding to the hex value currently stored in register VX is pressed
            {
              if (checkIsKeyPresses(Vregisters[VX])) {
                programCounter = addToPointer(programCounter, 4);
              } else {
                programCounter = addToPointer(programCounter, 2);
              }
            }
            break;
          case 0x00a1: // EXA1	Skip the following instruction if the key corresponding to the hex value currently stored in register VX is not pressed
            {
              if (!checkIsKeyPresses(Vregisters[VX])) {
                programCounter = addToPointer(programCounter, 4);
              } else {
                programCounter = addToPointer(programCounter, 2);
              }
            }
            break;
        }
      }
      break;
    case 0xf000:
      {
        switch (opcode & 0x00ff) {
          case 0x0007:
            {
              Vregisters[VX] = delayTimer;
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x000a:
            {
              waitForKeycode();
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0018:
            {
              soundTimer = Vregisters[VX];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0029: // FX29:   Set I to the memory address of the sprite data corresponding to the hexadecimal digit stored in register VX
            {
              let numWanted = Vregisters[VX];
              indexRegister = numWanted * 0x5;
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0033:
            {
              memory[indexRegister] = Vregisters[VX] / 100;
              memory[indexRegister + 1] = (Vregisters[VX] / 10) % 10;
              memory[indexRegister + 2] = (Vregisters[VX] % 100) % 10;
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0055: //I is set to I + X + 1 after operation //FX55:	Store the values of registers V0 to VX inclusive in memory starting at address I
            {
              let endPoint = VX;
              for (let i = 0; i <= endPoint; i++) {
                memory[indexRegister + i] = Vregisters[i];
              }
              indexRegister = addToPointer(indexRegister, endPoint + 1);
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0065: //FX65: Fill registers V0 to VX inclusive with the values stored in memory starting at address I
            //I is set to I + X + 1 after operation
            {
              let endPoint = VX;
              for (let i = 0; i <= endPoint; i++) {
                Vregisters[i] = memory[indexRegister + i];
              }
              indexRegister += endPoint + 1;
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x0015:
            {
              delayTimer = Vregisters[VX];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x001e: // FX1E:	Add the value stored in register VX to register I
            {
              if (indexRegister + Vregisters[VX] > 0xfff) {
                // VF is set to 1 when range overflow (I+VX>0xFFF), and 0 when there isn't.
                Vregisters[0xf] = 1;
              } else {
                Vregisters[0xf] = 0;
              }
              indexRegister = addToPointer(indexRegister, Vregisters[VX]);
              programCounter = addToPointer(programCounter, 2);
            }
            break;
        }
      }
      break;
    default:
      console.log("Unknown opcode:"); //" 0x%X\n", opcode);
  }

  // Update timers
  //updateTimers();
}

function drawGraphics() {}

function setupGraphics() {}

function setupControls() {}

function main() {
  getRom().then(blob => {
    dowork(blob);
  });

  document.addEventListener(
    "keydown",
    event => {
      const keyName = event.key;
      if (keyName in keysPressed) {
        keysPressed[keyName] = true;
      }
    },
    false
  );

  document.addEventListener(
    "keyup",
    event => {
      const keyName = event.key;
      if (keyName in keysPressed) {
        keysPressed[keyName] = false;
      }
    },
    false
  );
  initialize();
  setTimeout(() => {
    runALoop();
  }, 1);
}

function dowork(blob) {
  romCode = new Uint8Array(blob);
  wideRom = new Uint16Array(blob);
  console.log(romCode);
  initialize();
  for (let i = 0; i < romCode.length; i++) {
    memory[i + 0x200] = romCode[i];
  }
  programCounter = 0x200;
}

function runALoop() {
  let timeCalled = Date.now();
  if (lastTimeCalled)
  {
    let numCycles = timeCalled - lastTimeCalled;
    for (let i = 0; i < numCycles; i++)
    {
      emulateCycle();
    }
  }else{
    emulateCycle();
  }
  
  lastTimeCalled = timeCalled;
  if (drawFlag)
  {
    drawFlag = false;
    renderScreen();
  }
  setTimeout(() =>{
    runALoop()
  }, 1);
}

let ok = new Uint8ClampedArray(64 * 32 * 4);
let displayData = new Uint8ClampedArray(640 * 320 * 4);
let bright = new Uint8ClampedArray(40);
bright.fill(255);
let dark = new Uint8ClampedArray(40);
let black = new Uint8ClampedArray([0, 0, 0, 255]);
for (let p = 0; p < dark.length; p += 4) {
  dark.set(black, p);
}
displayData.fill(0);
let lineLength = 640 * 4;

function renderScreen() {
  let w = 64;
  let h = 32;
  let bigindex = 0;
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 64; x++) {
      let i = (64*y) + x;
      let fill = dark;
      if (videoDisplay[i] == 1) {
        fill = bright;
      }
      displayData.set(fill, bigindex);
      bigindex += 40;
    }
    let previousData = displayData.slice(bigindex - lineLength, bigindex)
    for (let m = 0; m < 9; m++)
      {
        displayData.set(previousData, bigindex)
        bigindex = bigindex + lineLength;
      }
  }

  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let imageData = ctx.getImageData(0, 0, 640, 320);
  imageData.data.set(displayData);
  ctx.putImageData(imageData, 0, 0);
}

function keypadClick(pressed)
{
  const keyName = pressed;
      if (keyName in keysPressed) {
        keysPressed[keyName] = true;
      }
      console.log(keysPressed[keyName])
}

function keypadReleased(released)
{
  const keyName = released;
      if (keyName in keysPressed) {
        keysPressed[keyName] = false;
      }
      console.log(keysPressed[keyName])
}