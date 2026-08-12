/**
 * 博客增强功能
 * 1. 回到顶部按钮
 * 2. 暗色模式切换
 * 3. 阅读进度条
 * 4. 代码块一键复制
 */

(function () {
    // ==================== 1. 回到顶部按钮 ====================
    var backToTop = document.createElement('div');
    backToTop.id = 'back-to-top';
    backToTop.title = '回到顶部';
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="#fff" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==================== 2. 暗色模式切换 ====================
    var darkToggle = document.getElementById('dark-mode-toggle');
    if (darkToggle) {
        // 读取本地存储
        var savedTheme = localStorage.getItem('blog-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        darkToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');
            var isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('blog-theme', isDark ? 'dark' : 'light');
            // 切换图标
            var icon = darkToggle.querySelector('.material-icons');
            if (icon) {
                icon.textContent = isDark ? 'light_mode' : 'dark_mode';
            }
        });

        // 初始化图标
        var icon = darkToggle.querySelector('.material-icons');
        if (icon && document.body.classList.contains('dark-mode')) {
            icon.textContent = 'light_mode';
        }
    }

    // ==================== 3. 阅读进度条 ====================
    var progressBar = document.getElementById('reading-progress');
    if (progressBar) {
        window.addEventListener('scroll', function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        });
    }

    // ==================== 4. 代码块一键复制 ====================
    document.addEventListener('DOMContentLoaded', function () {
        var codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(function (codeBlock) {
            var pre = codeBlock.parentNode;

            var wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';

            var btn = document.createElement('button');
            btn.className = 'code-copy-btn';
            btn.type = 'button';
            btn.title = '复制代码';
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';

            btn.addEventListener('click', function () {
                var text = codeBlock.textContent;
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(function () {
                        btn.classList.add('copied');
                        btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
                        setTimeout(function () {
                            btn.classList.remove('copied');
                            btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
                        }, 2000);
                    });
                } else {
                    // fallback
                    var textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    btn.classList.add('copied');
                    setTimeout(function () { btn.classList.remove('copied'); }, 2000);
                }
            });

            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            wrapper.appendChild(btn);
        });
    });
})();
