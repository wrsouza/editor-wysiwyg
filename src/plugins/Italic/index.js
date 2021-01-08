import Button from '../Button';

export default class Italic extends Button {
  constructor(options) {
    super(options);
  }

  execute() {
    let selection = window.getSelection();
    if (selection.type == 'Range') {
      document.execCommand('italic', false, null);
      this.checkState();
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
    if (document.queryCommandState('italic')) {
      if (!this.button.classList.contains('active')) {
        this.button.classList.add('active');
      }
    } else {
      if (this.button.classList.contains('active')) {
        this.button.classList.remove('active');
      }
    }
  }
}
