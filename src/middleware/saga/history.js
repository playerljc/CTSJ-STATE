/**
 * History
 * @class History
 * @classdesc 路由的改变
 */
class History {
  constructor() {
    this.handlers = [];
    this.onHash = this.onHash.bind(this);
    this.initEvent();
  }

  initEvent() {
    if(typeof window === 'undefined') return;

    window.addEventListener('hashchange', this.onHash);
  }

  removeEvent() {
    if(typeof window === 'undefined') return;

    window.removeEventListener('hashchange', this.onHash);
  }

  onHash() {
    this.handlers.forEach((h) => {
      if(typeof window !== 'undefined')  {
        h({ patchname: window.location.pathname });
      }
    });
  }

  listen(handler) {
    this.handlers.push(handler);
    return () => {
      const index = this.handlers.indexOf(handler);
      if (index !== -1) {
        this.handlers.splice(index, 1);
      }
    };
  }
}

export default new History();
