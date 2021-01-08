import React from 'react';
import { Table, Divider, Row, Col } from 'antd';
import fetch from 'dva/fetch';
import styles from './AdjMain.css';
import AdjChart from './AdjChart';

const _ = require('lodash');

class AdjMain extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      selectedRowKeys: [],
      selectAsset: [],
    };
    this.columns = [
      {
        title: '原始资产',
        dataIndex: '原始资产',
        width: 150,
      },
      {
        title: '占资成本系数',
        dataIndex: '占资成本系数',
        width: 150,
      },
      {
        title: '税收成本系数',
        dataIndex: '税收成本系数',
        width: 150,
      },
      {
        title: '调整后收益率',
        dataIndex: 'adjYield',
        width: 150,
      },
    ];
  }
  componentDidMount() {
    this.onFetchData();
  }

  onFetchData = () => {
    fetch('/api/getadjyieldapi')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        this.setState({ data: jsonData });
      });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const selectAsset = _.map(selectedRows, '原始资产');
    this.setState({ selectedRowKeys, selectAsset });
  };
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.normal}>
        <Row>
          <Col span={10}>
            <Divider> 等效收益率 </Divider>
            <Table
              columns={this.columns}
              dataSource={this.state.data}
              // bordered
              rowSelection={rowSelection}
              pagination={false}
              size="small"
              scroll={{ y: 600 }}
            />
          </Col>
          <Col span={14}>
            <AdjChart showLines={this.state.selectAsset} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AdjMain;
