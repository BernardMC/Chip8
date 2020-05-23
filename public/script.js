let currentOpCode = null;
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

function addToPointer(pointer , value)
{
  if((pointer + value) > 0xFFF)
  {
    pointer = (pointer + value) - 0xFFF - 1;
    return pointer;
  }
  pointer += value;
  return pointer;
}

function subFromProgramCounter(value)
{
  if ((programCounter - value) < 0)
  {
    programCounter = 0xFFF + (programCounter - value);
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
      console.log("BEEEEEP");
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

  for (let i = 0; i < fontArray.length; i++) {
    memory[i] = fontArray[i];
  }

  Vregisters.fill(0);
  stack.fill(0);
  videoDisplay.fill(0);
  //All theses are done by initialization
  // Clear display
  // Clear stack

  // Clear registers V0-VF
  // Clear memory

  // Load fontset
  //for(int i = 0; i < 80; ++i)
  //  memory[i] = chip8_fontset[i];

  // Reset timers
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
              stackPointer = stackPointer -1;
              programCounter = stack[stackPointer];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
          case 0x00e0: //00E0: Clear screen
          {
            videoDisplay.fill(0)
            programCounter = addToPointer(programCounter, 2);
            drawFlag = true;
          }
        }
      }
      break;
    case 0x1000: //1NNN:	Jump to address NNN
      {
        programCounter = (opcode & 0x0fff);
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
        if(Vregisters[VX] != (opcode & 0x00FF))
        {
          programCounter = addToPointer(programCounter, 4);
        } else {
          programCounter = addToPointer(programCounter, 2);
        }
      }
      break;
    case 0x5000: // 5XY0:	Skip the following instruction if the value of register VX is equal to the value of register VY
      {
        if (Vregisters[VX] == Vregisters[VY])
        {
          programCounter = addToPointer(programCounter, 4);
        } else {
          programCounter = addToPointer(programCounter, 2);
        }
      }
      break;
      case 0x6000:  // 6XNN: Store number NN in register VX
      {
        Vregisters[VX] = opcode & 0x00ff;
        programCounter = addToPointer(programCounter, 2);
      }
      break;
      case 0x7000:
      {
        // 7XNN: Add the value NN to register VX
        Vregisters[VX] += (opcode & 0x00ff);
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
              Vregisters[VX] =
                Vregisters[VX] |
                Vregisters[VY];
              programCounter = addToPointer(programCounter, 2);
            }
            break;
            case 0x0002: //8XY2:	Set VX to VX AND VY
            {
              Vregisters[VX] = (Vregisters[VX] & Vregisters[VY]);
              programCounter = addToPointer(programCounter, 2);
            }
            break;
            case 0x0003: //8XY3:	Set VX to VX XOR VY
            {
              Vregisters[VX] = (Vregisters[VX] ^ Vregisters[VY]);
              programCounter = addToPointer(programCounter, 2);
            }
            break;
            case 0x0004:
              {
                if (Vregisters[VY] > 0xff - Vregisters[VX]) 
                {
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
                if (Vregisters[VY] > Vregisters[VX]) 
                {
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
                if (Vregisters[VY] > Vregisters[VX]) 
                {
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
        if (Vregisters[VX] != Vregisters[VY]) 
        {
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
        programCounter = addToPointer(programCounter, ((opcode & 0x0fff) + Vregisters[0]));
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
			let height = opcode & 0x000F;
			let pixel;

			Vregisters[0xF] = 0;
			for (let yline = 0; yline < height; yline++)
			{
				pixel = memory[indexRegister + yline];
				for(let xline = 0; xline < 8; xline++)
				{
					if((pixel & (0x80 >> xline)) != 0)
					{
						if(videoDisplay[(x + xline + ((y + yline) * 64))] == 1)
						{
							Vregisters[0xF] = 1;                                    
						}
						videoDisplay[x + xline + ((y + yline) * 64)] ^= 1;
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
          if(indexRegister + Vregisters[VX] > 0xFFF)	// VF is set to 1 when range overflow (I+VX>0xFFF), and 0 when there isn't.
					{
            	Vregisters[0xF] = 1;
          }else{
            Vregisters[0xF] = 0;
          }
					indexRegister = addToPointer(indexRegister, Vregisters[VX]);
					programCounter = addToPointer(programCounter, 2);
            }
            break;
        }
      }
      break;
    default:
      console.log("Unknown opcode:");//" 0x%X\n", opcode);
  }

  // Update timers
  updateTimers();
  if (drawFlag)
  {
    renderScreen();
    drawFlag = false;
  }
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
  setInterval(() => {
    emulateCycle();
  }, 20);
}

function dowork(blob) {
  
  romCode = new Uint8Array(blob);
  wideRom = new Uint16Array(blob);
  console.log(romCode);
  initialize()
  for (let i = 0; i < romCode.length; i++) {
    memory[i + 0x200] = romCode[i];
  }
  programCounter = 0x200;
}

function runALoop()
{
  emulateCycle();
  console.log(Vregisters);
  console.log(programCounter);
}

let ok = new Uint8ClampedArray(64*32*4);

function renderScreen()
{
  let w = 64;
  let h = 32;
  let ctx = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;
  for (let i = 0; i < 64*32; i++)
  {
    let fill = 0;
    if(videoDisplay[i] == 1)
    {
      fill = 255;
    }
    let red = i * 4;
    let green = ++red;
    let blue = ++green;
    let alpha = ++blue;

    
    ok[red] = fill;
    ok[green] = fill;
    ok[blue] = fill;
    ok[alpha] = 255;
  }

  var image2 = ctx.getImageData(0, 0, w, h);
  image2.data.set(ok);
  ctx.putImageData(image2,0,0);
  let bigger = document.getElementsByTagName("canvas")[1];
  let otherCtx = bigger.getContext("2d");
  otherCtx.drawImage(ctx.canvas, 0, 0,640,320);
}

