// Aptitude Question Bank — ~55 questions across 4 categories
// Each exam randomly selects: 6 Quantitative, 4 Logical, 2 Verbal, 3 Numerical

const quantitativeQuestions = [
  {
    id: 'q1',
    category: 'Quantitative',
    type: 'mcq',
    question: 'If the cost price of an article is ₹800 and it is sold at a profit of 25%, what is the selling price?',
    options: ['₹900', '₹1000', '₹1050', '₹1100'],
    correctAnswer: '₹1000'
  },
  {
    id: 'q2',
    category: 'Quantitative',
    type: 'mcq',
    question: 'A train travels 360 km in 4 hours. What is its speed in km/h?',
    options: ['80 km/h', '90 km/h', '85 km/h', '95 km/h'],
    correctAnswer: '90 km/h'
  },
  {
    id: 'q3',
    category: 'Quantitative',
    type: 'mcq',
    question: 'What is the compound interest on ₹10,000 at 10% per annum for 2 years?',
    options: ['₹2,000', '₹2,100', '₹2,200', '₹1,900'],
    correctAnswer: '₹2,100'
  },
  {
    id: 'q4',
    category: 'Quantitative',
    type: 'mcq',
    question: 'If 3x + 7 = 22, what is the value of x?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5'
  },
  {
    id: 'q5',
    category: 'Quantitative',
    type: 'mcq',
    question: 'A shopkeeper gives a discount of 20% on an item marked at ₹500. What is the selling price?',
    options: ['₹350', '₹400', '₹450', '₹380'],
    correctAnswer: '₹400'
  },
  {
    id: 'q6',
    category: 'Quantitative',
    type: 'mcq',
    question: 'The ratio of boys to girls in a class is 3:5. If there are 40 students, how many boys are there?',
    options: ['12', '15', '18', '20'],
    correctAnswer: '15'
  },
  {
    id: 'q7',
    category: 'Quantitative',
    type: 'mcq',
    question: 'What is 15% of 240?',
    options: ['32', '34', '36', '38'],
    correctAnswer: '36'
  },
  {
    id: 'q8',
    category: 'Quantitative',
    type: 'mcq',
    question: 'A pipe can fill a tank in 6 hours. Another pipe can fill it in 12 hours. How long will both pipes together take?',
    options: ['3 hours', '4 hours', '5 hours', '6 hours'],
    correctAnswer: '4 hours'
  },
  {
    id: 'q9',
    category: 'Quantitative',
    type: 'mcq',
    question: 'If the perimeter of a square is 64 cm, what is its area?',
    options: ['196 cm²', '256 cm²', '225 cm²', '289 cm²'],
    correctAnswer: '256 cm²'
  },
  {
    id: 'q10',
    category: 'Quantitative',
    type: 'mcq',
    question: 'A man walks 5 km towards North. Then turns right and walks 3 km. What is his shortest distance from the starting point?',
    options: ['√34 km', '√30 km', '8 km', '√28 km'],
    correctAnswer: '√34 km'
  },
  {
    id: 'q11',
    category: 'Quantitative',
    type: 'mcq',
    question: 'Two numbers are in the ratio 4:5. If their sum is 135, find the larger number.',
    options: ['60', '75', '80', '55'],
    correctAnswer: '75'
  },
  {
    id: 'q12',
    category: 'Quantitative',
    type: 'mcq',
    question: 'A car depreciates by 15% every year. If the current value is ₹2,00,000, what will it be after 1 year?',
    options: ['₹1,60,000', '₹1,70,000', '₹1,75,000', '₹1,80,000'],
    correctAnswer: '₹1,70,000'
  },
  {
    id: 'q13',
    category: 'Quantitative',
    type: 'mcq',
    question: 'The average of five consecutive odd numbers is 27. What is the largest number?',
    options: ['29', '31', '33', '27'],
    correctAnswer: '31'
  },
  {
    id: 'q14',
    category: 'Quantitative',
    type: 'mcq',
    question: 'A boat goes 20 km upstream in 5 hours and 36 km downstream in 4 hours. What is the speed of the stream?',
    options: ['1 km/h', '2.5 km/h', '2 km/h', '0.5 km/h'],
    correctAnswer: '2.5 km/h'
  },
  {
    id: 'q15',
    category: 'Quantitative',
    type: 'mcq',
    question: 'If a number is increased by 20% and then decreased by 20%, what is the net change?',
    options: ['No change', '4% decrease', '2% decrease', '4% increase'],
    correctAnswer: '4% decrease'
  },
  {
    id: 'q16',
    category: 'Quantitative',
    type: 'mcq',
    question: 'The simple interest on ₹5,000 at 8% per annum for 3 years is:',
    options: ['₹1,000', '₹1,200', '₹1,400', '₹1,600'],
    correctAnswer: '₹1,200'
  },
  {
    id: 'q17',
    category: 'Quantitative',
    type: 'mcq',
    question: 'A work can be completed by A in 10 days and by B in 15 days. In how many days can they complete it together?',
    options: ['5 days', '6 days', '7 days', '8 days'],
    correctAnswer: '6 days'
  },
  {
    id: 'q18',
    category: 'Quantitative',
    type: 'mcq',
    question: 'The LCM of 12, 15, and 20 is:',
    options: ['40', '60', '80', '120'],
    correctAnswer: '60'
  },
  {
    id: 'q19',
    category: 'Quantitative',
    type: 'mcq',
    question: 'If the radius of a circle is doubled, how many times does the area increase?',
    options: ['2 times', '3 times', '4 times', '6 times'],
    correctAnswer: '4 times'
  },
  {
    id: 'q20',
    category: 'Quantitative',
    type: 'mcq',
    question: 'A mixture contains milk and water in the ratio 7:3. If 10 liters of water is added, the ratio becomes 7:5. What was the original quantity of milk?',
    options: ['28 liters', '35 liters', '42 liters', '21 liters'],
    correctAnswer: '35 liters'
  },
];

