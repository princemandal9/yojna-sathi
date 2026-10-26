const HELP = "1800-000-0000"; // PLACEHOLDER – replace with the real official helpline

const schemes = [
 {id:"svmcm",name:"Swami Vivekananda Merit-cum-Means (SVMCM)",short:"SVMCM",dept:"Dept. of Higher Education, Govt. of West Bengal",icon:"award",color:"bg-blue-600",
  status:"open",window:"Typically Aug – Nov (yearly)",deadline:"Check portal – usually early Nov",elig:"West Bengal resident student, merit + family income limit",mode:"Online",helpline:HELP,
  docs:[["Aadhaar card","m"],["Madhyamik / Class 10 admit card or marksheet","m"],["Last qualifying exam marksheet","m"],["Income certificate / self-declaration","m"],["Residential proof","m"],["Bank passbook (first page)","m"],["Passport size photo & signature","m"],["Caste certificate (SC/ST/OBC)","o"],["Birth certificate","o"],["Disability certificate (if applicable)","o"]]},
 {id:"kanya",name:"Kanyashree Prakalpa",short:"Kanyashree",dept:"Dept. of Women & Child Development and Social Welfare",icon:"heart-handshake",color:"bg-pink-600",
  status:"open",window:"Rolling – through school/college",deadline:"Within the academic year",elig:"Unmarried girl student, WB resident, within age and income limits",mode:"Online + Offline (via school)",helpline:HELP,
  docs:[["Aadhaar card","m"],["Age proof (birth certificate)","m"],["Bank passbook (joint with guardian ok)","m"],["Institution enrolment proof","m"],["Residential proof","m"],["Income certificate","o"],["Disability certificate (if applicable)","o"]]},
 {id:"aikya",name:"Aikyashree Scholarship",short:"Aikyashree",dept:"Dept. of Minority Affairs & Madrasah Education",icon:"users",color:"bg-emerald-600",
  status:"soon",window:"Typically Sep – Dec",deadline:"To be announced",elig:"Minority community student, WB resident, income limit applies",mode:"Online",helpline:HELP,
  docs:[["Aadhaar card","m"],["Minority community / caste certificate","m"],["Previous exam marksheet","m"],["Income certificate","m"],["Bank passbook (first page)","m"],["Passport size photo","m"],["Residential proof","o"],["Birth certificate","o"]]},
 {id:"oasis",name:"OASIS (SC/ST/OBC Post-Matric)",short:"OASIS",dept:"Backward Classes Welfare Dept., Govt. of West Bengal",icon:"book-open",color:"bg-amber-600",
  status:"closing",window:"Typically Jul – Oct",deadline:"Closing soon – check portal",elig:"SC / ST / OBC student, WB resident, income limit applies",mode:"Online + Offline verification",helpline:HELP,
  docs:[["Aadhaar card","m"],["Caste certificate","m"],["Income certificate","m"],["Previous marksheet","m"],["Bank passbook (first page)","m"],["Admission receipt / fee receipt","m"],["Residential proof","o"],["Birth certificate","o"]]}
];

const statusUI = {
  open:["Applications Open","bg-emerald-100 text-emerald-700"],
  closing:["Closing Soon","bg-amber-100 text-amber-700"],
  soon:["Opens Soon","bg-blue-100 text-blue-700"]
};

// Alternatives knowledge base for the assistant
const kb = [
 {k:["birth"],t:"Birth certificate",a:"You can usually use your <b>Aadhaar card</b> or your <b>Madhyamik/Class 10 admit card</b> as date-of-birth proof. Upload whichever you have – Aadhaar is the most widely accepted.",call:false},
 {k:["aadhaar","aadhar","adhar"],t:"Aadhaar",a:"Download your <b>e-Aadhaar</b> from the UIDAI site or DigiLocker using your registered mobile. If you have no Aadhaar at all, the enrolment slip may be accepted temporarily – please confirm with the helpline.",call:true},
 {k:["income"],t:"Income certificate",a:"Some schemes accept a <b>self-declaration form</b> or a parent’s salary slip / employer certificate. A formal certificate comes from your <b>BDO / SDO / Municipality office</b>. Confirm what this scheme accepts.",call:true},
 {k:["caste","community","minority"],t:"Caste / community certificate",a:"There is no direct substitute for this one. Apply at the <b>SDO / BDO office</b> or via the WB caste certificate portal. Your <b>Parent’s certificate</b> may be accepted while yours is pending – please confirm by phone.",call:true},
 {k:["resid","domicile","address"],t:"Residential proof",a:"Try your <b>Ration card, Voter ID, Aadhaar address, or a recent electricity bill</b>. Any one is commonly accepted.",call:false},
 {k:["bank","passbook","account"],t:"Bank passbook",a:"A <b>bank statement or cancelled cheque</b> showing your name, account number and IFSC usually works. If you have no account, open a zero-balance account first (Jan Dhan). Payments go only to bank accounts.",call:true},
 {k:["marksheet","mark sheet","admit","result"],t:"Marksheet",a:"Download a digital copy from <b>WBBSE / WBCHSE / your university portal</b>, or from <b>DigiLocker</b>. Your school/college office can also issue a certified copy.",call:false},
 {k:["photo","signature","sign"],t:"Photo / signature",a:"Use the <b>Compressor</b> on this page. Take a clear photo against a plain background and resize it to the portal size limit.",call:false},
 {k:["disab"],t:"Disability certificate",a:"This is only needed if you claim the disability benefit. If you don’t have it, you can skip it, or contact the helpline.",call:true}
];

