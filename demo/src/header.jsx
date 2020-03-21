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
const Header = React.memo(({ onAdd }) => {
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
              onAdd(value);
            }
          }}
        />
      </div>
    </div>
  );
});

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAdd: (value) => {
      dispatch({
        type: 'add',
        value,
      });
    },
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Header);
