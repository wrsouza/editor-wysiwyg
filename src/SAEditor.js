import './scss/main.scss';

import Bold from './plugins/Bold';
import Italic from './plugins/Italic';
import Underline from './plugins/Underline';
import Strikethrought from './plugins/Strikethrought';
import Separator from './plugins/Separator';

import Fonts from './plugins/Fonts';
import Sizes from './plugins/Sizes';
import Colors from './plugins/Colors';
import Clear from './plugins/Clear';

import Formats from './plugins/Formats';
import Quote from './plugins/Quote';
import Outdent from './plugins/Outdent';
import Indent from './plugins/Indent';
import Aligns from './plugins/Aligns';
import OrderedList from './plugins/OrderedList';
import UnorderedList from './plugins/UnorderedList';
import HorizontalRule from './plugins/HorizontalRule';

import Hyperlink from './plugins/Hyperlink';
import Images from './plugins/Images';

import Button from './plugins/Button';

/* MODULES */
import ResizeImage from './modules/ResizeImage';

export default class SAEditor {
  constructor(obj, options = {}) {
    this.options = options;
    this.textarea = document.querySelector(obj);
    this.editor = document.createElement('div');
    this.toolbar = document.createElement('div');
    this.toolbarContainer = document.createElement('div');
    this.editorContainer = document.createElement('div');
    this.editorView = document.createElement('div');
    this.editorHtml = document.createElement('div');

    this.toolbar.appendChild(this.toolbarContainer);
    this.editor.appendChild(this.toolbar);
    this.editor.appendChild(this.editorContainer);
    this.editor.appendChild(this.editorHtml);
    this.editorContainer.appendChild(this.editorView);

    this.events = {};
    this.toolbarButtons = [];
    this.registerModules();
    this.registerPlugins();
    this.registerEvents();
    this.render();
  }

  registerEvents() {
    this.events.closeAllPopUps = () => this.closeAllPopUps();
    this.events.refreshAllStates = () => this.refreshAllStates();
    this.events.editorFocus = () => this.editorView.focus();
    this.events.updateHTML = () => {
      this.textarea.value = this.editorView.innerHTML;
    };
  }

  registerModules() {
    this.modules = [];
    this.modules.push({
      name: 'resize-image',
      objectClass: ResizeImage,
      options: { container: this.editorContainer, view: this.editorView },
    });
  }

