import React from 'react';
import { Row, Col } from 'antd';
import BondScatterMain from './BondScatterMain';
import styles from './BSMain.css';

function BSMain() {
  return (
    <div className={styles.normal}>
      <Row>
        <Col span={12}><BondScatterMain /></Col>
        <Col span={12}><BondScatterMain /></Col>
      </Row>
      <Row>
        <Col span={12}><BondScatterMain /></Col>
        <Col span={12}><BondScatterMain /></Col>
      </Row>
      <Row>
        <Col span={12}><BondScatterMain /></Col>
        <Col span={12}><BondScatterMain /></Col>
      </Row>
      <Row>
        <Col span={12}><BondScatterMain /></Col>
        <Col span={12}><BondScatterMain /></Col>
      </Row>
    </div>
  );
}

export default BSMain;
