import Button from '../Button';

export default class Clear extends Button {
  constructor(options) {
    super(options);
  }

  execute() {
    let selection = window.getSelection();
    if (selection.type == 'Range') {
      document.execCommand('removeFormat', false, null);
      this.options.events.updateHTML();
    }
  }
}
