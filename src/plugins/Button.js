import icons from '~/static/icons.json';

export default class Button {
  constructor(options) {
    this.options = options;
    this.view = options.view;

    this.name = this.options.name ? this.options.name : 'Default Button';
    this.icon = this.options.icon ? this.options.icon : 'icon-default';
    this.itemGroup = document.createElement('div');
    this.button = document.createElement('button');
    this.tooltip = document.createElement('span');
    this.tooltipText = document.createElement('span');
    this.popup = document.createElement('div');
    this.isPopUpOpenned = false;

    this.button.addEventListener('click', (evt) => this.onClick(evt));
    this.view.addEventListener('mouseup', (evt) => this.onMouseUp(evt));
    this.view.addEventListener('keyup', (evt) => this.onKeyUp(evt));
  }

  render() {
    this.itemGroup.classList.add('fbs-editor-bar-item-group');
    this.button.setAttribute('type', 'button');
    this.button.classList.add('fbs-editor-bar-item-button');
    this.buttonIcon = `<svg width="14" height="14" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet">
      <path transform="translate(0,512), scale(1, -1)" d="${
        icons[this.icon]
      }" />
    </svg>`;
    this.tooltip.classList.add('fbs-editor-bar-item-tooltip');
    this.tooltipText.classList.add('fbs-editor-bar-item-tooltip-text');
    this.tooltipText.innerHTML = this.name;

    this.tooltip.appendChild(this.tooltipText);
    this.button.insertAdjacentHTML('beforeend', this.buttonIcon);
    this.button.appendChild(this.tooltip);
    this.itemGroup.appendChild(this.button);

    if (this.populatePopUp()) {
      this.popup.classList.add('fbs-editor-bar-item-popup');
      this.itemGroup.appendChild(this.popup);
    }
    return this.itemGroup;
  }

  populatePopUp() {
    return null;
  }

  execute(evt) {
    this.options.events.closeAllPopUps();
  }

  openPopUp() {
    this.options.events.closeAllPopUps();
    this.isPopUpOpenned = true;
    this.button.classList.add('active');
    this.popup.classList.add('show');
  }

  closePopUp() {
    this.isPopUpOpenned = false;
    this.button.classList.remove('active');
    this.popup.classList.remove('show');
  }

  onClick(evt) {
    this.execute(evt);
  }

  onMouseUp(evt) {
    //console.log(evt)
  }

  onKeyUp(evt) {
    //console.log(evt)
  }

  refreshState() {}
}
