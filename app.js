function boxify(text){
  return text.replace(/\((.*?)\)/g,(match,p1)=>{
    return "_".repeat(Math.max(p1.length + 2,6));
  });
}

function answerify(text){
  return text.replace(/[()]/g,"");
}

function parseLines(text,mode){

  return text.split("\n").map(line=>{

    if(!line.trim()) return "";

    const parts = line.split("\t");

    const speaker = parts[0] ? parts[0].trim() : "";
    const ko = parts[1] ? parts[1].trim() : "";
    const cn = parts[2] ? parts[2].trim() : "";

    if(mode==="q1"){
      return `${speaker}  ${boxify(ko)}\n${cn}`;
    }

    if(mode==="q2"){
      return `${speaker}  ${cn}\n________________________________`;
    }

    if(mode==="a"){
      return `${speaker}  ${answerify(ko)}`;
    }

    return "";

  }).join("\n\n");
}

async function generate(){

try{

const title = document.getElementById("title").value.trim();
const level = document.getElementById("level").value;
const text1 = document.getElementById("text1").value.trim();
const text2 = document.getElementById("text2").value.trim();

if(!title){
alert("제목 입력");
return;
}

const path =
level==="beginner"
? "templates/beginner.docx"
: "templates/intermediate.docx";

const response = await fetch(path);
const content = await response.arrayBuffer();

const zip = new PizZip(content);

const doc = new window.docxtemplater(zip,{
paragraphLoop:true,
linebreaks:true,
delimiters:{start:"{",end:"}"}
});

doc.render({

TITLE:title,

Q1:parseLines(text1,"q1"),

Q2:
level==="beginner"
? parseLines(text2,"q2")
:
`새로운 대화문을 만들어 보세요.

________________________________

________________________________

________________________________`,

A1:parseLines(text1,"a"),

A2:
level==="beginner"
? parseLines(text2,"a")
: ""

});

const blob = doc.getZip().generate({
type:"blob",
mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
});

const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = title + ".docx";
link.click();

}catch(error){

console.log(error);
alert("오류: " + error.message);

}

}
