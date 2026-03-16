/**
 * ╔══════════════════════════════════════════════════════╗
 * ║         ANTIGRAVITY INSPECTOR LAYER v1.0             ║
 * ║   Drop this script into any project to enable        ║
 * ║   visual element selection + AI-ready prompts        ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * HOW TO USE:
 * 1. Add <script src="antigravity-editor.js"></script> to your HTML
 * 2. Click the "✦ Edit Mode" button that appears bottom-right
 * 3. Hover over any element to inspect it
 * 4. Click to get a ready-made prompt — copy & paste it to Antigravity!
 */

(function () {
  'use strict';

  // ─── Inject Styles ─────────────────────────────────────────────────────────
  const css = `
    #ag-toggle-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999998;
      padding: 12px 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 50px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(99,102,241,0.5);
      transition: all 0.2s ease;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #ag-toggle-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(99,102,241,0.6);
    }
    #ag-toggle-btn.active {
      background: linear-gradient(135deg, #ef4444, #f97316);
      box-shadow: 0 4px 24px rgba(239,68,68,0.5);
    }
    #ag-toggle-btn.active:hover {
      box-shadow: 0 8px 32px rgba(239,68,68,0.6);
    }
    #ag-highlight-box {
      position: fixed;
      pointer-events: none;
      z-index: 999997;
      border: 2px solid #6366f1;
      border-radius: 4px;
      background: rgba(99, 102, 241, 0.08);
      transition: all 0.1s ease;
      display: none;
    }
    #ag-highlight-box.selected {
      border-color: #8b5cf6;
      background: rgba(139, 92, 246, 0.12);
      border-width: 2px;
      border-style: dashed;
    }
    #ag-label {
      position: fixed;
      z-index: 999999;
      background: #6366f1;
      color: #fff;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      pointer-events: none;
      display: none;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      white-space: nowrap;
    }
    #ag-panel {
      position: fixed;
      top: 0;
      right: -420px;
      width: 380px;
      height: 100vh;
      background: #0f0f13;
      border-left: 1px solid rgba(255,255,255,0.08);
      z-index: 999996;
      font-family: 'Inter', system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: -20px 0 60px rgba(0,0,0,0.5);
    }
    #ag-panel.open {
      right: 0;
    }
    body.ag-panel-open {
      margin-right: 380px;
      transition: margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    body {
      transition: margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #ag-panel-header {
      padding: 24px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    #ag-panel-header h2 {
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #6366f1, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    #ag-close-btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      color: #9ca3af;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }
    #ag-close-btn:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
    #ag-panel-body {
      padding: 24px;
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .ag-section-label {
      color: #6b7280;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .ag-info-box {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 14px 16px;
    }
    .ag-element-type {
      color: #a78bfa;
      font-size: 12px;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      word-break: break-all;
      line-height: 1.5;
    }
    .ag-element-role {
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      margin-top: 6px;
    }
    .ag-element-path {
      color: #6366f1;
      font-size: 11px;
      font-family: 'Courier New', monospace;
      margin-top: 6px;
      opacity: 0.8;
      word-break: break-all;
      line-height: 1.5;
    }
    .ag-element-content {
      color: #9ca3af;
      font-size: 13px;
      margin-top: 6px;
      line-height: 1.5;
      word-break: break-word;
    }
    .ag-prompt-box {
      background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1));
      border: 1px solid rgba(99,102,241,0.3);
      border-radius: 10px;
      padding: 16px;
    }
    .ag-prompt-text {
      color: #e5e7eb;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
    }
    #ag-copy-btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    #ag-copy-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(99,102,241,0.4);
    }
    #ag-copy-btn.copied {
      background: linear-gradient(135deg, #10b981, #059669);
      box-shadow: 0 6px 20px rgba(16,185,129,0.4);
    }
    #ag-instructions {
      padding: 20px 24px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .ag-instruction-step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      color: #6b7280;
      font-size: 12px;
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .ag-step-num {
      background: rgba(99,102,241,0.2);
      color: #818cf8;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 1px;
    }
    #ag-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      padding: 40px;
      gap: 12px;
    }
    #ag-empty-icon {
      font-size: 48px;
      opacity: 0.3;
    }
    #ag-empty-text {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.6;
    }
    body.ag-editor-active * {
      cursor: crosshair !important;
    }
    body.ag-editor-active #ag-toggle-btn,
    body.ag-editor-active #ag-panel,
    body.ag-editor-active #ag-panel * {
      cursor: default !important;
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ─── Elements ────────────────────────────────────────────────────────────────
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'ag-toggle-btn';
  toggleBtn.innerHTML = '✦ Edit Mode';

  const highlightBox = document.createElement('div');
  highlightBox.id = 'ag-highlight-box';

  const label = document.createElement('div');
  label.id = 'ag-label';

  const panel = document.createElement('div');
  panel.id = 'ag-panel';
  panel.innerHTML = `
    <div id="ag-panel-header">
      <h2>✦ Antigravity Inspector</h2>
      <button id="ag-close-btn">✕</button>
    </div>
    <div id="ag-panel-body">
      <div id="ag-empty-state">
        <div id="ag-empty-icon">🎯</div>
        <div id="ag-empty-text">Click on any element on the page to inspect it and generate an edit prompt.</div>
      </div>
      <div id="ag-content" style="display:none; flex-direction:column; gap:20px;">
        <div>
          <div class="ag-section-label">Selected Element</div>
          <div class="ag-info-box">
            <div class="ag-element-type" id="ag-el-tag"></div>
            <div class="ag-element-role" id="ag-el-role"></div>
            <div class="ag-element-path" id="ag-el-path"></div>
            <div class="ag-element-content" id="ag-el-content"></div>
          </div>
        </div>
        <div>
          <div class="ag-section-label">📋 Antigravity Prompt</div>
          <div class="ag-prompt-box">
            <p class="ag-prompt-text" id="ag-prompt-text"></p>
          </div>
        </div>
        <button id="ag-copy-btn">📋 Copy Prompt to Clipboard</button>
      </div>
    </div>
    <div id="ag-instructions">
      <div class="ag-instruction-step"><div class="ag-step-num">1</div><span>Click any element on the page</span></div>
      <div class="ag-instruction-step"><div class="ag-step-num">2</div><span>Copy the generated prompt</span></div>
      <div class="ag-instruction-step"><div class="ag-step-num">3</div><span>Paste it to Antigravity to make changes</span></div>
    </div>
  `;

  document.body.appendChild(toggleBtn);
  document.body.appendChild(highlightBox);
  document.body.appendChild(label);
  document.body.appendChild(panel);

  // ─── Ignored Elements ────────────────────────────────────────────────────────
  const IGNORED_IDS = ['ag-toggle-btn', 'ag-highlight-box', 'ag-label', 'ag-panel'];
  function isAgElement(el) {
    return el.closest('#ag-panel') || el.closest('#ag-toggle-btn');
  }

  // ─── State ───────────────────────────────────────────────────────────────────
  let editorActive = false;
  let currentSelected = null;
  let currentPrompt = '';
  let savedFixedStyles = [];

  // ─── Element Description Logic ───────────────────────────────────────────────
  function getElementRole(el) {
    const tag = el.tagName.toLowerCase();
    const classes = [...el.classList].join(' ').toLowerCase();
    const id = (el.id || '').toLowerCase();
    const parentClasses = el.parentElement ? [...el.parentElement.classList].join(' ').toLowerCase() : '';

    if (el.closest('nav') || classes.includes('nav') || id.includes('nav')) return 'Navigation';
    if (el.closest('footer') || classes.includes('footer') || id.includes('footer')) return 'Footer';
    if (classes.includes('hero') || id.includes('hero') || parentClasses.includes('hero')) return 'Hero Section';
    if (classes.includes('card') || parentClasses.includes('card') || id.includes('card')) return 'Card';
    if (el.closest('header') || classes.includes('header') || id.includes('header')) return 'Header';
    if (classes.includes('testimonial') || parentClasses.includes('testimonial')) return 'Testimonial';
    if (classes.includes('feature') || parentClasses.includes('feature')) return 'Feature';
    if (classes.includes('banner') || classes.includes('cta')) return 'Banner / CTA';
    if (classes.includes('section') || tag === 'section') return 'Section';
    if (tag === 'nav') return 'Navigation';
    if (tag === 'footer') return 'Footer';
    if (tag === 'header') return 'Header';
    if (tag === 'main') return 'Main Content';
    return 'Page Element';
  }

  function getTagLabel(el) {
    const tag = el.tagName.toLowerCase();
    const map = {
      h1: 'H1 Heading', h2: 'H2 Heading', h3: 'H3 Heading',
      h4: 'H4 Heading', h5: 'H5 Heading', h6: 'H6 Heading',
      p: 'Paragraph', a: 'Link', button: 'Button',
      img: 'Image', span: 'Text Span', li: 'List Item',
      ul: 'List', ol: 'Ordered List', div: 'Section Block',
      input: 'Input Field', textarea: 'Text Area', label: 'Label',
      section: 'Section', nav: 'Navigation', header: 'Header',
      footer: 'Footer', main: 'Main Content', article: 'Article',
      aside: 'Sidebar', figure: 'Figure', figcaption: 'Caption',
    };
    return map[tag] || `<${tag}>`;
  }

  function generatePrompt(el) {
    const tag = el.tagName.toLowerCase();
    const role = getElementRole(el);
    const text = el.textContent.trim().replace(/\s+/g, ' ').substring(0, 80);
    const src = el.src || el.getAttribute('src');
    const alt = el.getAttribute('alt') || '';
    const href = el.getAttribute('href');
    const placeholder = el.getAttribute('placeholder');
    const selector = getDomPath(el);
    const selectorLine = `Element selector: ${selector}`;

    if (tag === 'img') {
      return `Change the ${role} image${alt ? ` (alt: "${alt}")` : ''} to a new image.\n${selectorLine}\n\nDescribe what the new image should show: [your description here]`;
    }
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
      return `Change the ${role} ${getTagLabel(el)} that currently says:\n"${text}"\n${selectorLine}\n\nNew text: [your new heading here]`;
    }
    if (tag === 'p') {
      return `Change the ${role} paragraph that currently says:\n"${text}"\n${selectorLine}\n\nNew text: [your new paragraph here]`;
    }
    if (tag === 'a' || tag === 'button') {
      return `Change the ${role} ${tag} that says "${text}"${href && href !== '#' ? ` (links to: ${href})` : ''}.\n${selectorLine}\n\nNew label: [your new label]\nNew link (if applicable): [new URL]`;
    }
    if (tag === 'span') {
      return `Change the ${role} text span that says:\n"${text}"\n${selectorLine}\n\nNew text: [your new text here]`;
    }
    if (tag === 'input' || tag === 'textarea') {
      return `Update the ${role} input field${placeholder ? ` (placeholder: "${placeholder}")` : ''}.\n${selectorLine}\n\nWhat to change: [describe the change]`;
    }
    if (tag === 'li') {
      return `Change the ${role} list item that says:\n"${text}"\n${selectorLine}\n\nNew text: [your new list item]`;
    }
    if (tag === 'div' || tag === 'section' || tag === 'article') {
      return `Modify the ${role} section block.\nThis block contains: "${text.substring(0, 60)}..."\n${selectorLine}\n\nDescribe what you'd like to change: [your change description]`;
    }
    return `Edit the ${role} ${getTagLabel(el)} element.\nCurrent content: "${text.substring(0, 60)}"\n${selectorLine}\n\nDescribe what to change: [your change description]`;
  }

  function getContentPreview(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'img') {
      const src = el.src || el.getAttribute('src') || '';
      const alt = el.getAttribute('alt') || 'No alt text';
      return `Image: ${src.split('/').pop() || 'embedded'}\nAlt: "${alt}"`;
    }
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    return text.length > 100 ? text.substring(0, 100) + '…' : text || '(empty)';
  }

  // Returns the full opening tag with id and classes shown
  function getFullTag(el) {
    const tag = el.tagName.toLowerCase();
    let str = `<${tag}`;
    if (el.id) str += ` id="${el.id}"`;
    if (el.classList.length > 0) str += ` class="${[...el.classList].join(' ')}"`;
    str += '>';
    return str;
  }

  // Builds a short CSS selector path up to 4 levels deep
  function getDomPath(el) {
    const parts = [];
    let current = el;
    let depth = 0;
    while (current && current !== document.body && depth < 4) {
      const tag = current.tagName.toLowerCase();
      let part = tag;
      if (current.id) {
        part += `#${current.id}`;
        parts.unshift(part);
        break; // ID is globally unique — stop here
      }
      if (current.classList.length > 0) {
        part += '.' + [...current.classList].slice(0, 2).join('.');
      } else {
        // No class — add nth-of-type to disambiguate
        const siblings = current.parentElement
          ? [...current.parentElement.children].filter(c => c.tagName === current.tagName)
          : [];
        if (siblings.length > 1) {
          part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
        }
      }
      parts.unshift(part);
      current = current.parentElement;
      depth++;
    }
    return parts.join(' > ');
  }

  // ─── Inspector Logic ─────────────────────────────────────────────────────────
  function positionHighlight(el) {
    const rect = el.getBoundingClientRect();
    highlightBox.style.display = 'block';
    highlightBox.style.top = rect.top + 'px';
    highlightBox.style.left = rect.left + 'px';
    highlightBox.style.width = rect.width + 'px';
    highlightBox.style.height = rect.height + 'px';

    label.style.display = 'block';
    label.textContent = getTagLabel(el);
    label.style.top = Math.max(0, rect.top - 24) + 'px';
    label.style.left = rect.left + 'px';
  }

  function onMouseOver(e) {
    if (!editorActive || isAgElement(e.target)) return;
    e.stopPropagation();
    // Only show the hover label if nothing is selected yet
    if (!highlightBox.classList.contains('selected')) {
      positionHighlight(e.target);
      label.style.display = 'block';
    }
  }

  function onClick(e) {
    if (!editorActive || isAgElement(e.target)) return;
    e.preventDefault();
    e.stopPropagation();

    currentSelected = e.target;
    highlightBox.classList.add('selected');
    positionHighlight(e.target);
    // Hide the floating label once an element is selected — the panel shows the info
    label.style.display = 'none';

    const role = getElementRole(e.target);
    const tagLabel = getTagLabel(e.target);

    document.getElementById('ag-el-tag').textContent = getFullTag(e.target);
    document.getElementById('ag-el-role').textContent = `${role} · ${tagLabel}`;
    document.getElementById('ag-el-path').textContent = getDomPath(e.target);
    document.getElementById('ag-el-content').textContent = getContentPreview(e.target);

    currentPrompt = generatePrompt(e.target);
    document.getElementById('ag-prompt-text').textContent = currentPrompt;

    document.getElementById('ag-empty-state').style.display = 'none';
    document.getElementById('ag-content').style.display = 'flex';

    openPanel();

    const copyBtn = document.getElementById('ag-copy-btn');
    copyBtn.textContent = '📋 Copy Prompt to Clipboard';
    copyBtn.classList.remove('copied');
  }

  function onMouseOut(e) {
    if (!editorActive || isAgElement(e.target)) return;
    if (!highlightBox.classList.contains('selected')) {
      highlightBox.style.display = 'none';
      label.style.display = 'none';
    }
  }

  // ─── Fixed Element Adjuster ─────────────────────────────────────────────────
  // position:fixed elements ignore body margin-right, so we shift them manually
  const PANEL_WIDTH = 380;
  const AG_SKIP_IDS = new Set(['ag-panel', 'ag-highlight-box', 'ag-label']);

  function adjustFixedElements() {
    savedFixedStyles = [];
    document.querySelectorAll('*').forEach(el => {
      // Skip the panel itself and its children
      if (AG_SKIP_IDS.has(el.id) || el.closest('#ag-panel')) return;
      const computed = window.getComputedStyle(el);
      if (computed.position !== 'fixed') return;
      const rightVal = computed.right;
      // 'auto' means not right-anchored — skip
      if (rightVal === 'auto') return;
      const rightNum = parseFloat(rightVal);
      savedFixedStyles.push({
        el,
        originalRight: el.style.right,
        originalTransition: el.style.transition
      });
      el.style.transition = 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.right = (rightNum + PANEL_WIDTH) + 'px';
    });
  }

  function restoreFixedElements() {
    savedFixedStyles.forEach(({ el, originalRight, originalTransition }) => {
      el.style.right = originalRight;
      // Remove transition override after animation completes
      setTimeout(() => { el.style.transition = originalTransition; }, 310);
    });
    savedFixedStyles = [];
  }

  // ─── Toggle ──────────────────────────────────────────────────────────────────
  function openPanel() {
    // Only do the layout shift if the panel isn't already open
    if (!panel.classList.contains('open')) {
      panel.classList.add('open');
      document.body.classList.add('ag-panel-open');
      adjustFixedElements();
      // Reposition highlight after layout shift settles
      setTimeout(() => {
        if (currentSelected) positionHighlight(currentSelected);
      }, 320);
    } else {
      // Panel already open — just reposition the highlight immediately
      if (currentSelected) positionHighlight(currentSelected);
    }
  }

  function closePanel() {
    panel.classList.remove('open');
    document.body.classList.remove('ag-panel-open');
    restoreFixedElements();
  }

  function activateEditor() {
    editorActive = true;
    toggleBtn.classList.add('active');
    toggleBtn.innerHTML = '✕ Exit Edit Mode';
    document.body.classList.add('ag-editor-active');
    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('mouseout', onMouseOut, true);
    openPanel();
  }

  function deactivateEditor() {
    editorActive = false;
    toggleBtn.classList.remove('active');
    toggleBtn.innerHTML = '✦ Edit Mode';
    document.body.classList.remove('ag-editor-active');
    document.removeEventListener('mouseover', onMouseOver, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('mouseout', onMouseOut, true);
    highlightBox.style.display = 'none';
    highlightBox.classList.remove('selected');
    label.style.display = 'none';
    closePanel();
    currentSelected = null;
  }

  toggleBtn.addEventListener('click', () => {
    editorActive ? deactivateEditor() : activateEditor();
  });

  document.getElementById('ag-close-btn').addEventListener('click', () => {
    deactivateEditor();
  });

  // Also handle panel click to open when element selected (if panel was closed separately)
  panel.addEventListener('transitionend', () => {
    if (currentSelected && panel.classList.contains('open')) {
      positionHighlight(currentSelected);
    }
  });

  // ─── Copy Button ─────────────────────────────────────────────────────────────
  document.getElementById('ag-copy-btn').addEventListener('click', () => {
    if (!currentPrompt) return;
    navigator.clipboard.writeText(currentPrompt).then(() => {
      const btn = document.getElementById('ag-copy-btn');
      btn.innerHTML = '✓ Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = '📋 Copy Prompt to Clipboard';
        btn.classList.remove('copied');
      }, 2000);
    });
  });

  // Reposition highlight on scroll/resize
  window.addEventListener('scroll', () => {
    if (currentSelected) positionHighlight(currentSelected);
  }, true);
  window.addEventListener('resize', () => {
    if (currentSelected) positionHighlight(currentSelected);
  });

  console.log('%c✦ Antigravity Inspector Loaded', 'color:#6366f1;font-weight:bold;font-size:14px;');
  console.log('%cClick "Edit Mode" to start inspecting elements.', 'color:#9ca3af;font-size:12px;');
})();
