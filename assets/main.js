/* ============================================================
   Misafir — shared interactions
   All motion is reduced-motion safe.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---- nav: condense on scroll + scroll-progress bar ---- */
  var nav = document.querySelector("nav");
  if (nav) {
    var bar = document.createElement("div");
    bar.className = "nav-progress";
    nav.appendChild(bar);
    var onScroll = function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      nav.classList.toggle("scrolled", y > 12);
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
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
        links.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- highlight current page in nav ---- */
  var here = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a[data-page]").forEach(function (a) {
    if (a.getAttribute("data-page") === here) a.classList.add("active");
  });

  /* ---- multilingual welcome rotator ---- */
  var el = document.getElementById("welcome");
  if (el) {
    var words = [
      ["Hoş geldiniz", "Turkish"], ["Welcome", "English"], ["Willkommen", "German"],
      ["Benvenuti", "Italian"], ["Bienvenue", "French"], ["Καλώς ήρθατε", "Greek"],
      ["Bienvenidos", "Spanish"]
    ];
    var tagEl = document.querySelector(".welcome-tag[data-dynamic]");
    if (!reduce) {
      var wi = 0;
      setInterval(function () {
        el.style.opacity = 0; el.style.transform = "translateY(8px)"; el.style.filter = "blur(4px)";
        setTimeout(function () {
          wi = (wi + 1) % words.length;
          el.textContent = words[wi][0];
          if (tagEl) tagEl.textContent = "— in " + words[wi][1] + ", and many more";
          el.style.opacity = 1; el.style.transform = "none"; el.style.filter = "none";
        }, 420);
      }, 2700);
    }
  }

  /* ---- pointer-reactive glow in hero ---- */
  var hero = document.querySelector(".hero");
  if (hero && !reduce && window.matchMedia("(pointer:fine)").matches) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      hero.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    });
  }

  /* ---- hero ember particles ---- */
  if (hero && !reduce) {
    var canvas = document.createElement("canvas");
    canvas.className = "hero-canvas";
    canvas.setAttribute("aria-hidden", "true");
    hero.insertBefore(canvas, hero.firstChild);
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, parts = [];
    var resize = function () {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    var N = Math.round(Math.min(34, W / 32));
    for (var i = 0; i < N; i++) {
      parts.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.6 + 0.5,
        s: Math.random() * 0.28 + 0.06,
        a: Math.random() * 0.5 + 0.15,
        d: Math.random() * Math.PI * 2
      });
    }
    var running = true;
    var draw = function () {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var j = 0; j < parts.length; j++) {
        var p = parts[j];
        p.y -= p.s; p.d += 0.01; p.x += Math.sin(p.d) * 0.18;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(228,190,115," + p.a + ")";
        ctx.shadowColor = "rgba(228,190,115,0.8)";
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) requestAnimationFrame(draw);
    });
  }

  /* ---- channel marquee: duplicate track for seamless loop ---- */
  var track = document.querySelector(".marquee-track");
  if (track && !reduce) {
    track.innerHTML = track.innerHTML + track.innerHTML;
  } else if (track) {
    track.style.animation = "none";
    track.style.justifyContent = "center";
    track.style.width = "100%";
  }

  /* ---- scroll reveal ---- */
  var revs = document.querySelectorAll(".reveal");
  if (revs.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revs.forEach(function (r) { r.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px 80px 0px" });
      revs.forEach(function (r) { io.observe(r); });
    }
  }

  /* ---- animated count-up for stats ---- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var node = e.target; cio.unobserve(node);
        var target = parseFloat(node.getAttribute("data-count"));
        var suffix = node.getAttribute("data-suffix") || "";
        var prefix = node.getAttribute("data-prefix") || "";
        var dec = (target % 1 !== 0) ? 1 : 0;
        if (reduce) { node.textContent = prefix + target.toFixed(dec) + suffix; return; }
        var start = null, dur = 1100;
        var tick = function (ts) {
          if (!start) start = ts;
          var pr = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - pr, 3);
          node.textContent = prefix + (target * eased).toFixed(dec) + suffix;
          if (pr < 1) requestAnimationFrame(tick);
          else node.textContent = prefix + target.toFixed(dec) + suffix;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ============================================================
     Interactive "see it work" demo
     A guest message comes in → Misafir reads it → types a reply
     in the same language → waits for approval. Loops through
     scenarios in several languages.
     ============================================================ */
  var demoRoot = document.querySelector("[data-demo]");
  if (demoRoot) {
    var SCENES = [
      {
        channel: "Google review", name: "Mehmet K.", initial: "M", meta: "★☆☆☆☆ · By the Sea",
        incoming: "Manzara güzeldi ama servis çok yavaştı, bir saat bekledik. Hayal kırıklığı.",
        lang: "Turkish", intent: "Complaint", sentiment: "Negative", tone: "neg",
        replyLang: "Turkish",
        reply: "Merhaba Mehmet Bey, ilginiz için teşekkür ederiz. Manzaramızı beğenmenize sevindik — fakat bir saat beklemenize çok üzüldük, bu bizim standardımız değil. Ekibimizle paylaştık ve bir sonraki ziyaretinizde telafi etmek isteriz."
      },
      {
        channel: "Email · Inbox", name: "Press · Der Feinschmecker", initial: "D", meta: "Anna Vogel · journalist",
        incoming: "Guten Tag, ich schreibe für Der Feinschmecker und plane ein Feature über die Ägäisküste. Hätten Sie diese Woche Zeit für ein kurzes Interview?",
        lang: "German", intent: "Press", sentiment: "High value", tone: "pos",
        replyLang: "German",
        reply: "Guten Tag Frau Vogel, vielen Dank für Ihr Interesse an unserem Haus. Über ein Feature würden wir uns sehr freuen — Donnerstag oder Freitag würde uns gut passen. Sagen Sie uns einfach, was Ihnen lieber ist."
      },
      {
        channel: "WhatsApp Business", name: "Sophie L.", initial: "S", meta: "+44 · new enquiry",
        incoming: "Hi! Do you have room for a party of 12 this Friday around 8pm? It's for a birthday 🎉",
        lang: "English", intent: "Large group", sentiment: "Booking", tone: "pos",
        replyLang: "English",
        reply: "Hi Sophie! A birthday for 12 sounds wonderful — yes, we can host you this Friday at 8. I'll pencil in the terrace and note it's a celebration. Could you confirm the final headcount by Thursday so we set the table just right?"
      },
      {
        channel: "Google review", name: "Giulia R.", initial: "G", meta: "★★★★★ · Gaia Bazaar",
        incoming: "Cena meravigliosa e vista mozzafiato al tramonto. Il personale è stato gentilissimo. Torneremo sicuramente!",
        lang: "Italian", intent: "Praise", sentiment: "Positive", tone: "pos",
        replyLang: "Italian",
        reply: "Grazie di cuore, Giulia! Siamo felicissimi che il tramonto e la nostra cucina vi abbiano conquistati. Il nostro team sarà lieto di leggere le vostre parole — vi aspettiamo presto per un altro tramonto insieme."
      }
    ];

    var demoSection = demoRoot.closest("section") || demoRoot.parentElement;
    var q = function (k) { return demoRoot.querySelector('[data-d="' + k + '"]'); };
    var btns = demoSection.querySelectorAll(".demo-langs button[data-pick]");
    var approveBtn = q("approve");
    var pbar = demoSection.querySelector('[data-d="bar"]');
    var gen = 0;          // generation token to cancel stale timers
    var autoIdx = 0;
    var manualHold = false;

    var sleep = function (ms, g) {
      return new Promise(function (res) {
        var id = setTimeout(function () { if (g === gen) res(); }, ms);
        if (g !== gen) clearTimeout(id);
      });
    };

    var setText = function (k, v) { var n = q(k); if (n) n.textContent = v; };

    var setActiveBtn = function (idx) {
      btns.forEach(function (b) {
        b.classList.toggle("active", parseInt(b.getAttribute("data-pick"), 10) === idx);
      });
    };

    var typewrite = function (node, text, g) {
      return new Promise(function (res) {
        node.textContent = "";
        var caret = document.createElement("span");
        caret.className = "caret";
        node.appendChild(caret);
        var i = 0;
        var step = function () {
          if (g !== gen) return;
          if (i <= text.length) {
            caret.insertAdjacentText("beforebegin", text.charAt(i - 1) || "");
            i++;
            setTimeout(step, 18 + Math.random() * 26);
          } else {
            if (caret.parentNode) caret.parentNode.removeChild(caret);
            res();
          }
        };
        step();
      });
    };

    function fillStatic(s) {
      setText("channel", s.channel); setText("name", s.name); setText("initial", s.initial);
      setText("meta", s.meta); setText("incoming", s.incoming); setText("replylang", s.replyLang);
      var lang = q("lang"), intent = q("intent"), senti = q("sentiment");
      if (lang) lang.textContent = s.lang;
      if (intent) intent.textContent = s.intent;
      if (senti) { senti.textContent = s.sentiment; senti.classList.toggle("neg", s.tone === "neg"); }
    }

    function showTags(on) {
      ["lang", "intent", "sentiment"].forEach(function (k) {
        var n = q(k); if (n) n.classList.toggle("in", on);
      });
    }

    function resetApprove() {
      if (!approveBtn) return;
      approveBtn.classList.remove("done");
      approveBtn.innerHTML = "Approve &amp; send";
      approveBtn.disabled = false;
    }

    async function play(idx) {
      gen++; var g = gen;
      autoIdx = idx;
      setActiveBtn(idx);
      var s = SCENES[idx];
      // reset
      showTags(false);
      resetApprove();
      setText("draftstate", "reading…");
      setText("flow", "reads it");
      if (pbar) { pbar.style.transition = "none"; pbar.style.width = "0%"; }
      var reply = q("reply"); if (reply) reply.textContent = "";
      fillStatic(s);

      if (reduce) {
        // static: show everything resolved, no loop
        showTags(true);
        if (reply) reply.textContent = s.reply;
        setText("draftstate", "ready · awaiting you");
        return;
      }

      await sleep(450, g); if (g !== gen) return;
      // reveal tags one by one
      var lang = q("lang"); if (lang) lang.classList.add("in");
      await sleep(220, g); if (g !== gen) return;
      var intent = q("intent"); if (intent) intent.classList.add("in");
      await sleep(220, g); if (g !== gen) return;
      var senti = q("sentiment"); if (senti) senti.classList.add("in");
      await sleep(360, g); if (g !== gen) return;

      setText("flow", "drafting…");
      setText("draftstate", "drafting…");
      await sleep(260, g); if (g !== gen) return;
      if (reply) await typewrite(reply, s.reply, g);
      if (g !== gen) return;

      setText("flow", "ready");
      setText("draftstate", "ready · awaiting you");

      // dwell, fill progress bar, then advance (unless held by manual pick/approve)
      if (pbar) {
        await sleep(40, g); if (g !== gen) return;
        pbar.style.transition = "width 4.2s linear";
        pbar.style.width = "100%";
      }
      await sleep(4400, g); if (g !== gen) return;
      if (manualHold) { manualHold = false; return; }
      play((idx + 1) % SCENES.length);
    }

    // language buttons
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var idx = parseInt(b.getAttribute("data-pick"), 10) || 0;
        manualHold = false;
        play(idx);
      });
    });

    // approve interaction
    if (approveBtn) {
      approveBtn.addEventListener("click", function () {
        if (approveBtn.classList.contains("done")) return;
        approveBtn.classList.add("done");
        approveBtn.innerHTML = "✓ Sent — with your ok";
        setText("draftstate", "approved & sent");
        manualHold = true;
        gen++; var g = gen;            // cancel pending auto-advance
        if (pbar) { pbar.style.transition = "none"; pbar.style.width = "0%"; }
        setTimeout(function () {
          if (g !== gen) return;
          manualHold = false;
          play((autoIdx + 1) % SCENES.length);
        }, 1400);
      });
    }

    // start when scrolled into view; pause logic via gen when leaving
    var started = false;
    if ("IntersectionObserver" in window && !reduce) {
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) { started = true; play(0); }
        });
      }, { threshold: 0.3 });
      dio.observe(demoRoot);
    } else {
      play(0);
    }
  }

  /* ============================================================
     Contact form: sends immediately, no email client, no backend.
     Posts to FormSubmit; destination assembled at runtime from a
     base64 string so it never appears as plain text in the source.
     ============================================================ */
  var form = document.getElementById("contact-form");
  if (form) {
    var dest;
    try { dest = window.atob("YWxwLnNpc21hbkBnbWFpbC5jb20="); } catch (e) { dest = ""; }
    var endpoint = "https://formsubmit.co/ajax/" + dest;
    var status = document.getElementById("form-status");
    var btn = form.querySelector("button[type=submit]");
    var btnLabel = btn ? btn.innerHTML : "";

    var setStatus = function (msg, ok) {
      if (!status) return;
      status.className = "form-status ok" + (ok ? "" : " warn");
      status.textContent = msg;
    };

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = new FormData(form);
      var venue = (data.get("venue") || "").toString().trim();
      data.append("_subject", "New pilot enquiry — " + (venue || "Misafir"));
      data.append("_template", "table");
      data.append("_captcha", "false");

      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
      setStatus("Sending…", true);

      fetch(endpoint, { method: "POST", headers: { "Accept": "application/json" }, body: data })
        .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json().catch(function () { return {}; }); })
        .then(function () {
          form.reset();
          setStatus("Thank you — your message is on its way. We'll be in touch shortly.", true);
        })
        .catch(function () {
          setStatus("Sorry, that didn't send. Please try again in a moment.", false);
        })
        .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = btnLabel; } });
    });
  }

  /* ---- current year in footers ---- */
  document.querySelectorAll("[data-year]").forEach(function (n) {
    n.textContent = new Date().getFullYear();
  });
})();
