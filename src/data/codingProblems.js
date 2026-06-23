// Coding Problem Bank — ~12 problems across 3 difficulty tiers
// Each exam randomly selects: 1 Easy, 2 Medium, 1 Hard (total 4, 100 points)

const easyProblems = [
  {
    id: 'easy1',
    title: 'Two Sum',
    difficulty: 'Easy',
    points: 25,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.

You may assume that each input has exactly one solution, and you may not use the same element twice.

**Example 1:**
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9

**Example 2:**
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]

**Constraints:**
- 2 ≤ nums.length ≤ 100
- -100 ≤ nums[i] ≤ 100`,
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
      python: `def two_sum(nums, target):\n    # Write your code here\n    pass\n\n# Test\nprint(two_sum([2, 7, 11, 15], 9))`
    },
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1] },
      { input: { nums: [1, 5, 8, 3], target: 4 }, expectedOutput: [0, 3] },
      { input: { nums: [-1, 0, 1, 2], target: 1 }, expectedOutput: [0, 2] },
    ],
    sampleTestCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] },
    ]
  },
  {
    id: 'easy2',
    title: 'Reverse String',
    difficulty: 'Easy',
    points: 25,
    description: `Write a function that reverses a given string.

**Example 1:**
Input: "hello"
Output: "olleh"

**Example 2:**
Input: "world"
Output: "dlrow"

**Constraints:**
- 1 ≤ s.length ≤ 1000
- s consists of printable ASCII characters`,
    starterCode: {
      javascript: `function reverseString(s) {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(reverseString("hello"));`,
      python: `def reverse_string(s):\n    # Write your code here\n    pass\n\n# Test\nprint(reverse_string("hello"))`
    },
    testCases: [
      { input: 'hello', expectedOutput: 'olleh' },
      { input: 'world', expectedOutput: 'dlrow' },
      { input: 'a', expectedOutput: 'a' },
      { input: 'racecar', expectedOutput: 'racecar' },
      { input: 'OpenAI', expectedOutput: 'IAnepO' },
    ],
    sampleTestCases: [
      { input: 'hello', expectedOutput: 'olleh' },
      { input: 'world', expectedOutput: 'dlrow' },
    ]
  },
  {
    id: 'easy3',
    title: 'Palindrome Check',
    difficulty: 'Easy',
    points: 25,
    description: `Write a function that checks whether a given string is a palindrome (reads the same forward and backward). Ignore case and non-alphanumeric characters.

**Example 1:**
Input: "racecar"
Output: true

**Example 2:**
Input: "hello"
Output: false

**Example 3:**
Input: "A man a plan a canal Panama"
Output: true

**Constraints:**
- 1 ≤ s.length ≤ 1000`,
    starterCode: {
      javascript: `function isPalindrome(s) {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(isPalindrome("racecar"));`,
      python: `def is_palindrome(s):\n    # Write your code here\n    pass\n\n# Test\nprint(is_palindrome("racecar"))`
    },
    testCases: [
      { input: 'racecar', expectedOutput: true },
      { input: 'hello', expectedOutput: false },
      { input: 'A man a plan a canal Panama', expectedOutput: true },
      { input: 'Was it a car or a cat I saw', expectedOutput: true },
      { input: 'not a palindrome', expectedOutput: false },
    ],
    sampleTestCases: [
      { input: 'racecar', expectedOutput: true },
      { input: 'hello', expectedOutput: false },
    ]
  },
  {
    id: 'easy4',
    title: 'FizzBuzz',
    difficulty: 'Easy',
    points: 25,
    description: `Write a function that takes an integer n and returns an array of strings from 1 to n where:
- Multiples of 3 are replaced with "Fizz"
- Multiples of 5 are replaced with "Buzz"  
- Multiples of both 3 and 5 are replaced with "FizzBuzz"
- Other numbers are converted to strings

**Example:**
Input: n = 15
Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]

**Constraints:**
- 1 ≤ n ≤ 100`,
    starterCode: {
      javascript: `function fizzBuzz(n) {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(fizzBuzz(15));`,
      python: `def fizz_buzz(n):\n    # Write your code here\n    pass\n\n# Test\nprint(fizz_buzz(15))`
    },
    testCases: [
      { input: 5, expectedOutput: ['1','2','Fizz','4','Buzz'] },
      { input: 3, expectedOutput: ['1','2','Fizz'] },
      { input: 15, expectedOutput: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'] },
      { input: 1, expectedOutput: ['1'] },
    ],
    sampleTestCases: [
      { input: 5, expectedOutput: ['1','2','Fizz','4','Buzz'] },
      { input: 3, expectedOutput: ['1','2','Fizz'] },
    ]
  },
];