let cur = null, checked = {};

function showHome(){
  home.classList.remove("hidden");
  detail.classList.add("hidden");
  window.scrollTo(0,0);
}

function renderHome(){
  schemeGrid.innerHTML = schemes.map(s=>`
   <button onclick="openScheme('${s.id}')" class="text-left bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition p-5">
     <div class="flex items-center gap-3">
       <div class="w-12 h-12 rounded-xl ${s.color} text-white grid place-items-center"><i data-lucide="${s.icon}" class="w-6 h-6"></i></div>
       <div class="flex-1 min-w-0"><h3 class="font-bold leading-tight">${s.name}</h3><p class="text-xs text-slate-500 truncate">${s.dept}</p></div>
     </div>
     <span class="inline-block mt-3 text-xs font-semibold rounded-full px-3 py-1 ${statusUI[s.status][1]}">● ${statusUI[s.status][0]}</span>
     <ul class="mt-3 space-y-1.5 text-sm text-slate-600">
       <li class="flex gap-2"><i data-lucide="calendar" class="w-4 h-4 mt-0.5 shrink-0"></i>${s.window}</li>
       <li class="flex gap-2"><i data-lucide="user-check" class="w-4 h-4 mt-0.5 shrink-0"></i>${s.elig}</li>
       <li class="flex gap-2"><i data-lucide="globe" class="w-4 h-4 mt-0.5 shrink-0"></i>${s.mode}</li>
     </ul>
     <p class="mt-4 text-sm font-semibold text-blue-700 flex items-center gap-1">View documents needed <i data-lucide="arrow-right" class="w-4 h-4"></i></p>
   </button>`).join("");
  lucide.createIcons();
}

function openScheme(id){
  cur = schemes.find(s=>s.id===id); checked = {};
  home.classList.add("hidden"); detail.classList.remove("hidden"); window.scrollTo(0,0);
  dLogo.className = `w-14 h-14 rounded-2xl grid place-items-center text-white shrink-0 ${cur.color}`;
  dLogo.innerHTML = `<i data-lucide="${cur.icon}" class="w-7 h-7"></i>`;
  dName.textContent = cur.name; dDept.textContent = cur.dept;
  dStatus.textContent = "● " + statusUI[cur.status][0];
  dStatus.className = "text-xs font-semibold rounded-full px-3 py-1 " + statusUI[cur.status][1];
  dWindow.textContent = cur.window; dDeadline.textContent = cur.deadline;
  dElig.textContent = cur.elig; dMode.textContent = cur.mode;
  dHelp.textContent = cur.helpline; dHelp.href = "tel:" + cur.helpline.replace(/-/g,"");

  const li = (d,i)=>`<li class="flex items-center gap-3 rounded-xl border border-slate-200 p-3" id="row${i}">
    <input type="checkbox" id="c${i}" class="w-5 h-5 accent-emerald-600" onchange="tick(${i},this.checked)">
    <label for="c${i}" class="flex-1 text-sm font-medium cursor-pointer">${d[0]}</label>
    <button onclick="askAbout('${d[0].replace(/'/g,"")}')" class="text-xs text-blue-700 font-semibold hover:underline whitespace-nowrap">Don’t have it?</button></li>`;
  mList.innerHTML = cur.docs.map((d,i)=>d[1]==="m"?li(d,i):"").join("");
  oList.innerHTML = cur.docs.map((d,i)=>d[1]==="o"?li(d,i):"").join("");
  startMsg.classList.add("hidden"); updateAudit(); resetChat(); lucide.createIcons();
}

function tick(i,v){
  checked[i] = v;
  document.getElementById("row"+i).className = "flex items-center gap-3 rounded-xl border p-3 " + (v ? "border-emerald-300 bg-emerald-50" : "border-slate-200");
  updateAudit();
}

