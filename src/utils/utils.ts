import type { File } from '../contexts/PlaygroundContext';

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
