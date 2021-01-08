import Button from '../Button';

export default class Bold extends Button {
  constructor(options) {
    super(options);
  }

  execute() {
    let selection = document.getSelection();
    if (selection.type == 'Range') {
      document.execCommand('bold', false, null);
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
    if (document.queryCommandState('bold')) {
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
