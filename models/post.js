class Post {
  constructor(p) {
    // user-defined
    this.title = p.title;
    this.type = p.type;
    this.tags = p.tags;
    this._id = formatName(p.title);
    this.blocks = p.blocks;
    this.coverImage = p.coverImage;
    this.description = p.description;
    
    // auto-generated
    this.url = '/' + this.type;
    if (this.type === 'project') {
      this.url += 's';
    }
    this.url += '/' + this._id;
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