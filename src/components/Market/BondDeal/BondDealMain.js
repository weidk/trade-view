import React from 'react';
import { Input, Button, Icon, Table, message } from 'antd';
import fetch from 'dva/fetch';
import moment from 'moment';
import styles from './BondDealMain.css';
import BondDealOptions from './BondDealOptions';

const R = require('ramda');

let filterData = [];
let filterVal = [];
let endDay = moment().format('YYYY-MM-DD');
const filterTraderMethod = [{ text: '询价', value: '询价' }, { text: '撮合', value: '撮合' }, { text: '请求报价', value: '请求报价' }, { text: '一次点击成交', value: '一次点击成交' }];
class BondDealMain extends React.Component {
  constructor() {
    super();
    this.state = {
      filterDropdownVisible: false,
      searchText: '',
      filtered: false,
      data: '',
      // filterTraderMethod: [],
      loading: false,
      avgYield: '',
      totalAmt: '',
      dealCount: '',
    };
  }

  onTableChange = (pagination, filters) => {
    let d = '';
    if (R.length(filters.TRADEMETHOD) > 0) {
      d = R.filter(x => R.contains(x.TRADEMETHOD, filters.TRADEMETHOD))(this.state.data);
    } else {
      d = this.state.data;
    }
    const tAmt = this.calAmt(d);
    const meanYield = this.calMeanyield(d, tAmt);
    const dealCount = R.length(d);
    this.setState({
      totalAmt: tAmt,
      avgYield: meanYield,
      dealCount,
    });
  }
  onInputChange = (e) => {
    this.setState({ searchText: e.target.value });
  }
  onSearch = () => {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: filterData.map((record) => {
        const match = record.DEALBONDNAME.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          DEALBONDNAME: (
            <span>
              {record.DEALBONDNAME.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((text, i) => (
                text.toLowerCase() === searchText.toLowerCase() ?
                  <span key={i} className={styles.highlight}>{text}</span> : text // eslint-disable-line
              ))}
            </span>
          ),
        };
      }).filter(record => !!record),
    });
  }
  // getFilters=() => {
  //   if (this.state.data.length > 0) {
  //     const tempTraderSet = new Set();
  //     this.state.data.forEach(d =>
  //       tempTraderSet.add({ text: d.TRADEMETHOD, value: d.TRADEMETHOD }));
  //     const tempTraderMethod = Array.from(tempTraderSet);
  //     this.setState({ filterTraderMethod: Array.from(tempTraderMethod),
  //     });
  //   }
  // };

  pickerChange = (datevalues) => { endDay = datevalues.format('YYYY-MM-DD'); };
  fetchData = (values) => {
    try {
      if (R.length(values) > 0) {
        this.setState({ loading: true });
        fetch('/api/secondmarketdeal', {
          method: 'POST',
          body: JSON.stringify({ endDate: endDay, bondname: values }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((ds) => {
            let d = '';
            if (R.length(filterVal) > 0) {
              d = R.filter(x => R.contains(x.TRADEMETHOD, filterVal))(ds);
            } else {
              d = ds;
            }
            const tAmt = this.calAmt(d);
            const meanYield = this.calMeanyield(d, tAmt);
            const dealCount = R.length(d);
            this.setState({
              data: ds,
              loading: false,
              totalAmt: tAmt,
              avgYield: meanYield,
              dealCount,
            });
            filterData = ds;
          });
        });
      } else {
        message.warning('请输入代码或简称。');
      }
    } catch (error) {
      this.setState({ loading: false });
      // console.log('error: ', error);
    }
  };
  calAmt = (values) => { return R.sum(R.pluck('DEALTOTALFACEVALUE')(values)) / 10000; }
  calMeanyield = (rawData, tAmt) => {
    return R.sum(R.map(
      x =>
        (x.DEALYIELD * x.DEALTOTALFACEVALUE) / (10000 * tAmt))(rawData)).toFixed(4);
  }

  render() {
    const columns = [{
      title: '简称',
      dataIndex: 'DEALBONDNAME',
      width: 180,
      filterDropdown: (
        <div className={styles.dropdown}>
          <Input
            className={styles.input}
            placeholder="Search name"
            value={this.state.searchText}
            onChange={this.onInputChange}
            onPressEnter={this.onSearch}
          />
          <Button type="primary" onClick={this.onSearch}>Search</Button>
        </div>
      ),
      filterIcon: <Icon type="search" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        this.setState({
          filterDropdownVisible: visible,
        }, () => this.searchInput && this.searchInput.focus());
      },
    }, {
      title: '代码',
      dataIndex: 'DEALBONDCODE',
      width: 150,
    }, {
      title: '净价',
      dataIndex: 'DEALCLEANPRICE',
      width: 150,
    }, {
      title: '收益',
      dataIndex: 'DEALYIELD',
      width: 150,
      sorter: (a, b) => a.DEALYIELD - b.DEALYIELD,
    }, {
      title: '数量',
      dataIndex: 'DEALTOTALFACEVALUE',
      width: 150,
      sorter: (a, b) => a.DEALTOTALFACEVALUE - b.DEALTOTALFACEVALUE,
    }, {
      title: '方式',
      dataIndex: 'TRADEMETHOD',
      filters: filterTraderMethod,
      onFilter: (value, record) => {
        filterVal = value;
        return record.TRADEMETHOD.indexOf(value) === 0;
      },
      width: 150,

    }, {
      title: '时间',
      dataIndex: 'TRANSACTTIME',
      width: 200,
    },
    ];
    return (
      <div className={styles.normal}>
        <BondDealOptions
          pickerChange={this.pickerChange}
          fetchData={this.fetchData}
          yield={this.state.avgYield}
          amt={this.state.totalAmt}
          dealcounts={this.state.dealCount}
        />
        <br />
        <Table
          columns={columns} dataSource={this.state.data}
          scroll={{ y: 500 }} pagination={false}
          loading={this.state.loading}
          onChange={this.onTableChange}
        />
      </div>
    );
  }
}

export default BondDealMain;
