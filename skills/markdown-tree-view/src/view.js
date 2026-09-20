(() => {
  "use strict";

  const tree = document.getElementById("document-tree");
  const toggleAll = document.getElementById("toggle-all");
  if (!tree || !toggleAll) return;

  const summaryOf = (node) => node?.querySelector(":scope > summary.tree-row");
  const nodes = Array.from(tree.querySelectorAll("details.tree-node"));
  const rows = nodes.map(summaryOf);
  let selectedRow;

  const parentNode = (node) => node.parentElement?.closest("details.tree-node");

  function visibleAncestor(row) {
    let visible = row;
    for (let node = parentNode(row.parentElement); node; node = parentNode(node)) {
      if (!node.open) visible = summaryOf(node);
    }
    return visible;
  }

  function selectRow(row, focus = false) {
    if (!row) return;
    selectedRow?.classList.remove("is-selected");
    selectedRow = row;
    row.classList.add("is-selected");
    if (focus) row.focus({ preventScroll: true });
  }

  function syncState() {
    const expanded = nodes.length > 0 && nodes.every((node) => node.open);
    toggleAll.textContent = expanded ? "全部折叠" : "全部展开";
    toggleAll.setAttribute("aria-expanded", String(expanded));
    toggleAll.disabled = nodes.length === 0;

    const focused = document.activeElement;
    if (focused instanceof Element && tree.contains(focused)) {
      let focusTarget;
      for (let node = focused.closest("details.tree-node"); node; node = parentNode(node)) {
        if (!node.open && focused !== summaryOf(node)) focusTarget = summaryOf(node);
      }
      if (focusTarget) selectRow(focusTarget, true);
    }
    if (selectedRow) selectRow(visibleAncestor(selectedRow));
  }

  tree.addEventListener("focusin", (event) => {
    selectRow(event.target.closest("summary.tree-row"));
  });

  tree.addEventListener("click", (event) => {
    const row = event.target.closest("summary.tree-row");
    if (!row || event.target.closest("a, button, input, select, textarea")) return;
    selectRow(row, true);
  });

  // Toggle does not bubble; capture also covers native and programmatic changes.
  tree.addEventListener("toggle", syncState, true);

  tree.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const row = event.target;
    if (!(row instanceof Element) || !row.matches("summary.tree-row")) return;

    const visibleRows = rows.filter((candidate) => visibleAncestor(candidate) === candidate);
    const index = visibleRows.indexOf(row);
    const node = row.parentElement;
    let target = row;

    switch (event.key) {
      case "ArrowDown":
        target = visibleRows[Math.min(index + 1, visibleRows.length - 1)];
        break;
      case "ArrowUp":
        target = visibleRows[Math.max(index - 1, 0)];
        break;
      case "Home":
        target = visibleRows[0];
        break;
      case "End":
        target = visibleRows.at(-1);
        break;
      case "ArrowRight":
        if (!node.open) node.open = true;
        else target = node.querySelector(":scope > .children > details.tree-node > summary.tree-row") ?? row;
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

  function revealHash(hash = window.location.hash) {
    if (!hash || hash === "#") return;
    let id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const target = document.getElementById(id);
    if (!target || !tree.contains(target)) return;
    let node = target.closest("details.tree-node");
    if (!node) return;
    const row = summaryOf(node);

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
    requestAnimationFrame(() => tree.classList.remove("is-revealing"));
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const anchor = event.target.closest("a[href]");
    const href = anchor?.getAttribute("href");
    if (href?.startsWith("#")) revealHash(href);
  });
  window.addEventListener("hashchange", () => revealHash());

  selectRow(rows[0]);
  syncState();
  revealHash();
})();