const logicalQuestions = [
  {
    id: 'l1',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '46'],
    correctAnswer: '42'
  },
  {
    id: 'l2',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'If APPLE is coded as ELPPA, how is ORANGE coded?',
    options: ['EGNARO', 'ORANGE', 'OEGNRA', 'EGRANO'],
    correctAnswer: 'EGNARO'
  },
  {
    id: 'l3',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'All roses are flowers. Some flowers are red. Which statement must be true?',
    options: [
      'All roses are red',
      'Some roses are red',
      'Some flowers are roses',
      'No roses are red'
    ],
    correctAnswer: 'Some flowers are roses'
  },
  {
    id: 'l4',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'If A > B, B > C, and C > D, which of the following is true?',
    options: ['D > A', 'A > D', 'B > A', 'C > A'],
    correctAnswer: 'A > D'
  },
  {
    id: 'l5',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'Find the odd one out: Square, Rectangle, Triangle, Circle, Parallelogram',
    options: ['Square', 'Circle', 'Triangle', 'Parallelogram'],
    correctAnswer: 'Circle'
  },
  {
    id: 'l6',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'If Monday is coded as 1, Wednesday is coded as 3, then Friday is coded as:',
    options: ['4', '5', '6', '7'],
    correctAnswer: '5'
  },
  {
    id: 'l7',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'In a row of children, Asha is 12th from the left and 8th from the right. How many children are in the row?',
    options: ['18', '19', '20', '21'],
    correctAnswer: '19'
  },
  {
    id: 'l8',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'Complete the analogy: Book : Author :: Painting : ?',
    options: ['Brush', 'Canvas', 'Artist', 'Gallery'],
    correctAnswer: 'Artist'
  },
  {
    id: 'l9',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'Which number replaces the question mark? 3, 9, 27, 81, ?',
    options: ['162', '243', '216', '324'],
    correctAnswer: '243'
  },
  {
    id: 'l10',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'If SEND is coded as VHQG (each letter +3), how is HELP coded?',
    options: ['KHOS', 'KHPS', 'JGOS', 'KHOS'],
    correctAnswer: 'KHOS'
  },
  {
    id: 'l11',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
    options: ['0°', '7.5°', '15°', '22.5°'],
    correctAnswer: '7.5°'
  },
  {
    id: 'l12',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'Find the missing term: A1, C3, E5, G7, ?',
    options: ['H8', 'I9', 'J10', 'H9'],
    correctAnswer: 'I9'
  },
  {
    id: 'l13',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'If "+" means "−", "−" means "×", "×" means "÷", and "÷" means "+", then 8 + 6 − 2 × 4 ÷ 3 = ?',
    options: ['5', '6', '7', '8'],
    correctAnswer: '6'
  },
  {
    id: 'l14',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'Pointing to a photograph, Ravi said "She is the daughter of my grandfather\'s only son." How is the person in the photo related to Ravi?',
    options: ['Sister', 'Mother', 'Cousin', 'Aunt'],
    correctAnswer: 'Sister'
  },
  {
    id: 'l15',
    category: 'Logical Reasoning',
    type: 'mcq',
    question: 'Which figure comes next in the pattern: △, □, ○, △, □, ?',
    options: ['△', '□', '○', '◇'],
    correctAnswer: '○'
  },
];

