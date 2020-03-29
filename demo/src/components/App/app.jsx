import React from 'react';
import { connect } from '@ctsj/state/lib/react';

import Header from '../Header/header';
import List from '../List/list';
import Spin from '../../components/Spin';

import './app.less';

const selectorPrefix = 'ctsj-state-todolist';

/**
 * App
 * @param data
 * @return {*}
 * @constructor
 */
class App extends React.PureComponent {
  componentDidMount() {
    this.props.fetchList({
      ins: this,
      success: () => {
        console.log('AppFetchListSuccess');
      },
    });
  }

  render() {
    const { data } = this.props;
    return (
      <Spin loading={this.props.loading}>
        <div className={`${selectorPrefix}`}>
          <Header />
          <div className={`${selectorPrefix}-body`}>
            <List data={data} type="run" />
            <List data={data} type="complete" />
          </div>
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = ({ todolist, loading: { global } }) => {
  return {
    data: todolist.data,
    loading: global,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchList: params =>
    dispatch(Object.assign({ type: 'todolist/fetchList' }, params)),
});

/**
 * App
 * @class App
 * @classdesc App
 */
export default connect(mapStateToProps, mapDispatchToProps)(App);
