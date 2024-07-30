import classNames from 'classnames';
import styles from './index.module.scss';
import { FC, useEffect, useState } from 'react';

export interface MessageProps {
  type: 'error' | 'warn';
  content: string;
}

export const Message: FC<MessageProps> = ({ type, content }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!content);
  }, [content]);

  return (
    visible && (
      <div className={classNames(styles.msg, styles[type])}>
        <pre dangerouslySetInnerHTML={{ __html: content }}></pre>
        <button className={styles.dismiss} onClick={() => setVisible(false)}>
          ✕
        </button>
      </div>
    )
  );
};

export default Message;
