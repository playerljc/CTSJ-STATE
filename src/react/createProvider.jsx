import React from 'react';
import PropTypes from 'prop-types';

/**
 * Provider
 * @class Provider
 * @classdesc Provider
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

Provider.propTypes = {
  store: PropTypes.object,
};

Provider.childContextTypes = {
  store: PropTypes.object
};

export default Provider;
