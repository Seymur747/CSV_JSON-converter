const express=require('express');
const app=express();
const fs=require("fs");
var newArray=[];
let jsObjects=[];

function ParseByPropeties(dataRows){
    let properties=dataRows[0].replace(/['"]+/g, '').split('||')
    properties[properties.length-1]='date';
    for(let j=1;j<dataRows.length;j++){
        var myObj={};
        for(let i=0;i<properties.length;i++){
            myObj[properties[i]]=dataRows[j].replace(/['"]+/g, '').split('||')[i];
        }
       jsObjects.push(myObj)
    }
    return  SetPropeties(jsObjects); 
}
function SetPropeties(arr){
    if(newArray.length==0){
        for(let i=0;i<arr.length;i++){
            if(arr[i].date){
                let newObj={};
                newObj.name=arr[i].name;
                newObj.phone='(+380)'+arr[i].phone;
                newObj.person={};
                newObj.person.firstname=arr[i].first_name;
                newObj.person.lastname=arr[i].last_name;
                newObj.amount=parseFloat(arr[i].amount);
                newObj.date=arr[i].date.replace(/['"\r]+/g, '');
                newObj.costCentrNum=arr[i].cc.substr(3);
                newArray.push(newObj) 
            }
        }  
    }
    return newArray;
}
(function ReadFromTwoInputs(){
    let firstFile= fs.readFileSync('./datas/users1.csv','utf8')
    let secondFile= fs.readFileSync('./datas/users2.csv','utf8')
    fs.writeFile('./datas/users3.csv',firstFile+secondFile,(err,data)=>{
        if(err) console.log(err)
})
})()

app.get('/',(req,res)=>{
    fs.readFile('./datas/users3.csv','utf8',(err,data)=>{
        if(err){console.log(err)}
        let rows=data.split('\n')
        let arr=ParseByPropeties(rows);
    res.send(JSON.stringify(arr))
    })
})
app.listen(3000,()=>{
    console.log('Server started at 3000')
})