// import { count, increment } from './aa.js';
let {count, increment} = require('./aa.js')

console.log(count); // 0
increment();
console.log(count); // 1

count += 1; // Error — only incrementer.js can change this