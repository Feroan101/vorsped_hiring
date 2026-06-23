import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ 
  code, 
  language, 
  onChange, 
  onLanguageChange,
  availableLanguages = ['javascript', 'python']
}) {
  const [isLoading, setIsLoading] = useState(true);

  const languageLabels = {
    javascript: 'JavaScript',
    python: 'Python',
  };

  const monacoLanguage = language === 'javascript' ? 'javascript' : 'python';

  return (
    <div className="code-editor">
      <div className="code-editor__toolbar">
        <div className="code-editor__lang-selector">
          {availableLanguages.map(lang => (
            <button
              key={lang}
              className={`code-editor__lang-btn ${language === lang ? 'code-editor__lang-btn--active' : ''}`}
              onClick={() => onLanguageChange(lang)}
            >
              {languageLabels[lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="code-editor__container">
        {isLoading && (
          <div className="code-editor__loading">
            <div className="spinner"></div>
            <span>Loading editor...</span>
          </div>
        )}
        <Editor
          height="100%"
          language={monacoLanguage}
          value={code}
          onChange={(value) => onChange(value || '')}
          onMount={() => setIsLoading(false)}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
}
