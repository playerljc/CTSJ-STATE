import React from 'react';
import { connect } from '@ctsj/state/lib/react';
import Header from './header';
import List from './list';

import './app.less';

const selectorPrefix = 'ctsj-state-todolist';

/**
 * App
 * @param data
 * @return {*}
 * @constructor
 */
const App = React.memo(({ data }) => {
  return (
    <div className={`${selectorPrefix}`}>
      <Header />
      <div className={`${selectorPrefix}-body`}>
        <List data={data} type="run" />
        <List data={data} type="complete" />
      </div>
    </div>
  );
});

const mapStateToProps = (state) => {
  return state;
};

/**
 * App
 * @class App
 * @classdesc App
 */
export default connect(mapStateToProps, null)(App);
