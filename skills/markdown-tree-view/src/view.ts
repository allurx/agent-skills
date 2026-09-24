function initializeView(): void {
    const themeToggle = document.getElementById("theme-toggle");
    const helpToggle = document.getElementById("help-toggle");
    const helpPanel = document.getElementById("reading-help");
    const tree = document.getElementById("document-tree");
    const toggleAll = document.getElementById("toggle-all");
    if (
        !(themeToggle instanceof HTMLButtonElement) ||
        !(helpToggle instanceof HTMLButtonElement) ||
        !helpPanel ||
        !tree ||
        !(toggleAll instanceof HTMLButtonElement)
    )
        return;

    {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
        const isDark = () =>
            document.documentElement.dataset["theme"]
                ? document.documentElement.dataset["theme"] === "dark"
                : systemTheme.matches;
        const syncTheme = () => {
            const label = isDark() ? "切换到浅色模式" : "切换到深色模式";
            themeToggle.setAttribute("aria-label", label);
            themeToggle.title = label;
            const color = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
            for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
                meta.content = color;
            }
        };
        themeToggle.addEventListener("click", () => {
            document.documentElement.dataset["theme"] = isDark() ? "light" : "dark";
            syncTheme();
        });
        systemTheme.addEventListener("change", () => {
            if (!document.documentElement.dataset["theme"]) syncTheme();
        });
        syncTheme();
    }

    {
        const helpContent = helpPanel.querySelector<HTMLElement>(".help-content");
        const setHelpOpen = (open: boolean) => {
            helpPanel.hidden = !open;
            helpToggle.setAttribute("aria-expanded", String(open));
        };
        const closeHelp = () => {
            setHelpOpen(false);
            helpToggle.focus({ preventScroll: true });
        };
        helpToggle.addEventListener("click", () => {
            const open = Boolean(helpPanel.hidden);
            setHelpOpen(open);
            if (open) helpContent?.focus({ preventScroll: true });
        });
        helpPanel.querySelector(".help-close")?.addEventListener("click", closeHelp);
        const dismissOutside = (event: Event) => {
            if (!(event.target instanceof Node)) return;
            if (!helpPanel.hidden && !helpPanel.contains(event.target) && !helpToggle.contains(event.target))
                setHelpOpen(false);
        };
        document.addEventListener("pointerdown", dismissOutside);
        document.addEventListener("focusin", dismissOutside);
        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape" || helpPanel.hidden) return;
            event.preventDefault();
            closeHelp();
        });
    }

    initializeTree(tree, toggleAll);
    // Expose enhancements only after every control has initialized successfully.
    themeToggle.disabled = false;
    helpToggle.disabled = false;
    themeToggle.hidden = false;
    helpToggle.hidden = false;
    toggleAll.hidden = false;
}

