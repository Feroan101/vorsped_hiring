// Domain Question Banks — Starter questions for each stream (10 questions each)
// Section B for non-coding streams are scenario/case-study MCQs.

export const DOMAIN_QUESTIONS = {
  SWE: [
    {
      id: 'swe1',
      category: 'Software Engineering',
      type: 'mcq',
      question: 'Which of the following describes the "Interface Segregation Principle" in SOLID design?',
      options: [
        'A class should have only one reason to change.',
        'Software entities should be open for extension but closed for modification.',
        'Clients should not be forced to depend on methods they do not use.',
        'High-level modules should not depend on low-level modules.'
      ],
      correctAnswer: 'Clients should not be forced to depend on methods they do not use.'
    },
    {
      id: 'swe2',
      category: 'Databases',
      type: 'mcq',
      question: 'In databases, what does the ACID property "Isolation" guarantee?',
      options: [
        'Transactions are committed permanently to the database.',
        'Concurrent execution of transactions leaves the database in the same state as if they were executed sequentially.',
        'A transaction either succeeds completely or fails completely.',
        'Any database transaction must change affected data only in allowed ways.'
      ],
      correctAnswer: 'Concurrent execution of transactions leaves the database in the same state as if they were executed sequentially.'
    },
    {
      id: 'swe3',
      category: 'Web Concepts',
      type: 'mcq',
      question: 'What is the purpose of the HTTP status code 403?',
      options: [
        'The requested resource was not found.',
        'The server understands the request, but refuses to authorize it.',
        'The client must authenticate itself to get the requested response.',
        'The request has succeeded.'
      ],
      correctAnswer: 'The server understands the request, but refuses to authorize it.'
    },
    {
      id: 'swe4',
      category: 'Programming Fundamentals',
      type: 'mcq',
      question: 'Which data structure uses the LIFO (Last In First Out) property?',
      options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
      correctAnswer: 'Stack'
    },
    {
      id: 'swe5',
      category: 'OOP',
      type: 'mcq',
      question: 'What is Polymorphism in Object-Oriented Programming?',
      options: [
        'The process of wrapping data and code operating on the data into a single unit.',
        'The ability of an object to take on many forms, allowing a subclass to define its own unique behaviors.',
        'The process of hiding implementation details from the user.',
        'The mechanism of base class code reuse.'
      ],
      correctAnswer: 'The ability of an object to take on many forms, allowing a subclass to define its own unique behaviors.'
    },
    {
      id: 'swe6',
      category: 'Algorithms',
      type: 'mcq',
      question: 'What is the worst-case time complexity of the Quick Sort algorithm?',
      options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 'O(n²)'
    },
    {
      id: 'swe7',
      category: 'Version Control',
      type: 'mcq',
      question: 'What is the difference between "git fetch" and "git pull"?',
      options: [
        'git pull only downloads tracking branch data; git fetch merges it.',
        'git fetch downloads commits from remote without merging; git pull downloads and merges them.',
        'git fetch updates the local repository database; git pull deletes local history.',
        'There is no difference between them.'
      ],
      correctAnswer: 'git fetch downloads commits from remote without merging; git pull downloads and merges them.'
    },
    {
      id: 'swe8',
      category: 'Design Patterns',
      type: 'mcq',
      question: 'Which design pattern is best suited for letting a set of observer objects know when a subject changes state?',
      options: ['Singleton Pattern', 'Factory Pattern', 'Observer Pattern', 'Decorator Pattern'],
      correctAnswer: 'Observer Pattern'
    },
    {
      id: 'swe9',
      category: 'Web Performance',
      type: 'mcq',
      question: 'What does DOM stand for in web development?',
      options: [
        'Data Object Management',
        'Document Object Model',
        'Detailed Object Map',
        'Dynamic Operation Module'
      ],
      correctAnswer: 'Document Object Model'
    },
    {
      id: 'swe10',
      category: 'Software Engineering',
      type: 'mcq',
      question: 'Which of the following is NOT a core principle of RESTful APIs?',
      options: [
        'Statelessness',
        'Client-Server separation',
        'Stateful sessions on server',
        'Uniform interface'
      ],
      correctAnswer: 'Stateful sessions on server'
    }
  ],

  DAI: [
    {
      id: 'dai1',
      category: 'Statistics',
      type: 'mcq',
      question: 'In statistics, which metric is highly sensitive to outliers in a numeric dataset?',
      options: ['Median', 'Mean', 'Mode', 'Interquartile Range'],
      correctAnswer: 'Mean'
    },
    {
      id: 'dai2',
      category: 'SQL',
      type: 'mcq',
      question: 'Which SQL keyword is used to filter records aggregated by a GROUP BY clause?',
      options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
      correctAnswer: 'HAVING'
    },
    {
      id: 'dai3',
      category: 'Machine Learning',
      type: 'mcq',
      question: 'What is the primary objective of Unsupervised Learning?',
      options: [
        'Predict continuous label values based on historical inputs.',
        'Classify data into known, labeled categories.',
        'Find hidden patterns or clusters in unlabeled data.',
        'Optimize output through reinforcement rewards.'
      ],
      correctAnswer: 'Find hidden patterns or clusters in unlabeled data.'
    },
    {
      id: 'dai4',
      category: 'Data Manipulation',
      type: 'mcq',
      question: 'In Python (Pandas library), which method is used to remove rows containing null values?',
      options: ['df.dropna()', 'df.remove_null()', 'df.clean()', 'df.drop_na_rows()'],
      correctAnswer: 'df.dropna()'
    },
    {
      id: 'dai5',
      category: 'AI Concepts',
      type: 'mcq',
      question: 'What problem does a high variance model (overfitting) suffer from?',
      options: [
        'It fits the training data too closely and generalizes poorly to unseen data.',
        'It fails to fit even the training data correctly.',
        'It has a very simple architecture that cannot capture complex data trends.',
        'It takes too much time to execute without giving outputs.'
      ],
      correctAnswer: 'It fits the training data too closely and generalizes poorly to unseen data.'
    },
    {
      id: 'dai6',
      category: 'Data Interpretation',
      type: 'mcq',
      question: 'A company reports a correlation of -0.85 between employee training hours and error rates. What does this mean?',
      options: [
        'Training has no visible impact on error rates.',
        'As training hours increase, error rates tend to decrease significantly.',
        'As training hours increase, error rates increase.',
        'The data is invalid because correlation cannot be negative.'
      ],
      correctAnswer: 'As training hours increase, error rates tend to decrease significantly.'
    },
    {
      id: 'dai7',
      category: 'Machine Learning',
      type: 'mcq',
      question: 'Which metric is best suited for evaluating a binary classifier on an extremely imbalanced dataset (e.g., fraud detection)?',
      options: ['Accuracy', 'F1-Score / Precision-Recall', 'Mean Absolute Error', 'R-squared'],
      correctAnswer: 'F1-Score / Precision-Recall'
    },
    {
      id: 'dai8',
      category: 'AI Concepts',
      type: 'mcq',
      question: 'What does "Epoch" refer to in the context of Deep Learning?',
      options: [
        'A single training step using one batch of inputs.',
        'The period of time required to initialize the weights.',
        'One full pass of the entire training dataset through the neural network.',
        'The mathematical function used to calculate gradients.'
      ],
      correctAnswer: 'One full pass of the entire training dataset through the neural network.'
    },
    {
      id: 'dai9',
      category: 'Scenario Analysis',
      type: 'mcq',
      question: 'Scenario: You are designing an AI system to classify patient tumors as benign or malignant. Which error type is more critical to minimize?',
      options: [
        'False Positives (classifying benign as malignant)',
        'False Negatives (classifying malignant as benign)',
        'Both are equally critical',
        'Neither; accuracy is the only metric that matters'
      ],
      correctAnswer: 'False Negatives (classifying malignant as benign)'
    },
    {
      id: 'dai10',
      category: 'Data Strategy',
      type: 'mcq',
      question: 'Scenario: A database has 10 million records. A simple query takes 15 seconds. What is the most effective first step to optimize performance?',
      options: [
        'Upgrade the server RAM.',
        'Create indexes on columns used in the WHERE and JOIN clauses.',
        'Partition the table into 10 separate tables.',
        'Rewrite the query in a different programming language.'
      ],
      correctAnswer: 'Create indexes on columns used in the WHERE and JOIN clauses.'
    }
  ],

  QAT: [
    {
      id: 'qat1',
      category: 'Testing Principles',
      type: 'mcq',
      question: 'What is the main objective of Integration Testing?',
      options: [
        'To verify the functionality of individual modules of code.',
        'To test interfaces and interaction between integrated units/components.',
        'To validate the software against final customer requirements.',
        'To test the internal logic, loops, and conditions of a module.'
      ],
      correctAnswer: 'To test interfaces and interaction between integrated units/components.'
    },
    {
      id: 'qat2',
      category: 'SDLC / STLC',
      type: 'mcq',
      question: 'In the Software Testing Life Cycle (STLC), when are test cases designed?',
      options: [
        'Requirements Analysis phase',
        'Test Planning phase',
        'Test Design phase',
        'Test Execution phase'
      ],
      correctAnswer: 'Test Design phase'
    },
    {
      id: 'qat3',
      category: 'Testing Types',
      type: 'mcq',
      question: 'What is Regression Testing?',
      options: [
        'Testing to check if a new feature works correctly.',
        'Testing a fixed software version to verify that previous bugs are gone.',
        'Testing to ensure that recent code modifications have not adversely affected existing features.',
        'Testing the limits of a system under extreme loads.'
      ],
      correctAnswer: 'Testing to ensure that recent code modifications have not adversely affected existing features.'
    },
    {
      id: 'qat4',
      category: 'Testing Techniques',
      type: 'mcq',
      question: 'If an input field accepts numbers from 10 to 50, which of the following is the correct set of Boundary Values?',
      options: ['9, 10, 50, 51', '10, 11, 49, 50', '5, 10, 50, 55', '10, 30, 50'],
      correctAnswer: '9, 10, 50, 51'
    },
    {
      id: 'qat5',
      category: 'Bug Lifecycle',
      type: 'mcq',
      question: 'If a developer rejects a reported bug stating it is "by design," what status should the bug report be set to?',
      options: ['Closed', 'Rejected / Deferred', 'In Progress', 'Reopened'],
      correctAnswer: 'Rejected / Deferred'
    },
    {
      id: 'qat6',
      category: 'Testing Types',
      type: 'mcq',
      question: 'Which of the following is a non-functional testing type?',
      options: ['Unit Testing', 'Usability & Performance Testing', 'System Testing', 'Smoke Testing'],
      correctAnswer: 'Usability & Performance Testing'
    },
    {
      id: 'qat7',
      category: 'Testing Principles',
      type: 'mcq',
      question: 'What is the "Pesticide Paradox" in software testing?',
      options: [
        'Running the same tests repeatedly will eventually fail to find new bugs.',
        'More bugs are found in a module that was already highly buggy.',
        'Bugs increase as the project timeline decreases.',
        'Writing automated tests will introduce bugs into the application code.'
      ],
      correctAnswer: 'Running the same tests repeatedly will eventually fail to find new bugs.'
    },
    {
      id: 'qat8',
      category: 'Testing Automation',
      type: 'mcq',
      question: 'What is the primary benefit of test automation?',
      options: [
        'It eliminates the need for manual exploratory testing completely.',
        'It can execute repetitive tests quickly and consistently, especially for regression testing.',
        'It guarantees 100% bug-free software releases.',
        'It requires no upkeep or code maintenance.'
      ],
      correctAnswer: 'It can execute repetitive tests quickly and consistently, especially for regression testing.'
    },
    {
      id: 'qat9',
      category: 'Scenario Analysis',
      type: 'mcq',
      question: 'Scenario: A payment gateway fails 5% of the time, returning a blank screen without error messages. How should this bug be prioritized?',
      options: [
        'Low Severity, Low Priority',
        'High Severity, Low Priority',
        'High Severity, High Priority',
        'Low Severity, High Priority'
      ],
      correctAnswer: 'High Severity, High Priority'
    },
    {
      id: 'qat10',
      category: 'Scenario Analysis',
      type: 'mcq',
      question: 'Scenario: You find a critical bug in a release candidate 2 hours before a major product launch. What is the most appropriate action?',
      options: [
        'Ignore it and release anyway, planning to fix it in the next update.',
        'Log the bug, assign it to a developer, and immediately alert the project manager to discuss delaying the release or disabling the feature.',
        'Try to edit the application code yourself to fix the bug quickly.',
        'Delete the code repository to hide the bug.'
      ],
      correctAnswer: 'Log the bug, assign it to a developer, and immediately alert the project manager to discuss delaying the release or disabling the feature.'
    }
  ],

  CYB: [
    {
      id: 'cyb1',
      category: 'Networks',
      type: 'mcq',
      question: 'Which port is used by default for secure HTTP (HTTPS) traffic?',
      options: ['Port 80', 'Port 443', 'Port 22', 'Port 8080'],
      correctAnswer: 'Port 443'
    },
    {
      id: 'cyb2',
      category: 'Security Basics',
      type: 'mcq',
      question: 'What are the three core principles of the CIA triad in cybersecurity?',
      options: [
        'Centrality, Integrity, Auditing',
        'Confidentiality, Integrity, Availability',
        'Control, Identification, Authentication',
        'Cryptography, Inspection, Access'
      ],
      correctAnswer: 'Confidentiality, Integrity, Availability'
    },
    {
      id: 'cyb3',
      category: 'Threats',
      type: 'mcq',
      question: 'Which type of attack involves an attacker placing themselves between two communicating nodes to intercept data?',
      options: [
        'SQL Injection (SQLi)',
        'Man-in-the-Middle (MitM) Attack',
        'Distributed Denial of Service (DDoS)',
        'Phishing'
      ],
      correctAnswer: 'Man-in-the-Middle (MitM) Attack'
    },
    {
      id: 'cyb4',
      category: 'Cryptography',
      type: 'mcq',
      question: 'What is the main characteristic of Symmetric Cryptography?',
      options: [
        'It uses a public key to encrypt and a private key to decrypt.',
        'It uses the same shared key for both encryption and decryption.',
        'It does not require keys, relying on hashing algorithms instead.',
        'It is slower than asymmetric cryptography.'
      ],
      correctAnswer: 'It uses the same shared key for both encryption and decryption.'
    },
    {
      id: 'cyb5',
      category: 'Security Architecture',
      type: 'mcq',
      question: 'What is the purpose of a Firewall in a network?',
      options: [
        'To store backup files in case of a system crash.',
        'To monitor and filter incoming and outgoing network traffic based on security rules.',
        'To speed up website loading times using cached files.',
        'To scan local hard drives for malware.'
      ],
      correctAnswer: 'To monitor and filter incoming and outgoing network traffic based on security rules.'
    },
    {
      id: 'cyb6',
      category: 'Vulnerabilities',
      type: 'mcq',
      question: 'What type of vulnerability occurs when a user input is executed directly as SQL commands?',
      options: [
        'Cross-Site Scripting (XSS)',
        'SQL Injection (SQLi)',
        'Buffer Overflow',
        'Broken Authentication'
      ],
      correctAnswer: 'SQL Injection (SQLi)'
    },
    {
      id: 'cyb7',
      category: 'Threats',
      type: 'mcq',
      question: 'What is "Social Engineering" in cybersecurity?',
      options: [
        'Writing algorithms to track social media interactions.',
        'Manipulating people into performing actions or divulging confidential information.',
        'Configuring corporate networks to allow social logins.',
        'A type of software virus that propagates through emails.'
      ],
      correctAnswer: 'Manipulating people into performing actions or divulging confidential information.'
    },
    {
      id: 'cyb8',
      category: 'Compliance',
      type: 'mcq',
      question: 'What does GDPR regulate?',
      options: [
        'Global Domain Name System operations.',
        'Credit card payment security standards.',
        'Data protection and privacy for individuals in the European Union.',
        'Government communication standards.'
      ],
      correctAnswer: 'Data protection and privacy for individuals in the European Union.'
    },
    {
      id: 'cyb9',
      category: 'Scenario Analysis',
      type: 'mcq',
      question: 'Scenario: Employees report receiving emails claiming to be from the CEO asking them to buy gift cards for clients urgently. What type of attack is this?',
      options: [
        'Ransomware',
        'Spear Phishing / CEO Fraud',
        'Brute Force Attack',
        'IP Spoofing'
      ],
      correctAnswer: 'Spear Phishing / CEO Fraud'
    },
    {
      id: 'cyb10',
      category: 'Scenario Analysis',
      type: 'mcq',
      question: 'Scenario: You notice an unusual spike in outgoing network traffic on Port 443 at 3:00 AM from a database server. What is the most critical first step?',
      options: [
        'Reboot the database server.',
        'Isolate the server from the network to prevent potential data exfiltration and initiate an incident response investigation.',
        'Delete the firewall log files to clear storage.',
        'Ignore it, assuming it is an automatic backup task.'
      ],
      correctAnswer: 'Isolate the server from the network to prevent potential data exfiltration and initiate an incident response investigation.'
    }
  ],

  UIX: [
    {
      id: 'uix1',
      category: 'Design Principles',
      type: 'mcq',
      question: 'What does "User-Centered Design" focus on?',
      options: [
        'Creating features that the development team finds easy to implement.',
        'Fulfilling the user\'s needs, preferences, and workflows at every design phase.',
        'Prioritizing visual animations and flashy colors above all else.',
        'Maximizing company advertising space on the homepage.'
      ],
      correctAnswer: 'Fulfilling the user\'s needs, preferences, and workflows at every design phase.'
    },
    {
      id: 'uix2',
      category: 'Heuristics',
      type: 'mcq',
      question: 'Which of the following represents Jakob Nielsen\'s heuristic "Consistency and Standards"?',
      options: [
        'Users should not have to wonder whether different words, situations, or actions mean the same thing.',
        'The system should always keep users informed about what is going on.',
        'Websites should load within 2 seconds on mobile devices.',
        'Designs should always use the same color palette across all industries.'
      ],
      correctAnswer: 'Users should not have to wonder whether different words, situations, or actions mean the same thing.'
    },
    {
      id: 'uix3',
      category: 'Typography & Layout',
      type: 'mcq',
      question: 'What does "Visual Hierarchy" mean in UI Design?',
      options: [
        'Making all text the same size so it looks neat.',
        'Arranging layout elements in a way that guides the reader\'s eye in a specific order of importance.',
        'Using as many colors as possible to make the screen look lively.',
        'Hiding interactive buttons in menus.'
      ],
      correctAnswer: 'Arranging layout elements in a way that guides the reader\'s eye in a specific order of importance.'
    },
    {
      id: 'uix4',
      category: 'Accessibility',
      type: 'mcq',
      question: 'What is the minimum recommended color contrast ratio for normal text under WCAG 2.1 AA guidelines?',
      options: ['3:1', '4.5:1', '7:1', '10:1'],
      correctAnswer: '4.5:1'
    },
    {
      id: 'uix5',
      category: 'Design Systems',
      type: 'mcq',
      question: 'What is a "Design Token" in modern design systems?',
      options: [
        'A cryptographic token used for security access.',
        'A single design asset like an SVG icon.',
        'Visual variables (like colors, spacing, font weights) stored as platform-agnostic key-value pairs.',
        'A prototype of a user screen.'
      ],
      correctAnswer: 'Visual variables (like colors, spacing, font weights) stored as platform-agnostic key-value pairs.'
    },
    {
      id: 'uix6',
      category: 'Interaction Design',
      type: 'mcq',
      question: 'What is an "Affordance" in UI Design?',
      options: [
        'The monetary cost to build a user interface.',
        'The property of an element that suggests its functionality (e.g., a button looking clickable).',
        'How fast an application responds to clicks.',
        'The grid system used to align cards.'
      ],
      correctAnswer: 'The property of an element that suggests its functionality (e.g., a button looking clickable).'
    },
    {
      id: 'uix7',
      category: 'Research Methods',
      type: 'mcq',
      question: 'What is the main purpose of "A/B Testing" in UX?',
      options: [
        'To test if code compiles in environment A vs environment B.',
        'To compare two versions of a webpage to see which one performs better based on user metrics.',
        'To evaluate design layouts with precisely two users.',
        'To write test cases for automated UI scripts.'
      ],
      correctAnswer: 'To compare two versions of a webpage to see which one performs better based on user metrics.'
    },
    {
      id: 'uix8',
      category: 'Cognitive Science',
      type: 'mcq',
      question: 'What does Hick\'s Law state?',
      options: [
        'The time it takes to make a decision increases with the number and complexity of choices.',
        'The average person can only keep 7 items in their working memory.',
        'Users spend most of their time on other websites, expecting yours to work similarly.',
        'Objects that are close to each other tend to be grouped together.'
      ],
      correctAnswer: 'The time it takes to make a decision increases with the number and complexity of choices.'
    },
    {
      id: 'uix9',
      category: 'Scenario Critique',
      type: 'mcq',
      question: 'Scenario: Users are dropping off at the checkout form. The form has 18 fields, including middle name, fax number, and referral details. What is the most likely UX issue?',
      options: [
        'The page colors are not vibrant enough.',
        'High cognitive load and friction caused by too many unnecessary input fields.',
        'The Submit button should be placed at the top of the form.',
        'The font sizes are too small.'
      ],
      correctAnswer: 'High cognitive load and friction caused by too many unnecessary input fields.'
    },
    {
      id: 'uix10',
      category: 'Scenario Critique',
      type: 'mcq',
      question: 'Scenario: You are designing a mobile app for delivery drivers who work outdoors in bright sunlight. Which design attribute is most important?',
      options: [
        'Adding subtle gradients and micro-interactions.',
        'High color contrast and clear, large typography for readability under sunlight.',
        'Using a dark mode theme exclusively.',
        'Implementing complex multi-touch gestures.'
      ],
      correctAnswer: 'High color contrast and clear, large typography for readability under sunlight.'
    }
  ],

  BAL: [
    {
      id: 'bal1',
      category: 'Requirements Gathering',
      type: 'mcq',
      question: 'What is the difference between Functional and Non-Functional Requirements?',
      options: [
        'Functional describes what the system does; Non-functional describes how it behaves (performance, security, usability).',
        'Functional requirements are written by developers; Non-functional are written by business users.',
        'Functional requirements are optional; Non-functional are mandatory.',
        'There is no difference between them.'
      ],
      correctAnswer: 'Functional describes what the system does; Non-functional describes how it behaves (performance, security, usability).'
    },
    {
      id: 'bal2',
      category: 'Agile Concepts',
      type: 'mcq',
      question: 'What does the acronym INVEST stand for in agile user story writing?',
      options: [
        'Independent, Negotiable, Valuable, Estimable, Small, Testable',
        'Integrated, Normalized, Verified, Efficient, Structured, Tracked',
        'Immediate, Necessary, Visual, Easy, Simple, Tactical',
        'Investment, Negotiation, Valuation, Estimation, Strategy, Timeline'
      ],
      correctAnswer: 'Independent, Negotiable, Valuable, Estimable, Small, Testable'
    },
    {
      id: 'bal3',
      category: 'Business Modeling',
      type: 'mcq',
      question: 'What is a SWOT Analysis used for in business analysis?',
      options: [
        'To schedule development cycles.',
        'To assess Strengths, Weaknesses, Opportunities, and Threats for a business initiative.',
        'To optimize SQL database queries.',
        'To track software defects during testing.'
      ],
      correctAnswer: 'To assess Strengths, Weaknesses, Opportunities, and Threats for a business initiative.'
    },
    {
      id: 'bal4',
      category: 'Process Mapping',
      type: 'mcq',
      question: 'What does BPMN stand for?',
      options: [
        'Business Process Model and Notation',
        'Basic Project Management Network',
        'Binary Program Mapping Node',
        'Business Performance Metrics Network'
      ],
      correctAnswer: 'Business Process Model and Notation'
    },
    {
      id: 'bal5',
      category: 'Prioritization',
      type: 'mcq',
      question: 'In the MoSCoW prioritization technique, what does the "S" stand for?',
      options: ['Simple', 'Should Have', 'Solution', 'System Requirements'],
      correctAnswer: 'Should Have'
    },
    {
      id: 'bal6',
      category: 'Stakeholder Management',
      type: 'mcq',
      question: 'What is the primary purpose of a RACI Matrix?',
      options: [
        'To calculate project budgets.',
        'To define roles and responsibilities (Responsible, Accountable, Consulted, Informed) for project tasks.',
        'To analyze system database relationships.',
        'To schedule deployment timelines.'
      ],
      correctAnswer: 'To define roles and responsibilities (Responsible, Accountable, Consulted, Informed) for project tasks.'
    },
    {
      id: 'bal7',
      category: 'Agile Concepts',
      type: 'mcq',
      question: 'What is a Product Backlog?',
      options: [
        'A list of bugs found in the production system.',
        'An ordered list of everything that might be needed in the product, serving as the single source of requirements.',
        'The list of archived documents from completed projects.',
        'The server logs recording user logins.'
      ],
      correctAnswer: 'An ordered list of everything that might be needed in the product, serving as the single source of requirements.'
    },
    {
      id: 'bal8',
      category: 'Requirements Gathering',
      type: 'mcq',
      question: 'Which requirements elicitation technique involves observing users in their natural work environment?',
      options: ['Brainstorming', 'Job Shadowing / Observation', 'Prototyping', 'Surveys'],
      correctAnswer: 'Job Shadowing / Observation'
    },
    {
      id: 'bal9',
      category: 'Scenario Analysis',
      type: 'mcq',
      question: 'Scenario: A client asks for a feature that contradicts the primary business objective of the project. What should the Business Analyst do first?',
      options: [
        'Tell the developers to implement it anyway to keep the client happy.',
        'Immediately reject the request without discussing it.',
        'Analyze the impact and schedule a meeting with the client to discuss the conflict and clarify business objectives.',
        'File a bug report in the system.'
      ],
      correctAnswer: 'Analyze the impact and schedule a meeting with the client to discuss the conflict and clarify business objectives.'
    },
    {
      id: 'bal10',
      category: 'Scenario Analysis',
      type: 'mcq',
      question: 'Scenario: A project deadline is cut in half. The sponsor insists that all original requirements must be delivered. How should the BA respond?',
      options: [
        'Agree and tell the developers to work twice as fast.',
        'Request to run a MoSCoW prioritization session to identify the Minimum Viable Product (MVP) that can be delivered in the new timeframe.',
        'Resign from the project immediately.',
        'Ignore the deadline change and proceed as originally scheduled.'
      ],
      correctAnswer: 'Request to run a MoSCoW prioritization session to identify the Minimum Viable Product (MVP) that can be delivered in the new timeframe.'
    }
  ],

  SAM: [
    {
      id: 'sam1',
      category: 'Marketing Concepts',
      type: 'mcq',
      question: 'What are the classic "4 Ps" of the marketing mix?',
      options: [
        'People, Process, Physical Evidence, Productivity',
        'Product, Price, Place, Promotion',
        'Planning, Packaging, Positioning, Profits',
        'Purchase, Pageviews, Publicity, Partnerships'
      ],
      correctAnswer: 'Product, Price, Place, Promotion'
    },
    {
      id: 'sam2',
      category: 'Sales Funnel',
      type: 'mcq',
      question: 'In marketing, what does "AIDA" stand for?',
      options: [
        'Attention, Interest, Desire, Action',
        'Acquisition, Interaction, Delivery, Analytics',
        'Authority, Influence, Decision, Assessment',
        'Analysis, Integration, Distribution, Advertising'
      ],
      correctAnswer: 'Attention, Interest, Desire, Action'
    },
    {
      id: 'sam3',
      category: 'Metrics',
      type: 'mcq',
      question: 'What does CAC stand for in business analytics?',
      options: [
        'Customer Acquisition Cost',
        'Customer Average Consumption',
        'Corporate Asset Category',
        'Campaign Activity Count'
      ],
      correctAnswer: 'Customer Acquisition Cost'
    },
    {
      id: 'sam4',
      category: 'Digital Marketing',
      type: 'mcq',
      question: 'Which metric measures the percentage of visitors who leave a website after viewing only one page?',
      options: ['Click-Through Rate (CTR)', 'Bounce Rate', 'Conversion Rate', 'Churn Rate'],
      correctAnswer: 'Bounce Rate'
    },
    {
      id: 'sam5',
      category: 'Sales Strategy',
      type: 'mcq',
      question: 'What is B2B selling?',
      options: [
        'Business to Brand transactions.',
        'Business to Business transactions.',
        'Business to Consumer transactions.',
        'Brand to Buyer transactions.'
      ],
      correctAnswer: 'Business to Business transactions.'
    },
    {
      id: 'sam6',
      category: 'Marketing Strategy',
      type: 'mcq',
      question: 'What is the main goal of Search Engine Optimization (SEO)?',
      options: [
        'To buy paid ads on Google searches.',
        'To increase organic (unpaid) traffic to a website by improving search engine rankings.',
        'To design interactive web application interfaces.',
        'To monitor server network speeds.'
      ],
      correctAnswer: 'To increase organic (unpaid) traffic to a website by improving search engine rankings.'
    },
    {
      id: 'sam7',
      category: 'Sales Funnel',
      type: 'mcq',
      question: 'What is a "Qualified Lead"?',
      options: [
        'Any person who visits the company website.',
        'A potential customer who has been vetted and matches the target profile and intent criteria.',
        'A customer who has already made a purchase.',
        'An email address purchased from a list provider.'
      ],
      correctAnswer: 'A potential customer who has been vetted and matches the target profile and intent criteria.'
    },
    {
      id: 'sam8',
      category: 'Metrics',
      type: 'mcq',
      question: 'If 1,000 people click on an ad and 20 of them buy the product, what is the Conversion Rate?',
      options: ['0.2%', '2%', '5%', '20%'],
      correctAnswer: '2%'
    },
    {
      id: 'sam9',
      category: 'Scenario Decision',
      type: 'mcq',
      question: 'Scenario: A potential corporate client complains that your product price is 20% higher than your main competitor. What is the best sales approach?',
      options: [
        'Immediately offer a 25% discount to win the deal.',
        'Argue with the client and tell them the competitor\'s product is trash.',
        'Shift the conversation from price to value, demonstrating how your product\'s unique features, support, and efficiency justify the investment.',
        'Walk away from the deal immediately.'
      ],
      correctAnswer: 'Shift the conversation from price to value, demonstrating how your product\'s unique features, support, and efficiency justify the investment.'
    },
    {
      id: 'sam10',
      category: 'Scenario Decision',
      type: 'mcq',
      question: 'Scenario: An email marketing campaign has a high Open Rate (40%) but a very low Click-Through Rate (1.2%). What is the most logical element to optimize first?',
      options: [
        'The subject line of the email.',
        'The call-to-action (CTA) buttons, links, and content body value inside the email.',
        'The domain name of the company.',
        'The timing of sending the email.'
      ],
      correctAnswer: 'The call-to-action (CTA) buttons, links, and content body value inside the email.'
    }
  ],

  HRD: [
    {
      id: 'hrd1',
      category: 'Recruitment',
      type: 'mcq',
      question: 'What is the purpose of an ATS in human resources?',
      options: [
        'To track server active running time.',
        'To manage, organize, and filter job applicants throughout the hiring process (Applicant Tracking System).',
        'To evaluate tax payouts for employees.',
        'To monitor employee keyboard activities.'
      ],
      correctAnswer: 'To manage, organize, and filter job applicants throughout the hiring process (Applicant Tracking System).'
    },
    {
      id: 'hrd2',
      category: 'Performance Management',
      type: 'mcq',
      question: 'What is a "360-Degree Feedback" review process?',
      options: [
        'An evaluation done solely by the direct supervisor.',
        'Feedback collected from peers, subordinates, supervisors, and sometimes clients, along with self-evaluation.',
        'A review done every 360 days.',
        'A mathematical system to rank employees.'
      ],
      correctAnswer: 'Feedback collected from peers, subordinates, supervisors, and sometimes clients, along with self-evaluation.'
    },
    {
      id: 'hrd3',
      category: 'Employee Relations',
      type: 'mcq',
      question: 'What does "Onboarding" refer to?',
      options: [
        'The process of booking corporate travel flights.',
        'Integrating a new employee into the organization, introducing culture, systems, and job responsibilities.',
        'The termination interview process.',
        'Hosting group meetings on boats.'
      ],
      correctAnswer: 'Integrating a new employee into the organization, introducing culture, systems, and job responsibilities.'
    },
    {
      id: 'hrd4',
      category: 'Compensation & Benefits',
      type: 'mcq',
      question: 'What is CTC in payroll?',
      options: [
        'Cost to Company (total salary package including direct and indirect benefits).',
        'Calculated Tax Contribution.',
        'Corporate Training Compliance.',
        'Candidate Transfer Card.'
      ],
      correctAnswer: 'Cost to Company (total salary package including direct and indirect benefits).'
    },
    {
      id: 'hrd5',
      category: 'HR Law & Compliance',
      type: 'mcq',
      question: 'Which of the following describes "Constructive Dismissal"?',
      options: [
        'Terminating an employee for stealing corporate assets.',
        'An employee resigning because the employer created a hostile or intolerable work environment.',
        'Laying off employees due to corporate budget cuts.',
        'Retiring an employee at legal age.'
      ],
      correctAnswer: 'An employee resigning because the employer created a hostile or intolerable work environment.'
    },
    {
      id: 'hrd6',
      category: 'Organizational Behavior',
      type: 'mcq',
      question: 'What is Employee Engagement?',
      options: [
        'The scheduling of employee marriages.',
        'The level of emotional commitment, motivation, and involvement an employee has toward their organization.',
        'The number of hours an employee spends sitting at their desk.',
        'Signing legal agreements when joining the company.'
      ],
      correctAnswer: 'The level of emotional commitment, motivation, and involvement an employee has toward their organization.'
    },
    {
      id: 'hrd7',
      category: 'Recruitment',
      type: 'mcq',
      question: 'In behavioral interviews, what does the STAR method stand for?',
      options: [
        'Situation, Task, Action, Result',
        'Skills, Training, Ambition, Retention',
        'Structure, Timeline, Activity, Response',
        'Salary, Title, Authority, Responsibility'
      ],
      correctAnswer: 'Situation, Task, Action, Result'
    },
    {
      id: 'hrd8',
      category: 'HR Metrics',
      type: 'mcq',
      question: 'How is the Employee Turnover Rate calculated?',
      options: [
        'The percentage of employees promoted within a year.',
        'The number of employees who left divided by the average number of employees during a period, multiplied by 100.',
        'The number of resumes received divided by hiring count.',
        'Total payroll costs divided by total employees.'
      ],
      correctAnswer: 'The number of employees who left divided by the average number of employees during a period, multiplied by 100.'
    },
    {
      id: 'hrd9',
      category: 'Workplace Scenario',
      type: 'mcq',
      question: 'Scenario: Two team members have a public disagreement during a sprint planning meeting. What should the HR representative advise the manager to do?',
      options: [
        'Ignore it, assuming they will work it out eventually.',
        'Suspend both employees immediately.',
        'Address the conflict privately and facilitate a constructive discussion, focusing on behaviors and solutions rather than personalities.',
        'Fire the employee who spoke louder.'
      ],
      correctAnswer: 'Address the conflict privately and facilitate a constructive discussion, focusing on behaviors and solutions rather than personalities.'
    },
    {
      id: 'hrd10',
      category: 'Workplace Scenario',
      type: 'mcq',
      question: 'Scenario: A highly productive employee\'s performance drops suddenly over 2 months. What is the most appropriate first intervention?',
      options: [
        'Issue a formal written termination warning immediately.',
        'Conduct a supportive one-on-one meeting to understand any underlying issues, offer resources, and collaboratively establish a performance plan.',
        'Reduce their salary to motivate them to work harder.',
        'Assign their tasks to someone else without saying anything.'
      ],
      correctAnswer: 'Conduct a supportive one-on-one meeting to understand any underlying issues, offer resources, and collaboratively establish a performance plan.'
    }
  ],

  FIN: [
    {
      id: 'fin1',
      category: 'Accounting',
      type: 'mcq',
      question: 'Which financial statement shows a company\'s assets, liabilities, and equity at a specific point in time?',
      options: ['Income Statement', 'Balance Sheet', 'Cash Flow Statement', 'Retained Earnings Statement'],
      correctAnswer: 'Balance Sheet'
    },
    {
      id: 'fin2',
      category: 'Finance Concepts',
      type: 'mcq',
      question: 'What does "Working Capital" represent?',
      options: [
        'The total cash stored in banks.',
        'Current Assets minus Current Liabilities, indicating short-term operational liquidity.',
        'The long-term debt of the company.',
        'The total physical assets like buildings and equipment.'
      ],
      correctAnswer: 'Current Assets minus Current Liabilities, indicating short-term operational liquidity.'
    },
    {
      id: 'fin3',
      category: 'Accounting',
      type: 'mcq',
      question: 'Under double-entry bookkeeping, what is the accounting equation?',
      options: [
        'Assets = Liabilities + Equity',
        'Assets = Liabilities - Equity',
        'Revenue - Expenses = Liabilities',
        'Assets + Liabilities = Equity'
      ],
      correctAnswer: 'Assets = Liabilities + Equity'
    },
    {
      id: 'fin4',
      category: 'Corporate Finance',
      type: 'mcq',
      question: 'What is IRR in finance?',
      options: [
        'Internal Rate of Return (discount rate making NPV of cash flows equal to zero).',
        'Inflation Risk Ratio.',
        'Investment Recovery Rate.',
        'Interest Recovery Revenue.'
      ],
      correctAnswer: 'Internal Rate of Return (discount rate making NPV of cash flows equal to zero).'
    },
    {
      id: 'fin5',
      category: 'Finance Metrics',
      type: 'mcq',
      question: 'What does EBITDA measure?',
      options: [
        'Earnings Before Interest, Taxes, Depreciation, and Amortization.',
        'Economic Value Added Taxes.',
        'Equity Book Value and Interest Assets.',
        'Estimated Budget Deficit.'
      ],
      correctAnswer: 'Earnings Before Interest, Taxes, Depreciation, and Amortization.'
    },
    {
      id: 'fin6',
      category: 'Market Concepts',
      type: 'mcq',
      question: 'What is a "Liquid Asset"?',
      options: [
        'An asset that is in gaseous or fluid state.',
        'An asset that can be converted into cash quickly with minimal impact on its value.',
        'A stock that pays high dividends.',
        'A long-term real estate investment.'
      ],
      correctAnswer: 'An asset that can be converted into cash quickly with minimal impact on its value.'
    },
    {
      id: 'fin7',
      category: 'Financial Analysis',
      type: 'mcq',
      question: 'What does a high Price-to-Earnings (P/E) ratio typically suggest about a stock?',
      options: [
        'The stock is extremely cheap and undervalued.',
        'Investors expect high growth in the future, or the stock is overvalued.',
        'The company is going bankrupt.',
        'The company does not pay any taxes.'
      ],
      correctAnswer: 'Investors expect high growth in the future, or the stock is overvalued.'
    },
    {
      id: 'fin8',
      category: 'Accounting',
      type: 'mcq',
      question: 'What is the main difference between Accrual and Cash accounting?',
      options: [
        'Accrual records revenues when earned and expenses when incurred; Cash records them when cash changes hands.',
        'Accrual is used only by small businesses; Cash by large corporations.',
        'Accrual does not record expenses.',
        'There is no difference; they are alternative names for the same method.'
      ],
      correctAnswer: 'Accrual records revenues when earned and expenses when incurred; Cash records them when cash changes hands.'
    },
    {
      id: 'fin9',
      category: 'Business Numericals',
      type: 'mcq',
      question: 'Scenario: An investment of ₹1,00,000 yields ₹1,20,000 after one year. What is the Return on Investment (ROI)?',
      options: ['10%', '20%', '15%', '12%'],
      correctAnswer: '20%'
    },
    {
      id: 'fin10',
      category: 'Business Numericals',
      type: 'mcq',
      question: 'Scenario: A store buys an item for ₹400 and sells it for ₹500. What is the Gross Profit Margin percentage?',
      options: ['20%', '25%', '10%', '50%'],
      correctAnswer: '20%'
    }
  ]
};

// Shuffles an array using Fisher-Yates algorithm
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Shuffles options of an MCQ question
function shuffleOptions(question) {
  if (question.type !== 'mcq') return question;
  const shuffledOptions = shuffle(question.options);
  return { ...question, options: shuffledOptions };
}

/**
 * Selects 10 domain questions for the specific stream, shuffling options
 */
export function selectDomainQuestions(streamId) {
  const bank = DOMAIN_QUESTIONS[streamId] || DOMAIN_QUESTIONS.SWE;
  // Shuffle all questions in the bank and take 10
  const selected = shuffle(bank).slice(0, 10).map(shuffleOptions);

  return selected.map((q, idx) => ({
    ...q,
    displayNumber: idx + 16 // Domain questions start from 16 (after 15 Aptitude questions)
  }));
}
