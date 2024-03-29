var mongo = require('../mongo');

class Post {
  constructor(p) {
    // user-defined
    this._id = p._id ? p._id : new mongo.getObjectID();
    this.author = p.author;
    this.titleEn = p.titleEn;
    this.titleCn = p.titleCn;
    this.descriptionEn = p.descriptionEn;
    this.descriptionCn = p.descriptionCn;

    this.type = p.type;
    this.tags = p.tags;
    this.blocks = p.blocks;
    this.coverImage = p.coverImage;
    this.images = p.images;
    
    // auto-generated
    let component = encodeURIComponent(this._id);
    this.urlEn = `/en/${this.type}/detail/${component}`;
    this.urlCn = `/cn/${this.type}/detail/${component}`;
  }
}

// FUNCTION formatName(string)
// Format's a name to be URL-safe
// 1. Removes all characters that aren't:
//	" ", "/", "-", "a-z", "A-Z"
// 2. Converts " " and "/" to "-"
// 3. Converts "A-Z" to "a-z"
// This is an alternative to:
// https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/encodeuricomponent
function formatName(myStr) {
  for (let i = myStr.length-1; i >= 0; --i) {
    let code = myStr.charCodeAt(i);
    if (code < 97 || code > 122) {
			// Avoid: "a-z"
      let left = myStr.slice(0, i);
      let right = myStr.slice(i+1, myStr.length);
      if (code == 32 || code == 47) {
				// Convert: " " or "/"
        myStr = left + '-' + right;
      } else if (code >= 65 && code <= 90) {
				// Convert: "A-Z"
        myStr = left + myStr[i].toLowerCase() + right;
      } else if (code != 45) {
				// Avoid: "-"
        myStr = left + right;
      }
    }
  }
  return myStr;
}

module.exports = Post;
