/* global chip8, expect, spyOn */

(function () {
    'use strict';

    function testCycle(params) {
        //Why isnt this getting reset!
        //programCounter = 0x200;
        var spy,
            scope = {
                oldPc: programCounter,
                oldSp: stackPointer
            };

        memory[programCounter] = (params.opCode & 0xFF00) >> 8;
        memory[programCounter + 1] = params.opCode & 0x00FF;
        //cpu.mem[programCounter] = (params.opCode & 0xFF00) >> 8;
        //cpu.mem[programCounter + 1] = params.opCode & 0x00FF;

        if (typeof params.preFn === 'function') {
            params.preFn.call(scope);
        }

        //if (typeof params.op !== 'undefined') {
        //    if (typeof indexRegisterS[params.op].calls === 'undefined') {
        //        spyOn(indexRegisterS, params.op).and.callThrough();
        //    }
       // }

        //cpu.step();
        //cpu.updateTimers();
        emulateCycle()

        if (typeof params.postFn === 'function') {
            params.postFn.call(scope);
        }

        /*if (typeof params.op !== 'undefined') {
            if (typeof params.args !== 'undefined') {
                expect(indexRegisterS[params.op]).toHaveBeenCalledWith.apply(expect(indexRegisterS[params.op]), params.args);
            } else {
                expect(indexRegisterS[params.op]).toHaveBeenCalled();
            }
        }
        */
    }

    window.helpers = {
        /*test_LD_Vx_Vy: function (params) {
            testCycle({
                opCode: 0x8000 | (params.x << 8) | (params.y << 4),
                op: 'LD_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(Vregisters[params.y]);
                    expect(Vregisters[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_SYS: function (cpu) {
            testCycle({
                opCode: 0x0666,
                op: 'SYS',
                args: [ ],
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },
        */
        test_CLS: function (cpu) {
            //spyOn(cpu.screen, 'repaint');
            //spyOn(cpu.screen, 'clear');

            testCycle({
                opCode: 0x00E0,
                op: 'CLS',
                args: [ ],
                postFn: function () {
                    let empty = new Uint8Array(64*32);
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(videoDisplay).toEqual(empty);
                }
            });
        },

        test_OR_Vx_Vy: function (params) {
            testCycle({
                opCode: 0x8001 | (params.x << 8) | (params.y << 4),
                op: 'OR_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.result);
                    expect(Vregisters[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_AND_Vx_Vy: function (params) {
            testCycle({
                opCode: 0x8002 | (params.x << 8) | (params.y << 4),
                op: 'AND_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.result);
                    expect(Vregisters[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_XOR_Vx_Vy: function (params) {
            testCycle({
                opCode: 0x8003 | (params.x << 8) | (params.y << 4),
                op: 'XOR_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.result);
                    expect(Vregisters[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_ADD_Vx_Vy: function (params) {
            testCycle({
                opCode: 0x8004 | (params.x << 8) | (params.y << 4),
                op: 'ADD_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.result);
                    expect(Vregisters[params.y]).toEqual(params.yVal);
                    expect(Vregisters[0xF]).toEqual(params.carry);
                }
            });
        },

        test_SUB_Vx_Vy: function (params) {
            testCycle({
                opCode: 0x8005 | (params.x << 8) | (params.y << 4),
                op: 'SUB_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.result);
                    expect(Vregisters[params.y]).toEqual(params.yVal);
                    expect(Vregisters[0xF]).toEqual(params.noBorrow);
                }
            });
        },

     test_SUBN_Vx_Vy: function (params) {
            testCycle({
                opCode: 0x8007 | (params.x << 8) | (params.y << 4),
                op: 'SUBN_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.result);
                    expect(Vregisters[params.y]).toEqual(params.yVal);
                    expect(Vregisters[0xF]).toEqual(params.noBorrow);
                }
            });
        },

        test_SHR_Vx_Vy: function (params) {
            testCycle({
                opCode: 0x8006 | (params.x << 8) | (params.y << 4),
                op: 'SHR_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.expX);
                    expect(Vregisters[params.y]).toEqual(params.expY);
                    expect(Vregisters[0xF]).toEqual(params.regF);
                }
            });
        },

        test_SHL_Vx_Vy: function (params) {
            testCycle({
                opCode: 0x800E | (params.x << 8) | (params.y << 4),
                op: 'SHL_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.y] = params.yVal;
                    Vregisters[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.expX);
                    expect(Vregisters[params.y]).toEqual(params.expY);
                    expect(Vregisters[0xF]).toEqual(params.regF);
                }
            });
        },
        

        test_SNE_Vx_Vy: function (params) {
            testCycle({
               opCode: 0x9000 | (params.x << 8) | (params.y << 4),
                op: 'SNE_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + params.pcOffset) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.xVal);
                    expect(Vregisters[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_SNE_Vx_kk: function (params) {
            testCycle({
                opCode: 0x4000 | (params.x << 8) | (params.byte),
                op: 'SNE_Vx_kk',
                args: [ params.x, params.byte ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + params.pcOffset) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.xVal);
                }
            });
        },

        test_SE_Vx_Vy: function (params) {
            testCycle({
                opCode: 0x5000 | (params.x << 8) | (params.y << 4),
                op: 'SE_Vx_Vy',
                args: [ params.x, params.y ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + params.pcOffset) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.xVal);
                    expect(Vregisters[params.y]).toEqual(params.yVal);
                }
            });
        },

        test_SE_Vx_kk: function (params) {
            testCycle({
                opCode: 0x3000 | (params.x << 8) | (params.byte),
                op: 'SE_Vx_kk',
                args: [ params.x, params.byte ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + params.pcOffset) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.xVal);
                }
            });
        },

        test_ADD_Vx_kk: function (params) {
            testCycle({
                opCode: 0x7000 | (params.x << 8) | params.byte,
                op: 'ADD_Vx_kk',
                args: [ params.x, params.byte ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.result);
                }
            });
        },

        test_LD_Vx_kk: function (params) {
            testCycle({
                opCode: 0x6000 | (params.x << 8) | params.byte,
                op: 'LD_Vx_kk',
                args: [ params.x, params.byte ],
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.byte);
                }
            });
        },

        test_JP_nnn: function (params) {
            testCycle({
                opCode: 0x1000 | params.addr,
                op: 'JP_nnn',
                args: [ params.addr ],
                postFn: function () {
                    expect(programCounter).toEqual(params.addr);
                }
            });
        },

        test_CALL_nnn: function (params) {
            testCycle({
                opCode: 0x2000 | params.addr,
                op: 'CALL_nnn',
                args: [ params.addr ],
                postFn: function () {
                    expect(programCounter).toEqual(params.addr);
                    expect(stack[this.oldSp]).toEqual(this.oldPc);
                    expect(stackPointer).toEqual((this.oldSp + 1) & 0xF);
                }
            });
        },

        test_RET: function (params) {
            testCycle({
                opCode: 0x00EE,
                op: 'RET',
                args: [ ],
                preFn: function () {
                    for (var i = 0; i < params.stack.length; ++i) {
                        stack[i] = params.stack[i];
                    }
                    stackPointer = params.sp;
                },
                postFn: function () {
                    expect(programCounter).toEqual(params.expectedPc);
                    expect(stackPointer).toEqual((params.sp - 1) & 0xF);
                }
            });
        },

        test_LD_I_nnn: function (params) {
            testCycle({
                opCode: 0xA000 | params.val,
                op: 'LD_I_nnn',
                args: [ params.val ],
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(indexRegister).toEqual(params.val);
                }
            });
        },

        test_JP_V0_nnn: function (params) {
            testCycle({
                opCode: 0xB000 | params.addr,
                op: 'JP_V0_nnn',
                args: [ params.addr ],
                preFn: function () {
                    Vregisters[0] = params.v0;
                },
                postFn: function () {
                    expect(programCounter).toEqual(params.expectedPc);
                    expect(Vregisters[0]).toEqual(params.v0);
                }
            });
        },

        test_RND_Vx_kk: function (params) {
            testCycle({
                opCode: 0xC000 | (params.x << 8) | 1,
                op: 'RND_Vx_kk',
                args: [ params.x, 1 ],
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect([0, 1]).toContain(Vregisters[params.x]);
                }
            });
        },

        test_LD_Vx_DT: function (params) {
            testCycle({
                opCode: 0xF007 | (params.x << 8),
                op: 'LD_Vx_DT',
                args: [ params.x ],
                preFn: function () {
                    delayTimer = params.dt;
                },
                postFn: function () {
                    expect(Vregisters[params.x]).toEqual(params.dt);
                    expect(delayTimer).toEqual((params.dt - 1) & 0xFF);
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_LD_DT_Vx: function (params) {
            testCycle({
                opCode: 0xF015 | (params.x << 8),
                op: 'LD_DT_Vx',
                args: [ params.x ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(Vregisters[params.x]).toEqual(params.xVal);
                    expect(delayTimer).toEqual((params.xVal - 1) & 0xFF);
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_LD_ST_Vx: function (params) {
            testCycle({
                opCode: 0xF018 | (params.x << 8),
                op: 'LD_ST_Vx',
                args: [ params.x ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(Vregisters[params.x]).toEqual(params.xVal);
                    expect(soundTimer).toEqual((params.xVal - 1) & 0xFF);
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_ADD_I_Vx: function (params) {
            testCycle({
                opCode: 0xF01E | (params.x << 8),
                op: 'ADD_I_Vx',
                args: [ params.x ],
                preFn: function () {
                    indexRegister = params.iVal;
                    Vregisters[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(indexRegister).toEqual(params.result);
                    expect(Vregisters[params.x]).toEqual(params.xVal);
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        test_LD_I_Vx: function (params) {
            testCycle({
                opCode: 0xF055 | (params.x << 8),
                op: 'LD_I_Vx',
                args: [ params.x ],
                preFn: function () {
                    indexRegister = params.iVal;
                    for (var i = 0; i <= params.regs.length; ++i) {
                        Vregisters[i] = params.regs[i];
                    }
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(indexRegister).toEqual(params.expectedIVal);
                    for (var i = 0; i <= params.x; ++i) {
                        expect(memory[params.iVal + i]).toEqual(Vregisters[i]);
                    }
                }
            });
        },

        test_LD_Vx_I: function (params) {
            testCycle({
                opCode: 0xF065 | (params.x << 8),
                op: 'LD_Vx_I',
                args: [ params.x ],
                preFn: function () {
                    indexRegister = params.iVal;
                    for (var i = 0; i <= params.mem.length; ++i) {
                        memory[indexRegister + i] = params.mem[i];
                    }
                },
                postFn: function () {
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(indexRegister).toEqual(params.expectedIVal);
                    for (var i = 0; i <= params.x; ++i) {
                        expect(Vregisters[i]).toEqual(memory[params.iVal + i]);
                    }
                }
            });
        },
/*
        test_LD_Vx_K: function (params) {
            testCycle({
                opCode: 0xF00A | (params.x << 8),
                op: 'LD_Vx_K',
                args: [ params.x ],
                postFn: function () {
                    cpu.keyboard.keyDown(params.key);

                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[params.x]).toEqual(params.key);
                    expect(cpu.halted).toBeFalsy();
                }
            });
        },


        test_SKP_Vx: function (params) {
            testCycle({
                opCode: 0xE09E | (params.x << 8),
                op: 'SKP_Vx',
                args: [ params.x ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    if (params.pressed) {
                        cpu.keyboard.keyDown(params.key);
                    }
                },
                postFn: function () {
                    if (params.shouldSkip) {
                        expect(programCounter).toEqual((this.oldPc + 4) & 0x0FFF);
                    } else {
                        expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    }
                }
            });
        },

          test_SKNP_Vx: function (params) {
            testCycle({
                opCode: 0xE0A1 | (params.x << 8),
                op: 'SKNP_Vx',
                args: [ params.x ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    if (params.pressed) {
                        cpu.keyboard.keyDown(params.key);
                    }
                },
                postFn: function () {
                    if (params.shouldSkip) {
                        expect(programCounter).toEqual((this.oldPc + 4) & 0x0FFF);
                    } else {
                        expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    }
                }
            });
        },
*/
        test_LD_F_Vx: function (params) {
            testCycle({
                opCode: 0xF029 | (params.x << 8),
                op: 'LD_F_Vx',
                args: [ params.x ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(indexRegister).toEqual(params.i);
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },

        
        test_LD_B_Vx: function (params) {
            testCycle({
                opCode: 0xF033 | (params.x << 8),
                op: 'LD_B_Vx',
                args: [ params.x ],
                preFn: function () {
                    indexRegister = params.i;
                    Vregisters[params.x] = params.xVal;
                },
                postFn: function () {
                    expect(indexRegister).toEqual(params.i);
                    expect(memory[indexRegister]).toEqual(params.digits[0]);
                    expect(memory[indexRegister + 1]).toEqual(params.digits[1]);
                    expect(memory[indexRegister + 2]).toEqual(params.digits[2]);
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                }
            });
        },
/*
        test_DRW_Vx_Vy_n: function (params) {
            if (typeof cpu.screen.togglePixel.calls === 'undefined') {
                spyOn(cpu.screen, 'togglePixel').and.callThrough();
            }

            cpu.screen.repaint = function () {};

            testCycle({
                opCode: 0xD000 | (params.x << 8) | (params.y << 4) | (params.n),
                op: 'DRW_Vx_Vy_n',
                args: [ params.x, params.y, params.n ],
                preFn: function () {
                    Vregisters[params.x] = params.xVal;
                    Vregisters[params.y] = params.yVal;
                    indexRegister = params.i;
                    for (var i = 0; i < params.sprite.length; ++i) {
                        cpu.mem[indexRegister + i] = params.sprite[i];
                    }
                },
                postFn: function () {
                    expect(indexRegister).toEqual(params.i);
                    expect(programCounter).toEqual((this.oldPc + 2) & 0x0FFF);
                    expect(Vregisters[0xF]).toEqual(params.VF);
                    expect(cpu.screen.togglePixel.calls.count()).toEqual(params.calls.length);

                    for (var i = 0; i < params.calls.length; ++i) {
                        expect(cpu.screen.togglePixel).toHaveBeenCalledWith(
                            params.calls[i][0],
                            params.calls[i][1]
                        );
                    }
                }
            });

            cpu.screen.togglePixel.calls.reset();
        }*/

    };

})();