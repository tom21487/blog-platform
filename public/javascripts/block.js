var blocksGlobalArray = [];

class Block {
  constructor(b) {
    // CONTAINER
    this.container = document.createElement('div');
    this.container.id = document.getElementById("all-blocks").childNodes.length;
    
    // SELECT
    this.select = document.createElement('select');
    this.select.name = 'order[]';
    let textOption = document.createElement('option');
    textOption.value = 'text';
    textOption.innerText = 'text';
    let imgOption = document.createElement('option');
    imgOption.value = 'image';
    imgOption.innerText = 'image';
    if (b.type == "text") {
      textOption.setAttribute("selected", true);
    } else if (b.type == "image") {
      imgOption.setAttribute("selected", true);
    }
    this.select.appendChild(textOption);
    this.select.appendChild(imgOption);
    this.select.addEventListener('change', this.displayField.bind(this));

    // DELETE BUTTON
    this.deleteBtn = document.createElement('button');
    this.deleteBtn.type = 'button';
    this.deleteBtn.innerText = 'x';
    this.deleteBtn.addEventListener('click', this.delete.bind(this));

    // INPUT
    this.inputEn = document.createElement('textarea');
    this.inputEn.name = 'textEn[]';
    this.inputEn.style.display = "block";
    this.inputEn.style.height = "100px";
    this.inputEn.style.marginBottom = "10px";
    this.inputEn.placeholder = "en" + this.container.id;
    this.inputEn.value = b.contentEn;

    this.inputCn = document.createElement('textarea');
    this.inputCn.name = 'textCn[]';
    this.inputCn.style.display = "block";
    this.inputCn.style.height = "100px";
    this.inputCn.style.marginBottom = "10px";
    this.inputCn.placeholder = "cn" + this.container.id;
    this.inputCn.value = b.contentCn;

    this.inputImg = document.createElement('input');
    this.inputImg.type = 'file';
    this.inputImg.name = 'image';
    this.inputImg.style.display = "block";
    this.inputImg.style.marginBottom = "10px";

    // IMAGE UPLOAD SELECTOR
    this.imageUploadSelector = document.createElement("select");
    let optionOld = document.createElement("option");
    optionOld.value = "old";
    optionOld.setAttribute("selected", true);
    optionOld.innerText = "use existing image";
    let optionNew = document.createElement("option");
    optionNew.value = "new";
    optionNew.innerText = "upload new image";
    this.imageUploadSelector.appendChild(optionOld);
    this.imageUploadSelector.appendChild(optionNew);
    this.imageUploadSelector.addEventListener("change", this.toggleImageUpload.bind(this));
    
    // APPEND ELEMENTS
    this.container.appendChild(this.select);
    this.container.appendChild(this.deleteBtn);
    if (b.type == "text") {
      this.container.appendChild(this.inputEn);
      this.container.appendChild(this.inputCn);
    } else if (b.type == "image") {
      this.select.name = "";
      this.imageUploadSelector.name = "order[]";
      this.container.insertBefore(this.imageUploadSelector, this.deleteBtn);
    }
  }

  displayField() {
    this.select.name = "order[]";
    if (this.select.value == 'text') {
      this.imageUploadSelector.remove();
      this.inputImg.remove();

      this.inputEn = document.createElement('textarea');
      this.inputEn.name = 'textEn[]';
      this.inputEn.style.display = "block";
      this.inputEn.style.height = "100px";
      this.inputEn.style.marginBottom = "10px";
      this.inputEn.placeholder = "en" + this.container.id;
      this.inputEn.value = "";

      this.inputCn = document.createElement('textarea');
      this.inputCn.name = 'textCn[]';
      this.inputCn.style.display = "block";
      this.inputCn.style.height = "100px";
      this.inputCn.style.marginBottom = "10px";
      this.inputCn.placeholder = "cn" + this.container.id;
      this.inputCn.value = "";

      this.container.appendChild(this.inputEn);
      this.container.appendChild(this.inputCn);
    }
    else if (this.select.value == 'image') {
      this.inputEn.remove();
      this.inputCn.remove();

      this.inputImg = document.createElement('input');
      this.inputImg.type = 'file';
      this.inputImg.name = 'image';
      this.inputImg.style.display = "block";
      this.inputImg.style.marginBottom = "10px";

      this.container.appendChild(this.inputImg);
    }
  }

  delete() {
    let allBlocks = document.getElementById("all-blocks");
    let rank = parseInt(this.container.id, 10);
    for (let i = rank+1; i < allBlocks.childNodes.length; ++i) {
      // currentblock is passed by reference
      let currentblock = allBlocks.childNodes[i];
      let currentRank = parseInt(currentblock.id, 10);
      currentRank -= 1;
      currentblock.id = currentRank;
      currentblock.childNodes[2].innerText = currentblock.id;
    }
    document.getElementById(this.container.id).remove();
    blocksGlobalArray.splice(rank, 1);
  }

  toggleImageUpload() {
    if (this.imageUploadSelector.value == "new") {
      this.select.name = "order[]";
      this.imageUploadSelector.name = "";
      this.container.replaceChild(this.select, this.select);
      this.container.replaceChild(this.imageUploadSelector, this.imageUploadSelector);
      this.container.appendChild(this.inputImg);
    } else if (this.imageUploadSelector.value == "old") {
      this.select.name = "";
      this.imageUploadSelector.name = "order[]";
      this.container.replaceChild(this.select, this.select);
      this.container.replaceChild(this.imageUploadSelector, this.imageUploadSelector);
      this.container.removeChild(this.inputImg);
    }
  }
}

function addBlock(options) {
  let b = options;
  if (options == "none") {
    b = {
      type: "text",
      contentEn: "",
      contentCn: "",
    }
  }
  let allBlocks = document.getElementById("all-blocks");
  var block = new Block(b);
  allBlocks.appendChild(block.container);
  blocksGlobalArray.push(block);
}

function addExistingBlocks(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    addBlock(blocks[i]);
  }
}

/* function toggleImageUpload(imageId) {
  let imgSelect = document.getElementById(imageId);
  if (imgSelect.value == "old") {
    let inputImg = document.createElement('input');
    inputImg.type = 'file';
    inputImg.name = 'image';
    inputImg.style.display = "block";
    inputImg.style.marginBottom = "10px";
    imgSelect.appendChild(inputImg);
  } else if (imgSelect.value == "new") {
    imgSelect.removeChild(imgSelect.childNodes[2]);
  }
} */
