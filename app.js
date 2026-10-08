// SimProof website.
// Everything shown in the hero, the demo and the terminal is real SimProof 0.1.0 output for the
// synthetic test model in tests/fixtures/pulsed_static (no client data).

const DECK_SHA = "84e4538f82591955";
const DECK_FILE = "tests/fixtures/pulsed_static/ds.dat";

// Rows of the report's evidence appendix. `quoted` is the text the report prints next to the tag.
const EVIDENCE = {
  E1: { name: "Temperature Constraint applied at solve time", value: "35.0", unit: "°C", quoted: "35.00", location: "table _loadvari10, line 29; evaluated at t=0.012", line: 29, atSolve: true },
  E2: { name: "Temperature Constraint time-average", value: "34.854166666666664", unit: "°C", quoted: "34.85", location: "table _loadvari10, line 29; averaged over t=0..0.012", line: 29 },
  E3: { name: "Temperature Constraint peak", value: "35.0", unit: "°C", quoted: "35.00", location: "table _loadvari10, line 29; extreme over t=0..0.012", line: 29 },
  E4: { name: "Heat Flow applied at solve time", value: "100.0", unit: "mW/mm^2", quoted: "100.0", location: "table _loadvari11, line 43; evaluated at t=0.012", line: 43, atSolve: true },
  E5: { name: "Heat Flow time-average", value: "50.83333333333333", unit: "mW/mm^2", quoted: "50.83", location: "table _loadvari11, line 43; averaged over t=0..0.012", line: 43 },
  E6: { name: "Heat Flow peak", value: "100.0", unit: "mW/mm^2", quoted: "100.0", location: "table _loadvari11, line 43; extreme over t=0..0.012", line: 43 },
  E7: { name: "Heat Flow 2 applied at solve time", value: "0.0", unit: "mW/mm^2", quoted: "0.000", location: "table _loadvari12, line 63; evaluated at t=0.012", line: 63, atSolve: true },
  E8: { name: "Heat Flow 2 time-average", value: "33.333333333333336", unit: "mW/mm^2", quoted: "33.33", location: "table _loadvari12, line 63; averaged over t=0..0.012", line: 63 },
  E9: { name: "Heat Flow 2 peak", value: "80.0", unit: "mW/mm^2", quoted: "80.00", location: "table _loadvari12, line 63; extreme over t=0..0.012", line: 63 },
};

// The checks table of the generated report, in report order.
const FINDINGS = [
  { status: "warn", title: "Solver errors and warnings", message: "2 solver warning(s) to review in tests/fixtures/pulsed_static/solve.out." },
  { status: "pass", title: "Unit system known", message: "MPA units; temperatures in °C." },
  { status: "pass", title: "Time-varying loads in a static solve", message: "'Temperature Constraint' at t=0.012 matches its time-average within tolerance.", evidence: ["E1", "E2", "E3"] },
  { status: "warn", title: "Time-varying loads in a static solve", message: "'Heat Flow' is applied at its t=0.012 value, which differs from its time-average by more than 5% of peak. Confirm which one is intended.", evidence: ["E4", "E5", "E6"] },
  { status: "fail", title: "Time-varying loads in a static solve", message: "'Heat Flow 2' is OFF at the solve time t=0.012: the static solve applies zero although the load is non-zero at other times. If an averaged load is intended, apply the time-average instead.", evidence: ["E7", "E8", "E9"] },
  { status: "warn", title: "Result fields read", message: "No result fields available (No result file (file.rth / file.rst); result fields not read.)." },
  { status: "skip", title: "Global conservation (energy / force balance)", message: "No balance available: the reader did not supply applied totals and reactions" },
];

