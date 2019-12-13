import React from 'react';
import { Input, Row, Col, Button, Select, Table, message, Tag, Divider } from 'antd';
import fetch from 'dva/fetch';
import { EditableFormRow, EditableCell } from '../../Utils/EditableCell';
import '../../Utils/EditableCell.css';
import '../../../config';
import styles from './TextModal.css';

const { Option } = Select;
const { TextArea } = Input;
const _ = require('lodash');

class CalPosition extends React.Component {
  constructor(props) {
    super(props);
    this.TextColumns = [{
      title: '交易员',
      dataIndex: 'trader',
      width: '15%',
      render: text => <h3>{text}</h3>,
    }, {
      title: '债券代码/简称',
      dataIndex: 'bondcode',
      editable: true,
      width: '15%',
      render: text => <h3>{text}</h3>,
    }, {
      title: '买入(亿)',
      editable: true,
      dataIndex: 'buyamt',
      width: '10%',
      render: text => <h3>{text}</h3>,
    }, {
      title: '卖出(亿)',
      editable: true,
      dataIndex: 'sellamt',
      width: '10%',
      render: text => <h3>{text}</h3>,
    }, {
      title: '轧差(亿)',
      dataIndex: 'netamt',
      width: '10%',
      render: text => <h2 style={{ color: text >= 0 ? 'black' : 'red' }}>{text}</h2>,
    }, {
      title: '备注',
      editable: true,
      dataIndex: 'note',
      ellipsis: true,
    }];

    this.SumColumns = [{
      title: '债券代码/简称',
      dataIndex: 'bondcode',
      editable: true,
      width: '25%',
      render: text => <h3>{text}</h3>,
    }, {
      title: '买入(亿)',
      editable: true,
      dataIndex: 'buyamt',
      width: '25%',
      render: text => <h3>{text}</h3>,
    }, {
      title: '卖出(亿)',
      editable: true,
      dataIndex: 'sellamt',
      width: '25%',
      render: text => <h3>{text}</h3>,
    }, {
      title: '轧差(亿)',
      dataIndex: 'netamt',
      width: '25%',
      render: text => <h2 style={{ color: text >= 0 ? 'black' : 'red' }}>{text}</h2>,
    }];

    this.state = {
      rowtext: '',
      trader: '',
      dataSource: [],
      dataSourceSum: [],
      nonbondText: '',
      selectoption: '',
      check: false,
      plus1Data: [],
      dealtimes: '',
    };
  }

