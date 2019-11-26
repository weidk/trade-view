/* eslint-disable max-len */
import React from 'react';
import { Card, Row, Col, Table, Button } from 'antd';
import { Statistic } from 'semantic-ui-react';
import styles from './SettleSum.css';

const ExportJsonExcel = require('js-export-excel');

class SettleSum extends React.Component {
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

    this.columns2 = [{
      title: '交易员',
      dataIndex: 'trader',
      render: text => <h3>{text}</h3>,
    }, {
      title: '非现券头寸',
      dataIndex: 'nonbond',
      render: text => <h3>{text}</h3>,
    }];
  }

  componentDidMount() {
    this.props.fetchData();
    // setInterval(this.props.fetchData, 2000);
  }


  writeToExcel = () => {
    const option = {};
    const myDate = new Date();
    option.fileName = `${myDate.toLocaleDateString()}净买卖头寸`;
    option.datas = [
      {
        sheetData: this.props.netbond,
        sheetHeader: ['净买债券', '净买金额', '净卖债券', '净卖金额', '冻结债券', '冻结金额'],
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }


  render() {
    // console.log(this.state.settleAmt);
    return (
      <div className={styles.normal}>
        <div style={{ background: '#ECECEC', padding: '10px' }}>
          <Row gutter={16}>
            <Col span={4}>
              <Button type="primary" ghost block onClick={() => this.writeToExcel()}>导出Excel</Button>
              <Card title={this.props.settleAmt < 0 ? '现券需准备资金：' : '现券可划出资金：'}>
                <Statistic horizontal color={this.props.settleAmt >= 0 ? 'green' : 'red'} size="large">
                  <Statistic.Value>{Math.abs(this.props.settleAmt)}</Statistic.Value>
                  <Statistic.Label>亿</Statistic.Label>
                </Statistic>
              </Card>
            </Col>
            <Col span={10}>
              <Table columns={this.columns} dataSource={this.props.netbond} pagination={false} />
            </Col>
            <Col span={10}>
              <Table columns={this.columns2} dataSource={this.props.nonbond} pagination={false} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default SettleSum;
