function boxify(text){
return text.replace(/\((.*?)\)/g,(m,p1)=>'□'.repeat(Math.max(p1.length,3)));
}

function answerify(text){
return text.replace(/[()]/g,'');
}

function parseLines(text,mode){

return text.split('\n').map(line=>{

if(!line.trim()) return '';

let parts = line.split('\t');

let speaker = parts[0] ? parts[0].trim() : '';
let ko = parts[1] ? parts[1].trim() : '';
let cn = parts[2] ? parts[2].trim() : '';

if(mode==='q1'){
return `${speaker} ${boxify(ko)}\n${cn}`;
}

if(mode==='q2'){
return `${speaker} ${cn}\n______________________`;
}

if(mode==='a'){
return `${speaker} ${answerify(ko)}`;
}

return '';

}).join('\n\n');
}

async function generate(){

const title = document.getElementById('title').value.trim();
const level = document.getElementById('level').value;
const text1 = document.getElementById('text1').value.trim();
const text2 = document.getElementById('text2').value.trim();

if(!title){
alert('제목 입력');
return;
}

let path = level==='beginner'
? 'templates/beginner.docx'
: 'templates/intermediate.docx';

const res = await fetch(path);
const content = await res.arrayBuffer();

const zip = new PizZip(content);
const doc = new window.docxtemplater(zip,{
paragraphLoop:true,
linebreaks:true
});

doc.setData({
TITLE:title,
Q1:parseLines(text1,'q1'),
Q2: level==='beginner'
? parseLines(text2,'q2')
: '새로운 대화문을 만들어 보세요.\n\n______________________',
A1:parseLines(text1,'a'),
A2: level==='beginner'
? parseLines(text2,'a')
: ''
});

try{
doc.render();
}catch(error){

console.log(error);

if(error.properties && error.properties.errors){
let msg = error.properties.errors
.map(e => e.properties.explanation)
.join('\n');

alert('템플릿 오류:\n' + msg);
}else{
alert('오류 발생');
}

return;
}

const out = doc.getZip().generate({
type:'blob',
mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
});

const link = document.createElement('a');
link.href = URL.createObjectURL(out);
link.download = title + '.docx';
link.click();
}
