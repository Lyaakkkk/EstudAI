import fs from 'node:fs';
const dir = new URL('./', import.meta.url);
const results = [];
const source = {title:'Jardim ficticio Aurora',text:'O jardim ficticio Aurora possui 12 vasos. Cada vaso recebe 200 ml de agua por dia. A rega total diaria e de 2400 ml. Os vasos recebem luz pela manha junto da janela. Uma tabela registra a rega diariamente.',difficulty:'iniciante'};
async function request(name,path,body) {
  const start=Date.now();
  try {
    const r=await fetch(`http://localhost:19006/api/study/${path}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(70000)});
    const data=await r.json();
    const result={name,status:r.status,elapsedMs:Date.now()-start,data};
    results.push(result); fs.writeFileSync(new URL('results.json',dir),JSON.stringify(results,null,2));
    console.log(JSON.stringify({name,status:r.status,elapsedMs:result.elapsedMs,questions:data.questions?.length,sections:data.sections?.length,score:data.score,error:data.code}));
    return r.ok ? data : null;
  } catch(e) {results.push({name,error:e.name,elapsedMs:Date.now()-start}); fs.writeFileSync(new URL('results.json',dir),JSON.stringify(results,null,2)); console.log(name,e.name); return null;}
}
const quiz = await request('quiz real','quizzes',{...source,questionCount:5});
if(quiz) {
  const valid=quiz.questions.length===5 && new Set(quiz.questions.map(q=>q.id)).size===5 && quiz.questions.every(q=>q.options.includes(q.correctAnswer)&&q.explanation&&q.topic);
  console.log(JSON.stringify({name:'quiz integrity',valid}));
}
const challenges=await request('desafios reais','challenges',{...source,challengeType:'resolucao-de-problemas'});
if(challenges?.challenges?.[0]) await request('correcao real','challenges/grade',{...source,challenge:challenges.challenges[0],answer:'Sao 12 vasos. Multiplico 12 por 200 ml e obtenho 2400 ml de agua por dia, ou 2,4 litros. Registro a rega diariamente na tabela e mantenho os vasos perto da janela com luz pela manha.'});
// PDF minimo com tabela xref e offsets calculados em bytes.
const content='BT /F1 18 Tf 50 750 Td (Jardim ficticio Aurora: 12 vasos.) Tj 0 -30 Td (Cada vaso recebe 200 ml de agua por dia.) Tj ET';
const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`];
let pdf='%PDF-1.4\n'; const offsets=[0]; objects.forEach((o,i)=>{offsets.push(Buffer.byteLength(pdf));pdf+=`${i+1} 0 obj\n${o}\nendobj\n`;}); const xref=Buffer.byteLength(pdf); pdf+=`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
fs.writeFileSync(new URL('material.pdf',dir),pdf);
for(const [name,mime] of [['material.pdf','application/pdf'],['material.png','image/png']]) {
  await request(`resumo real ${mime}`,'summaries',{title:'Material ficticio de validacao',difficulty:'iniciante',file:{name,mimeType:mime,base64:fs.readFileSync(new URL(name,dir)).toString('base64')}});
}
