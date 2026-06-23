class Component extends DCLogic {
  _uid = 1000;
  SDGS = ['1 No Poverty', '2 Zero Hunger', '3 Good Health', '4 Quality Education', '5 Gender Equality', '6 Clean Water', '7 Clean Energy', '8 Decent Work', '9 Industry &amp; Innovation', '10 Reduced Inequality', '11 Sustainable Cities', '12 Responsible Consumption', '13 Climate Action', '14 Life Below Water', '15 Life on Land', '16 Peace &amp; Justice', '17 Partnerships'];
  NARR = [
    { key: 'summary', label: 'Executive Summary', ph: 'Brief overview of the project, its goals, and expected impact...' },
    { key: 'rationale', label: 'Significance / Rationale', ph: 'Why this project matters and the problem it addresses...' },
    { key: 'objectives', label: 'Objectives', ph: 'General and specific objectives of the project...' },
    { key: 'methodology', label: 'Methodology', ph: 'Approach, methods, and activities to be undertaken...' },
    { key: 'limitations', label: 'Scope & Limitations', ph: 'Boundaries of the study and what it does not cover...', rd: true },
    { key: 'risks', label: 'List of Risks', ph: 'Identified risks and corresponding mitigation measures...', rd: true },
    { key: 'outputs', label: 'Expected Outputs', ph: 'Deliverables, publications, prototypes, or technologies...' },
  ];
  DOCS = [
    { key: 'endorsement', name: 'Endorsement from Head of Agency', mand: true },
    { key: 'capsule', name: 'Capsule Proposal', mand: true },
    { key: 'workplan', name: 'Workplan / Gantt Chart', mand: true },
    { key: 'cv', name: 'Curriculum Vitae of Project Leader', mand: true },
    { key: 'counterpart', name: 'Certification of Counterpart Funding', mand: true },
    { key: 'support', name: 'Letters of Support', mand: false },
    { key: 'ethics', name: 'Ethics Clearance (if applicable)', mand: false },
    { key: 'moa', name: 'Draft Memorandum of Agreement', mand: false },
  ];
  TYPES = [
    { key: 'rd_project', name: 'R&D Project', desc: 'A single research and development project.', on: true },
    { key: 'startup_rd', name: 'Startup R&D Project', desc: 'R&D project with startup and commercialization components.', on: false },
    { key: 'non_rd_project', name: 'Non-R&D Project', desc: 'S&T services, capacity building, or facilities.', on: false },
    { key: 'rd_program', name: 'R&D Program', desc: 'Two or more component R&D projects.', on: false },
    { key: 'startup_rd_program', name: 'Startup R&D Program', desc: 'Program of startup R&D projects.', on: false },
    { key: 'non_rd_program', name: 'Non-R&D Program', desc: 'Program of non-R&D component projects.', on: false },
  ];

  state = {
    screen: 'login', role: 'user', selectedId: null, remarks: '', backTo: 'dash',
    wz: null, trackCode: '', trackResult: null, justSubmittedId: null,
    proposals: this.seedProposals(),
    pending: [
      { id: 101, name: 'Dr. Elena Marquez', email: 'emarquez@region6.dost.gov', role: 'Proponent', unit: 'Region VI · W. Visayas', requested: 'Jun 21, 2026' },
      { id: 102, name: 'Engr. Paolo Villanueva', email: 'pvillanueva@central.dost.gov', role: 'Administrator', unit: 'Central Office · GIA', requested: 'Jun 20, 2026' },
      { id: 103, name: 'Ms. Carmen Diaz', email: 'cdiaz@sei.dost.gov', role: 'Proponent', unit: 'Science Education Inst.', requested: 'Jun 19, 2026' },
    ],
    users: [
      { name: 'Dr. Maria Santos', email: 'msantos@region4a.dost.gov', role: 'Proponent', unit: 'Regional Office IV-A', status: 'Active' },
      { name: 'Engr. Roberto Cruz', email: 'rcruz@central.dost.gov', role: 'Administrator', unit: 'Central Office · GIA', status: 'Active' },
      { name: 'Atty. Diego Ramos', email: 'dramos@central.dost.gov', role: 'Approving Authority', unit: 'Office of the Director', status: 'Active' },
      { name: 'Ms. Liza Ong', email: 'long@central.dost.gov', role: 'Accounting', unit: 'Finance & Admin', status: 'Active' },
      { name: 'ICT Administrator', email: 'admin@dost.gov', role: 'Super Admin', unit: 'ICT Division', status: 'Active' },
      { name: 'Prof. Ana Reyes', email: 'areyes@car.dost.gov', role: 'Proponent', unit: 'Cordillera Admin Region', status: 'Suspended' },
    ],
  };

  ORDER = ['submitted', 'reviewed', 'endorsed', 'approved', 'accounting', 'completed'];
  STAGE_LABELS = { submitted: 'Submitted', reviewed: 'Administrative Review', endorsed: 'Endorsement', approved: 'Approval', accounting: 'Accounting & Disbursement', completed: 'Completed' };

  seedProposals() {
    const h = (action, by, role, date, remarks) => ({ action, by, role, date, remarks });
    return [
      { id: 1, ref: 'GIA-2026-0050', title: 'AI-Assisted Tuberculosis Screening for Rural Health Units', program: 'Grants-in-Aid (GIA)', amount: 4850000, by: 'Dr. Maria Santos', unit: 'Regional Office IV-A · CALABARZON', created: 'Jun 20, 2026', status: 'draft', reached: -1, files: ['Concept_Note.pdf'],
        history: [h('Draft created', 'Dr. Maria Santos', 'Proponent', 'Jun 20, 2026 · 9:12 AM', '')] },
      { id: 2, ref: 'GIA-2026-0042', title: 'Community IoT Early-Warning System for Flood-Prone Barangays', program: 'Grants-in-Aid (GIA)', amount: 7320000, by: 'Dr. Maria Santos', unit: 'Regional Office IV-A · CALABARZON', created: 'Jun 16, 2026', status: 'submitted', reached: 0, files: ['Proposal.pdf', 'Budget_Matrix.xlsx', 'LGU_Endorsement.pdf'],
        history: [h('Draft created', 'Dr. Maria Santos', 'Proponent', 'Jun 15, 2026 · 4:02 PM', ''), h('Submitted for review', 'Dr. Maria Santos', 'Proponent', 'Jun 16, 2026 · 8:40 AM', 'Submitting for the Q3 GIA cycle. LGU counterpart funding confirmed.')] },
      { id: 3, ref: 'GIA-2026-0046', title: 'Indigenous Knowledge Digital Archive & Language Preservation', program: 'Research & Development', amount: 2980000, by: 'Prof. Ana Reyes', unit: 'Cordillera Admin Region', created: 'Jun 14, 2026', status: 'reviewed', reached: 1, files: ['Proposal.pdf', 'Workplan.pdf'],
        history: [h('Submitted for review', 'Prof. Ana Reyes', 'Proponent', 'Jun 14, 2026 · 11:20 AM', ''), h('Reviewed', 'Engr. Roberto Cruz', 'Reviewing Officer', 'Jun 17, 2026 · 2:14 PM', 'Complete and compliant. Recommending for endorsement.')] },
      { id: 4, ref: 'SETUP-2026-0039', title: 'Precision Farming Toolkit for Smallholder Rice Cooperatives', program: 'SETUP — Small Enterprise Technology Upgrading', amount: 5400000, by: 'Engr. Luis Tan', unit: 'Region III · Central Luzon', created: 'Jun 10, 2026', status: 'endorsed', reached: 2, files: ['Proposal.pdf', 'Coop_Resolution.pdf'],
        history: [h('Submitted for review', 'Engr. Luis Tan', 'Proponent', 'Jun 10, 2026 · 9:00 AM', ''), h('Reviewed', 'Engr. Roberto Cruz', 'Reviewing Officer', 'Jun 12, 2026 · 10:30 AM', ''), h('Endorsed', 'Engr. Roberto Cruz', 'Endorsing Officer', 'Jun 13, 2026 · 3:45 PM', 'Strong regional impact. Endorsed to approving authority.')] },
      { id: 5, ref: 'GIA-2026-0035', title: 'Coastal Water-Quality Monitoring Sensor Network', program: 'Research & Development', amount: 6100000, by: 'Dr. Maria Santos', unit: 'Regional Office IV-A · CALABARZON', created: 'Jun 4, 2026', status: 'approved', reached: 3, files: ['Proposal.pdf', 'Technical_Design.pdf'], tracking: 'DPMIS-2026-440135',
        history: [h('Submitted for review', 'Dr. Maria Santos', 'Proponent', 'Jun 4, 2026 · 1:10 PM', ''), h('Reviewed', 'Engr. Roberto Cruz', 'Reviewing Officer', 'Jun 6, 2026 · 9:20 AM', ''), h('Endorsed', 'Engr. Roberto Cruz', 'Endorsing Officer', 'Jun 8, 2026 · 4:00 PM', ''), h('Approved', 'Atty. Diego Ramos', 'Approving Authority', 'Jun 11, 2026 · 11:05 AM', 'Approved subject to standard MOA terms. Forwarding to accounting.')] },
      { id: 6, ref: 'SEI-2026-0031', title: 'STEM Scholarship Program Expansion — Batch 2026', program: 'S&T Scholarship (SEI)', amount: 12500000, by: 'Dr. Grace Lim', unit: 'Science Education Institute', created: 'May 28, 2026', status: 'accounting', reached: 4, files: ['Proposal.pdf', 'Scholar_List.xlsx'],
        history: [h('Submitted for review', 'Dr. Grace Lim', 'Proponent', 'May 28, 2026 · 8:30 AM', ''), h('Reviewed', 'Engr. Roberto Cruz', 'Reviewing Officer', 'May 30, 2026 · 2:00 PM', ''), h('Endorsed', 'Engr. Roberto Cruz', 'Endorsing Officer', 'Jun 2, 2026 · 10:00 AM', ''), h('Approved', 'Atty. Diego Ramos', 'Approving Authority', 'Jun 6, 2026 · 3:30 PM', ''), h('Forwarded to accounting', 'Atty. Diego Ramos', 'Approving Authority', 'Jun 6, 2026 · 3:31 PM', 'Disbursement to be released in two tranches.')] },
      { id: 7, ref: 'GIA-2026-0028', title: 'Renewable Solar Microgrid for Off-Grid Island Communities', program: 'Grants-in-Aid (GIA)', amount: 8750000, by: 'Dr. Maria Santos', unit: 'Regional Office IV-A · CALABARZON', created: 'May 19, 2026', status: 'completed', reached: 5, files: ['Proposal.pdf', 'MOA_Signed.pdf', 'Disbursement_Voucher.pdf'],
        history: [h('Submitted for review', 'Dr. Maria Santos', 'Proponent', 'May 19, 2026 · 9:00 AM', ''), h('Reviewed', 'Engr. Roberto Cruz', 'Reviewing Officer', 'May 21, 2026 · 1:00 PM', ''), h('Endorsed', 'Engr. Roberto Cruz', 'Endorsing Officer', 'May 24, 2026 · 11:00 AM', ''), h('Approved', 'Atty. Diego Ramos', 'Approving Authority', 'May 28, 2026 · 4:00 PM', ''), h('Disbursed & completed', 'Ms. Liza Ong', 'Accounting Division', 'Jun 5, 2026 · 2:30 PM', 'First tranche released. Project officially active.')] },
      { id: 8, ref: 'SETUP-2026-0024', title: 'Cold-Chain Logistics Upgrade for Fisherfolk Associations', program: 'SETUP — Small Enterprise Technology Upgrading', amount: 3650000, by: 'Mr. Jose Aquino', unit: 'Region V · Bicol', created: 'May 12, 2026', status: 'returned', reached: 0, files: ['Proposal.pdf'], tracking: 'DPMIS-2026-402281',
        history: [h('Submitted for review', 'Mr. Jose Aquino', 'Proponent', 'May 12, 2026 · 10:00 AM', ''), h('Returned to proponent', 'Engr. Roberto Cruz', 'Reviewing Officer', 'May 14, 2026 · 3:20 PM', 'Budget matrix incomplete and missing cooperative resolution. Please revise and resubmit.')] },
    ];
  }

  // ---- helpers ----
  meta(status) {
    const m = { draft: { label: 'Draft', bg: '#eef1f6', fg: '#5b6577' }, submitted: { label: 'Submitted', bg: '#e8f0fb', fg: '#2563b8' }, reviewed: { label: 'Under Review', bg: '#e2f4f7', fg: '#0e7490' }, endorsed: { label: 'Endorsed', bg: '#f1ebfc', fg: '#7c3aed' }, approved: { label: 'Approved', bg: '#e6f5ee', fg: '#16915a' }, accounting: { label: 'In Accounting', bg: '#fbf2dd', fg: '#b07d0a' }, completed: { label: 'Completed', bg: '#e4f3ea', fg: '#0f7a4a' }, returned: { label: 'Returned', bg: '#fbe9e7', fg: '#c0392b' } };
    return m[status] || m.draft;
  }
  nextAction(status) {
    const n = {
      submitted: { to: 'reviewed', label: 'Mark as Reviewed', verb: 'Reviewed', role: 'Reviewing Officer', heading: 'Administrative review', hint: 'Confirm the proposal is complete and compliant, then mark it reviewed.' },
      reviewed: { to: 'endorsed', label: 'Endorse Proposal', verb: 'Endorsed', role: 'Endorsing Officer', heading: 'Endorsement', hint: 'Endorse this proposal to the approving authority.' },
      endorsed: { to: 'approved', label: 'Approve Proposal', verb: 'Approved', role: 'Approving Authority', heading: 'Approval', hint: 'Approve the proposal to forward it to accounting.' },
      approved: { to: 'accounting', label: 'Forward to Accounting', verb: 'Forwarded to accounting', role: 'Approving Authority', heading: 'Forward to accounting', hint: 'Send the approved proposal to the accounting division for processing.' },
      accounting: { to: 'completed', label: 'Mark Disbursed & Complete', verb: 'Disbursed & completed', role: 'Accounting Division', heading: 'Disbursement', hint: 'Confirm funds released and mark the proposal complete.' },
    };
    return n[status] || null;
  }
  whatsNext(status) {
    const w = { draft: 'Draft — not yet submitted for review.', submitted: 'Awaiting administrative review.', reviewed: 'Reviewed — awaiting endorsement.', endorsed: 'Endorsed — awaiting approval.', approved: 'Approved — awaiting accounting.', accounting: 'In accounting — awaiting disbursement.', completed: 'Completed — funds disbursed.', returned: 'Returned to proponent — revise and resubmit.' };
    return w[status];
  }
  peso(n) { return '\u20b1' + Number(Math.round(n)).toLocaleString('en-PH'); }
  pesoShort(n) { if (n >= 1000000) return '\u20b1' + (n / 1000000).toFixed(1) + 'M'; if (n >= 1000) return '\u20b1' + Math.round(n / 1000) + 'K'; return '\u20b1' + n; }
  initials(name) { return name.replace(/Dr\.|Engr\.|Prof\.|Atty\.|Ms\.|Mr\./g, '').trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(); }
  now() {
    const d = new Date(); const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
    let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; const mi = String(d.getMinutes()).padStart(2, '0');
    return mo + ' ' + d.getDate() + ', ' + d.getFullYear() + ' \u00b7 ' + h + ':' + mi + ' ' + ap;
  }
  num(v) { return parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0; }

  // ---- navigation ----
  login(role) { this.setState({ role, screen: 'dash', selectedId: null }); }
  setRole(role) { this.setState({ role, screen: 'dash', selectedId: null }); }
  go(screen) { this.setState({ screen }); }
  open(id, backTo) { this.setState({ selectedId: id, screen: 'detail', backTo: backTo || this.state.screen, remarks: '' }); }
  back() { this.setState({ screen: this.state.backTo || 'dash', selectedId: null }); }

  // ---- workflow actions ----
  advance(id) {
    const p = this.state.proposals.find(x => x.id === id); const na = p ? this.nextAction(p.status) : null; if (!na) return;
    const rem = this.state.remarks.trim(); const idx = this.ORDER.indexOf(na.to);
    this.setState(s => ({ remarks: '', proposals: s.proposals.map(p => p.id === id ? { ...p, status: na.to, reached: Math.max(p.reached, idx), history: [...p.history, { action: na.verb, by: 'Engr. Roberto Cruz', role: na.role, date: this.now(), remarks: rem }] } : p) }));
  }
  returnProp(id) {
    const rem = this.state.remarks.trim() || 'Returned for revision.';
    this.setState(s => ({ remarks: '', proposals: s.proposals.map(p => p.id === id ? { ...p, status: 'returned', history: [...p.history, { action: 'Returned to proponent', by: 'Engr. Roberto Cruz', role: 'Reviewing Officer', date: this.now(), remarks: rem }] } : p) }));
  }
  submit(id) {
    this.setState(s => ({ remarks: '', proposals: s.proposals.map(p => p.id === id ? { ...p, status: 'submitted', reached: 0, history: [...p.history, { action: p.status === 'returned' ? 'Resubmitted for review' : 'Submitted for review', by: 'Dr. Maria Santos', role: 'Proponent', date: this.now(), remarks: '' }] } : p) }));
  }
  approveAccount(id, ok) {
    this.setState(s => { const acc = s.pending.find(a => a.id === id); const users = ok && acc ? [...s.users, { name: acc.name, email: acc.email, role: acc.role, unit: acc.unit, status: 'Active' }] : s.users; return { pending: s.pending.filter(a => a.id !== id), users }; });
  }

  // ---- tracking ----
  goTrack() { this.setState({ screen: 'track', trackCode: '', trackResult: null }); }
  doTrack() {
    const code = (this.state.trackCode || '').trim().toUpperCase(); if (!code) return;
    const p = this.state.proposals.find(x => x.ref.toUpperCase() === code || (x.tracking || '').toUpperCase() === code);
    this.setState({ trackResult: p ? { found: true, id: p.id } : { found: false } });
  }

  // ---- wizard ----
  blankYear(n) { return { n, ps: [], mooe: [], co: [] }; }
  blankLine() { return { id: ++this._uid, desc: '', amount: '', source: 'DOST' }; }
  blankWz(prefill) {
    const y1 = this.blankYear(1);
    y1.ps.push({ id: ++this._uid, desc: 'Project Leader (50% time)', amount: '1200000', source: 'DOST' });
    y1.mooe.push({ id: ++this._uid, desc: 'Field equipment & supplies', amount: '800000', source: 'DOST' });
    y1.mooe.push({ id: ++this._uid, desc: 'LGU venue & logistics', amount: '150000', source: 'LGU Counterpart' });
    y1.co.push({ id: ++this._uid, desc: 'IoT sensor units & gateway', amount: '500000', source: 'DOST' });
    return {
      step: 1, type: 'rd_project', classification: 'New', call: '2026 GIA Call — Health &amp; Wellness',
      title: prefill ? prefill.title : '', impAgency: 'DOST Regional Office IV-A · CALABARZON', coInput: '', coAgencies: [],
      start: '2026-08-01', end: '2027-07-31', research: 'Applied Research', hnrdaArea: 'Disaster Risk Reduction &amp; Climate Change', gad: 60, sdgs: ['11 Sustainable Cities', '13 Climate Action'],
      sections: { summary: '', rationale: '', objectives: '', methodology: '', limitations: '', risks: '', outputs: '' },
      leader: 'Dr. Maria Santos', team: [{ id: ++this._uid, name: 'Engr. Paolo Reyes', expertise: 'Embedded systems', role: 'Study Leader' }],
      sites: [{ id: ++this._uid, barangay: 'Halang', municipality: 'Calamba City', province: 'Laguna', region: 'IV-A' }],
      agencies: ['LGU Counterpart', 'State University Counterpart'],
      years: [y1], activeYear: 0,
      docs: this.DOCS.map(d => ({ ...d, file: null })), tc: false, editId: prefill ? prefill.id : null,
    };
  }
  initWizard(prefill) {
    const p = (prefill && prefill.wz) ? JSON.parse(JSON.stringify(prefill.wz)) : this.blankWz(prefill);
    this.setState({ screen: 'create', wz: p });
  }
  upWz(fn) { this.setState(s => ({ wz: fn(s.wz) })); }
  wzField(k, v) { this.upWz(w => ({ ...w, [k]: v })); }
  sectField(k, v) { this.upWz(w => ({ ...w, sections: { ...w.sections, [k]: v } })); }
  wzStep(n) { this.upWz(w => ({ ...w, step: n })); }
  wzNext() { this.upWz(w => ({ ...w, step: Math.min(6, w.step + 1) })); }
  wzBack() { this.upWz(w => ({ ...w, step: Math.max(1, w.step - 1) })); }
  toggleSdg(l) { this.upWz(w => ({ ...w, sdgs: w.sdgs.includes(l) ? w.sdgs.filter(x => x !== l) : [...w.sdgs, l] })); }
  addCo() { this.upWz(w => { const v = (w.coInput || '').trim(); return v ? { ...w, coAgencies: [...w.coAgencies, v], coInput: '' } : w; }); }
  rmCo(i) { this.upWz(w => ({ ...w, coAgencies: w.coAgencies.filter((_, j) => j !== i) })); }
  addTeam() { this.upWz(w => ({ ...w, team: [...w.team, { id: ++this._uid, name: '', expertise: '', role: 'Researcher' }] })); }
  updTeam(id, k, v) { this.upWz(w => ({ ...w, team: w.team.map(t => t.id === id ? { ...t, [k]: v } : t) })); }
  rmTeam(id) { this.upWz(w => ({ ...w, team: w.team.filter(t => t.id !== id) })); }
  addSite() { this.upWz(w => ({ ...w, sites: [...w.sites, { id: ++this._uid, barangay: '', municipality: '', province: '', region: '' }] })); }
  updSite(id, k, v) { this.upWz(w => ({ ...w, sites: w.sites.map(t => t.id === id ? { ...t, [k]: v } : t) })); }
  rmSite(id) { this.upWz(w => ({ ...w, sites: w.sites.filter(t => t.id !== id) })); }
  // budget
  addLine(kind) { this.upWz(w => ({ ...w, years: w.years.map((y, i) => i === w.activeYear ? { ...y, [kind]: [...y[kind], this.blankLine()] } : y) })); }
  updLine(kind, id, k, v) { this.upWz(w => ({ ...w, years: w.years.map((y, i) => i === w.activeYear ? { ...y, [kind]: y[kind].map(r => r.id === id ? { ...r, [k]: v } : r) } : y) })); }
  rmLine(kind, id) { this.upWz(w => ({ ...w, years: w.years.map((y, i) => i === w.activeYear ? { ...y, [kind]: y[kind].filter(r => r.id !== id) } : y) })); }
  setYear(i) { this.upWz(w => ({ ...w, activeYear: i })); }
  addYear() { this.upWz(w => ({ ...w, years: [...w.years, this.blankYear(w.years.length + 1)], activeYear: w.years.length })); }
  copyLib() { this.upWz(w => { const c = w.years[w.activeYear]; const ny = { n: w.years.length + 1, ps: c.ps.map(r => ({ ...r, id: ++this._uid })), mooe: c.mooe.map(r => ({ ...r, id: ++this._uid })), co: c.co.map(r => ({ ...r, id: ++this._uid })) }; return { ...w, years: [...w.years, ny], activeYear: w.years.length }; }); }
  toggleDoc(key) { this.upWz(w => ({ ...w, docs: w.docs.map(d => d.key === key ? { ...d, file: d.file ? null : (d.name.replace(/[^A-Za-z0-9]+/g, '_') + '.pdf') } : d) })); }
  toggleTc() { this.upWz(w => ({ ...w, tc: !w.tc })); }

  sumYear(y) {
    let dost = 0, cp = 0;
    ['ps', 'mooe', 'co'].forEach(k => y[k].forEach(r => { const a = this.num(r.amount); if (r.source === 'DOST') dost += a; else cp += a; }));
    return { dost, cp, total: dost + cp };
  }
  fundOptions(w) { return ['DOST'].concat(w.agencies); }

  saveDraftWizard() {
    const w = this.state.wz; this.commitWizard(false);
  }
  commitWizard(submitIt) {
    const w = this.state.wz;
    const grand = w.years.reduce((a, y) => { const s = this.sumYear(y); return { dost: a.dost + s.dost, cp: a.cp + s.cp }; }, { dost: 0, cp: 0 });
    const total = grand.dost + grand.cp;
    const pass = grand.cp >= 0.15 * grand.dost;
    const narr = this.NARR.filter(n => (w.sections[n.key] || '').trim()).map(n => ({ label: n.label, content: w.sections[n.key].trim() }));
    const files = w.docs.filter(d => d.file).map(d => d.file).concat(['Line_Item_Budget.pdf']);

    if (w.editId) {
      const id = w.editId;
      this.setState(s => ({ wz: null, screen: 'detail', selectedId: id, backTo: 'list', justSubmittedId: submitIt ? id : null,
        proposals: s.proposals.map(p => p.id === id ? { ...p, title: w.title || p.title, amount: total, files, wz: w, sections: narr, budget: { dost: grand.dost, cp: grand.cp, total, pass }, status: submitIt ? 'submitted' : 'draft', reached: submitIt ? 0 : p.reached, history: submitIt ? [...p.history, { action: 'Submitted for review', by: 'Dr. Maria Santos', role: 'Proponent', date: this.now(), remarks: '' }] : p.history } : p) }));
    } else {
      const newId = Math.max(...this.state.proposals.map(p => p.id)) + 1;
      const ref = 'GIA-2026-' + String(50 + newId).padStart(4, '0');
      const tracking = 'DPMIS-2026-' + (480000 + newId * 137 % 99999 + 100000).toString().slice(-6);
      const np = { id: newId, ref, tracking, title: w.title || 'Untitled R&D Project', program: 'Grants-in-Aid (GIA)', amount: total, by: 'Dr. Maria Santos', unit: 'Regional Office IV-A · CALABARZON', created: this.now().split(' \u00b7')[0], status: submitIt ? 'submitted' : 'draft', reached: submitIt ? 0 : -1, files, wz: w, sections: narr, budget: { dost: grand.dost, cp: grand.cp, total, pass },
        history: [{ action: 'Draft created', by: 'Dr. Maria Santos', role: 'Proponent', date: this.now(), remarks: '' }].concat(submitIt ? [{ action: 'Submitted for review', by: 'Dr. Maria Santos', role: 'Proponent', date: this.now(), remarks: 'Submitted via the proposal wizard.' }] : []) };
      this.setState(s => ({ wz: null, screen: 'detail', selectedId: newId, backTo: 'list', justSubmittedId: submitIt ? newId : null, proposals: [np, ...s.proposals] }));
    }
  }

  // ---- detail vm ----
  buildStages(p) {
    return this.ORDER.map((key, i) => {
      let st = 'pending';
      if (p.status === 'returned') { if (i <= p.reached) st = 'done'; else if (i === p.reached + 1) st = 'returned'; }
      else if (p.status === 'draft') { st = 'pending'; }
      else { if (i <= p.reached) st = 'done'; else if (i === p.reached + 1) st = 'current'; }
      const isLast = i === this.ORDER.length - 1;
      let dotStyle, dotMark = '', titleColor = '#16213c', caption = '', lineColor = (i <= p.reached) ? '#16915a' : '#e3e8f0';
      if (st === 'done') { dotStyle = 'width:22px;height:22px;border-radius:50%;background:#16915a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;z-index:1'; dotMark = '\u2713'; caption = 'Completed'; }
      else if (st === 'current') { dotStyle = 'width:22px;height:22px;border-radius:50%;background:#fff;border:2px solid #1b56b0;z-index:1;animation:pulsering 2s infinite'; titleColor = '#1b56b0'; caption = 'In progress · awaiting action'; lineColor = '#e3e8f0'; }
      else if (st === 'returned') { dotStyle = 'width:22px;height:22px;border-radius:50%;background:#fff;border:2px solid #c0392b;z-index:1'; titleColor = '#c0392b'; caption = 'Returned to proponent'; lineColor = '#e3e8f0'; }
      else { dotStyle = 'width:22px;height:22px;border-radius:50%;background:#eef1f6;border:1px solid #dde3ec;z-index:1'; titleColor = '#9aa6bb'; caption = 'Pending'; }
      if (isLast) lineColor = 'transparent';
      return { label: this.STAGE_LABELS[key], dotStyle, dotMark, titleColor, caption, lineColor };
    });
  }
  buildDetail() {
    const p = this.state.proposals.find(x => x.id === this.state.selectedId); if (!p) return null;
    const m = this.meta(p.status); const role = this.state.role; const owner = p.by === 'Dr. Maria Santos';
    const hist = [...p.history].reverse();
    const history = hist.map((h, i) => { const dc = h.action.indexOf('Returned') >= 0 ? '#c0392b' : (h.action.indexOf('Disbursed') >= 0 || h.action.indexOf('Approved') >= 0 ? '#16915a' : '#1b56b0'); const isLast = i === hist.length - 1; return { action: h.action, by: h.by, role: h.role, date: h.date, remarks: h.remarks, dotColor: dc, lineStyle: isLast ? 'display:none' : 'position:absolute;top:8px;bottom:-12px;width:2px;background:#e3e8f0' }; });
    const primary = 'background:#1b56b0;color:#fff;border:none;border-radius:8px;padding:11px 18px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit';
    const secondary = 'background:#fff;color:#1b3a6e;border:1px solid #c7d0e0;border-radius:8px;padding:11px 18px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit';
    const danger = 'background:#fff;color:#c0392b;border:1px solid #e6c3be;border-radius:8px;padding:11px 18px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit';
    const actions = []; let actionHeading = '', actionHint = '', showRemarks = false;
    if (role === 'admin') { const na = this.nextAction(p.status); if (na) { actionHeading = na.heading; actionHint = na.hint; showRemarks = true; actions.push({ label: na.label, style: primary, onClick: () => this.advance(p.id) }); actions.push({ label: 'Return to proponent', style: danger, onClick: () => this.returnProp(p.id) }); } }
    else if (role === 'user' && owner) {
      if (p.status === 'draft') { actionHeading = 'This proposal is still a draft'; actionHint = 'Submit it to begin the review workflow, or continue editing.'; actions.push({ label: 'Submit for review', style: primary, onClick: () => this.submit(p.id) }); actions.push({ label: 'Edit', style: secondary, onClick: () => this.initWizard(p) }); }
      else if (p.status === 'returned') { actionHeading = 'Returned for revision'; actionHint = 'Address the reviewer remarks below, then resubmit.'; actions.push({ label: 'Revise & resubmit', style: primary, onClick: () => this.submit(p.id) }); actions.push({ label: 'Edit', style: secondary, onClick: () => this.initWizard(p) }); }
    }
    const nextTone = p.status === 'returned' ? { bg: '#fdf3f1', border: '#f1d4ce' } : (p.status === 'completed' ? { bg: '#eef7f1', border: '#cfe7d9' } : { bg: '#f5f8fd', border: '#dde7f5' });
    const b = p.budget;
    const ruleStyle = b ? ('font-size:12px;font-weight:700;margin-top:12px;padding:8px 11px;border-radius:8px;text-align:center;' + (b.pass ? 'background:#e6f5ee;color:#0f7a4a' : 'background:#fbe9e7;color:#c0392b')) : '';
    return {
      ref: p.ref, title: p.title, program: p.program, by: p.by, unit: p.unit, created: p.created, tracking: p.tracking || null,
      amountStr: this.peso(p.amount), badgeBg: m.bg, badgeFg: m.fg, badgeLabel: m.label,
      whatsNext: this.whatsNext(p.status), nextBg: nextTone.bg, nextBorder: nextTone.border,
      files: p.files, stages: this.buildStages(p), history, actions, hasActions: actions.length > 0, actionHeading, actionHint, showRemarks,
      hasNarr: !!(p.sections && p.sections.length), narr: p.sections || [],
      hasBudget: !!b, bDost: b ? this.peso(b.dost) : '', bCp: b ? this.peso(b.cp) : '', bTotal: b ? this.peso(b.total) : '',
      bRuleStyle: ruleStyle, bRuleText: b ? (b.pass ? '\u2713 Meets the 15% counterpart requirement' : 'Below the 15% counterpart minimum') : '',
      justSubmitted: this.state.justSubmittedId === p.id,
    };
  }

  // ---- wizard vm ----
  wizardVals() {
    const w = this.state.wz; if (!w) return {};
    const stepLabels = ['Type', 'Basic Info', 'Narrative', 'Team & Sites', 'Budget (LIB)', 'Documents'];
    const wzSteps = stepLabels.map((label, i) => {
      const n = i + 1; const done = n < w.step; const cur = n === w.step;
      const dotStyle = cur ? 'width:28px;height:28px;border-radius:50%;background:#1b56b0;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;flex-shrink:0' : (done ? 'width:28px;height:28px;border-radius:50%;background:#16915a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;flex-shrink:0' : 'width:28px;height:28px;border-radius:50%;background:#eef1f6;color:#9aa6bb;border:1px solid #dde3ec;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0');
      return { label, dotMark: done ? '\u2713' : String(n), dotStyle, labelColor: cur ? '#1b56b0' : (done ? '#16915a' : '#9aa6bb'), lineL: i === 0 ? 'transparent' : (n <= w.step ? '#16915a' : '#e3e8f0'), lineR: i === 5 ? 'transparent' : (n < w.step ? '#16915a' : '#e3e8f0'), onClick: () => this.wzStep(n) };
    });

    const typeCards = this.TYPES.map(t => {
      const sel = w.type === t.key;
      const style = 'text-align:left;border-radius:10px;padding:14px 15px;cursor:' + (t.on ? 'pointer' : 'not-allowed') + ';font-family:inherit;background:' + (sel ? '#eef4fc' : '#fff') + ';border:' + (sel ? '2px solid #1b56b0' : '1px solid #e0e5ee') + ';opacity:' + (t.on ? '1' : '0.6');
      return { name: t.name, desc: t.desc, style, titleColor: sel ? '#16213c' : '#16213c', tag: t.on ? (sel ? 'Selected' : 'Available') : 'Phase 2', tagStyle: 'font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:0.04em;' + (t.on ? (sel ? 'background:#1b56b0;color:#fff' : 'background:#e8f0fb;color:#1b56b0') : 'background:#eef1f6;color:#9aa6bb'), onClick: () => { if (t.on) this.wzField('type', t.key); } };
    });
    const chip = (active) => 'border-radius:20px;padding:8px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid ' + (active ? '#1b56b0' : '#d3dbe8') + ';background:' + (active ? '#1b56b0' : '#fff') + ';color:' + (active ? '#fff' : '#42506b');
    const classChips = ['New', 'Renewal', 'Extension'].map(c => ({ label: c, style: chip(w.classification === c), onClick: () => this.wzField('classification', c) }));
    const sdgChip = (active) => 'border-radius:20px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;border:1px solid ' + (active ? '#1b56b0' : '#dde3ec') + ';background:' + (active ? '#e8f0fb' : '#fff') + ';color:' + (active ? '#1b56b0' : '#7c8aa3');
    const sdgChips = this.SDGS.map(l => ({ label: l, style: sdgChip(w.sdgs.includes(l)), onClick: () => this.toggleSdg(l) }));
    const coChips = w.coAgencies.map((a, i) => ({ label: a, onRemove: () => this.rmCo(i) }));
    const narrSections = this.NARR.map(n => ({ label: n.label, ph: n.ph, tag: n.rd ? 'R&D Project field' : null, value: w.sections[n.key], onInput: (e) => this.sectField(n.key, e.target.value) }));
    const teamRows = w.team.map(t => ({ name: t.name, expertise: t.expertise, role: t.role, onName: (e) => this.updTeam(t.id, 'name', e.target.value), onExp: (e) => this.updTeam(t.id, 'expertise', e.target.value), onRole: (e) => this.updTeam(t.id, 'role', e.target.value), onRemove: () => this.rmTeam(t.id) }));
    const siteRows = w.sites.map(t => ({ barangay: t.barangay, municipality: t.municipality, province: t.province, region: t.region, onB: (e) => this.updSite(t.id, 'barangay', e.target.value), onM: (e) => this.updSite(t.id, 'municipality', e.target.value), onP: (e) => this.updSite(t.id, 'province', e.target.value), onR: (e) => this.updSite(t.id, 'region', e.target.value), onRemove: () => this.rmSite(t.id) }));

    // budget
    const opts = this.fundOptions(w);
    const mkRows = (kind) => w.years[w.activeYear][kind].map(r => ({ id: r.id, desc: r.desc, amount: r.amount, source: r.source, opts, onDesc: (e) => this.updLine(kind, r.id, 'desc', e.target.value), onAmount: (e) => this.updLine(kind, r.id, 'amount', e.target.value), onSource: (e) => this.updLine(kind, r.id, 'source', e.target.value), onRemove: () => this.rmLine(kind, r.id) }));
    const psRows = mkRows('ps'), mooeRows = mkRows('mooe'), coRows = mkRows('co');
    const subOf = (kind) => this.peso(w.years[w.activeYear][kind].reduce((a, r) => a + this.num(r.amount), 0));
    const cur = this.sumYear(w.years[w.activeYear]);
    const ratio = cur.dost > 0 ? (cur.cp / cur.dost * 100) : 0;
    const pass = cur.cp >= 0.15 * cur.dost; const need = Math.max(0, 0.15 * cur.dost - cur.cp);
    const grand = w.years.reduce((a, y) => { const sm = this.sumYear(y); return { dost: a.dost + sm.dost, cp: a.cp + sm.cp, total: a.total + sm.total }; }, { dost: 0, cp: 0, total: 0 });
    const yearTab = (active) => 'border-radius:8px;padding:8px 15px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid ' + (active ? '#1b56b0' : '#d3dbe8') + ';background:' + (active ? '#1b56b0' : '#fff') + ';color:' + (active ? '#fff' : '#42506b');
    const yearTabs = w.years.map((y, i) => ({ label: 'Year ' + y.n + ' · ' + this.pesoShort(this.sumYear(y).total), style: yearTab(i === w.activeYear), onClick: () => this.setYear(i) }));

    // submit gating
    const allMand = w.docs.filter(d => d.mand).every(d => d.file);
    const hasLines = (cur.dost + cur.cp) > 0;
    const hasTitle = !!w.title.trim();
    let submitMsg = '', canSubmit = true;
    if (!hasTitle) { submitMsg = 'A project title is required (Step 2).'; canSubmit = false; }
    else if (!hasLines) { submitMsg = 'Add at least one budget line item (Step 5).'; canSubmit = false; }
    else if (!allMand) { submitMsg = 'Upload all required documents before submitting.'; canSubmit = false; }
    else if (!w.tc) { submitMsg = 'You must accept the terms and conditions to submit.'; canSubmit = false; }

    const docRows = w.docs.map(d => ({ name: d.name, file: d.file, badge: d.mand ? 'Required' : 'Optional', badgeStyle: 'font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;' + (d.mand ? 'background:#fbf2dd;color:#b07d0a' : 'background:#eef1f6;color:#7c8aa3'), iconStyle: 'width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;' + (d.file ? 'background:#16915a;color:#fff' : 'background:#eef1f6;color:#9aa6bb'), iconMark: d.file ? '\u2713' : '', btnLabel: d.file ? 'Remove' : 'Upload', btnStyle: 'border-radius:7px;padding:8px 14px;font-weight:700;font-size:12.5px;cursor:pointer;font-family:inherit;' + (d.file ? 'background:#fff;color:#c0392b;border:1px solid #e6c3be' : 'background:#1b56b0;color:#fff;border:none'), onToggle: () => this.toggleDoc(d.key) }));

    return {
      wz: w, wzHeading: w.editId ? 'Edit Proposal' : 'New R&D Project Proposal',
      wzSteps, wStep1: w.step === 1, wStep2: w.step === 2, wStep3: w.step === 3, wStep4: w.step === 4, wStep5: w.step === 5, wStep6: w.step === 6,
      wzCanBack: w.step > 1, wzNotLast: w.step < 6, wzLast: w.step === 6,
      onWzNext: () => this.wzNext(), onWzBack: () => this.wzBack(), onSaveDraft: () => this.commitWizard(false), onSubmitWizard: () => { if (canSubmit) this.commitWizard(true); },
      typeCards, classChips, onCall: (e) => this.wzField('call', e.target.value),
      onTitle: (e) => this.wzField('title', e.target.value), onImp: (e) => this.wzField('impAgency', e.target.value), onResearch: (e) => this.wzField('research', e.target.value),
      onCoInput: (e) => this.wzField('coInput', e.target.value), onAddCo: () => this.addCo(), coChips,
      onStart: (e) => this.wzField('start', e.target.value), onEnd: (e) => this.wzField('end', e.target.value),
      onHnrda: (e) => this.wzField('hnrdaArea', e.target.value), onGad: (e) => this.wzField('gad', e.target.value), sdgChips,
      narrSections, teamRows, siteRows, onAddTeam: () => this.addTeam(), onAddSite: () => this.addSite(), onLeader: (e) => this.wzField('leader', e.target.value),
      psRows, mooeRows, coRows, psSub: subOf('ps'), mooeSub: subOf('mooe'), coSub: subOf('co'),
      onAddPS: () => this.addLine('ps'), onAddMOOE: () => this.addLine('mooe'), onAddCO: () => this.addLine('co'),
      yearTabs, onAddYear: () => this.addYear(), onCopyLib: () => this.copyLib(),
      bDost: this.peso(cur.dost), bCp: this.peso(cur.cp), bTotal: this.peso(cur.total), bYearNo: w.years[w.activeYear].n, bYearCount: w.years.length, bGrand: this.peso(grand.total),
      bRatio: ratio.toFixed(0) + '%', bBarPct: Math.min(100, ratio) + '%', bBarColor: pass ? '#3fbf7f' : '#e6915a',
      bRuleStyle: 'font-size:12.5px;font-weight:700;padding:7px 13px;border-radius:20px;white-space:nowrap;' + (pass ? 'background:#d8efe2;color:#0f7a4a' : 'background:#f7d9c9;color:#a84a1e'),
      bRuleText: pass ? '\u2713 Meets 15% rule' : ('Need ' + this.peso(need) + ' more'),
      docRows, onTc: () => this.toggleTc(),
      submitBlocked: !canSubmit, submitMsg, submitBtnStyle: (canSubmit ? 'background:#16915a;color:#fff;border:none' : 'background:#c5cdd9;color:#fff;border:none;cursor:not-allowed') + ';border-radius:8px;padding:12px 26px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit',
    };
  }

  trackVals() {
    const tr = this.state.trackResult;
    if (!tr) return { trackFound: false, trackNotFound: false };
    if (!tr.found) return { trackFound: false, trackNotFound: true };
    const p = this.state.proposals.find(x => x.id === tr.id); const m = this.meta(p.status);
    return { trackFound: true, trackNotFound: false, track: { ref: p.ref, title: p.title, program: p.program, by: p.by, badgeBg: m.bg, badgeFg: m.fg, badgeLabel: m.label, whatsNext: this.whatsNext(p.status), stages: this.buildStages(p) } };
  }

  rowVM(p, backTo) {
    const m = this.meta(p.status);
    return { id: p.id, ref: p.ref, title: p.title, program: p.program, by: p.by, amountStr: this.peso(p.amount), badgeBg: m.bg, badgeFg: m.fg, badgeLabel: m.label, created: p.created, whatsNext: this.whatsNext(p.status), cta: p.status === 'draft' ? 'Finish & submit' : (p.status === 'returned' ? 'Revise' : 'View'), onOpen: () => this.open(p.id, backTo) };
  }

  renderVals() {
    const s = this.state; const role = s.role; const props = s.proposals;
    const isLogin = s.screen === 'login'; const isTrack = s.screen === 'track'; const isApp = !isLogin && !isTrack;

    const roleNames = { user: 'Dr. Maria Santos', admin: 'Engr. Roberto Cruz', super: 'ICT Administrator' };
    const roleRoles = { user: 'Proponent · Region IV-A', admin: 'Administrator · GIA Division', super: 'Super Admin · ICT Division' };
    const roleLabels = { user: 'Proponent', admin: 'Administrator', super: 'Super Admin' };
    const headerName = roleNames[role];
    const tabStyle = (r) => 'border:none;border-radius:7px;padding:7px 14px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;' + (role === r ? 'background:#fff;color:#143a7e' : 'background:transparent;color:#bcccea');
    const roleTabs = [{ label: 'Proponent', style: tabStyle('user'), onClick: () => this.setRole('user') }, { label: 'Administrator', style: tabStyle('admin'), onClick: () => this.setRole('admin') }, { label: 'Super Admin', style: tabStyle('super'), onClick: () => this.setRole('super') }];

    const navStyle = (active) => 'display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left;border:none;border-radius:8px;padding:11px 12px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit;width:100%;' + (active ? 'background:rgba(255,255,255,0.13);color:#fff;box-shadow:inset 3px 0 0 #d6a93f' : 'background:transparent;color:#a9bbdf');
    const badgeStyle = 'background:#d6a93f;color:#0e2552;font-size:11px;font-weight:800;padding:1px 7px;border-radius:20px';
    const inboxCount = props.filter(p => this.nextAction(p.status)).length;
    let navItems = [];
    if (role === 'user') navItems = [{ label: 'Dashboard', style: navStyle(s.screen === 'dash'), onClick: () => this.go('dash') }, { label: 'My Proposals', style: navStyle(s.screen === 'list'), onClick: () => this.go('list') }, { label: 'New Proposal', style: navStyle(s.screen === 'create'), onClick: () => this.initWizard(null) }, { label: 'Reports', style: navStyle(s.screen === 'reports'), onClick: () => this.go('reports') }];
    else if (role === 'admin') navItems = [{ label: 'Action Inbox', style: navStyle(s.screen === 'dash'), onClick: () => this.go('dash'), badge: inboxCount || null, badgeStyle }, { label: 'All Proposals', style: navStyle(s.screen === 'list'), onClick: () => this.go('list') }, { label: 'Reports', style: navStyle(s.screen === 'reports'), onClick: () => this.go('reports') }];
    else navItems = [{ label: 'Overview', style: navStyle(s.screen === 'dash'), onClick: () => this.go('dash') }, { label: 'Account Approvals', style: navStyle(s.screen === 'accounts'), onClick: () => this.go('accounts'), badge: s.pending.length || null, badgeStyle }, { label: 'Users', style: navStyle(s.screen === 'users'), onClick: () => this.go('users') }, { label: 'Reports', style: navStyle(s.screen === 'reports'), onClick: () => this.go('reports') }];

    const mine = props.filter(p => p.by === 'Dr. Maria Santos');
    const myProposals = mine.map(p => this.rowVM(p, 'list'));
    const myTodoRaw = mine.filter(p => p.status === 'draft' || p.status === 'returned');
    const myTodo = myTodoRaw.map(p => this.rowVM(p, 'dash'));
    const userStats = [{ label: 'Total proposals', value: mine.length, color: '#16213c', sub: 'all time' }, { label: 'In progress', value: mine.filter(p => ['submitted', 'reviewed', 'endorsed', 'approved', 'accounting'].includes(p.status)).length, color: '#1b56b0', sub: 'in the workflow' }, { label: 'Completed', value: mine.filter(p => p.status === 'completed').length, color: '#0f7a4a', sub: 'funds disbursed' }, { label: 'Needs action', value: myTodoRaw.length, color: '#b07d0a', sub: 'from you' }];

    const inboxRaw = props.filter(p => this.nextAction(p.status));
    const adminInbox = inboxRaw.map(p => { const vm = this.rowVM(p, 'dash'); const na = this.nextAction(p.status); return { ...vm, actionLabel: na.label }; });
    const adminStats = [{ label: 'Needs your action', value: inboxRaw.length, color: '#b07d0a', sub: 'awaiting decision' }, { label: 'In pipeline', value: props.filter(p => ['submitted', 'reviewed', 'endorsed', 'approved', 'accounting'].includes(p.status)).length, color: '#1b56b0', sub: 'active proposals' }, { label: 'Completed', value: props.filter(p => p.status === 'completed').length, color: '#0f7a4a', sub: 'this cycle' }, { label: 'Returned', value: props.filter(p => p.status === 'returned').length, color: '#c0392b', sub: 'awaiting revision' }];
    const allRows = props.map(p => this.rowVM(p, 'list'));

    const totalDisbursed = props.filter(p => p.status === 'completed' || p.status === 'accounting').reduce((a, p) => a + p.amount, 0);
    const superStats = [{ label: 'Pending accounts', value: s.pending.length, color: '#c0392b', sub: 'awaiting approval' }, { label: 'Total users', value: s.users.length, color: '#16213c', sub: 'across offices' }, { label: 'Active proposals', value: props.filter(p => p.status !== 'completed' && p.status !== 'draft').length, color: '#1b56b0', sub: 'in the system' }, { label: 'Disbursed', value: this.pesoShort(totalDisbursed), color: '#0f7a4a', sub: 'approved budget' }];
    const pending = s.pending.map(a => ({ ...a, initials: this.initials(a.name), onApprove: () => this.approveAccount(a.id, true), onReject: () => this.approveAccount(a.id, false) }));
    const maxStage = Math.max(1, ...this.ORDER.map(k => props.filter(p => p.status === k).length));
    const stageBreakdown = this.ORDER.map(k => { const c = props.filter(p => p.status === k).length; return { label: this.STAGE_LABELS[k].replace('&', '&'), color: this.meta(k).fg, count: c, pct: Math.round((c / maxStage) * 100) + '%' }; });
    const users = s.users.map(u => ({ ...u, statusBg: u.status === 'Active' ? '#e6f5ee' : '#fbe9e7', statusFg: u.status === 'Active' ? '#16915a' : '#c0392b' }));

    const totalAmt = props.reduce((a, p) => a + p.amount, 0);
    const apprAmt = props.filter(p => ['approved', 'accounting', 'completed'].includes(p.status)).reduce((a, p) => a + p.amount, 0);
    const compRate = props.length ? Math.round((props.filter(p => p.status === 'completed').length / props.length) * 100) : 0;
    const reportStats = [{ label: 'Total proposals', value: props.length, color: '#16213c', sub: 'all stages' }, { label: 'Total requested', value: this.pesoShort(totalAmt), color: '#1b56b0', sub: 'budget' }, { label: 'Approved+', value: this.pesoShort(apprAmt), color: '#0f7a4a', sub: 'past approval' }, { label: 'Completion', value: compRate + '%', color: '#b07d0a', sub: 'disbursed' }];
    const reportRows = ['submitted', 'reviewed', 'endorsed', 'approved', 'accounting', 'completed', 'returned'].map(k => { const list = props.filter(p => p.status === k); return { label: this.meta(k).label, color: this.meta(k).fg, count: list.length, amount: this.peso(list.reduce((a, p) => a + p.amount, 0)) }; }).filter(r => r.count > 0);

    const listTitle = role === 'user' ? 'My Proposals' : 'All Proposals';
    const listSubtitle = role === 'user' ? 'Every proposal you have created, with its current stage.' : 'All proposals across regional offices and programs.';
    const listRows = role === 'user' ? myProposals : allRows;

    const detail = s.screen === 'detail' ? this.buildDetail() : null;
    const backLabels = { dash: role === 'admin' ? 'inbox' : 'dashboard', list: role === 'user' ? 'my proposals' : 'all proposals' };

    return Object.assign({
      isLogin, isApp, isTrack,
      onLoginUser: () => this.login('user'), onLoginAdmin: () => this.login('admin'), onLoginSuper: () => this.login('super'),
      onLogout: () => this.setState({ screen: 'login' }), goHome: () => this.go('dash'), goTrack: () => this.goTrack(),
      trackCode: s.trackCode, onTrackInput: (e) => this.setState({ trackCode: e.target.value }), onDoTrack: () => this.doTrack(),
      roleTabs, headerName, headerRole: roleRoles[role], headerInitials: this.initials(headerName),
      roleLabel: roleLabels[role], navItems,
      roleUser: role === 'user', roleAdmin: role === 'admin', roleSuper: role === 'super',
      scDash: s.screen === 'dash', scList: s.screen === 'list', scCreate: s.screen === 'create', scDetail: s.screen === 'detail', scReports: s.screen === 'reports', scAccounts: s.screen === 'accounts', scUsers: s.screen === 'users',
      userStats, myProposals, myTodo, hasTodo: myTodo.length > 0, todoCount: myTodo.length, goCreate: () => this.initWizard(null),
      adminStats, adminInbox, hasInbox: adminInbox.length > 0, inboxEmpty: adminInbox.length === 0,
      superStats, pending, pendingCount: s.pending.length, pendingEmpty: s.pending.length === 0, stageBreakdown, users,
      listTitle, listSubtitle, listRows,
      detail, remarks: s.remarks, onRemarks: (e) => this.setState({ remarks: e.target.value }), backLabel: backLabels[s.backTo] || 'list', goBack: () => this.back(),
      reportStats, reportRows, onExport: () => {},
    }, this.wizardVals(), this.trackVals());
  }
}
