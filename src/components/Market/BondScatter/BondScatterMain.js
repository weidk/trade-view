import React from 'react';
import fetch from 'dva/fetch';
import { Switch, Radio } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts';
import styles from './BondScatterMain.css';

const R = require('ramda');

class BondScatterMain extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
      dealbonds: [],
      isAll: true,
    };
  }

  componentDidMount() {
    this.fetchData('国债');
    try {
      fetch('/api/dealsbonds', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ dealbonds: R.pluck('DEALBONDCODE')(ds) });
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  onChange = (e) => {
    this.fetchData(e.target.value);
  };

  onSwitchHandle = (e) => {
    if (e) {
      this.setState({ isAll: true });
    } else {
      this.setState({ isAll: false });
    }
  }

  fetchData = (value) => {
    try {
      fetch('/api/bondincurve', {
        method: 'POST',
        body: JSON.stringify({ bondtype: value }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds });
        });
      });
    } catch (error) {
      console.log(error);
    }
  }


  render() {
    return (
      <div className={styles.normal}>
        <Radio.Group onChange={this.onChange} defaultValue="国债">
          <Radio value={'国债'}>国债</Radio>
          <Radio value={'国开'}>国开</Radio>
          <Radio value={'农发'}>农发</Radio>
          <Radio value={'进出'}>口行</Radio>
        </Radio.Group>
        <Switch checkedChildren="全部" unCheckedChildren="活跃" defaultChecked onChange={this.onSwitchHandle} />
        <Chart height={window.innerHeight - 200} data={this.state.chartdata} forceFit padding="100">
          <Legend />
          <Axis name="TERM" />
          <Axis name="YIELD" />
          <Tooltip />
          <Geom
            type="point"
            position="TERM*YIELD"
            size={5}
            color={['CODE', (code) => {
              if (code === 'CURVE') { return '#53ab53'; } else if (this.state.isAll) {
                return '#ec6663';
              } else if (this.state.dealbonds.indexOf(code) > -1) {
                return '#ec6663';
              } else {
                return '#DCDCDC';
              }
            }]}
            opacity={['CODE', (code) => {
              if (code === 'CURVE') { return 0; } else { return 1; }
            }]}
            tooltip={['TERM*YIELD*CODE', (TERM, YIELD, CODE) => {
              return {
                title: `${TERM} 年`,
                name: CODE,
                value: YIELD,
              };
            }]}
          />
          <Geom
            type="line"
            position="TERM*YIELD"
            size={2}
            color={['CODE', (code) => {
              if (code === 'CURVE') { return '#53ab53'; } else { return '#ec6663'; }
            }]}
            opacity={['CODE', (code) => {
              if (code === 'CURVE') { return 1; } else { return 0; }
            }]}
            tooltip={['TERM*YIELD*CODE', (TERM, YIELD, CODE) => {
              return {
                title: `${TERM} 年`,
                name: CODE,
                value: YIELD,
              };
            }]}
          />
        </Chart>
      </div>
    );
  }
}

export default BondScatterMain;
