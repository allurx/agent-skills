# Project **Handbook** & `Notes`

This fictional handbook demonstrates an offline Markdown tree. Its text is a public example, not a personal instruction file.

The formatted heading supplies the plain-text tab title, `Project Handbook & Notes · Markdown Tree View`. The page includes its own favicon and a neutral reading-view description.

## Working agreements

Keep changes small enough to review. Explain **what changed** and *why*, and use `--check` when checking generated documentation.

1. Read the relevant source and documentation.
   - Keep existing user changes.
   - State any assumptions that affect behavior.
2. Implement the requested change.
   1. Run the relevant checks.
   2. Report the result and remaining limits.

### Review checklist

- [x] Describe the intended behavior.
- [x] Keep the example self-contained.
- [ ] Review the generated tree.

> A quoted heading belongs to this quotation:
>
> #### This is quoted content
>
> It does not create a separate tree section.

### Review checklist

Repeated titles are valid. Each section has its own stable position-based identifier.

##### A deeper detail

This heading intentionally skips level four. The tree places it under the nearest preceding heading with a lower level.

## Commands and examples

The following is a code sample. Its `#` characters are not document headings.

```shell
# Generate an offline page.
node scripts/markdown-tree-view.mjs --input examples/guide.md --output work/guide.html

# Check whether that page is current, without writing files.
node scripts/markdown-tree-view.mjs --input examples/guide.md --output work/guide.html --check
```

Special characters remain readable: `<tag>`, `A & B`, `"quotes"`, and Unicode such as 中文 and 🌿.

```html
<script>console.log("This is displayed as code.");</script>
```

## Reference table

| Item | Expected behavior | Status |
| :--- | :--- | ---: |
| Headings | Preserve source order and actual levels | Ready |
| Content | Keep headings and body text in the tree | Ready |
| Images | Show descriptive text and their destination | Documented |

## Links and resources

An [external link](https://example.com/) opens only when selected. A [local section link](#section-2) can refer to a generated section identifier.

Relative resources remain understandable as text: [related document](./related.md).

![Example diagram](./assets/example-diagram.svg)

The image above is represented by its description and path; this example does not need an image file or a network request.

<strong>Raw HTML is displayed as text instead of executing or changing the page.</strong>

Appendix
--------

This Setext heading uses the same level as a `##` heading. Its text and position are preserved in the tree.

- **Reading:** Select a row, expand a section, and follow its children.
- **Keyboard:** Try the arrow keys, Home, End, Enter, and Space while a section row has focus.
- **Appearance:** Try light and dark mode and a narrow browser window. Supporting browsers also update their theme color.
- **Without scripts:** The content and native section toggles remain available; script-dependent buttons stay hidden.
