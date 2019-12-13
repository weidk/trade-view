import React from 'react';
import { Drawer, Input, Row, Col, Button, Select, Table, message, Tag } from 'antd';
import fetch from 'dva/fetch';
import { EditableFormRow, EditableCell } from '../../Utils/EditableCell';
import '../../Utils/EditableCell.css';
import styles from './TextModal.css';

const { TextArea } = Input;
const _ = require('lodash');

class TextModalNew extends React.Component {
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
    }, {
      title: '非现券头寸',
      editable: true,
      dataIndex: 'nonbond',
      width: '20%',
    }];

    this.state = {
      rowtext: '',
      trader: '',
      dataSource: [],
      nonbondText: '',
      check: false,
      plus1Data: [],
      dealtimes: '',
      rowbond: '',
    };
  }

  // eslint-disable-next-line react/sort-comp
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    // eslint-disable-next-line no-param-reassign
    row.netamt = (row.sellamt - row.buyamt).toFixed(2);
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
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

        // 做了前台的+1的流水
        this.state.plus1Data.forEach((d) => {
          key += 1;
          newList.push({ key, trader: d.trader, bondcode: d.bondcode, buyamt: d.buyamt, sellamt: d.sellamt, netamt: d.netamt, note: `前台：${d.TOTALDEALTIMES}笔` });
        });
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
        // 非现券头寸
        if (this.state.nonbondText !== '') {
          const nonbondTextList = _.split(this.state.nonbondText, /[\r\n]/);
          nonbondTextList.forEach((text) => {
            const tt = text.replace(/\s+/, '');
            if (tt !== '') {
              key += 1;
              newList.push({ key, trader: this.state.trader, nonbond: tt });
            }
          });
        }
        // 其他现券头寸
        if (this.state.rowbond !== '') {
          // eslint-disable-next-line no-unused-vars
          let rawList = _.split(this.state.rowbond, /[\r\n]/);
          rawList = _.map(rawList, _.trim);
          rawList = rawList.forEach((tempStr) => {
            const newtempStr = tempStr.replace(/\s+/g, ' '); // 将多个空格替换成一个空格
            const strList = _.split(newtempStr, /\s/); // 按空格分割为数组
            const bondcode = strList[0];
            let buyamt = _.find(strList, o => o.indexOf('买') !== -1);
            if (buyamt !== undefined) {
              buyamt = buyamt.match(/\d+\.?\d*/)[0];
            } else {
              buyamt = 0;
            }
            let sellamt = _.find(strList, o => o.indexOf('卖') !== -1);
            if (sellamt !== undefined) {
              sellamt = sellamt.match(/\d+\.?\d*/)[0];
            } else {
              sellamt = 0;
            }
            let frozeamt = _.find(strList, o => o.indexOf('冻') !== -1);
            if (frozeamt !== undefined) {
              frozeamt = frozeamt.match(/\d+\.?\d*/)[0];
            } else {
              frozeamt = 0;
            }
            const netamt = (sellamt - buyamt).toFixed(2);
            let note = newtempStr.match(/(\(|（).*(）|\))/);
            // let note = newtempStr.match(/(\(|（)(.+?)\)/g);
            if (note !== null) {
              note = note[0].replace(/(\(|（|）|\))/g, '');
            } else {
              note = '-';
            }
            if (bondcode !== '') {
              key += 1;
              newList.push({ key, trader: this.state.trader, bondcode, buyamt, sellamt, netamt, frozeamt, note });
            }
          });
        }
        this.setState({ dataSource: newList });
        if (newList.length > 0) {
          if (newList[0].trader !== '') {
            this.setState({ check: true });
          } else {
            message.error('请选择交易员！');
          }
        } else {
          this.setState({ check: false });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

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
    const amtW2 = newraw.match(/[1-9]{1,2}(?=(k|K|千))/);
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
        <Drawer
          title="请将原始文本粘贴在左侧"
          visible={this.props.visible}
          // onOk={this.props.handleOk}
          onClose={() => {
            this.setState({ check: false });
            this.props.handleCancel();
          }}
          placement="top"
          closable={false}
          height="800"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Row >
                <Col span={8}>
                  <Select
                    placeholder="Please select a trader"
                    style={{ width: 200 }}
                    onChange={this.handleChange}
                  >
                    {this.props.selectchildren}
                  </Select>
                </Col>
                <Col span={10} push={6}>
                  <h2 strong>前台共成交：<Tag color="red">{this.state.dealtimes}</Tag>笔</h2>
                </Col>
              </Row>
              <TextArea
                placeholder="中介明天+0的流水写这里"
                allowClear
                rows={20}
                onChange={e => this.setState({ rowtext: e.target.value }, this.getFlows)}
              />
              <TextArea
                placeholder="非现券的其他事项写在这里（远期、保证金划转、到期兑付、票息、借贷、质押.....）"
                allowClear
                rows={7}
                onChange={e => this.setState({ nonbondText: e.target.value }, this.getFlows)}
              />
              <TextArea
                allowClear
                placeholder="下个交易日结算的现券头寸写这里"
                rows={5}
                onChange={e => this.setState({ rowbond: e.target.value }, this.getFlows)}
              />
            </Col>
            <Col span={16}>
              <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={this.state.dataSource}
                columns={columns}
                pagination={false}
                size="small"
                scroll={{ y: 600 }}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Button type="primary" block onClick={this.RexText} style={{ marginRight: 8 }}>
              识别
              </Button>
            </Col>
            <Col span={8} />
            <Col span={8}>
              <Button
                type="danger"
                block
                disabled={!this.state.check}
                onClick={() => {
                  if (this.state.check) {
                    this.setState({ check: false });
                    this.props.handleOk(this.state.dataSource);
                  } else {
                    message.error('清先解析文本！');
                  }
                }}
              >
              提交
              </Button>
            </Col>
          </Row>
        </Drawer>
      </div>
    );
  }
}


export default TextModalNew;
