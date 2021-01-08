import Button from '../Button';

export default class HorizontalRule extends Button {
  constructor(options) {
    super(options);
  }

  execute(evt) {
    let selection = window.getSelection();
    if (selection.rangeCount >= 1) {
      document.execCommand('insertHorizontalRule', false, null);
      this.options.events.updateHTML();
    }
  }
}