function updateAudit(){
  const mand = cur.docs.map((d,i)=>[d,i]).filter(x=>x[0][1]==="m");
  const have = mand.filter(x=>checked[x[1]]).length;
  const pct = Math.round(have/mand.length*100);
  pFill.style.width = pct + "%"; pText.textContent = pct + "%";
  pBar.setAttribute("aria-valuenow", pct);
  pFill.className = "h-full transition-all duration-500 " + (pct===100 ? "bg-emerald-500" : pct>=50 ? "bg-blue-500" : "bg-amber-400");
  pMsg.textContent = pct===100
    ? "You’re ready for take-off! All mandatory documents are in place."
    : `${have} of ${mand.length} mandatory documents ready. ${mand.length-have} to go.`;
}

function startApp(){
  const miss = cur.docs.filter((d,i)=>d[1]==="m" && !checked[i]).map(d=>d[0]);
  startMsg.classList.remove("hidden");
  if(miss.length){
    startMsg.className = "text-sm mt-3 p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200";
    startMsg.innerHTML = `<b>Hold on – ${miss.length} mandatory document(s) not ready:</b> ${miss.join(", ")}. Use “Don’t have it?” for alternatives.`;
  } else {
    startMsg.className = "text-sm mt-3 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200";
    startMsg.innerHTML = "✅ All set! Redirecting you to the official application portal… (demo)";
  }
}

/* ---------- AI Assistant ---------- */
function bot(h){
  chat.insertAdjacentHTML("beforeend", `<div class="flex gap-2"><span class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 grid place-items-center shrink-0"><i data-lucide="bot" class="w-4 h-4"></i></span><div class="bg-slate-100 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">${h}</div></div>`);
  end();
}
function me(t){
  const d = document.createElement("div");
  d.className = "flex justify-end";
  d.innerHTML = `<div class="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]"></div>`;
  d.firstChild.textContent = t;
  chat.appendChild(d); end();
}
function end(){ lucide.createIcons(); chat.scrollTop = chat.scrollHeight; }

function resetChat(){
  chat.innerHTML = "";
  bot("Hi! 👋 Tell me which document you <b>don’t have</b> and I’ll suggest what to use instead.");
  chips.innerHTML = ["Birth certificate","Income certificate","Caste certificate","Bank passbook"]
    .map(c=>`<button onclick="askAbout('${c}')" class="text-xs border border-slate-300 rounded-full px-3 py-1 hover:bg-slate-50">${c}</button>`).join("");
}
function askAbout(d){ me("I don’t have: " + d); reply(d); }
function sendChat(e){
  e.preventDefault();
  const v = chatIn.value.trim(); if(!v) return;
  me(v); chatIn.value = ""; reply(v);
}
function openAI(){ aiBox.scrollIntoView({behavior:"smooth"}); chatIn.focus(); }

function reply(t){
  const s = t.toLowerCase();
  const hit = kb.find(x=>x.k.some(k=>s.includes(k)));
  setTimeout(()=>{
    if(!hit){
      bot(`I’m not sure about that one. Please call the helpline: <a class="font-bold text-blue-700 underline" href="tel:${cur.helpline.replace(/-/g,"")}">${cur.helpline}</a> and they’ll guide you.`);
      return;
    }
    let h = `<p class="font-semibold mb-1">${hit.t} missing – here’s what you can do:</p><p>${hit.a}</p>`;
    if(hit.call) h += `<p class="mt-2 p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs">📞 Not sure it will be accepted? Call <a class="font-bold underline" href="tel:${cur.helpline.replace(/-/g,"")}">${cur.helpline}</a> to confirm.</p>`;
    h += `<p class="mt-2 text-[11px] text-slate-500">Suggestion only – final acceptance rests with the department.</p>`;
    bot(h);
  }, 400);
}

/* ---------- Image compressor ---------- */
function compress(f){
  if(!f) return;
  window._f = f;
  const img = new Image();
  img.onload = ()=>{
    const c = document.createElement("canvas");
    const sc = Math.min(1, 1200/Math.max(img.width, img.height));
    c.width = img.width*sc; c.height = img.height*sc;
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    c.toBlob(b=>{
      const url = URL.createObjectURL(b);
      const size = n=>(n/1024).toFixed(0) + " KB";
      cOut.classList.remove("hidden");
      cOut.innerHTML = `<p class="rounded-lg bg-emerald-50 text-emerald-800 p-3">${size(f.size)} → <b>${size(b.size)}</b> (${Math.max(0,Math.round((1-b.size/f.size)*100))}% smaller)</p>
      <a href="${url}" download="compressed.jpg" class="mt-2 block text-center bg-blue-600 text-white rounded-lg py-2 font-semibold">Download</a>`;
    }, "image/jpeg", q.value/100);
  };
  img.src = URL.createObjectURL(f);
}

renderHome();
lucide.createIcons();