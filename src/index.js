// module.exports = require('./SAEditor').default;

import SAEditor from './SAEditor';

let editor;
document.body.onload = () => {
  editor = new SAEditor('#sa-editor');
};
