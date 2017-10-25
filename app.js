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

// For now snip off first two lines
const formatData = array => {

  // check last element and whether it is valid
  const dataArray = array.slice(2, array.length - 1);


  const data = dataArray.map(ele =>
    `TRNS\t${ele[5]}\tPAYMENT\t${ele[6]}`

  );
  data.shift(['!ACCNT', 'NAME']);
  const dataString = data.join('\n');
  return dataString;
};

const validator = array => {
  if (array[0][4] === 'Earned Receipts') {
    return formatData(array);
  } else {
    alert("## Oops! \n We can't find the MacPractice payment records in this file. \n Please double-check to make sure you're uploading the right file, and try again. \n If that doesn't work, please reach out for help: \n Call **347-674-8874** or email **joe@joewestcott.com**. \n Thank you, \n Joe");
  }
};

function getUploadedFile(evt) {
  const uploadedFile = evt.target.files[0];
  const reader = new FileReader();

  // // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      let contents = dataStringToArray(e.target.result);
      contents = validator(contents);

      // Display formatted contents of file (will be undefined if failed validation)
      document.getElementById('contents').innerText = contents;
    };
  })(uploadedFile);

  // Read in the image file as a data URL.
  reader.readAsText(uploadedFile);

}

document.getElementById('upload').addEventListener('change', getUploadedFile, false);