const mediumProblems = [
  {
    id: 'med1',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    points: 25,
    description: `Given a string s, find the length of the longest substring without repeating characters.

**Example 1:**
Input: "abcabcbb"
Output: 3
Explanation: The answer is "abc", with length 3.

**Example 2:**
Input: "bbbbb"
Output: 1

**Example 3:**
Input: "pwwkew"
Output: 3
Explanation: The answer is "wke", with length 3.

**Constraints:**
- 0 ≤ s.length ≤ 1000
- s consists of English letters, digits, symbols`,
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(lengthOfLongestSubstring("abcabcbb"));`,
      python: `def length_of_longest_substring(s):\n    # Write your code here\n    pass\n\n# Test\nprint(length_of_longest_substring("abcabcbb"))`
    },
    testCases: [
      { input: 'abcabcbb', expectedOutput: 3 },
      { input: 'bbbbb', expectedOutput: 1 },
      { input: 'pwwkew', expectedOutput: 3 },
      { input: '', expectedOutput: 0 },
      { input: 'abcdef', expectedOutput: 6 },
    ],
    sampleTestCases: [
      { input: 'abcabcbb', expectedOutput: 3 },
      { input: 'bbbbb', expectedOutput: 1 },
    ]
  },
  {
    id: 'med2',
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    points: 25,
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string has valid (balanced) parentheses.

**Rules:**
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.

**Example 1:**
Input: "()"
Output: true

**Example 2:**
Input: "()[]{}"
Output: true

**Example 3:**
Input: "(]"
Output: false

**Constraints:**
- 1 ≤ s.length ≤ 1000`,
    starterCode: {
      javascript: `function isValid(s) {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(isValid("()[]{}"));`,
      python: `def is_valid(s):\n    # Write your code here\n    pass\n\n# Test\nprint(is_valid("()[]{}"))`
    },
    testCases: [
      { input: '()', expectedOutput: true },
      { input: '()[]{}', expectedOutput: true },
      { input: '(]', expectedOutput: false },
      { input: '([)]', expectedOutput: false },
      { input: '{[]}', expectedOutput: true },
      { input: '', expectedOutput: true },
    ],
    sampleTestCases: [
      { input: '()[]{}', expectedOutput: true },
      { input: '(]', expectedOutput: false },
    ]
  },
  {
    id: 'med3',
    title: 'Flatten Nested Array',
    difficulty: 'Medium',
    points: 25,
    description: `Write a function that flattens a nested array to a single level. Do NOT use the built-in flat() method.

**Example 1:**
Input: [1, [2, 3], [4, [5, 6]]]
Output: [1, 2, 3, 4, 5, 6]

**Example 2:**
Input: [[1, 2], [3, [4, [5]]]]
Output: [1, 2, 3, 4, 5]

**Constraints:**
- The array can be nested to any depth
- Array contains only integers`,
    starterCode: {
      javascript: `function flatten(arr) {\n  // Write your code here\n  // Do NOT use Array.prototype.flat()\n  \n}\n\n// Test\nconsole.log(flatten([1, [2, 3], [4, [5, 6]]]));`,
      python: `def flatten(arr):\n    # Write your code here\n    pass\n\n# Test\nprint(flatten([1, [2, 3], [4, [5, 6]]]))`
    },
    testCases: [
      { input: [1, [2, 3], [4, [5, 6]]], expectedOutput: [1, 2, 3, 4, 5, 6] },
      { input: [[1, 2], [3, [4, [5]]]], expectedOutput: [1, 2, 3, 4, 5] },
      { input: [1, 2, 3], expectedOutput: [1, 2, 3] },
      { input: [[[1]], [[2]], [[3]]], expectedOutput: [1, 2, 3] },
      { input: [], expectedOutput: [] },
    ],
    sampleTestCases: [
      { input: [1, [2, 3], [4, [5, 6]]], expectedOutput: [1, 2, 3, 4, 5, 6] },
      { input: [[1, 2], [3, [4, [5]]]], expectedOutput: [1, 2, 3, 4, 5] },
    ]
  },
  {
    id: 'med4',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    points: 25,
    description: `Given an array of strings, group the anagrams together. An anagram is a word formed by rearranging the letters of another word.

**Example:**
Input: ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]

**Note:** The order of groups and words within groups does not matter.

**Constraints:**
- 1 ≤ strs.length ≤ 100
- 0 ≤ strs[i].length ≤ 50
- strs[i] consists of lowercase English letters`,
    starterCode: {
      javascript: `function groupAnagrams(strs) {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));`,
      python: `def group_anagrams(strs):\n    # Write your code here\n    pass\n\n# Test\nprint(group_anagrams(["eat","tea","tan","ate","nat","bat"]))`
    },
    testCases: [
      { input: ['eat','tea','tan','ate','nat','bat'], expectedOutput: [['eat','tea','ate'],['tan','nat'],['bat']] },
      { input: [''], expectedOutput: [['']] },
      { input: ['a'], expectedOutput: [['a']] },
      { input: ['ab','ba','abc','cba','bac'], expectedOutput: [['ab','ba'],['abc','cba','bac']] },
    ],
    sampleTestCases: [
      { input: ['eat','tea','tan','ate','nat','bat'], expectedOutput: [['eat','tea','ate'],['tan','nat'],['bat']] },
    ]
  },
  {
    id: 'med5',
    title: 'Maximum Subarray Sum',
    difficulty: 'Medium',
    points: 25,
    description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

**Example 1:**
Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: The subarray [4, -1, 2, 1] has the largest sum = 6.

**Example 2:**
Input: [1]
Output: 1

**Example 3:**
Input: [5, 4, -1, 7, 8]
Output: 23

**Constraints:**
- 1 ≤ nums.length ≤ 1000
- -1000 ≤ nums[i] ≤ 1000`,
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`,
      python: `def max_sub_array(nums):\n    # Write your code here\n    pass\n\n# Test\nprint(max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4]))`
    },
    testCases: [
      { input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expectedOutput: 6 },
      { input: [1], expectedOutput: 1 },
      { input: [5, 4, -1, 7, 8], expectedOutput: 23 },
      { input: [-1, -2, -3], expectedOutput: -1 },
      { input: [0, -1, 2, -3, 4], expectedOutput: 4 },
    ],
    sampleTestCases: [
      { input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expectedOutput: 6 },
      { input: [1], expectedOutput: 1 },
    ]
  },
];

