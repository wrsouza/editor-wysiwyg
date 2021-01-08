import Button from '../Button';

export default class UnorderedList extends Button {
  constructor(options) {
    super(options);
  }

  execute(evt) {
    let selection = window.getSelection();
    if (selection.rangeCount >= 1) {
      document.execCommand('insertUnorderedList', false, null);
      this.options.events.refreshAllStates();
      this.options.events.updateHTML();
    }
  }

  onMouseUp(evt) {
    this.checkState();
  }

  onKeyUp(evt) {
    this.checkState();
  }

  checkState() {
    if (document.queryCommandState('insertUnorderedList')) {
      if (!this.button.classList.contains('active')) {
        this.button.classList.add('active');
      }
    } else {
      if (this.button.classList.contains('active')) {
        this.button.classList.remove('active');
      }
    }
  }

  refreshState() {
    this.checkState();
  }
}
