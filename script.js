// داده‌های شجره‌نامه const people = [ { id: 1, name: "میرزا مرادی", birthYear: 1998, photo: null, spouses: [ { id: 2, children: [5] }, { id: 3, children: [6, 7] } ], parents: [] }, { id: 2, name: "ماه گنج برادوس", birthYear: null, photo: null, spouses: [], parents: [] }, { id: 3, name: "خاتون رضایی", birthYear: 2020, photo: null, spouses: [], parents: [] }, { id: 5, name: "گل محمد مرادی", birthYear: null, photo: null, spouses: [], parents: [1, 2] }, { id: 6, name: "عصمت لوچکی", birthYear: null, photo: null, spouses: [], parents: [1, 3] }, { id: 7, name: "جواد مرادی", birthYear: 1994, photo: null, spouses: [], parents: [1, 3] } ];

function getPerson(id) { return people.find(p => p.id === id); }

const generations = [ [1], [2, 3], [5, 6, 7] ];

function renderTree() { const container = document.getElementById("treeContainer"); container.innerHTML = "";

generations.forEach(genIds => { const row = document.createElement("div"); row.className = "generation-row";

genIds.forEach(id => {
  const person = getPerson(id);
  const card = document.createElement("div");
  card.className = "person-card";
  card.dataset.id = person.id;

  if (person.photo) {
    const img = document.createElement("img");
    img.src = person.photo;
    img.alt = person.name;
    img.style.width = "60px";
    img.style.height = "60px";
    img.style.borderRadius = "50%";
    card.appendChild(img);
  }

  const nameEl = document.createElement("div");
  nameEl.textContent = person.name;
  card.appendChild(nameEl);

  if (person.birthYear) {
    const yearEl = document.createElement("div");
    yearEl.textContent = person.birthYear;
    yearEl.style.fontSize = "12px";
    yearEl.style.color = "#666";
    card.appendChild(yearEl);
  }

  if (person.spouses && person.spouses.length > 0) {
    const spousesRow = document.createElement("div");
    spousesRow.className = "spouses-row";

    person.spouses.forEach(spRel => {
      const spouse = getPerson(spRel.id);
      const spouseCard = document.createElement("div");
      spouseCard.className = "person-card";
      spouseCard.style.minWidth = "120px";

      const sName = document.createElement("div");
      sName.textContent = spouse.name;
      spouseCard.appendChild(sName);

      const childrenList = document.createElement("div");
      childrenList.style.marginTop = "5px";
      childrenList.style.fontSize = "12px";
      childrenList.textContent = "فرزندان این همسر:";

      spRel.children.forEach(chId => {
        const child = getPerson(chId);
        const chEl = document.createElement("div");
        chEl.textContent = "• " + child.name;
        childrenList.appendChild(chEl);
      });

      spouseCard.appendChild(childrenList);
      spousesRow.appendChild(spouseCard);
    });

    card.appendChild(spousesRow);
  }

  row.appendChild(card);
});

container.appendChild(row);

}); }

function setupSearch() { const input = document.getElementById("searchInput"); const btn = document.getElementById("searchBtn");

btn.addEventListener("click", () => { const q = input.value.trim(); const cards = document.querySelectorAll(".person-card"); cards.forEach(c => c.classList.remove("highlight"));

if (!q) return;

const person = people.find(p => p.name.toLowerCase().includes(q.toLowerCase()));
if (!person) return;

const targetCard = document.querySelector(`.person-card[data-id="${person.id}"]`);
if (targetCard) {
  targetCard.classList.add("highlight");
  targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

}); }

renderTree(); setupSearch();
