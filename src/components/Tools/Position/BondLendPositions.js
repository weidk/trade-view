import React from 'react';
import fetch from 'dva/fetch';
import { Table } from 'antd';
import styles from './BondLendPositions.css';

class BondLendPositions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bondlendData: [],
    };
  }

  componentDidMount() {
    try {
      fetch('/api/bondlendpos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ bondlendData: ds });
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  columns = [{
    title: '借券简称',
    dataIndex: 'BONDNAME',
  }, {
    title: '借券代码',
    dataIndex: 'BONDCODE',
  }, {
    title: '借券总额',
    dataIndex: 'INITFACEVALUE',
  }, {
    title: '起始日',
    dataIndex: 'BEGINDATE',
  }, {
    title: '到期日',
    dataIndex: 'ENDDATE',
  }, {
    title: '借贷质押券',
    dataIndex: 'PLEDGEBOND',
  }, {
    title: '原始信息',
    dataIndex: 'info',
  }];


  render() {
    return (
      <div className={styles.normal}>
        <Table
          columns={this.columns}
          bordered
          rowKey={record => record.INFO}
          dataSource={this.state.bondlendData}
          pagination={false}
          size="small"
        />
      </div>
    );
  }
}

export default BondLendPositions;
