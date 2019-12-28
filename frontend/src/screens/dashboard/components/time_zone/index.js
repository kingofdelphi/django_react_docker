import React from 'react';

import Button from '../../../../components/button';

import styles from './styles.module.scss';

const convert_minutes_to_hh_mm = (minutes) => {
  const sign = minutes < 0 ? -1 : 1;
  minutes *= sign;
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return {
    sign: minutes === 0 ? 0 : sign,
    hours: hh,
    minutes: mm
  }
};

const readable_minutes = ({ hours, minutes }) => {
  const result = []
  if (hours) {
    result.push(`${hours} hours`);
  }
  if (minutes) {
    result.push(`${minutes} minutes`);
  }
  return result.join(' ');
};

class TimeZone extends React.Component {
  render() {
    const { 
      name,
      city,
      timeInTimeZone,
      timeRelativeToBrowser,
      onEdit,
      onDelete,
    } = this.props;
    const faster = convert_minutes_to_hh_mm(timeRelativeToBrowser);
    return (
      <div className={styles.main}>
        <div className={styles.header}>
          <label className={styles.name}>{name}</label>
            <div className={styles['action-buttons']}>
              <Button onClick={onEdit}><i className="fa fa-edit" /></Button>
              <Button onClick={onDelete}><i className="fa fa-trash" /></Button>
            </div>
        </div>
        <div className={styles.content}>
          <label>City - {city}</label>
          <label className={styles['timezone-time']}>
            {timeInTimeZone}
          </label>
          <label className={styles.relative}>
            { faster.sign === 0 && <span>wou both are on the same timezone</span> }
            { faster.sign === -1 && <span>{name} is behind you by {readable_minutes(faster)}</span> }
            { faster.sign === 1 && <span>You are behind {name} by {readable_minutes(faster)}</span> }
          </label>
        </div>
      </div>
    );
  }
}

export default TimeZone;
