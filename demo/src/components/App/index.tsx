import React from 'react';
import { cloneDeep } from 'lodash';
import { v1 } from 'uuid';

import Header from '../Header/index';
import List from '../List/index';
import Footer from '../Footer/index';
import { ITodo } from '../../interface/index';
import { TodoType } from '../../enum/index';

import './index.less';

export const selectorPrefix: string = 'TodoList';

interface IState {
    data: ITodo[]
}

class TodoList extends React.PureComponent<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: JSON.parse(localStorage.getItem(selectorPrefix) || '[]'),
    };

    this.onAdd = this.onAdd.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onAdd(value: string) {
    const data: ITodo[] = cloneDeep(this.state.data);
    data.push({
      id: v1(),
      value,
      type: TodoType.UnComplete,
    });

    this.setState(
      {
        data,
      },
      () => {
        localStorage.setItem(selectorPrefix, JSON.stringify(data));
      },
    );
  }

  onDelete(curId: string): void {
    const data: ITodo[] = cloneDeep(this.state.data);
    const index = data.findIndex(({ id }) => id === curId);
    if (index !== -1) {
      data.splice(index, 1);
      this.setState(
        {
          data,
        },
        () => {
          localStorage.setItem(selectorPrefix, JSON.stringify(data));
        },
      );
    }
  }

  onComplete(id: string): void {
    const data: ITodo[] = cloneDeep(this.state.data);
    const item = data.find(({ id: curId }) => curId === id);
    item.type = TodoType.Complete;
    this.setState(
      {
        data,
      },
      () => {
        localStorage.setItem(selectorPrefix, JSON.stringify(data));
      },
    );
  }

  onUpdate(params: { id: string; value: string }): void {
    const data: ITodo[] = cloneDeep(this.state.data);
    const item = data.find(({ id: curId }) => curId === params.id);
    item.value = params.value;
    this.setState(
      {
        data,
      },
      () => {
        localStorage.setItem(selectorPrefix, JSON.stringify(data));
      },
    );
  }

  render():
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | string
        | number
        | {}
        | React.ReactNodeArray
        | React.ReactPortal
        | boolean
        | null
        | undefined {
    const { data } = this.state;
    const completeData = data.filter(({ type }) => type === TodoType.Complete);
    const uncompleteData = data.filter(({ type }) => type === TodoType.UnComplete);

    return (
      <div className={selectorPrefix}>
        <div className={`${selectorPrefix}-Header`}>
          <Header onAdd={this.onAdd} />
        </div>
        <div className={`${selectorPrefix}-ListWrap`}>
          <List
            title="正在进行"
            data={uncompleteData}
            onComplete={this.onComplete}
            onUpdate={this.onUpdate}
            onDelete={this.onDelete}
          />

          <List
            title="已经完成"
            data={completeData}
            onComplete={this.onComplete}
            onUpdate={this.onUpdate}
            onDelete={this.onDelete}
          />
        </div>
        <div className={`${selectorPrefix}-Footer`}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default TodoList;