const verbalQuestions = [
  {
    id: 'v1',
    category: 'Verbal Ability',
    type: 'mcq',
    question: 'Choose the synonym of "Ephemeral":',
    options: ['Permanent', 'Transient', 'Eternal', 'Constant'],
    correctAnswer: 'Transient'
  },
  {
    id: 'v2',
    category: 'Verbal Ability',
    type: 'mcq',
    question: 'Choose the antonym of "Benevolent":',
    options: ['Kind', 'Generous', 'Malevolent', 'Charitable'],
    correctAnswer: 'Malevolent'
  },
  {
    id: 'v3',
    category: 'Verbal Ability',
    type: 'mcq',
    question: 'Identify the correctly spelled word:',
    options: ['Accomodation', 'Accommodation', 'Acommodation', 'Acomodation'],
    correctAnswer: 'Accommodation'
  },
  {
    id: 'v4',
    category: 'Verbal Ability',
    type: 'mcq',
    question: 'Fill in the blank: "The scientist\'s hypothesis was _____ by the experimental results."',
    options: ['corroborated', 'deteriorated', 'exasperated', 'confiscated'],
    correctAnswer: 'corroborated'
  },
  {
    id: 'v5',
    category: 'Verbal Ability',
    type: 'mcq',
    question: 'Choose the word that best completes the analogy: Pen : Write :: Knife : ?',
    options: ['Sharp', 'Cut', 'Blade', 'Metal'],
    correctAnswer: 'Cut'
  },
  {
    id: 'v6',
    category: 'Verbal Ability',
    type: 'mcq',
    question: '"To beat around the bush" means:',
    options: [
      'To search in the forest',
      'To avoid the main topic',
      'To win a competition',
      'To plant trees'
    ],
    correctAnswer: 'To avoid the main topic'
  },
  {
    id: 'v7',
    category: 'Verbal Ability',
    type: 'mcq',
    question: 'Choose the synonym of "Ubiquitous":',
    options: ['Rare', 'Omnipresent', 'Unique', 'Obscure'],
    correctAnswer: 'Omnipresent'
  },
  {
    id: 'v8',
    category: 'Verbal Ability',
    type: 'mcq',
    question: 'Identify the sentence with correct grammar:',
    options: [
      'He don\'t know the answer.',
      'She have completed her work.',
      'They has arrived early.',
      'We were planning to leave.'
    ],
    correctAnswer: 'We were planning to leave.'
  },
  {
    id: 'v9',
    category: 'Verbal Ability',
    type: 'mcq',
    question: 'Choose the antonym of "Pragmatic":',
    options: ['Practical', 'Idealistic', 'Realistic', 'Sensible'],
    correctAnswer: 'Idealistic'
  },
  {
    id: 'v10',
    category: 'Verbal Ability',
    type: 'mcq',
    question: '"A stitch in time saves nine" means:',
    options: [
      'Sewing is important',
      'Acting promptly prevents bigger problems',
      'Nine stitches are better than one',
      'Time is valuable'
    ],
    correctAnswer: 'Acting promptly prevents bigger problems'
  },
];

