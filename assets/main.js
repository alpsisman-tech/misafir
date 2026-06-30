/* ============================================================
   Misafir — shared interactions  ·  design v2
   Reduced-motion safe throughout.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---- nav: condense on scroll ---- */
  var nav = document.querySelector("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", (window.scrollY || 0) > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- mobile menu ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open"); toggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- highlight current page ---- */
  var here = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a[data-page]").forEach(function (a) {
    if (a.getAttribute("data-page") === here) a.classList.add("active");
  });

  /* ---- multilingual welcome rotator ---- */
  var el = document.getElementById("welcome");
  if (el && !reduce) {
    var words = [
      ["Hoş geldiniz", "Turkish"], ["Welcome", "English"], ["Willkommen", "German"],
      ["Benvenuti", "Italian"], ["Bienvenue", "French"], ["Καλώς ήρθατε", "Greek"]
    ];
    var tagEl = document.querySelector(".welcome-tag[data-dynamic]");
    var wi = 0;
    setInterval(function () {
      el.style.opacity = 0; el.style.transform = "translateY(7px)"; el.style.filter = "blur(3px)";
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        el.textContent = words[wi][0];
        if (tagEl) tagEl.textContent = "— in " + words[wi][1] + ", and more";
        el.style.opacity = 1; el.style.transform = "none"; el.style.filter = "none";
      }, 420);
    }, 2700);
  }

  /* ---- bento: cycling greetings tile ---- */
  var cyc = document.querySelector("[data-cycle]");
  if (cyc && !reduce) {
    var cflag = document.querySelector("[data-cycle-flag]");
    var greet = [
      ["🇹🇷", "Hoş geldiniz"], ["🇬🇧", "Welcome"], ["🇩🇪", "Willkommen"],
      ["🇮🇹", "Benvenuti"], ["🇫🇷", "Bienvenue"], ["🇬🇷", "Καλώς ήρθατε"], ["🇪🇸", "Bienvenidos"]
    ];
    var ci = 0;
    setInterval(function () {
      cyc.style.opacity = 0; cyc.style.transform = "translateY(6px)";
      setTimeout(function () {
        ci = (ci + 1) % greet.length;
        cyc.textContent = greet[ci][1];
        if (cflag) cflag.textContent = greet[ci][0];
        cyc.style.opacity = 1; cyc.style.transform = "none";
      }, 380);
    }, 2200);
  }

  /* ---- hero live ticker ---- */
  var tick = document.querySelector("[data-ticker]");
  if (tick && !reduce) {
    var jobs = [
      "drafting a reply to a Turkish review",
      "answering a German press enquiry",
      "confirming an English booking for 12",
      "writing an Italian thank-you note",
      "flagging a 1★ review for you",
      "queuing this week's Instagram captions"
    ];
    var ti = 0;
    setInterval(function () {
      tick.style.opacity = 0; tick.style.transform = "translateY(5px)";
      setTimeout(function () {
        ti = (ti + 1) % jobs.length;
        tick.textContent = jobs[ti];
        tick.style.opacity = 1; tick.style.transform = "none";
      }, 350);
    }, 2600);
  }

  /* ---- hero parallax (pointer + scroll), gentle ---- */
  var heroVisual = document.querySelector(".hero-visual");
  if (heroVisual && !reduce && window.matchMedia("(pointer:fine)").matches) {
    var hero = document.querySelector(".hero");
    var px = 0, py = 0, tx = 0, ty = 0, raf = null;
    var loop = function () {
      tx += (px - tx) * 0.08; ty += (py - ty) * 0.08;
      heroVisual.style.transform = "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0)";
      if (Math.abs(px - tx) > 0.1 || Math.abs(py - ty) > 0.1) raf = requestAnimationFrame(loop);
      else raf = null;
    };
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 16;
      py = ((e.clientY - r.top) / r.height - 0.5) * 12;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener("pointerleave", function () { px = 0; py = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* ---- channel marquee ---- */
  var track = document.querySelector(".marquee-track");
  if (track && !reduce) { track.innerHTML = track.innerHTML + track.innerHTML; }
  else if (track) { track.style.animation = "none"; track.style.justifyContent = "center"; track.style.width = "100%"; }

  /* ---- scroll reveal ---- */
  var revs = document.querySelectorAll(".reveal");
  if (revs.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revs.forEach(function (r) { r.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.08, rootMargin: "0px 0px 70px 0px" });
      revs.forEach(function (r) { io.observe(r); });
    }
  }

  /* ---- stat count-up ---- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var node = e.target; cio.unobserve(node);
        var target = parseFloat(node.getAttribute("data-count"));
        var suffix = node.getAttribute("data-suffix") || "", prefix = node.getAttribute("data-prefix") || "";
        var dec = (target % 1 !== 0) ? 1 : 0;
        if (reduce) { node.textContent = prefix + target.toFixed(dec) + suffix; return; }
        var start = null;
        var tick = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1100, 1), eased = 1 - Math.pow(1 - p, 3);
          node.textContent = prefix + (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(tick); else node.textContent = prefix + target.toFixed(dec) + suffix;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---- bento: rolling star fill ---- */
  var starsViz = document.querySelector(".stars");
  if (starsViz && !reduce) {
    var sps = starsViz.querySelectorAll("span"), si = 0;
    setInterval(function () {
      sps.forEach(function (s, k) { s.classList.toggle("lit", k <= si); });
      si = (si + 1) % (sps.length + 1);
    }, 600);
  } else if (starsViz) {
    starsViz.querySelectorAll("span").forEach(function (s) { s.classList.add("lit"); });
  }

  /* ---- 3D tilt on cards ---- */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".tile, .mcard, .tier, .aud-card").forEach(function (card) {
      card.classList.add("tilt");
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(820px) rotateX(" + (-py * 4.5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg) translateY(-5px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  /* ---- restaurants / hotels audience toggle ---- */
  var audBtns = document.querySelectorAll(".aud button[data-aud]");
  if (audBtns.length) {
    audBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-aud");
        audBtns.forEach(function (x) { x.classList.toggle("on", x === b); });
        document.querySelectorAll(".aud-panel").forEach(function (p) {
          p.classList.toggle("show", p.getAttribute("data-panel") === k);
        });
      });
    });
  }

  /* ============================================================
     Interactive "see it work" demo
     ============================================================ */
  var demoRoot = document.querySelector("[data-demo]");
  if (demoRoot) {
    var SCENES = [
      { channel: "Google review", name: "Mehmet K.", initial: "M", meta: "★☆☆☆☆ · The Marina",
        incoming: "Manzara güzeldi ama servis çok yavaştı, bir saat bekledik. Hayal kırıklığı.",
        lang: "Turkish", intent: "Complaint", sentiment: "Negative", tone: "neg", replyLang: "Turkish",
        reply: "Merhaba Mehmet Bey, ilginiz için teşekkür ederiz. Manzaramızı beğenmenize sevindik — fakat bir saat beklemenize çok üzüldük, bu bizim standardımız değil. Ekibimizle paylaştık ve bir sonraki ziyaretinizde telafi etmek isteriz." },
      { channel: "Email · Inbox", name: "A food magazine", initial: "F", meta: "Anna Vogel · journalist",
        incoming: "Guten Tag, ich schreibe für ein Gourmet-Magazin und plane ein Feature über die Ägäisküste. Hätten Sie diese Woche Zeit für ein kurzes Interview?",
        lang: "German", intent: "Press", sentiment: "High value", tone: "pos", replyLang: "German",
        reply: "Guten Tag Frau Vogel, vielen Dank für Ihr Interesse an unserem Haus. Über ein Feature würden wir uns sehr freuen — Donnerstag oder Freitag würde uns gut passen. Sagen Sie uns einfach, was Ihnen lieber ist." },
      { channel: "WhatsApp · Hotel", name: "Sophie L.", initial: "S", meta: "+44 · Room 214",
        incoming: "Hi! Could we get a late checkout on Sunday, and a taxi to the airport around 2pm?",
        lang: "English", intent: "Concierge", sentiment: "In-stay", tone: "pos", replyLang: "English",
        reply: "Hi Sophie! Happy to help — late checkout until 2pm is set for Room 214, and I've arranged a taxi to the airport for 14:00 on Sunday. Anything else to make your last day with us easier?" },
      { channel: "Booking.com review", name: "Giulia R.", initial: "G", meta: "★★★★★ · The Marina",
        incoming: "Camera spaziosa con una vista mozzafiato sul mare. Personale gentilissimo e colazione deliziosa. Torneremo di sicuro!",
        lang: "Italian", intent: "Praise", sentiment: "Positive", tone: "pos", replyLang: "Italian",
        reply: "Grazie di cuore, Giulia! Siamo felicissimi che la vista sul mare e la colazione vi abbiano conquistati. Il nostro team vi aspetta con piacere per il vostro prossimo soggiorno — a presto!" }
    ];
    var demoSection = demoRoot.closest("section") || demoRoot.parentElement;
    var q = function (k) { return demoRoot.querySelector('[data-d="' + k + '"]'); };
    var btns = demoSection.querySelectorAll(".demo-langs button[data-pick]");
    var approveBtn = q("approve");
    var pbar = demoSection.querySelector('[data-d="bar"]');
    var gen = 0, autoIdx = 0, manualHold = false;

    var sleep = function (ms, g) { return new Promise(function (res) { var id = setTimeout(function () { if (g === gen) res(); }, ms); if (g !== gen) clearTimeout(id); }); };
    var setText = function (k, v) { var n = q(k); if (n) n.textContent = v; };
    var setActiveBtn = function (idx) { btns.forEach(function (b) { b.classList.toggle("active", parseInt(b.getAttribute("data-pick"), 10) === idx); }); };

    var typewrite = function (node, text, g) {
      return new Promise(function (res) {
        node.textContent = "";
        var caret = document.createElement("span"); caret.className = "caret"; node.appendChild(caret);
        var i = 0;
        var step = function () {
          if (g !== gen) return;
          if (i <= text.length) { caret.insertAdjacentText("beforebegin", text.charAt(i - 1) || ""); i++; setTimeout(step, 17 + Math.random() * 24); }
          else { if (caret.parentNode) caret.parentNode.removeChild(caret); res(); }
        };
        step();
      });
    };
    var showTags = function (on) { ["lang", "intent", "sentiment"].forEach(function (k) { var n = q(k); if (n) n.classList.toggle("in", on); }); };
    function fillStatic(s) {
      setText("channel", s.channel); setText("name", s.name); setText("initial", s.initial);
      setText("meta", s.meta); setText("incoming", s.incoming); setText("replylang", s.replyLang);
      var lang = q("lang"), intent = q("intent"), senti = q("sentiment");
      if (lang) lang.textContent = s.lang;
      if (intent) intent.textContent = s.intent;
      if (senti) { senti.textContent = s.sentiment; senti.classList.toggle("neg", s.tone === "neg"); }
    }
    function resetApprove() { if (!approveBtn) return; approveBtn.classList.remove("done"); approveBtn.innerHTML = "Approve &amp; send"; }

    async function play(idx) {
      gen++; var g = gen; autoIdx = idx; setActiveBtn(idx);
      var s = SCENES[idx];
      showTags(false); resetApprove();
      setText("draftstate", "reading…"); setText("flow", "reads it");
      if (pbar) { pbar.style.transition = "none"; pbar.style.width = "0%"; }
      var reply = q("reply"); if (reply) reply.textContent = "";
      fillStatic(s);
      if (reduce) { showTags(true); if (reply) reply.textContent = s.reply; setText("draftstate", "ready · awaiting you"); return; }

      await sleep(450, g); if (g !== gen) return;
      var lang = q("lang"); if (lang) lang.classList.add("in");
      await sleep(220, g); if (g !== gen) return;
      var intent = q("intent"); if (intent) intent.classList.add("in");
      await sleep(220, g); if (g !== gen) return;
      var senti = q("sentiment"); if (senti) senti.classList.add("in");
      await sleep(360, g); if (g !== gen) return;
      setText("flow", "drafting…"); setText("draftstate", "drafting…");
      await sleep(260, g); if (g !== gen) return;
      if (reply) await typewrite(reply, s.reply, g);
      if (g !== gen) return;
      setText("flow", "ready"); setText("draftstate", "ready · awaiting you");
      if (pbar) { await sleep(40, g); if (g !== gen) return; pbar.style.transition = "width 4.2s linear"; pbar.style.width = "100%"; }
      await sleep(4400, g); if (g !== gen) return;
      if (manualHold) { manualHold = false; return; }
      play((idx + 1) % SCENES.length);
    }

    btns.forEach(function (b) { b.addEventListener("click", function () { manualHold = false; play(parseInt(b.getAttribute("data-pick"), 10) || 0); }); });
    if (approveBtn) {
      approveBtn.addEventListener("click", function () {
        if (approveBtn.classList.contains("done")) return;
        approveBtn.classList.add("done"); approveBtn.innerHTML = "✓ Sent — with your ok";
        setText("draftstate", "approved & sent"); manualHold = true;
        gen++; var g = gen; if (pbar) { pbar.style.transition = "none"; pbar.style.width = "0%"; }
        setTimeout(function () { if (g !== gen) return; manualHold = false; play((autoIdx + 1) % SCENES.length); }, 1500);
      });
    }
    var started = false;
    if ("IntersectionObserver" in window && !reduce) {
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting && !started) { started = true; play(0); } });
      }, { threshold: 0.3 });
      dio.observe(demoRoot);
    } else { play(0); }
  }

  /* ============================================================
     Onboarding wizard
     ============================================================ */
  var wiz = document.getElementById("wizard");
  if (wiz) {
    var steps = Array.prototype.slice.call(wiz.querySelectorAll(".wiz-step"));
    var indicators = Array.prototype.slice.call(document.querySelectorAll(".wiz-steps .s"));
    var backBtn = document.getElementById("wiz-back");
    var nextBtn = document.getElementById("wiz-next");
    var submitBtn = document.getElementById("wiz-submit");
    var cur = 0;
    var scrollHost = wiz.closest("form") || wiz;

    var showStep = function (n, doScroll) {
      cur = n;
      steps.forEach(function (s, i) { s.classList.toggle("show", i === n); });
      indicators.forEach(function (ind, i) {
        ind.classList.toggle("active", i === n);
        ind.classList.toggle("done", i < n);
      });
      backBtn.style.visibility = n === 0 ? "hidden" : "visible";
      var last = n === steps.length - 1;
      nextBtn.style.display = last ? "none" : "inline-flex";
      submitBtn.style.display = last ? "inline-flex" : "none";
      if (last) buildReview();
      if (doScroll) scrollHost.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };

    var validateStep = function (n) {
      var ok = true;
      steps[n].querySelectorAll("input[required],select[required],textarea[required]").forEach(function (f) {
        var valid = f.value && f.value.trim() !== "";
        if (f.type === "email") valid = valid && /.+@.+\..+/.test(f.value);
        f.style.borderColor = valid ? "" : "var(--coral)";
        if (!valid && ok) { ok = false; f.focus(); }
      });
      return ok;
    };

    nextBtn.addEventListener("click", function () { if (validateStep(cur)) showStep(Math.min(cur + 1, steps.length - 1), true); });
    backBtn.addEventListener("click", function () { showStep(Math.max(cur - 1, 0), true); });
    indicators.forEach(function (ind, i) {
      ind.addEventListener("click", function () { if (i < cur) showStep(i, true); });
      ind.style.cursor = "pointer";
    });

    /* checkbox tiles */
    wiz.querySelectorAll(".check input").forEach(function (cb) {
      var sync = function () { cb.closest(".check").classList.toggle("on", cb.checked); };
      cb.addEventListener("change", sync); sync();
    });

    /* add / remove venue */
    var venueWrap = document.getElementById("venues-wrap");
    var addBtn = document.getElementById("add-venue");
    var vCount = 0;
    var addVenue = function (focus) {
      vCount++;
      var div = document.createElement("div");
      div.className = "repeat-venue";
      div.innerHTML =
        '<button type="button" class="rm" aria-label="Remove venue">×</button>' +
        '<div class="form-grid">' +
        '<div class="field"><label>Venue name</label><input type="text" name="venue_' + vCount + '_name" data-label="Venue name" placeholder="The Marina"></div>' +
        '<div class="field"><label>City / area</label><input type="text" name="venue_' + vCount + '_city" data-label="City" placeholder="Bodrum"></div>' +
        '<div class="field full"><label>Google Maps or Business Profile link <span class="hint">so we can read its reviews</span></label><input type="url" name="venue_' + vCount + '_google" data-label="Google link" placeholder="https://maps.google.com/..."></div>' +
        '</div>';
      venueWrap.insertBefore(div, addBtn);
      div.querySelector(".rm").addEventListener("click", function () { div.remove(); });
      if (focus) { var inp = div.querySelector("input"); if (inp) inp.focus(); }
    };
    if (venueWrap && addBtn) { addVenue(false); addBtn.addEventListener("click", function () { addVenue(true); }); }

    /* review */
    var form = document.getElementById("wizard-form");
    function buildReview() {
      var box = document.getElementById("review-box");
      if (!box) return;
      box.innerHTML = "";
      var seenVenues = {};
      form.querySelectorAll("[data-label]").forEach(function (f) {
        var val = (f.type === "checkbox") ? (f.checked ? "Yes" : "") : (f.value || "").trim();
        if (!val) return;
        var label = f.getAttribute("data-label");
        var name = f.getAttribute("name") || "";
        var m = name.match(/^venue_(\d+)_/);
        if (m) {
          var vi = m[1];
          seenVenues[vi] = seenVenues[vi] || {};
          seenVenues[vi][label] = val;
          return;
        }
        addRow(box, label, val);
      });
      Object.keys(seenVenues).forEach(function (vi, idx) {
        var parts = [];
        Object.keys(seenVenues[vi]).forEach(function (k) { parts.push(seenVenues[vi][k]); });
        addRow(box, "Venue " + (idx + 1), parts.join(" · "));
      });
      // collected channels (checkboxes)
      var chans = [];
      form.querySelectorAll('.check input:checked').forEach(function (c) { chans.push(c.getAttribute("data-chan") || c.value); });
      if (chans.length) addRow(box, "Channels", chans.join(", "));
    }
    function addRow(box, k, v) {
      var row = document.createElement("div"); row.className = "rrow";
      var kk = document.createElement("div"); kk.className = "rk"; kk.textContent = k;
      var vv = document.createElement("div"); vv.className = "rv"; vv.textContent = v;
      row.appendChild(kk); row.appendChild(vv); box.appendChild(row);
    }

    showStep(0, false);
  }

  /* ============================================================
     Form submit (contact + onboarding) → FormSubmit, no backend.
     Destination assembled at runtime from base64 so it is never
     plain text in the source.
     ============================================================ */
  /* ----------------------------------------------------------------
     Email delivery key.
     PASTE A FREE WEB3FORMS ACCESS KEY HERE to make every form deliver
     instantly and reliably (no per-form activation, your address stays
     hidden). Get one in ~30s — no signup: go to https://web3forms.com,
     enter alp.sisman@gmail.com, and copy the access key it emails you.
     While this is blank, forms fall back to FormSubmit (which needs each
     form activated once via its confirmation email).
     ---------------------------------------------------------------- */
  var WEB3FORMS_KEY = "7cb17fae-2d54-4bb1-bd2f-1a5f532d4593";

  function wireForm(formId, statusId, subjectPrefix) {
    var form = document.getElementById(formId);
    if (!form) return;
    var status = document.getElementById(statusId);
    var btn = form.querySelector("[type=submit]");
    var btnLabel = btn ? btn.innerHTML : "";
    var setStatus = function (msg, ok) { if (!status) return; status.className = "form-status " + (ok ? "ok" : "warn"); status.textContent = msg; };

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = new FormData(form);
      var who = (data.get("venue") || data.get("group") || data.get("name") || "Misafir").toString().trim();
      var endpoint;

      if (WEB3FORMS_KEY) {
        endpoint = "https://api.web3forms.com/submit";
        data.append("access_key", WEB3FORMS_KEY);
        data.append("subject", subjectPrefix + " — " + who);
        data.append("from_name", "Misafir website");
      } else {
        var dest; try { dest = window.atob("YWxwLnNpc21hbkBnbWFpbC5jb20="); } catch (e) { dest = ""; }
        endpoint = "https://formsubmit.co/ajax/" + dest;
        data.append("_subject", subjectPrefix + " — " + who);
        data.append("_template", "table");
        data.append("_captcha", "false");
      }

      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
      setStatus("Sending…", true);

      fetch(endpoint, { method: "POST", headers: { "Accept": "application/json" }, body: data })
        .then(function (r) { return r.json().catch(function () { return r.ok ? { success: true } : { success: false }; }); })
        .then(function (j) {
          // Honour the service's own success flag (FormSubmit/Web3Forms return
          // success:false when a submission is rejected or pending activation).
          var ok = j && (j.success === true || j.success === "true");
          if (!ok) throw new Error((j && (j.message || j.error)) || "not delivered");
          form.reset();
          document.querySelectorAll(".check.on").forEach(function (c) { c.classList.remove("on"); });
          setStatus(form.getAttribute("data-success") || "Thank you — your details are on their way. We'll be in touch shortly.", true);
        })
        .catch(function () { setStatus("Hmm — that didn't go through. Please try again in a moment.", false); })
        .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = btnLabel; } });
    });
  }
  wireForm("contact-form", "form-status", "New pilot enquiry");
  wireForm("wizard-form", "wiz-status", "Onboarding details");

  /* ---- year ---- */
  document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
})();
