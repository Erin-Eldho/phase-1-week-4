console.log("Task 6 observers loaded");

// 1. MutationObserver + IntersectionObserver
// Animate newly added blog articles from infinite scrolling
function initBlogArticleObserver() {
    const blogFeed = document.getElementById("blog-feed");
    if (!blogFeed) return;
    const articleObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("observer-article-visible");
                articleObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    function observeArticle(article) {
        if (article.dataset.animationObserved) return;
        article.dataset.animationObserved = "true";
        article.classList.add("observer-article-hidden");
        articleObserver.observe(article);
    }

    // Detect articles added by infinite scrolling
    const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                if (node.matches("article")) {
                    observeArticle(node);
                }
                node.querySelectorAll("article").forEach(observeArticle);
            });
        });
    });
    mutationObserver.observe(blogFeed, {
        childList: true,
        subtree: true
    });
}


// 2. MutationObserver
// Log DOM changes in a floating overlay panel
function initDOMChangeLogger() {
    const panel = document.createElement("div");
    panel.id = "dom-change-log";
    panel.innerHTML = "<strong>DOM Change Log</strong>";
    document.body.appendChild(panel);
    const style = document.createElement("style");

    style.textContent = `#dom-change-log {
            position: fixed;
            right: 15px;
            bottom: 15px;
            width: 300px;
            height: 200px;
            padding: 12px;
            overflow-y: auto;
            background: #722F45;
            color: #FFFFFF;
            border: 1px solid #98566B;
            border-radius: 8px;
            font-size: 12px;
            z-index: 9999;
        }

        #dom-change-log strong {
            color: #FFFFFF;
        }

        #dom-change-log div {
            padding: 5px 0;
            border-bottom: 1px solid #98566B;
        }
    `;
    document.head.appendChild(style);
    function logChange(message) {
        const item = document.createElement("div");
        item.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
        panel.appendChild(item);
        panel.scrollTop = panel.scrollHeight;
    }

    const domObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Ignore changes made inside the log panel
            if (panel.contains(mutation.target)) return;
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        logChange(`Element added: <${node.tagName.toLowerCase()}>`);
                    }
                });
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        logChange(`Element removed: <${node.tagName.toLowerCase()}>`);
                    }
                });
            }
            if (mutation.type === "attributes") {
                logChange(`Attribute changed: ${mutation.attributeName} on <${mutation.target.tagName.toLowerCase()}>`);
            }
        });
    });
    domObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });
}


// 3. ResizeObserver
// Redraw chart when its container changes size
function initResponsiveChart() {
    const main = document.querySelector("main");
    if (!main) return;

    // Create chart container dynamically
    const section = document.createElement("section");
    section.id = "resize-chart-section";
    const heading = document.createElement("h2");
    heading.textContent = "Responsive Chart";
    const description = document.createElement("p");
    description.textContent = "Resize the chart container to see it redraw automatically.";
    const container = document.createElement("div");
    container.id = "chart-container";
    const canvas = document.createElement("canvas");
    canvas.id = "resize-chart";
    container.appendChild(canvas);
    section.append(heading, description, container);
    main.appendChild(section);

    Object.assign(container.style, {
        width: "100%",
        height: "250px",
        minWidth: "200px",
        minHeight: "150px",
        resize: "both",
        overflow: "auto",
        backgroundColor: "#FFFFFF",
        border: "2px solid #722F45",
        padding: "10px"
    });
    canvas.style.display = "block";
    const context = canvas.getContext("2d");

    function drawChart(width, height) {
        canvas.width = width;
        canvas.height = height;
        context.clearRect(0, 0, width, height);
        const values = [40, 75, 55, 90, 65];
        const gap = width / 12;
        const barWidth = gap;
        values.forEach((value, index) => {
            const barHeight = (value / 100) * (height - 20);
            const x = gap / 2 + index * (barWidth + gap);
            const y = height - barHeight;
            context.fillStyle = "#98566B";
            context.fillRect(x, y, barWidth, barHeight);
        });
        console.log(`Chart redrawn: ${Math.round(width)}px × ${Math.round(height)}px`);
    }
    const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            const { width, height } = entry.contentRect;
            drawChart(width - 20, height - 20);
        });
    });
    resizeObserver.observe(container);
}


// 4. matchMedia
// Detect when viewport crosses 768px and 1024px
function initBreakpointListener() {
    [768, 1024].forEach(width => {
        const mediaQuery = window.matchMedia(`(min-width: ${width}px)`);
        mediaQuery.addEventListener("change", event => {
            console.log(`Viewport crossed ${width}px: ${event.matches ? "Above" : "Below"} ${width}px`);
        });
    });
}


// Initialize Task 6 features
export function initObservers() {
    initBlogArticleObserver();
    initDOMChangeLogger();
    initResponsiveChart();
    initBreakpointListener();
}
