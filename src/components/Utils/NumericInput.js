import React from 'react';
import { Input } from 'antd';

class NumericInput extends React.Component {
  onChange = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <Input
        {...this.props}
        onChange={this.onChange}
        maxLength="25"
      />
    );
  }
}

export default NumericInput;
