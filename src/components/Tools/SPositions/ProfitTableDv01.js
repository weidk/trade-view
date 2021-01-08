import React from 'react';
import { Chart, Tooltip, Axis, Geom, Legend } from 'bizcharts';
import { Divider } from 'antd';
import styles from './ProfitTableDv01.css';

const _ = require('lodash');

class ProfitTableDv01 extends React.Component {
  render() {
    // eslint-disable-next-line array-callback-return
    const Charts = this.props.showfun.map((fun) => {
      if (!['全部', '投资', '做市', '转债策略', '转债方向'].includes(fun)) {
        const funData = _.filter(this.props.chartdata, { FundAcc: fun });
        return (
          <div>
            <Divider>{fun}</Divider>
            <Chart height={400} data={funData} padding="auto">
              <Axis
                name="dv01" label={{
                  formatter: (val) => {
                    return `${val}万`;
                  },
                }}
              />
              <Axis
                name="duration" label={{
                  formatter: (val) => {
                    return `${val}年`;
                  },
                }}
              />
              <Legend />
              <Tooltip
                crosshairs={{
                  type: 'y',
                }}
              />
              <Geom
                type="intervalStack"
                position="duration*dv01"
                color="SType"
              />
            </Chart>
          </div>
        );
      }
    });
    return (
      <div className={styles.normal}>
        {Charts}
      </div>
    );
  }
}

export default ProfitTableDv01;
