/* GIA (DOST) — shared UI behavior (prototype) */
(function () {
  'use strict';

  // Mobile sidebar toggle
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-sb-toggle]');
    if (t) {
      document.querySelector('.sidebar')?.classList.toggle('open');
      document.querySelector('.sb-backdrop')?.classList.toggle('show');
    }
    if (e.target.classList.contains('sb-backdrop')) {
      document.querySelector('.sidebar')?.classList.remove('open');
      e.target.classList.remove('show');
    }
  });

  // Dropzone (visual only in prototype)
  document.querySelectorAll('[data-dropzone]').forEach(function (dz) {
    var input = dz.querySelector('input[type=file]');
    var list = document.querySelector(dz.dataset.dropzone) || dz.nextElementSibling;
    dz.addEventListener('click', function () { input && input.click(); });
    if (input) {
      input.addEventListener('change', function () {
        if (!list) return;
        list.innerHTML = '';
        Array.from(input.files).forEach(function (f) { list.appendChild(fileRow(f.name, f.size)); });
      });
    }
  });

  function fileRow(name, size) {
    var ext = (name.split('.').pop() || '').toLowerCase();
    var kb = size ? (size / 1024 / 1024).toFixed(2) + ' MB' : '';
    var row = document.createElement('div');
    row.className = 'file-row mt-2';
    row.innerHTML =
      '<span class="ext ext-' + (['pdf','docx','xlsx'].includes(ext) ? ext : 'pdf') + '">' + ext.toUpperCase() + '</span>' +
      '<div class="flex-grow-1"><div class="fw-semibold small">' + name + '</div>' +
      '<div class="muted small mono">' + kb + '</div></div>' +
      '<button type="button" class="btn btn-sm btn-outline-secondary" onclick="this.closest(\'.file-row\').remove()">Remove</button>';
    return row;
  }

  // Password visibility toggle
  document.querySelectorAll('[data-toggle-pw]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.querySelector(btn.dataset.togglePw);
      if (input) input.type = input.type === 'password' ? 'text' : 'password';
    });
  });
})();
