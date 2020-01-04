import React from 'react';

import Button from '../button';
import styles from './styles.module.scss';

class Menu extends React.PureComponent {
  render() {
    const { 
      className,
      items,
      selectedItem,
      keySelector,
      labelSelector,
      onChange,
    } = this.props;
    const cls = [styles.main, className].join(' ');
    return (
      <div className={cls}>
        { items.map(item => {
          const cls = keySelector(item) === selectedItem ? styles.active : '';
          return (
            <Button 
              onClick={() => onChange(item)}
              className={cls}
              key={keySelector(item)}
            >
                {labelSelector(item)}
              </Button>
          )
        }
        ) 
        }
      </div>
    );
  }
}

export default Menu;