// Lines of ds.dat shown in the deck viewer. null marks skipped lines.
const DECK_LINES = [
  [29, "*DIM,_loadvari10,TABLE,3,1,1,TIME, , ,0"],
  [30, "! Time values"],
  [31, "*TAXIS,_loadvari10(1),1,0.,1.e-004,1."],
  [32, "! Load values"],
  [33, "_loadvari10(1,1,1) = 0."],
  [34, "_loadvari10(2,1,1) = 35."],
  [35, "_loadvari10(3,1,1) = 35."],
  null,
  [43, "*DIM,_loadvari11,TABLE,9,1,1,TIME, , , 0"],
  [44, "! Time values"],
  [45, "*TAXIS,_loadvari11(1),1,0.,4.e-003,4.1e-003,9.9e-003,1.e-002,1.4e-002,1.41e-002,1.99e-002,2.e-002"],
  [46, "! Load values"],
  [47, "_loadvari11(1,1,1) = 100."],
  [48, "_loadvari11(2,1,1) = 100."],
  [49, "_loadvari11(3,1,1) = 0."],
  [50, "_loadvari11(4,1,1) = 0."],
  [51, "_loadvari11(5,1,1) = 100."],
  [52, "_loadvari11(6,1,1) = 100."],
  [53, "_loadvari11(7,1,1) = 0."],
  [54, "_loadvari11(8,1,1) = 0."],
  [55, "_loadvari11(9,1,1) = 100."],
  null,
  [63, "*DIM,_loadvari12,TABLE,6,1,1,TIME, , , 0"],
  [64, "! Time values"],
  [65, "*TAXIS,_loadvari12(1),1,0.,4.9e-003,5.e-003,9.9e-003,1.e-002,2.e-002"],
  [66, "! Load values"],
  [67, "_loadvari12(1,1,1) = 0."],
  [68, "_loadvari12(2,1,1) = 0."],
  [69, "_loadvari12(3,1,1) = 80."],
  [70, "_loadvari12(4,1,1) = 80."],
  [71, "_loadvari12(5,1,1) = 0."],
  [72, "_loadvari12(6,1,1) = 0."],
  null,
  [97, "antype,0                   ! static analysis"],
  null,
  [115, "time,1.2e-002"],
];
const SOLVE_TIME_LINE = 115;

document.addEventListener("DOMContentLoaded", () => {
  initScope();
  initDemo();
  initTerminal();
  initContactForm();
  initCopyButtons();
});

// ---------- Hero: sweep the solve cursor along the load table ----------

// Heat Flow 2, *TAXIS and values from ds.dat lines 65-72. MAPDL interpolates tables linearly.
const HF2_TIMES = [0, 0.0049, 0.005, 0.0099, 0.01, 0.02];
const HF2_VALUES = [0, 0, 80, 80, 0, 0];
const SOLVE_T = 0.012;

const plotX = (t) => 52 + (t / 0.02) * 528;
const plotY = (v) => 250 - v * 2.22;

function tableValue(t) {
  for (let i = 1; i < HF2_TIMES.length; i++) {
    if (t <= HF2_TIMES[i]) {
      const t0 = HF2_TIMES[i - 1];
      const t1 = HF2_TIMES[i];
      const f = (t - t0) / (t1 - t0);
      return HF2_VALUES[i - 1] + f * (HF2_VALUES[i] - HF2_VALUES[i - 1]);
    }
  }
  return HF2_VALUES[HF2_VALUES.length - 1];
}

