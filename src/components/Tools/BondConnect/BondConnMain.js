import React from 'react';
import { Table, Button, Popconfirm, Row, Col, Tag, message } from 'antd';
import { connect } from 'dva';
import { EditableFormRow, EditableCell } from '../../Utils/EditableCell';
import '../../Utils/EditableCell.css';
import '../../../config';
import styles from './BondConnMain.css';


class BondConnMain extends React.Component {
  componentDidMount() {
    let bc = JSON.parse(window.localStorage.getItem('bc'));
    if (bc !== null) {
      const newData = [];
      bc.forEach((dd) => {
        const temp = dd;
        temp.bid = '-';
        temp.bcbid = '-';
        temp.ofr = '-';
        temp.bcofr = '-';
        newData.push(temp);
      });
      bc = newData;
    } else {
      bc = [];
    }
    this.props.dispatch({
      type: 'brokerQuote/updateBC',
      payload: bc,
    });
  }

  rawcolumns = [
    {
      title: '代码',
      dataIndex: 'bond',
      editable: true,
      width: '10%',
      render: text => <h3 style={{ color: '#4d118b' }}>{text}</h3>,
    },
    {
      title: '中介bid',
      dataIndex: 'bid',
      width: '10%',
      render: text => <h3 style={{ color: 'red' }}>{text}</h3>,
    },
    {
      title: 'bidspread(BP)',
      dataIndex: 'bidspread',
      editable: true,
      width: '10%',
      render: text => <h3 style={{ color: 'red' }}>{text}</h3>,
    },
    {
      title: '买量(mm)',
      dataIndex: 'bidvol',
      editable: true,
      width: '10%',
      render: text => <h3 style={{ color: 'red' }}>{text}</h3>,
    },
    {
      title: '债券通bid',
      dataIndex: 'bcbid',
      width: '10%',
      render: text => <h2 style={{ color: 'red' }}>{text}</h2>,
    },
    {
      title: '债券通ofr',
      dataIndex: 'bcofr',
      width: '10%',
      render: text => <h2 style={{ color: '#548B54' }}>{text}</h2>,
    },
    {
      title: '卖量(mm)',
      dataIndex: 'ofrvol',
      editable: true,
      width: '10%',
      render: text => <h3 style={{ color: '#548B54' }}>{text}</h3>,
    },
    {
      title: 'ofrspread(BP)',
      dataIndex: 'ofrspread',
      editable: true,
      width: '10%',
      render: text => <h3 style={{ color: '#548B54' }}>{text}</h3>,
    },
    {
      title: '中介ofr',
      dataIndex: 'ofr',
      width: '10%',
      render: text => <h3 style={{ color: '#548B54' }}>{text}</h3>,
    },
    {
      title: '删除',
      dataIndex: 'operation',
      width: '5%',
      render: (text, record) =>
        (this.props.bcData.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
            <a>删除</a>
          </Popconfirm>
        ) : null),
    },
  ];

  components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };

  columns = this.rawcolumns.map((col) => {
    if (!col.editable) {
      return col;
    }
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
  });
  handleDelete = (key) => {
    const dataSource = this.props.bcData;
    this.props.dispatch({
      type: 'brokerQuote/updateBC',
      payload: dataSource.filter(item => item.key !== key),
    });
    window.localStorage.setItem('bc', JSON.stringify(dataSource.filter(item => item.key !== key)));
  };

  handleAdd = () => {
    const dataSource = this.props.bcData;
    const timestamp = new Date().getTime();
    // console.log(timestamp);
    const newData = {
      key: timestamp,
      bond: '-',
      bid: '-',
      bidspread: '2',
      bidvol: '100',
      bcbid: '-',
      bcofr: '-',
      ofrvol: '100',
      ofrspread: '2',
      ofr: '-',
    };
    this.props.dispatch({
      type: 'brokerQuote/updateBC',
      payload: [...dataSource, newData],
    });
  };

  handleSave = (row) => {
    const newData = [...this.props.bcData];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    const bid = Number(row.bid);
    const ofr = Number(row.ofr);
    let tempQuote = row;
    if (!isNaN(bid)) {
      const bcbid = (bid + (Number(row.bidspread) / 100)).toFixed(4);
      tempQuote = { ...row, bid, bcbid };
    }
    if (!isNaN(ofr)) {
      const bcofr = (ofr - (Number(row.ofrspread) / 100)).toFixed(4);
      tempQuote = { ...row, ofr, bcofr };
    }

    newData.splice(index, 1, {
      ...item,
      ...tempQuote,
    });
    this.props.dispatch({
      type: 'brokerQuote/updateBC',
      payload: newData,
    });
    window.localStorage.setItem('bc', JSON.stringify(newData));
  };

  generateText =() => {
    const rawText = this.props.bcData;
    let newText = '-------------------------------- \n';
    rawText.forEach((item) => {
      newText = `${newText + item.bond}\t${item.bcbid} / ${item.bcofr}\t${item.bidvol}mm X ${item.ofrvol}mm \n`;
    });
    newText = `${newText}-------------------------------- \n`;
    this.copyToClipboard(newText);
  }

  copyToClipboard = (text) => {
    const textField = document.createElement('textarea');
    textField.value = text;
    document.body.appendChild(textField);
    textField.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? '报价成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
      message.success(msg);
      textField.remove();
    } catch (err) {
      message.error('该浏览器不支持点击复制到剪贴板');
      textField.remove();
    }
  }

  render() {
    return (
      <div className={styles.normal}>
        <Row type="flex">
          <Col span={2}>
            <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
            </Button>
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={this.generateText}>复制到剪切板</Button>
          </Col>
          <Col span={6} push={12}>
            <h3>更新时间：<Tag>{this.props.dataTime}</Tag></h3>
          </Col>
        </Row>
        <Table
          components={this.components}
          rowClassName={() => 'editablerow'}
          bordered
          dataSource={this.props.bcData}
          columns={this.columns}
          pagination={false}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { bcData, quoteprice, dataTime } = state.brokerQuote;
  return {
    bcData,
    quoteprice,
    dataTime,
  };
}

export default connect(mapStateToProps)(BondConnMain);
