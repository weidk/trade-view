import React from 'react';
import { Row, Col } from 'antd';
import FRprofitPie from './FRprofitPie';
import FRprofitBar from './FRprofitBar';
import styles from './ProfitReason.css';

class ProfitReason extends React.Component {
  render() {
    return (
      <div className={styles.normal}>
        <Row>
          <Col span={16} push={8}><FRprofitBar /></Col>
          <Col span={8} pull={16}><FRprofitPie /></Col>
        </Row>
      </div>
    );
  }
}

export default ProfitReason;
