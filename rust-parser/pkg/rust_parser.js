let imports = {};
let wasm;
import { Buffer } from 'https://deno.land/std/node/buffer.ts';

let WASM_VECTOR_LEN = 0;

let cachegetNodeBufferMemory0 = null;
function getNodeBufferMemory0() {
    if (cachegetNodeBufferMemory0 === null || cachegetNodeBufferMemory0.buffer !== wasm.memory.buffer) {
        cachegetNodeBufferMemory0 = Buffer.from(wasm.memory.buffer);
    }
    return cachegetNodeBufferMemory0;
}

function passStringToWasm0(arg, malloc) {

    const len = Buffer.byteLength(arg);
    const ptr = malloc(len);
    getNodeBufferMemory0().write(arg, ptr, len);
    WASM_VECTOR_LEN = len;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
* @param {string} text
* @returns {string}
*/
const reverse = function(text) {
    try {
        var ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.reverse(8, ptr0, len0);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_free(r0, r1);
    }
};
export { reverse };

const u32CvtShim = new Uint32Array(2);

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);
/**
* @param {BigInt} x
* @returns {BigInt}
*/
const factorial = function(x) {
    uint64CvtShim[0] = x;
    const low0 = u32CvtShim[0];
    const high0 = u32CvtShim[1];
    wasm.factorial(8, low0, high0);
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    u32CvtShim[0] = r0;
    u32CvtShim[1] = r1;
    const n1 = uint64CvtShim[0];
    return n1;
};
export { factorial };

/**
* @returns {string}
*/
const html_cest_de_leau = function() {
    try {
        wasm.html_cest_de_leau(8);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_free(r0, r1);
    }
};
export { html_cest_de_leau };

/**
* @param {string} html
* @returns {number}
*/
const parse_pages_number = function(html) {
    var ptr0 = passStringToWasm0(html, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.parse_pages_number(ptr0, len0);
    return ret;
};
export { parse_pages_number };

import * as path from 'https://deno.land/std/path/mod.ts';
import WASI from 'https://deno.land/std/wasi/snapshot_preview1.ts';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const wasi = new WASI({
    args: Deno.args,
    env: Deno.env.toObject(),
    preopens: {
        '/': __dirname
    }
});
imports = { wasi_snapshot_preview1: wasi.exports };

const p = path.join(__dirname, 'rust_deno_bg.wasm');
const bytes = Deno.readFileSync(p);
const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;

wasi.memory = wasmInstance.exports.memory;

