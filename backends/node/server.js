/**
 * EduCalc Pro - Node.js Backend Microservice
 * Demonstrates high-concurrency Node.js REST API implementation.
 */

const http = require('http');

const PORT = process.env.PORT || 4000;

function calculateGrade(pct) {
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  if (pct >= 35) return 'E';
  return 'F';
}

function processMarks(payload) {
  const studentName = payload.student_name || 'Student';
  const passingThreshold = payload.passing_threshold || 35.0;
  const subjectsData = payload.subjects || [];

  if (!subjectsData.length) {
    throw new Error('At least one subject is required.');
  }

  let totalObtained = 0;
  let totalMax = 0;

  const subjects = subjectsData.map(item => {
    const name = String(item.name || '').trim();
    const obtained = Number(item.obtained || 0);
    const max = Number(item.max || 100);

    if (max <= 0) throw new Error(`Max marks for ${name} must be > 0.`);
    if (obtained < 0) throw new Error(`Obtained marks for ${name} cannot be negative.`);
    if (obtained > max) throw new Error(`Obtained marks cannot exceed max marks for ${name}.`);

    totalObtained += obtained;
    totalMax += max;

    const percentage = Number(((obtained * 100) / max).toFixed(2));
    const passed = percentage >= passingThreshold;
    const grade = calculateGrade(percentage);

    return {
      name,
      obtained_marks: obtained,
      max_marks: max,
      percentage,
      passed,
      grade
    };
  });

  const overallPercentage = totalMax > 0 ? Number(((totalObtained * 100) / totalMax).toFixed(2)) : 0;
  const passedOverall = overallPercentage >= passingThreshold;
  const passedAllSubjects = subjects.every(s => s.passed);

  const sortedByPct = [...subjects].sort((a, b) => a.percentage - b.percentage);

  return {
    student_name: studentName,
    total_obtained: Number(totalObtained.toFixed(2)),
    total_max: Number(totalMax.toFixed(2)),
    overall_percentage: overallPercentage,
    passed_overall: passedOverall,
    passed_all_subjects: passedAllSubjects,
    overall_grade: calculateGrade(overallPercentage),
    passing_threshold: passingThreshold,
    highest_subject: sortedByPct[sortedByPct.length - 1],
    lowest_subject: sortedByPct[0],
    subjects
  };
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'healthy', engine: 'Node.js Microservice', version: '2.0.0' }));
  }

  if (req.method === 'POST' && req.url === '/api/calculate') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const result = processMarks(payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`[Node.js Engine] Listening on http://localhost:${PORT}`);
});
