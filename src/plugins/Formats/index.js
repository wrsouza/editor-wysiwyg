import Button from '../Button';

export default class Formats extends Button {
  constructor(options) {
    super(options);
    this.registerFormats();
  }

  registerFormats() {
    this.formatList = [];
    if (this.options.formats) {
      this.options.formats.forEach((item) => {
        if (validateFormat(item)) {
          this.formatList.push(item);
        }
      });
    } else {
      this.formatList.push({ name: 'Paragraph', format: 'P', style: '' });
      this.formatList.push({
        name: 'Heading 1',
        format: 'H1',
        style: 'font-size: 36px;',
      });
      this.formatList.push({
        name: 'Heading 2',
        format: 'H2',
        style: 'font-size: 30px;',
      });
      this.formatList.push({
        name: 'Heading 3',
        format: 'H3',
        style: 'font-size: 24px;',
      });
      this.formatList.push({
        name: 'Heading 4',
        format: 'H4',
        style: 'font-size: 18px;',
      });
      this.formatList.push({
        name: 'Heading 5',
        format: 'H5',
        style: 'font-size: 14px;',
      });
      this.formatList.push({
        name: 'Heading 6',
        format: 'H6',
        style: 'font-size: 12px;',
      });
      this.formatList.push({
        name: 'Preformatted',
        format: 'PRE',
        style: 'font-family: monospace',
      });
    }
  }

  validateFormat(item) {
    if (!item.name) {
      return false;
    }
    if (!item.format) {
      return false;
    }
    return this.formatList.filter((x) => x.name == item.name).length == 0;
  }

  populatePopUp() {
    let popupContainer = document.createElement('div');
    popupContainer.style.minWidth = '230px';

    let popupFormatList = document.createElement('ul');
    popupFormatList.classList.add('list');
    popupFormatList.style.height = '230px';
    popupFormatList.style.overflowY = 'scroll';

    this.formatList.forEach((item) => {
      let popupFormatItem = document.createElement('li');
      popupFormatItem.classList.add('item');
      popupFormatItem.setAttribute('value', item.format);
      popupFormatItem.style = item.style;
      popupFormatItem.innerHTML = item.name;
      popupFormatItem.addEventListener('click', (evt) => this.execute(evt));
      popupFormatList.appendChild(popupFormatItem);
    });

    popupContainer.appendChild(popupFormatList);
    return this.popup.appendChild(popupContainer);
  }

  onClick(evt) {
    if (this.isPopUpOpenned) {
      return this.closePopUp();
    }
    return this.openPopUp();
  }

  execute(evt) {
    this.closePopUp();
    let selection = window.getSelection();
    if (selection.type == 'Range') {
      document.execCommand(
        'formatBlock',
        false,
        evt.target.getAttribute('value')
      );
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
    Array.from(this.popup.children[0].children[0].children).forEach((li) => {
      if (li.getAttribute('value').toUpperCase() == formatBlock.toUpperCase()) {
        if (!li.classList.contains('active')) {
          li.classList.add('active');
        }
      } else {
        if (li.classList.contains('active')) {
          li.classList.remove('active');
        }
      }
    });
  }
}
