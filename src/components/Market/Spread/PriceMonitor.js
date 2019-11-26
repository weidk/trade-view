/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import { Table, Button, Popconfirm, Tag } from 'antd';
import { connect } from 'dva';
import fetch from 'dva/fetch';
import { EditableFormRow, EditableCell } from '../../Utils/EditableCell';


const R = require('ramda');

let SubscribeCode = '';

// eslint-disable-next-line react/no-multi-comp
class PriceMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '空头代码',
        dataIndex: 'shortbond',
        editable: true,
        width: '10%',
        render: text => <h3 style={{ color: '#548B54' }}>{text}</h3>,
      },
      {
        title: '多头代码',
        dataIndex: 'longbond',
        editable: true,
        width: '10%',
        render: text => <h3 style={{ color: 'red' }}>{text}</h3>,
      },
      {
        title: '监测基差',
        dataIndex: 'spreadcost',
        editable: true,
        width: '8%',
        render: text => <h3 style={{ color: '#CD950C' }}>{text}</h3>,
      },
      {
        title: '当前基差',
        dataIndex: 'newspread',
        width: '7%',
        // render: text => <Tag color="#CD950C">{text}</Tag>,
        render: (text, record) => {
          if (record.shortnewyield !== '' & record.longnewyield !== '') {
            return <Tag color="#CD950C">{text}</Tag>;
          }
        },
      },
      {
        title: '删除',
        dataIndex: 'operation',
        width: '5%',
        render: (text, record) =>
          (this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null),
      },
    ];
    this.state = {
      dataSource: [
      ],
    };
  }

  componentDidMount() {
    let mySpread = JSON.parse(window.localStorage.getItem('monitor'));
    if (mySpread !== null) {
      const newData = [];
      mySpread.forEach((dd) => {
        const temp = dd;
        temp.shortnewyield = '';
        temp.longnewyield = '';
        temp.newspread = '';
        newData.push(temp);
      });
      mySpread = newData;
    } else {
      mySpread = [];
    }
    this.setState({ dataSource: mySpread }, () => { this.updateSubSubscribeCode(); });
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.tradeprice !== this.props.tradeprice) {
      const newtrade = nextProps.tradeprice;
      let bondcode = newtrade.BONDCODE;
      bondcode = bondcode.replace('.IB', '');
      if (SubscribeCode.includes(bondcode)) {
        const newData = [];
        this.state.dataSource.forEach((dd) => {
          const temp = dd;
          if (dd.longbond === bondcode) {
            temp.longnewyield = newtrade.DEALPRICE;
          }
          if (dd.shortbond === bondcode) {
            temp.shortnewyield = newtrade.DEALPRICE;
          }
          temp.newspread = (temp.shortnewyield - temp.longnewyield).toFixed(4);
          newData.push(temp);
        });
        this.setState({ dataSource: newData });
      }
    }
  }


  updateSubSubscribeCode = () => {
    const bondArr = [...R.pluck('longbond')(this.state.dataSource), ...R.pluck('shortbond')(this.state.dataSource)];
    SubscribeCode = R.uniq(bondArr);

    try {
      if (SubscribeCode.length > 0) {
        fetch('/api/spreadlatestyield', {
          method: 'POST',
          body: JSON.stringify(SubscribeCode),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((ds) => {
            const newData = [];
            this.state.dataSource.forEach((dd) => {
              const temp = dd;
              // 获取最新成交价
              if (dd.longnewyield === '') {
                const t = R.find(R.propEq('bondcode', temp.longbond))(ds);
                if (typeof t !== 'undefined') {
                  temp.longnewyield = R.find(R.propEq('bondcode', temp.longbond))(ds).dealprice;
                }
              }
              if (dd.shortnewyield === '') {
                const t = R.find(R.propEq('bondcode', temp.shortbond))(ds);
                if (typeof t !== 'undefined') {
                  temp.shortnewyield = R.find(R.propEq('bondcode', temp.shortbond))(ds).dealprice;
                }
              }
              // 计算最新spread以及浮动盈亏
              temp.newspread = (temp.shortnewyield - temp.longnewyield).toFixed(4);
              newData.push(temp);
            });
            this.setState({ dataSource: newData });
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) }, () => { this.updateSubSubscribeCode(); });
    window.localStorage.setItem('monitor', JSON.stringify(this.state.dataSource));
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    const timestamp = new Date().getTime();
    // console.log(timestamp);
    const newData = {
      key: timestamp,
      longbond: '-',
      shortbond: '-',
      spreadcost: '-',
      longnewyield: '',
      shortnewyield: '',
      newspread: '',
    };
    this.setState({
      dataSource: [...dataSource, newData],
    });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData }, () => { this.updateSubSubscribeCode(); });
    window.localStorage.setItem('monitor', JSON.stringify(newData));
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
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
    return (
      <div>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editablerow'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { tradeprice } = state.brokerhq;
  return {
    tradeprice,
  };
}

export default connect(mapStateToProps)(PriceMonitor);
