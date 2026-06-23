// localStorage wrapper for all assessment data

const KEYS = {
  CURRENT_SESSION: 'via_current_session',
  APTITUDE_QUESTIONS: 'via_aptitude_questions',
  APTITUDE_ANSWERS: 'via_aptitude_answers',
  DOMAIN_QUESTIONS: 'via_domain_questions',
  DOMAIN_ANSWERS: 'via_domain_answers',
  CODING_PROBLEMS: 'via_coding_problems',
  CODING_SUBMISSIONS: 'via_coding_submissions',
  ASSESSMENT_STATE: 'via_assessment_state',
  ALL_RESULTS: 'via_all_results',
};

// ─── Session Management ─────────────────────────────────────────────

export function saveSession(session) {
  localStorage.setItem(KEYS.CURRENT_SESSION, JSON.stringify(session));
}

export function getSession() {
  const data = localStorage.getItem(KEYS.CURRENT_SESSION);
  return data ? JSON.parse(data) : null;
}

export function clearSession() {
  localStorage.removeItem(KEYS.CURRENT_SESSION);
  localStorage.removeItem(KEYS.APTITUDE_QUESTIONS);
  localStorage.removeItem(KEYS.APTITUDE_ANSWERS);
  localStorage.removeItem(KEYS.DOMAIN_QUESTIONS);
  localStorage.removeItem(KEYS.DOMAIN_ANSWERS);
  localStorage.removeItem(KEYS.CODING_PROBLEMS);
  localStorage.removeItem(KEYS.CODING_SUBMISSIONS);
  localStorage.removeItem(KEYS.ASSESSMENT_STATE);
}

// ─── Aptitude Questions & Answers ───────────────────────────────────

export function saveAptitudeQuestions(questions) {
  localStorage.setItem(KEYS.APTITUDE_QUESTIONS, JSON.stringify(questions));
}

export function getAptitudeQuestions() {
  const data = localStorage.getItem(KEYS.APTITUDE_QUESTIONS);
  return data ? JSON.parse(data) : null;
}

export function saveAptitudeAnswer(questionId, answer) {
  const answers = getAptitudeAnswers();
  answers[questionId] = answer;
  localStorage.setItem(KEYS.APTITUDE_ANSWERS, JSON.stringify(answers));
}

export function getAptitudeAnswers() {
  const data = localStorage.getItem(KEYS.APTITUDE_ANSWERS);
  return data ? JSON.parse(data) : {};
}

// ─── Domain Questions & Answers ─────────────────────────────────────

export function saveDomainQuestions(questions) {
  localStorage.setItem(KEYS.DOMAIN_QUESTIONS, JSON.stringify(questions));
}

export function getDomainQuestions() {
  const data = localStorage.getItem(KEYS.DOMAIN_QUESTIONS);
  return data ? JSON.parse(data) : null;
}

export function saveDomainAnswer(questionId, answer) {
  const answers = getDomainAnswers();
  answers[questionId] = answer;
  localStorage.setItem(KEYS.DOMAIN_ANSWERS, JSON.stringify(answers));
}

export function getDomainAnswers() {
  const data = localStorage.getItem(KEYS.DOMAIN_ANSWERS);
  return data ? JSON.parse(data) : {};
}

// ─── Coding Problems & Submissions ─────────────────────────────────

export function saveCodingProblems(problems) {
  localStorage.setItem(KEYS.CODING_PROBLEMS, JSON.stringify(problems));
}

export function getCodingProblems() {
  const data = localStorage.getItem(KEYS.CODING_PROBLEMS);
  return data ? JSON.parse(data) : null;
}

export function saveCodingSubmission(problemId, submission) {
  const submissions = getCodingSubmissions();
  submissions[problemId] = submission;
  localStorage.setItem(KEYS.CODING_SUBMISSIONS, JSON.stringify(submissions));
}

export function getCodingSubmissions() {
  const data = localStorage.getItem(KEYS.CODING_SUBMISSIONS);
  return data ? JSON.parse(data) : {};
}

// ─── Assessment State ───────────────────────────────────────────────

export function saveAssessmentState(state) {
  localStorage.setItem(KEYS.ASSESSMENT_STATE, JSON.stringify(state));
}

export function getAssessmentState() {
  const data = localStorage.getItem(KEYS.ASSESSMENT_STATE);
  return data ? JSON.parse(data) : null;
}

// ─── Results ─────────────────────────────────────────────────────────

export function saveResult(result) {
  const results = getAllResults();
  results.push({
    ...result,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(KEYS.ALL_RESULTS, JSON.stringify(results));
}

export function getAllResults() {
  const data = localStorage.getItem(KEYS.ALL_RESULTS);
  return data ? JSON.parse(data) : [];
}

export function clearAllResults() {
  localStorage.removeItem(KEYS.ALL_RESULTS);
}

// ─── Scoring ─────────────────────────────────────────────────────────

export function calculateAptitudeScore(questions, answers) {
  let correct = 0;
  const details = [];

  questions.forEach(q => {
    const userAnswer = answers[q.id];
    let isCorrect = false;

    if (q.type === 'numerical') {
      isCorrect = String(userAnswer).trim() === String(q.correctAnswer).trim();
    } else {
      isCorrect = userAnswer === q.correctAnswer;
    }

    if (isCorrect) correct++;

    details.push({
      questionId: q.id,
      category: q.category,
      question: q.question,
      userAnswer: userAnswer || 'Not answered',
      correctAnswer: q.correctAnswer,
      isCorrect,
    });
  });

  return { score: correct, total: questions.length, details };
}

export function calculateDomainScore(questions, answers) {
  let correct = 0;
  const details = [];

  questions.forEach(q => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;

    if (isCorrect) correct++;

    details.push({
      questionId: q.id,
      category: q.category,
      question: q.question,
      userAnswer: userAnswer || 'Not answered',
      correctAnswer: q.correctAnswer,
      isCorrect,
    });
  });

  return { score: correct, total: questions.length, details };
}
