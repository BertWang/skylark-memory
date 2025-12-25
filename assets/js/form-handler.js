// js/form-handler.js
// - i18n: zh / ja
// - 不顯示 ref.id
// - success copy: "感謝您的分享！已收到。"
// - jp page: 日本語メッセージ

(async function () {
  const PAGE_KEY = (() => {
    const p = (location.pathname || "").toLowerCase();
    if (p.includes("vision")) return "vision";
    if (p.includes("jp-memory")) return "jp-memory";
    return "memory";
  })();

  // 語言判斷：jp-memory 一律日文，其他一律中文
  const LANG = PAGE_KEY === "jp-memory" ? "ja" : "zh";

  // 文案字典（只放需要的句子，不搞複雜）
  const I18N = {
    zh: {
      submitting: "提交中…",
      submitFail: "提交失敗：",
      required: "必填",
      invalidEmail: "格式不正確",
      minLength: (n) => `至少 ${n} 字`,
      maxLength: (n, cur) => `最多 ${n} 字（目前 ${cur} 字）`,
      success: "感謝您的分享！已收到。",
      initDbMissing: "❌ Firestore(db) 未初始化，請確認 firebase-config.js 有先載入",
      configLoadFail: (status) => `fields-config.json 載入失敗: ${status}`
    },
    ja: {
      submitting: "送信中…",
      submitFail: "送信に失敗しました：",
      required: "は必須です",
      invalidEmail: "メール形式が正しくありません",
      minLength: (n) => `${n}文字以上で入力してください`,
      maxLength: (n, cur) => `${n}文字以内で入力してください（現在 ${cur} 文字）`,
      success: "ご協力ありがとうございます。送信を受け付けました。",
      initDbMissing: "❌ Firestore(db) が初期化されていません。firebase-config.js を先に読み込んでください。",
      configLoadFail: (status) => `fields-config.json の読み込みに失敗しました: ${status}`
    }
  };

  const T = I18N[LANG];

  async function loadConfig() {
    // 您目前使用這個路徑：/assets/js/fields-config.json
    const res = await fetch("/assets/js/fields-config.json", { cache: "no-store" });
    if (!res.ok) throw new Error(T.configLoadFail(res.status));
    return await res.json();
  }

  function getEl(selector) {
    return document.querySelector(selector);
  }

  // 依照 fields-config 裡的 valueFrom 來取值（更通用）
  function getValue(form, field) {
    // radio
    if (field.type === "radio") {
      const checked = form.querySelector(`${field.selector}:checked`);
      if (!checked) return "";

      // checked_value / checked_id 兩種都支援
      if (field.valueFrom === "checked_id") return checked.id || "";
      return checked.value || checked.id || "";
    }

    // checkbox
    if (field.type === "checkbox") {
      const el = form.querySelector(field.selector);
      if (!el) return false;
      return !!el.checked;
    }

    // text/textarea/email...
    const el = form.querySelector(field.selector);
    if (!el) return "";
    return (el.value || "").trim();
  }

  function validate(form, fields) {
    const errors = [];

    for (const f of fields) {
      const v = getValue(form, f);

      // 必填
      if (f.required) {
        const empty =
          (typeof v === "string" && !v) ||
          (typeof v === "boolean" && v === false);

        if (empty) {
          // zh: 「xxx」必填
          // ja: 「xxx」は必須です
          errors.push(LANG === "ja" ? `${f.label}${T.required}` : `「${f.label}」${T.required}`);
          continue;
        }
      }

      // Email
      if (f.type === "email" && v) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(v)) {
          errors.push(LANG === "ja" ? `${f.label}：${T.invalidEmail}` : `「${f.label}」${T.invalidEmail}`);
        }
      }

      // 長度
      if (f.minLength && typeof v === "string" && v && v.length < f.minLength) {
        errors.push(LANG === "ja" ? `${f.label}：${T.minLength(f.minLength)}` : `「${f.label}」${T.minLength(f.minLength)}`);
      }
      if (f.maxLength && typeof v === "string" && v && v.length > f.maxLength) {
        errors.push(LANG === "ja" ? `${f.label}：${T.maxLength(f.maxLength, v.length)}` : `「${f.label}」${T.maxLength(f.maxLength, v.length)}`);
      }
    }

    return errors;
  }

  function setSubmitting(btn, submitting) {
    if (!btn) return;
    btn.disabled = submitting;
    btn.dataset._oldText = btn.dataset._oldText || btn.textContent;
    btn.textContent = submitting ? T.submitting : btn.dataset._oldText;
  }

  try {
    if (!window.db) {
      console.error(T.initDbMissing);
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
        lang: LANG,
        path: location.pathname,
        createdAt: new Date(),
        ua: navigator.userAgent
      };

      for (const f of pageCfg.fields) {
        payload[f.name] = getValue(form, f);
      }

      setSubmitting(submitBtn, true);

      try {
        // add() 會回傳 DocumentReference，ref.id 可用，但您不要顯示就不顯示。[web:63]
        await window.db.collection(cfg.meta?.collection || "submissions").add(payload);
        alert(T.success);
        form.reset();
      } catch (err) {
        console.error(err);
        alert(T.submitFail + (err.message || err));
      } finally {
        setSubmitting(submitBtn, false);
      }
    });

    console.log(`✅ 表單已掛載：${PAGE_KEY} (${LANG})`);
  } catch (err) {
    console.error("❌ 初始化失敗:", err);
  }
})();
