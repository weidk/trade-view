import React from 'react';
import fetch from 'dva/fetch';
import { Chart, Geom, Tooltip, Axis } from 'bizcharts';
import styles from './DealTsBar.css';

class DealTsBar extends React.Component {
  constructor() {
    super();
    this.state = {
      chartdata: [],
    };
  }

  componentDidMount() {
    this.fetchData(this.props.ins, this.props.type);
  }

  fetchData = (insdata, typedata) => {
    try {
      fetch('/api/marketdealts', {
        method: 'POST',
        body: JSON.stringify({ ins: insdata, type: typedata }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        response.json().then((ds) => {
          this.setState({ chartdata: ds });
        });
      });
    } catch (error) {
      console.log('error: ', error);
    }
  }


  render() {
    const data = this.state.chartdata;
    return (
      <div className={styles.normal}>
        <Chart height={400} data={data} forceFit>
          <Axis name="date" />
          <Axis
            name="type" label={{
              formatter: (val) => {
                return `${val}亿`;
              },
            }}
          />
          <Tooltip crosshairs={{ type: 'y' }} />
          <Geom
            type="interval"
            position="date*type"
            size={2}
            shape={'hv'}
            color={['type', (cut) => {
              if (cut < 0) { return '#53ab53'; } else { return '#ec6663'; }
            }]}
          />
        </Chart>
      </div>
    );
  }
}

export default DealTsBar;
