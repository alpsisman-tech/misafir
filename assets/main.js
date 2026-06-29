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

  /* ---- contact form (mailto-based, no backend needed) ---- */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var venue = (data.get("venue") || "").toString().trim();
      var venues = (data.get("venues") || "").toString().trim();
      var tier = (data.get("tier") || "").toString().trim();
      var email = (data.get("email") || "").toString().trim();
      var message = (data.get("message") || "").toString().trim();

      var subject = "Pilot enquiry — " + (venue || name || "Misafir");
      var bodyLines = [
        "Name: " + name,
        "Venue / group: " + venue,
        "Number of venues: " + venues,
        "Interested in: " + tier,
        "Email: " + email,
        "",
        message
      ];
      var href = "mailto:hello@misafir.app" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      var status = document.getElementById("form-status");
      if (status) {
        status.classList.add("ok");
        status.textContent = "Opening your email app to send this to hello@misafir.app. If nothing happens, write to us there directly.";
      }
      window.location.href = href;
    });
  }

  /* ---- current year in footers ---- */
  document.querySelectorAll("[data-year]").forEach(function (n) {
    n.textContent = new Date().getFullYear();
  });
})();
