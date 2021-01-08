import React from 'react';
import { DatePicker, Table, Checkbox, Row, Col, Divider, Tabs, Spin, Affix } from 'antd';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import fetch from 'dva/fetch';
import ProfitTableDv01 from './ProfitTableDv01';
import PosDetails from './PosDetails';

const R = require('ramda');

const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;

class ProfitTable extends React.Component {
  constructor() {
    super();
    this.state = {
      tableData: [],
      filteredData: [],
      investtypeOptions: [],
      checkedList: [],
      indeterminate: true,
      checkAll: true,
      maxDate: null,
      selectedData: null,
      dv01: [],
      posdetail: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getFilters();
  }


  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < this.state.investtypeOptions.length,
      checkAll: checkedList.length === this.state.investtypeOptions.length,
    }, () => this.onFilterData());
  };

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? this.state.investtypeOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    }, () => this.onFilterData());
  };

  onFilterData = () => {
    const filteredData = R.filter(item => this.state.checkedList.includes(item.InvestType), this.state.tableData);
    this.setState({ filteredData });
  }

  getFilters=() => {
    fetch('/api/allinvesttype')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        const InvestType = R.pluck('investtype')(jsonData.filterItem);
        const filterInvestType = R.uniq(InvestType);
        this.setState({
          investtypeOptions: filterInvestType,
          checkedList: filterInvestType,
          maxDate: moment(jsonData.maxDate, 'YYYY-MM-DD'),
          selectedData: moment(jsonData.maxDate, 'YYYY-MM-DD'),
        }, () => this.pickerChange(this.state.maxDate));
      });
  };


  pickerChange = (values) => {
    this.setState({ loading: true });
    this.fetchProfittableData(values);
    this.fetchDv01Data(values);
    this.fetchDetailsData(values);
  }

  fetchProfittableData = (values) => {
    try {
      fetch('/api/reprotprofittable', {
        method: 'POST',
        body: JSON.stringify(values.format('YYYY-MM-DD')),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ tableData: ds, selectedData: moment(values.format('YYYY-MM-DD'), 'YYYY-MM-DD'), loading: false }, () => this.onFilterData());
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  fetchDv01Data = (values) => {
    try {
      fetch('/api/dv01byduration', {
        method: 'POST',
        body: JSON.stringify(values.format('YYYY-MM-DD')),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ dv01: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  fetchDetailsData = (values) => {
    try {
      fetch('/api/postposdetails', {
        method: 'POST',
        body: JSON.stringify(values.format('YYYY-MM-DD')),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ posdetail: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }
  render() {
    const columns = [{
      title: '账户',
      dataIndex: 'InvestType',
      // filters: this.state.filterTraders,
      fixed: 'left',
      width: 150,
      align: 'right',
      render: text => <h3>{text}</h3>,
      // onFilter: (value, record) => record.InvestType.includes(value),
    },
    {
      title: '总盈亏',
      dataIndex: 'TotalProfit',
      width: 150,
      align: 'right',

      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '票面利息',
      dataIndex: 'InterestProfit',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '净价盈亏',
      dataIndex: 'ClearPriceProfit',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '较上日盈亏',
      dataIndex: 'TotalProfitChange',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '加权占资',
      dataIndex: 'WeightedMoney',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '持有期收益率(%)',
      dataIndex: 'InvestReturn',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '年化收益率(%)',
      dataIndex: 'InvestReturn_Year',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '融资成本',
      dataIndex: 'MoneyCost',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '净盈亏',
      dataIndex: 'NetProfit',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '加权本金',
      dataIndex: 'WeightedPrinciple',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '净年化收益率(%)',
      dataIndex: 'InvestNetReturn_Year',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '基点价值',
      dataIndex: 'BpValue',
      width: 150,
      align: 'right',
      render: (text) => {
        if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
          return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
        }
      },
    },
    {
      title: '现货',
      children: [
        {
          title: '总盈亏',
          dataIndex: 'SpotProfit',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '较上日盈亏',
          dataIndex: 'SpotProfitChange',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '名义本金',
          dataIndex: 'SpotFaceValue',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '市值',
          dataIndex: 'SpotMarketValue',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '基点价值',
          dataIndex: 'SpotBpValue',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
      ],
    },
    {
      title: '期货',
      children: [
        {
          title: '总盈亏',
          dataIndex: 'FutureProfit',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '较上日盈亏',
          dataIndex: 'FutureProfitChange',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '持仓',
          dataIndex: 'FutureScale',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '市值',
          dataIndex: 'FutureMarketValue',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '基点价值',
          dataIndex: 'FutureBpValue',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
      ],
    },
    {
      title: '互换',
      children: [
        {
          title: '总盈亏',
          dataIndex: 'SwapProfit',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '较上日盈亏',
          dataIndex: 'SwapProfitChange',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '持仓',
          dataIndex: 'SwapScale',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '市值',
          dataIndex: 'SwapMarketValue',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '基点价值',
          dataIndex: 'SwapBpValue',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
      ],
    },
    {
      title: '转债',
      children: [
        {
          title: '总盈亏',
          dataIndex: 'CBProfit',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '较上日盈亏',
          dataIndex: 'CBProfitChange',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '持仓',
          dataIndex: 'CBScale',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '市值',
          dataIndex: 'CBMarketValue',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
        {
          title: '基点价值',
          dataIndex: 'CBBpValue',
          width: 150,
          align: 'right',
          render: (text) => {
            if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
              return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
            }
          },
        },
      ],
    },
    ];

    return (
      <div>
        <Spin size="large" spinning={this.state.loading}>
          <Affix offsetTop={this.state.top}>
            <Row type="flex">
              <Col span={5}>
                <h4> 日期 ：
                <DatePicker onChange={this.pickerChange} value={this.state.selectedData} />
                </h4>
              </Col>
              <Col span={1}>
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
            全选
                </Checkbox>
              </Col>
              <Col span={18}>
                <CheckboxGroup
                  options={this.state.investtypeOptions}
                  value={this.state.checkedList}
                  onChange={this.onChange}
                />
              </Col>
            </Row>
          </Affix>
          <Divider />
          <Table
            columns={columns}
            dataSource={this.state.filteredData}
            bordered
            pagination={false}
            size="small"
            scroll={{ x: 5000 }}
          />
          <Tabs defaultActiveKey="1" tabPosition="top">
            <TabPane tab="DV01" key="1"><ProfitTableDv01 chartdata={this.state.dv01} showfun={this.state.checkedList} /></TabPane>
            <TabPane tab="持仓明细" key="2"><PosDetails tabledata={this.state.posdetail} showfun={this.state.checkedList} /></TabPane>
          </Tabs>
        </Spin>
      </div>
    );
  }
}

export default ProfitTable;
