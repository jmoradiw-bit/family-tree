const people = new Map(FAMILY_TREE.people.map(p => [p.id, p]));
const unions = FAMILY_TREE.unions;
const byId = id => people.get(id);
const full = p => p ? `${p.name} ${p.last || ''}`.trim() : '';

function parentText(p){
  const f = p?.father ? full(byId(p.father)) : '';
  const m = p?.mother ? full(byId(p.mother)) : '';
  return [f && `پدر: ${f}`, m && `مادر: ${m}`].filter(Boolean).join(' | ') || 'والدین ثبت نشده';
}

function personCard(id){
  const p = byId(id);
  const el = document.createElement('article');
  el.className = `person ${p.gender}`;
  el.dataset.id = id;
  el.tabIndex = 0;
  el.innerHTML = `
    <div class="person-top"><span class="avatar">${p.gender === 'f' ? '♀' : p.gender === 'm' ? '♂' : '•'}</span><span class="relation-chip">${p.relation || ''}</span></div>
    <div class="name">${full(p)}</div>
    ${p.birth ? `<div class="meta">تولد: ${p.birth}</div>` : ''}
    ${p.death ? `<div class="meta">درگذشت: ${p.death}</div>` : ''}
  `;
  const activate = () => selectPerson(id, true);
  el.onclick = activate;
  el.onkeydown = e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } };
  return el;
}

function unionByPerson(id){ return unions.filter(u => u.a === id || u.b === id); }

function makeUnion(u, focusId){
  const wrap = document.createElement('section');
  wrap.className = 'family-unit';
  wrap.dataset.union = u.id;

  const couple = document.createElement('div');
  couple.className = 'couple-row';
  const left = personCard(u.a);
  const right = personCard(u.b);
  const marriage = document.createElement('div');
  marriage.className = 'marriage';
  marriage.innerHTML = '<span>♥</span>';
  couple.append(left, marriage, right);

  const connector = document.createElement('div');
  connector.className = 'couple-stem';

  const children = document.createElement('div');
  children.className = 'children-row';
  (u.children || []).forEach(cid => {
    const col = document.createElement('div');
    col.className = 'child-col';
    col.appendChild(personCard(cid));
    children.appendChild(col);
  });

  wrap.append(couple);
  if((u.children || []).length){
    wrap.append(connector, children);
  }
  return wrap;
}

function renderGenerationalTree(){
  const root = document.getElementById('tree');
  root.innerHTML = '';

  const coreIds = new Set(['p1','p4','p5','p6','p7','p8','p9','p27','p2','p3','p11','p12','p13','p14','p15','p16','p17','p18','p20']);
  const core = document.createElement('div');
  core.className = 'view-block core-view';

  const title = document.createElement('div');
  title.className = 'view-title';
  title.innerHTML = '<strong>خانواده نزدیک</strong><span>Family View</span>';
  core.appendChild(title);

  // نسل والدین + فرزندان
  core.appendChild(makeUnion(unions.find(u => u.id === 'u-core')));

  // نسل پدری و مادری در یک ردیف مرتب
  const grandparents = document.createElement('div');
  grandparents.className = 'parallel-families';
  grandparents.appendChild(makeUnion(unions.find(u => u.id === 'u-paternal')));
  grandparents.appendChild(makeUnion(unions.find(u => u.id === 'u-maternal')));
  core.insertBefore(grandparents, core.children[1]);

  root.appendChild(core);

  const branches = document.createElement('div');
  branches.className = 'view-block branch-view';
  const branchTitle = document.createElement('div');
  branchTitle.className = 'view-title';
  branchTitle.innerHTML = '<strong>شاخه‌های اجدادی و بستگان</strong><span>بازدید و انتخاب هر فرد</span>';
  branches.appendChild(branchTitle);

  const groups = [
    ['u-anc-root','u-anc-5','u-anc-6','u-anc-7','u-anc-8','u-anc-9'],
    ['u-resayi-family','u-resayi','u-resayi-siblings'],
    ['u-old-branch','u-relief']
  ];
  groups.forEach((ids, idx) => {
    const lane = document.createElement('div');
    lane.className = 'branch-lane';
    const laneTitle = document.createElement('div');
    laneTitle.className = 'lane-title';
    laneTitle.textContent = idx === 0 ? 'خط اجدادی برادویی' : idx === 1 ? 'شاخه رضایی' : 'سایر بستگان';
    lane.appendChild(laneTitle);
    const row = document.createElement('div');
    row.className = 'parallel-families compact';
    ids.forEach(uid => { const u = unions.find(x => x.id === uid); if(u) row.appendChild(makeUnion(u)); });
    lane.appendChild(row);
    branches.appendChild(lane);
  });
  root.appendChild(branches);
}

function ancestorSet(id){
  const set = new Set();
  function walk(x){
    if(!x || set.has(x)) return;
    set.add(x);
    const p = byId(x);
    walk(p?.father); walk(p?.mother);
  }
  walk(id);
  return set;
}

