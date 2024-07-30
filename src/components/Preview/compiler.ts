import { transform } from '@babel/standalone';
import { Files } from '../../contexts/PlaygroundContext';
import { ENTRY_FILE_NAME } from '../../mock/files';
import { PluginObj } from '@babel/core';
import { css2JS, json2Js } from '../../utils/utils';

export const beforeTransformCode = (filename: string, code: string) => {
  let _code = code;
  const regexReact = /import\s+React/g;
  if (
    (filename.endsWith('.jsx') || filename.endsWith('.tsx')) &&
    !regexReact.test(code)
  ) {
    _code = `import React from 'react';\n${code}`;
  }
  return _code;
};

export const babelTransform = (
  filename: string,
  code: string,
  files: Files
) => {
  const _code = beforeTransformCode(filename, code);
  let result = '';
  try {
    result = transform(_code, {
      presets: ['react', 'typescript'],
      filename,
      plugins: [customResolver(files)],
      retainLines: true,
    }).code!;
  } catch (e) {
    console.error('编译错误', e);
  }
  return result;
};

const getModuleFile = (files: Files, modulePath: string) => {
  let moduleName = modulePath.split('./').pop() || '';
  if (!moduleName.includes('.')) {
    const realModuleName = Object.keys(files)
      .filter((key) => {
        return (
          key.endsWith('.ts') ||
          key.endsWith('.tsx') ||
          key.endsWith('.js') ||
          key.endsWith('jsx')
        );
      })
      .find((key) => {
        return key.split('.').includes(moduleName);
      });
    if (realModuleName) {
      moduleName = realModuleName;
    }
  }
  return files[moduleName];
};

function customResolver(files: Files): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path) {
        const modulePath = path.node.source.value;
        if (modulePath.startsWith('.')) {
          const file = getModuleFile(files, modulePath);
          if (!file) return;
          if (file.name.endsWith('.css')) {
            path.node.source.value = css2JS(file);
          } else if (file.name.endsWith('.json')) {
            path.node.source.value = json2Js(file);
          } else {
            path.node.source.value = URL.createObjectURL(
              new Blob([babelTransform(file.name, file.value, files)], {
                type: 'application/javascript',
              })
            );
          }
        }
      },
    },
  };
}

export const compile = (files: Files) => {
  const main = files[ENTRY_FILE_NAME];
  return babelTransform(ENTRY_FILE_NAME, main.value, files);
};