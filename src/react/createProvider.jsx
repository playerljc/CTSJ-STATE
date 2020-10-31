import React from 'react';
import PropTypes from 'prop-types';

/**
 * Provider
 * @class Provider
 * @classdesc 一个Store的最外层容器 提供store实例
 */
class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store,
    };
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

Provider.defaultProps = {
  store: {},
};

Provider.propTypes = {
  store: PropTypes.object,
};

Provider.childContextTypes = {
  store: PropTypes.object,
};

export default Provider;
