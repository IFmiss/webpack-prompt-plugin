import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript2 from 'rollup-plugin-typescript2';
import clear from 'rollup-plugin-clear';
import { terser } from 'rollup-plugin-terser';

export default {
  input: `src/index.ts`,
  output: [{
    file: `dist/index.js`,
    format: 'cjs',
  }],
  plugins: [
    clear({
      targets: ['dist']
    }),
    json(),
    typescript2(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: 'runtime'
    }),
    resolve({
      mainFields: 'main',
      modulesOnly: true
    }),
    commonjs({
      include: 'node_modules/**',
      sourceMap: false
    }),
    terser({
      output: {
        comments: false
      }
    })
  ]
};