  componentDidMount() {
    const selectchildren = global.constants.traders;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ selectoption: selectchildren.map(trader => <Option key={trader}>{trader}</Option>) });
  }

  // eslint-disable-next-line react/sort-comp
  handleSave = (row) => {
    const newrow = { ...row, buyamt: parseFloat(row.buyamt), sellamt: parseFloat(row.sellamt), netamt: parseFloat((row.sellamt - row.buyamt).toFixed(2)) };
    console.log(newrow);
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => newrow.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...newrow,
    });
    this.setState({ dataSource: newData }, this.sumPosition);
  };
  handleChange=(value) => {
    this.setState({ trader: value }, this.getFlows);
  }
  getFlows =() => {
    try {
      fetch('/api/queryplus1settle', {
        method: 'POST',
        body: JSON.stringify({ trader: this.state.trader }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ plus1Data: ds, dealtimes: _.sumBy(ds, 'TOTALDEALTIMES') }, this.RexText);
        });
      });
      // eslint-disable-next-line no-empty
    } catch (error) {
    }
  }

  RexText = () => {
    if (this.state.trader === '') {
      message.error('请选择交易员姓名');
    } else {
      try {
        const newList = [];
        let key = 0;

        // 中介头寸
        if (this.state.rowtext !== '') {
          const raw = this.state.rowtext;
          // eslint-disable-next-line no-unused-vars
          let rawList = _.split(raw, /[\r\n]/);
          rawList = _.map(rawList, _.trim);
          rawList = rawList.forEach((tempStr) => {
            const newtempStr = tempStr.replace(/\s+/g, ' '); // 将多个空格替换成一个空格
            const bondcode = this.regBondcode(newtempStr);
            const amt = this.regAmt(newtempStr);
            if (bondcode !== '') {
              key += 1;
              newList.push({ key, trader: this.state.trader, bondcode, buyamt: amt.buyamt, sellamt: amt.sellamt, netamt: amt.netamt, note: newtempStr });
            }
          });
        }
        // 做了前台的+1的流水
        this.state.plus1Data.forEach((d) => {
          key += 1;
          newList.push({ key, trader: d.trader, bondcode: d.bondcode, buyamt: d.buyamt, sellamt: d.sellamt, netamt: d.netamt, note: `前台：${d.TOTALDEALTIMES}笔` });
        });
        this.setState({ dataSource: newList }, this.sumPosition);
      } catch (error) {
        console.log(error);
      }
    }
  };

  sumPosition = () => {
    const datalist = this.state.dataSource;
    const groupedlist = _.groupBy(datalist, 'bondcode');
    const newList = [];
    Object.keys(groupedlist).forEach((bond) => {
      const bondcode = bond;
      const buyamt = _.sumBy(groupedlist[bond], 'buyamt').toFixed(1);
      const sellamt = _.sumBy(groupedlist[bond], 'sellamt').toFixed(1);
      const netamt = _.sumBy(groupedlist[bond], 'netamt').toFixed(1);
      newList.push({ bondcode, buyamt, sellamt, netamt });
    });
    this.setState({ dataSourceSum: newList });
  }

  regBondcode = (raw) => {
    const newraw = raw.replace(/\S*\+\d\b/g, '');
    const bondcode = newraw.match(/\d{6,}/);
    const bondname = newraw.match(/(\d{2}|PR|pr|Pr|pR)[\u4e00-\u9fa5]{2,}[a-zA-Z]*?\d{0,3}(?=\s)/);
    if (bondname !== null) {
      return bondname[0];
    } else if (bondcode !== null) {
      return bondcode[0];
    } else {
      return '';
    }
  };

  regAmt = (raw) => {
    const isSell = /(东海.*出|东海.*to|东海.*TO|东海.*tO|东海.*To|卖|ofr|Ofr|OFR|offer|OFFER|Offer)/.test(raw);
    const newraw = raw.replace(/\d{6,}/g, '');
    const amtW1 = newraw.match(/(\d{1,2}000(?=(w|W|万)\s)|\d{1,2}000(?=\s))/);
    const amtW2 = newraw.match(/\d{1,2}(?=(k|K|千))/);
    const amtE = newraw.match(/(\d{0,2}\.\d?|[1-9]\d?)(?=(亿|E|e)\s)/);
    let amt;
    if (amtW1 !== null) {
      amt = amtW1[0] / 10000;
    } else if (amtW2 !== null) {
      amt = amtW2[0] / 10;
    } else if (amtE !== null) {
      amt = amtE[0];
    } else {
      amt = 0;
    }
    if (isSell) {
      return { buyamt: 0, sellamt: amt, netamt: amt };
    } else {
      return { buyamt: amt, sellamt: 0, netamt: -1 * amt };
    }
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.TextColumns.map((col) => {
      if (!col.editable) {
        return col;
      } else {
        return {
          ...col,
          onCell: record => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
          }),
        };
      }
    });
    return (
      <div className={styles.normal}>
        <Row gutter={16}>
          <Col span={8}>
            <Row >
              <Col span={8}>
                <Select
                  placeholder="Please select a trader"
                  style={{ width: 200 }}
                  onChange={this.handleChange}
                >
                  {this.state.selectoption}
                </Select>
              </Col>
              <Col span={10} push={6}>
                <h2 strong>前台共成交：<Tag color="red">{this.state.dealtimes}</Tag>笔</h2>
              </Col>
            </Row>
            <TextArea
              placeholder="中介明天+0的流水写这里"
              allowClear
              rows={30}
              onChange={e => this.setState({ rowtext: e.target.value }, this.getFlows)}
            />
          </Col>
          <Col span={16}>
            <Table
              dataSource={this.state.dataSourceSum}
              columns={this.SumColumns}
              pagination={false}
              size="small"
              scroll={{ y: 300 }}
            />
            <Divider />
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={this.state.dataSource}
              columns={columns}
              pagination={false}
              size="small"
              scroll={{ y: 250 }}
            />
          </Col>
        </Row>
        <Button type="primary" block onClick={this.RexText} style={{ marginRight: 8 }}>
              统计
        </Button>
      </div>
    );
  }
}

export default CalPosition;
