/* ============================================================
   DOST DPMIS — GIA Proposal System
   Lightweight runtime that replaces the Claude Design renderer.
   Interprets the omelette-style template (sc-if / sc-for /
   dc-import / {{ expr }}) against the Component view-model.
   ============================================================ */

/* ---- Base class the logic component extends ---- */
class DCLogic {
  setState(patch) {
    const next = (typeof patch === 'function') ? patch(this.state) : patch;
    this.state = Object.assign({}, this.state, next);
    App.render();
  }
}

/* ---- Expression evaluation ---- */
function evalExpr(expr, scope) {
  const keys = Object.keys(scope);
  try {
    // eslint-disable-next-line no-new-func
    return Function(...keys, '"use strict"; return (' + expr + ');')(...keys.map(k => scope[k]));
  } catch (e) {
    return undefined;
  }
}
function pureExpr(str) {
  if (str == null) return null;
  const m = String(str).match(/^\s*\{\{([\s\S]*?)\}\}\s*$/);
  return m ? m[1].trim() : null;
}
function interp(str, scope) {
  return String(str).replace(/\{\{([\s\S]*?)\}\}/g, (_, e) => {
    const v = evalExpr(e.trim(), scope);
    return v == null ? '' : String(v);
  });
}

/* ---- Template interpreter ---- */
function renderChildren(parent, scope, loopIds) {
  const out = [];
  parent.childNodes.forEach(ch => { out.push(...renderNode(ch, scope, loopIds)); });
  return out;
}

function renderNode(node, scope, loopIds) {
  if (node.nodeType === 3) return [document.createTextNode(interp(node.nodeValue, scope))];
  if (node.nodeType !== 1) return [];
  const tag = node.tagName.toLowerCase();

  if (tag === 'sc-if') {
    const e = pureExpr(node.getAttribute('value'));
    return (e && evalExpr(e, scope)) ? renderChildren(node, scope, loopIds) : [];
  }
  if (tag === 'sc-for') {
    const e = pureExpr(node.getAttribute('list'));
    const as = node.getAttribute('as');
    const list = e ? evalExpr(e, scope) : [];
    const out = [];
    (list || []).forEach((item, idx) => {
      const s2 = Object.assign({}, scope); s2[as] = item;
      const ids = loopIds.concat([(item && item.id != null) ? item.id : idx]);
      out.push(...renderChildren(node, s2, ids));
    });
    return out;
  }
  if (tag === 'dc-import') {
    const name = node.getAttribute('name');
    const props = {};
    for (const a of node.attributes) {
      if (a.name === 'name' || a.name.indexOf('hint-') === 0) continue;
      const pe = pureExpr(a.value);
      props[a.name] = pe != null ? evalExpr(pe, scope) : a.value;
    }
    const comp = COMPONENTS[name];
    return comp ? [comp(props)] : [];
  }

  const el = document.createElement(tag);
  let valueBind = null, checkedBind = null, hoverStyle = null;
  for (const a of node.attributes) {
    const n = a.name, lower = n.toLowerCase(), raw = a.value;
    if (lower === 'onclick' || lower === 'oninput' || lower === 'onchange') {
      const pe = pureExpr(raw);
      if (pe) { const fn = evalExpr(pe, scope); if (typeof fn === 'function') el.addEventListener(lower.slice(2), fn); }
      continue;
    }
    if (n === 'style-hover') { hoverStyle = raw; continue; }
    if (n === 'value' && (tag === 'input' || tag === 'textarea' || tag === 'select')) { valueBind = raw; continue; }
    if (n === 'checked' && tag === 'input') { checkedBind = raw; continue; }
    if (lower === 'readonly') { el.readOnly = true; continue; }
    el.setAttribute(n, interp(raw, scope));
  }

  renderChildren(node, scope, loopIds).forEach(c => el.appendChild(c));

  if (valueBind != null) {
    const pe = pureExpr(valueBind);
    const v = pe != null ? evalExpr(pe, scope) : interp(valueBind, scope);
    el.value = v == null ? '' : v;
    el.setAttribute('data-key', (pe || valueBind) + '#' + loopIds.join(','));
  }
  if (checkedBind != null) {
    const pe = pureExpr(checkedBind);
    el.checked = !!(pe != null ? evalExpr(pe, scope) : checkedBind);
  }
  if (hoverStyle) {
    const base = el.getAttribute('style') || '';
    el.addEventListener('mouseenter', () => el.setAttribute('style', base + ';' + hoverStyle));
    el.addEventListener('mouseleave', () => el.setAttribute('style', base));
  }
  return [el];
}

