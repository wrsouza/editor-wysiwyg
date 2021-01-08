import Button from '../Button';
import icons from '~/static/icons.json';

export default class Images extends Button {
  constructor(options) {
    super(options);
    this.uploadFiles = options.uploadFiles;
  }

  populatePopUp() {
    this.popup.style.minWidth = '200px';
    this.popup.style.left = 'auto';
    this.popup.style.right = '-20px';

    this.popupContainer = document.createElement('div');
    this.popupContainer.classList.add('fbs-editor-bar-item-images');

    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('fbs-editor-bar-item-images-container');

    let buttonUpload = document.createElement('button');
    buttonUpload.setAttribute('type', 'button');
    buttonUpload.classList.add('fbs-editor-bar-item-images-button');
    buttonUpload.classList.add('active');
    buttonUpload.innerHTML = `<svg width="14" height="14" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet">
        <path transform="translate(0,512), scale(1, -1)" d="${icons['icon-upload']}" />
      </svg>
      <span class="fbs-editor-bar-item-tooltip">
        <span class="fbs-editor-bar-item-tooltip-text">Upload</span>
      </span>`;

    let buttonBrowser = document.createElement('button');
    buttonBrowser.setAttribute('type', 'button');
    buttonBrowser.classList.add('fbs-editor-bar-item-images-button');
    buttonBrowser.innerHTML = `<svg width="14" height="14" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet">
        <path transform="translate(0,512), scale(1, -1)" d="${icons['icon-folder-open']}" />
      </svg>
      <span class="fbs-editor-bar-item-tooltip">
        <span class="fbs-editor-bar-item-tooltip-text">Imagens</span>
      </span>`;

    this.dropImage = document.createElement('div');
    this.dropImage.classList.add('fbs-editor-bar-item-images-progressfiles');
    this.image = new Image();
    this.dropProgress = document.createElement('div');
    this.dropProgress.classList.add('progress');

    this.dropProgressBar = document.createElement('div');
    this.dropProgressBar.classList.add('progress-bar');

    this.dropProgressText = document.createElement('span');
    this.dropProgressText.innerText = '0%';
    this.dropProgressText.classList.add('progress-text');

    this.dropTarget = document.createElement('div');
    this.dropTarget.classList.add('fbs-editor-bar-item-images-droptarget');

    this.dropText = document.createElement('p');
    this.dropText.innerHTML = 'Arraste a Imagem <span>(ou clique)</span>';

    this.dropProgress.appendChild(this.dropProgressBar);
    this.dropProgress.appendChild(this.dropProgressText);

    this.dropImage.appendChild(this.image);
    this.dropImage.appendChild(this.dropProgress);

    this.dropTarget.appendChild(this.dropText);
    this.dropTarget.addEventListener('dragover', (evt) =>
      this.dragOverFiles(evt)
    );
    this.dropTarget.addEventListener('drop', (evt) => this.dropFiles(evt));
    this.dropTarget.addEventListener('dragleave', (evt) =>
      this.dragLeaveFiles(evt)
    );
    this.dropTarget.addEventListener('click', (evt) => this.selectFiles(evt));

    buttonContainer.appendChild(buttonUpload);
    buttonContainer.appendChild(buttonBrowser);
    this.popupContainer.appendChild(buttonContainer);
    this.popupContainer.appendChild(this.dropImage);
    this.popupContainer.appendChild(this.dropTarget);

    return this.popup.appendChild(this.popupContainer);
  }

  onClick(evt) {
    if (this.isPopUpOpenned) {
      return this.closePopUp();
    }
    return this.openPopUp();
  }

  dragOverFiles(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    this.dropTarget.classList.add('active');
  }

  dragLeaveFiles(event) {
    this.dropTarget.classList.remove('active');
  }

  dropFiles(e) {
    this.dropTarget.classList.remove('active');
    e.stopPropagation();
    e.preventDefault();
    this.checkFiles(e.dataTransfer.files);
  }

  selectFiles(e) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg, .jpeg, .png, .gif|images/*';
    input.addEventListener('change', (e) => this.checkFiles(e.target.files));
    input.click();
  }

  checkFiles(files) {
    if (
      files.length &&
      (files[0].type == 'image/jpeg' ||
        files[0].type == 'image/png' ||
        files[0].type == 'image/gif')
    ) {
      this.file = files[0];
      this.loadFiles();
    }
  }

  loadFiles() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const image = new Image();
      image.onload = (e) => this.renderFiles(image);
      image.src = e.target.result;
    };
    fileReader.onprogress = (e) => {
      this.progress = Math.floor((e.loaded / e.total) * 100);
    };
    fileReader.readAsDataURL(this.file);
  }

  renderFiles(image) {
    const ratio =
      200 / (image.width > image.height ? image.width : image.height);

    const width = Math.floor(image.width * ratio);
    const height = Math.floor(image.height * ratio);
    const rotate = width < height ? -90 : 0;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width > height ? width : height;
    canvas.height = width > height ? height : width;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const x = -(width > height ? canvas.width / 2 : canvas.height / 2);
    const y = -(width > height ? canvas.height / 2 : canvas.width / 2);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();

    this.dropProgressBar.style.width = '0%';
    this.dropProgressText.innerText = '0%';
    this.image.setAttribute('src', canvas.toDataURL());
    this.popupContainer.classList.add('active');
    this.uploadImage();
  }

  async uploadImage() {
    try {
      const url = await this.uploadFiles(this.file, {
        dropProgressBar: this.dropProgressBar,
        dropProgressText: this.dropProgressText,
      });

      const img = new Image();
      img.onload = () => this.handleImage(img);
      img.src = url;

      this.popupContainer.classList.remove('active');
      this.closePopUp();
    } catch (err) {
      console.log(err);
      this.popupContainer.classList.remove('active');
      this.closePopUp();
      alert('Erro no envio.');
    }
  }

  handleImage(img) {
    this.options.events.editorFocus();
    document.execCommand('insertHTML', false, img.outerHTML);
    this.options.events.updateHTML();
  }
}
