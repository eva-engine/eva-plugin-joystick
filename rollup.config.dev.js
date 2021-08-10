import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const publicDir = path.resolve(__dirname, 'public');
const exampleDir = path.resolve(__dirname, 'example');

export default {
  input: 'example/index.ts',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    globals: {
      'pixi.js': 'PIXI',
    },
  },
  external: ['pixi.js'],
  plugins: [
    globals(),
    builtins(),
    resolve({
      browser: true,
      mainFields: ['jsnext', 'esnext', 'module', 'main'],
    }),
    commonjs(),
    typescript({
      typescript: require('typescript'),
      check: false,
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
      objectHashIgnoreUnknownHack: true,
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: false,
          declaration: false,
          declarationMap: false,
        },
        exclude: ['**/__tests__'],
      },
    }),
    serve({
      open: true,
      contentBase: publicDir,
      host: 'localhost',
      port: 8080,
    }),
    livereload(exampleDir),
  ],
};
