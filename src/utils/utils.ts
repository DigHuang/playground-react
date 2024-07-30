import { Files } from './../contexts/PlaygroundContext';
import { strFromU8, strToU8, unzlibSync, zlibSync } from 'fflate';
import type { File } from '../contexts/PlaygroundContext';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const fileName2Language = (name: string) => {
  const suffix = name.split('.').pop() || '';
  if (['js', 'jsx'].includes(suffix)) return 'javascript';
  if (['ts', 'tsx'].includes(suffix)) return 'typescript';
  if (['json'].includes(suffix)) return 'json';
  if (['css'].includes(suffix)) return 'css';
  return 'javascript';
};

export const json2Js = (file: File) => {
  const js = `export default ${file.value}`;
  return URL.createObjectURL(
    new Blob([js], { type: 'application/javascript' })
  );
};

export const css2JS = (file: File) => {
  const randomId = new Date().getTime();
  const js = `(() => {
  const stylesheet = document.createElement('style');
  stylesheet.setAttribute('id', 'style_${randomId}_${file.name}');
  document.head.appendChild(stylesheet);

  const styles = document.createTextNode(\`${file.value}\`);
  stylesheet.innerHTML = '';
  stylesheet.appendChild(styles)
})()`;
  return URL.createObjectURL(
    new Blob([js], { type: 'application/javascript' })
  );
};

export const compress = (data: string): string => {
  const buffer = strToU8(data);
  const zipped = zlibSync(buffer, { level: 9 });
  const binary = strFromU8(zipped, true);
  return btoa(binary);
};

export const uncompress = (base64: string): string => {
  const binary = atob(base64);
  const buffer = strToU8(binary, true);
  const unzipped = unzlibSync(buffer);
  return strFromU8(unzipped);
};

export async function downloadFiles(files: Files) {
  const zip = new JSZip();

  Object.keys(files).forEach((name) => {
    zip.file(name, files[name].value);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `code${Math.random().toString().slice(2, 8)}.zip`);
}
