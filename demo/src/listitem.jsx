import React from 'react';
import { connect } from '@ctsj/state/lib/react';
import Immutable from '@ctsj/state/lib/util/immutable';

import './listitem.less';

const selectorPrefix = 'ctsj-state-todolist-list-body-item';

/**
 * ListItem
 * @class ListItem
 * @classdesc ListItem
 */
class ListItem extends React.Component {
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

  /**
   * onDelete
   */
  onDelete() {
    const { id, onDelete } = this.props;
    if (onDelete) {
      onDelete(id);
    }
  }

  /**
   * onComplete
   */
  onComplete() {
    const { type, id, onComplete } = this.props;
    if (type === 'run') {
      if (onComplete) {
        onComplete(id);
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
    const { id, onUpdate } = this.props;
    const { value } = this.state;
    this.setState({
      editable: false,
    }, () => {
      if (onUpdate) {
        onUpdate({ id, value });
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
      (<div className={`${selectorPrefix}-inner-editorable`}>
        <input
          value={value}
          onChange={this.onEditorChange}
          onBlur={this.onEditorBlur}
        />
      </div>) :
      (<div
        className={`${selectorPrefix}-inner-value`}
        onClick={this.onEditor}
      >{value}
      </div>);
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

/**
 * mapStateToProps
 * @param {Object} - state
 * @return {Object|Array}
 */
const mapStateToProps = (state) => {
  return Immutable.cloneDeep(state);
};

/**
 * mapDispatchToProps
 * @param {Function} - dispatch
 * @return {Object}
 */
const mapDispatchToProps = (dispatch) => {
  return {
    /**
     * onDelete
     * @param {Number} - id
     */
    onDelete: (id) => {
      dispatch({
        type: 'delete',
        id,
      });
    },
    /**
     * onComplete
     * @param {Number} - id
     */
    onComplete(id) {
      dispatch({
        type: 'complete',
        id,
      });
    },
    /**
     * onUpdate
     * @param {Number} - id
     * @param {Number} - value
     */
    onUpdate({ id, value }) {
      dispatch({
        type: 'update',
        id,
        value,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListItem);

