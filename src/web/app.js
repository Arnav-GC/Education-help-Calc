/**
 * EduCalc Pro - Interactive Controller & Calculation Engine
 * Supports client-side computing, Python backend API sync,
 * preset management, history caching, and exports.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const marksForm = document.getElementById('marksForm');
  const studentNameInput = document.getElementById('studentName');
  const passThresholdInput = document.getElementById('passThreshold');
  const pillUniformYes = document.getElementById('pillUniformYes');
  const pillUniformNo = document.getElementById('pillUniformNo');
  const uniformTotalContainer = document.getElementById('uniformTotalContainer');
  const uniformMaxInput = document.getElementById('uniformMax');
  const subjectsBody = document.getElementById('subjectsBody');
  const btnAddSubject = document.getElementById('btnAddSubject');
  const btnResetForm = document.getElementById('btnResetForm');
  const btnCalculate = document.getElementById('btnCalculate');
  const btnClearAll = document.getElementById('btnClearAll');
  const engineSelect = document.getElementById('engineSelect');
  const apiStatusBadge = document.getElementById('apiStatusBadge');

  // Results DOM
  const resultsSection = document.getElementById('resultsSection');
  const resultStudentSubtitle = document.getElementById('resultStudentSubtitle');
  const resTotalMarks = document.getElementById('resTotalMarks');
  const resTotalRatio = document.getElementById('resTotalRatio');
  const resPercentage = document.getElementById('resPercentage');
  const resGrade = document.getElementById('resGrade');
  const resStatusBadge = document.getElementById('resStatusBadge');
  const resStatusDetail = document.getElementById('resStatusDetail');
  const resHighest = document.getElementById('resHighest');
  const resHighestScore = document.getElementById('resHighestScore');
  const resLowest = document.getElementById('resLowest');
  const resLowestScore = document.getElementById('resLowestScore');
  const reportTableBody = document.getElementById('reportTableBody');
  const reportTimestamp = document.getElementById('reportTimestamp');
  const passingRuleNote = document.getElementById('passingRuleNote');

  // Export & History DOM
  const btnPrint = document.getElementById('btnPrint');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnExportJSON = document.getElementById('btnExportJSON');
  const historyListContainer = document.getElementById('historyListContainer');
  const btnClearHistory = document.getElementById('btnClearHistory');
  const toastNotification = document.getElementById('toastNotification');

  // State
  let isUniformMode = true;
  let lastReportData = null;

  // Preset Datasets
  const PRESETS = {
    standard: [
      { name: 'Mathematics', obtained: 85, max: 100 },
      { name: 'English Literature', obtained: 78, max: 100 },
      { name: 'Physics', obtained: 92, max: 100 },
      { name: 'Chemistry', obtained: 68, max: 100 },
      { name: 'Computer Science', obtained: 95, max: 100 }
    ],
    original: [
      { name: 'Subject 1', obtained: 75, max: 100 },
      { name: 'Subject 2', obtained: 82, max: 100 },
      { name: 'Subject 3', obtained: 64, max: 100 },
      { name: 'Subject 4', obtained: 91, max: 100 },
      { name: 'Subject 5', obtained: 55, max: 100 },
      { name: 'Subject 6', obtained: 88, max: 100 },
      { name: 'Subject 7', obtained: 70, max: 100 },
      { name: 'Subject 8', obtained: 79, max: 100 }
    ],
    stem: [
      { name: 'Calculus & Algebra', obtained: 90, max: 100 },
      { name: 'Classical Mechanics', obtained: 84, max: 100 },
      { name: 'Organic Chemistry', obtained: 72, max: 100 },
      { name: 'Data Structures', obtained: 96, max: 100 }
    ]
  };

  // Check Backend Health
  async function checkBackendStatus() {
    try {
      const response = await fetch('/api/health', { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        apiStatusBadge.textContent = '● Python API Online';
        apiStatusBadge.className = 'badge badge-status';
      } else {
        throw new Error('API unavailable');
      }
    } catch {
      apiStatusBadge.textContent = '● Client Engine Active';
      apiStatusBadge.className = 'badge badge-js';
    }
  }

  // Toast Helper
  function showToast(message, duration = 3000) {
    toastNotification.textContent = message;
    toastNotification.style.display = 'block';
    setTimeout(() => {
      toastNotification.style.display = 'none';
    }, duration);
  }

  // Row Management
  function createSubjectRow(name = '', obtained = '', max = 100) {
    const row = document.createElement('tr');
    const rowIndex = subjectsBody.children.length + 1;

    const currentUniformMax = parseFloat(uniformMaxInput.value) || 100;
    const finalMax = isUniformMode ? currentUniformMax : (max || 100);

    row.innerHTML = `
      <td class="row-index text-muted" style="font-weight: 600;">${rowIndex}</td>
      <td>
        <input type="text" class="sub-name-input" placeholder="Subject Name" value="${name}" required>
      </td>
      <td>
        <input type="number" class="sub-obtained-input" placeholder="0" min="0" max="${finalMax}" step="0.5" value="${obtained !== '' ? obtained : ''}" required>
      </td>
      <td>
        <input type="number" class="sub-max-input" placeholder="100" min="1" step="0.5" value="${finalMax}" ${isUniformMode ? 'disabled' : ''} required>
      </td>
      <td class="pct-preview">
        <span class="pct-value">-%</span>
      </td>
      <td style="text-align: center;">
        <button type="button" class="btn-delete-row" title="Remove Subject" aria-label="Remove Subject">&times;</button>
      </td>
    `;

    // Hook inline preview calculations
    const obtainedInput = row.querySelector('.sub-obtained-input');
    const maxInput = row.querySelector('.sub-max-input');
    const pctValue = row.querySelector('.pct-value');
    const deleteBtn = row.querySelector('.btn-delete-row');

    function updatePreview() {
      const obt = parseFloat(obtainedInput.value);
      const m = isUniformMode ? (parseFloat(uniformMaxInput.value) || 100) : (parseFloat(maxInput.value) || 1);
      if (!isNaN(obt) && !isNaN(m) && m > 0) {
        const pct = ((obt * 100) / m).toFixed(1);
        pctValue.textContent = `${pct}%`;
        pctValue.style.color = pct >= (parseFloat(passThresholdInput.value) || 35) ? '#34d399' : '#f87171';
      } else {
        pctValue.textContent = '-%';
        pctValue.style.color = '';
      }
    }

    obtainedInput.addEventListener('input', updatePreview);
    maxInput.addEventListener('input', updatePreview);
    deleteBtn.addEventListener('click', () => {
      if (subjectsBody.children.length <= 1) {
        showToast('At least one subject is required.');
        return;
      }
      row.remove();
      refreshRowIndexes();
    });

    subjectsBody.appendChild(row);
    updatePreview();
  }

  function refreshRowIndexes() {
    Array.from(subjectsBody.children).forEach((row, idx) => {
      row.querySelector('.row-index').textContent = idx + 1;
    });
  }

  function loadPreset(presetKey) {
    const list = PRESETS[presetKey];
    if (!list) return;

    subjectsBody.innerHTML = '';
    list.forEach(item => {
      createSubjectRow(item.name, item.obtained, item.max);
    });
    showToast(`Loaded ${list.length} subjects preset.`);
  }

  // Toggle Uniform Mode
  function setUniformMode(uniform) {
    isUniformMode = uniform;
    if (isUniformMode) {
      pillUniformYes.classList.add('active');
      pillUniformNo.classList.remove('active');
      uniformTotalContainer.style.display = 'flex';
      const maxVal = uniformMaxInput.value || 100;
      document.querySelectorAll('.sub-max-input').forEach(input => {
        input.value = maxVal;
        input.disabled = true;
      });
    } else {
      pillUniformYes.classList.remove('active');
      pillUniformNo.classList.add('active');
      uniformTotalContainer.style.display = 'none';
      document.querySelectorAll('.sub-max-input').forEach(input => {
        input.disabled = false;
      });
    }
  }

  pillUniformYes.addEventListener('click', () => setUniformMode(true));
  pillUniformNo.addEventListener('click', () => setUniformMode(false));

  uniformMaxInput.addEventListener('input', () => {
    if (isUniformMode) {
      const val = uniformMaxInput.value;
      document.querySelectorAll('.sub-max-input').forEach(input => {
        input.value = val;
        input.dispatchEvent(new Event('input'));
      });
    }
  });

  // Preset Buttons
  document.querySelectorAll('.btn-preset').forEach(btn => {
    const preset = btn.dataset.preset;
    if (preset) {
      btn.addEventListener('click', () => loadPreset(preset));
    }
  });

  btnClearAll.addEventListener('click', () => {
    subjectsBody.innerHTML = '';
    createSubjectRow('', '', isUniformMode ? (uniformMaxInput.value || 100) : 100);
    resultsSection.style.display = 'none';
    showToast('Subjects list cleared.');
  });

  btnAddSubject.addEventListener('click', () => {
    createSubjectRow('', '', isUniformMode ? (uniformMaxInput.value || 100) : 100);
  });

  btnResetForm.addEventListener('click', () => {
    studentNameInput.value = '';
    passThresholdInput.value = '35';
    loadPreset('standard');
    resultsSection.style.display = 'none';
    showToast('Form reset to default.');
  });

  // Calculate Logic
  function getSubjectsFormData() {
    const rows = Array.from(subjectsBody.children);
    const data = [];
    const uniformMaxVal = parseFloat(uniformMaxInput.value) || 100;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const name = row.querySelector('.sub-name-input').value.trim();
      const obtained = parseFloat(row.querySelector('.sub-obtained-input').value);
      const max = isUniformMode ? uniformMaxVal : parseFloat(row.querySelector('.sub-max-input').value);

      if (!name) {
        showToast(`Row ${i + 1}: Subject name cannot be blank.`);
        return null;
      }
      if (isNaN(obtained) || obtained < 0) {
        showToast(`Row ${i + 1} (${name}): Obtained marks must be a positive number.`);
        return null;
      }
      if (isNaN(max) || max <= 0) {
        showToast(`Row ${i + 1} (${name}): Max marks must be greater than 0.`);
        return null;
      }
      if (obtained > max) {
        showToast(`Row ${i + 1} (${name}): Obtained marks (${obtained}) cannot exceed total marks (${max}).`);
        return null;
      }

      data.push({ name, obtained, max });
    }

    if (data.length === 0) {
      showToast('Please add at least one subject.');
      return null;
    }

    return data;
  }

  // Client-Side Calculation Engine
  function calculateClientSide(studentName, subjectsData, threshold) {
    let totalObtained = 0;
    let totalMax = 0;

    const subjects = subjectsData.map(sub => {
      totalObtained += sub.obtained;
      totalMax += sub.max;
      const pct = parseFloat(((sub.obtained * 100) / sub.max).toFixed(2));
      const passed = pct >= threshold;
      let grade = 'F';
      if (pct >= 90) grade = 'A+';
      else if (pct >= 80) grade = 'A';
      else if (pct >= 70) grade = 'B';
      else if (pct >= 60) grade = 'C';
      else if (pct >= 50) grade = 'D';
      else if (pct >= threshold) grade = 'E';

      return {
        name: sub.name,
        obtained_marks: sub.obtained,
        max_marks: sub.max,
        percentage: pct,
        passed,
        grade
      };
    });

    const overallPct = parseFloat(((totalObtained * 100) / totalMax).toFixed(2));
    const passedOverall = overallPct >= threshold;
    const passedAllSubjects = subjects.every(s => s.passed);

    let overallGrade = 'F';
    if (overallPct >= 90) overallGrade = 'A+';
    else if (overallPct >= 80) overallGrade = 'A';
    else if (overallPct >= 70) overallGrade = 'B';
    else if (overallPct >= 60) overallGrade = 'C';
    else if (overallPct >= 50) overallGrade = 'D';
    else if (overallPct >= threshold) overallGrade = 'E';

    const sortedByPct = [...subjects].sort((a, b) => a.percentage - b.percentage);
    const lowest = sortedByPct[0];
    const highest = sortedByPct[sortedByPct.length - 1];

    return {
      student_name: studentName,
      total_obtained: parseFloat(totalObtained.toFixed(2)),
      total_max: parseFloat(totalMax.toFixed(2)),
      overall_percentage: overallPct,
      passed_overall: passedOverall,
      passed_all_subjects: passedAllSubjects,
      overall_grade: overallGrade,
      passing_threshold: threshold,
      highest_subject: { name: highest.name, percentage: highest.percentage, obtained: highest.obtained_marks, max: highest.max_marks },
      lowest_subject: { name: lowest.name, percentage: lowest.percentage, obtained: lowest.obtained_marks, max: lowest.max_marks },
      subjects
    };
  }

  // Perform Calculation
  async function handleCalculate() {
    const subjectsData = getSubjectsFormData();
    if (!subjectsData) return;

    const studentName = studentNameInput.value.trim() || 'Student';
    const threshold = parseFloat(passThresholdInput.value) || 35.0;
    const engineMode = engineSelect.value;

    let report = null;

    if (engineMode === 'api') {
      try {
        const response = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_name: studentName,
            passing_threshold: threshold,
            subjects: subjectsData
          })
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Server error occurred');
        }

        report = await response.json();
        showToast('Calculated via Python Backend API.');
      } catch (err) {
        console.warn('API error, falling back to client-side engine:', err.message);
        showToast(`Backend unavailable: ${err.message}. Calculating in browser.`);
        report = calculateClientSide(studentName, subjectsData, threshold);
      }
    } else {
      report = calculateClientSide(studentName, subjectsData, threshold);
      showToast('Calculated instantly in browser.');
    }

    renderResults(report);
    saveToHistory(report);
  }

  btnCalculate.addEventListener('click', handleCalculate);

  // Render Results
  function renderResults(report) {
    lastReportData = report;

    resultStudentSubtitle.textContent = `Student: ${report.student_name}`;
    resTotalMarks.textContent = `${report.total_obtained} / ${report.total_max}`;
    resTotalRatio.textContent = `${report.overall_percentage}% of aggregate marks`;

    resPercentage.textContent = `${report.overall_percentage}%`;
    resGrade.textContent = `Grade: ${report.overall_grade}`;

    if (report.passed_overall) {
      resStatusBadge.textContent = 'PASSED';
      resStatusBadge.className = 'metric-value status-pill status-pass';
      resStatusDetail.textContent = report.passed_all_subjects ? 'Passed in all subjects' : 'Passed in aggregate average';
    } else {
      resStatusBadge.textContent = 'FAILED';
      resStatusBadge.className = 'metric-value status-pill status-fail';
      resStatusDetail.textContent = 'Failed in aggregate average';
    }

    if (report.highest_subject) {
      resHighest.textContent = report.highest_subject.name;
      resHighestScore.textContent = `${report.highest_subject.percentage}% (${report.highest_subject.obtained}/${report.highest_subject.max})`;
    }

    if (report.lowest_subject) {
      resLowest.textContent = report.lowest_subject.name;
      resLowestScore.textContent = `${report.lowest_subject.percentage}% (${report.lowest_subject.obtained}/${report.lowest_subject.max})`;
    }

    // Breakdown Table
    reportTableBody.innerHTML = '';
    report.subjects.forEach(sub => {
      const row = document.createElement('tr');
      const passClass = sub.passed ? 'status-pass' : 'status-fail';
      const fillClass = sub.passed ? 'progress-fill-pass' : 'progress-fill-fail';

      row.innerHTML = `
        <td style="font-weight: 600;">${sub.name}</td>
        <td>${sub.obtained_marks}</td>
        <td>${sub.max_marks}</td>
        <td><strong style="font-family: var(--font-mono);">${sub.percentage}%</strong></td>
        <td style="width: 180px;">
          <div class="progress-bar-container">
            <div class="progress-bar-fill ${fillClass}" style="width: ${Math.min(sub.percentage, 100)}%;"></div>
          </div>
        </td>
        <td>
          <span class="badge ${passClass}">${sub.passed ? 'PASSED' : 'FAILED'}</span>
        </td>
      `;
      reportTableBody.appendChild(row);
    });

    reportTimestamp.textContent = `Generated on ${new Date().toLocaleString()}`;
    passingRuleNote.textContent = `* Minimum ${report.passing_threshold}% passing standard applied.`;

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  // History Storage (localStorage)
  function saveToHistory(report) {
    try {
      const history = JSON.parse(localStorage.getItem('educalc_history') || '[]');
      history.unshift({
        id: Date.now(),
        name: report.student_name,
        percentage: report.overall_percentage,
        grade: report.overall_grade,
        passed: report.passed_overall,
        totalObtained: report.total_obtained,
        totalMax: report.total_max,
        date: new Date().toLocaleDateString(),
        data: report
      });
      // Keep last 10
      localStorage.setItem('educalc_history', JSON.stringify(history.slice(0, 10)));
      renderHistory();
    } catch (e) {
      console.error('History save error', e);
    }
  }

  function renderHistory() {
    try {
      const history = JSON.parse(localStorage.getItem('educalc_history') || '[]');
      if (history.length === 0) {
        historyListContainer.innerHTML = '<p class="empty-state">No recent calculations stored yet.</p>';
        return;
      }

      historyListContainer.innerHTML = '';
      history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
          <div>
            <strong>${item.name}</strong> • ${item.percentage}% (Grade ${item.grade})
            <span class="badge ${item.passed ? 'status-pass' : 'status-fail'}" style="margin-left: 0.5rem;">${item.passed ? 'PASS' : 'FAIL'}</span>
          </div>
          <span style="color: var(--text-dim); font-size: 0.8rem;">${item.date}</span>
        `;
        div.addEventListener('click', () => {
          renderResults(item.data);
          showToast(`Loaded saved record for ${item.name}.`);
        });
        historyListContainer.appendChild(div);
      });
    } catch {
      historyListContainer.innerHTML = '<p class="empty-state">Could not read history.</p>';
    }
  }

  btnClearHistory.addEventListener('click', () => {
    localStorage.removeItem('educalc_history');
    renderHistory();
    showToast('Calculation history cleared.');
  });

  // Export CSV
  btnExportCSV.addEventListener('click', () => {
    if (!lastReportData) return;
    const rep = lastReportData;
    let csv = `Student Name,${rep.student_name}\n`;
    csv += `Overall Percentage,${rep.overall_percentage}%\n`;
    csv += `Overall Grade,${rep.overall_grade}\n`;
    csv += `Status,${rep.passed_overall ? 'PASSED' : 'FAILED'}\n`;
    csv += `Total Obtained,${rep.total_obtained}\n`;
    csv += `Total Max,${rep.total_max}\n\n`;
    csv += `Subject,Marks Obtained,Max Marks,Percentage,Status,Grade\n`;

    rep.subjects.forEach(s => {
      csv += `"${s.name}",${s.obtained_marks},${s.max_marks},${s.percentage}%,${s.passed ? 'PASSED' : 'FAILED'},${s.grade}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rep.student_name.replace(/\s+/g, '_')}_marks_report.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported report as CSV.');
  });

  // Export JSON
  btnExportJSON.addEventListener('click', () => {
    if (!lastReportData) return;
    const jsonStr = JSON.stringify(lastReportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${lastReportData.student_name.replace(/\s+/g, '_')}_marks_report.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported report as JSON.');
  });

  // Print
  btnPrint.addEventListener('click', () => {
    window.print();
  });

  // Initialize
  loadPreset('standard');
  renderHistory();
  checkBackendStatus();
});
