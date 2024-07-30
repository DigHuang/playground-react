import styles from './index.module.scss';

import { useContext, useEffect, useState } from 'react';
import { PlaygroundContext } from '../../../contexts/PlaygroundContext';
import FileNameItem from './FileNameItem';

export default function FileNameList() {
  const { files, selectedFileName, setSelectedFileName } =
    useContext(PlaygroundContext);

  const [tabs, setTabs] = useState(['']);

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  return (
    <div className={styles.tabs}>
      {tabs.map((item, index) => {
        // why item + index for key is necessary here ?
        // because: index can't be a key for components
        return (
          <FileNameItem
            key={item + index}
            value={item}
            actived={selectedFileName === item}
            onClick={() => setSelectedFileName(item)}
          />
        );
      })}
    </div>
  );
}
