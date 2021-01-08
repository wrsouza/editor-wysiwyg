export default class Separator {
  constructor(options) {
    this.container = options.container;
    this.item = document.createElement('div');
  }

  render() {
    this.item.classList.add('fbs-editor-bar-item-separator');
    return this.item;
  }
}
