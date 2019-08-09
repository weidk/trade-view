import React from 'react';
import fetch from 'dva/fetch';
import moment from 'moment';
import { DatePicker, Row, Col, Divider, Slider, Select, Table } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import styles from './IndustryMain.css';

const R = require('ramda');

const { Option } = Select;

const RangePicker = DatePicker.RangePicker;

const columns = [
  {
    title: '债券简称',
    dataIndex: 'DEALBONDNAME',
    width: 150,
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
  },
];

class IndustryMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      filterdata: [],
      max: 10000,
      selectoptions: [],
      tabledata: [],
    };
  }

  componentDidMount() {
    this.pickerChange([moment().subtract(90, 'days'), moment()]);
  }


  onFilter=(value) => {
    const filterData = [];
    this.state.chartdata.forEach((x) => {
      if (x.TOTALDEALS >= value[0] && x.TOTALDEALS <= value[1]) {
        filterData.push(x);
      }
    });
    this.setState({ filterdata: filterData });
  }

  handleChange = (values) => {
    const filterData = [];
    this.state.chartdata.forEach((x) => {
      if (R.contains(x.INDUSTRY, values)) {
        filterData.push(x);
      }
    });
    this.setState({ filterdata: filterData });
  }

  showTable = (values) => {
    try {
      const industry = values.data._origin.INDUSTRY;
      const tdday = values.data._origin.TDDATE;
      fetch('/api/creditdealdetail', {
        method: 'POST',
        body: JSON.stringify({ industry, tdday }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({
            tabledata: ds,
          });
          console.log(ds);
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }
  pickerChange = (values) => {
    try {
      const startDay = values[0].format('YYYY-MM-DD');
      const endDay = values[1].format('YYYY-MM-DD');
      fetch('/api/industrydeals', {
        method: 'POST',
        body: JSON.stringify({ start: startDay, end: endDay }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          const maxRange = Math.max(...R.pluck('TOTALDEALS')(ds));
          this.setState({
            chartdata: ds,
            filterdata: ds,
            max: maxRange,
            selectoptions: R.uniq(R.pluck('INDUSTRY')(ds)),
          });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }


  render() {
    const children = [];
    const pushChild = x => children.push(<Option key={x}>{x}</Option>);
    R.forEach(pushChild)(this.state.selectoptions);

    return (
      <div className={styles.normal}>
        <Row>
          <Col span={18}>
            <Slider
              range
              defaultValue={[0, this.state.max]}
              onAfterChange={this.onFilter}
              max={this.state.max}
              step="10"
            />
          </Col>
          <Col span={5} push={1}>
            <RangePicker
              onChange={this.pickerChange}
              defaultValue={[moment().subtract(90, 'days'), moment()]}
              format="YYYY-MM-DD"
            />
          </Col>
        </Row>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Please select"
          onChange={this.handleChange}
        >
          {children}
        </Select>
        <Divider />
        <Chart
          height={window.innerHeight - 200}
          data={this.state.filterdata}
          forceFit
          padding="77"
          onPlotDblClick={ev => this.showTable(ev)}
        >
          <Legend position="top" offsetY={20} />
          <Axis
            name="TOTALDEALS" label={{
              formatter: (val) => {
                return `${val}亿`;
              },
            }}
          />
          <Axis name="TDDATE" />
          <Axis name="MA5-MA20" position="right" />
          <Tooltip />
          <Geom type="intervalStack" position="TDDATE*TOTALDEALS" color={'INDUSTRY'} />
          <Geom
            type="line"
            position="TDDATE*MA5-MA20"
            size={3}
            color={'INDUSTRY'}
          />
        </Chart>
        <Table columns={columns} dataSource={this.state.tabledata} pagination={false} size="small" />
      </div>
    );
  }
}

export default IndustryMain;
