import React from "react";
import {v1} from 'uuid';
import ListItem from '../ListItem/index';
import {ITodo} from "../../interface/index";

import {selectorPrefix} from "../App/index";

import './index.less';

interface IProps {
  title: string;
  data: ITodo[],

  onDelete(id: string): void,

  onComplete(id: string): void,

  onUpdate(params: { id: string, value: string }): void,
}

class List extends React.PureComponent<IProps, {}> {
  renderListItems() {
    const {
      data = [],
      onDelete,
      onComplete,
      onUpdate,
    } = this.props;

    return data.map((record: ITodo) => (
      <ListItem
        key={v1()}
        data={record}
        onDelete={onDelete}
        onComplete={onComplete}
        onUpdate={onUpdate}
      />
    ));
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const {
      title,
      data = [],
    } = this.props;

    return (
      <div className={`${selectorPrefix}-list`}>
        <div className={`${selectorPrefix}-list-header`}>
          <div className={`${selectorPrefix}-list-header-title`}>{title}</div>
          <div className={`${selectorPrefix}-list-header-count`}>{data.length}</div>
        </div>
        <ul className={`${selectorPrefix}-list-body`}>
          {this.renderListItems()}
        </ul>
      </div>
    );
  }
}

export default List;
