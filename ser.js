let data = require('./a')

function aa(json) {
  let arr = json.result

  let str = []
  str = arr.map((item)=>{

    console.log(item['child-objects'])

    return item.value
  })

  return str.join()
}

let a= aa(data)

console.log(a)
