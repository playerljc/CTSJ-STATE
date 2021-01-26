import React from 'react';
import PropTypes from 'prop-types';

/**
 * Provider
 * @class Provider
 * @classdesc 一个Store的最外层容器 提供store实例
 */
// eslint-disable-next-line react/prefer-stateless-function
class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store,
    };
  }

  render() {
    const { children } = this.props;
<<<<<<< HEAD
    return children;
=======
    return <ProviderContext.Provider value={this.props}>{children}</ProviderContext.Provider>;
>>>>>>> origin/put-global-effect-reduce
  }
}

Provider.defaultProps = {
  store: {},
};

Provider.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  store: PropTypes.object,
};

Provider.childContextTypes = {
  store: PropTypes.object,
};

export default Provider;
