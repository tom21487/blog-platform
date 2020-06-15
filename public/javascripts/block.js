var blocksGlobalArray = [];

class Block {
  constructor() {
    // CONTAINER
    this.container = document.createElement('div');
    this.container.id = document.getElementById("all-blocks").childNodes.length;
    
    // SELECT
    this.select = document.createElement('select');
    this.select.name = 'order';
    let textOption = document.createElement('option');
    textOption.value = 'text';
    textOption.innerText = 'text';
    let imgOption = document.createElement('option');
    imgOption.value = 'image';
    imgOption.innerText = 'image';
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
    this.inputEn.name = 'textEn';
    this.inputEn.style.display = "block";
    this.inputEn.style.height = "100px";
    this.inputEn.style.marginBottom = "20px";
    this.inputEn.placeholder = "en" + this.container.id;
    this.inputEn.value = "";

    this.inputCn = document.createElement('textarea');
    this.inputCn.name = 'textCn';
    this.inputCn.style.display = "block";
    this.inputCn.style.height = "100px";
    this.inputCn.style.marginBottom = "20px";
    this.inputCn.placeholder = "cn" + this.container.id;
    this.inputCn.value = "";

    this.inputImg = document.createElement('input');
    this.inputImg.type = 'file';
    this.inputImg.name = 'image';
    this.inputImg.style.display = "block";
    this.inputImg.style.marginBottom = "20px";
    
    // APPEND ELEMENTS
    this.container.appendChild(this.select);
    this.container.appendChild(this.deleteBtn);
    this.container.appendChild(this.inputEn);
    this.container.appendChild(this.inputCn);
  }

  displayField() {
    if (this.select.value == 'text') {
      this.inputImg.remove();

      this.inputEn = document.createElement('textarea');
      this.inputEn.name = 'textEn';
      this.inputEn.style.display = "block";
      this.inputEn.style.height = "100px";
      this.inputEn.style.marginBottom = "20px";
      this.inputEn.placeholder = "en" + this.container.id;
      this.inputEn.value = "";

      this.inputCn = document.createElement('textarea');
      this.inputCn.name = 'textCn';
      this.inputCn.style.display = "block";
      this.inputCn.style.height = "100px";
      this.inputCn.style.marginBottom = "20px";
      this.inputCn.placeholder = "cn" + this.container.id;
      this.inputCn.value = "";

      this.container.appendChild(this.inputEn);
      this.container.appendChild(this.inputCn);
    }
    else {
      this.inputEn.remove();
      this.inputCn.remove();

      this.inputImg = document.createElement('input');
      this.inputImg.type = 'file';
      this.inputImg.name = 'image';
      this.inputImg.style.display = "block";
      this.inputImg.style.marginBottom = "20px";

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
}

function addBlock() {
  let allBlocks = document.getElementById("all-blocks");
  var block = new Block();
  allBlocks.appendChild(block.container);
  blocksGlobalArray.push(block);
}
