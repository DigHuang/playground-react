import styles from './index.module.scss';

import { useContext, useEffect, useState } from 'react';
import { PlaygroundContext } from '../../../contexts/PlaygroundContext';
import FileNameItem from './FileNameItem';
import { ENTRY_FILE_NAME, readonlyFiles } from '../../../mock/files';

export default function FileNameList() {
  const {
    files,
    selectedFileName,
    setSelectedFileName,
    updateFileName,
    addFile,
    removeFile,
  } = useContext(PlaygroundContext);

  const [tabs, setTabs] = useState(['']);
  const [creating, setCreating] = useState(false);

  const addTab = () => {
    addFile('Comp' + Math.random().toString().slice(2, 8) + '.tsx');
    setCreating(true);
  };

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  const handleEditComplete = (name: string, prevName: string) => {
    updateFileName(prevName, name);
    setSelectedFileName(name);
  };

  const handleRemove = (name: string) => {
    removeFile(name);
    setSelectedFileName(ENTRY_FILE_NAME);
  };

  return (
    <div className={styles.tabs}>
      {tabs.map((item, index, arr) => {
        // why item + index for key is necessary here ?
        // because: index can't be a key for components
        return (
          <FileNameItem
            key={item + index}
            value={item}
            readonly={readonlyFiles.includes(item)}
            actived={selectedFileName === item}
            creating={creating && index === arr.length - 1}
            onClick={() => setSelectedFileName(item)}
            onEditComplete={(name: string) => {
              handleEditComplete(name, item);
            }}
            onRemove={() => {
              handleRemove(item);
            }}
          />
        );
      })}
      <div className={styles.add} onClick={addTab}>
        +
      </div>
    </div>
  );
}
