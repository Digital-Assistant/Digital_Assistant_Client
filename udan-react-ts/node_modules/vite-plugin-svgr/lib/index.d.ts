import type { Config } from '@svgr/core';
import { transformWithEsbuild } from 'vite';
import type { Plugin } from 'vite';
declare type Options = {
    svgrOptions?: Config;
    esbuildOptions?: Parameters<typeof transformWithEsbuild>[2];
};
declare const _default: ({ svgrOptions, esbuildOptions, }?: Options) => Plugin;
export = _default;
