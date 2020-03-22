import React from 'react';
import { connect } from '@ctsj/state/lib/react';

import './header.less';

const selectorPrefix = 'ctsj-state-todolist';

/**
 * Header
 * @param onAdd
 * @return {*}
 * @constructor
 */
class Header extends React.PureComponent {
  render() {
    return (
      <div className={`${selectorPrefix}-header`}>
        <div className={`${selectorPrefix}-header-title`}>ToDoList</div>
        <div className={`${selectorPrefix}-header-input`}>
          <input
            placeholder="添加ToDo"
            type="text"
            onKeyUp={(e) => {
              const { which, target: { value } } = e;
              if (which === 13) {
                this.props.fetchSave(value);
              }
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ todolist }) => todolist;

const mapDispatchToProps = dispatch => ({
  fetchSave: (value) => dispatch({ type: 'todolist/fetchSave', value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
