/* ============================================================
   Misafir — shared interactions
   All motion is reduced-motion safe.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* mark JS available so reveal-hiding only applies when we can un-hide */
  document.documentElement.classList.add("js");

  /* ---- nav: condense on scroll ---- */
  var nav = document.querySelector("nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 12) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
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
      ["Hoş geldiniz", "Turkish"],
      ["Welcome", "English"],
      ["Willkommen", "German"],
      ["Benvenuti", "Italian"],
      ["Bienvenue", "French"],
      ["Καλώς ήρθατε", "Greek"],
      ["Bienvenidos", "Spanish"]
    ];
    var tagEl = document.querySelector(".welcome-tag[data-dynamic]");
    if (!reduce) {
      var i = 0;
      setInterval(function () {
        el.style.opacity = 0;
        el.style.transform = "translateY(6px)";
        setTimeout(function () {
          i = (i + 1) % words.length;
          el.textContent = words[i][0];
          if (tagEl) tagEl.textContent = "— in " + words[i][1] + ", and many more";
          el.style.opacity = 1;
          el.style.transform = "none";
        }, 420);
      }, 2600);
    }
  }

  /* ---- scroll reveal ---- */
  var revs = document.querySelectorAll(".reveal");
  if (revs.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revs.forEach(function (r) { r.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
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
        var node = e.target;
        cio.unobserve(node);
        var target = parseFloat(node.getAttribute("data-count"));
        var suffix = node.getAttribute("data-suffix") || "";
        var prefix = node.getAttribute("data-prefix") || "";
        var dec = (target % 1 !== 0) ? 1 : 0;
        if (reduce) { node.textContent = prefix + target.toFixed(dec) + suffix; return; }
        var start = null, dur = 1100;
        var tick = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          node.textContent = prefix + (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else node.textContent = prefix + target.toFixed(dec) + suffix;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---- contact form: sends immediately, no email client, no backend code ----
     Posts straight to FormSubmit (https://formsubmit.co) over AJAX. The
     destination address is assembled at runtime from a base64 string so it
     never appears as plain text in the page source. ---- */
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

      fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: data
      })
      .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json().catch(function () { return {}; }); })
      .then(function () {
        form.reset();
        setStatus("Thank you — your message is on its way. We'll be in touch shortly.", true);
      })
      .catch(function () {
        setStatus("Sorry, that didn't send. Please try again in a moment.", false);
      })
      .then(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = btnLabel; }
      });
    });
  }

  /* ---- current year in footers ---- */
  document.querySelectorAll("[data-year]").forEach(function (n) {
    n.textContent = new Date().getFullYear();
  });
})();
