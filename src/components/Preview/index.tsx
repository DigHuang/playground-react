import { useContext, useEffect, useState } from 'react';
import { PlaygroundContext } from '../../contexts/PlaygroundContext';
import { compile } from './compiler';

import iframeRaw from './iframe.html?raw';
import { IMPORT_MAP_FILE_NAME } from '../../mock/files';
// import Editor from '../CodeEditor/Editor';

export default function Preview() {
  const { files } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState('');
  const [iframeUrl, setIframeUrl] = useState<string>();

  useEffect(() => {
    const res = compile(files);
    setCompiledCode(res);
  }, [files]);

  const getIframeUrl = () => {
    // console.log('🚀 ~ Preview ~ files:', files);
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`
      );
    return URL.createObjectURL(new Blob([res], { type: 'text/html' }));
  };

  useEffect(() => {
    setIframeUrl(getIframeUrl());
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]);

  // // console.log('🚀 ~ getIframeUrl ~ compiledCode:', compiledCode);
  // // console.log('🚀 ~ Preview ~ iframeUrl:', iframeUrl);
  return (
    <div style={{ height: '100%' }}>
      <iframe
        src={iframeUrl}
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          border: 'none',
        }}
      />
      {/* <Editor
        file={{ name: 'dist.js', value: compiledCode, language: 'javascript' }}
      /> */}
    </div>
  );
}
