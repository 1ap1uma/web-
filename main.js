// 政府街道网站 - 优化版交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initHeader();
    initHeroSlider();
    initNavigation();
    initSearch();
    initContactForm();
    initScrollAnimations();
    initCardHoverEffects();
    initMobileMenu();
    initBackToTop();
});

// 头部滚动效果
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // 滚动超过100px时添加阴影
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// 轮播图功能 - 优化版
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;
    const dotsContainer = document.querySelector('.hero-nav');
    
    // 创建导航点
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `跳转到第${index + 1}张`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.insertBefore(dot, dotsContainer.firstChild);
    });

    const dots = document.querySelectorAll('.hero-nav .dot');
    
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        if (currentSlide >= slides.length) currentSlide = 0;
        else if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }
    
    // 自动播放
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopSlideShow() {
        clearInterval(slideInterval);
    }
    
    // 事件监听
    const prevBtn = document.querySelector('.hero-nav .prev');
    const nextBtn = document.querySelector('.hero-nav .next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideShow();
            startSlideShow();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideShow();
            startSlideShow();
        });
    }
    
    // 鼠标悬停停止播放
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', stopSlideShow);
        hero.addEventListener('mouseleave', startSlideShow);
    }
    
    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;
    
    hero.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopSlideShow();
    }, { passive: true });
    
    hero.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startSlideShow();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }
    
    startSlideShow();
}

// 导航功能 - 优化版
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav a');
    const header = document.querySelector('.header');
    
    // 点击导航链接
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            
            // 更新活动状态
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // 移动端关闭菜单
            const nav = document.querySelector('.nav');
            if (nav && window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });
    
    // 滚动时更新导航状态
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// 搜索功能 - 优化版
function initSearch() {
    const searchInput = document.querySelector('.header-search input');
    const searchButton = document.querySelector('.header-search button');
    
    if (!searchInput || !searchButton) return;
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            // 模拟搜索 - 高亮匹配的内容
            highlightSearchTerm(searchTerm);
        }
    }
    
    function highlightSearchTerm(term) {
        // 创建搜索结果提示
        const existingResult = document.querySelector('.search-result');
        if (existingResult) existingResult.remove();
        
        const result = document.createElement('div');
        result.className = 'search-result';
        result.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: white;
            padding: 16px 32px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: fadeInUp 0.3s ease;
        `;
        result.innerHTML = `<i class="fas fa-search"></i> 正在搜索: "${term}"`;
        document.body.appendChild(result);
        
        setTimeout(() => {
            result.remove();
            alert(`搜索功能: ${term}\n\n在实际部署中，这里可以连接到搜索API或站内搜索功能。`);
        }, 1500);
    }
    
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// 表单提交 - 优化版
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // 验证
        if (!data['您的姓名'] || !data['您的邮箱'] || !data['留言内容']) {
            showNotification('请填写必填字段', 'error');
            return;
        }
        
        // 模拟提交动画
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('感谢您的留言！我们会尽快与您联系。', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// 通知提示
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 滚动动画 - 优化版
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 添加延迟实现交错动画
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 需要动画的元素
    const animatedElements = document.querySelectorAll(
        '.about-card, .street-card, .circle-card, .studio-card, .plan-card, .news-card, .highlight-item, .contact-item'
    );
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`;
        observer.observe(element);
    });
}

// 卡片悬停效果
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.street-card, .circle-card, .studio-card, .news-card');
    
    cards.forEach(card => {
        // 鼠标进入
        card.addEventListener('mouseenter', function(e) {
            // 添加微妙的声音反馈效果（可选）
        });
        
        // 鼠标移动视差效果
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        // 鼠标离开
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// 移动端菜单
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (!menuToggle || !nav) return;
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // 动画汉堡菜单
        const spans = menuToggle.querySelectorAll('span');
        if (nav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // 点击外部关闭菜单
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
            nav.classList.remove('active');
        }
    });
}

// 返回顶部按钮
function initBackToTop() {
    // 创建按钮
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(30, 60, 114, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(backToTop);
    
    // 显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // 点击返回顶部
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 悬停效果
    backToTop.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 30px rgba(30, 60, 114, 0.4)';
    });
    
    backToTop.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 20px rgba(30, 60, 114, 0.3)';
    });
}

// 平滑滚动支持
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// 数字动画效果
function initCountAnimation() {
    const counters = document.querySelectorAll('.plan-count');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const text = counter.textContent;
                const match = text.match(/(\d+)/);
                
                if (match) {
                    const target = parseInt(match[0]);
                    animateValue(counter, 0, target, 2000);
                }
                
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateValue(element, start, end, duration) {
    const prefix = element.textContent.replace(/\d+/, '').trim();
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const value = Math.floor(easeOutQuart * (end - start) + start);
        
        element.textContent = value + (prefix ? ' ' + prefix : '');
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// 延迟初始化数字动画
setTimeout(initCountAnimation, 1000);

// 打印样式
const printStyle = document.createElement('style');
printStyle.textContent = `
    @media print {
        .header, .footer, .hero-nav, .btn, .back-to-top { display: none !important; }
        .hero { margin-top: 0; }
        body { font-size: 12pt; }
        .section-title h2::after { display: none; }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(printStyle);
