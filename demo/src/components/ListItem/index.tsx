import React from 'react';

import { ITodo } from '../../interface/index';
import { TodoType } from '../../enum/index';
import { selectorPrefix } from '../App/index';

import './index.less';

interface IProps {
  key: string,
  data: ITodo,

  onDelete(id: string): void,

  onComplete(id: string): void,

  onUpdate(params: { id: string, value: string }): void,
}

interface IState {
  editable: boolean,
  value: string,
}

class ListItem extends React.PureComponent<IProps, IState> {
  state = {
    editable: false,
    value: this.props.data.value,
  };

  constructor(props: IProps) {
    super(props);

    this.onDelete = this.onDelete.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.onEditorBlur = this.onEditorBlur.bind(this);
    this.onEditor = this.onEditor.bind(this);
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.setState({
      value: nextProps.data.value,
    });
  }

  renderEditable() {
    const { editable = false, value } = this.state;
    return editable ?
      (
        <div className={`${selectorPrefix}-list-body-item-inner-editorable`}>
          <input
            value={value}
            onChange={this.onEditorChange}
            onBlur={this.onEditorBlur}
          />
        </div>
      ) :
      (
        <div
          className={`${selectorPrefix}-list-body-item-inner-value`}
          onClick={this.onEditor}
        >{value}
        </div>

      );
  }

  onEditorBlur() {
    const { data: { id }, onUpdate } = this.props;
    const { value } = this.state;
    this.setState({
      editable: false,
    }, () => {
      if (onUpdate) {
        onUpdate({ id, value });
      }
    });
  }

  onEditor() {
    const { data: { type } } = this.props;
    if (type === TodoType.UnComplete) {
      this.setState({
        editable: true,
      });
    }
  }

  onEditorChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      value: e.target.value,
    });
  }

  onComplete() {
    const { data: { type, id }, onComplete } = this.props;
    if (type === TodoType.UnComplete) {
      if (onComplete) {
        onComplete(id);
      }
    }
  }

  onDelete() {
    const { data: { id }, onDelete } = this.props;
    if (onDelete) {
      onDelete(id);
    }
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { data: { type } } = this.props;

    return (
      <li className={`${selectorPrefix}-list-body-item ${type !== TodoType.UnComplete ? 'disable' : ''}`}>
        <div className={`${selectorPrefix}-list-body-item-inner`}>
          <input
            type="checkbox"
            checked={type !== TodoType.UnComplete}
            disabled={type !== TodoType.UnComplete}
            className={`${selectorPrefix}-list-body-item-inner-checkbox`}
            onChange={this.onComplete}
          />
          {this.renderEditable()}
        </div>
        <span
          className={`fa fa-minus-circle ${selectorPrefix}-list-body-item-delete`}
          onClick={this.onDelete}
        />
      </li>
    );
  }
}

export default ListItem;
