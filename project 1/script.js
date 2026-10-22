const DEV = { name: "Your Name", email: "you@example.com" }; // edit these two lines
document.getElementById("devname").textContent = DEV.name;
document.getElementById("devmail").href =
  "mailto:" + DEV.email + "?subject=" + encodeURIComponent("Website quote");

const MENU = [
  {
    id: 1,
    c: "Bread",
    n: "Country sourdough",
    d: "48-hour ferment with a blistered, crackly crust.",
    p: 8,
  },
  { id: 2, c: "Bread", n: "Seeded rye", d: "Dense, nutty and made to be toasted.", p: 9 },
  {
    id: 3,
    c: "Bread",
    n: "Olive & rosemary focaccia",
    d: "Olive oil, flaky salt, a little too easy to finish.",
    p: 7,
  },
  {
    id: 4,
    c: "Pastry",
    n: "Butter croissant",
    d: "Three days of lamination. Shatters on the first bite.",
    p: 4.5,
  },
  { id: 5, c: "Pastry", n: "Cardamom bun", d: "Soft, spiced and glazed while still warm.", p: 5 },
  {
    id: 6,
    c: "Pastry",
    n: "Pain au chocolat",
    d: "Two bars of dark chocolate in every one.",
    p: 5,
  },
  {
    id: 7,
    c: "Pastry",
    n: "Olive oil cake (vegan)",
    d: "Citrus, almond and a tender crumb.",
    p: 5.5,
  },
  { id: 8, c: "Coffee", n: "Flat white", d: "Double shot with silky steamed milk.", p: 4.5 },
  { id: 9, c: "Coffee", n: "Oat flat white", d: "Same drink, oat milk, no upcharge.", p: 4.5 },
  { id: 10, c: "Coffee", n: "Filter coffee", d: "Single origin, brewed by the pot.", p: 3.5 },
];
const HRS = [[8, 15], null, [7, 17], [7, 17], [7, 17], [7, 18], [8, 18]]; // Sun..Sat
const DN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const cart = {};
let cat = "All";
const $ = (n) => "$" + n.toFixed(2),
  $id = (i) => document.getElementById(i);
const hr = (h) => {
  const x = Math.floor(h),
    m = h % 1 ? "30" : "00";
  return (x % 12 || 12) + ":" + m + (x < 12 ? " am" : " pm");
};

function openNow() {
  const d = new Date(),
    h = HRS[d.getDay()],
    t = d.getHours() + d.getMinutes() / 60;
  if (h && t >= h[0] && t < h[1]) {
    $id("dot").className = "dot";
    $id("open").textContent = "Open now, until " + hr(h[1]).replace(":00", "");
  } else {
    $id("dot").className = "dot off";
    const n = [1, 2, 3, 4, 5, 6, 7].map((k) => (d.getDay() + k) % 7).find((k) => HRS[k]);
    $id("open").textContent =
      "Closed now, opens " +
      (h && t < h[0] ? "today" : DN[n]) +
      " at " +
      hr((h && t < h[0] ? h : HRS[n])[0]).replace(":00", "");
  }
}
function hours() {
  const t = new Date().getDay();
  $id("hrs").innerHTML = DN.map(
    (n, i) =>
      `<div class="${i === t ? "today" : ""}"><span>${n}</span><span>${HRS[i] ? hr(HRS[i][0]) + " to " + hr(HRS[i][1]) : "Closed"}</span></div>`,
  ).join("");
}

function menu() {
  $id("chips").innerHTML = ["All", "Bread", "Pastry", "Coffee"]
    .map((c) => `<button class="chip" aria-pressed="${c === cat}" data-c="${c}">${c}</button>`)
    .join("");
  $id("menu-grid").innerHTML = MENU.filter((m) => cat === "All" || m.c === cat)
    .map(
      (m) =>
        `<div class="item"><h3>${m.n}</h3><p>${m.d}</p><div class="r"><span class="price">${$(m.p)}</span><button class="add" data-add="${m.id}">Add to order</button></div></div>`,
    )
    .join("");
}
function renderCart() {
  const ids = Object.keys(cart);
  let tot = 0;
  $id("cart").innerHTML =
    `<h3 style="font-size:22px">Your order</h3>` +
    (ids.length
      ? ids
          .map((i) => {
            const m = MENU.find((x) => x.id == i);
            tot += m.p * cart[i];
            return `<div class="line"><span>${m.n}<br><small style="color:var(--mut)">${$(m.p)} each</small></span><span><button class="q" data-q="${i}" data-d="-1" aria-label="Remove one ${m.n}">−</button> ${cart[i]} <button class="q" data-q="${i}" data-d="1" aria-label="Add one ${m.n}">+</button></span></div>`;
          })
          .join("")
      : `<p style="color:var(--mut)">Nothing yet. Pick something from the menu above.</p>`);
  $id("tt").textContent = $(tot);
  return tot;
}

function days() {
  const d = new Date(),
    o = [];
  for (let k = 0; k < 4 && o.length < 3; k++) {
    const x = new Date(d.getTime() + k * 864e5);
    if (HRS[x.getDay()]) o.push([k, x]);
  }
  $id("dy").innerHTML = o
    .map(
      ([k, x]) =>
        `<option value="${k}">${k === 0 ? "Today" : k === 1 ? "Tomorrow" : DN[x.getDay()]}</option>`,
    )
    .join("");
  times();
}
function times() {
  const k = +$id("dy").value,
    x = new Date(Date.now() + k * 864e5),
    h = HRS[x.getDay()],
    n = new Date(),
    now = n.getHours() + n.getMinutes() / 60 + 1,
    s = [];
  for (let t = h[0]; t < h[1]; t += 0.5) if (k > 0 || t >= now) s.push(t);
  $id("tm").innerHTML = s.length
    ? s.map((t) => `<option>${hr(t)}</option>`).join("")
    : `<option value="">No slots left today</option>`;
}

document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.dataset.c) {
    cat = t.dataset.c;
    menu();
  } else if (t.dataset.add) {
    cart[t.dataset.add] = (cart[t.dataset.add] || 0) + 1;
    renderCart();
    $id("done").innerHTML = "";
  } else if (t.dataset.q) {
    const i = t.dataset.q;
    cart[i] += +t.dataset.d;
    if (cart[i] < 1) delete cart[i];
    renderCart();
  }
});
$id("dy").onchange = times;
$id("form").onsubmit = (e) => {
  e.preventDefault();
  const tot = renderCart();
  if (!tot) {
    $id("done").innerHTML = `<div class="ok">Add at least one item to your order first.</div>`;
    return;
  }
  if (!$id("tm").value) {
    $id("done").innerHTML =
      `<div class="ok">Pick another day. No pickup slots are left today.</div>`;
    return;
  }
  $id("done").innerHTML =
    `<div class="ok" role="status">Thanks, ${$id("nm").value.replace(/[<>&]/g, "")}! Your ${$(tot)} order will be ready ${$id("dy").selectedOptions[0].text.toLowerCase()} at ${$id("tm").value}. (Demo: no real order was sent.)</div>`;
  Object.keys(cart).forEach((k) => delete cart[k]);
  renderCart();
  e.target.reset();
  days();
};
openNow();
hours();
menu();
renderCart();
days();