import React from 'react';
import { connect } from '@ctsj/state/lib/react';
import ServiceRegister from '@ctsj/state/lib/middleware/saga/serviceregister';

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
                this.props.todolistFetchSave({
                  value,
                  ins: this,
                  success: () => {
                    console.log('HeaderFetchSaveSuccess');
                    this.props.todolistFetchList({
                      ins: this,
                      success: () => {
                        console.log('AppFetchListSuccess');
                      },
                    });
                  },
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

// const mapStateToProps = ({ todolist }) => todolist;

// const mapDispatchToProps = dispatch => ({
//   fetchSave: (params) => dispatch(Object.assign({ type: 'todolist/fetchSave' }, params)),
// });

const mapStateToProps = state =>
  ServiceRegister.mapStateToProps({
    namespace: 'todolist',
    state,
  });

const mapDispatchToProps = dispatch => ServiceRegister.mapDispatchToProps({
  namespaces: ['todolist'],
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