const numericalQuestions = [
  {
    id: 'n1',
    category: 'Numerical',
    type: 'numerical',
    question: 'What is the value of 17 × 23?',
    correctAnswer: '391'
  },
  {
    id: 'n2',
    category: 'Numerical',
    type: 'numerical',
    question: 'A train covers 450 km in 5 hours. What is its speed in km/h?',
    correctAnswer: '90'
  },
  {
    id: 'n3',
    category: 'Numerical',
    type: 'numerical',
    question: 'If the area of a rectangle is 72 cm² and its length is 9 cm, what is its breadth in cm?',
    correctAnswer: '8'
  },
  {
    id: 'n4',
    category: 'Numerical',
    type: 'numerical',
    question: 'What is the sum of the first 10 natural numbers?',
    correctAnswer: '55'
  },
  {
    id: 'n5',
    category: 'Numerical',
    type: 'numerical',
    question: 'A person earns ₹25,000 per month and saves 20%. How much does he save per month (in ₹)?',
    correctAnswer: '5000'
  },
  {
    id: 'n6',
    category: 'Numerical',
    type: 'numerical',
    question: 'What is the cube root of 729?',
    correctAnswer: '9'
  },
  {
    id: 'n7',
    category: 'Numerical',
    type: 'numerical',
    question: 'If 5 workers can complete a job in 12 days, how many days will 10 workers take?',
    correctAnswer: '6'
  },
  {
    id: 'n8',
    category: 'Numerical',
    type: 'numerical',
    question: 'What is the value of 2⁸?',
    correctAnswer: '256'
  },
  {
    id: 'n9',
    category: 'Numerical',
    type: 'numerical',
    question: 'The perimeter of an equilateral triangle is 36 cm. What is the length of one side in cm?',
    correctAnswer: '12'
  },
  {
    id: 'n10',
    category: 'Numerical',
    type: 'numerical',
    question: 'If the price of an item increases from ₹200 to ₹250, what is the percentage increase?',
    correctAnswer: '25'
  },
];

// Fisher-Yates shuffle
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Shuffle MCQ options while tracking the correct answer
function shuffleOptions(question) {
  if (question.type !== 'mcq') return question;
  const shuffledOptions = shuffle(question.options);
  return { ...question, options: shuffledOptions };
}

/**
 * Selects a random set of questions for one exam session.
 * Returns 15 questions: 6 Quantitative, 4 Logical, 2 Verbal, 3 Numerical
 * Each call produces a different combination.
 */
export function selectQuestions() {
  const selected = [
    ...shuffle(quantitativeQuestions).slice(0, 6).map(shuffleOptions),
    ...shuffle(logicalQuestions).slice(0, 4).map(shuffleOptions),
    ...shuffle(verbalQuestions).slice(0, 2).map(shuffleOptions),
    ...shuffle(numericalQuestions).slice(0, 3),
  ];

  // Assign sequential display numbers
  return selected.map((q, index) => ({
    ...q,
    displayNumber: index + 1
  }));
}

export const TOTAL_APTITUDE_QUESTIONS = 15;
export const APTITUDE_DURATION_SECONDS = 20 * 60; // 20 minutes
