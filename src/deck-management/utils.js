// unique id generator
export function uniqueId() {
  let id = [];
  let counter = 0;
  for (let i = 0; i < 20; i++) {
    if (counter % 2 === 0) {
      id.push(Math.floor(Math.random() * 10)); // generating numbers from 0 to 9
      counter++;
    } else {
      id.push(String.fromCharCode(Math.floor(Math.random() * 26) + 97)); // generating letters from a to z
      counter++;
    }
  }
  return id.join(''); // turning the array into string
}

// strips the comma out of the long legendary creature names
export function shortenName(name) {
   const array = [];
  
  for (let i = 0; i < name.length; i++) {
    if (name[i].match(/\,/)) {
      break
    } else {
      array.push(name[i]);
    }
  }

  return array.join('');
}
