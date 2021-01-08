import React, { Fragment } from 'react';
import { DatePicker, Table, Spin, Row, Col, Button, Divider, Tag, Input, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import fetch from 'dva/fetch';
import moment from 'moment';
import styles from './BPMPosition.css';
import request from '../../../utils/request';
import { EditableFormRow, EditableCell } from '../../Utils/EditableCell';
import '../../Utils/EditableCell.css';

const R = require('ramda');
const _ = require('lodash');
const ExportJsonExcel = require('js-export-excel');

class BPMPosition extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filterTraders: [],
      loading: false,
      filteredData: [],
      filteredList: [],
      bpmnote: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }

   getFilters=() => {
     const { data } = this.state;
     if (data.length > 0) {
       // const tempTraderSet = new Set();
       // data.forEach(d => tempTraderSet.add({ text: d.DEALUSERNAME, value: d.DEALUSERNAME }));
       // const tempTraderArr = Array.from(tempTraderSet);
       // this.setState({ filterTraders: Array.from(tempTraderArr) });

       const traders = R.pluck('DEALUSERNAME')(data);
       const filterTrader = R.uniq(traders);
       const traderList = [];
       filterTrader.forEach(d => traderList.push({ text: d, value: d }));
       this.setState({ filterTraders: traderList,
       });
     }
   };

  // eslint-disable-next-line react/sort-comp
  pickerChange = (values) => {
    if (values.format('YYYYMMDD') === moment().format('YYYYMMDD')) {
      this.fetchData();
    } else {
      try {
        fetch('/api/hisbpmpositon', {
          method: 'POST',
          body: JSON.stringify(values.format('YYYYMMDD')),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          response.json().then((ds) => {
            this.setState({ data: ds, filteredData: this.state.filteredList.length === 0 ? ds : _.filter(ds, o => this.state.filteredList.includes(o.DEALUSERNAME)) });
            this.getFilters();
          });
        });
      } catch (error) {
        // console.log('error: ', error);
      }
    }
  }


  fetchData = () => {
    this.setState({ loading: true });
    let bpmnote = JSON.parse(window.localStorage.getItem('bpmnote'));
    if (bpmnote === null) {
      bpmnote = [];
    }
    const pms = request('/api/bpmpositon');
    pms.then((datas) => {
      const completedata = datas.data.map(
        (o) => {
          const filteredValue = _.filter(bpmnote, { BONDCODE: o.BONDCODE, DEALUSERNAME: o.DEALUSERNAME });
          if (filteredValue.length === 0) {
            return { ...o, NOTE: '--' };
          } else {
            return { ...o, NOTE: filteredValue[0].NOTE };
          }
        },
      );
      this.setState({ bpmnote, data: completedata, filteredData: this.state.filteredList.length === 0 ? datas.data : _.filter(datas.data, o => this.state.filteredList.includes(o.DEALUSERNAME)), loading: false });
      this.getFilters();
    }).catch(err => ({ err }));
  }

  writeToExcel = () => {
    const option = {};
    option.fileName = 'BPM持仓';
    option.datas = [
      {
        sheetData: this.state.data,
        // sheetHeader: ['账户', '债券简称', '债券代码', '可用持仓', '总持仓', '成本(%)', '票息收入(万)', '资本利得(万)', '总收益(万)', '加权持有(天)'],
        sheetHeader: Object.keys(this.state.data[0]),
      },
    ];
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1DA57A' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      (this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleSave = (row) => {
    const newData = this.state.bpmnote;
    const tableData = this.state.data;
    const index = newData.findIndex(item => row.BONDCODE === item.BONDCODE && row.DEALUSERNAME === item.DEALUSERNAME);
    if (index === -1) {
      newData.push(row);
    } else {
      newData.splice(index, 1, row);
    }
    const index2 = tableData.findIndex(item => row.BONDCODE === item.BONDCODE && row.DEALUSERNAME === item.DEALUSERNAME);
    tableData.splice(index2, 1, row);
    this.setState({ bpmnote: newData, data: tableData });
    window.localStorage.setItem('bpmnote', JSON.stringify(newData));
  };

  render() {
    const rawcolumns = [{
      title: '交易员',
      dataIndex: 'DEALUSERNAME',
      filters: this.state.filterTraders,
      onFilter: (value, record) => record.DEALUSERNAME.includes(value),
      width: 150,
    }, {
      title: '债券代码',
      dataIndex: 'BONDCODE',
      width: 150,
      ...this.getColumnSearchProps('BONDCODE'),
    }, {
      title: '债券简称',
      dataIndex: 'BONDNAME',
      width: 200,
      ...this.getColumnSearchProps('BONDNAME'),
    }, {
      title: '可用持仓',
      dataIndex: 'AVAILABLEFACEVALUE',
      width: 150,
      filters: [
        { text: '0', value: 0 },
        { text: '大於0', value: 1 },
      ],
      onFilter: (value, record) => {
      // console.log(value);
      // console.log(record);
        if (value > 0) {
          return record.AVAILABLEFACEVALUE > 0;
        } else {
          return record.AVAILABLEFACEVALUE === '0';
        }
      },
    },
    {
      title: '总持仓',
      dataIndex: 'TOTALFACEVALUE',
      width: 150,
    },
    // {
    //   title: '加权持有(天)',
    //   dataIndex: 'WEIGHTEDDAYS',
    //   width: 150,
    // },
    // {
    //   title: '成本(%)',
    //   dataIndex: 'COST',
    //   width: 150,
    // },
    // {
    //   title: '票息收入(万)',
    //   dataIndex: 'COUPONINCOME',
    //   width: 150,
    //   render: (text) => {
    //     if (text < 0) { return <div style={{ color: 'red' }} >{text}</div>; } else {
    //       return <div>{text}</div>;
    //     }
    //   },
    // },
    // {
    //   title: '资本利得(万)',
    //   dataIndex: 'CAPITALGAINS',
    //   width: 150,
    //   render: (text) => {
    //     if (text < 0) { return <div style={{ color: 'red' }} >{text}</div>; } else {
    //       return <div>{text}</div>;
    //     }
    //   },
    // },
    // {
    //   title: '总收益(万)',
    //   dataIndex: 'TOTALGAINS',
    //   width: 150,
    //   render: (text) => {
    //     if (text < 0) { return <div style={{ color: 'red' }} >{text}</div>; } else {
    //       return <div>{text}</div>;
    //     }
    //   },
    // },
    // {
    //   title: '备注',
    //   dataIndex: 'NOTE',
    //   editable: true,
    //   width: 150,
    //   render: (text) => {
    //     if (text !== '--') { return <h3>{text}</h3>; } else {
    //       return <div style={{ color: '#FFFAFA' }}>{text}</div>;
    //     }
    //   },
    // },
    ];

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = rawcolumns.map((col) => {
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
      <Fragment>
        <Row>
          <Col span={6}>
            <h4> 结算日 ：
            <DatePicker onChange={this.pickerChange} defaultValue={moment()} />
            </h4>
          </Col>
          <Col span={14}>
            <Divider>
              总持仓合计：<Tag color="#ec6663">{(_.sumBy(this.state.filteredData, 'TOTALFACEVALUE') / 10000).toFixed(2)}</Tag> 亿
            </Divider>
          </Col>
          <Col span={2} offset={2}>
            <Button type="primary" onClick={this.writeToExcel}>导出excel</Button>
          </Col>
        </Row>
        <Spin spinning={this.state.loading}>
          <Table
            components={components}
            className={styles.anttable}
            columns={columns}
            bordered
            rowKey={record => record.DEALUSERNAME + record.BONDCODE}
            size="small"
            dataSource={this.state.data}
            pagination={false}
            scroll={{ y: 600 }}
            onChange={(pagination, filters) => {
              try {
                this.setState({ filteredList: filters.DEALUSERNAME, filteredData: filters.DEALUSERNAME.length === 0 ? this.state.data : _.filter(this.state.data, o => filters.DEALUSERNAME.includes(o.DEALUSERNAME)) });
                // eslint-disable-next-line no-empty
              } catch (err) {}
            }}
          />
        </Spin>
      </Fragment>
    );
  }
}
export default BPMPosition;