function initScope() {
  const cursor = document.getElementById("scope-cursor");
  const label = document.getElementById("scope-cursor-label");
  const dot = document.getElementById("scope-dot");
  const readout = document.getElementById("scope-readout");
  const verdict = document.getElementById("scope-verdict");
  const replay = document.getElementById("scope-replay");
  if (!cursor || !dot || !readout || !verdict) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = null;
  let fallback = null;

  function draw(t, final) {
    const x = plotX(t);
    const v = tableValue(t);
    cursor.setAttribute("transform", `translate(${x.toFixed(2)} 0)`);
    dot.setAttribute("cx", x.toFixed(2));
    dot.setAttribute("cy", plotY(v).toFixed(2));
    label.textContent = final ? "solve, t = 0.012 s" : `t = ${t.toFixed(4)} s`;
    readout.textContent = `${v.toFixed(3)} mW/mm² at t = ${t.toFixed(4)} s`;
  }

  function land() {
    cancelAnimationFrame(frame);
    clearTimeout(fallback);
    draw(SOLVE_T, true);
    verdict.classList.remove("is-waiting");
    dot.classList.remove("is-landed");
    void dot.getBoundingClientRect();
    dot.classList.add("is-landed");
  }

  function play() {
    cancelAnimationFrame(frame);
    if (reduceMotion) {
      land();
      return;
    }
    verdict.classList.add("is-waiting");
    const duration = 2600;
    const delay = 350;
    let start = null;
    const step = (now) => {
      if (start === null) start = now;
      const elapsed = now - start - delay;
      const p = Math.min(Math.max(elapsed / duration, 0), 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      if (p < 1) {
        draw(eased * SOLVE_T, false);
        frame = requestAnimationFrame(step);
      } else {
        land();
      }
    };
    frame = requestAnimationFrame(step);
    // Browsers pause animation frames in hidden tabs; never leave the verdict hidden.
    clearTimeout(fallback);
    fallback = setTimeout(land, delay + duration + 800);
  }

  if (replay) replay.addEventListener("click", play);
  play();
}

// ---------- Demo: report findings, evidence record, deck lines ----------

const STATUS_LABEL = { pass: "Pass", warn: "Warn", fail: "Fail", skip: "Skip" };

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function initDemo() {
  const list = document.getElementById("findings");
  const deck = document.getElementById("deck");
  if (!list || !deck) return;

  list.innerHTML = FINDINGS.map((f) => {
    const evidence = (f.evidence || []).map((id) => {
      const ev = EVIDENCE[id];
      return `<li>${escapeHtml(ev.name)}: <span class="quoted">${escapeHtml(ev.quoted)} ${escapeHtml(ev.unit)}</span> <button class="tag" type="button" data-ev="${id}" aria-pressed="false">[${id}]</button></li>`;
    }).join("");
    return `
      <li class="finding">
        <span class="chip chip-${f.status}">${STATUS_LABEL[f.status]}</span>
        <div>
          <div class="finding-title">${escapeHtml(f.title)}</div>
          <p class="finding-message">${escapeHtml(f.message)}</p>
          ${evidence ? `<ul class="finding-evidence">${evidence}</ul>` : ""}
        </div>
      </li>`;
  }).join("");

  deck.innerHTML = DECK_LINES.map((row) => {
    if (row === null) return `<span class="deck-line is-gap"><span class="ln">…</span></span>`;
    const [n, text] = row;
    return `<span class="deck-line" data-line="${n}"><span class="ln">${n}</span>${escapeHtml(text)}</span>`;
  }).join("");

  document.addEventListener("click", (e) => {
    const tag = e.target.closest(".tag[data-ev]");
    if (!tag) return;
    const id = tag.getAttribute("data-ev");
    showEvidence(id);
    if (tag.hasAttribute("data-jump")) {
      document.getElementById("demo").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  });

  showEvidence("E7", { scrollDeck: false });
}

function showEvidence(id, { scrollDeck = true } = {}) {
  const ev = EVIDENCE[id];
  if (!ev) return;

  document.querySelectorAll("#findings .tag").forEach((t) => {
    t.setAttribute("aria-pressed", String(t.getAttribute("data-ev") === id));
  });

  document.getElementById("ev-heading").textContent = `Evidence ${id}`;
  document.getElementById("ev-record").innerHTML = `
    <dt>Quantity</dt><dd>${escapeHtml(ev.name)}</dd>
    <dt>Value</dt><dd class="mono">${escapeHtml(ev.value)}</dd>
    <dt>Unit</dt><dd class="mono">${escapeHtml(ev.unit)}</dd>
    <dt>Source file</dt><dd class="mono">${DECK_FILE}</dd>
    <dt>Location</dt><dd class="mono">${escapeHtml(ev.location)}</dd>
    <dt>SHA-256</dt><dd class="mono">${DECK_SHA}</dd>`;

  document.getElementById("ev-verify").innerHTML =
    `The report quotes <strong>${escapeHtml(ev.quoted)}</strong>. Rounded to the same precision, the evidence value ` +
    `${escapeHtml(ev.value)} gives the same number, so <code>simproof verify</code> passes this tag.`;

  const deck = document.getElementById("deck");
  let cited = null;
  deck.querySelectorAll(".deck-line[data-line]").forEach((line) => {
    const n = Number(line.getAttribute("data-line"));
    line.classList.toggle("is-cited", n === ev.line);
    line.classList.toggle("is-related", Boolean(ev.atSolve) && n === SOLVE_TIME_LINE);
    if (n === ev.line) cited = line;
  });

  if (cited && scrollDeck) {
    deck.scrollTo({ top: cited.offsetTop - deck.offsetTop - 12, behavior: "smooth" });
  } else if (cited) {
    deck.scrollTop = cited.offsetTop - deck.offsetTop - 12;
  }
}

// ---------- Terminal ----------

const cmd = (s) => `<span class="t-cmd">${s}</span>`;
const dim = (s) => `<span class="t-dim">${s}</span>`;
const st = (kind, s) => `<span class="t-${kind}">${s}</span>`;
const tg = (s) => `<span class="t-tag">${s}</span>`;

const TERMINAL = {
  check: [
    cmd("simproof check tests/fixtures/pulsed_static"),
    "",
    "== pulsed_static: Pulsed heat test--Steady-State Thermal (A5) (thermal, static)",
    `  ${st("warn", "[WARN]")} solver_messages: 2 solver warning(s) to review in tests/fixtures/pulsed_static/solve.out.`,
    `  ${st("pass", "[PASS]")} unit_system: MPA units; temperatures in °C.`,
    `  ${st("pass", "[PASS]")} static_time_dependent_load: 'Temperature Constraint' at t=0.012 matches its time-average within tolerance.`,
    `         Temperature Constraint applied at solve time: 35 °C ${tg("[E1]")}`,
    `         Temperature Constraint time-average: 34.8542 °C ${tg("[E2]")}`,
    `         Temperature Constraint peak: 35 °C ${tg("[E3]")}`,
    `  ${st("warn", "[WARN]")} static_time_dependent_load: 'Heat Flow' is applied at its t=0.012 value, which differs from its time-average by more than 5% of peak. Confirm which one is intended.`,
    `         Heat Flow applied at solve time: 100 mW/mm^2 ${tg("[E4]")}`,
    `         Heat Flow time-average: 50.8333 mW/mm^2 ${tg("[E5]")}`,
    `         Heat Flow peak: 100 mW/mm^2 ${tg("[E6]")}`,
    `  ${st("fail", "[FAIL]")} static_time_dependent_load: 'Heat Flow 2' is OFF at the solve time t=0.012: the static solve applies zero although the load is non-zero at other times. If an averaged load is intended, apply the time-average instead.`,
    `         Heat Flow 2 applied at solve time: 0 mW/mm^2 ${tg("[E7]")}`,
    `         Heat Flow 2 time-average: 33.3333 mW/mm^2 ${tg("[E8]")}`,
    `         Heat Flow 2 peak: 80 mW/mm^2 ${tg("[E9]")}`,
    `  ${st("warn", "[WARN]")} results_available: No result fields available (No result file (file.rth / file.rst); result fields not read.).`,
    `  ${dim("[skip]")} global_balance: No balance available: the reader did not supply applied totals and reactions`,
    `  note: No result file (file.rth / file.rst); result fields not read.`,
  ],
  report: [
    cmd("simproof report tests/fixtures/pulsed_static -o report.md"),
    "",
    "{",
    '  "path": "report.md",',
    '  "verification": {',
    `    "ok": ${st("pass", "true")},`,
    '    "tagged_values": 10,',
    '    "mismatches": [],',
    '    "unknown_ids": [],',
    '    "untraced_values": []',
    "  }",
    "}",
    "",
    dim("# The report is verified as it is written. Every number in it carries an [E#] tag,"),
    dim("# and its evidence appendix lists file, location and SHA-256 for each tag."),
  ],
  verify: [
    dim("# Later, after the report has been edited and passed around:"),
    cmd("simproof verify report.md"),
    "",
    "{",
    `  "ok": ${st("pass", "true")},`,
    '  "tagged_values": 10,',
    '  "mismatches": [],',
    '  "unknown_ids": [],',
    '  "untraced_values": []',
    "}",
    "",
    dim("# A changed number shows up under mismatches; a number with no tag under untraced_values."),
  ],
  mcp: [
    dim("# Register the SimProof MCP server with Claude Code"),
    cmd("claude mcp add simproof -- simproof-mcp"),
    "",
    dim("# Then ask in plain language, for example:"),
    "> Open C:\\sims\\heatsink\\dp0, run the checks and tell me",
    "  whether the steady-state models can be trusted.",
    "",
    dim("# Claude calls open_study, run_checks and build_report. Every number"),
    dim("# it quotes comes from SimProof, with its [E#] tag, so you can check it."),
  ],
};

function initTerminal() {
  const body = document.getElementById("terminal-body");
  const tabs = Array.from(document.querySelectorAll(".terminal-tabs [role=tab]"));
  if (!body || !tabs.length) return;

  function select(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    body.setAttribute("aria-labelledby", tab.id);
    body.innerHTML = TERMINAL[tab.dataset.term].join("\n");
    body.scrollTop = 0;
    if (focus) tab.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab, false));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const next = (i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
      select(tabs[next], true);
    });
  });

  select(tabs[0], false);
}

