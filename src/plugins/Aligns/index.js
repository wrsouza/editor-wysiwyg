import Button from '../Button';
import icons from '~/static/icons.json';

export default class Aligns extends Button {
  constructor(options) {
    super(options);
    this.registerTypes();
    this.options.events.refreshAlign = () => this.checkState();
  }

  registerTypes() {
    this.typeList = [];
    if (this.options.fonts) {
      this.options.types.forEach((item) => {
        if (validateType(item)) {
          this.typeList.push(item);
        }
      });
    } else {
      this.typeList.push({ align: 'justifyLeft', icon: 'icon-align-left' });
      this.typeList.push({ align: 'justifyCenter', icon: 'icon-align-center' });
      this.typeList.push({ align: 'justifyRight', icon: 'icon-align-right' });
      this.typeList.push({ align: 'justifyFull', icon: 'icon-align-justify' });
    }
  }

  validateType(item) {
    if (!item.align) {
      return false;
    }
    if (!item.icon) {
      return false;
    }
    return this.fontList.filter((x) => x.align == item.align).length == 0;
  }

  populatePopUp() {
    let popupContainer = document.createElement('div');
    popupContainer.style.minWidth = '40px';

    let popupTypeList = document.createElement('ul');
    popupTypeList.classList.add('list');

    this.typeList.forEach((item) => {
      let popupTypeItem = document.createElement('li');
      popupTypeItem.classList.add('item');
      popupTypeItem.setAttribute('value', item.align);
      popupTypeList.appendChild(popupTypeItem);

      popupTypeItem.innerHTML = `<svg width="14" height="14" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet">
      <path transform="translate(0,512), scale(1, -1)" d="${
        icons[item.icon]
      }" />
    </svg>`;

      popupTypeItem.addEventListener('click', (evt) => this.execute(evt));
    });

    popupContainer.appendChild(popupTypeList);
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
    if (selection.rangeCount >= 1) {
      let align = evt.currentTarget.getAttribute('value');
      document.execCommand(align, false, null);
      this.checkState();
      this.options.events.refreshResize();
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
    Array.from(this.popup.children[0].children[0].children).forEach((li) => {
      let align = li.getAttribute('value');
      if (
        document.queryCommandState(align) ||
        (align == 'justifyLeft' && document.queryCommandState(align) == null)
      ) {
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
