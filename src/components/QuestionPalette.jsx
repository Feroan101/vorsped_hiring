export default function QuestionPalette({ 
  questions, 
  answers, 
  currentIndex, 
  visitedSet, 
  flaggedSet,
  onJump 
}) {
  const getStatus = (q, index) => {
    if (flaggedSet.has(q.id)) return 'flagged';
    if (answers[q.id] !== undefined && answers[q.id] !== '') return 'answered';
    if (visitedSet.has(q.id)) return 'visited';
    return 'not-visited';
  };

  return (
    <div className="palette">
      <div className="palette__header">
        <h3 className="palette__title">Question Palette</h3>
        <div className="palette__count">
          {Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length} / {questions.length} answered
        </div>
      </div>

      <div className="palette__grid">
        {questions.map((q, index) => (
          <button
            key={q.id}
            className={`palette__item palette__item--${getStatus(q, index)} ${
              index === currentIndex ? 'palette__item--current' : ''
            }`}
            onClick={() => onJump(index)}
            title={`Question ${q.displayNumber} — ${q.category}`}
          >
            {q.displayNumber}
          </button>
        ))}
      </div>

      <div className="palette__legend">
        <div className="palette__legend-item">
          <span className="palette__dot palette__dot--not-visited"></span>
          <span>Not Visited</span>
        </div>
        <div className="palette__legend-item">
          <span className="palette__dot palette__dot--visited"></span>
          <span>Visited</span>
        </div>
        <div className="palette__legend-item">
          <span className="palette__dot palette__dot--answered"></span>
          <span>Answered</span>
        </div>
        <div className="palette__legend-item">
          <span className="palette__dot palette__dot--flagged"></span>
          <span>Flagged</span>
        </div>
      </div>
    </div>
  );
}
