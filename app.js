let textFile = null;
let uploadedFile = null;

const dataStringToArray = dataString => {
  const dataArray = [];

  const rows = dataString.split('\n');
  for (let i = 0; i < rows.length; i++) {
    const columns = rows[i].split('\t');
    let rowData = [];
    // Core logic
    for (let ii = 0; ii < columns.length; ii++) {
      rowData.push(columns[ii]);
    }
    dataArray.push(rowData);
  }

  return dataArray;
};


const formatData = array => {

  // check last element and whether it is valid
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

const makeTextFile =  (text) => {
  var data = new Blob([text], {type: 'text/plain'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  // returns a URL you can use as a href
  return textFile;
};

const onDownload = () => {
  textFile = null;
  console.log('record of file erased');
};

const dataToFile = (dataString, name) => {
  const dataURL = makeTextFile(dataString);
  const fileName = `${name}.txt`;

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = fileName;
  link.innerText = `Click to Download converted file`;
  link.addEventListener('click', onDownload);

  const dl = document.getElementById('download');
  dl.appendChild(link);
};

const validator = array => {
  if (array[0][4] === 'Earned Receipts') {
    const formattedData = formatData(array);
    // needs context for uploadedFile
    const formattedName = uploadedFile.name.split('.')[0];
    dataToFile(formattedData, formattedName);

  } else {
    //failed validation message
    alert("## Oops! \n We can't find the MacPractice payment records in this file. \n Please double-check to make sure you're uploading the right file, and try again. \n If that doesn't work, please reach out for help: \n Call **347-674-8874** or email **joe@joewestcott.com**. \n Thank you, \n Joe");
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
