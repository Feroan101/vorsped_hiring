// In-browser code execution for JavaScript, Python, and Rust
// JavaScript: sandboxed Function constructor with console capture
// Python: Pyodide WebAssembly runtime (lazy-loaded with stdout/stderr hooks)
// Rust: Client-side transpilation simulator (transpiles basic Rust constructs to JS and runs in sandbox)

let pyodideInstance = null;
let pyodideLoading = false;
let pyodideLoadPromise = null;

// Global buffers to capture Pyodide print outputs
let pyodideStdout = '';
let pyodideStderr = '';

/**
 * Run JavaScript code in a sandboxed environment
 */
export async function runJavaScript(code) {
  return new Promise((resolve) => {
    const logs = [];
    const errors = [];
    const startTime = performance.now();

    try {
      // Create a sandbox with captured console
      const sandbox = `
        const __logs = [];
        const __errors = [];
        const console = {
          log: (...args) => __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          error: (...args) => __errors.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          warn: (...args) => __logs.push('WARN: ' + args.map(a => String(a)).join(' ')),
          info: (...args) => __logs.push(args.map(a => String(a)).join(' ')),
        };
        
        try {
          ${code}
        } catch(e) {
          __errors.push(e.message);
        }
        
        return { logs: __logs, errors: __errors };
      `;

      const fn = new Function(sandbox);
      const result = fn();
      const executionTime = performance.now() - startTime;

      resolve({
        output: result.logs.join('\n'),
        error: result.errors.length > 0 ? result.errors.join('\n') : null,
        executionTime: Math.round(executionTime),
      });
    } catch (e) {
      const executionTime = performance.now() - startTime;
      resolve({
        output: '',
        error: e.message,
        executionTime: Math.round(executionTime),
      });
    }
  });
}

/**
 * Load Pyodide WebAssembly runtime (lazy, once)
 */
async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoadPromise;

  pyodideLoading = true;
  pyodideLoadPromise = (async () => {
    // Load Pyodide script if not already loaded
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Capture standard output natively
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      stdout: (text) => {
        pyodideStdout += text + '\n';
      },
      stderr: (text) => {
        pyodideStderr += text + '\n';
      }
    });
    pyodideLoading = false;
    return pyodideInstance;
  })();

  return pyodideLoadPromise;
}

/**
 * Run Python code using Pyodide (with native stdout redirection to prevent I/O errors)
 */
export async function runPython(code) {
  const startTime = performance.now();
  pyodideStdout = '';
  pyodideStderr = '';

  try {
    const pyodide = await loadPyodide();
    
    // Execute user code. Print statements will fire the stdout callback hook.
    pyodide.runPython(code);
    
    const executionTime = performance.now() - startTime;
    return {
      output: pyodideStdout.trim(),
      error: pyodideStderr.trim() || null,
      executionTime: Math.round(executionTime),
    };
  } catch (e) {
    const executionTime = performance.now() - startTime;
    return {
      output: pyodideStdout.trim(),
      error: pyodideStderr.trim() || e.message,
      executionTime: Math.round(executionTime),
    };
  }
}

/**
 * Transpiles simple Rust algorithm code into executable JavaScript for browser execution
 */
