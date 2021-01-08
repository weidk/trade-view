import React, { Fragment } from 'react';
import { Table, Spin } from 'antd';
import request from '../../../utils/request';


class ToSettleBC extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: false,
    };
  }
  componentDidMount() {
    this.fetchData();
  }


  fetchData = () => {
    this.setState({ loading: true });
    const pms = request('/api/bcpositon');
    pms.then((datas) => {
      console.warn(datas);
      this.setState({ data: datas.data, loading: false });
    }).catch(err => ({ err }));
  }

  render() {
    const columns = [{
      title: '债券代码',
      dataIndex: 'BONDCODE',
      width: 300,
      render: text => <h3>{text}</h3>,
    }, {
      title: '债券简称',
      dataIndex: 'BONDNAME',
      width: 300,
      render: text => <h3>{text}</h3>,
    }, {
      title: '方向',
      dataIndex: 'SIDE',
      width: 300,
      render: (text) => {
        if (text === '买入') { return <h3 style={{ color: 'red' }}>{text}</h3>; } else { return <h3 style={{ color: 'green' }}>{text}</h3>; }
      },
    }, {
      title: '数量',
      dataIndex: 'TOTALFACEVALUE',
      width: 300,
      render: text => <h3>{text}</h3>,
    }, {
      title: '结算日',
      dataIndex: 'SETTLEMENTDATE',
      width: 300,
      render: text => <h3>{text}</h3>,
    }];


    return (
      <Fragment>
        <Spin spinning={this.state.loading}>
          <Table
            columns={columns}
            dataSource={this.state.data}
            pagination={false}
            scroll={{ y: 500 }}
          />
        </Spin>
      </Fragment>
    );
  }
}


export default ToSettleBC;
