// unique id generator
export default function uniqueId() {
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