function initializeTree(tree: HTMLElement, toggleAll: HTMLButtonElement): void {
    const summaryOf = (node: Element | null | undefined): HTMLElement | null =>
        node?.querySelector<HTMLElement>(":scope > summary.tree-row") ?? null;
    const nodes = Array.from(tree.querySelectorAll<HTMLDetailsElement>("details.tree-node"));
    const rows = nodes.flatMap((node) => {
        const row = summaryOf(node);
        return row ? [row] : [];
    });
    let selectedRow: HTMLElement | undefined;

    const parentNode = (node: Element | null | undefined): HTMLDetailsElement | null =>
        node?.parentElement?.closest<HTMLDetailsElement>("details.tree-node") ?? null;

    function visibleAncestor(row: HTMLElement): HTMLElement {
        let visible = row;
        for (let node = parentNode(row.parentElement); node; node = parentNode(node)) {
            if (!node.open) visible = summaryOf(node) ?? visible;
        }
        return visible;
    }

    function selectRow(row: HTMLElement | null | undefined, focus = false): void {
        if (!row) return;
        selectedRow?.classList.remove("is-selected");
        selectedRow = row;
        row.classList.add("is-selected");
        if (focus) row.focus({ preventScroll: true });
    }

    function syncState(): void {
        const expanded = nodes.length > 0 && nodes.every((node) => node.open);
        toggleAll.textContent = expanded ? "全部折叠" : "全部展开";
        toggleAll.setAttribute("aria-expanded", String(expanded));
        toggleAll.disabled = nodes.length === 0;

        const focused = document.activeElement;
        if (focused instanceof Element && tree.contains(focused)) {
            let focusTarget: HTMLElement | null = null;
            for (let node = focused.closest<HTMLDetailsElement>("details.tree-node"); node; node = parentNode(node)) {
                if (!node.open && focused !== summaryOf(node)) focusTarget = summaryOf(node);
            }
            if (focusTarget) selectRow(focusTarget, true);
        }
        if (selectedRow) selectRow(visibleAncestor(selectedRow));
    }

    tree.addEventListener("focusin", (event) => {
        if (!(event.target instanceof Element)) return;
        selectRow(event.target.closest<HTMLElement>("summary.tree-row"));
    });

    tree.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) return;
        const row = event.target.closest<HTMLElement>("summary.tree-row");
        if (!row || event.target.closest("a, button, input, select, textarea")) return;
        selectRow(row, true);
    });

    // Toggle does not bubble; capture also covers native and programmatic changes.
    tree.addEventListener("toggle", syncState, true);

    tree.addEventListener("keydown", (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        const row = event.target;
        if (!(row instanceof HTMLElement) || !row.matches("summary.tree-row")) return;

        const visibleRows = rows.filter((candidate) => visibleAncestor(candidate) === candidate);
        const index = visibleRows.indexOf(row);
        const node = row.parentElement;
        if (!(node instanceof HTMLDetailsElement)) return;
        let target = row;

        switch (event.key) {
            case "ArrowDown":
                target = visibleRows[Math.min(index + 1, visibleRows.length - 1)] ?? row;
                break;
            case "ArrowUp":
                target = visibleRows[Math.max(index - 1, 0)] ?? row;
                break;
            case "Home":
                target = visibleRows[0] ?? row;
                break;
            case "End":
                target = visibleRows.at(-1) ?? row;
                break;
            case "ArrowRight":
                if (!node.open) node.open = true;
                else
                    target =
                        node.querySelector<HTMLElement>(":scope > .children > details.tree-node > summary.tree-row") ??
                        row;
                break;
            case "ArrowLeft":
                if (node.open) node.open = false;
                else target = summaryOf(parentNode(node)) ?? row;
                break;
            case "Enter":
            case " ":
                node.open = !node.open;
                break;
            default:
                return;
        }

        event.preventDefault();
        selectRow(target, true);
        syncState();
        target.scrollIntoView({ block: "nearest" });
    });

    toggleAll.addEventListener("click", () => {
        const expand = !nodes.every((node) => node.open);
        for (const node of nodes) node.open = expand;
        syncState();
    });

    function revealHash(hash = window.location.hash): void {
        if (!hash || hash === "#") return;
        let id: string;
        try {
            id = decodeURIComponent(hash.slice(1));
        } catch {
            return;
        }
        const target = document.getElementById(id);
        if (!target || !tree.contains(target)) return;
        let node = target.closest<HTMLDetailsElement>("details.tree-node");
        if (!node) return;
        const row = summaryOf(node);
        if (!row) return;

        // Reveal anchors immediately so native fragment scrolling sees the final layout.
        tree.classList.add("is-revealing");
        while (node) {
            node.open = true;
            node = parentNode(node);
        }
        target.getBoundingClientRect();
        selectRow(row);
        syncState();
        row.scrollIntoView({ block: "start" });
        requestAnimationFrame(() => {
            tree.classList.remove("is-revealing");
        });
    }

    document.addEventListener("click", (event) => {
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey
        )
            return;
        if (!(event.target instanceof Element)) return;
        const anchor = event.target.closest("a[href]");
        const href = anchor?.getAttribute("href");
        if (href?.startsWith("#")) revealHash(href);
    });
    window.addEventListener("hashchange", () => {
        revealHash();
    });

    selectRow(rows[0]);
    syncState();
    revealHash();
}

initializeView();
