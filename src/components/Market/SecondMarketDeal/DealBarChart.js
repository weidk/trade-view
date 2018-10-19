import React from 'react';
import { Modal } from 'antd';
import { Chart, Geom, Tooltip, Coord, Axis } from 'bizcharts';
import styles from './DealBarChart.css';
import DealTsBar from './DealTsBar';

class DealBarChart extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      x: '',
      y: '',
    };
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  showModal = (ev) => {
    this.setState({
      visible: true,
      x: ev.data._origin.机构,
      y: ev.data._origin.种类,
    });
  }
  render() {
    const scale = {
      数量: {
        tickCount: 3,
      },
    };
    return (
      <div className={styles.normal} >
        <h3>{this.props.title}</h3>
        <Chart data={this.props.dealbardata} forceFit padding="auto" scale={scale} onPlotDblClick={ev => this.showModal(ev)} >
          <Coord transpose />
          <Axis name="机构" label={{ offset: 12 }} />
          <Axis name="数量" />
          <Tooltip />
          <Geom type="interval" position="机构*数量" color={this.props.color} />
        </Chart>
        <Modal
          title={`${this.state.x}-${this.state.y} 现券交易时序图`}
          visible={this.state.visible}
          width="88vw"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose="true"
        >
          <DealTsBar ins={this.state.x} type={this.state.y} />
        </Modal>
      </div>
    );
  }
}

export default DealBarChart;
