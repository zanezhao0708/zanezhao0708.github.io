/**
 * 博客增强功能集合
 * 1. 回到顶部按钮
 * 2. 暗色模式切换
 * 3. 阅读进度条
 * 4. 代码块一键复制
 * 5. 悬浮目录导航(TOC)
 * 6. 阅读时间+字数统计
 * 7. 不蒜子访问统计
 * 8. 文章分享按钮
 * 9. 打赏按钮
 * 10. 上一篇/下一篇导航
 * 11. 相关文章推荐
 * 12. 全站搜索
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
        var savedTheme = localStorage.getItem('blog-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        darkToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');
            var isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('blog-theme', isDark ? 'dark' : 'light');
            var icon = darkToggle.querySelector('.material-icons');
            if (icon) {
                icon.textContent = isDark ? 'light_mode' : 'dark_mode';
            }
        });

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

    // ==================== 5. 悬浮目录导航(TOC) ====================
    var articleContent = document.querySelector('.neko') || document.querySelector('.entry-content') || document.querySelector('article');
    if (articleContent) {
        var headings = articleContent.querySelectorAll('h2, h3, h4');
        if (headings.length >= 3) {
            var tocContainer = document.createElement('div');
            tocContainer.id = 'toc-container';
            tocContainer.innerHTML = '<div id="toc-title">目录</div><ul id="toc-list"></ul>';
            document.body.appendChild(tocContainer);

            var tocList = tocContainer.querySelector('#toc-list');
            headings.forEach(function (heading, index) {
                if (!heading.id) {
                    heading.id = 'toc-heading-' + index;
                }
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = '#' + heading.id;
                a.textContent = heading.textContent;
                a.className = 'toc-' + heading.tagName.toLowerCase();
                a.addEventListener('click', function (e) {
                    e.preventDefault();
                    var target = document.getElementById(heading.id);
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
                li.appendChild(a);
                tocList.appendChild(li);
            });

            // 滚动时高亮当前标题
            window.addEventListener('scroll', function () {
                var scrollTop = window.pageYOffset;
                var activeLink = null;
                headings.forEach(function (heading) {
                    if (heading.offsetTop - 100 <= scrollTop) {
                        activeLink = tocContainer.querySelector('a[href="#' + heading.id + '"]');
                    }
                });
                tocList.querySelectorAll('a').forEach(function (link) {
                    link.classList.remove('active');
                });
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            });

            // 滚动超过 200px 显示 TOC
            window.addEventListener('scroll', function () {
                if (window.pageYOffset > 200) {
                    tocContainer.classList.add('show');
                } else {
                    tocContainer.classList.remove('show');
                }
            });
        }
    }

    // ==================== 6. 阅读时间+字数统计 ====================
    var entryHeader = document.querySelector('.entry-header');
    if (entryHeader && articleContent) {
        var text = articleContent.textContent || '';
        var charCount = text.replace(/\s/g, '').length;
        var readingTime = Math.ceil(charCount / 400); // 平均阅读速度 400 字/分钟

        var statsDiv = document.createElement('span');
        statsDiv.className = 'reading-stats';
        statsDiv.innerHTML = '<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>' +
            ' 预计阅读 ' + readingTime + ' 分钟 · 约 ' + charCount.toLocaleString() + ' 字';

        var census = entryHeader.querySelector('.entry-census');
        if (census) {
            census.appendChild(statsDiv);
        }
    }

    // ==================== 7. 不蒜子访问统计 ====================
    // 加载不蒜子脚本
    var busuanziScript = document.createElement('script');
    busuanziScript.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    busuanziScript.async = true;
    document.body.appendChild(busuanziScript);

    // 添加统计显示区域
    var footer = document.querySelector('.site-info') || document.querySelector('footer');
    if (footer) {
        var viewsDiv = document.createElement('div');
        viewsDiv.className = 'site-views';
        viewsDiv.innerHTML = '本站总访问量 <span id="busuanzi_value_site_pv">0</span> 次 · ' +
            '本文阅读量 <span id="busuanzi_value_page_pv">0</span> 次';
        footer.appendChild(viewsDiv);
    }

    // ==================== 8. 文章分享按钮 ====================
    var articleFooter = document.querySelector('.entry-header');
    if (articleFooter && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        var shareContainer = document.createElement('div');
        shareContainer.className = 'share-container';
        shareContainer.innerHTML =
            '<span class="share-label">分享到：</span>' +
            '<div class="share-buttons">' +
            '<button class="share-btn weibo" title="分享到微博"><svg viewBox="0 0 24 24"><path d="M20.194 14.197c0 3.248-4.037 5.882-9.003 5.882-4.966 0-9.003-2.634-9.003-5.882 0-3.248 4.037-5.882 9.003-5.882 4.966 0 9.003 2.634 9.003 5.882zm-8.697 3.705c2.558.252 4.778-1.093 4.957-3.005.18-1.912-1.76-3.68-4.317-3.932-2.558-.252-4.778 1.093-4.957 3.005-.18 1.912 1.76 3.68 4.317 3.932zm.856-2.238c-.572.85-1.816 1.213-2.768.807-.944-.403-1.22-1.393-.653-2.203.56-.802 1.757-1.158 2.693-.81.94.35 1.27 1.35.728 2.206zm1.47-1.792c-.213.32-.68.469-1.038.33-.361-.136-.473-.5-.26-.814.21-.31.66-.458 1.012-.333.356.126.5.51.286.817zM17.75 8.5c-.293.06-.46.3-.404.57.056.27.33.44.62.38 1.22-.25 2.33.2 2.69 1.13.36.93-.13 1.99-1.18 2.55-.26.14-.36.45-.22.7.14.25.47.34.73.2 1.5-.78 2.23-2.38 1.74-3.71-.47-1.32-2.09-1.94-3.56-1.46-.29.09-.45.38-.36.67.09.29.39.44.68.35.95-.31 1.93.08 2.24.91.31.83-.18 1.87-1.12 2.35z"/></svg></button>' +
            '<button class="share-btn qq" title="分享到QQ"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5-6c-2.33 0-4.32-1.45-5.12-3.5h10.24c-.8 2.05-2.79 3.5-5.12 3.5z"/></svg></button>' +
            '<button class="share-btn wechat" title="微信扫码分享"><svg viewBox="0 0 24 24"><path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66L4 17l2.5-1.5c.75.21 1.56.35 2.4.4-.21-.62-.35-1.27-.4-1.95C8.5 10.18 11.69 7 15.5 7c.2 0 .39.01.58.02C14.94 5.3 12.39 4 9.5 4zm-3 4.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4.5 4c-3.59 0-6.5 2.24-6.5 5s2.91 5 6.5 5c.7 0 1.38-.08 2-.23L21 22l-.8-2c1.57-.96 2.55-2.47 2.55-4.16 0-2.76-2.91-5-6.5-5zm-2 3.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/></svg></button>' +
            '<button class="share-btn copy" title="复制链接"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>' +
            '</div>';

        var entryContent = document.querySelector('.neko') || document.querySelector('.entry-content');
        if (entryContent) {
            entryContent.appendChild(shareContainer);
        }

        // 分享按钮事件
        var shareUrl = encodeURIComponent(window.location.href);
        var shareTitle = encodeURIComponent(document.title);

        shareContainer.querySelector('.weibo').addEventListener('click', function () {
            window.open('https://service.weibo.com/share/share.php?url=' + shareUrl + '&title=' + shareTitle);
        });

        shareContainer.querySelector('.qq').addEventListener('click', function () {
            window.open('https://connect.qq.com/widget/shareqq/index.html?url=' + shareUrl + '&title=' + shareTitle);
        });

        shareContainer.querySelector('.wechat').addEventListener('click', function () {
            alert('请截图后使用微信分享给朋友');
        });

        shareContainer.querySelector('.copy').addEventListener('click', function () {
            var btn = this;
            navigator.clipboard.writeText(window.location.href).then(function () {
                btn.classList.add('copied');
                setTimeout(function () { btn.classList.remove('copied'); }, 2000);
            });
        });
    }

    // ==================== 9. 打赏按钮 ====================
    if (articleContent && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        var donateContainer = document.createElement('div');
        donateContainer.className = 'donate-container';
        donateContainer.innerHTML =
            '<button class="donate-btn"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.75 0 2.33-.81 2.33-1.48 0-.93-.5-1.37-2.67-2.03-2.54-.77-3.58-1.87-3.58-3.64 0-1.84 1.45-3.05 3.27-3.38V6h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-1.87-1.87-1.29 0-2.04.7-2.04 1.48 0 .77.39 1.3 2.36 1.95s3.89 1.34 3.89 3.67c-.01 2.08-1.57 3.26-3.42 3.57z"/></svg> 赞助博主</button>' +
            '<div class="donate-qrcode">' +
            '<img src="/images/wechat-pay.png" alt="微信支付"><img src="/images/alipay.png" alt="支付宝">' +
            '<p>感谢您的支持与鼓励</p>' +
            '</div>';

        articleContent.appendChild(donateContainer);

        var donateBtn = donateContainer.querySelector('.donate-btn');
        var donateQrcode = donateContainer.querySelector('.donate-qrcode');
        donateBtn.addEventListener('click', function () {
            donateQrcode.classList.toggle('show');
        });
    }

    // ==================== 10. 上一篇/下一篇导航 ====================
    // 文章列表数据（可根据实际文章更新）
    var postList = [
        { url: '/post/yi-chang-dian-jian-ce-suan-fa/', title: '基于分类的方法异常点检测算法，有哪些好的方法？', date: '2026-08-13' },
        { url: '/post/ji-suan-ji-wang-luo-zong-jie/', title: '计算机网络总结', date: '2025-07-01' },
        { url: '/post/ji-suan-ji-chang-yong-liang-hua-zhi-biao/', title: '计算机常用量化指标', date: '2024-09-03' }
    ];

    var currentPath = window.location.pathname;
    var currentPostIndex = -1;
    postList.forEach(function (post, index) {
        if (currentPath.indexOf(post.url) !== -1) {
            currentPostIndex = index;
        }
    });

    if (currentPostIndex !== -1 && articleContent) {
        var navContainer = document.createElement('div');
        navContainer.className = 'post-navigation';

        if (currentPostIndex < postList.length - 1) {
            var prevPost = postList[currentPostIndex + 1];
            navContainer.innerHTML += '<a href="' + prevPost.url + '" class="post-nav-item prev">' +
                '<span class="post-nav-label">← 上一篇</span>' +
                '<span class="post-nav-title">' + prevPost.title + '</span></a>';
        }

        if (currentPostIndex > 0) {
            var nextPost = postList[currentPostIndex - 1];
            navContainer.innerHTML += '<a href="' + nextPost.url + '" class="post-nav-item next">' +
                '<span class="post-nav-label">下一篇 →</span>' +
                '<span class="post-nav-title">' + nextPost.title + '</span></a>';
        }

        if (navContainer.innerHTML) {
            articleContent.appendChild(navContainer);
        }
    }

    // ==================== 11. 相关文章推荐 ====================
    if (currentPostIndex !== -1 && articleContent) {
        var relatedContainer = document.createElement('div');
        relatedContainer.className = 'related-posts';
        relatedContainer.innerHTML = '<div class="related-posts-title"><svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> 相关推荐</div><div class="related-posts-list"></div>';

        var relatedList = relatedContainer.querySelector('.related-posts-list');
        var addedCount = 0;
        postList.forEach(function (post, index) {
            if (index !== currentPostIndex && addedCount < 2) {
                relatedList.innerHTML += '<a href="' + post.url + '" class="related-post-item">' +
                    '<h4>' + post.title + '</h4>' +
                    '<time>' + post.date + '</time></a>';
                addedCount++;
            }
        });

        if (addedCount > 0) {
            articleContent.appendChild(relatedContainer);
        }
    }

    // ==================== 12. 全站搜索 ====================
    // 搜索数据索引
    var searchIndex = postList.map(function (post) {
        return {
            url: post.url,
            title: post.title,
            date: post.date,
            keywords: post.title.toLowerCase()
        };
    });

    // 创建搜索界面
    var searchOverlay = document.createElement('div');
    searchOverlay.id = 'search-overlay';
    searchOverlay.innerHTML =
        '<div id="search-modal">' +
        '<input type="text" id="search-input" placeholder="搜索文章...">' +
        '<div id="search-results"></div>' +
        '</div>';
    document.body.appendChild(searchOverlay);

    // 搜索按钮（添加到顶部工具栏）
    var searchToggle = document.createElement('a');
    searchToggle.href = 'javascript:;';
    searchToggle.className = 'mdui-btn mdui-btn-icon';
    searchToggle.id = 'search-toggle';
    searchToggle.title = '搜索';
    searchToggle.innerHTML = '<i class="mdui-icon material-icons">search</i>';

    var toolbar = document.querySelector('.mdui-toolbar');
    if (toolbar) {
        var spacer = toolbar.querySelector('.mdui-toolbar-spacer');
        if (spacer) {
            toolbar.insertBefore(searchToggle, spacer.nextSibling);
        }
    }

    // 搜索事件
    var searchInput = document.getElementById('search-input');
    var searchResults = document.getElementById('search-results');

    searchToggle.addEventListener('click', function () {
        searchOverlay.classList.add('show');
        searchInput.focus();
    });

    searchOverlay.addEventListener('click', function (e) {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('show');
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('show')) {
            searchOverlay.classList.remove('show');
        }
    });

    searchInput.addEventListener('input', function () {
        var query = searchInput.value.toLowerCase().trim();
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }

        var matches = searchIndex.filter(function (item) {
            return item.keywords.indexOf(query) !== -1;
        });

        if (matches.length === 0) {
            searchResults.innerHTML = '<div id="search-no-result">未找到相关文章</div>';
        } else {
            var html = '';
            matches.forEach(function (item) {
                var highlightedTitle = item.title.replace(new RegExp(query, 'gi'), '<mark>$&</mark>');
                html += '<a href="' + item.url + '" class="search-result-item">' +
                    '<h3>' + highlightedTitle + '</h3>' +
                    '<p>' + item.date + '</p></a>';
            });
            searchResults.innerHTML = html;
        }
    });
})();