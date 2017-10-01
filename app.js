const reFormatData = dataString => {
  const dataArray = [];

  const rows = dataString.split('\n');
  for (let i = 0; i < rows.length; i++) {
    const columns = rows[i].split('\t');

    // Core logic
    dataArray.push(columns[1]);
  }

  const targetData = dataArray.join('\n');
  return targetData;
};

function getUploadedFile(evt) {
  const uploadedFile = evt.target.files[0];
  const reader = new FileReader();

  // // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      const contents = reFormatData(e.target.result);
      document.getElementById('contents').innerText = contents;
    };
  })(uploadedFile);

  // Read in the image file as a data URL.
  reader.readAsText(uploadedFile);

}

document.getElementById('upload').addEventListener('change', getUploadedFile, false);