  registerPlugins() {
    this.plugins = [];
    this.plugins.push({
      name: 'bold',
      objectClass: Bold,
      options: { name: 'Negrito (CTRL+B)', icon: 'icon-bold' },
    });
    this.plugins.push({
      name: 'italic',
      objectClass: Italic,
      options: { name: 'Itálico (CTRL+I)', icon: 'icon-italic' },
    });
    this.plugins.push({
      name: 'underline',
      objectClass: Underline,
      options: { name: 'Sublinhado (CTRL+U)', icon: 'icon-underline' },
    });
    this.plugins.push({
      name: 'strikethrought',
      objectClass: Strikethrought,
      options: { name: 'Tachado', icon: 'icon-strikethrough' },
    });
    this.plugins.push({
      name: 'separator',
      objectClass: Separator,
      options: {},
    });
    this.plugins.push({
      name: 'fonts',
      objectClass: Fonts,
      options: { name: 'Fontes', icon: 'icon-font' },
    });
    this.plugins.push({
      name: 'sizes',
      objectClass: Sizes,
      options: { name: 'Tamanhos', icon: 'icon-text-height' },
    });
    this.plugins.push({
      name: 'colors',
      objectClass: Colors,
      options: { name: 'Cores', icon: 'icon-tint' },
    });
    this.plugins.push({
      name: 'clear',
      objectClass: Clear,
      options: { name: 'Limpar Formatação', icon: 'icon-eraser' },
    });
    this.plugins.push({
      name: 'formats',
      objectClass: Formats,
      options: { name: 'Formatos', icon: 'icon-paragraph' },
    });
    this.plugins.push({
      name: 'quote',
      objectClass: Quote,
      options: { name: 'Anotação', icon: 'icon-quote-right' },
    });
    this.plugins.push({
      name: 'outdent',
      objectClass: Outdent,
      options: { name: 'Remover Indentação', icon: 'icon-outdent' },
    });
    this.plugins.push({
      name: 'indent',
      objectClass: Indent,
      options: { name: 'Inserir Indentação', icon: 'icon-indent' },
    });
    this.plugins.push({
      name: 'aligns',
      objectClass: Aligns,
      options: { name: 'Alinhamento', icon: 'icon-align-left' },
    });
    this.plugins.push({
      name: 'ordered list',
      objectClass: OrderedList,
      options: { name: 'Lista Numérica', icon: 'icon-list-ol' },
    });
    this.plugins.push({
      name: 'unordered list',
      objectClass: UnorderedList,
      options: { name: 'Lista Desordenada', icon: 'icon-list-ul' },
    });
    this.plugins.push({
      name: 'horizontal rule',
      objectClass: HorizontalRule,
      options: { name: 'Linha Horizontal', icon: 'icon-minus' },
    });
    this.plugins.push({
      name: 'hyperlink',
      objectClass: Hyperlink,
      options: { name: 'Link', icon: 'icon-link' },
    });
    this.plugins.push({
      name: 'images',
      objectClass: Images,
      options: {
        name: 'Imagem',
        icon: 'icon-picture-o',
        ...this.options.images,
      },
    });
  }

  render() {
    this.editor.id = 'fbs-editor';
    this.editor.classList.add('fbs-editor');
    this.toolbar.classList.add('fbs-editor-bar');
    this.toolbarContainer.classList.add('fbs-editor-bar-container');
    this.editorContainer.classList.add('fbs-editor-container');
    this.editorView.classList.add('fbs-editor-view');
    this.editorHtml.classList.add('fbs-editor-html');

    this.editorView.contentEditable = true;
    this.editorView.spellcheck = true;

    this.setToolbarItems();
    this.setModules();

    this.textarea.style.display = 'none';
    this.editorView.innerHTML = this.textarea.value;

    let parent = this.textarea.parentElement;
    parent.insertBefore(this.editor, this.textarea.nextSibling);

    this.editorView.addEventListener('keyup', () => {
      console.log('insert');
      //this.textarea.value = this.editorView.outerHTML;
      this.textarea.value = this.editorView.innerHTML;
    });
  }

  setToolbarItems() {
    let toolbarItems = [
      'bold',
      'italic',
      'underline',
      'strikethrought',
      'separator',
      'fonts',
      'sizes',
      'colors',
      'clear',
      'separator',
      'formats',
      'quote',
      'outdent',
      'indent',
      'aligns',
      'ordered list',
      'unordered list',
      'horizontal rule',
      'separator',
      'hyperlink',
      'images',
    ];
    toolbarItems.forEach((name) => {
      this.addToolbarItem(name);
    });
  }

  setModules() {
    this.modules.forEach((module) => {
      let item = new module.objectClass({
        ...module.options,
        events: this.events,
      });
      item.init();
    });
  }

  addToolbarItem(name) {
    let plugin = this.plugins.filter((x) => x.name == name)[0];
    if (plugin) {
      let item = new plugin.objectClass({
        ...plugin.options,
        view: this.editorView,
        events: this.events,
      });
      this.toolbarButtons.push(item);
      this.toolbarContainer.appendChild(item.render());
    }
  }

  closeAllPopUps() {
    this.toolbarButtons.forEach((button) => {
      if (button.isPopUpOpenned) {
        button.closePopUp();
      }
    });
  }

  refreshAllStates() {
    this.toolbarButtons.forEach((button) => {
      if (button instanceof Button) {
        button.refreshState();
      }
    });
  }
}
