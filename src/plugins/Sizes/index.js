import Button from '../Button';

export default class Sizes extends Button {
  constructor(options) {
    super(options);
    this.registerSizes();
  }

  registerSizes() {
    this.sizeList = [];
    if (this.options.sizes) {
      this.options.sizes.forEach((size) => {
        if (validateFont(size)) {
          this.sizeList.push(size);
        }
      });
    } else {
      this.sizeList.push({ name: '10', style: 'font-size:10px;' });
      this.sizeList.push({ name: '11', style: 'font-size:11px;' });
      this.sizeList.push({ name: '12', style: 'font-size:12px;' });
      this.sizeList.push({ name: '13', style: 'font-size:13px;' });
      this.sizeList.push({ name: '14', style: 'font-size:14px;' });
      this.sizeList.push({ name: '15', style: 'font-size:15px;' });
      this.sizeList.push({ name: '16', style: 'font-size:16px;' });
      this.sizeList.push({ name: '17', style: 'font-size:17px;' });
      this.sizeList.push({ name: '18', style: 'font-size:18px;' });
      this.sizeList.push({ name: '19', style: 'font-size:19px;' });
      this.sizeList.push({ name: '20', style: 'font-size:20px;' });
      this.sizeList.push({ name: '22', style: 'font-size:22px;' });
      this.sizeList.push({ name: '24', style: 'font-size:24px;' });
      this.sizeList.push({ name: '26', style: 'font-size:26px;' });
      this.sizeList.push({ name: '32', style: 'font-size:32px;' });
      this.sizeList.push({ name: '48', style: 'font-size:48px;' });
      this.sizeList.push({ name: '56', style: 'font-size:56px;' });
    }
  }

  validateFont(size) {
    if (!size.name) {
      return false;
    }
    if (!size.style) {
      return false;
    }
    return this.sizeList.filter((x) => x.name == size.name).length == 0;
  }

  populatePopUp() {
    let popupContainer = document.createElement('div');
    popupContainer.style.minWidth = '100px';

    let popupSizeList = document.createElement('ul');
    popupSizeList.classList.add('list');
    popupSizeList.style.height = '230px';
    popupSizeList.style.overflowY = 'scroll';

    this.sizeList.forEach((size) => {
      let popupSizeItem = document.createElement('li');
      popupSizeItem.classList.add('item');
      popupSizeItem.setAttribute('value', size.name);
      popupSizeItem.style = size.style;
      popupSizeItem.innerHTML = size.name;
      popupSizeItem.addEventListener('click', (evt) => this.execute(evt));
      popupSizeList.appendChild(popupSizeItem);
    });

    popupContainer.appendChild(popupSizeList);
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
      const span = document.createElement('span');
      span.style.fontSize = `${evt.target.getAttribute('value')}px`;
      span.innerHTML = selection.toString();
      const contents = selection.getRangeAt(0).extractContents();
      selection.getRangeAt(0).insertNode(span);
      this.checkState(evt.target.getAttribute('value'));
      this.options.events.updateHTML();
    }
  }

  onMouseUp(evt) {
    this.checkState();
  }

  onKeyUp(evt) {
    this.checkState();
  }

  checkState(fontSize = null) {
    if (!fontSize) {
      if (window.getSelection().empty) {
        return;
      }
      const contents = window.getSelection().getRangeAt(0)
        .commonAncestorContainer;
      fontSize = contents.parentElement.style.fontSize.replace(/px/g, '');
    }

    Array.from(this.popup.children[0].children[0].children).forEach((li) => {
      if (li.getAttribute('value') == fontSize) {
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
