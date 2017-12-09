// let fs=require('fs');
// let ary=fs.readdirSync('./');
// let result=[];
// ary.forEach(function (item) {
//    if(/\.(png|jpg|gif)/i.test(item)){
//        result.push(`img/`+item);
//    }
// });
// fs.writeFileSync('./result.txt',JSON.stringify(result),'utf-8');
// console.log(result);

let fs=require('fs');
let ary=fs.readdirSync('./');
let result=[];
ary.forEach(function (item) {
    if(/\.(jpg|gif|png)/i.test(item)){
        result.push(`img/`+item);
    }
});
fs.writeFileSync('result1.txt',JSON.stringify(result),'utf-8');






















