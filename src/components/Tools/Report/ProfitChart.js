import React from 'react';
// import styles from './ProfitChart.css';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { DatePicker, Divider, Row, Col } from 'antd';
import moment from 'moment';
import fetch from 'dva/fetch';

class ProfitChart extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.pickerChange(moment());
  }


  pickerChange = (values) => {
    try {
      fetch('/api/reprotprofit', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds });
        });
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const sumdata = this.state.chartdata.filter(item => item.investtype === '全部' || item.investtype === '投资' || item.investtype === '做市');
    const detaildata = this.state.chartdata.filter(item => item.investtype !== '全部' && item.investtype !== '投资' && item.investtype !== '做市');

    const cols = {
      profit: {
        sync: true,
        min: 0,
      },
    };

    return (
      <div>
        <DatePicker onChange={this.pickerChange} defaultValue={moment()} />
        <Divider dashed />
        <Row>
          <Col span={22} offset={1}>
            <Chart forceFit data={sumdata} scale={cols} padding="auto" >
              <Legend />
              <Tooltip crosshairs={{ type: 'y' }} />
              <Geom
                type="area" size={1} position="tradedate*profit" shape={'smooth'} color="investtype"
              />
              <Axis name="tradedate" />
              <Axis
                name="profit" label={{
                  formatter: (val) => {
                    return `${val}万`;
                  },
                }}
              />
            </Chart>
          </Col>
        </Row>
        <Row>
          <Col span={22} offset={1}><Chart forceFit data={detaildata} scale={cols} padding="auto" >
            <Legend />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Axis name="tradedate" />
            <Axis
              name="profit" label={{
                formatter: (val) => {
                  return `${val}万`;
                },
              }}
            />
            <Geom type="line" position="tradedate*profit" color="investtype" shape={'smooth'} />
          </Chart>
          </Col>
        </Row>

      </div>
    );
  }
}

export default ProfitChart;
