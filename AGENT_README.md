# Skylark Memory 網站維護代理

這個專屬代理協助維護和優化 **Skylark Memory**（天喜の記憶）網站。

## 快速開始

### SEO 檢查
運行全站 SEO 檢查：
```bash
node seo-agent.js
```

### 常見任務
- **檢查 SEO**: 讓代理運行 `seo-agent.js` 並分析結果
- **更新內容**: 提供具體的修改要求，代理會協助編輯 HTML 文件
- **新增頁面**: 描述新頁面的需求，代理會創建並優化
- **修復問題**: 報告發現的 SEO 或內容問題，代理會建議修復方案

## 代理能力

### SEO 優化
- 自動檢查 Title、Meta Description、Canonical 連結
- 驗證 H1 標籤和圖片 Alt 屬性
- 確保 Open Graph 和 Twitter Card 完整
- 檢查 hreflang 多語化設定

### 內容管理
- 更新頁面文案，確保品牌一致性
- 添加新頁面到 sitemap.xml
- 維護 robots.txt 和 404 頁面
- 處理多語內容（中文/日文）

### 技術維護
- 更新 sitemap.xml
- 調整 robots.txt
- 檢查文件結構
- 生成維護報告

## 使用提示

1. **具體描述**: 提供清晰的任務描述，例如 "更新 index.html 的 hero 文案"
2. **提供上下文**: 說明修改的原因和期望效果
3. **驗收標準**: 指定如何驗證修改是否成功
4. **品牌一致**: 確保所有內容符合天喜的款待與記憶精神

## 支援文件

- `seo-agent.js`: 全站 SEO 檢查腳本
- `SEO_CHECKLIST.md`: SEO 改善清單
- `404_SETUP.md`: 404 頁面設定指南
- `sitemap.xml`: 網站地圖
- `robots.txt`: 搜尋引擎爬蟲設定

## 聯絡與支援

如需協助，請聯絡開發團隊或參考專案文件。