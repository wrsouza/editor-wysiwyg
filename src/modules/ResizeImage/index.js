export default class ResizeImage {
  constructor(options) {
    this.container = options.container;
    this.view = options.view;
    this.events = options.events;
    this.selection = null;
    this.selectedImage = null;
    this.params = {
      image: {
        offsetTop: 0,
        offsetLeft: 0,
        clientWidth: 0,
        clientHeight: 0,
        naturalWidth: 0,
        naturalHeight: 0,
      },
      mouseX: 0,
      mouseY: 0,
      pointId: null,
    };
  }

  init() {
    this.addResizerToContainer();
    this.view.addEventListener('click', (evt) => this.checkEventClick(evt));
    window.addEventListener('resize', (evt) => this.hideSelection());
    this.events.refreshResize = () => this.hideSelection();
  }

  addResizerToContainer() {
    this.selection = this.createHtmlElement(
      'fbs-resize-image',
      'fbs-editor-resize-image'
    );
    this.container.appendChild(this.selection);

    this.box = this.createHtmlElement('box', 'fbs-editor-resize-image-box');
    this.selection.appendChild(this.box);

    this.topLeft = this.createHtmlElement(
      'tl',
      'fbs-editor-resize-image-box-tl'
    );
    this.topRight = this.createHtmlElement(
      'tr',
      'fbs-editor-resize-image-box-tr'
    );
    this.bottomLeft = this.createHtmlElement(
      'bl',
      'fbs-editor-resize-image-box-bl'
    );
    this.bottomRight = this.createHtmlElement(
      'br',
      'fbs-editor-resize-image-box-br'
    );

    this.box.appendChild(this.topLeft);
    this.box.appendChild(this.topRight);
    this.box.appendChild(this.bottomLeft);
    this.box.appendChild(this.bottomRight);

    this.topLeft.addEventListener('mousedown', (evt) =>
      this.mouseEventDown(evt)
    );
    this.topRight.addEventListener('mousedown', (evt) =>
      this.mouseEventDown(evt)
    );
    this.bottomLeft.addEventListener('mousedown', (evt) =>
      this.mouseEventDown(evt)
    );
    this.bottomRight.addEventListener('mousedown', (evt) =>
      this.mouseEventDown(evt)
    );
  }

  createHtmlElement(id, className) {
    let element = document.createElement('div');
    element.id = id;
    element.classList.add(className);
    return element;
  }

  checkEventClick(evt) {
    for (let img of this.view.getElementsByTagName('img')) {
      if (evt.target == img) {
        const range = new Range();
        range.setStartBefore(img);
        range.setEndAfter(img);

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

        window.getSelection().addRange(range);

        this.selectedImage = img;
        this.showSelection();
        this.events.refreshAlign();
        return;
      }
    }
    if (
      evt.target.id != 'box' &&
      evt.target.id != 'tl' &&
      evt.target.id != 'tr' &&
      evt.target.id != 'bl' &&
      evt.target.id != 'br' &&
      this.selectedImage != null
    ) {
      this.hideSelection();
    }
  }

  mouseEventDown(evt) {
    this.params.image.offsetTop = this.selectedImage.offsetTop;
    this.params.image.offsetLeft = this.selectedImage.offsetLeft;
    this.params.image.clientWidth = this.selectedImage.clientWidth;
    this.params.image.clientHeight = this.selectedImage.clientHeight;

    this.params.mouseX = evt.clientX;
    this.params.mouseY = evt.clientY;
    this.params.pointId = evt.target.id;

    this.upHandler = this.mouseEventUp.bind(this);
    this.moveHandler = this.mouseEventMove.bind(this);

    window.addEventListener('mousemove', this.moveHandler);
    window.addEventListener('mouseup', this.upHandler);
  }

  mouseEventMove(evt) {
    let diffMouseX, diffMouseY, diffMouse, ratio, width, height;
    switch (this.params.pointId) {
      case 'tl':
        diffMouseX = evt.clientX - this.params.mouseX;
        diffMouseY = evt.clientY - this.params.mouseY;
        break;
      case 'tr':
        diffMouseX = this.params.mouseX - evt.clientX;
        diffMouseY = evt.clientY - this.params.mouseY;
        break;
      case 'bl':
        diffMouseX = evt.clientX - this.params.mouseX;
        diffMouseY = this.params.mouseY - evt.clientY;
        break;
      case 'br':
        diffMouseX = this.params.mouseX - evt.clientX;
        diffMouseY = this.params.mouseY - evt.clientY;
        break;
    }

    diffMouse = Math.floor((diffMouseX + diffMouseY) / 2);
    ratio =
      this.params.image.naturalWidth > this.params.image.naturalHeight
        ? (this.params.image.clientWidth - diffMouse) /
          this.params.image.naturalWidth
        : (this.params.image.clientHeight - diffMouse) /
          this.params.image.naturalHeight;
    width = Math.floor(this.params.image.naturalWidth * ratio);
    height = Math.floor(this.params.image.naturalHeight * ratio);

    this.selectedImage.width = width;
    this.selectedImage.height = height;
    this.box.style.width = this.selectedImage.clientWidth + 'px';
    this.box.style.height = this.selectedImage.clientHeight + 'px';
    this.box.style.left =
      this.params.image.parentOffsetLeft + this.selectedImage.offsetLeft + 'px';
    this.box.style.top =
      this.params.image.parentOffsetTop + this.selectedImage.offsetTop + 'px';
  }

  mouseEventUp(evt) {
    window.removeEventListener('mousemove', this.moveHandler);
    window.removeEventListener('mouseup', this.upHandler);
  }

  showSelection() {
    let parentOffset = this.getParentOffset({
      offsetLeft: 0,
      offsetTop: 0,
      parent: this.selectedImage.offsetParent,
    });
    this.params.image = {
      parentOffsetTop: parentOffset.offsetTop,
      parentOffsetLeft: parentOffset.offsetLeft,
      url: this.selectedImage.currentSrc,
      offsetTop: this.selectedImage.offsetTop,
      offsetLeft: this.selectedImage.offsetLeft,
      clientWidth: this.selectedImage.clientWidth,
      clientHeight: this.selectedImage.clientHeight,
      naturalWidth: this.selectedImage.naturalWidth,
      naturalHeight: this.selectedImage.naturalHeight,
    };

    this.box.style.left =
      this.params.image.parentOffsetLeft + this.params.image.offsetLeft + 'px';
    this.box.style.top =
      this.params.image.parentOffsetTop + this.params.image.offsetTop + 'px';
    this.box.style.width = this.params.image.clientWidth + 'px';
    this.box.style.height = this.params.image.clientHeight + 'px';

    this.selection.classList.add('active');
    document.addEventListener('keyup', (evt) => this.removeSelectedImage(evt));
  }

  getParentOffset(params) {
    if (params.parent !== this.view) {
      params.offsetLeft += parseInt(params.parent.offsetLeft);
      params.offsetTop += parseInt(params.parent.offsetTop);
      params.parent = params.parent.offsetParent;
      return this.getParentOffset(params);
    }
    return params;
  }

  hideSelection() {
    if (this.selectedImage) {
      document.removeEventListener('keyup', (evt) =>
        this.removeSelectedImage(evt)
      );
      this.selectedImage = null;
      this.selection.classList.remove('active');
    }
  }

  removeSelectedImage(evt) {
    if (!this.selectedImage) {
      return;
    }
    if (evt.code == 'Delete' || evt.key == 'Delete') {
      let containerSelectedImage = this.selectedImage.parentNode;
      containerSelectedImage.removeChild(this.selectedImage);
      this.hideSelection();
    }
  }
}
