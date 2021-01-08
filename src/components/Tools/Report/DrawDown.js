import React from 'react';
import fetch from 'dva/fetch';
import { Table, Divider, Switch, Affix } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import NumberFormat from 'react-number-format';
import styles from './DrawDown.css';

const _ = require('lodash');

class DrawDown extends React.Component {
  constructor() {
    super();
    this.state = {
      tabledata: [],
      tsdata: [],
      chartTsdata: [],
      maxdate: '',
      dv01: [],
      dv01Chart: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  onChange = (checked) => {
    if (checked) {
      const chartTsdata = _.filter(this.state.tsdata, (o) => { return ['全部', '投资', '做市'].includes(o.InvestType); });
      const dv01Chart = _.filter(this.state.dv01, (o) => { return ['全部', '投资', '做市'].includes(o.InvestType); });
      this.setState({ chartTsdata, dv01Chart });
    } else {
      const chartTsdata = _.filter(this.state.tsdata, (o) => { return !['全部', '投资', '做市'].includes(o.InvestType); });
      const dv01Chart = _.filter(this.state.dv01, (o) => { return !['全部', '投资', '做市'].includes(o.InvestType); });
      this.setState({ chartTsdata, dv01Chart });
    }
  }
  fetchData = () => {
    fetch('/api/getdrawdown')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        const maxDate = _.maxBy(jsonData, 'TradeDate');
        let tabledata = _.filter(jsonData, { TradeDate: maxDate.TradeDate });
        tabledata = _.sortBy(tabledata, 'sortid');
        const chartTsdata = _.filter(jsonData, (o) => { return ['全部', '投资', '做市'].includes(o.InvestType); });
        this.setState({ chartTsdata, tsdata: jsonData, tabledata, maxdate: maxDate.TradeDate });
      });

    fetch('/api/getdv01ts')
      .then((response) => {
        return response.json();
      })
      .then((jsonData) => {
        const dv01Chart = _.filter(jsonData, (o) => { return ['全部', '投资', '做市'].includes(o.InvestType); });
        this.setState({ dv01Chart, dv01: jsonData });
      });
  };
  render() {
    const columns = [
      {
        title: '策略组合',
        dataIndex: 'InvestType',
        align: 'right',
      },

      // {
      //   title: '累计回撤额(万)',
      //   dataIndex: 'CumWithDraw',
      //   align: 'right',
      //   render: text => <div><NumberFormat value={(text / 10000).toFixed(2)} displayType={'text'} thousandSeparator /></div>,
      // },
      // {
      //   title: '累计回撤率(%)',
      //   dataIndex: 'CumWithDrawRate',
      //   align: 'right',
      //   render: text => <div><NumberFormat value={(text * 100).toFixed(2)} displayType={'text'} thousandSeparator /></div>,
      // },
      {
        title: '较上日回撤额(万)',
        dataIndex: 'PerDayWithDraw',
        align: 'right',
        render: text => <div><NumberFormat value={(text / 10000).toFixed(2)} displayType={'text'} thousandSeparator /></div>,
      },

      {
        title: '当前回撤(%)',
        dataIndex: 'CumWithDrawRateMarketValue',
        align: 'right',
        render: text => <div><NumberFormat value={(text * 100).toFixed(2)} displayType={'text'} thousandSeparator /></div>,
      },
      // {
      //   title: '较上日回撤率(%)',
      //   dataIndex: 'PerDayWithDrawRate',
      //   align: 'right',
      //   render: text => <div><NumberFormat value={(text * 100).toFixed(2)} displayType={'text'} thousandSeparator /></div>,
      // },
      {
        title: '最大回撤额(万)',
        dataIndex: 'MaxDrawdown',
        align: 'right',
        render: text => <div><NumberFormat value={(text / 10000).toFixed(2)} displayType={'text'} thousandSeparator /></div>,
      },
      {
        title: '最大回撤日期',
        dataIndex: 'MaxDrawdownDate',
        align: 'right',
        // render: text => <div><NumberFormat value={(text / 10000).toFixed(2)} displayType={'text'} thousandSeparator /></div>,
      },
      {
        title: '最大回撤率_按市值(%)',
        dataIndex: 'MaxDrawdownRateMarketValue',
        align: 'right',
        render: text => <div><NumberFormat value={(text * 100).toFixed(2)} displayType={'text'} thousandSeparator /></div>,
      },
      {
        title: '最大回撤率_按本金(%)',
        dataIndex: 'MaxDrawdownRate',
        align: 'right',
        render: text => <div><NumberFormat value={(text * 100).toFixed(2)} displayType={'text'} thousandSeparator /></div>,
      },
      {
        title: '收益回撤比',
        dataIndex: 'EarningtoMaxdrawdown',
        align: 'right',
        render: (text) => {
          if (text < 0) { return <div style={{ color: 'red' }} ><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>; } else {
            return <div><NumberFormat value={text.toFixed(2)} displayType={'text'} thousandSeparator /></div>;
          }
        },
      },
    ];

    return (
      <div className={styles.normal}>
        <Divider>{this.state.maxdate} 风控指标</Divider>
        <Table
          columns={columns}
          dataSource={this.state.tabledata}
          bordered
          pagination={false}
          size="small"
        />
        <Affix>
          <Divider> <Switch checkedChildren="总和" unCheckedChildren="明细" defaultChecked onChange={this.onChange} /> </Divider>
        </Affix>
        <Divider> 累计回撤率走势 </Divider>
        <Chart height={400} data={this.state.chartTsdata} forceFit padding="auto">
          <Legend name="全部" visible />
          <Axis name="TradeDate" />
          <Axis
            name="CumWithDrawRateMarketValue"
            label={{
              formatter: val => `${val * 100}%`,
            }}
          />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom
            type="area"
            position="TradeDate*CumWithDrawRateMarketValue"
            size={2}
            color={'InvestType'}
            shape={'smooth'}
          />
        </Chart>
        <Divider> 收益回撤比走势 </Divider>
        <Chart height={400} data={this.state.chartTsdata} forceFit padding="auto">
          <Legend />
          <Axis name="TradeDate" />
          <Axis name="EarningtoMaxdrawdown" />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom
            type="line"
            position="TradeDate*EarningtoMaxdrawdown"
            size={2}
            color={'InvestType'}
            shape={'smooth'}
          />
        </Chart>
        <Divider> DV01走势 </Divider>
        <Chart height={400} data={this.state.dv01Chart} forceFit padding="auto">
          <Legend />
          <Axis name="TradeDate" />
          <Axis name="BpValue" />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom
            type="line"
            position="TradeDate*BpValue"
            size={2}
            color={'InvestType'}
            shape={'smooth'}
          />
        </Chart>
      </div>
    );
  }
}

export default DrawDown;