const hardProblems = [
  {
    id: 'hard1',
    title: 'Longest Palindromic Substring',
    difficulty: 'Hard',
    points: 25,
    description: `Given a string s, return the longest palindromic substring in s.

**Example 1:**
Input: "babad"
Output: "bab" (or "aba" — both are valid)

**Example 2:**
Input: "cbbd"
Output: "bb"

**Example 3:**
Input: "a"
Output: "a"

**Constraints:**
- 1 ≤ s.length ≤ 500
- s consists of lowercase English letters`,
    starterCode: {
      javascript: `function longestPalindrome(s) {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(longestPalindrome("babad"));`,
      python: `def longest_palindrome(s):\n    # Write your code here\n    pass\n\n# Test\nprint(longest_palindrome("babad"))`
    },
    testCases: [
      { input: 'babad', expectedOutput: 'bab', altOutput: 'aba' },
      { input: 'cbbd', expectedOutput: 'bb' },
      { input: 'a', expectedOutput: 'a' },
      { input: 'racecar', expectedOutput: 'racecar' },
      { input: 'abcde', expectedOutput: 'a', altOutput: 'b' },
    ],
    sampleTestCases: [
      { input: 'babad', expectedOutput: 'bab', altOutput: 'aba' },
      { input: 'cbbd', expectedOutput: 'bb' },
    ]
  },
  {
    id: 'hard2',
    title: 'Merge Intervals',
    difficulty: 'Hard',
    points: 25,
    description: `Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

**Example 1:**
Input: [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since [1,3] and [2,6] overlap, merge them into [1,6].

**Example 2:**
Input: [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.

**Constraints:**
- 1 ≤ intervals.length ≤ 100
- intervals[i].length == 2
- 0 ≤ start_i ≤ end_i ≤ 1000`,
    starterCode: {
      javascript: `function merge(intervals) {\n  // Write your code here\n  \n}\n\n// Test\nconsole.log(merge([[1,3],[2,6],[8,10],[15,18]]));`,
      python: `def merge(intervals):\n    # Write your code here\n    pass\n\n# Test\nprint(merge([[1,3],[2,6],[8,10],[15,18]]))`
    },
    testCases: [
      { input: [[1,3],[2,6],[8,10],[15,18]], expectedOutput: [[1,6],[8,10],[15,18]] },
      { input: [[1,4],[4,5]], expectedOutput: [[1,5]] },
      { input: [[1,4],[0,4]], expectedOutput: [[0,4]] },
      { input: [[1,4],[2,3]], expectedOutput: [[1,4]] },
      { input: [[1,2],[3,4],[5,6]], expectedOutput: [[1,2],[3,4],[5,6]] },
    ],
    sampleTestCases: [
      { input: [[1,3],[2,6],[8,10],[15,18]], expectedOutput: [[1,6],[8,10],[15,18]] },
      { input: [[1,4],[4,5]], expectedOutput: [[1,5]] },
    ]
  },
  {
    id: 'hard3',
    title: 'Word Search in Grid',
    difficulty: 'Hard',
    points: 25,
    description: `Given a 2D board of characters and a word, determine if the word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically). The same cell may not be used more than once.

**Example 1:**
Board:
[["A","B","C","E"],
 ["S","F","C","S"],
 ["A","D","E","E"]]
Word: "ABCCED"
Output: true

**Example 2:**
Same board, Word: "SEE"
Output: true

**Example 3:**
Same board, Word: "ABCB"
Output: false

**Constraints:**
- 1 ≤ board.length ≤ 10
- 1 ≤ board[i].length ≤ 10
- 1 ≤ word.length ≤ 20`,
    starterCode: {
      javascript: `function exist(board, word) {\n  // Write your code here\n  \n}\n\n// Test\nconst board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]];\nconsole.log(exist(board, "ABCCED"));`,
      python: `def exist(board, word):\n    # Write your code here\n    pass\n\n# Test\nboard = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nprint(exist(board, "ABCCED"))`
    },
    testCases: [
      { input: { board: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word: 'ABCCED' }, expectedOutput: true },
      { input: { board: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word: 'SEE' }, expectedOutput: true },
      { input: { board: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word: 'ABCB' }, expectedOutput: false },
      { input: { board: [['a']], word: 'a' }, expectedOutput: true },
    ],
    sampleTestCases: [
      { input: { board: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word: 'ABCCED' }, expectedOutput: true },
      { input: { board: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word: 'ABCB' }, expectedOutput: false },
    ]
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

/**
 * Selects a random set of coding problems for one exam session.
 * Returns 2 problems: 1 Easy (50pts), 1 Medium (50pts)
 */
export function selectProblems() {
  const selected = [
    ...shuffle(easyProblems).slice(0, 1),
    ...shuffle(mediumProblems).slice(0, 1),
  ];
  return selected.map((p, index) => ({
    ...p,
    points: 50,
    displayNumber: index + 1
  }));
}

export const TOTAL_CODING_PROBLEMS = 2;
export const TOTAL_CODING_POINTS = 100;
export const CODING_DURATION_SECONDS = 40 * 60; // 40 minutes

