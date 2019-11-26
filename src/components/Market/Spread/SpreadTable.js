/* eslint-disable react/no-multi-comp,no-mixed-operators,max-len,react/no-did-mount-set-state,no-empty */
import React from 'react';
import { Table, Input, Button, Popconfirm, Form, Tag } from 'antd';
import { connect } from 'dva';
import fetch from 'dva/fetch';
import '../../../config';
import './SpreadTable.css';

// const Stomp = require('stompjs');
const R = require('ramda');

// const client = null;
let SubscribeCode = '';
const EditableContext = React.createContext();

const EditableRow = ({ form, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = (e) => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = (form) => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class SpreadTable extends React.Component {
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
        title: '空DV01(万)',
        dataIndex: 'shortunit',
        width: '8%',
        editable: true,
        render: text => <h3 style={{ color: '#548B54' }}>{text}</h3>,
      },
      {
        title: '空头成本',
        dataIndex: 'shortcost',
        editable: true,
        width: '8%',
        render: text => <h3 style={{ color: '#548B54' }}>{text}</h3>,
      },
      {
        title: '多DV01(万)',
        dataIndex: 'longunit',
        editable: true,
        width: '8%',
        render: text => <h3 style={{ color: 'red' }}>{text}</h3>,
      },
      {
        title: '多头成本',
        dataIndex: 'longcost',
        editable: true,
        width: '8%',
        render: text => <h3 style={{ color: 'red' }}>{text}</h3>,
      },

      {
        title: '建仓基差',
        dataIndex: 'spreadcost',
        editable: false,
        width: '8%',
        render: text => <h3 style={{ color: '#CD950C' }}>{text}</h3>,
      },
      {
        title: '空最新价',
        dataIndex: 'shortnewyield',
        width: '7%',
        render: (text) => {
          if (text !== '') {
            return <Tag color="#548B54">{text}</Tag>;
          }
        },
      },
      {
        title: '多最新价',
        dataIndex: 'longnewyield',
        width: '7%',
        render: (text) => {
          if (text !== '') {
            return <Tag color="red">{text}</Tag>;
          }
        },
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
        title: '基差变动',
        dataIndex: 'spreadprofit',
        width: '7%',
        render: (text, record) => {
          if (record.shortnewyield !== '' & record.longnewyield !== '') {
            if (text > 0) { return <Tag color="#FF6A6A">{text}</Tag>; } else {
              return <Tag color="#3CB371">{text}</Tag>;
            }
          }
        },
      },
      {
        title: '盈亏(万)',
        dataIndex: 'profit',
        width: '7%',
        render: (text, record) => {
          if (text !== '') {
            if ((record.shortnewyield !== '' & record.shortcost !== '-') | (record.longnewyield !== '' & record.longcost !== '-')) {
              if (text > 0) { return <Tag color="#FF6A6A">{text}</Tag>; } else {
                return <Tag color="#3CB371">{text}</Tag>;
              }
            }
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
    let mySpread = JSON.parse(window.localStorage.getItem('mySpread'));
    if (mySpread !== null) {
      const newData = [];
      mySpread.forEach((dd) => {
        const temp = dd;
        temp.shortnewyield = '';
        temp.longnewyield = '';
        temp.newspread = '';
        temp.profit = '';
        newData.push(temp);
      });
      mySpread = newData;
    } else {
      mySpread = [];
    }
    this.setState({ dataSource: mySpread }, () => { this.updateSubSubscribeCode(); });


    // eslint-disable-next-line no-undef
    // const ws = new WebSocket(global.constants.rabbimqws);
    // client = Stomp.over(ws);
    // client.heartbeat.incoming = 0;
    // client.connect('bond', 'bond', this.onOpenHandle, this.onErrorHandle, '/');
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.tradeprice !== state.tradeprice) {
  //     console.log('-------------update-----------');
  //   }
  // }

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
          temp.spreadprofit = (temp.newspread - temp.spreadcost).toFixed(4);
          if (temp.shortbond === '-' & temp.longbond !== '-') {
            temp.profit = (100 * (temp.longcost - temp.longnewyield) * temp.longunit).toFixed(2);
          } else if (temp.longbond === '-' & temp.shortbond !== '-') {
            temp.profit = (100 * (temp.shortnewyield - temp.shortcost) * temp.shortunit).toFixed(2);
          } else if (temp.shortnewyield !== '' & temp.longnewyield !== '') { temp.profit = (100 * (temp.shortnewyield - temp.shortcost) * temp.shortunit + 100 * (temp.longcost - temp.longnewyield) * temp.longunit).toFixed(2); }
          newData.push(temp);
        });
        this.setState({ dataSource: newData });
      }
    }
  }


  // onOpenHandle = () => {
  //   console.log('Connection open ...');
  //   client.subscribe('/exchange/BROKERTRADE/', (d) => {
  //     const newtrade = JSON.parse(d.body);
  //     let bondcode = newtrade.BONDCODE;
  //     bondcode = bondcode.replace('.IB', '');
  //     if (SubscribeCode.includes(bondcode)) {
  //       const newData = [];
  //       this.state.dataSource.forEach((dd) => {
  //         const temp = dd;
  //         if (dd.longbond === bondcode) {
  //           temp.longnewyield = newtrade.DEALPRICE;
  //         }
  //         if (dd.shortbond === bondcode) {
  //           temp.shortnewyield = newtrade.DEALPRICE;
  //         }
  //         temp.newspread = (temp.shortnewyield - temp.longnewyield).toFixed(4);
  //         temp.spreadprofit = (temp.newspread - temp.spreadcost).toFixed(4);
  //         if (temp.shortbond === '-' & temp.longbond !== '-') {
  //           temp.profit = (100 * (temp.longcost - temp.longnewyield) * temp.longunit).toFixed(2);
  //         } else if (temp.longbond === '-' & temp.shortbond !== '-') {
  //           temp.profit = (100 * (temp.shortnewyield - temp.shortcost) * temp.shortunit).toFixed(2);
  //         } else if (temp.shortnewyield !== '' & temp.longnewyield !== '') { temp.profit = (100 * (temp.shortnewyield - temp.shortcost) * temp.shortunit + 100 * (temp.longcost - temp.longnewyield) * temp.longunit).toFixed(2); }
  //         newData.push(temp);
  //       });
  //       this.setState({ dataSource: newData });
  //     }
  //   }, {
  //     'auto-delete': true,
  //   });
  // }
  //
  // onErrorHandle = (evt) => {
  //   console.log(`error: ${evt}`);
  // }

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
              // 计算基差
              if (temp.shortcost !== '-' & temp.longcost !== '-') {
                temp.spreadcost = (temp.shortcost - temp.longcost).toFixed(4);
              }
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
              temp.spreadprofit = (temp.newspread - temp.spreadcost).toFixed(4);
              if (temp.shortbond === '-' & temp.longbond !== '-') {
                temp.profit = (100 * (temp.longcost - temp.longnewyield) * temp.longunit).toFixed(2);
              } else if (temp.longbond === '-' & temp.shortbond !== '-') {
                temp.profit = (100 * (temp.shortnewyield - temp.shortcost) * temp.shortunit).toFixed(2);
              } else if (temp.shortnewyield !== '' & temp.longnewyield !== '') { temp.profit = (100 * (temp.shortnewyield - temp.shortcost) * temp.shortunit + 100 * (temp.longcost - temp.longnewyield) * temp.longunit).toFixed(2); }

              newData.push(temp);
            });
            this.setState({ dataSource: newData });
          });
        });
      }
    } catch (error) {
    }
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) }, () => {
      this.updateSubSubscribeCode();
      window.localStorage.setItem('mySpread', JSON.stringify(this.state.dataSource));
    });
    // window.localStorage.setItem('mySpread', JSON.stringify(this.state.dataSource));
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    const timestamp = new Date().getTime();
    // console.log(timestamp);
    const newData = {
      key: timestamp,
      longunit: '-',
      longbond: '-',
      shortunit: '-',
      shortbond: '-',
      longcost: '-',
      shortcost: '-',
      spreadcost: '-',
      longnewyield: '',
      shortnewyield: '',
      newspread: '',
      spreadprofit: '',
      profit: '',
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
    this.setState({ dataSource: newData }, () => {
      this.updateSubSubscribeCode();
      window.localStorage.setItem('mySpread', JSON.stringify(newData));
    });
    // window.localStorage.setItem('mySpread', JSON.stringify(newData));
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
          rowClassName={() => 'editable-row'}
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

export default connect(mapStateToProps)(SpreadTable);
