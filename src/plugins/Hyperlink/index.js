import Button from '../Button';

export default class Hyperlink extends Button {
  constructor(options) {
    super(options);
  }

  populatePopUp() {
    this.popup.style.minWidth = '300px';
    this.popup.style.left = 'auto';
    this.popup.style.right = '-50px';

    let popupContainer = document.createElement('div');
    popupContainer.classList.add('fbs-editor-bar-item-hyperlink');

    let groupLink = document.createElement('div');
    groupLink.classList.add('fbs-editor-bar-item-hyperlink-group');

    let labelLink = document.createElement('label');
    labelLink.innerText = 'Link URL';

    this.inputLink = document.createElement('input');
    this.inputLink.setAttribute('type', 'text');
    this.inputLink.setAttribute('placeholder', 'https://');
    this.inputLink.classList.add('fbs-editor-bar-item-hyperlink-group-control');

    let groupButton = document.createElement('div');
    groupButton.classList.add('fbs-editor-bar-item-hyperlink-group');

    let buttonOk = document.createElement('button');
    buttonOk.innerText = 'Ok';
    buttonOk.classList.add('fbs-editor-bar-item-hyperlink-group-btn');
    buttonOk.addEventListener('click', (evt) => this.execute(evt));

    this.checkbox = document.createElement('input');
    this.checkbox.setAttribute('value', 1);
    this.checkbox.setAttribute('type', 'checkbox');

    let labelCheck = document.createElement('label');
    labelCheck.innerText = 'Exibir em Nova Janela';

    groupLink.appendChild(labelLink);
    groupLink.appendChild(this.inputLink);

    groupButton.appendChild(buttonOk);
    groupButton.appendChild(this.checkbox);
    groupButton.appendChild(labelCheck);

    popupContainer.appendChild(groupLink);
    popupContainer.appendChild(groupButton);

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

    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }

    this.ranges.forEach((range) => {
      window.getSelection().addRange(range);
    });

    let href = this.inputLink.value;
    let target = this.checkbox.checked ? '_blank' : '_self';

    if (href == '' || href == undefined) {
      const span = document.createElement('span');
      span.innerText = this.texto;
      document.execCommand('insertHTML', false, span.outerHTML);
    } else {
      const a = document.createElement('a');
      a.innerHTML = this.texto;
      a.setAttribute('href', href);
      a.setAttribute('target', target);
      document.execCommand('insertHTML', false, a.outerHTML);
    }
    this.options.events.updateHTML();
  }

  onMouseUp(evt) {
    this.checkState();
  }

  onKeyUp(evt) {
    this.checkState();
  }

  checkState() {
    const selection = window.getSelection();
    if (selection.rangeCount < 1) {
      return;
    }

    this.texto = selection.toString();
    if (this.texto.length < 1) {
      return;
    }

    this.ranges = [];
    for (let i = 0; i < selection.rangeCount; i++) {
      this.ranges.push(selection.getRangeAt(i));
    }

    let href = selection.anchorNode.parentNode.getAttribute('href');
    let target = selection.anchorNode.parentNode.getAttribute('target');

    this.inputLink.value = href ? href : '';
    this.checkbox.checked = !target || target == '_self' ? false : true;
  }
}
