/**
 * BTC 게임 ↔ 사이트 기록 브리지
 * 정적 게임(HTML)에서 얻은 점수를 사이트의 인지훈련 기록(localStorage)에 저장합니다.
 * 마이페이지 "최근 인지훈련 기록"에서 함께 표시됩니다.
 *
 * 저장 형식은 src/lib/storage.ts 의 TrainingRecord 와 동일해야 합니다.
 *   { id, createdAt, game, scoreLabel }
 */
(function () {
  var KEY = "btc_training_v1";

  function makeId(prefix) {
    return (
      prefix +
      "_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 8)
    );
  }

  /**
   * 사이트 기록에 한 건 추가
   * 1) 이 기기(localStorage)에 항상 저장
   * 2) 로그인 상태라면 서버에도 저장 → 다른 기기에서도 확인 가능
   */
  window.btcSaveTraining = function (game, scoreLabel, extra) {
    var saved = false;
    try {
      var raw = localStorage.getItem(KEY);
      var all = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(all)) all = [];
      all.unshift({
        id: makeId("training"),
        createdAt: new Date().toISOString(),
        game: String(game || "두뇌 게임"),
        scoreLabel: String(scoreLabel || ""),
      });
      localStorage.setItem(KEY, JSON.stringify(all.slice(0, 200)));
      saved = true;
    } catch (e) {
      /* 저장 공간이 없어도 게임 진행은 계속됩니다 */
    }

    // 서버 저장(로그인 시). 실패해도 게임에는 영향을 주지 않습니다.
    try {
      fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          gameType: String(game || "두뇌 게임"),
          score: (extra && Number(extra.score)) || 0,
          duration: (extra && Number(extra.duration)) || 0,
          resultJson: JSON.stringify({ label: String(scoreLabel || "") }),
        }),
      })
        .then(function (r) {
          showSavedToast(r.ok);
        })
        .catch(function () {
          showSavedToast(false);
        });
    } catch (e) {
      showSavedToast(false);
    }

    return saved;
  };

  /** 게임 이름: 문서 제목을 사용하되, 지정값이 있으면 우선 */
  window.btcGameName = function (fallback) {
    var t = (document.title || "").trim();
    return t || fallback || "두뇌 게임";
  };

  function showSavedToast(syncedToServer) {
    var prev = document.getElementById("btc-saved-toast");
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
    var d = document.createElement("div");
    d.id = "btc-saved-toast";
    d.textContent = syncedToServer
      ? "기록을 저장했습니다. 마이페이지에서 확인하세요."
      : "이 기기에 기록을 저장했습니다. 로그인하면 계정에도 보관됩니다.";
    d.style.cssText =
      "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);" +
      "background:#1e5944;color:#fff;padding:12px 18px;border-radius:9999px;" +
      "font-size:15px;font-weight:700;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,.2)";
    document.body.appendChild(d);
    setTimeout(function () {
      if (d.parentNode) d.parentNode.removeChild(d);
    }, 3000);
  }

  /** 게임 화면 상단에 사이트로 돌아가는 링크 추가 */
  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("btc-back-link")) return;
    var a = document.createElement("a");
    a.id = "btc-back-link";
    a.href = "/games";
    a.textContent = "← 게임 목록";
    a.style.cssText =
      "position:fixed;left:12px;top:12px;background:rgba(255,255,255,.94);" +
      "color:#1e5944;border:1px solid #b9dfcd;padding:8px 14px;border-radius:9999px;" +
      "font-size:14px;font-weight:700;text-decoration:none;z-index:99999";
    document.body.appendChild(a);
  });
})();
