const uploadFiles = (file, { dropProgressBar, dropProgressText }) => {
  const data = new FormData();
  data.append('file', file);
  return axios
    .post(`http://localhost/api/images/upload`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.floor(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        dropProgressBar.style.width = `${progress}%`;
        dropProgressText.innerText = `${progress}%`;
      },
    })
    .then((response) => {
      return response.data.url;
    });
};

let editor;
document.body.onload = () => {
  editor = new SAEditor('#sa-editor', {
    images: {
      uploadFiles
    }
  });
};
