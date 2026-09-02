/*
  script.js
  فقط بخش نمایش شجره‌نامه — هیچ ویرایشی از این فایل توسط بازدیدکننده
  ممکن نیست چون کاملاً سمت نمایش (read-only) است.
  داده‌ها را در data.js تغییر دهید.
*/
(function () {
  "use strict";

  var UNION_COLORS = ["var(--u0)", "var(--u1)", "var(--u2)", "var(--u3)", "var(--u4)"];
  var UNION_LABELS = ["همسر اول", "همسر دوم", "همسر سوم", "همسر چهارم", "همسر پنجم", "همسر ششم"];

  var personCardEls = {};   // personId -> the .person-card element actually placed in the tree
  var maxUnionIndexSeen = -1;

  /* ---------------- helpers ---------------- */

  function getPerson(id) {
    return people[id] || { name: "(نامشخص)", gender: "male" };
  }

  function unionsOf(personId) {
    return marriages.filter(function (m) { return m.spouses.indexOf(personId) !== -1; });
  }

  function otherSpouse(marriage, personId) {
    return marriage.spouses.filter(function (s) { return s !== personId; })[0];
  }

  function parentsOf(personId) {
    var m = marriages.filter(function (mm) { return mm.children.indexOf(personId) !== -1; })[0];
    return m ? m.spouses : [];
  }

  function yearsLabel(p) {
    if (!p.birthYear && !p.deathYear) return "";
    return (p.birthYear || "؟") + " – " + (p.deathYear || "اکنون");
  }

  function avatarNode(person) {
    if (person.photo) {
      var img = document.createElement("img");
      img.className = "avatar";
      img.src = person.photo;
      img.alt = person.name;
      img.loading = "lazy";
      img.onerror = function () {
        img.replaceWith(placeholderAvatar(person));
      };
      return img;
    }
    return placeholderAvatar(person);
  }

  function placeholderAvatar(person) {
    var wrap = document.createElement("div");
    wrap.className = "avatar";
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "center";
    var color = person.gender === "female" ? "#A55A72" : "#2E5C63";
    wrap.innerHTML =
      '<svg viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="8" r="4" fill="' +
      color +
      '"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="' +
      color +
      '"/></svg>';
    return wrap;
  }

  /* ---------------- card ---------------- */

  function buildPersonCard(personId, options) {
    options = options || {};
    var person = getPerson(personId);
    var card = document.createElement("div");
    card.className = "person-card" + (options.isRoot ? " is-root" : "");
    card.setAttribute("data-person-id", personId);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", person.name + (yearsLabel(person) ? " " + yearsLabel(person) : ""));

    var tag = document.createElement("span");
    tag.className = "gender-tag " + (person.gender === "female" ? "female" : "male");
    card.appendChild(tag);

    card.appendChild(avatarNode(person));

    var name = document.createElement("div");
    name.className = "person-name";
    name.textContent = person.name;
    card.appendChild(name);

    var yl = yearsLabel(person);
    if (yl) {
      var years = document.createElement("div");
      years.className = "person-years";
      years.textContent = yl;
      card.appendChild(years);
    }

    card.addEventListener("click", function () { openPersonModal(personId); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPersonModal(personId); }
    });

    if (!(personId in personCardEls)) {
      personCardEls[personId] = card;
    }

    return card;
  }

  /* ---------------- recursive subtree ---------------- */

  function renderPersonSubtree(personId, isRootLevel) {
    var subtree = document.createElement("div");
    subtree.className = "subtree";

    var unions = unionsOf(personId);

    var personRow = document.createElement("div");
    personRow.className = "person-row" + (unions.length ? " has-children" : "");
    personRow.appendChild(buildPersonCard(personId, { isRoot: !!isRootLevel }));
    subtree.appendChild(personRow);

    if (unions.length) {
      var unionsContainer = document.createElement("div");
      unionsContainer.className = "unions-container" + (unions.length > 1 ? " multi" : "");

      unions.forEach(function (marriage, index) {
        if (index > maxUnionIndexSeen) maxUnionIndexSeen = index;
        var color = UNION_COLORS[index % UNION_COLORS.length];
        var label = unions.length > 1 ? UNION_LABELS[index % UNION_LABELS.length] : null;

        var unionBlock = document.createElement("div");
        unionBlock.className = "union-block";
        unionBlock.style.setProperty("--u-color", color);

        var inner = document.createElement("div");
        inner.className = "union-block-inner";
        inner.style.setProperty("--u-color", color);

        var couple = document.createElement("div");
        couple.className = "couple";

        var spouseId = otherSpouse(marriage, personId);
        var spouseSlot = document.createElement("div");
        spouseSlot.className = "spouse-slot";
        if (label) {
          var lbl = document.createElement("span");
          lbl.className = "spouse-label";
          lbl.style.setProperty("--u-color", color);
          lbl.textContent = label;
          spouseSlot.appendChild(lbl);
        }
        spouseSlot.appendChild(buildPersonCard(spouseId));

        var link = document.createElement("div");
        link.className = "marriage-link";
        link.style.setProperty("--u-color", color);

        couple.appendChild(link);
        couple.appendChild(spouseSlot);
        inner.appendChild(couple);

        if (marriage.children && marriage.children.length) {
          var childrenRow = document.createElement("div");
          childrenRow.className = "children-row" + (marriage.children.length === 1 ? " single" : "");
          childrenRow.style.setProperty("--u-color", color);

          marriage.children.forEach(function (childId) {
            var stub = document.createElement("div");
            stub.className = "child-stub";
            stub.style.setProperty("--u-color", color);
            stub.appendChild(renderPersonSubtree(childId, false));
            childrenRow.appendChild(stub);
          });

          inner.appendChild(childrenRow);
        }

        unionBlock.appendChild(inner);
        unionsContainer.appendChild(unionBlock);
      });

      subtree.appendChild(unionsContainer);

      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "toggle-btn";
      toggle.textContent = "−";
      toggle.title = "باز/بسته کردن این شاخه";
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        subtree.classList.toggle("collapsed");
        toggle.textContent = subtree.classList.contains("collapsed") ? "+" : "−";
      });
      personRow.appendChild(toggle);
    }

    return subtree;
  }

  /* ---------------- render whole tree ---------------- */

  function renderTree() {
    var root = document.getElementById("treeRoot");
    root.innerHTML = "";
    personCardEls = {};
    maxUnionIndexSeen = -1;
    rootPersonIds.forEach(function (id) {
      root.appendChild(renderPersonSubtree(id, true));
    });
    buildLegend();
  }

  function buildLegend() {
    var legend = document.getElementById("legend");
    if (maxUnionIndexSeen < 1) {
      legend.classList.remove("visible");
      legend.innerHTML = "";
      return;
    }
    var html = "<h3>راهنمای رنگ همسران</h3>";
    for (var i = 0; i <= maxUnionIndexSeen; i++) {
      html +=
        '<div class="legend-item"><span class="legend-dot" style="background:' +
        UNION_COLORS[i % UNION_COLORS.length] +
        '"></span>' +
        UNION_LABELS[i % UNION_LABELS.length] +
        " و فرزندانش</div>";
    }
    legend.innerHTML = html;
    legend.classList.add("visible");
  }

  /* ---------------- modal ---------------- */

  function openPersonModal(personId) {
    var person = getPerson(personId);
    var modal = document.getElementById("personModal");
    var body = document.getElementById("personModalBody");
    body.innerHTML = "";

    body.appendChild(avatarNode(person));

    var name = document.createElement("div");
    name.className = "person-name";
    name.textContent = person.name;
    body.appendChild(name);

    var yl = yearsLabel(person);
    if (yl) {
      var years = document.createElement("div");
      years.className = "person-years";
      years.textContent = yl;
      body.appendChild(years);
    }

    if (person.note) {
      var note = document.createElement("div");
      note.className = "person-note";
      note.textContent = person.note;
      body.appendChild(note);
    }

    var relWrap = document.createElement("div");
    relWrap.className = "relation-list";

    var parents = parentsOf(personId);
    if (parents.length) {
      relWrap.innerHTML += "<h4>والدین</h4><ul>" +
        parents.map(function (pid) { return "<li>" + getPerson(pid).name + "</li>"; }).join("") +
        "</ul>";
    }

    var unions = unionsOf(personId);
    if (unions.length) {
      unions.forEach(function (m, idx) {
        var spouseId = otherSpouse(m, personId);
        var label = unions.length > 1 ? UNION_LABELS[idx % UNION_LABELS.length] + " — " : "";
        relWrap.innerHTML +=
          "<h4>" + label + "همسر: " + getPerson(spouseId).name + "</h4>" +
          (m.children.length
            ? "<ul>" + m.children.map(function (cid) { return "<li>" + getPerson(cid).name + "</li>"; }).join("") + "</ul>"
            : "<p style='color:var(--ink-soft);font-size:0.78rem;'>فرزندی ثبت نشده</p>");
      });
    }

    if (relWrap.innerHTML) body.appendChild(relWrap);

    modal.hidden = false;
  }

  function closePersonModal() {
    document.getElementById("personModal").hidden = true;
  }

  document.getElementById("personModalClose").addEventListener("click", closePersonModal);
  document.getElementById("personModalBackdrop").addEventListener("click", closePersonModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePersonModal();
  });

  /* ---------------- search ---------------- */

  var searchInput = document.getElementById("searchInput");
  var searchResults = document.getElementById("searchResults");

  function runSearch(query) {
    query = query.trim();
    searchResults.innerHTML = "";
    if (!query) { searchResults.hidden = true; return; }

    var matches = Object.keys(people).filter(function (id) {
      return people[id].name.indexOf(query) !== -1;
    }).slice(0, 8);

    if (!matches.length) {
      searchResults.innerHTML = '<div class="no-match">فردی با این نام پیدا نشد</div>';
      searchResults.hidden = false;
      return;
    }

    matches.forEach(function (id) {
      var p = people[id];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.innerHTML = "<span>" + p.name + "</span>" +
        (yearsLabel(p) ? '<span class="match-years">' + yearsLabel(p) + "</span>" : "");
      btn.addEventListener("click", function () {
        searchResults.hidden = true;
        searchInput.value = p.name;
        focusPerson(id);
      });
      searchResults.appendChild(btn);
    });
    searchResults.hidden = false;
  }

  function focusPerson(personId) {
    var card = personCardEls[personId];
    if (!card) return;

    // expand every ancestor subtree that contains this card
    var el = card;
    while (el) {
      var subtree = el.closest ? el.closest(".subtree") : null;
      if (!subtree) break;
      subtree.classList.remove("collapsed");
      var toggleBtn = subtree.querySelector(":scope > .person-row > .toggle-btn");
      if (toggleBtn) toggleBtn.textContent = "−";
      el = subtree.parentElement;
    }

    card.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    card.classList.add("highlight");
    setTimeout(function () { card.classList.remove("highlight"); }, 3600);
  }

  searchInput.addEventListener("input", function () { runSearch(searchInput.value); });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-wrap")) searchResults.hidden = true;
  });

  /* ---------------- expand / collapse all ---------------- */

  document.getElementById("expandAllBtn").addEventListener("click", function () {
    document.querySelectorAll(".subtree.collapsed").forEach(function (s) { s.classList.remove("collapsed"); });
    document.querySelectorAll(".toggle-btn").forEach(function (b) { b.textContent = "−"; });
  });
  document.getElementById("collapseAllBtn").addEventListener("click", function () {
    document.querySelectorAll(".subtree").forEach(function (s) {
      if (s.querySelector(":scope > .unions-container")) s.classList.add("collapsed");
    });
    document.querySelectorAll(".toggle-btn").forEach(function (b) { b.textContent = "+"; });
  });

  /* ---------------- zoom & pan ---------------- */

  var scale = 1;
  var canvas = document.getElementById("treeCanvas");
  var viewport = document.getElementById("treeViewport");
  var zoomLabel = document.getElementById("zoomLabel");

  function applyZoom() {
    canvas.style.transform = "scale(" + scale + ")";
    zoomLabel.textContent = Math.round(scale * 100) + "%";
  }
  document.getElementById("zoomInBtn").addEventListener("click", function () {
    scale = Math.min(1.8, +(scale + 0.1).toFixed(2));
    applyZoom();
  });
  document.getElementById("zoomOutBtn").addEventListener("click", function () {
    scale = Math.max(0.5, +(scale - 0.1).toFixed(2));
    applyZoom();
  });
  document.getElementById("resetViewBtn").addEventListener("click", function () {
    scale = 1;
    applyZoom();
    viewport.scrollTo({ left: (viewport.scrollWidth - viewport.clientWidth) / 2, top: 0, behavior: "smooth" });
  });

  var isDragging = false, dragStartX, dragStartY, scrollStartLeft, scrollStartTop;
  viewport.addEventListener("mousedown", function (e) {
    if (e.target.closest(".person-card") || e.target.closest(".toolbar")) return;
    isDragging = true;
    viewport.classList.add("grabbing");
    dragStartX = e.pageX;
    dragStartY = e.pageY;
    scrollStartLeft = viewport.scrollLeft;
    scrollStartTop = viewport.scrollTop;
  });
  window.addEventListener("mouseup", function () {
    isDragging = false;
    viewport.classList.remove("grabbing");
  });
  window.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    viewport.scrollLeft = scrollStartLeft - (e.pageX - dragStartX);
    viewport.scrollTop = scrollStartTop - (e.pageY - dragStartY);
  });

  /* ---------------- init ---------------- */

  renderTree();

  // center the tree horizontally on load
  window.addEventListener("load", function () {
    viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
  });
})();
