import React from "react";

import './index.less';

const selectorPrefix: string = 'Header';

interface IProps {
  onAdd(value: string): void;
}

class Header extends React.PureComponent<IProps, {}> {
  el: HTMLInputElement;

  onKeyUp = (e: React.KeyboardEvent) => {
    const {which} = e;
    const value = this.el.value;
    if (which === 13) {
      this.props.onAdd(value);
    }
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div className={selectorPrefix}>
        <span className={`${selectorPrefix}-Title`}>ToDoList</span>
        <div className={`${selectorPrefix}-Input`}>
          <input
            ref={el => {
              this.el = el
            }}
            placeholder="添加ToDo"
            onKeyUp={this.onKeyUp}
          />
        </div>
      </div>
    );
  }
}

export default Header;
