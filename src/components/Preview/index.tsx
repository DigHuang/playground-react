import { useContext, useEffect, useState } from 'react';
import { PlaygroundContext } from '../../contexts/PlaygroundContext';
import { compile } from './compiler';

import iframeRaw from './iframe.html?raw';
import { IMPORT_MAP_FILE_NAME } from '../../mock/files';
import Message from '../Message';

interface MessageData {
  data: {
    type: string;
    message: string;
  };
}
// import Editor from '../CodeEditor/Editor';

export default function Preview() {
  const { files } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState('');
  const [iframeUrl, setIframeUrl] = useState<string>();
  const [error, setError] = useState('');

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

  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data;
    if (type === 'ERROR') {
      setError(message);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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
      <Message type='error' content={error} />
      {/* <Editor
        file={{ name: 'dist.js', value: compiledCode, language: 'javascript' }}
      /> */}
    </div>
  );
}
