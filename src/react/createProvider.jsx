import React from 'react';
import PropTypes from 'prop-types';
import { ProviderContext } from './Context';

/**
 * Provider
 * @class Provider
 * @classdesc 一个Store的最外层容器 提供store实例
 */
// eslint-disable-next-line react/prefer-stateless-function
class Provider extends React.Component {
  render() {
    const { children } = this.props;
    return <ProviderContext.Provider value={this.props}>{children}</ProviderContext.Provider>;
  }
}

Provider.defaultProps = {
  store: {},
};

Provider.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  store: PropTypes.object,
};

export default Provider;
