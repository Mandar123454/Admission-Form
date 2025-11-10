document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('admissionForm');
  const errorBox = document.getElementById('formErrors');

  // Utility: show errors
  function showErrors(messages = []) {
    if (!errorBox) return;
    if (!messages.length) {
      errorBox.classList.remove('active');
      errorBox.innerHTML = '';
      return;
    }
    errorBox.classList.add('active');
    errorBox.innerHTML = '<ul>' + messages.map(m => `<li>${m}</li>`).join('') + '</ul>';
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Utility: mark/unmark invalid inputs
  function markInvalid(el, isInvalid) {
    if (!el) return;
    el.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
    if (isInvalid) el.classList.add('input-error'); else el.classList.remove('input-error');
  }

  // Index page logic
  if (form) {
    const nameEl = document.getElementById('name');
    const genderEl = document.getElementById('gender');
    const dobEl = document.getElementById('dob');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const addressEl = document.getElementById('address');
    const elective1El = document.getElementById('elective1');
    const elective2Checks = Array.from(document.querySelectorAll('input[name="elective2"]'));

    // Enforce max two selectable at interaction time for better UX
    function enforceMaxTwo() {
      const selected = elective2Checks.filter(c => c.checked);
      if (selected.length >= 2) {
        elective2Checks.forEach(c => { if (!c.checked) c.disabled = true; });
      } else {
        elective2Checks.forEach(c => { c.disabled = false; });
      }
    }

    elective2Checks.forEach(c => c.addEventListener('change', enforceMaxTwo));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errors = [];

      // reset errors
      showErrors([]);
      [nameEl, genderEl, dobEl, emailEl, phoneEl, addressEl, elective1El].forEach(el => markInvalid(el, false));
      elective2Checks.forEach(el => markInvalid(el, false));

      // Native validity checks
      const requiredFields = [
        { el: nameEl, label: 'Full Name' },
        { el: genderEl, label: 'Gender' },
        { el: dobEl, label: 'Date of Birth' },
        { el: emailEl, label: 'Email' },
        { el: phoneEl, label: 'Phone' },
        { el: addressEl, label: 'Address' },
        { el: elective1El, label: 'Elective (1)' },
      ];

      requiredFields.forEach(({ el, label }) => {
        if (!el) return;
        if (el.value == null || String(el.value).trim() === '') {
          errors.push(`${label} is required.`);
          markInvalid(el, true);
        } else if (typeof el.checkValidity === 'function' && !el.checkValidity()) {
          errors.push(`${label} is invalid.`);
          markInvalid(el, true);
        }
      });

      // Phone pattern enforcement (10 digits)
      const phoneValue = phoneEl && phoneEl.value ? phoneEl.value.trim() : '';
      if (phoneValue && !/^[0-9]{10}$/.test(phoneValue)) {
        errors.push('Phone must be exactly 10 digits.');
        markInvalid(phoneEl, true);
      }

      // DOB range validation: between 1980-01-01 and today minus 10 years
      if (dobEl && dobEl.value) {
        const dob = new Date(dobEl.value);
        const min = new Date('1980-01-01');
        const today = new Date();
        const tenYearsAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
        if (!(dob instanceof Date) || isNaN(dob.getTime()) || dob < min || dob > tenYearsAgo) {
          errors.push('Date of Birth must be a valid date and at least 10 years ago.');
          markInvalid(dobEl, true);
        }
      }

      // Exactly two elective2
      const selectedElective2 = elective2Checks.filter(c => c.checked).map(c => c.value);
      if (selectedElective2.length !== 2) {
        errors.push('Please select exactly 2 subjects from the second elective group.');
        elective2Checks.forEach(c => markInvalid(c, true));
      }

      if (errors.length) {
        showErrors(errors);
        return;
      }

      // Build data and persist to localStorage
      const payload = {
        name: nameEl.value.trim(),
        gender: genderEl.value,
        dob: dobEl.value,
        email: emailEl.value.trim(),
        phone: phoneValue,
        address: addressEl.value.trim(),
        elective1: elective1El.value,
        elective2: selectedElective2,
        submittedAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem('admissionData', JSON.stringify(payload));
      } catch {}

      // Redirect to thank-you page
      window.location.href = 'page2.html';
    });

    // Initial call for checkbox disabling state
    enforceMaxTwo();
  }

  // Thank-you page logic: render summary
  const summary = document.getElementById('submissionSummary');
  if (summary) {
    let data = null;
    try { data = JSON.parse(localStorage.getItem('admissionData') || 'null'); } catch {}

    if (!data) {
      summary.innerHTML = '<p>No submission data found. Please fill the form first.</p>';
      return;
    }

    const rows = [
      ['Full Name', data.name],
      ['Gender', data.gender],
      ['Date of Birth', data.dob],
      ['Email', data.email],
      ['Phone', data.phone],
      ['Address', data.address],
      ['Elective (1)', data.elective1],
      ['Electives (2)', Array.isArray(data.elective2) ? data.elective2.join(', ') : ''],
      ['Submitted At', new Date(data.submittedAt).toLocaleString()],
    ];

    const html = `
      <dl>
        ${rows.map(([k,v]) => `
          <div style="display:flex; gap:12px; margin:6px 0; flex-wrap: wrap;">
            <dt style="min-width:160px; font-weight:600;">${k}</dt>
            <dd style="margin:0;">${(v || '').toString()}</dd>
          </div>
        `).join('')}
      </dl>
      <div style="margin-top: 16px; text-align:center;">
        <a href="index.html" style="color:#00fff7; text-decoration:underline;">Back to form</a>
      </div>
    `;
    summary.innerHTML = html;

    // Optionally clear after rendering to avoid stale data
    try { localStorage.removeItem('admissionData'); } catch {}
  }
});
