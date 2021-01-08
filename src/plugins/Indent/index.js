import Button from '../Button';

export default class Indent extends Button {
  constructor(options) {
    super(options);
  }

  execute(evt) {
    let selection = window.getSelection();
    if (selection.rangeCount >= 1) {
      document.execCommand('indent', false, null);
      this.options.events.updateHTML();
    }
  }
}
