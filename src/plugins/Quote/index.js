import Button from '../Button';

export default class Quote extends Button {
  constructor(options) {
    super(options);
  }

  execute(evt) {
    let selection = window.getSelection();
    if (selection.rangeCount >= 1) {
      let formatBlock = document.queryCommandValue('formatBlock');
      if (formatBlock != 'blockquote') {
        document.execCommand('formatBlock', false, 'blockquote');
      } else {
        document.execCommand('formatBlock', false, 'p');
      }
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
    let formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock == 'blockquote') {
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
