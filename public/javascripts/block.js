// Maybe put the x button next to the select?

var blocksGlobalArray = [];

class Block {
  constructor() {
    // CONTAINER
    this.container = document.createElement('div');
    this.container.id = "block" + document.getElementById("all-blocks").childNodes.length;
    
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
    this.input = "hello world!";
    this.input = document.createElement('textarea');
    this.input.name = 'text';
    this.input.style.display = "block";
    this.input.style.height = "100px";
    this.input.style.marginBottom = "20px";
    this.input.innerText = this.container.id;

    // APPEND ELEMENTS
    this.container.appendChild(this.select);
    this.container.appendChild(this.deleteBtn);
    this.container.appendChild(this.input);
  }

  displayField() {
    this.input.remove();
    if (this.select.value == 'text') {
      this.input = document.createElement('textarea');
      this.input.name = 'text'
      this.input.style.display = "block";
      this.input.style.height = "100px";
      this.input.style.marginBottom = "20px";
    }
    else {
      this.input = document.createElement('input');
      this.input.type = 'file';
      this.input.name = 'image';
      this.input.style.display = "block";
      this.input.style.marginBottom = "20px";
    }
    this.input.innerText = this.container.id;
    this.container.appendChild(this.input);
  }

  delete() {
    let allBlocks = document.getElementById("all-blocks");
    let rank = parseInt(this.container.id.slice(5, this.container.id.length), 10);
    for (let i = rank+1; i < allBlocks.childNodes.length; ++i) {
      // currentblock is passed by reference
      let currentblock = allBlocks.childNodes[i];
      let currentRank = parseInt(currentblock.id.slice(5, currentblock.id.length), 10);
      currentRank -= 1;
      currentblock.id = "block" + currentRank;
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
