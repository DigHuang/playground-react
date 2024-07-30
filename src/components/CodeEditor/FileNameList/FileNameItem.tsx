import classNames from 'classnames';
import { FC, useState } from 'react';

import styles from './index.module.scss';

export interface FileNameItemProps {
  value: string;
  actived: boolean;
  onClick: () => void;
}

export const FileNameItem: FC<FileNameItemProps> = (props) => {
  const { value, actived = false, onClick } = props;
  const [name, setName] = useState(value);

  return (
    <div
      className={classNames(
        styles['tab-item'],
        actived ? styles.actived : null
      )}
      onClick={onClick}
    >
      <span>{name}</span>
    </div>
  );
};

export default FileNameItem;
