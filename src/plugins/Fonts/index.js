import Button from '../Button';

export default class Fonts extends Button {
  constructor(options) {
    super(options);
    this.registerFonts();
  }

  registerFonts() {
    this.fontList = [];
    if (this.options.fonts) {
      this.options.fonts.forEach((font) => {
        if (validateFont(font)) {
          this.fontList.push(font);
        }
      });
    } else {
      this.fontList.push({ name: 'Arial', style: "font-family: 'Arial';" });
      this.fontList.push({
        name: 'Courier New',
        style: "font-family: 'Courier New';",
      });
      this.fontList.push({ name: 'Georgia', style: "font-family: 'Georgia';" });
      this.fontList.push({ name: 'Impact', style: "font-family: 'Impact';" });
      this.fontList.push({
        name: 'Open Sans',
        style: "font-family: 'Open Sans';",
      });
      this.fontList.push({ name: 'Tahoma', style: "font-family: 'Tahoma';" });
      this.fontList.push({
        name: 'Times New Roman',
        style: "font-family: 'Times New Roman';",
      });
      this.fontList.push({
        name: 'Trebuchet MS',
        style: "font-family: 'Trebuchet MS';",
      });
      this.fontList.push({ name: 'Verdana', style: "font-family: 'Verdana';" });
    }
  }

  validateFont(font) {
    if (!font.name) {
      return false;
    }
    if (!font.style) {
      return false;
    }
    return this.fontList.filter((x) => x.name == font.name).length == 0;
  }

  populatePopUp() {
    let popupContainer = document.createElement('div');
    popupContainer.style.minWidth = '210px';

    let popupFontList = document.createElement('ul');
    popupFontList.classList.add('list');
    popupFontList.style.height = '230px';
    popupFontList.style.overflowY = 'scroll';

    this.fontList.forEach((font) => {
      let popupFontItem = document.createElement('li');
      popupFontItem.classList.add('item');
      popupFontItem.setAttribute('value', font.name);
      popupFontItem.style = font.style;
      popupFontItem.innerHTML = font.name;
      popupFontItem.addEventListener('click', (evt) => this.execute(evt));
      popupFontList.appendChild(popupFontItem);
    });

    popupContainer.appendChild(popupFontList);
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
      let value = evt.target.getAttribute('value');
      document.execCommand('fontName', false, value);
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
    let fontName = document.queryCommandValue('fontName').replace(/"/g, '');
    Array.from(this.popup.children[0].children[0].children).forEach((li) => {
      if (li.getAttribute('value') == fontName) {
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
