const featuredItems = [
    {
      title: "Serve Basics You Can Repeat",
      desc: "Learn a simple serve routine: stance, grip, swing path, and a consistent contact point.",
      level: "beginner",
      time: "12 min",
      focus: "Fundamentals",
      goal: "Consistency",
      steps: [
        "Use a relaxed forehand grip, thumb light on the handle.",
        "Stand stable, shuttle in front of your body.",
        "Small swing, contact in front, follow through forward.",
        "Aim 10 serves into one target zone.",
      ],
      tip: "Make your serve routine identical every time to reduce errors.",
    },
    {
      title: "Footwork: Split Step and Recovery",
      desc: "Train the split step timing so you move faster and return to base smoothly.",
      level: "beginner",
      time: "15 min",
      focus: "Footwork",
      goal: "Speed",
      steps: [
        "Start in ready stance, knees soft, heels light.",
        "Split step exactly as opponent hits the shuttle.",
        "Push to one corner, then recover to base.",
        "Do 3 sets of 45 seconds with 30 seconds rest.",
      ],
      tip: "Quiet feet usually means good balance.",
    },
    {
      title: "Drop Shot Control Drill",
      desc: "Improve touch and placement using a target based drop drill and clean follow through.",
      level: "intermediate",
      time: "18 min",
      focus: "Strokes",
      goal: "Control",
      steps: [
        "Start with clear preparation to disguise the shot.",
        "Reduce power, keep a smooth swing, soft fingers.",
        "Aim cross court and straight targets alternately.",
        "Track how many land within one racket length of the net.",
      ],
      tip: "Disguise comes from using the same preparation as a clear.",
    },
    {
      title: "Defense to Counter: Block and Lift",
      desc: "Turn pressure into control by learning safe blocks and high quality lifts.",
      level: "intermediate",
      time: "20 min",
      focus: "Game IQ",
      goal: "Stability",
      steps: [
        "Use compact swing, meet the shuttle early.",
        "Block to the net when smash is steep.",
        "Lift high and deep when you are late.",
        "Practice 10 blocks and 10 lifts each side.",
      ],
      tip: "If you feel rushed, lift high first, then reset the rally.",
    },
  ];
  
  const resources = [
    {
      title: "Beginner Plan: 30 Minutes",
      desc: "Warm up, shadow footwork, clear and drop practice, then one controlled game.",
      level: "beginner",
      time: "30 min",
      focus: "All around",
      goal: "Consistency",
      steps: [
        "Warm up 6 to 8 minutes: joints + light movement.",
        "Shadow footwork 5 minutes: corners + recovery.",
        "Practice clears 5 minutes, then drops 5 minutes.",
        "Play one controlled game focusing on footwork timing.",
      ],
      tip: "Write 2 improvements right after the session while memory is fresh.",
    },
    {
      title: "Footwork Ladder Session",
      desc: "Corner to corner movement with recovery. Focus on balance and quiet landing.",
      level: "beginner",
      time: "20 min",
      focus: "Footwork",
      goal: "Speed",
      steps: [
        "Mark base position on the floor.",
        "Move to 4 corners with correct lunge, return to base.",
        "Do 30 seconds work, 30 seconds rest, for 8 rounds.",
        "Add split step before each move.",
      ],
      tip: "Do not sacrifice balance for speed. Balance produces speed.",
    },
    {
      title: "Smash Technique Check",
      desc: "Grip, elbow lead, contact point, then follow through. Record yourself once.",
      level: "intermediate",
      time: "25 min",
      focus: "Strokes",
      goal: "Power",
      steps: [
        "Start relaxed grip, tighten only at contact.",
        "Rotate shoulder and hips, elbow leads the swing.",
        "Contact high and slightly in front.",
        "Record 10 smashes, check timing and body alignment.",
      ],
      tip: "If your shoulder hurts, reduce effort and fix timing first.",
    },
    {
      title: "Doubles Rotation Basics",
      desc: "Learn front back and side by side positioning, and when to switch roles.",
      level: "beginner",
      time: "15 min",
      focus: "Game IQ",
      goal: "Teamwork",
      steps: [
        "If you lift, prepare side by side defense.",
        "If you attack downward, move into front back.",
        "Communicate early with short calls like 'mine' or 'switch'.",
        "Practice rotation slowly before playing fast rallies.",
      ],
      tip: "Good doubles is mostly positioning, not power.",
    },
    {
      title: "Net Play: Tap and Spin",
      desc: "Use soft fingers, short motion, and aim for tight net shots that force lifts.",
      level: "intermediate",
      time: "18 min",
      focus: "Strokes",
      goal: "Control",
      steps: [
        "Stand close to net with racket up.",
        "Use soft fingers to guide shuttle, not a full swing.",
        "Aim for tape height, shuttle tumbles downward.",
        "Alternate straight and cross net shots for 3 sets.",
      ],
      tip: "If the shuttle sits up, reduce motion and soften the grip.",
    },
    {
      title: "Match Routine: Calm Under Pressure",
      desc: "A simple mental checklist between rallies: breathe, plan, commit to one option.",
      level: "beginner",
      time: "10 min",
      focus: "Mindset",
      goal: "Confidence",
      steps: [
        "After each rally: one deep breath.",
        "Decide one simple plan: clear, drop, or drive.",
        "Commit to it fully on the next shot.",
        "If you miss, reset and return to the checklist.",
      ],
      tip: "A routine protects you from tilt and rushed decisions.",
    },
  ];
  
  function tagClass(level) {
    return level === "beginner" ? "tag-beginner" : "tag-intermediate";
  }
  
  function levelText(level) {
    return level === "beginner" ? "Beginner" : "Intermediate";
  }
  
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem("ss_favs")) || [];
    } catch {
      return [];
    }
  }
  
  function setFavorites(list) {
    localStorage.setItem("ss_favs", JSON.stringify(list));
  }
  
  function isFav(title) {
    return getFavorites().includes(title);
  }
  
  function toggleFav(title) {
    const favs = getFavorites();
    const exists = favs.includes(title);
    const updated = exists ? favs.filter((t) => t !== title) : [...favs, title];
    setFavorites(updated);
    return !exists;
  }
  
  function makeCard(item, type = "resource") {
    const wrapper = document.createElement("div");
    wrapper.className = "col-md-6 col-lg-4";
  
    const card = document.createElement("div");
    card.className = "card soft-card h-100 resource-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.dataset.title = item.title;
    card.dataset.type = type;
  
    const body = document.createElement("div");
    body.className = "card-body";
  
    const topRow = document.createElement("div");
    topRow.className = "d-flex justify-content-between align-items-start gap-2";
  
    const tag = document.createElement("div");
    tag.className = `tag ${tagClass(item.level)}`;
    tag.textContent = levelText(item.level);
  
    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = "fav-btn";
    favBtn.setAttribute("aria-label", "Toggle favorite");
    favBtn.textContent = isFav(item.title) ? "♥" : "♡";
  
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const nowFav = toggleFav(item.title);
      favBtn.textContent = nowFav ? "♥" : "♡";
    });
  
    topRow.appendChild(tag);
    topRow.appendChild(favBtn);
  
    const title = document.createElement("div");
    title.className = "resource-title";
    title.textContent = item.title;
  
    const desc = document.createElement("p");
    desc.className = "resource-desc";
    desc.textContent = item.desc;
  
    const meta = document.createElement("div");
    meta.className = "resource-meta";
  
    const left = document.createElement("div");
    left.className = "meta-pill";
    left.textContent = `Time: ${item.time}`;
  
    const right = document.createElement("div");
    right.className = "meta-pill";
    right.textContent = type === "resource" ? `Goal: ${item.goal}` : `Focus: ${item.focus}`;
  
    meta.appendChild(left);
    meta.appendChild(right);
  
    body.appendChild(topRow);
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(meta);
  
    card.appendChild(body);
    wrapper.appendChild(card);
  
    return wrapper;
  }
  
  function renderGrid(gridEl, items, type) {
    gridEl.innerHTML = "";
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "col-12";
      empty.innerHTML = `
        <div class="callout">
          <div class="callout-title">No results found</div>
          <div class="callout-text">Try a different keyword like "footwork" or change the level filter.</div>
        </div>
      `;
      gridEl.appendChild(empty);
      return;
    }
  
    items.forEach((item) => {
      gridEl.appendChild(makeCard(item, type));
    });
  }
  
  function closeNavbarOnMobile() {
    const navCollapse = document.getElementById("mainNav");
    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
    if (bsCollapse) bsCollapse.hide();
  }
  
  function setActiveNavLink() {
    const links = Array.from(document.querySelectorAll(".navbar .nav-link"));
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
  
    const scrollY = window.scrollY + 110;
  
    let current = null;
    for (const sec of sections) {
      if (sec.offsetTop <= scrollY) current = sec;
    }
  
    links.forEach((a) => a.classList.remove("active"));
    if (!current) return;
  
    const activeLink = links.find((a) => a.getAttribute("href") === `#${current.id}`);
    if (activeLink) activeLink.classList.add("active");
  }
  
  function filterItems(list, keyword, level) {
    const k = keyword.trim().toLowerCase();
    return list.filter((item) => {
      const matchesKeyword =
        !k ||
        item.title.toLowerCase().includes(k) ||
        item.desc.toLowerCase().includes(k) ||
        (item.focus && item.focus.toLowerCase().includes(k)) ||
        (item.goal && item.goal.toLowerCase().includes(k));
  
      const matchesLevel = level === "all" ? true : item.level === level;
  
      return matchesKeyword && matchesLevel;
    });
  }
  
  function setupContactForm() {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated");
        status.textContent = "Please complete the form fields above.";
        return;
      }
  
      form.classList.add("was-validated");
      status.textContent = "Message sent. Thank you. (Demo only)";
      form.reset();
  
      setTimeout(() => {
        status.textContent = "";
        form.classList.remove("was-validated");
      }, 2500);
    });
  }
  
  function setupTopProgress() {
    const bar = document.getElementById("topProgressBar");
    function update() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height ? (scrollTop / height) * 100 : 0;
      bar.style.width = `${pct}%`;
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }
  
  function setupBackToTop() {
    const btn = document.getElementById("backToTop");
    const ring = btn.querySelector(".btt-ring");
  
    function update() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height ? scrollTop / height : 0;
  
      if (scrollTop > 500) btn.classList.add("show");
      else btn.classList.remove("show");
  
      const deg = Math.round(pct * 360);
      ring.style.background = `conic-gradient(var(--accent) ${deg}deg, rgba(15, 23, 42, 0.12) 0deg)`;
    }
  
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  
    update();
    window.addEventListener("scroll", update, { passive: true });
  }
  
  function setupTheme() {
    const btn = document.getElementById("themeToggle");
    const key = "ss_theme";
    const saved = localStorage.getItem(key);
  
    function apply(mode) {
      const dark = mode === "dark";
      document.body.classList.toggle("dark", dark);
      btn.textContent = dark ? "Light Mode" : "Dark Mode";
      localStorage.setItem(key, mode);
    }
  
    apply(saved || "light");
  
    btn.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark");
      apply(isDark ? "light" : "dark");
    });
  }
  
  function setupModal() {
    const modalEl = document.getElementById("resourceModal");
    const modal = new bootstrap.Modal(modalEl);
  
    const label = document.getElementById("resourceModalLabel");
    const level = document.getElementById("modalLevel");
    const meta1 = document.getElementById("modalMeta1");
    const meta2 = document.getElementById("modalMeta2");
    const desc = document.getElementById("modalDesc");
    const steps = document.getElementById("modalSteps");
    const tip = document.getElementById("modalTip");
    const favBtn = document.getElementById("modalFavBtn");
  
    function findItemByTitle(title) {
      return [...featuredItems, ...resources].find((x) => x.title === title);
    }
  
    function open(title, type) {
      const item = findItemByTitle(title);
      if (!item) return;
  
      label.textContent = item.title;
      level.className = `tag ${tagClass(item.level)}`;
      level.textContent = levelText(item.level);
  
      meta1.textContent = `Time: ${item.time}`;
      meta2.textContent = type === "resource" ? `Goal: ${item.goal}` : `Focus: ${item.focus}`;
  
      desc.textContent = item.desc;
  
      steps.innerHTML = "";
      (item.steps || []).forEach((s) => {
        const li = document.createElement("li");
        li.textContent = s;
        steps.appendChild(li);
      });
  
      tip.textContent = item.tip || "";
  
      const fav = isFav(item.title);
      favBtn.textContent = fav ? "Remove Favorite" : "Save to Favorites";
  
      favBtn.onclick = () => {
        const nowFav = toggleFav(item.title);
        favBtn.textContent = nowFav ? "Remove Favorite" : "Save to Favorites";
        document.querySelectorAll(".resource-card").forEach((card) => {
          if (card.dataset.title === item.title) {
            const b = card.querySelector(".fav-btn");
            if (b) b.textContent = nowFav ? "♥" : "♡";
          }
        });
      };
  
      modal.show();
    }
  
    function attachCardListeners() {
      document.querySelectorAll(".resource-card").forEach((card) => {
        card.addEventListener("click", () => open(card.dataset.title, card.dataset.type));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open(card.dataset.title, card.dataset.type);
          }
        });
      });
    }
  
    return { attachCardListeners };
  }
  
  function setupShortcuts() {
    const search = document.getElementById("searchInput");
    const level = document.getElementById("levelFilter");
    const reset = document.getElementById("resetBtn");
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== search) {
        e.preventDefault();
        search.focus();
        return;
      }
  
      if (e.key === "Escape") {
        if (document.activeElement === search) {
          search.value = "";
          level.value = "all";
          reset.click();
          search.blur();
        }
      }
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();
  
    const featuredGrid = document.getElementById("featuredGrid");
    const resourceGrid = document.getElementById("resourceGrid");
  
    function renderAll(keyword = "", level = "all") {
      const filteredFeatured = filterItems(featuredItems, keyword, level);
      const filteredResources = filterItems(resources, keyword, level);
  
      renderGrid(featuredGrid, filteredFeatured, "featured");
      renderGrid(resourceGrid, filteredResources, "resource");
    }
  
    renderAll();
  
    document.querySelectorAll(".navbar a.nav-link, .navbar a.btn").forEach((a) => {
      a.addEventListener("click", () => closeNavbarOnMobile());
    });
  
    const searchInput = document.getElementById("searchInput");
    const levelFilter = document.getElementById("levelFilter");
    const resetBtn = document.getElementById("resetBtn");
  
    function applyFilters() {
      renderAll(searchInput.value, levelFilter.value);
      modalApi.attachCardListeners();
    }
  
    searchInput.addEventListener("input", applyFilters);
    levelFilter.addEventListener("change", applyFilters);
  
    resetBtn.addEventListener("click", () => {
      searchInput.value = "";
      levelFilter.value = "all";
      renderAll();
      modalApi.attachCardListeners();
    });
  
    setActiveNavLink();
    window.addEventListener("scroll", setActiveNavLink, { passive: true });
  
    setupContactForm();
    setupTopProgress();
    setupBackToTop();
    setupTheme();
    setupShortcuts();
  
    const modalApi = setupModal();
    modalApi.attachCardListeners();
  });