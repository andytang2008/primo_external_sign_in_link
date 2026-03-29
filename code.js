//The JavaScript code to make https://csu-chico.primo.exlibrisgroup.com/discovery/search?vid=01CALS_CHI:01CALS_CHI&openLogin=1 working in dark scheme.  Andy 03-2026
(function () {
  "use strict";

  function hasOpenLoginParam() {
    try {
      return new URLSearchParams(window.location.search).get("openLogin") === "1";
    } catch (e) {
      return false;
    }
  }

  function clickSignInIfPresent() {
    // Try multiple selectors (Primo can re-render / ids can change)
    var btn =
      document.querySelector("#signInBtn") ||
      document.querySelector("button#signInBtn") ||
      document.querySelector("button.user-button.sign-in-btn-ctm") ||
      document.querySelector("button[aria-label='Sign In']");

    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  }

  function run() {
    if (!hasOpenLoginParam()) return;

    // Prevent repeated triggering if Primo re-renders
    if (window.sessionStorage.getItem("primo_openLogin_clicked") === "1") return;

    // 1) Try immediately
    if (clickSignInIfPresent()) {
      window.sessionStorage.setItem("primo_openLogin_clicked", "1");
      return;
    }

    // 2) Observe DOM changes until the button appears
    var obs = new MutationObserver(function () {
      if (clickSignInIfPresent()) {
        window.sessionStorage.setItem("primo_openLogin_clicked", "1");
        obs.disconnect();
      }
    });

    obs.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });

    // 3) Safety stop after 60s (so we don’t observe forever)
    setTimeout(function () {
      try { obs.disconnect(); } catch (e) {}
    }, 60000);
  }

  // Run after DOM is at least available
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();