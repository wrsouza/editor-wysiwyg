import Button from '../Button';

export default class Fonts extends Button {
  constructor(options) {
    super(options);
    this.registerColors();
  }

  registerColors() {
    this.colorList = [];
    if (this.options.colors) {
      this.options.colors.forEach((color) => {
        if (validateFont(color)) {
          this.colorList.push(color);
        }
      });
    } else {
      this.colorList.push(
        '#000000',
        '#444444',
        '#666666',
        '#888888',
        '#AAAAAA',
        '#CCCCCC',
        '#EEEEEE',
        '#FFFFFF'
      );
      this.colorList.push(
        '#44B8FF',
        '#C3FFFF',
        '#72FF84',
        '#FFFF44',
        '#FFC95F',
        '#FF857A',
        '#FF56FF',
        '#F551FF'
      );
      this.colorList.push(
        '#1E92F7',
        '#9DF9FF',
        '#4CEA5E',
        '#FFFA1E',
        '#FFA339',
        '#FF5F54',
        '#FF30DC',
        '#CF2BE7'
      );
      this.colorList.push(
        '#0074D9',
        '#7FDBFF',
        '#2ECC40',
        '#FFDC00',
        '#FF851B',
        '#FF4136',
        '#F012BE',
        '#B10DC9'
      );
      this.colorList.push(
        '#005DC2',
        '#68C4E8',
        '#17B529',
        '#E8C500',
        '#E86E04',
        '#E82A1F',
        '#D900A7',
        '#9A00B2'
      );
      this.colorList.push(
        '#00369B',
        '#419DC1',
        '#008E02',
        '#C19E00',
        '#C14700',
        '#C10300',
        '#B20080',
        '#9A00B2'
      );
      this.colorList.push(
        '#B3D5F4',
        '#D9F4FF',
        '#C0F0C6',
        '#FFF5B3',
        '#FFDBBB',
        '#FFC6C3',
        '#FBB8EC',
        '#E8B6EF'
      );
      //this.colorList.push('#', '#', '#', '#', '#', '#', '#', '#')
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
    popupContainer.style.minWidth = '175px';

    let popupColorList = document.createElement('ul');
    popupColorList.classList.add('listcolors');

    this.colorList.forEach((color) => {
      let popupColorItem = document.createElement('li');
      popupColorItem.setAttribute('value', color);
      popupColorItem.style.background = color;
      popupColorItem.addEventListener('click', (evt) => this.execute(evt));
      popupColorList.appendChild(popupColorItem);
    });

    popupContainer.appendChild(popupColorList);
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
      document.execCommand('forecolor', false, value);
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
    let colors = document
      .queryCommandValue('forecolor')
      .replace(/rgb/g, '')
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .split(',');

    const r = Number(String(colors[0]));
    const g = Number(String(colors[1]));
    const b = Number(String(colors[2]));
    let forecolor = '#';
    forecolor += this.toHex(r);
    forecolor += this.toHex(g);
    forecolor += this.toHex(b);
    Array.from(this.popup.children[0].children[0].children).forEach((li) => {
      if (li.getAttribute('value').toUpperCase() == forecolor.toUpperCase()) {
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

  toHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }
}
