import Button from '../Button';

export default class Outdent extends Button {
  constructor(options) {
    super(options);
  }

  execute(evt) {
    let selection = window.getSelection();
    if (selection.rangeCount >= 1) {
      document.execCommand('outdent', false, null);
    }
  }
}
