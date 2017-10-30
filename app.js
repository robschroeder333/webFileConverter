let fileURL = null;
let uploadedFile = null;

const dataStringToArray = dataString => {
  const dataArray = [];
  const rows = dataString.split('\n');

  for (let i = 0; i < rows.length; i++) {
    const columns = rows[i].split('\t');
    let rowData = [];

    for (let ii = 0; ii < columns.length; ii++) {
      rowData.push(columns[ii]);
    }
    dataArray.push(rowData);
  }

  return dataArray;
};

const formatData = array => {
  const dataArray = array.slice(2, array.length - 1);

  const data = dataArray.map(ele => {
    const amount = parseInt(ele[5], 10).toFixed(2);
    const date = ele[6].slice(0, 10).split('-').join('/');

    return `TRNS\t${amount}\tPAYMENT\t${date}`;
  }

  );
  data.unshift('!ACCNT\tNAME');
  const dataString = data.join('\n');
  return dataString;
};

const makefileURL = text => {
  var data = new Blob([text], {type: 'text/plain'});

  fileURL = window.URL.createObjectURL(data);

  return fileURL;
};

const onDownload = () => {
  setTimeout(() => {
    const dl = document.getElementById('download');
    dl.innerText = '';

    const ul = document.getElementById('upload');
    ul.value = '';

    window.URL.revokeObjectURL(fileURL);
    fileURL = null;
    console.log('record of file erased');
  }, 1000);

};

const dataToFile = (dataString, name) => {
  const dataURL = makefileURL(dataString);
  const fileName = `${name}.tsv`;

  const dl = document.getElementById('download');
  dl.href = dataURL;
  dl.download = fileName;
  dl.innerText = `Click to Download converted file`;
  dl.addEventListener('click', onDownload);
};

const validator = array => {
  if (array[0][4] === 'Earned Receipts') {
    const formattedData = formatData(array);
    // needs context for uploadedFile
    const formattedName = uploadedFile.name.split('.')[0];
    dataToFile(formattedData, formattedName);

  } else {
    //failed validation message
    alert("Oops!\n\nWe can't find the MacPractice payment records in this file.\n\nPlease double-check to make sure you're uploading the right file, and try again.\n\nIf that doesn't work, please reach out for help:\n\nCall 347-674-8874 or email joe@joewestcott.com.\n\nThank you,\nJoe");
    const ul = document.getElementById('upload');
    ul.value = '';
  }
};
function getUploadedFile(evt) {
  uploadedFile = evt.target.files[0];
  const reader = new FileReader();

  // // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      let contents = dataStringToArray(e.target.result);
      contents = validator(contents);
    };
  })(uploadedFile);

  // Read in the image file as a data URL.
  reader.readAsText(uploadedFile);
}

document.getElementById('upload').addEventListener('change', getUploadedFile, false);
