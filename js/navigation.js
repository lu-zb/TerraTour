(function () {
    const STATE_KEY = "terraTourNavigation";
    const PENDING_KEY = "terra-tour:pending-navigation";
    const pageKey = location.pathname + location.search;
    const navigationType = performance.getEntriesByType("navigation")[0]?.type;

    let pageState = history.state?.[STATE_KEY];

    if (!pageState || pageState.page !== pageKey) {
        let from = null;

        try {
            const pending = JSON.parse(sessionStorage.getItem(PENDING_KEY) || "null");
            sessionStorage.removeItem(PENDING_KEY);

            if (pending?.target === location.href && Date.now() - pending.time < 15000) {
                from = pending.from;
            }
        } catch {
            // 存储不可用时仍保留普通链接跳转。
        }

        pageState = { page: pageKey, from, position: null, view: {} };
    }

    function writeState() {
        try {
            history.replaceState({ ...history.state, [STATE_KEY]: pageState }, "");
        } catch {
            // history 不可用时仍保留浏览器默认行为。
        }
    }

    function savePosition() {
        pageState = {
            ...pageState,
            position: { x: window.scrollX, y: window.scrollY }
        };
        writeState();
    }

    writeState();

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    let interrupted = false;
    let shouldRestore = navigationType === "back_forward" || navigationType === "reload";

    ["wheel", "touchstart", "pointerdown", "keydown"].forEach(type => {
        window.addEventListener(type, () => {
            interrupted = true;
        }, { passive: true });
    });

    function restorePosition() {
        if (!shouldRestore || interrupted || !pageState.position) return;

        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;

        // 返回时临时关闭全局平滑滚动，直接回到离开前的位置。
        root.style.scrollBehavior = "auto";
        window.scrollTo(pageState.position.x, pageState.position.y);

        requestAnimationFrame(() => {
            root.style.scrollBehavior = previousScrollBehavior;
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        restorePosition();
        requestAnimationFrame(restorePosition);
        document.fonts?.ready.then(restorePosition);
    });

    window.addEventListener("load", restorePosition);

    window.addEventListener("pageshow", event => {
        if (event.persisted) {
            interrupted = false;
            shouldRestore = true;
        }
        restorePosition();
    });

    window.addEventListener("pagehide", savePosition);

    document.addEventListener("click", event => {
        const link = event.target.closest("a[href]");

        if (
            !link || event.defaultPrevented || event.button !== 0 ||
            event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
            link.hasAttribute("download") || (link.target && link.target !== "_self")
        ) return;

        if (link.hasAttribute("data-return")) {
            if (pageState.from && history.length > 1) {
                event.preventDefault();
                history.back();
            }
            return;
        }

        const target = new URL(link.href);

        if (
            target.origin !== location.origin ||
            (target.pathname === location.pathname && target.search === location.search) ||
            !target.pathname.endsWith(".html")
        ) return;

        savePosition();

        try {
            sessionStorage.setItem(PENDING_KEY, JSON.stringify({
                target: target.href,
                from: location.href,
                time: Date.now()
            }));
        } catch {
            // 页面链接仍可正常使用。
        }
    });

    window.TerraNavigation = {
        getView() {
            return pageState.view || {};
        },
        saveView(view) {
            pageState = {
                ...pageState,
                view: { ...pageState.view, ...view }
            };
            writeState();
        }
    };
})();
