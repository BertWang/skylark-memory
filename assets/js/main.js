document.addEventListener("DOMContentLoaded", function() {
    
    // 導覽列捲動效果
    const navbar = document.querySelector('.navbar-skylark');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            // 當捲動超過 50px，增加陰影，讓導覽列更明顯
            navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
        } else {
            // 回到頂部時，恢復平坦
            navbar.style.boxShadow = "none";
        }
    });

    console.log("Skylark Memory System Loaded.");
});


// --- Hero Image 輪播功能 ---
document.addEventListener("DOMContentLoaded", function () {
    const desktopLayer = document.getElementById("heroImageLayer");
    const mobileLayer = document.getElementById("mobileHeroBg");

    if (!desktopLayer || !mobileLayer) return;

    // 圖片陣列
    const images = [
        "assets/images/hero/hero-luggage.png",
        "assets/images/hero/hero-noren.png",
        "assets/images/hero/hero-notebook.png"
    ];

    // 預載圖片函式
    const preloadImage = (src) => {
        const img = new Image();
        img.src = src;
    };

    // 預先載入所有圖片
    images.forEach(preloadImage);

    // 隨機選擇一張圖片開始
    let currentIndex = Math.floor(Math.random() * images.length);
    const setCurrentImage = () => {
        const imgSrc = images[currentIndex];
        
        // 先隱藏
        desktopLayer.style.opacity = 0;
        mobileLayer.style.opacity = 0;

        // 等淡出完成後再換圖
        setTimeout(() => {
            desktopLayer.style.backgroundImage = `url('${imgSrc}')`;
            mobileLayer.style.backgroundImage = `url('${imgSrc}')`;
            
            // 漸顯
            desktopLayer.style.opacity = 1;
            mobileLayer.style.opacity = 0.15; // 手機版淡一些
        }, 500); // 與 CSS transition 時間一致
    };

    setCurrentImage();

    // 每 8 秒切換一次圖片
    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        setCurrentImage();
    }, 8000);
});

// --- 捲動觸發文字淡入 (Intersection Observer) ---
document.addEventListener("DOMContentLoaded", function () {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // 當元素出現 15% 時觸發
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 只觸發一次
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-text');
    fadeElements.forEach(el => observer.observe(el));
});


// Origin reading progress bar
(function () {
  const bar = document.getElementById('originProgressBar');
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const p = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, p))}%`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();