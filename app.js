async function generate(){

const title = document.getElementById('title').value.trim();
const level = document.getElementById('level').value;
const text1 = document.getElementById('text1').value.trim();
const text2 = document.getElementById('text2').value.trim();

if(!title){
alert('제목을 입력하세요.');
return;
}

let templatePath = '';

if(level === 'beginner'){
templatePath = 'templates/beginner.docx';
}else{
templatePath = 'templates/intermediate.docx';
}

const response = await fetch(templatePath);
const blob = await response.blob();

const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = title + '.docx';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);

alert('현재는 템플릿 다운로드 테스트 단계입니다. 다음 단계에서 내용 자동 삽입 기능 추가됩니다.');
}
