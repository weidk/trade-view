import React from 'react';
import { Chart, Geom, Tooltip, Axis, Coord } from 'bizcharts';
import { Modal, Switch } from 'antd';
import RelativeTsChart from './RelativeTsChart';
import styles from './ReletiveRankChart.css';

class ReletiveRankChart extends React.Component {
  constructor() {
    super();
    this.state = {
      vertical: true,
      rotate: 0,
      visible: false,
      selectedTsData: [],
      selectedType: '',
    };
  }
  onSwitchHandle = (e) => {
    if (e) {
      this.setState({ vertical: true, rotate: 0 });
    } else {
      this.setState({ vertical: false, rotate: 30 });
    }
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showModal = (ev) => {
    this.setState({
      visible: true,
      selectedType: ev.data._origin.类型,
      selectedTsData: this.props.allData.filter(o => o.类型 === ev.data._origin.类型),
    });
  };

  render() {
    let coord = null;
    if (this.state.vertical) {
      coord = <Coord transpose />;
    } else {
      coord = <Coord />;
    }
    return (
      <div className={styles.normal}>
        <Switch checkedChildren="竖" unCheckedChildren="横" defaultChecked onChange={this.onSwitchHandle} />
        <Chart data={this.props.data} forceFit padding="auto" height={window.innerHeight - 200} onPlotDblClick={ev => this.showModal(ev)}>
          <Axis name="类型" label={{ offset: 12, rotate: this.state.rotate }} />
          <Axis name="相对价值" />
          {coord}
          <Tooltip />
          <Geom
            type="interval"
            position="类型*相对价值"
            color={['类型', '#53ab53-#ec6663']}
          />
        </Chart>
        <Modal
          title={`${this.state.selectedType} 相对价值走势图`}
          visible={this.state.visible}
          width="88vw"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose="true"
        >
          <RelativeTsChart TsChartData={this.state.selectedTsData} />
        </Modal>
      </div>
    );
  }
}

export default ReletiveRankChart;