/* ============================================================
   dc-import components (authored to match the row view-models)
   ============================================================ */
function h(tag, style, text) {
  const e = document.createElement(tag);
  if (style) e.setAttribute('style', style);
  if (text != null) e.textContent = text;
  return e;
}

function proposalTable(props) {
  const rows = props.rows || [];
  const wrap = h('div', 'background:#fff;border:1px solid #e0e5ee;border-radius:11px;overflow:hidden');
  if (!rows.length) {
    wrap.appendChild(h('div', 'padding:40px;text-align:center;color:#7c8aa3', 'No proposals yet.'));
    return wrap;
  }
  const table = h('table', 'width:100%;border-collapse:collapse');
  const thead = h('thead'); const htr = h('tr', 'background:#f6f8fb');
  ['Proposal', 'Program', 'Budget', 'Status', 'Created', ''].forEach((c, i) => {
    const th = h('th', 'padding:11px 20px;font-size:12px;color:#7c8aa3;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;text-align:' + (i === 2 ? 'right' : 'left'), c);
    htr.appendChild(th);
  });
  thead.appendChild(htr); table.appendChild(thead);
  const tbody = h('tbody');
  rows.forEach(r => {
    const tr = h('tr', 'border-top:1px solid #eef1f6;cursor:pointer');
    tr.addEventListener('mouseenter', () => tr.style.background = '#fafbfe');
    tr.addEventListener('mouseleave', () => tr.style.background = '');
    if (typeof r.onOpen === 'function') tr.addEventListener('click', r.onOpen);

    const c1 = h('td', 'padding:14px 20px');
    c1.appendChild(h('div', 'font-weight:600;font-size:14px;color:#16213c', r.title));
    c1.appendChild(h('div', "font-family:'IBM Plex Mono';font-size:12px;color:#7c8aa3;margin-top:2px", r.ref + ' · ' + r.by));
    tr.appendChild(c1);

    tr.appendChild(h('td', 'padding:14px 20px;font-size:13px;color:#6b7790', r.program));
    tr.appendChild(h('td', "padding:14px 20px;text-align:right;font-family:'IBM Plex Mono';font-size:13px;color:#16213c;font-weight:600", r.amountStr));

    const c4 = h('td', 'padding:14px 20px');
    c4.appendChild(h('span', 'background:' + r.badgeBg + ';color:' + r.badgeFg + ';font-size:12px;font-weight:700;padding:4px 11px;border-radius:20px;white-space:nowrap', r.badgeLabel));
    tr.appendChild(c4);

    tr.appendChild(h('td', 'padding:14px 20px;font-size:13px;color:#8a95a8;white-space:nowrap', r.created));

    const c6 = h('td', 'padding:14px 20px;text-align:right;white-space:nowrap');
    c6.appendChild(h('span', 'font-size:13px;color:#1b56b0;font-weight:700', r.cta + ' ›'));
    tr.appendChild(c6);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody); wrap.appendChild(table);
  return wrap;
}

function budgetSection(props) {
  const rows = props.rows || [];
  const wrap = h('div', 'border:1px solid #e6ebf3;border-radius:11px;overflow:hidden');
  const head = h('div', 'background:#f6f8fb;padding:13px 16px;border-bottom:1px solid #e6ebf3');
  head.appendChild(h('div', 'font-weight:700;font-size:14px;color:#16213c', props.title));
  head.appendChild(h('div', 'font-size:12px;color:#7c8aa3;margin-top:2px', props.subtitle));
  wrap.appendChild(head);

  const hdr = h('div', 'display:grid;grid-template-columns:2.4fr 1fr 1.2fr 40px;background:#fbfcfe;font-size:11px;font-weight:700;color:#7c8aa3;text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid #eef1f6');
  ['Description', 'Amount (₱)', 'Fund source', ''].forEach(t => hdr.appendChild(h('div', 'padding:8px 14px', t)));
  wrap.appendChild(hdr);

  rows.forEach(r => {
    const tr = h('div', 'display:grid;grid-template-columns:2.4fr 1fr 1.2fr 40px;border-top:1px solid #f1f4f9;align-items:center');

    const desc = h('input', 'border:none;padding:11px 14px;font-size:13.5px;background:transparent');
    desc.placeholder = 'Item description'; desc.value = r.desc || '';
    desc.setAttribute('data-key', 'budget#' + r.id + '#desc');
    if (r.onDesc) desc.addEventListener('input', r.onDesc);
    tr.appendChild(desc);

    const amt = h('input', "border:none;border-left:1px solid #f1f4f9;padding:11px 14px;font-size:13.5px;background:transparent;font-family:'IBM Plex Mono';text-align:right");
    amt.placeholder = '0'; amt.value = r.amount || '';
    amt.setAttribute('data-key', 'budget#' + r.id + '#amount');
    if (r.onAmount) amt.addEventListener('input', r.onAmount);
    tr.appendChild(amt);

    const sel = h('select', 'border:none;border-left:1px solid #f1f4f9;padding:11px 14px;font-size:13px;background:transparent;color:#1a2238');
    (r.opts || ['DOST']).forEach(o => { const op = h('option', null, o); op.value = o; sel.appendChild(op); });
    sel.value = r.source;
    if (r.onSource) sel.addEventListener('change', r.onSource);
    tr.appendChild(sel);

    const rm = h('button', 'background:none;border:none;border-left:1px solid #f1f4f9;color:#c0392b;cursor:pointer;font-size:16px;height:100%;font-family:inherit', '×');
    if (r.onRemove) rm.addEventListener('click', r.onRemove);
    tr.appendChild(rm);

    wrap.appendChild(tr);
  });

  const foot = h('div', 'display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 16px;border-top:1px solid #eef1f6;background:#fbfcfe');
  const add = h('button', 'background:#fff;border:1px dashed #c2cee0;border-radius:8px;padding:8px 14px;color:#1b56b0;font-weight:700;font-size:12.5px;cursor:pointer;font-family:inherit', '+ Add line item');
  if (props.onadd) add.addEventListener('click', props.onadd);
  foot.appendChild(add);
  const sub = h('div', 'font-size:13px;color:#42506b;font-weight:700');
  sub.innerHTML = 'Subtotal: <span style="font-family:\'IBM Plex Mono\';color:#16213c">' + (props.subtotal || '₱0') + '</span>';
  foot.appendChild(sub);
  wrap.appendChild(foot);
  return wrap;
}

const COMPONENTS = { ProposalTable: proposalTable, BudgetSection: budgetSection };

/* ============================================================
   App bootstrap + render loop (with focus preservation)
   ============================================================ */
const App = {
  tpl: null, root: null, comp: null,
  render() {
    const active = document.activeElement;
    let key = null, ss = null, se = null;
    if (active && active.getAttribute && active.getAttribute('data-key')) {
      key = active.getAttribute('data-key');
      try { ss = active.selectionStart; se = active.selectionEnd; } catch (e) { /* non-text input */ }
    }
    const scope = Object.assign({}, this.comp.renderVals());
    const frag = document.createDocumentFragment();
    renderChildren(this.tpl.content, scope, []).forEach(n => frag.appendChild(n));
    this.root.innerHTML = '';
    this.root.appendChild(frag);
    if (key) {
      const el = this.root.querySelector('[data-key="' + key.replace(/(["\\])/g, '\\$1') + '"]');
      if (el) { el.focus(); try { if (ss != null) el.setSelectionRange(ss, se); } catch (e) { /* */ } }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.tpl = document.getElementById('app-template');
  App.root = document.getElementById('app');
  App.comp = new Component();
  App.render();
});
