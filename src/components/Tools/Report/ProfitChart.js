import React from 'react';
// import styles from './ProfitChart.css';
import { Chart, Geom, Axis, Tooltip, Legend, View } from 'bizcharts';
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
    const sumdata = this.state.chartdata.filter(item => item.fundacc === '汇总');
    const detaildata = this.state.chartdata.filter(item => item.fundacc !== '汇总');

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
          <Col span={22} offset={1}><Chart forceFit data={[1]} scale={cols} padding="auto" >
            <Legend />
            <Tooltip crosshairs={{ type: 'y' }} />
            <View data={sumdata} >
              <Geom
                type="line" size={1} position="tradedate*profit" shape={'smooth'} color={['fundacc',
                  (cut) => {
                    if (cut === '汇总') { return '#2E8B57'; } else { return '#00ff00'; }
                  }]}
              />
              <Geom
                type="area" position="tradedate*profit" shape={'smooth'} color={['fundacc',
                  (cut) => {
                    if (cut === '汇总') { return '#2E8B57'; } else { return '#00ff00'; }
                  }]}
              />
            </View>
            <View data={detaildata} >
              <Axis name="tradedate" />
              <Axis
                name="profit" label={{
                  formatter: (val) => {
                    return `${val}万`;
                  },
                }}
              />
              <Geom type="line" position="tradedate*profit" color="fundacc" shape={'smooth'} />
            </View>
          </Chart></Col>
        </Row>

      </div>
    );
  }
}

export default ProfitChart;
