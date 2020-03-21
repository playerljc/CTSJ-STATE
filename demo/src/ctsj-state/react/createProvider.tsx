import React from 'react';
import PropTypes from 'prop-types';
import { ProviderContext } from './Context';

/**
 * Provider
 * @class Provider
 * @classdesc Provider
 */
class Provider extends React.Component {
  static propTypes: { store: any; };
  props: { children: any; };

  render() {
    const { children } = this.props;
    return (
      <ProviderContext.Provider value={this.props}>
        {children}
      </ProviderContext.Provider>
    );
  }
}

Provider.defaultProps = {
  store: {},
};

Provider.propTypes = {
  store: PropTypes.object,
};

export default Provider;
