class Arr {
    constructor(v){
        this.value = v
    }
    [Symbol.iterator] = function* () {
        // console.log('itere')
        for(var i = 0;i<this.value.length;i++){
            console.log(i)
            yield this.value[i]
        }    
    };
}

var arr = new Arr([1,2,3])
for (var item of arr) {
    console.log(111,item)
}
console.log(arr)

const demoData = {
    data: [1,2,3],
    [Symbol.iterator]: function () {
        var _this = this
      return {
        next: function () {
          var i = 0
          var value = _this.data[i++]
          return {
            value,
            done: value ? false : true
          };
        }
      };
    }
  };
  
  let it = demoData[Symbol.iterator]()
  
  it.next() // { value: 1, done: false }
  it.next() // { value: 2, done: false }
  it.next() // { value: 3, done: false }
  it.next() // { value: undefined, done: true }
