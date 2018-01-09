import React from 'react';
import { connect } from 'dva';
import styles from './General.css';

function General() {
  return (
    <div className={styles.normal}>
      Route Component: General
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(General);
