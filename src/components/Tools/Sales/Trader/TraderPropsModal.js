import React from 'react';
import { Modal } from 'antd';
import { Chart, Tooltip, Axis, Geom, Coord } from 'bizcharts';
import styles from './TraderPropsModal.css';

function TraderPropsModal(props) {
  const { title, visible, handleOk, handleCancel, data } = props;
  return (
    <div className={styles.normal}>
      <Modal
        title={title}
        visible={visible}
        width="40vw"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose="true"
      >
        <Chart data={data} padding={[20, 20, 95, 20]} forceFit>
          <Coord type="polar" radius={0.8} />
          <Axis
            name="CATEGORY" line={null} tickLine={null} grid={{ lineStyle: {
              lineDash: null,
            },
            hideFirstLine: false }}
          />
          <Tooltip />
          <Axis
            name="AMT" line={null} tickLine={null} grid={{ type: 'polygon',
              lineStyle: {
                lineDash: null,
              },
              alternateColor: 'rgba(0, 0, 0, 0.04)' }}
          />
          <Geom type="area" position="CATEGORY*AMT" color="#008B00" />
          <Geom
            type="point" position="CATEGORY*AMT" color="#548B54" shape="circle" size={4}
            style={{ stroke: '#fff',
              lineWidth: 1,
              fillOpacity: 1 }}
          />
        </Chart>
      </Modal>
    </div>
  );
}

export default TraderPropsModal;
