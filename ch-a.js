window.BOOK.chapters.push(
/* ================= PART 1 ================= */
{id:'c01',part:'P1',n:1,title:'Thinking in Loops',time:'4–5 days',
goal:'Turn a plain-English procedure into a loop, a function and a test without hesitating.',
primer:`<p>Fluent programmers do not invent code line by line. They recognise a <b>shape</b>: “walk through every item and keep a running answer”, “repeat until something stops changing”, “walk a grid row by row”. This chapter drills those shapes until your hands know them.</p>
<ul><li><b>Accumulator:</b> start with an empty answer, update it once per item, return it.</li>
<li><b>Guard first:</b> handle the empty or invalid case at the top, then write the normal path without nesting.</li>
<li><b>Test immediately:</b> write two <code>assert</code> lines before you run anything. One normal case, one edge case.</li>
<li><b>Trace by hand:</b> for any loop you are unsure of, write a small table of variable values per iteration on paper.</li></ul>
<p>Every exercise below should be solved in <b>both</b> languages by the end of the week.</p>`,
pattern:{py:`
def count_evens(nums: list[int]) -> int:
    count = 0
    for x in nums:
        if x % 2 == 0:
            count += 1
    return count

assert count_evens([1, 2, 4, 7]) == 2
assert count_evens([]) == 0
`,cpp:`
#include <cassert>
#include <vector>

int count_evens(const std::vector<int>& nums) {
    int count = 0;
    for (int x : nums)
        if (x % 2 == 0) ++count;
    return count;
}

int main() {
    assert(count_evens({1, 2, 4, 7}) == 2);
    assert(count_evens({}) == 0);
}
`},
drill:'You are fluent with this chapter when you can write exercises 1.3 (sieve) and 1.4 (run-length encoding) from a blank file in under <b>10 minutes each</b>, in both languages, with tests passing on the first run.',
ex:[
{t:'Configurable FizzBuzz',d:1,q:`<p>Write <code>fizzbuzz(n, rules)</code> where <code>rules</code> is a list of <code>(divisor, word)</code> pairs, e.g. <code>[(3,"Fizz"),(5,"Buzz"),(7,"Bazz")]</code>. Return a list of strings for 1..n. A number divisible by several divisors joins the words in rule order (21 → <code>"FizzBazz"</code>). If none match, use the number itself.</p>`,
h:['Build the word for one number with an inner loop over the rules, then decide.','An empty string is “falsy” in Python. In C++ check <code>word.empty()</code>.'],
py:`
def fizzbuzz(n: int, rules: list[tuple[int, str]]) -> list[str]:
    out = []
    for i in range(1, n + 1):
        word = ""
        # TODO: loop over rules and append words
        # TODO: append word, or str(i) if word is empty
    return out

assert fizzbuzz(5, [(3, "Fizz"), (5, "Buzz")]) == ["1", "2", "Fizz", "4", "Buzz"]
assert fizzbuzz(21, [(3, "Fizz"), (7, "Bazz")])[-1] == "FizzBazz"
`,cpp:`
#include <string>
#include <utility>
#include <vector>

std::vector<std::string> fizzbuzz(int n,
        const std::vector<std::pair<int, std::string>>& rules) {
    std::vector<std::string> out;
    out.reserve(n);
    for (int i = 1; i <= n; ++i) {
        std::string word;
        // TODO: for (const auto& [d, w] : rules) ...
        // TODO: push_back word or std::to_string(i)
    }
    return out;
}
`},
{t:'Digit sum and digital root',d:1,q:`<p>Without converting to a string, write <code>digit_sum(n)</code> (e.g. 9875 → 29) and <code>digital_root(n)</code>, which repeats the digit sum until one digit remains (9875 → 29 → 11 → 2). Then find the closed form for the digital root and assert it matches your loop for every n up to 10<sup>5</sup>.</p>`,
h:['<code>n % 10</code> gives the last digit, <code>n // 10</code> (or <code>n / 10</code> for ints in C++) removes it.','Closed form: for n &gt; 0 the digital root is <code>1 + (n - 1) % 9</code>.'],
py:`
def digit_sum(n: int) -> int:
    total = 0
    while n > 0:
        # TODO
        pass
    return total

def digital_root(n: int) -> int:
    # TODO: loop while n >= 10
    return n

for n in range(1, 100_001):
    assert digital_root(n) == 1 + (n - 1) % 9
`},
{t:'Sieve of Eratosthenes',d:2,q:`<p>Return all primes ≤ n. Then measure: how long for n = 10<sup>7</sup> in Python and in C++? Write the two times in a comment at the top of your file.</p><p>Expected: <code>primes_up_to(30)</code> → <code>[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]</code>; there are 664,579 primes below 10<sup>7</sup>.</p>`,
h:['Use a boolean array <code>is_prime</code> of size n+1. Start crossing out at <code>p*p</code>, not <code>2*p</code>.','The outer loop only needs to run while <code>p*p &lt;= n</code>.','In Python, slice assignment <code>is_prime[p*p::p] = [False]*len(range(p*p, n+1, p))</code> is much faster than an inner loop.'],
py:`
def primes_up_to(n: int) -> list[int]:
    if n < 2:
        return []
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    # TODO: for p in range(2, int(n**0.5) + 1): ...
    return [i for i, ok in enumerate(is_prime) if ok]
`,cpp:`
#include <vector>

std::vector<int> primes_up_to(int n) {
    std::vector<char> is_prime(n + 1, 1);   // char is faster than vector<bool>
    // TODO: handle n < 2, mark 0 and 1
    // TODO: for (long long p = 2; p * p <= n; ++p) ...
    std::vector<int> out;
    // TODO: collect primes
    return out;
}
`},
{t:'Run-length encoding',d:2,q:`<p>Write <code>encode("aaabccdddd")</code> → <code>"a3b1c2d4"</code> and <code>decode</code> that reverses it. Counts may have several digits (<code>"x12"</code>). Assert <code>decode(encode(s)) == s</code> for 1,000 random strings.</p>`,
h:['Encode: keep <code>current</code> char and <code>run</code> length; flush when the char changes and once more after the loop.','Decode: read one letter, then read digits while they are digits.'],
py:`
import random, string

def encode(s: str) -> str:
    if not s:
        return ""
    parts = []
    current, run = s[0], 1
    for ch in s[1:]:
        # TODO
        pass
    # TODO: flush the final run
    return "".join(parts)

def decode(s: str) -> str:
    out, i = [], 0
    while i < len(s):
        # TODO
        pass
    return "".join(out)

for _ in range(1000):
    t = "".join(random.choice("ab") for _ in range(random.randint(0, 30)))
    assert decode(encode(t)) == t
`},
{t:'Longest Collatz chain',d:2,q:`<p>For every start below 1,000,000, follow n → n/2 (even) or 3n+1 (odd) until 1. Which start gives the longest chain? (Answer: 837799.) Write it in C++ first and make it run in under one second with a cache of known lengths.</p>`,
h:['Cache lengths in a vector of size 1,000,000. Values above the limit are not cached, only walked.','Use <code>long long</code>: 3n+1 overflows a 32-bit int along the way.'],
cpp:`
#include <iostream>
#include <vector>

int main() {
    const int LIMIT = 1'000'000;
    std::vector<int> cache(LIMIT, 0);
    cache[1] = 1;
    int best_start = 1, best_len = 1;
    for (int start = 2; start < LIMIT; ++start) {
        long long n = start;
        int steps = 0;
        // TODO: walk until n < LIMIT and cache[n] != 0
        // TODO: cache[start] = steps + cache[n]; update best
    }
    std::cout << best_start << ' ' << best_len << '\\n';
}
`},
{t:'Spiral matrix',d:2,q:`<p>Fill an n×n matrix with 1..n² in clockwise spiral order and print it aligned. For n = 4 the first row is <code>1 2 3 4</code> and the second is <code>12 13 14 5</code>.</p>`,
h:['Keep four boundaries: top, bottom, left, right. Walk one edge, then shrink that boundary.','Alternative: direction vectors <code>dr = [0,1,0,-1], dc = [1,0,-1,0]</code> and turn when the next cell is out of range or filled.'],
py:`
def spiral(n: int) -> list[list[int]]:
    m = [[0] * n for _ in range(n)]
    top, bottom, left, right = 0, n - 1, 0, n - 1
    k = 1
    while top <= bottom and left <= right:
        # TODO: left -> right along top, then top += 1
        # TODO: top -> bottom along right, then right -= 1
        # TODO: right -> left along bottom (if top <= bottom)
        # TODO: bottom -> top along left (if left <= right)
        pass
    return m

assert spiral(3) == [[1, 2, 3], [8, 9, 4], [7, 6, 5]]
`},
{t:'Pascal’s triangle',d:1,q:`<p>Return the first n rows. Then print row 30 and check that its middle value is C(30,15) = 155117520.</p>`,
h:['Each row starts and ends with 1; inside, <code>row[j] = prev[j-1] + prev[j]</code>.'],
py:`
def pascal(n: int) -> list[list[int]]:
    rows = []
    for i in range(n):
        row = [1] * (i + 1)
        # TODO: fill row[1:i] from rows[-1]
        rows.append(row)
    return rows
`,cpp:`
#include <vector>
std::vector<std::vector<long long>> pascal(int n) {
    std::vector<std::vector<long long>> rows;
    // TODO
    return rows;
}
`},
{t:'Bouncing ball simulation',d:2,q:`<p>Your first simulation loop. A ball starts at height 10 m with velocity 0, gravity g = 9.81 m/s², time step dt = 0.01 s. When it hits the floor its velocity flips and is multiplied by a restitution e = 0.8. Stop when the bounce speed falls below 0.1 m/s. Print time and height every 0.1 s, and the number of bounces at the end.</p><p>Use <b>semi-implicit Euler</b>: update velocity first, then position with the new velocity. Try plain Euler too and see which one gains energy.</p>`,
h:['<code>v -= g*dt; y += v*dt</code>. If <code>y &lt; 0</code>: set <code>y = 0</code>, <code>v = -e*v</code>, count a bounce.','Print when <code>step % 10 == 0</code> instead of comparing floating-point times.'],
py:`
G, DT, E = 9.81, 0.01, 0.8

def simulate(y0: float = 10.0) -> int:
    y, v, t, bounces, step = y0, 0.0, 0.0, 0, 0
    while True:
        # TODO: update v, then y
        # TODO: floor collision; break when speed after bounce < 0.1
        # TODO: print every 10 steps
        step += 1
        t += DT
    return bounces
`}
]},

{id:'c02',part:'P1',n:2,title:'Containers You Reach For',time:'5 days',
goal:'Know which container to use without thinking, and use its idioms in both languages.',
primer:`<p>Most everyday code is moving data between containers. Learn the four you will use 95% of the time and their costs:</p>
<ul><li><b>Sequence</b> — Python <code>list</code>, C++ <code>std::vector</code>. O(1) index and append at the end, O(n) insert in the middle.</li>
<li><b>Hash map</b> — <code>dict</code>, <code>std::unordered_map</code>. O(1) average lookup by key.</li>
<li><b>Hash set</b> — <code>set</code>, <code>std::unordered_set</code>. O(1) membership.</li>
<li><b>Ordered map/set</b> — <code>std::map</code>/<code>std::set</code> (balanced tree, O(log n), sorted iteration). In Python use <code>sorted()</code> or the <code>bisect</code> module.</li></ul>
<p>Python idioms to make automatic: <code>enumerate</code>, <code>zip</code>, comprehensions, <code>collections.Counter</code>, <code>defaultdict</code>, unpacking. C++ idioms: range-for with <code>const auto&amp;</code>, structured bindings <code>auto [k, v]</code>, <code>reserve</code>, <code>std::sort</code> with a lambda.</p>`,
pattern:{py:`
from collections import Counter, defaultdict

words = "the cat and the hat and the bat".split()
freq = Counter(words)                     # word -> count
by_len = defaultdict(list)
for w in words:
    by_len[len(w)].append(w)

top2 = freq.most_common(2)                # [('the', 3), ('and', 2)]
`,cpp:`
#include <algorithm>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

int main() {
    std::istringstream in("the cat and the hat and the bat");
    std::unordered_map<std::string, int> freq;
    for (std::string w; in >> w; ) ++freq[w];

    std::vector<std::pair<std::string, int>> items(freq.begin(), freq.end());
    std::sort(items.begin(), items.end(), [](const auto& a, const auto& b) {
        return a.second > b.second;
    });
}
`},
drill:'Write word-frequency top-k (2.1) in C++ from memory in under <b>8 minutes</b>, including reading from <code>std::cin</code> and printing results.',
ex:[
{t:'Top-k words',d:1,q:`<p>Read text from a file, lowercase it, strip punctuation, and print the k most frequent words with counts. Ties break alphabetically. Do it with <code>Counter</code> in Python and <code>unordered_map</code> + <code>sort</code> in C++.</p>`,
h:['Python: <code>sorted(freq.items(), key=lambda kv: (-kv[1], kv[0]))</code>.','C++: in the comparator return <code>a.second != b.second ? a.second &gt; b.second : a.first &lt; b.first</code>.'],
py:`
import re
from collections import Counter

def top_k(text: str, k: int) -> list[tuple[str, int]]:
    words = re.findall(r"[a-z']+", text.lower())
    freq = Counter(words)
    # TODO: sort by (-count, word) and take k
    return []
`},
{t:'Group anagrams',d:2,q:`<p>Given a list of words, group anagrams together: <code>["eat","tea","tan","ate","nat","bat"]</code> → <code>[["eat","tea","ate"],["tan","nat"],["bat"]]</code>. Then do it with a key of 26 letter counts instead of a sorted string, and explain in a comment which is faster for long words.</p>`,
h:['The key for each word is <code>"".join(sorted(w))</code> (Python) or a sorted copy of the string (C++).','A tuple of 26 counts is hashable in Python. In C++ you can use <code>std::array&lt;int,26&gt;</code> inside a <code>std::map</code>.'],
py:`
from collections import defaultdict

def group_anagrams(words: list[str]) -> list[list[str]]:
    groups: dict[str, list[str]] = defaultdict(list)
    # TODO
    return list(groups.values())
`,cpp:`
#include <string>
#include <unordered_map>
#include <vector>

std::vector<std::vector<std::string>> group_anagrams(const std::vector<std::string>& words) {
    std::unordered_map<std::string, std::vector<std::string>> groups;
    // TODO: key = sorted copy of word
    std::vector<std::vector<std::string>> out;
    // TODO: move groups into out
    return out;
}
`},
{t:'Two sum',d:1,q:`<p>Return indices i &lt; j with <code>nums[i] + nums[j] == target</code>, or none. One pass, O(n). Example: <code>[2,7,11,15], 9</code> → <code>(0,1)</code>.</p>`,
h:['Store each value’s index in a map. Before inserting x, check whether <code>target - x</code> is already there.'],
py:`
def two_sum(nums: list[int], target: int) -> tuple[int, int] | None:
    seen: dict[int, int] = {}
    for i, x in enumerate(nums):
        # TODO
        pass
    return None
`,cpp:`
#include <optional>
#include <unordered_map>
#include <utility>
#include <vector>

std::optional<std::pair<int,int>> two_sum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> seen;
    // TODO
    return std::nullopt;
}
`},
{t:'Deduplicate, keep order',d:1,q:`<p>Remove duplicates from a list while keeping first occurrences in order. Write three Python versions: a loop with a set, <code>dict.fromkeys</code>, and a comprehension. Time them on 10<sup>6</sup> random ints from 0..1000.</p>`,
h:['<code>list(dict.fromkeys(xs))</code> works because dicts keep insertion order.'],
py:`
import random, timeit

def dedup_loop(xs):
    seen, out = set(), []
    # TODO
    return out

def dedup_dict(xs):
    return []  # TODO

data = [random.randint(0, 1000) for _ in range(10**6)]
print(timeit.timeit(lambda: dedup_loop(data), number=3))
`},
{t:'Matrices as nested containers',d:2,q:`<p>Without NumPy, write <code>transpose(A)</code> and <code>matmul(A, B)</code> for lists of lists (and <code>vector&lt;vector&lt;double&gt;&gt;</code>). Raise an error on shape mismatch. Test against hand-computed 2×3 · 3×2.</p>`,
h:['Python transpose in one line: <code>[list(r) for r in zip(*A)]</code>. Write the loop version too.','<code>C[i][j] = sum(A[i][k] * B[k][j] for k in range(m))</code>.'],
py:`
Matrix = list[list[float]]

def matmul(A: Matrix, B: Matrix) -> Matrix:
    n, m = len(A), len(A[0])
    if len(B) != m:
        raise ValueError(f"shape mismatch: {n}x{m} @ {len(B)}x{len(B[0])}")
    p = len(B[0])
    C = [[0.0] * p for _ in range(n)]
    # TODO: triple loop
    return C
`,cpp:`
#include <stdexcept>
#include <vector>
using Matrix = std::vector<std::vector<double>>;

Matrix matmul(const Matrix& A, const Matrix& B) {
    // TODO: check shapes, throw std::invalid_argument
    Matrix C(A.size(), std::vector<double>(B[0].size(), 0.0));
    // TODO
    return C;
}
`},
{t:'Robot parts inventory',d:2,q:`<p>Write a small command loop that reads lines like <code>add motor 4</code>, <code>remove motor 1</code>, <code>report</code>. Keep an item → quantity map. Removing more than you have prints an error and changes nothing. <code>report</code> prints items alphabetically. In C++ use <code>std::map</code> so the report is sorted for free.</p>`,
h:['Split each line into tokens and dispatch on the first token.','Delete a key when its quantity reaches 0.'],
cpp:`
#include <iostream>
#include <map>
#include <sstream>
#include <string>

int main() {
    std::map<std::string, int> stock;
    std::string line;
    while (std::getline(std::cin, line)) {
        std::istringstream in(line);
        std::string cmd, item;
        int qty = 0;
        in >> cmd >> item >> qty;
        if (cmd == "add") {
            // TODO
        } else if (cmd == "remove") {
            // TODO: error if not enough
        } else if (cmd == "report") {
            // TODO: for (const auto& [name, q] : stock) ...
        }
    }
}
`},
{t:'Invert a multi-map',d:2,q:`<p>Given <code>{"alice": ["chess", "go"], "bob": ["go"], "cara": ["chess", "poker"]}</code>, build <code>{"chess": ["alice","cara"], "go": ["alice","bob"], "poker": ["cara"]}</code> with sorted value lists. One version with <code>defaultdict</code>, one with a dict comprehension over a set of all games.</p>`,
h:['Iterate <code>for person, games in d.items(): for g in games: inv[g].append(person)</code>.']}
]},

{id:'c03',part:'P1',n:3,title:'Clean Functions and Types',time:'5 days',
goal:'Write code that reads well, fails loudly, and can be tested.',
primer:`<p>“Excellent code” is mostly small decisions applied every time:</p>
<ul><li><b>One job per function.</b> If you need “and” to describe it, split it.</li>
<li><b>Names carry meaning.</b> <code>dist_m</code> beats <code>d</code>; <code>is_valid</code> beats <code>flag</code>.</li>
<li><b>Guard clauses.</b> Return or raise early so the main logic is not nested.</li>
<li><b>Types document intent.</b> Python type hints and <code>@dataclass</code>; C++ <code>struct</code>, <code>const</code>, references.</li>
<li><b>Invariants.</b> A class guarantees something is always true (balance ≥ 0, vector has length 2). Check it in the constructor.</li>
<li><b>RAII in C++.</b> Resources are owned by objects and released in destructors. Prefer <code>std::vector</code> and smart pointers to <code>new</code>.</li></ul>`,
pattern:{py:`
from dataclasses import dataclass
import math

@dataclass(frozen=True)
class Vec2:
    x: float
    y: float

    def __add__(self, o: "Vec2") -> "Vec2":
        return Vec2(self.x + o.x, self.y + o.y)

    def norm(self) -> float:
        return math.hypot(self.x, self.y)
`,cpp:`
#include <cmath>

struct Vec2 {
    double x = 0, y = 0;

    Vec2 operator+(const Vec2& o) const { return {x + o.x, y + o.y}; }
    double norm() const { return std::hypot(x, y); }
};
`},
drill:'Write the full <code>Vec2</code> type (exercise 3.2) with all operators and tests from memory in under <b>12 minutes</b> in C++. You will reuse it in Parts VI and VII.',
ex:[
{t:'Refactor the mess',d:1,q:`<p>Rewrite this function so it has clear names, no repeated code, guard clauses and a docstring. Keep the behaviour identical and add five asserts that prove it.</p>
<pre style="font-family:var(--f-code);font-size:.82rem;background:var(--bg);padding:10px;border-radius:8px;overflow-x:auto">def f(l, t):
    r = []
    if l != None:
        if len(l) > 0:
            for i in range(len(l)):
                if l[i] > t:
                    r.append(l[i] * 2)
                else:
                    if l[i] == t:
                        r.append(l[i])
    return r</pre>`,
h:['First write asserts that capture what the old function does, including <code>None</code> and empty input. Then refactor.','A comprehension with a helper function may be the cleanest result.']},
{t:'Vec2 with full operator set',d:2,q:`<p>Build <code>Vec2</code> with <code>+ - </code>, scalar <code>*</code> (both <code>v*2</code> and <code>2*v</code>), <code>dot</code>, <code>cross</code> (returns a scalar in 2D), <code>norm</code>, <code>normalized</code> (raise on zero vector), <code>rotated(theta)</code> and equality with tolerance. This becomes your robotics toolkit.</p>`,
h:['Python: <code>__mul__</code> and <code>__rmul__</code>. C++: a free function <code>Vec2 operator*(double, const Vec2&amp;)</code>.','Rotation: <code>(x cosθ − y sinθ, x sinθ + y cosθ)</code>.'],
py:`
from __future__ import annotations
from dataclasses import dataclass
import math

@dataclass(frozen=True)
class Vec2:
    x: float
    y: float
    # TODO: __add__, __sub__, __mul__, __rmul__, dot, cross, norm,
    #       normalized, rotated, isclose

v = Vec2(1, 0).rotated(math.pi / 2)
assert v.isclose(Vec2(0, 1))
`,cpp:`
#include <cmath>
#include <stdexcept>

struct Vec2 {
    double x = 0, y = 0;
    Vec2 operator+(const Vec2& o) const;
    Vec2 operator-(const Vec2& o) const;
    Vec2 operator*(double s) const;
    double dot(const Vec2& o) const;
    double cross(const Vec2& o) const;
    double norm() const;
    Vec2 normalized() const;      // throw std::domain_error on zero
    Vec2 rotated(double theta) const;
};
Vec2 operator*(double s, const Vec2& v);
// TODO: define everything; test in main()
`},
{t:'Bank account with invariants',d:1,q:`<p>A <code>BankAccount</code> class with <code>deposit</code>, <code>withdraw</code>, <code>transfer_to(other, amount)</code>. Amounts must be positive; balance can never go negative. Invalid operations raise and leave both accounts unchanged. Test each failure.</p>`,
h:['In <code>transfer_to</code>, check everything before changing anything.','Python: <code>with pytest.raises(ValueError)</code>, or a manual try/except in a test function.']},
{t:'Your own tiny test harness',d:1,q:`<p>Write <code>check(name, got, expected, tol=None)</code> that prints a green <code>PASS</code> or red <code>FAIL</code> with both values, and a summary at exit. Do it in C++ too with a macro <code>CHECK(expr)</code> that prints the file and line. Use it in every later chapter. Then learn <code>pytest</code> and compare.</p>`,
h:['Python: ANSI colours <code>"\\033[32m"</code>, and <code>atexit.register</code> for the summary.','C++: <code>#define CHECK(e) check_impl((e), #e, __FILE__, __LINE__)</code>.']},
{t:'Parse robot logs',d:2,q:`<p>A CSV file has columns <code>t,x,y,theta</code> (seconds, metres, radians). Load it into a list of <code>Pose</code> records, skipping bad rows with a warning that names the line number. Compute total distance travelled, average speed, and the longest gap between timestamps. Make a test file with 5 rows including one broken row.</p>`,
h:['Python: <code>csv.DictReader</code>, convert inside try/except ValueError.','C++: <code>std::getline</code> per line, then <code>std::getline(ss, field, \',\')</code> per field, <code>std::stod</code>.']},
{t:'A generic stack',d:2,q:`<p>Write a stack class generic over its element type: Python with <code>typing.Generic[T]</code>, C++ with <code>template &lt;typename T&gt;</code> wrapping a <code>std::vector&lt;T&gt;</code>. Methods: <code>push</code>, <code>pop</code> (raise/throw on empty), <code>peek</code>, <code>size</code>, <code>empty</code>.</p>`,
h:['C++: return <code>T</code> from <code>pop</code> by moving: <code>T v = std::move(data.back()); data.pop_back(); return v;</code>'],
cpp:`
#include <stdexcept>
#include <utility>
#include <vector>

template <typename T>
class Stack {
public:
    void push(T value);
    T pop();
    const T& peek() const;
    std::size_t size() const;
    bool empty() const;
private:
    std::vector<T> data_;
};
// TODO: implement members (inside the class is fine for templates)
`},
{t:'Port without looking',d:1,q:`<p>Pick exercise 1.4 or 1.6. Solve it in the language you did <b>not</b> use before, without opening your old file. Then diff the two versions and write three comments on what each language made easier.</p>`}
]},

{id:'c04',part:'P1',n:4,title:'Complexity and Measuring',time:'4 days',
goal:'Predict how code scales, then check the prediction with a stopwatch.',
primer:`<p>Big-O tells you how running time grows with input size n. A rough budget: a modern machine does about <b>10<sup>8</sup> simple C++ operations per second</b> and about 10<sup>7</sup> in pure Python. So for n = 10<sup>5</sup>, O(n²) is 10<sup>10</sup>: too slow. O(n log n) is about 2·10<sup>6</sup>: instant.</p>
<ul><li>A single loop over n: O(n). Nested loops over n: O(n²).</li>
<li>Halving the problem each step: O(log n).</li>
<li>Sorting: O(n log n). Hash lookup: O(1) average.</li>
<li><b>Always measure.</b> Python: <code>timeit</code>, <code>time.perf_counter</code>. C++: <code>std::chrono::steady_clock</code>.</li></ul>`,
pattern:{py:`
import time

def timed(fn, *args, repeat=5):
    best = float("inf")
    for _ in range(repeat):
        t0 = time.perf_counter()
        fn(*args)
        best = min(best, time.perf_counter() - t0)
    return best
`,cpp:`
#include <chrono>

template <typename F>
double time_ms(F&& f, int repeat = 5) {
    double best = 1e300;
    for (int r = 0; r < repeat; ++r) {
        auto t0 = std::chrono::steady_clock::now();
        f();
        auto t1 = std::chrono::steady_clock::now();
        best = std::min(best, std::chrono::duration<double, std::milli>(t1 - t0).count());
    }
    return best;
}
`},
drill:'Given any loop nest from this book, state its complexity in under <b>30 seconds</b> and explain why in one sentence.',
ex:[
{t:'Name the complexity',d:1,q:`<p>Give the time complexity of each, then verify two of them by timing n = 1k, 2k, 4k, 8k and looking at the ratio.</p><ol>
<li><code>for i in range(n): for j in range(i): ...</code></li>
<li><code>i = n; while i &gt; 0: i //= 2</code></li>
<li><code>for i in range(n): j = 1; while j &lt; n: j *= 2</code></li>
<li><code>x in my_list</code> inside a loop over n</li>
<li><code>x in my_set</code> inside a loop over n</li>
<li><code>s = ""; for ch in chars: s = s + ch</code> (why is Python sometimes fast here anyway?)</li></ol>`,
h:['If doubling n doubles the time it is linear, if it quadruples the time it is quadratic.']},
{t:'List versus set membership',d:1,q:`<p>For n in 10³, 10⁴, 10⁵, 10⁶ build a list and a set of n ints and time 1,000 membership checks of missing values. Print a table. Then plot it with matplotlib on log-log axes.</p>`,
h:['Use missing values so the list has to scan everything.']},
{t:'Maximum subarray three ways',d:2,q:`<p>Find the largest sum of a contiguous subarray. Write O(n³), O(n²) with running sums, and O(n) Kadane. Assert all three agree on 200 random arrays, then time each on n = 2,000.</p>`,
h:['Kadane: <code>cur = max(x, cur + x); best = max(best, cur)</code>.'],
py:`
def kadane(a: list[int]) -> int:
    best = cur = a[0]
    for x in a[1:]:
        # TODO
        pass
    return best
`,cpp:`
#include <algorithm>
#include <vector>
long long kadane(const std::vector<int>& a) {
    long long best = a[0], cur = a[0];
    // TODO
    return best;
}
`},
{t:'Count pairs with sum ≤ K',d:2,q:`<p>Count pairs i &lt; j with <code>a[i] + a[j] ≤ K</code>. Write the O(n²) version, then sort and use two pointers for O(n log n). Check they agree; time both on n = 10⁵ in C++ (only the fast one).</p>`,
h:['After sorting, with <code>lo=0, hi=n-1</code>: if <code>a[lo]+a[hi] ≤ K</code> then all pairs (lo, lo+1..hi) work: add <code>hi-lo</code> and move lo up. Otherwise move hi down.']},
{t:'Build a growing array',d:2,q:`<p>In C++ implement <code>IntVec</code> with a raw buffer, <code>push_back</code> that doubles capacity when full, and a counter of element copies. Push 10⁶ items and print copies/n. Then change the growth to +1000 each time and compare. Explain “amortised O(1)” in a comment.</p>`,
h:['With doubling the total copies are under 2n. With fixed growth they are about n²/2000.'],
cpp:`
#include <cstddef>
#include <memory>

class IntVec {
public:
    void push_back(int v);
    std::size_t size() const { return size_; }
    std::size_t copies() const { return copies_; }
private:
    std::unique_ptr<int[]> data_;
    std::size_t size_ = 0, cap_ = 0, copies_ = 0;
    void grow(std::size_t new_cap);   // TODO: allocate, copy, count
};
`},
{t:'Fibonacci from O(2ⁿ) to O(log n)',d:3,q:`<p>Compute F(n) mod 1,000,000,007 four ways: naive recursion, memoised, iterative, and 2×2 matrix fast exponentiation. Time each for n = 30, then compute F(10<sup>18</sup>) with the fast one.</p>`,
h:['[[F(n+1), F(n)], [F(n), F(n−1)]] = [[1,1],[1,0]]ⁿ.','Exponentiation by squaring: if n is odd multiply the result by the base; square the base; halve n.'],
py:`
MOD = 1_000_000_007

def mat_mul(A, B):
    return [[(A[0][0]*B[0][0] + A[0][1]*B[1][0]) % MOD, 0],  # TODO finish
            [0, 0]]

def fib_fast(n: int) -> int:
    result, base = [[1, 0], [0, 1]], [[1, 1], [1, 0]]
    while n > 0:
        # TODO
        pass
    return result[0][1]
`}
]},

/* ================= PART 2 ================= */
{id:'c05',part:'P2',n:5,title:'Arrays, Two Pointers, Windows',time:'6 days',
goal:'Solve array problems in one pass using prefix sums, two pointers and sliding windows.',
primer:`<p>Three patterns solve a huge share of array problems in O(n):</p>
<ul><li><b>Prefix sums:</b> <code>P[i] = a[0]+…+a[i-1]</code>, so any range sum is <code>P[r]-P[l]</code> in O(1).</li>
<li><b>Two pointers:</b> on sorted data, move a left and right pointer toward each other depending on a comparison.</li>
<li><b>Sliding window:</b> grow the right end; while the window breaks a rule, shrink the left end. Each index enters and leaves once.</li></ul>
<p>Write these in C++ first. Use <code>long long</code> for sums and <code>std::size_t</code> or <code>int</code> consistently for indices to avoid signed/unsigned warnings.</p>`,
pattern:{py:`
def longest_window_sum_at_most(a: list[int], limit: int) -> int:
    """Longest subarray of non-negative ints with sum <= limit."""
    left = total = best = 0
    for right, x in enumerate(a):
        total += x
        while total > limit:
            total -= a[left]
            left += 1
        best = max(best, right - left + 1)
    return best
`,cpp:`
#include <algorithm>
#include <vector>

int longest_window_sum_at_most(const std::vector<int>& a, long long limit) {
    int left = 0, best = 0;
    long long total = 0;
    for (int right = 0; right < (int)a.size(); ++right) {
        total += a[right];
        while (total > limit) total -= a[left++];
        best = std::max(best, right - left + 1);
    }
    return best;
}
`},
drill:'Write the sliding-window template above and exercise 5.4 from a blank file in under <b>6 minutes</b> in C++.',
ex:[
{t:'Range sum queries',d:1,q:`<p>Read n numbers and q queries <code>l r</code> (0-based, inclusive). Answer each in O(1) after O(n) preprocessing. This is CSES “Static Range Sum Queries”; submit it there.</p>`,
h:['Make <code>P</code> of size n+1 with <code>P[0]=0</code>. Answer is <code>P[r+1]-P[l]</code>.'],
cpp:`
#include <iostream>
#include <vector>
int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);
    int n, q;
    std::cin >> n >> q;
    std::vector<long long> P(n + 1, 0);
    // TODO: read values, build prefix sums, answer queries
}
`},
{t:'Rotate in place',d:1,q:`<p>Rotate an array right by k steps using O(1) extra memory. <code>[1,2,3,4,5,6,7], k=3</code> → <code>[5,6,7,1,2,3,4]</code>. Use the three-reversal trick and write your own <code>reverse(a, i, j)</code>.</p>`,
h:['Reverse all, reverse the first k, reverse the rest. Take <code>k %= n</code> first.']},
{t:'Container with most water',d:2,q:`<p>Given heights, pick two lines that with the x-axis hold the most water. O(n) with two pointers. <code>[1,8,6,2,5,4,8,3,7]</code> → 49. Prove in a comment why moving the shorter line is safe.</p>`,
h:['Area = <code>min(h[l], h[r]) * (r - l)</code>. Moving the taller line can never increase the min.']},
{t:'Longest substring without repeats',d:2,q:`<p><code>"abcabcbb"</code> → 3, <code>"pwwkew"</code> → 3. Sliding window with a map from character to last index.</p>`,
h:['When you see a repeated char at index r whose last position is ≥ left, jump <code>left = last[c] + 1</code>.'],
py:`
def longest_unique(s: str) -> int:
    last: dict[str, int] = {}
    left = best = 0
    for right, ch in enumerate(s):
        # TODO
        pass
    return best
`},
{t:'Shortest window with sum ≥ S',d:2,q:`<p>Positive integers, target S. Return the length of the shortest contiguous subarray with sum ≥ S, or 0. <code>S=7, [2,3,1,2,4,3]</code> → 2.</p>`,
h:['Same window, but now you shrink while the condition <b>holds</b> and record the length each time.']},
{t:'3Sum without duplicates',d:2,q:`<p>Return all unique triples summing to 0. Sort, fix i, then two pointers on the rest. Skip equal values to avoid duplicates. O(n²).</p>`,
h:['After finding a triple, move both pointers and skip duplicates: <code>while l &lt; r and a[l] == a[l-1]: l += 1</code>.']},
{t:'Obstacle counting on a grid map',d:2,q:`<p>A robot map is an R×C grid of 0 (free) and 1 (obstacle). Answer many queries “how many obstacles are inside rectangle (r1,c1)–(r2,c2)?” in O(1) each using a 2D prefix sum. Use it to test whether a 3×3 robot footprint fits at every cell.</p>`,
h:['<code>P[i+1][j+1] = g[i][j] + P[i][j+1] + P[i+1][j] − P[i][j]</code>.','Rectangle = <code>P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] + P[r1][c1]</code>.'],
cpp:`
#include <vector>
using Grid = std::vector<std::vector<int>>;

struct Prefix2D {
    std::vector<std::vector<int>> P;
    explicit Prefix2D(const Grid& g) {
        // TODO: build (R+1) x (C+1)
    }
    int count(int r1, int c1, int r2, int c2) const {
        return 0; // TODO
    }
};
`},
{t:'Trapping rain water',d:3,q:`<p>Heights of bars; how much water is trapped? <code>[0,1,0,2,1,0,1,3,2,1,2,1]</code> → 6. First O(n) memory with left-max and right-max arrays, then O(1) memory with two pointers.</p>`,
h:['Water at i = <code>min(maxLeft[i], maxRight[i]) − h[i]</code>.','Two pointers: always process the side with the smaller running max.']}
]},

{id:'c06',part:'P2',n:6,title:'Hashing',time:'5 days',
goal:'Trade memory for speed with hash maps, and build one yourself.',
primer:`<p>A hash map turns “search for x” from O(n) into O(1) on average. The fluent move is recognising <b>what to store</b>: counts, last positions, prefix sums seen so far, or a grid cell → list of objects.</p>
<ul><li>Prefix sum + map counts subarrays with a given sum.</li>
<li>Set of seen values finds duplicates and consecutive runs.</li>
<li><b>Spatial hashing</b> buckets 2D points by grid cell. It is how particle and multi-agent simulations find neighbours fast.</li></ul>
<p>C++ note: <code>unordered_map::operator[]</code> inserts a default value if the key is missing. Use <code>find</code> or <code>contains</code> (C++20) when you only want to check.</p>`,
pattern:{py:`
from collections import defaultdict

def subarrays_with_sum(a: list[int], k: int) -> int:
    seen = defaultdict(int)
    seen[0] = 1
    total = count = 0
    for x in a:
        total += x
        count += seen[total - k]
        seen[total] += 1
    return count
`,cpp:`
#include <unordered_map>
#include <vector>

long long subarrays_with_sum(const std::vector<int>& a, long long k) {
    std::unordered_map<long long, long long> seen{{0, 1}};
    long long total = 0, count = 0;
    for (int x : a) {
        total += x;
        if (auto it = seen.find(total - k); it != seen.end()) count += it->second;
        ++seen[total];
    }
    return count;
}
`},
drill:'Implement LRU cache (6.5) from blank in under <b>20 minutes</b> in C++ using <code>std::list</code> and <code>unordered_map</code>.',
ex:[
{t:'First unique character',d:1,q:`<p>Return the index of the first non-repeating character, or −1. <code>"leetcode"</code> → 0, <code>"aabb"</code> → −1. Two passes.</p>`},
{t:'Longest consecutive run',d:2,q:`<p>Unsorted ints; length of the longest run of consecutive values. <code>[100,4,200,1,3,2]</code> → 4. Must be O(n): no sorting.</p>`,
h:['Put everything in a set. Only start counting from x when <code>x-1</code> is not in the set.']},
{t:'Subarrays summing to k',d:2,q:`<p>Type the pattern above from memory, then extend it: return the start and end index of the <b>longest</b> subarray with sum k.</p>`,
h:['Store the first index at which each prefix sum appears, not the count.']},
{t:'Build a hash map',d:3,q:`<p>In C++ implement <code>HashMap&lt;K,V&gt;</code> with separate chaining: a vector of buckets, each a <code>std::vector&lt;std::pair&lt;K,V&gt;&gt;</code>. Support <code>insert_or_assign</code>, <code>find</code>, <code>erase</code>, and rehash to double the buckets when load factor &gt; 0.75. Test against <code>std::unordered_map</code> with 10⁵ random operations.</p>`,
h:['Bucket index = <code>std::hash&lt;K&gt;{}(key) % buckets.size()</code>.','Randomised differential testing (same operations on yours and the standard map, compare every result) catches bugs fast.'],
cpp:`
#include <functional>
#include <optional>
#include <utility>
#include <vector>

template <typename K, typename V>
class HashMap {
public:
    explicit HashMap(std::size_t buckets = 8) : table_(buckets) {}
    void insert_or_assign(const K& key, V value);
    std::optional<V> find(const K& key) const;
    bool erase(const K& key);
    std::size_t size() const { return size_; }
private:
    std::vector<std::vector<std::pair<K, V>>> table_;
    std::size_t size_ = 0;
    std::size_t index(const K& key) const { return std::hash<K>{}(key) % table_.size(); }
    void rehash(std::size_t new_buckets);   // TODO
};
`},
{t:'LRU cache',d:3,q:`<p>Capacity c. <code>get(key)</code> returns the value or −1 and marks it most recent. <code>put(key, value)</code> inserts and evicts the least recently used if over capacity. Both O(1).</p>`,
h:['A doubly linked list keeps recency order; a map stores key → list iterator.','C++: <code>list.splice(list.begin(), list, it)</code> moves a node to the front in O(1).','Python: <code>collections.OrderedDict</code> with <code>move_to_end</code>. Then write it without OrderedDict.'],
cpp:`
#include <list>
#include <unordered_map>
#include <utility>

class LRUCache {
public:
    explicit LRUCache(int capacity) : cap_(capacity) {}
    int get(int key);
    void put(int key, int value);
private:
    int cap_;
    std::list<std::pair<int, int>> order_;    // front = most recent
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> where_;
};
`},
{t:'Neighbour search with spatial hashing',d:3,q:`<p>N agents at random positions in a 100×100 world. Find all pairs closer than r = 2. First write the O(N²) check. Then bucket agents into cells of size r, and only compare agents in the same and 8 neighbouring cells. Verify both give the same pairs, and time N = 1k, 10k, 50k.</p>`,
h:['Cell key = <code>(int(x // r), int(y // r))</code>.','To avoid duplicate pairs, only record (i, j) with i &lt; j.'],
py:`
import random
from collections import defaultdict

def close_pairs_grid(pts: list[tuple[float, float]], r: float) -> set[tuple[int, int]]:
    grid: dict[tuple[int, int], list[int]] = defaultdict(list)
    for i, (x, y) in enumerate(pts):
        grid[(int(x // r), int(y // r))].append(i)
    pairs = set()
    for (cx, cy), members in grid.items():
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                # TODO: compare members with grid.get((cx+dx, cy+dy), [])
                pass
    return pairs
`}
]},

{id:'c07',part:'P2',n:7,title:'Stacks, Queues, Linked Lists',time:'5 days',
goal:'Use LIFO and FIFO structures fluently, and manipulate pointers without fear.',
primer:`<p><b>Stack</b> (last in, first out): undo, parsing, DFS, “nearest bigger to the left”. <b>Queue</b> (first in, first out): BFS, buffering, scheduling. <b>Deque</b>: both ends, the tool for sliding-window maximum.</p>
<ul><li>Python: <code>list</code> as a stack, <code>collections.deque</code> as a queue. Never <code>list.pop(0)</code>: it is O(n).</li>
<li>C++: <code>std::stack</code>, <code>std::queue</code>, <code>std::deque</code>, or a plain <code>vector</code> as a stack.</li>
<li><b>Monotonic stack:</b> keep the stack sorted; pop everything that the new element “beats”. Each element is pushed and popped once, so O(n).</li>
<li>Linked lists teach pointer discipline: draw boxes and arrows before writing code.</li></ul>`,
pattern:{py:`
def next_greater(a: list[int]) -> list[int]:
    res = [-1] * len(a)
    stack: list[int] = []          # indices, values decreasing
    for i, x in enumerate(a):
        while stack and a[stack[-1]] < x:
            res[stack.pop()] = x
        stack.append(i)
    return res
`,cpp:`
#include <vector>

std::vector<int> next_greater(const std::vector<int>& a) {
    std::vector<int> res(a.size(), -1), stack;
    for (int i = 0; i < (int)a.size(); ++i) {
        while (!stack.empty() && a[stack.back()] < a[i]) {
            res[stack.back()] = a[i];
            stack.pop_back();
        }
        stack.push_back(i);
    }
    return res;
}
`},
drill:'Reverse a linked list iteratively in C++ from blank, with a test, in under <b>5 minutes</b>.',
ex:[
{t:'Balanced brackets',d:1,q:`<p>Is <code>"{[()()]}"</code> balanced? <code>"([)]"</code> is not. Use a stack and a map from closing to opening bracket.</p>`},
{t:'Evaluate Reverse Polish Notation',d:1,q:`<p><code>["2","1","+","3","*"]</code> → 9. Division truncates toward zero. Then extend it to accept an infix string like <code>"3 + 4 * 2"</code> by first converting with the shunting-yard algorithm.</p>`,
h:['Careful with order: pop <code>b</code> then <code>a</code>, compute <code>a op b</code>.','Python <code>int(a / b)</code> truncates toward zero; <code>a // b</code> floors.']},
{t:'Min stack in O(1)',d:2,q:`<p>A stack that supports <code>push</code>, <code>pop</code>, <code>top</code>, <code>get_min</code>, all O(1).</p>`,
h:['Store pairs <code>(value, min_so_far)</code>.']},
{t:'Reverse a linked list',d:2,q:`<p>Define a singly linked <code>Node</code>. Write <code>reverse</code> iteratively and recursively. In C++ use <code>std::unique_ptr&lt;Node&gt;</code> for ownership, then write a second version with raw pointers and discuss which is cleaner.</p>`,
h:['Three pointers: <code>prev, cur, next</code>. Each step: save next, point cur back to prev, advance both.'],
cpp:`
#include <memory>

struct Node {
    int val;
    std::unique_ptr<Node> next;
};

std::unique_ptr<Node> reverse(std::unique_ptr<Node> head) {
    std::unique_ptr<Node> prev;
    while (head) {
        // TODO: std::move the pieces around
    }
    return prev;
}
`},
{t:'Cycle detection',d:2,q:`<p>Detect a cycle in a linked list with Floyd’s tortoise and hare in O(1) memory, then find the node where the cycle begins.</p>`,
h:['After slow and fast meet, reset one pointer to head and step both by 1. They meet at the cycle start.']},
{t:'Daily temperatures',d:2,q:`<p>For each day, how many days until a warmer temperature? <code>[73,74,75,71,69,72,76,73]</code> → <code>[1,1,4,2,1,1,0,0]</code>. Monotonic stack.</p>`},
{t:'Sliding window maximum',d:3,q:`<p>Max of every window of size k, O(n). <code>[1,3,-1,-3,5,3,6,7], k=3</code> → <code>[3,3,5,5,6,7]</code>.</p>`,
h:['Deque of indices with decreasing values. Pop from the back while smaller than the new value; pop from the front if it left the window.']},
{t:'Sensor ring buffer',d:2,q:`<p>Write a fixed-capacity <code>RingBuffer</code> for float sensor readings: <code>push</code> overwrites the oldest when full, <code>mean()</code> is O(1) using a running sum, and iteration goes oldest to newest. Use it to smooth a noisy sine wave and plot raw vs smoothed.</p>`,
h:['Keep <code>head</code> index and <code>count</code>. Next write position is <code>(head + count) % cap</code>.'],
cpp:`
#include <array>
#include <cstddef>

template <std::size_t N>
class RingBuffer {
public:
    void push(double v);
    double mean() const { return count_ ? sum_ / count_ : 0.0; }
    std::size_t size() const { return count_; }
    double operator[](std::size_t i) const;   // 0 = oldest
private:
    std::array<double, N> data_{};
    std::size_t head_ = 0, count_ = 0;
    double sum_ = 0.0;
};
`}
]}
);