function connectedSet(id){
  const seen = new Set();
  const q = [id];
  while(q.length){
    const x = q.shift();
    if(!x || seen.has(x)) continue;
    seen.add(x);
    const p = byId(x);
    if(p?.father) q.push(p.father);
    if(p?.mother) q.push(p.mother);
    unions.forEach(u => {
      if(u.a === x){ q.push(u.b); (u.children||[]).forEach(c=>q.push(c)); }
      if(u.b === x){ q.push(u.a); (u.children||[]).forEach(c=>q.push(c)); }
      if((u.children||[]).includes(x)){ q.push(u.a); q.push(u.b); }
    });
  }
  return seen;
}

function selectPerson(id, scroll = false){
  document.querySelectorAll('.person').forEach(e => e.classList.remove('selected','highlight','dimmed'));
  const path = ancestorSet(id);
  const connected = connectedSet(id);
  path.forEach(x => document.querySelectorAll(`.person[data-id="${CSS.escape(x)}"]`).forEach(e=>e.classList.add('highlight')));
  document.querySelectorAll(`.person[data-id="${CSS.escape(id)}"]`).forEach(e=>e.classList.add('selected'));
  document.querySelectorAll('.person').forEach(e=>{
    if(!connected.has(e.dataset.id)) e.classList.add('dimmed');
  });
  document.querySelectorAll('.family-unit').forEach(u=>{
    const ids = [...u.querySelectorAll('.person')].map(x=>x.dataset.id);
    u.classList.toggle('collapsed-unrelated', !ids.includes(id) && !ids.some(x=>path.has(x)));
  });
  if(scroll){
    const target = document.querySelector(`.person[data-id="${CSS.escape(id)}"]`);
    target?.scrollIntoView({behavior:'smooth', block:'center', inline:'center'});
  }
  openModal(id);
}

function clearSelection(){
  document.querySelectorAll('.person').forEach(e=>e.classList.remove('selected','highlight','dimmed'));
  document.querySelectorAll('.family-unit').forEach(e=>e.classList.remove('collapsed-unrelated'));
}

function search(q){
  q = q.trim().toLowerCase();
  const results = document.getElementById('results');
  results.innerHTML = '';
  if(!q){ document.getElementById('count').textContent=''; return; }
  const tokens = q.split(/\s+/).filter(Boolean);
  const arr = FAMILY_TREE.people.filter(p => tokens.every(t => [
    full(p), p.name, p.last,
    p.father && full(byId(p.father)), p.mother && full(byId(p.mother))
  ].filter(Boolean).some(v => v.toLowerCase().includes(t))));
  document.getElementById('count').textContent = `${arr.length} نفر پیدا شد`;
  arr.forEach(p => {
    const b = document.createElement('button');
    b.className = 'result';
    b.innerHTML = `<strong>${full(p)}</strong><small>${parentText(p)}</small>`;
    b.onclick = () => {
      selectPerson(p.id, true);
      document.getElementById('q').value = full(p);
      results.innerHTML='';
      document.getElementById('count').textContent='';
    };
    results.appendChild(b);
  });
}

function renderPeopleList(){
  const box = document.getElementById('peopleList');
  box.innerHTML = '';
  FAMILY_TREE.people.forEach(p => {
    const b = document.createElement('button');
    b.className = `person-row ${p.gender}`;
    b.innerHTML = `<span class="row-name">${full(p)}</span><span class="row-rel">${p.relation || ''}</span>`;
    b.onclick = () => { document.getElementById('q').value = full(p); selectPerson(p.id,true); };
    box.appendChild(b);
  });
  document.getElementById('peopleCount').textContent = `(${FAMILY_TREE.people.length} نفر)`;
}

function openModal(id){
  const p = byId(id);
  document.getElementById('modalBody').innerHTML = `
    <h2>${full(p)}</h2>
    <p><b>نسبت:</b> ${p.relation || 'ثبت نشده'}</p>
    ${p.birth ? `<p><b>تولد:</b> ${p.birth}</p>` : ''}
    <p>${parentText(p)}</p>
    <p class="path-note">افراد در مسیر اجدادی با رنگ کرمی-طلایی مشخص شده‌اند.</p>
  `;
  document.getElementById('modal').classList.remove('hidden');
}

document.getElementById('q').oninput = e => search(e.target.value);
document.getElementById('clear').onclick = () => { document.getElementById('q').value=''; document.getElementById('results').innerHTML=''; document.getElementById('count').textContent=''; clearSelection(); };
document.getElementById('closeModal').onclick = () => document.getElementById('modal').classList.add('hidden');
document.getElementById('modal').onclick = e => { if(e.target.id === 'modal') e.currentTarget.classList.add('hidden'); };
renderGenerationalTree();
renderPeopleList();
