// js/form-handler.js

(async function () {
  const PAGE_KEY = (() => {
    const p = (location.pathname || "").toLowerCase();
    if (p.includes("vision")) return "vision";
    if (p.includes("jp-memory")) return "jp-memory";
    return "memory";
  })();

  async function loadConfig() {
    const res = await fetch("/assets/js/fields-config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("fields-config.json 載入失敗: " + res.status);
    return await res.json();
  }

  function getEl(selector) {
    return document.querySelector(selector);
  }

  function getValue(form, field) {
    if (field.type === "radio" && field.valueFrom === "checked") {
      const checked = form.querySelector(`${field.selector}:checked`);
      return checked ? (checked.value || checked.id || "") : "";
    }
    const el = form.querySelector(field.selector);
    if (!el) return "";
    return (el.value || "").trim();
  }

  function validate(form, fields) {
    const errors = [];
    for (const f of fields) {
      const v = getValue(form, f);
      if (f.required && !v) errors.push(`「${f.label}」必填`);
      if (f.type === "email" && v) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(v)) errors.push(`「${f.label}」格式不正確`);
      }
      if (f.minLength && v && v.length < f.minLength) errors.push(`「${f.label}」至少 ${f.minLength} 字`);
      if (f.maxLength && v && v.length > f.maxLength) errors.push(`「${f.label}」最多 ${f.maxLength} 字`);
    }
    return errors;
  }

  function setSubmitting(btn, submitting) {
    if (!btn) return;
    btn.disabled = submitting;
    btn.dataset._oldText = btn.dataset._oldText || btn.textContent;
    btn.textContent = submitting ? "提交中…" : btn.dataset._oldText;
  }

  try {
    if (!window.db) {
      console.error("❌ Firestore(db) 未初始化，請確認 firebase-config.js 有先載入");
      return;
    }

    const cfg = await loadConfig();
    const pageCfg = cfg[PAGE_KEY];
    if (!pageCfg) {
      console.error("❌ 找不到頁面設定:", PAGE_KEY);
      return;
    }

    const form = getEl(pageCfg.formSelector);
    if (!form) {
      console.error("❌ 找不到 form:", pageCfg.formSelector);
      return;
    }

    const submitBtn = form.querySelector(pageCfg.submitButtonSelector);
    if (!submitBtn) {
      console.error("❌ 找不到送出按鈕:", pageCfg.submitButtonSelector);
      return;
    }

    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const errors = validate(form, pageCfg.fields);
      if (errors.length) {
        alert(errors.join("\n"));
        return;
      }

      const payload = {
        sourcePage: PAGE_KEY,
        path: location.pathname,
        createdAt: new Date(),
        ua: navigator.userAgent
      };

      for (const f of pageCfg.fields) payload[f.name] = getValue(form, f);

      setSubmitting(submitBtn, true);

      try {
        const ref = await window.db.collection(cfg.meta?.collection || "submissions").add(payload);
        alert("感謝您的分享！已收到。\nID: " + ref.id);
        form.reset();
      } catch (err) {
        console.error(err);
        alert("提交失敗：" + (err.message || err));
      } finally {
        setSubmitting(submitBtn, false);
      }
    });

    console.log(`✅ 表單已掛載：${PAGE_KEY}`);
  } catch (err) {
    console.error("❌ 初始化失敗:", err);
  }
})();