// ---------- Contact: compose an email, store nothing ----------

const CONTACT_EMAIL = "vamshidharreddye@gmail.com";

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  const email = document.getElementById("f-email");
  const emailError = document.getElementById("f-email-error");
  const interest = document.getElementById("f-interest");

  // Buttons that lead to the form preselect what the visitor is asking about.
  document.querySelectorAll("[data-interest]").forEach((link) => {
    link.addEventListener("click", () => {
      interest.value = link.getAttribute("data-interest");
    });
  });

  email.addEventListener("input", () => {
    if (email.validity.valid) {
      email.removeAttribute("aria-invalid");
      emailError.hidden = true;
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!email.value.trim() || !email.validity.valid) {
      email.setAttribute("aria-invalid", "true");
      email.setAttribute("aria-describedby", "f-email-error");
      emailError.textContent = email.value.trim()
        ? "This doesn't look like an email address. Check it and try again."
        : "Enter an email address so we can reply.";
      emailError.hidden = false;
      email.focus();
      return;
    }

    const data = new FormData(form);
    const subject = `SimProof: ${data.get("interest")}`;
    const body = [
      `Email: ${data.get("email")}`,
      `Company: ${data.get("company") || "-"}`,
      `Main solver: ${data.get("solver")}`,
      `Interested in: ${data.get("interest")}`,
      "",
      data.get("message") || "",
    ].join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = `Your email app should now be open with the request filled in. If nothing opened, write to ${CONTACT_EMAIL}.`;
  });
}

// ---------- Copy ----------

function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(btn.getAttribute("data-copy"));
        btn.textContent = "Copied";
      } catch {
        btn.textContent = "Copy failed";
      }
      setTimeout(() => { btn.textContent = original; }, 1600);
    });
  });
}
