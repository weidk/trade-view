import React from 'react';
import { Drawer, Input, Row, Col, Button, Select, Table, message } from 'antd';
import { EditableFormRow, EditableCell } from '../../Utils/EditableCell';
import '../../Utils/EditableCell.css';
import styles from './TextModal.css';

const { TextArea } = Input;
const _ = require('lodash');

class TextModal extends React.Component {
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
    },
    // {
    //   title: '冻结(亿)',
    //   editable: true,
    //   dataIndex: 'frozeamt',
    //   width: '10%',
    //   render: text => <h2 style={{ color: text >= 0 ? 'black' : 'red' }}>{text}</h2>,
    // },
    {
      title: '备注',
      editable: true,
      dataIndex: 'note',
      width: '10%',
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
    };
  }

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
    this.setState({ trader: value });
  }

  RexText = () => {
    if (this.state.trader === '') {
      message.error('请选择交易员姓名');
    } else {
      const raw = this.state.rowtext;
      try {
      // eslint-disable-next-line no-unused-vars
        let rawList = _.split(raw, /[\r\n]/);
        rawList = _.map(rawList, _.trim);
        const newList = [];
        let key = 0;
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
        const nonbondTextList = _.split(this.state.nonbondText, /[\r\n]/);
        nonbondTextList.forEach((text) => {
          const tt = text.replace(/\s+/, '');
          if (tt !== '') {
            key += 1;
            newList.push({ key, trader: this.state.trader, nonbond: tt });
          }
        });
        // newList.push({ trader: this.state.trader, nonbond: this.state.nonbondText });
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
  }

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
          height="600"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Select
                placeholder="Please select a trader"
                style={{ width: 300 }}
                onChange={this.handleChange}
              >
                {this.props.selectchildren}
              </Select>
              <TextArea
                allowClear
                placeholder="下个交易日结算的现券头寸写这里"
                rows={15}
                onChange={e => this.setState({ rowtext: e.target.value })}
              />
              <TextArea
                placeholder="非现券的其他事项写在这里（远期、保证金划转、到期兑付、票息、借贷、质押.....）"
                allowClear
                rows={5}
                onChange={e => this.setState({ nonbondText: e.target.value })}
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
                scroll={{ y: 400 }}
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

export default TextModal;
