import React from 'react';
import { connect } from '@ctsj/state/lib/react';
import ServiceRegister from '@ctsj/state/lib/middleware/saga/serviceregister';

import './listitem.less';

const selectorPrefix = 'ctsj-state-todolist-list-body-item';

/**
 * ListItem
 * @class ListItem
 * @classdesc ListItem
 */
class ListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.onEditorChange = this.onEditorChange.bind(this);
    this.onEditorBlur = this.onEditorBlur.bind(this);

    this.onEditor = this.onEditor.bind(this);

    this.state = {
      editable: false,
      value: this.props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  refreshList() {
    this.props.todolistFetchList({
      ins: this,
      success: () => {
        console.log('AppFetchListSuccess');
      },
    });
  }

  /**
   * onDelete
   */
  onDelete() {
    const { id, todolistFetchDelete } = this.props;
    if (todolistFetchDelete) {
      todolistFetchDelete({
        id,
        ins: this,
        success: () => {
          this.refreshList();
        },
      });
    }
  }

  /**
   * onComplete
   */
  onComplete() {
    const { type, id, todolistFetchComplete } = this.props;
    if (type === 'run') {
      if (todolistFetchComplete) {
        todolistFetchComplete({
          id,
          ins: this,
          success: () => {
            this.refreshList();
          },
        });
      }
    }
  }

  /**
   * onEditorChange
   * @param {Event} - e
   */
  onEditorChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  /**
   * onEditorBlur
   */
  onEditorBlur() {
    const { id, todolistFetchUpdate } = this.props;
    const { value } = this.state;
    this.setState({
      editable: false,
    }, () => {
      if (todolistFetchUpdate) {
        todolistFetchUpdate({
          id,
          value,
          ins: this,
          success: () => {
            this.refreshList();
          },
        });
      }
    });
  }

  /**
   * onEditor
   */
  onEditor() {
    const { type } = this.props;
    if (type === 'run') {
      this.setState({
        editable: true,
      });
    }
  }

  /**
   * renderEditable
   * @return {ReactElement}
   */
  renderEditable() {
    const { editable = false, value } = this.state;
    return editable ?
      (
        <div className={`${selectorPrefix}-inner-editorable`}>
          <input
            value={value}
            onChange={this.onEditorChange}
            onBlur={this.onEditorBlur}
          />
        </div>
      ) :
      (
        <div
          className={`${selectorPrefix}-inner-value`}
          onClick={this.onEditor}
        >{value}
        </div>
      );
  }

  render() {
    const { type } = this.props;
    return (
      <li className={`${selectorPrefix} ${type !== 'run' ? 'disable' : ''}`}>
        <div className={`${selectorPrefix}-inner`}>
          <input
            type="checkbox"
            checked={type !== 'run'}
            disabled={type !== 'run'}
            className={`${selectorPrefix}-inner-checkbox`}
            onChange={this.onComplete}
          />
          {this.renderEditable()}
        </div>
        <span
          className={`fa fa-minus-circle ${selectorPrefix}-delete`}
          onClick={this.onDelete}
        />
      </li>
    );
  }
}

// /**
//  * mapStateToProps
//  * @param {Object} - state
//  * @return {Object|Array}
//  */
// const mapStateToProps = ({ todolist }) => {
//   return todolist;
// };

/**
 * mapDispatchToProps
 * @param {Function} - dispatch
 * @return {Object}
 */
// const mapDispatchToProps = dispatch => ({
//   fetchDelete: id => dispatch({ type: 'todolist/fetchDelete', id }),
//   fetchComplete: id => dispatch({ type: 'todolist/fetchComplete', id }),
//   fetchUpdate: (id, value) => dispatch({ type: 'todolist/fetchUpdate', id, value }),
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

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);

