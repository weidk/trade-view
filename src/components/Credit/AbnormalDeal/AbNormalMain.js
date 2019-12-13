/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import fetch from 'dva/fetch';
import moment from 'moment';
import { DatePicker, Row, Col, Table, InputNumber, Divider, Button, Spin, message } from 'antd';
import styles from './AbNormalMain.css';

const RangePicker = DatePicker.RangePicker;
const ExportJsonExcel = require('js-export-excel');

const columns = [
  {
    title: '债券简称',
    dataIndex: 'DEALBONDNAME',
    width: 150,
    render: (text, record) => <h5 style={{ color: record.ISNEW ? 'red' : 'black' }}>{text}</h5>,
  },
  {
    title: '债券代码',
    dataIndex: 'DEALBONDCODE',
    width: 150,
  },
  {
    title: '成交收益',
    dataIndex: 'DEALYIELD',
    width: 120,
  },
  {
    title: '成交净价',
    dataIndex: 'DEALCLEANPRICE',
    width: 120,
  },
  {
    title: '中债估值',
    dataIndex: 'CNBDYIELD',
    width: 120,
  },
  {
    title: '估值偏离',
    dataIndex: 'deviation',
    width: 120,
    sorter: (a, b) => a.deviation - b.deviation,
  },
  {
    title: '剩余期限',
    dataIndex: 'MATU',
    width: 120,
    sorter: (a, b) => a.MATU - b.MATU,
  },
  {
    title: '成交额-亿',
    dataIndex: 'DEALFACEVALUE',
    width: 120,
    sorter: (a, b) => a.DEALFACEVALUE - b.DEALFACEVALUE,
  },
  {
    title: '成交时间',
    dataIndex: 'TRANSACTTIME',
    width: 180,
  },
  {
    title: '发行人',
    dataIndex: 'ISSUER',
    width: 250,
    sorter: (a, b) => a.ISSUER - b.ISSUER,
    render: (text, record) => <h5 style={{ color: record.ISNEW ? 'red' : 'black' }}>{text}</h5>,
  },
];

class AbNormalMain extends React.Component {
  constructor() {
    super();
    this.state = {
      deviation: 50,
      dealyield: 10,
      startDay: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endDay: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      tabledata: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      this.setState({ startDay, endDay });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  fetchData = () => {
    try {
      if (moment(this.state.endDay).date() - moment(this.state.startDay).date() > 5) {
        message.error('查询期限不得超过5天');
      } else {
        this.setState({ loading: true });
        fetch('/api/abnormaldeals', {
          method: 'POST',
          body: JSON.stringify({ start: this.state.startDay, end: this.state.endDay, deviation: this.state.deviation, dealyield: this.state.dealyield }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((ds) => {
            this.setState({ tabledata: ds, loading: false });
          });
        });
      }
    } catch (error) {
      this.setState({ loading: false });
      // console.log('error: ', error);
    }
  }

  writeToExcel = () => {
    const option = {};
    option.fileName = '高估值成交债券';
    option.datas = [
      {
        sheetData: this.state.tabledata,
        sheetHeader: ['债券简称', '债券代码', '成交收益', '成交净价', '中债估值', '估值偏离', '剩余期限', '成交额-亿', '成交时间', '发行人', '行业', '', '省份', '城市', '是否新增'],
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  render() {
    return (
      <div className={styles.normal}>
        <Spin size="large" spinning={this.state.loading}>
          <Row>
            <Col span={7} >
              <RangePicker
                onChange={this.pickerChange}
                defaultValue={[moment().subtract(1, 'days'), moment().subtract(1, 'days')]}
                format="YYYY-MM-DD"
              />
            </Col>
            <Col span={4}>
              <a>成交 - 估值 >= </a>
              <InputNumber
                defaultValue={50}
                onChange={value => this.setState({ deviation: value })}
              />
              <a>BP</a>
            </Col>
            <Col span={4}>
              <a>成交收益率 >= </a>
              <InputNumber
                defaultValue={10}
                onChange={value => this.setState({ dealyield: value })}
              />
              <a>%</a>
            </Col>
            <Col span={1}>
              <Button type="primary" shape="circle" icon="search" onClick={() => this.fetchData()} />
            </Col>
            <Col span={2} push={6}>
              <Button type="primary" ghost block onClick={() => this.writeToExcel()}>导出Excel</Button>
            </Col>
          </Row>
          <Divider />
          <Table columns={columns} dataSource={this.state.tabledata} pagination={false} size="small" />
        </Spin>
      </div>
    );
  }
}

export default AbNormalMain;
