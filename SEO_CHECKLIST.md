# SEO 改善清單（簡潔版）

**目的**：針對現有靜態站（Skylark Memory）提出可執行、優先度分明的 SEO 改善事項與驗收步驟，方便交付給開發或部署團隊執行。

---

## 優先（高） ✅

1. 允許搜尋引擎載入 CSS / JS
   - 問題：`robots.txt` 目前含有 `Disallow: /assets/js/` 與 `Disallow: /assets/css/`，會影響 Google 的渲染與索引。
   - 動作：移除或改為 `Allow: /assets/js/` 和 `Allow: /assets/css/`。
   - 驗收：在 Search Console 或用 `curl -I` 檢查 robots.txt 更新；以 Google Mobile-Friendly 或 Lighthouse 再次抓取頁面看是否能完整渲染。

2. 確保 `404.html` 以 HTTP 404 回傳（伺服器層）
   - 說明：單純放置 `404.html` 不保證 404 status，需在 Netlify/ Vercel / Nginx / Apache 等處設定。
   - 範例（Nginx）：
     ```nginx
     error_page 404 /404.html;
     location = /404.html { internal; }
     ```
   - 驗收：`curl -I https://your-domain/does-not-exist` 應回傳 `HTTP/1.1 404`。

3. 保持 `sitemap.xml` 與 `robots.txt` 一致且提交 Search Console
   - 動作：確認 sitemap 已列出所有公開頁（包含 `404.html` 視需求），並在 Search Console 提交 sitemap。
   - 驗收：Search Console 顯示 sitemap 已成功提交並無錯誤。

---

## 中優先（中） ⚠️

4. hreflang（多語/日本頁面）
   - 動作：在 `jp-memory.html` head 加入：
     ```html
     <link rel="alternate" hreflang="ja" href="https://skylark.tw/jp-memory.html" />
     <link rel="alternate" hreflang="x-default" href="https://skylark.tw/" />
     ```
     在主要頁面加回 `hreflang="zh-TW"` 指向對應頁。
   - 驗收：使用 Google URL Inspection 檢查 hreflang 是否正確解析。 

5. 檢查 canonical 與重複內容
   - 發現：`1226vision.html` 的 canonical 指向 `vision.html`（確認是否為意圖；若非，改為 self-canonical）。
   - 驗收：每頁 canonical 指向自己或明確主頁，避免多重 canonical 衝突。

6. 每頁語意化 H1 與唯一 headline
   - 動作：在 `index.html` 增加語意化 `<h1>`（例如 hero 的主要宣言），其他頁確認 H1 唯一且有描述性文字。
   - 驗收：以 Lighthouse 或手動檢視確保每頁僅 1 個 H1，且與 title/description 一致。 

---

## 進階（低） ✨

7. 強化 structured data（視頁面型態）
   - 動作：保有 Organization / WebPage JSON-LD，針對文章、活動或回憶牆可加 Article / Event schema 來取得豐富結果。
   - 驗收：Google Rich Results Test 無錯誤，能預覽豐富結果。

8. 圖片、ALT 與效能
   - 動作：確保所有重要圖片有 descriptive `alt`，避免使用無意義 alt；持續優化圖片尺寸與格式（WebP）與 lazy-loading。
   - 驗收：Lighthouse 圖片最佳化建議低於閾值，且所有 `<img>` 有 meaningful `alt`。

9. meta robots / noindex 控制
   - 動作：保留 `demo.html` 為 `noindex`（已存在），確保內部測試或不公開頁面皆設 noindex。
   - 驗收：搜尋結果中不會顯示 noindex 頁面。

---

## 驗收 & 測試清單（簡短命令）

- 檢查 robots.txt：
  ```bash
  curl -I https://skylark.tw/robots.txt
  ```
- 檢查 404 status：
  ```bash
  curl -I https://skylark.tw/non-existing-path
  # Expect: HTTP/1.1 404
  ```
- 使用 Lighthouse（Chrome）或 CLI：
  ```bash
  # 需 Node & Lighthouse
  npx lighthouse https://skylark.tw/ --preset=desktop --output html --output-path=lh-report.html
  ```
- Rich Results Test（線上工具）：https://search.google.com/test/rich-results

---

## 建議執行順序（短期 2 週內）

1. 修正 `robots.txt`（允許 CSS/JS） ✅
2. 設定伺服器的 404 filepath → 回傳 404 ✅
3. 確認 sitemap 並提交 Search Console ✅
4. 加入 hreflang（日本頁）與 canonical 校正 ⚠️
5. 加入或優化 H1、alt、structured data ✨

---

需要我幫你代為執行其中一項（例如 A: 修改 `robots.txt`，或 D: 提供具體伺服器範例並測試 `404` 回傳）嗎？
