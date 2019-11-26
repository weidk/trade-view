import React from 'react';
import { DatePicker, Row, Col, Table } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';
import '../../../config';
import styles from './HistorySettle.css';

let traderFilter = global.constants.traders;
traderFilter = traderFilter.map((t) => {
  const obj = {};
  obj.text = t;
  obj.value = t;
  return obj;
});

class HistorySettle extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '净买债券',
      dataIndex: 'buybond',
      render: text => <h2 style={{ color: 'red' }}>{text}</h2>,
    }, {
      title: '净买金额',
      dataIndex: 'buynet',
      render: text => <h2 style={{ color: 'red' }}>{text}</h2>,
    }, {
      title: '净卖债券',
      dataIndex: 'sellbond',
      render: text => <h2 style={{ color: 'green' }}>{text}</h2>,
    }, {
      title: '净卖金额',
      dataIndex: 'sellnet',
      render: text => <h2 style={{ color: 'green' }}>{text}</h2>,
    },
    // , {
    //   title: '冻结债券',
    //   dataIndex: 'frozebond',
    //   render: text => <h2 style={{ color: 'red' }}>{text}</h2>,
    // }, {
    //   title: '冻结金额',
    //   dataIndex: 'frozenet',
    //   render: text => <h2 style={{ color: 'red' }}>{text}</h2>,
    // }
    ];

    this.columnsDetail = [{
      title: '交易员',
      dataIndex: 'trader',
      filters: traderFilter,
      width: '10%',
      onFilter: (value, record) => record.trader.indexOf(value) === 0,
      render: text => <h3>{text}</h3>,
    }, {
      title: '债券代码',
      dataIndex: 'bondcode',
      width: '10%',
      render: text => <h3>{text}</h3>,
    }, {
      title: '买量(亿)',
      dataIndex: 'buyamt',
      width: '10%',
      render: text => <h3>{text}</h3>,
    }, {
      title: '卖量(亿)',
      dataIndex: 'sellamt',
      width: '10%',
      render: text => <h3>{text}</h3>,
    }, {
      title: '轧差(亿)',
      width: '10%',
      dataIndex: 'netamt',
      render: text => <h2 style={{ color: text >= 0 ? 'black' : 'red' }}>{text}</h2>,
    },
    //   {
    //   title: '冻结(亿)',
    //   dataIndex: 'frozeamt',
    //   render: text => <h2 style={{ color: text >= 0 ? 'black' : 'red' }}>{text}</h2>,
    // },
    {
      title: '备注',
      dataIndex: 'note',
      width: '10%',
    }, {
      title: '非现券头寸',
      editable: true,
      width: '10%',
      dataIndex: 'nonbond',
    }];

    this.columns2 = [{
      title: '交易员',
      dataIndex: 'trader',
      render: text => <h3>{text}</h3>,
    }, {
      title: '非现券头寸',
      dataIndex: 'nonbond',
      render: text => <h3>{text}</h3>,
    }];


    this.state = {
      sumData: [],
      detailData: [],
      nonbonddata: [],
    };
  }

  componentDidMount() {
    this.pickerChange(moment());
  }

  pickerChange = (values) => {
    try {
      fetch('/api/netsellbondpost', {
        method: 'POST',
        body: JSON.stringify(values.format('YYYYMMDD')),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ sumData: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }

    try {
      fetch('/api/settlepositionpost', {
        method: 'POST',
        body: JSON.stringify(values.format('YYYYMMDD')),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ detailData: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }

    try {
      fetch('/api/nonbondinfopost', {
        method: 'POST',
        body: JSON.stringify(values.format('YYYYMMDD')),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ nonbonddata: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    return (
      <div className={styles.normal}>
        <h4> 请选择报头寸日期 ：
        <DatePicker onChange={this.pickerChange} defaultValue={moment()} />
        </h4>
        <Row gutter={24}>
          <Col span={12}>
            <Table columns={this.columns} dataSource={this.state.sumData} pagination={false} />
            <Table columns={this.columns2} dataSource={this.state.nonbonddata} pagination={false} />
          </Col>
          <Col span={12}>
            <Table columns={this.columnsDetail} dataSource={this.state.detailData} pagination={false} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default HistorySettle;
