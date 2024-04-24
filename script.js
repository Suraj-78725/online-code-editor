const textarea = document.querySelector("textarea"),
fileNameInput = document.querySelector(".file-name input"),
selectMenu = document.querySelector(".save-as select"),
saveBtn = document.querySelector(".save-btn");
selectMenu.addEventListener("change", () => {
    const selectedFormat = selectMenu.options[selectMenu.selectedIndex].text;
    saveBtn.innerText = `Save As ${selectedFormat.split(" ")[0]} File`;
});
saveBtn.addEventListener("click", () => {
    // Use a setTimeout to ensure CodeMirror updates its value
    setTimeout(() => {
        const blob = new Blob([editor.getValue()], { type: selectMenu.value });
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = fileNameInput.value;
        link.href = fileUrl;
        link.click();
    }, 0);
});

document.getElementById('noteSelect').addEventListener('click', function() {
    var selectedOption = this.value;
    console.log(selectedOption);
    if (selectedOption === 'text/javascript') {
      window.location.href = 'https://drive.google.com/file/d/1-JripzcgKr0w0DNRh0j_fqde3uFw5ZjS/view'; // Replace with your Google Drive link
    }
  });
  
