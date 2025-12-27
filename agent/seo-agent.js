const fs = require('fs');
const path = require('path');

/**
 * 全站 SEO 檢查代理
 * 掃描所有 HTML 文件並檢查常見的 SEO 元素
 */

class SEOAgent {
  constructor(rootDir = '.') {
    this.rootDir = rootDir;
    this.results = {};
  }

  // 掃描所有 HTML 文件
  scanFiles() {
    const files = this.getAllHtmlFiles(this.rootDir);
    console.log(`發現 ${files.length} 個 HTML 文件`);
    return files;
  }

  // 遞歸獲取所有 .html 文件
  getAllHtmlFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !['node_modules', '.git'].includes(item)) {
        results = results.concat(this.getAllHtmlFiles(fullPath));
      } else if (stat.isFile() && item.endsWith('.html')) {
        results.push(fullPath);
      }
    }

    return results;
  }

  // 檢查單個文件的 SEO 元素
  checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(this.rootDir, filePath);

    const checks = {
      title: this.checkTitle(content),
      description: this.checkMetaDescription(content),
      canonical: this.checkCanonical(content),
      h1: this.checkH1(content),
      robots: this.checkRobots(content),
      ogTags: this.checkOpenGraph(content),
      twitterTags: this.checkTwitter(content),
      structuredData: this.checkStructuredData(content),
      hreflang: this.checkHreflang(content),
      imagesAlt: this.checkImagesAlt(content)
    };

    this.results[relativePath] = checks;
    return checks;
  }

  // 檢查 Title
  checkTitle(content) {
    const match = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? { present: true, value: match[1].trim() } : { present: false, value: null };
  }

  // 檢查 Meta Description
  checkMetaDescription(content) {
    const match = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    return match ? { present: true, value: match[1] } : { present: false, value: null };
  }

  // 檢查 Canonical
  checkCanonical(content) {
    const match = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    return match ? { present: true, value: match[1] } : { present: false, value: null };
  }

  // 檢查 H1
  checkH1(content) {
    const h1Matches = content.match(/<h1[^>]*>(.*?)<\/h1>/gi);
    return {
      count: h1Matches ? h1Matches.length : 0,
      present: h1Matches && h1Matches.length > 0,
      values: h1Matches ? h1Matches.map(h1 => h1.replace(/<[^>]+>/g, '').trim()) : []
    };
  }

  // 檢查 Robots Meta
  checkRobots(content) {
    const match = content.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    return match ? { present: true, value: match[1] } : { present: false, value: null };
  }

  // 檢查 Open Graph Tags
  checkOpenGraph(content) {
    const ogMatches = content.match(/<meta[^>]*property=["']og:[^"']+["'][^>]*content=["']([^"']+)["'][^>]*>/gi);
    return {
      count: ogMatches ? ogMatches.length : 0,
      present: ogMatches && ogMatches.length > 0
    };
  }

  // 檢查 Twitter Card Tags
  checkTwitter(content) {
    const twitterMatches = content.match(/<meta[^>]*name=["']twitter:[^"']+["'][^>]*content=["']([^"']+)["'][^>]*>/gi);
    return {
      count: twitterMatches ? twitterMatches.length : 0,
      present: twitterMatches && twitterMatches.length > 0
    };
  }

  // 檢查 Structured Data
  checkStructuredData(content) {
    const jsonLdMatches = content.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    return {
      count: jsonLdMatches ? jsonLdMatches.length : 0,
      present: jsonLdMatches && jsonLdMatches.length > 0
    };
  }

  // 檢查 hreflang
  checkHreflang(content) {
    const hreflangMatches = content.match(/<link[^>]*rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*href=["']([^"']+)["'][^>]*>/gi);
    return {
      count: hreflangMatches ? hreflangMatches.length : 0,
      present: hreflangMatches && hreflangMatches.length > 0
    };
  }

  // 檢查圖片 Alt 屬性
  checkImagesAlt(content) {
    const imgTags = content.match(/<img[^>]*>/gi) || [];
    let withAlt = 0;
    let withoutAlt = 0;

    imgTags.forEach(img => {
      if (img.includes('alt=')) {
        withAlt++;
      } else {
        withoutAlt++;
      }
    });

    return {
      total: imgTags.length,
      withAlt: withAlt,
      withoutAlt: withoutAlt,
      allHaveAlt: withoutAlt === 0
    };
  }

  // 運行完整檢查
  run() {
    console.log('🔍 開始全站 SEO 檢查...\n');

    const files = this.scanFiles();

    for (const file of files) {
      console.log(`檢查中: ${path.relative(this.rootDir, file)}`);
      this.checkFile(file);
    }

    this.generateReport();
  }

  // 生成報告
  generateReport() {
    console.log('\n📊 SEO 檢查報告\n');

    let totalIssues = 0;

    for (const [file, checks] of Object.entries(this.results)) {
      console.log(`📄 ${file}`);
      let fileIssues = 0;

      // 檢查每個項目
      if (!checks.title.present) {
        console.log('  ❌ 缺少 Title 標籤');
        fileIssues++;
      }

      if (!checks.description.present) {
        console.log('  ❌ 缺少 Meta Description');
        fileIssues++;
      }

      if (!checks.canonical.present) {
        console.log('  ❌ 缺少 Canonical 連結');
        fileIssues++;
      }

      if (!checks.h1.present) {
        console.log('  ❌ 缺少 H1 標籤');
        fileIssues++;
      } else if (checks.h1.count > 1) {
        console.log(`  ⚠️  多個 H1 標籤 (${checks.h1.count} 個)`);
      }

      if (!checks.robots.present) {
        console.log('  ⚠️  缺少 Robots Meta');
      }

      if (!checks.ogTags.present) {
        console.log('  ⚠️  缺少 Open Graph Tags');
      }

      if (!checks.twitterTags.present) {
        console.log('  ⚠️  缺少 Twitter Card Tags');
      }

      if (!checks.structuredData.present) {
        console.log('  ⚠️  缺少 Structured Data');
      }

      if (checks.imagesAlt.withoutAlt > 0) {
        console.log(`  ⚠️  ${checks.imagesAlt.withoutAlt} 張圖片缺少 Alt 屬性`);
      }

      if (fileIssues === 0) {
        console.log('  ✅ 基本 SEO 元素完整');
      }

      totalIssues += fileIssues;
      console.log('');
    }

    console.log(`總計發現 ${totalIssues} 個關鍵問題`);
    console.log('\n💡 建議：');
    console.log('- 確保每個頁面都有唯一的 Title 和 Meta Description');
    console.log('- 設定正確的 Canonical URL');
    console.log('- 每個頁面應有且只有一個 H1 標籤');
    console.log('- 為所有圖片添加有意義的 Alt 屬性');
    console.log('- 考慮添加 Open Graph 和 Twitter Card meta tags');
  }
}

// 運行代理
if (require.main === module) {
  const agent = new SEOAgent();
  agent.run();
}

module.exports = SEOAgent;