export function transpileRustToJS(rustCode) {
  let jsCode = rustCode;

  // 1. Remove common imports
  jsCode = jsCode.replace(/use\s+[^;]+;/g, '');

  // 2. Transpile functions:
  // fn name(arg: Type, ...) -> RetType {  -->  function name(arg, ...) {
  jsCode = jsCode.replace(/fn\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*(?:->\s*[^{]+)?\s*\{/g, (match, fnName, args) => {
    const cleanArgs = args.split(',').map(arg => {
      const parts = arg.split(':');
      return parts[0].trim();
    }).filter(a => a).join(', ');
    return `function ${fnName}(${cleanArgs}) {`;
  });

  // 3. Transpile let mut variables and type casting:
  // let mut x: i32 = val;  -->  let x = val;
  jsCode = jsCode.replace(/let\s+(?:mut\s+)?([a-zA-Z0-9_]+)(?:\s*:\s*[^=]+)?\s*=\s*([^;]+);/g, 'let $1 = $2;');

  // 4. Strip cast operators like "i as i32" or "as usize"
  jsCode = jsCode.replace(/\s+as\s+[a-zA-Z0-9_]+/g, '');

  // 5. Transpile macros: vec![...] -> [...]
  jsCode = jsCode.replace(/vec!\[/g, '[');
  jsCode = jsCode.replace(/Vec::new\(\)/g, '[]');
  jsCode = jsCode.replace(/Vec::with_capacity\([^)]*\)/g, '[]');

  // 6. Transpile loops:
  // for i in 0..n {  -->  for (let i = 0; i < n; i++) {
  jsCode = jsCode.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+([0-9a-zA-Z_.\-+]+)\.\.([0-9a-zA-Z_.\-+()]+)\s*\{/g, 'for (let $1 = $2; $1 < $3; $1++) {');
  // for item in array {  -->  for (let item of array) {
  jsCode = jsCode.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_.]+)(?:\s*\.iter\(\))?\s*\{/g, 'for (let $1 of $2) {');

  // 7. Transpile println!("...", args) -> console.log(...)
  jsCode = jsCode.replace(/println!\(\s*"([^"]*)"\s*(?:,\s*([^)]*))?\)/g, (match, formatStr, args) => {
    if (!args) return `console.log("${formatStr}")`;
    const parts = args.split(',').map(a => a.trim());
    let formatted = formatStr;
    parts.forEach(part => {
      formatted = formatted.replace('{}', `\${${part}}`);
      formatted = formatted.replace('{:?}', `\${typeof ${part} === 'object' ? JSON.stringify(${part}) : ${part}}`);
    });
    return `console.log(\`${formatted}\`)`;
  });

  // 8. Map common Rust methods to JavaScript equivalents
  jsCode = jsCode.replace(/\.len\(\)/g, '.length');
  jsCode = jsCode.replace(/\.is_empty\(\)/g, '.length === 0');
  jsCode = jsCode.replace(/\.push\(/g, '.push(');
  jsCode = jsCode.replace(/\.to_string\(\)/g, '');
  jsCode = jsCode.replace(/\.to_owned\(\)/g, '');
  jsCode = jsCode.replace(/\.clone\(\)/g, '');
  jsCode = jsCode.replace(/\.as_str\(\)/g, '');
  jsCode = jsCode.replace(/\.chars\(\)\.rev\(\)\.collect::<String>\(\)/g, ".split('').reverse().join('')");
  jsCode = jsCode.replace(/\.to_lowercase\(\)/g, '.toLowerCase()');

  // 9. Handle implicit returns (Rust lines without semicolons at the end of blocks/functions)
  let lines = jsCode.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line && !line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}') && !line.startsWith('//') && !line.startsWith('for') && !line.startsWith('if') && !line.startsWith('else') && !line.startsWith('return')) {
      let nextLine = (lines[i + 1] || '').trim();
      if (nextLine === '}' || line.endsWith('}')) {
        lines[i] = lines[i].replace(line, `return ${line};`);
      }
    }
  }
  jsCode = lines.join('\n');

  return jsCode;
}

/**
 * Execute Rust code by transpiling it to JavaScript
 */
export async function runRust(code) {
  try {
    const jsCode = transpileRustToJS(code);
    return await runJavaScript(jsCode);
  } catch (e) {
    return {
      output: '',
      error: `Transpilation / execution error: ${e.message}`,
      executionTime: 0
    };
  }
}

/**
 * Run code in the selected language
 */
export async function runCode(code, language) {
  switch (language) {
    case 'javascript':
      return runJavaScript(code);
    case 'python':
      return runPython(code);
    case 'rust':
      return runRust(code);
    default:
      return { output: '', error: `Unsupported language: ${language}`, executionTime: 0 };
  }
}

/**
 * Check if Pyodide is loaded
 */
export function isPyodideLoaded() {
  return pyodideInstance !== null;
}

/**
 * Pre-load Pyodide (call before coding round starts)
 */
export async function preloadPyodide() {
  try {
    await loadPyodide();
    return true;
  } catch (e) {
    console.error('Failed to preload Pyodide:', e);
    return false;
  }
}
