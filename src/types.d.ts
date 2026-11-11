/**
 * Google Design Sovereign Mirror - Ambient Types
 * Strictly Zero External NPM Dependencies!
 */

declare const Bun: any;
declare const Buffer: any;
declare const process: any;

interface ImportMeta {
  dir: string;
  url: string;
}

declare module "bun" {
  export const serve: any;
  export const build: any;
  export const spawn: any;
}

declare module "bun:test" {
  export const describe: (name: string, fn: () => void | Promise<void>) => void;
  export const test: (name: string, fn: () => void | Promise<void>) => void;
  export const it: (name: string, fn: () => void | Promise<void>) => void;
  export const expect: (actual: any) => any;
  export const beforeEach: (fn: () => void | Promise<void>) => void;
  export const afterEach: (fn: () => void | Promise<void>) => void;
}

declare module "node:fs" {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string, encoding?: string): any;
  export function writeFileSync(
    path: string,
    data: any,
    encoding?: string,
  ): void;
  export function mkdirSync(path: string, options?: any): any;
  export function statSync(path: string): any;
  export function readdirSync(path: string, options?: any): any;
  export function rmSync(path: string, options?: any): void;
}

declare module "node:path" {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
  export function basename(path: string, ext?: string): string;
  export function extname(path: string): string;
  export function relative(from: string, to: string): string;
}

declare module "node:crypto" {
  export function createHash(algorithm: string): {
    update(data: any): any;
    digest(encoding: string): string;
  };
}

declare module "node:zlib" {
  export function deflateSync(data: any, options?: any): Uint8Array;
  export function inflateSync(data: any): Uint8Array;
  export function gzipSync(data: any, options?: any): Uint8Array;
}

declare module "node:util" {
  export function parseArgs(options: any): any;
}

declare module "fs" {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string, encoding?: string): any;
  export function writeFileSync(
    path: string,
    data: any,
    encoding?: string,
  ): void;
  export function mkdirSync(path: string, options?: any): any;
  export function statSync(path: string): any;
  export function readdirSync(path: string, options?: any): any;
}

declare module "path" {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function basename(path: string, ext?: string): string;
  export function extname(path: string): string;
  export function relative(from: string, to: string): string;
}
