(function(){
const R=String.raw;
const L=window.BOOK.lessons=window.BOOK.lessons||{};

L.c01={needs:['g1','g2','g3'],
learn:[
{h:'Three loop shapes',body:R`<p>Almost every loop is one of these:</p>
<ul><li><b>For each item:</b> visit every element once (<code>for x in nums</code>, <code>for (int x : nums)</code>).</li>
<li><b>Counting loop:</b> run a fixed number of times (<code>for i in range(n)</code>, <code>for (int i = 0; i &lt; n; ++i)</code>).</li>
<li><b>Until a condition:</b> run while something is true, when you do not know how many steps (<code>while n &gt; 1</code>).</li></ul>
<p>Two keywords change the flow: <code>break</code> leaves the loop immediately; <code>continue</code> skips to the next iteration.</p>`,
code:{py:R`
for i in range(5):          # 0 1 2 3 4
    print(i)
for i in range(2, 10, 3):   # start 2, stop before 10, step 3 -> 2 5 8
    print(i)

n = 37
while n != 1:               # don't know how many steps
    n = n // 2 if n % 2 == 0 else 3 * n + 1

for x in [4, -1, 7, 0, 9]:
    if x < 0:
        continue            # skip negatives
    if x == 0:
        break               # stop at the first zero
    print(x)                # prints 4 then 7
`,cpp:R`
#include <iostream>
int main() {
    for (int i = 0; i < 5; ++i) std::cout << i << ' ';   // init; condition; step
    for (int i = 2; i < 10; i += 3) std::cout << i << ' ';
    long long n = 37;
    while (n != 1) n = (n % 2 == 0) ? n / 2 : 3 * n + 1;
}
`},
after:R`<p><code>range(a, b, s)</code> includes <code>a</code> but stops <b>before</b> <code>b</code>. A C++ <code>for</code> header has three parts: start (<code>int i = 0</code>), keep-going condition (<code>i &lt; 5</code>), and step (<code>++i</code>, which means add one). <code>cond ? a : b</code> in C++ and <code>a if cond else b</code> in Python pick one of two values.</p>`},
{h:'The accumulator pattern',body:R`<p>The single most common loop: create a variable for the answer <i>before</i> the loop, update it <i>inside</i>, use it <i>after</i>. Sum, count, maximum, building a list: all the same shape.</p>`,
code:{py:R`
def largest(nums: list[int]) -> int:
    best = nums[0]            # 1. start
    for x in nums[1:]:        # 2. update per item
        if x > best:
            best = x
    return best               # 3. use
`}},
{h:'Type hints like list[int]',body:R`<p>In <code>def count_evens(nums: list[int]) -&gt; int</code>, <code>list[int]</code> says “a list of integers”. <code>tuple[int, str]</code> is a pair of an int and a string. <code>dict[str, int]</code> maps strings to ints. <code>X | None</code> means “an X, or None”. Python does not check these while running, but your editor and tools like <code>mypy</code> do, and they make code much easier to read.</p>`},
{h:'Trace before you trust',body:R`<p>When a loop confuses you, trace it on paper. Write one column per variable and one row per iteration. For <code>count_evens([1, 2, 4, 7])</code>:</p>
<table style="border-collapse:collapse;font-family:var(--f-code);font-size:.85rem"><tr><th style="padding:2px 12px;text-align:left">x</th><th style="padding:2px 12px;text-align:left">x % 2</th><th style="padding:2px 12px;text-align:left">count after</th></tr>
<tr><td style="padding:2px 12px">1</td><td style="padding:2px 12px">1</td><td style="padding:2px 12px">0</td></tr><tr><td style="padding:2px 12px">2</td><td style="padding:2px 12px">0</td><td style="padding:2px 12px">1</td></tr><tr><td style="padding:2px 12px">4</td><td style="padding:2px 12px">0</td><td style="padding:2px 12px">2</td></tr><tr><td style="padding:2px 12px">7</td><td style="padding:2px 12px">1</td><td style="padding:2px 12px">2</td></tr></table>
<p>Professionals still do this for tricky loops.</p>`}
],
math:[
{h:'Why the sieve starts at p²',body:R`<p>Every composite number \(m \le n\) has a prime factor \(p \le \sqrt{m}\). Reason: if \(m = ab\) with both \(a, b \gt \sqrt{m}\) then \(ab \gt m\), a contradiction. So when we reach prime \(p\), every multiple \(kp\) with \(k \lt p\) has a smaller prime factor and was already crossed out. Start at \(p^2\), and stop the outer loop when \(p^2 \gt n\). Total work is about \(n \sum_{p \le n} \frac{1}{p} \approx n \ln\ln n\): nearly linear.</p>`},
{h:'Simulating motion (for 1.8)',body:R`<p>A falling ball obeys two equations: height changes by velocity, velocity changes by gravity.</p>
\[ \frac{dy}{dt} = v, \qquad \frac{dv}{dt} = -g. \]
<p>A computer cannot do continuous time, so it takes small steps \(\Delta t\). The simplest approximation of a derivative is \(\frac{dy}{dt} \approx \frac{y_{k+1}-y_k}{\Delta t}\), which gives update rules:</p>
\[ \text{explicit Euler: } y_{k+1} = y_k + v_k\,\Delta t,\quad v_{k+1} = v_k - g\,\Delta t \]
\[ \text{semi-implicit Euler: } v_{k+1} = v_k - g\,\Delta t,\quad y_{k+1} = y_k + v_{k+1}\,\Delta t \]
<p>The only difference is which velocity moves the ball. Explicit Euler slowly <i>gains</i> energy and its orbits spiral outward; semi-implicit Euler keeps energy nearly constant. Physics engines like MuJoCo and Box2D use the semi-implicit form. A bounce with restitution \(e\) sets \(v \leftarrow -e\,v\), so bounce speeds shrink geometrically: \(v, ev, e^2v, \dots\)</p>`}
]};

L.c02={needs:['g3'],
learn:[
{h:'Tuples and unpacking',body:R`<p>A <b>tuple</b> is a fixed-size, unchangeable group: <code>(3, "Fizz")</code>. Unpacking assigns its parts to names in one line. It works in loops too.</p>`,
code:{py:R`
pair = (3, "Fizz")
d, word = pair                      # d = 3, word = "Fizz"
for name, score in [("a", 1), ("b", 2)]:
    print(name, score)
for i, (a, b) in enumerate(zip([1, 2], [10, 20])):   # zip walks two lists together
    print(i, a, b)                  # 0 1 10, then 1 2 20
`,cpp:R`
#include <string>
#include <utility>
#include <vector>
int main() {
    std::pair<int, std::string> p{3, "Fizz"};
    auto [d, word] = p;                       // structured binding
    std::vector<std::pair<std::string, int>> v{{"a", 1}, {"b", 2}};
    for (const auto& [name, score] : v) { /* ... */ }
}
`}},
{h:'Counter and defaultdict',body:R`<p>Two helpers from the <code>collections</code> module remove boilerplate.</p>
<ul><li><code>Counter(iterable)</code> counts how often each value appears. <code>.most_common(k)</code> gives the k biggest.</li>
<li><code>defaultdict(list)</code> is a dict that creates a missing key automatically with a default value (here an empty list), so you can write <code>groups[key].append(x)</code> without checking first.</li></ul>`,
code:{py:R`
from collections import Counter, defaultdict
c = Counter("banana")          # Counter({'a': 3, 'n': 2, 'b': 1})
print(c["a"], c["z"])          # 3 0  (missing keys count as 0)

normal = {}
# normal["x"].append(1)        # KeyError!
groups = defaultdict(list)
groups["x"].append(1)          # works: creates [] first
`}},
{h:'Sorting with a key or a comparator',body:R`<p>Python’s <code>sorted(items, key=f)</code> sorts by <code>f(item)</code>. A <b>lambda</b> is a tiny unnamed function written inline: <code>lambda kv: kv[1]</code> means “given kv, return kv[1]”. To sort by several things, return a tuple; tuples compare element by element. Negate a number to sort it descending.</p>
<p>C++ <code>std::sort(begin, end, cmp)</code> takes a <b>comparator</b>: a function that returns true if <code>a</code> should come before <code>b</code>. A C++ lambda is written <code>[](const T&amp; a, const T&amp; b) { return ...; }</code>; the <code>[]</code> is the capture list (which outside variables it can see).</p>`,
code:{py:R`
items = [("cat", 1), ("the", 3), ("and", 2), ("bat", 1)]
by_count = sorted(items, key=lambda kv: (-kv[1], kv[0]))
# [('the', 3), ('and', 2), ('bat', 1), ('cat', 1)]
`,cpp:R`
#include <algorithm>
#include <string>
#include <vector>
int main() {
    std::vector<std::pair<std::string, int>> items{{"cat",1},{"the",3},{"and",2},{"bat",1}};
    std::sort(items.begin(), items.end(), [](const auto& a, const auto& b) {
        if (a.second != b.second) return a.second > b.second;   // count descending
        return a.first < b.first;                                // then word ascending
    });
}
`}},
{h:'Iterators in C++',body:R`<p><code>v.begin()</code> and <code>v.end()</code> are <b>iterators</b>: objects that point into a container, like a bookmark. <code>end()</code> points one past the last element. Standard algorithms (<code>sort</code>, <code>find</code>, <code>reverse</code>, <code>accumulate</code>) take a begin/end pair, so they work on any container. <code>std::vector&lt;T&gt; v(m.begin(), m.end());</code> copies a map’s entries into a vector.</p>`},
{h:'Ordered or unordered map?',body:R`<p><code>std::unordered_map</code> is a hash table: O(1) average lookup, no order. <code>std::map</code> is a balanced tree: O(log n) lookup, but iterating gives keys in sorted order. Use <code>map</code> when you need sorted output or “smallest key above x” queries; otherwise <code>unordered_map</code>.</p>`}
]};

L.c03={needs:['g5','g6'],
learn:[
{h:'What clean code looks like',body:R`<p>Compare these two functions. They do the same thing.</p>`,
code:{py:R`
# Before
def p(d):
    if d:
        if d['b'] > 20:
            return d['s'] * 0.1
        else:
            return 0
    return 0

# After
LOW_BATTERY_PERCENT = 20
COST_PER_METRE = 0.1

def energy_for_trip(rover: dict) -> float:
    """Energy needed for the planned trip, or 0 if the rover cannot go."""
    if not rover or rover["battery"] <= LOW_BATTERY_PERCENT:
        return 0.0
    return rover["distance"] * COST_PER_METRE
`},
after:R`<p>What changed: a name that says what it computes; named constants instead of magic numbers; one guard clause instead of nested <code>if</code>s; a docstring; a type hint. None of this changes speed, but it changes how quickly the next person (you, in a month) understands it.</p>`},
{h:'Forward references and frozen dataclasses',body:R`<p>Inside <code>class Vec2</code>, a method can return a <code>Vec2</code>, but the name is not finished being defined yet. Write the hint as a string <code>"Vec2"</code>, or put <code>from __future__ import annotations</code> at the top of the file so all hints are treated that way.</p>
<p><code>@dataclass(frozen=True)</code> makes objects <b>immutable</b>: fields cannot be changed after creation. Methods return new objects instead. This prevents a whole class of aliasing bugs and makes the objects usable as dict keys.</p>`},
{h:'Templates: generic code in C++',body:R`<p>A <b>template</b> lets you write one class or function that works for many types. The compiler generates a version for each type you actually use. <code>std::vector&lt;T&gt;</code> is itself a template. Python does not need this because it is dynamically typed; <code>typing.Generic[T]</code> only documents it.</p>`,
code:{cpp:R`
#include <cassert>
#include <string>

template <typename T>
T biggest(const T& a, const T& b) {
    return (a < b) ? b : a;
}

int main() {
    assert(biggest(3, 7) == 7);                                   // T = int
    assert(biggest(std::string("ab"), std::string("b")) == "b");  // T = std::string
}
`,py:R`
from typing import Generic, TypeVar
T = TypeVar("T")

class Box(Generic[T]):
    def __init__(self, item: T):
        self.item = item
`},
after:R`<p>Templates must usually be written fully in a header, because the compiler needs the whole definition to generate code for each type.</p>`},
{h:'Moving instead of copying',body:R`<p><code>std::move(x)</code> says “I am done with x; you may steal its contents”. Moving a <code>std::string</code> or <code>std::vector</code> just transfers its internal pointer, which is much cheaper than copying all elements. After a move, the old object is valid but empty-ish; do not rely on its value. Chapter 16 goes deeper.</p>`}
],
math:[
{h:'Vectors in the plane',body:R`<p>A 2D vector \(\mathbf{v} = (x, y)\) is an arrow. Its length is \(\lVert\mathbf{v}\rVert = \sqrt{x^2 + y^2}\). Addition is component-wise. The <b>dot product</b> \(\mathbf{a}\cdot\mathbf{b} = a_x b_x + a_y b_y = \lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert\cos\theta\) measures how aligned two vectors are (zero means perpendicular). The 2D <b>cross product</b> \(\mathbf{a}\times\mathbf{b} = a_x b_y - a_y b_x = \lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert\sin\theta\) is positive when \(\mathbf{b}\) is counter-clockwise from \(\mathbf{a}\). Robots use it to decide “is the goal to my left or right?”.</p>`},
{h:'Rotation',body:R`<p>Rotating \((x, y)\) by angle \(\theta\) counter-clockwise: write the point in polar form \(x = r\cos\phi,\ y = r\sin\phi\). After rotation it is \((r\cos(\phi+\theta), r\sin(\phi+\theta))\). Expanding with the angle-sum identities gives</p>
\[ \begin{pmatrix} x' \\ y' \end{pmatrix} = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}\begin{pmatrix} x \\ y \end{pmatrix}. \]
<p>This matrix reappears in Chapter 25 for robot poses.</p>`}
]};

L.c04={needs:['g2'],
learn:[
{h:'Timing code correctly',body:R`<p>Run the code several times and keep the <b>minimum</b>: other programs on your computer only ever make it slower, so the minimum is the cleanest measurement. Use a high-resolution clock: <code>time.perf_counter()</code> in Python, <code>std::chrono::steady_clock</code> in C++. In C++ always time an optimised build (<code>-O2</code>); timing <code>-O0</code> code is meaningless.</p>
<p>In the C++ pattern, <code>template &lt;typename F&gt; double time_ms(F&amp;&amp; f)</code> means “accept anything callable”: a function or a lambda. You call it like <code>time_ms([&amp;] { my_function(data); })</code>. <code>[&amp;]</code> lets the lambda use local variables by reference.</p>`},
{h:'How Kadane’s algorithm thinks',body:R`<p>Walk left to right keeping <code>cur</code> = the best sum of a subarray that <b>ends exactly here</b>. At each new element you either extend the previous best (<code>cur + x</code>) or start fresh (<code>x</code>), whichever is bigger. The overall answer is the best <code>cur</code> ever seen. This “best ending here” idea is your first taste of dynamic programming (Chapter 14).</p>`}
],
math:[
{h:'What Big-O means',body:R`<p>We say \(f(n) = O(g(n))\) if there are constants \(c, n_0\) with \(f(n) \le c\,g(n)\) for all \(n \ge n_0\). It ignores constant factors and small inputs and keeps only the growth rate. Common classes, fastest first:</p>
\[ O(1) \lt O(\log n) \lt O(n) \lt O(n\log n) \lt O(n^2) \lt O(2^n). \]`},
{h:'Counting nested loops',body:R`<p>The loop <code>for i in range(n): for j in range(i)</code> runs the inner body \(0 + 1 + \dots + (n-1)\) times. The arithmetic series gives</p>
\[ \sum_{i=0}^{n-1} i = \frac{n(n-1)}{2} = O(n^2). \]
<p>A loop that halves \(i\) each step runs \(k\) times where \(n / 2^k = 1\), so \(k = \log_2 n\).</p>`},
{h:'Why doubling gives amortised O(1)',body:R`<p>If a dynamic array doubles its capacity when full, then over \(n\) pushes the copies happen at sizes \(1, 2, 4, \dots\) up to \(n\). The geometric series gives</p>
\[ 1 + 2 + 4 + \dots + 2^{\lfloor\log_2 n\rfloor} \lt 2n. \]
<p>So \(n\) pushes cost under \(3n\) operations in total: \(O(1)\) each <i>on average</i> (amortised), even though one push occasionally costs \(O(n)\). With fixed growth \(+c\), copies total about \(n^2 / 2c\): quadratic.</p>`},
{h:'Fibonacci by matrix power',body:R`<p>The recurrence \(F_{n+1} = F_n + F_{n-1}\) is linear, so it can be written as a matrix:</p>
\[ \begin{pmatrix} F_{n+1} & F_n \\ F_n & F_{n-1} \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^{n}. \]
<p>Computing \(M^n\) by <b>repeated squaring</b> (\(M^{2k} = (M^k)^2\), \(M^{2k+1} = M \cdot M^{2k}\)) takes \(O(\log n)\) multiplications. Working modulo \(p\) keeps numbers small because \((ab) \bmod p = ((a \bmod p)(b \bmod p)) \bmod p\).</p>`}
]};

L.c05={needs:['c04'],
learn:[
{h:'Prefix sums, worked',body:R`<p>For <code>a = [3, 1, 4, 1, 5]</code>, build <code>P = [0, 3, 4, 8, 9, 14]</code>, where <code>P[i]</code> is the sum of the first <code>i</code> elements. The sum of <code>a[1..3]</code> (1 + 4 + 1 = 6) is <code>P[4] − P[1] = 9 − 3 = 6</code>. One O(n) pass, then every range query is O(1).</p>`},
{h:'Two pointers',body:R`<p>On a <b>sorted</b> array, put <code>lo</code> at the start and <code>hi</code> at the end. Compare <code>a[lo] + a[hi]</code> with the target. Too small? Only increasing <code>lo</code> can help. Too big? Only decreasing <code>hi</code> can help. Each step discards one element for good, so the whole scan is O(n).</p>`},
{h:'Sliding window and its invariant',body:R`<p>A window is the range <code>[left, right]</code>. The loop always moves <code>right</code> forward by one. Then, while the window breaks the rule, it moves <code>left</code> forward. The <b>invariant</b>, the statement true at the end of every iteration, is “the window is valid and as long as it can be for this <code>right</code>”. Each index enters once and leaves once: O(n).</p>`},
{h:'Fast input in C++',body:R`<p><code>std::ios::sync_with_stdio(false);</code> stops C++ streams from synchronising with C’s <code>printf</code> system, and <code>std::cin.tie(nullptr);</code> stops <code>cin</code> flushing <code>cout</code> before every read. Together they make reading large inputs several times faster. Put them at the top of <code>main</code> on CSES and Codeforces. Do not mix <code>printf</code> and <code>cout</code> afterwards.</p>`}
],
math:[
{h:'Inclusion–exclusion on a grid',body:R`<p>Let \(P_{i,j}\) be the sum of all cells above and left of \((i, j)\). Then</p>
\[ P_{i+1,j+1} = g_{i,j} + P_{i,j+1} + P_{i+1,j} - P_{i,j}, \]
<p>because adding the two neighbouring rectangles counts the overlap \(P_{i,j}\) twice. A query rectangle \((r_1,c_1)\)–\((r_2,c_2)\) is the big rectangle minus the top strip and left strip, plus the corner removed twice:</p>
\[ S = P_{r_2+1,c_2+1} - P_{r_1,c_2+1} - P_{r_2+1,c_1} + P_{r_1,c_1}. \]`}
]};

L.c06={needs:['g3','c04'],
learn:[
{h:'How a hash table works',body:R`<p>A hash table is an array of <b>buckets</b>. A <b>hash function</b> turns a key into a big integer; <code>hash % buckets</code> picks the bucket. Lookup goes straight to that bucket instead of scanning everything. Two different keys can land in the same bucket: a <b>collision</b>. Separate chaining stores a small list in each bucket. When the table gets too full, it <b>rehashes</b> into an array twice as big.</p>
<p>Keys must be <b>hashable</b> and must not change while stored: in Python, tuples and strings are fine, lists are not.</p>`},
{h:'C++ details used in this chapter',body:R`<ul><li><code>m.find(k)</code> returns an iterator to the entry, or <code>m.end()</code> if missing. <code>it-&gt;first</code> is the key, <code>it-&gt;second</code> the value.</li>
<li><code>if (auto it = m.find(k); it != m.end()) { ... }</code> is C++17’s if-with-initialiser: <code>it</code> exists only inside the if.</li>
<li><code>std::optional&lt;T&gt;</code> holds either a T or nothing (<code>std::nullopt</code>). Check with <code>if (opt)</code>, read with <code>*opt</code>. Python uses <code>None</code> for the same idea.</li>
<li><code>std::list</code> is a doubly linked list; <code>splice</code> moves nodes without copying, which the LRU cache needs.</li></ul>`}
],
math:[
{h:'Why lookup is O(1) on average',body:R`<p>With \(n\) keys in \(m\) buckets, the <b>load factor</b> is \(\alpha = n/m\). If the hash spreads keys uniformly, each bucket holds \(\alpha\) keys on average, so a lookup checks about \(1 + \alpha\) entries. Keeping \(\alpha \le 0.75\) by doubling \(m\) makes that a constant. Rehashing costs \(O(n)\) but happens rarely, so like the dynamic array in Chapter 4 the amortised cost per insert stays \(O(1)\).</p>`},
{h:'Spatial hashing complexity',body:R`<p>With cell size \(r\), any two points closer than \(r\) are in the same or adjacent cells. If \(N\) points are spread over area \(A\), each cell holds about \(k = N r^2 / A\) points, and each point is compared with about \(9k\) others. The total is \(O(N k)\), which is linear in \(N\) at fixed density, instead of \(O(N^2)\).</p>`}
]};

L.c07={needs:['g4','g5'],
learn:[
{h:'Stack, queue, deque',body:R`<p>Think of a <b>stack</b> as a pile of plates: you add and remove from the top only (LIFO). A <b>queue</b> is a line at a shop: join at the back, leave from the front (FIFO). A <b>deque</b> (“deck”) allows both ends.</p>`,
code:{py:R`
from collections import deque
stack = []
stack.append(1); stack.append(2)
print(stack.pop())          # 2

q = deque()
q.append("a"); q.append("b")
print(q.popleft())          # 'a'   O(1), unlike list.pop(0)
`,cpp:R`
#include <deque>
#include <queue>
#include <stack>
int main() {
    std::stack<int> s;  s.push(1); s.push(2);  int top = s.top(); s.pop();
    std::queue<char> q; q.push('a'); q.push('b'); char f = q.front(); q.pop();
    std::deque<int> d;  d.push_front(1); d.push_back(2); d.pop_front();
}
`},
after:R`<p>C++ <code>pop()</code> returns nothing; read the value with <code>top()</code> or <code>front()</code> first.</p>`},
{h:'Linked lists',body:R`<p>A linked list is a chain of <b>nodes</b>. Each node holds a value and a pointer to the next node; the last points to nothing. Inserting after a known node is O(1) (just re-link pointers), but reaching the k-th node is O(k). Draw boxes and arrows for every pointer operation before you code it.</p>`,
code:{py:R`
class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

head = Node(1, Node(2, Node(3)))      # 1 -> 2 -> 3
cur = head
while cur is not None:
    print(cur.val)
    cur = cur.next
`}},
{h:'Monotonic stack, traced',body:R`<p>For “next greater element” on <code>[2, 1, 5]</code>: push index 0 (value 2). Value 1 is not greater, push index 1. Value 5 is greater than 1: pop index 1, its answer is 5. Still greater than 2: pop index 0, answer 5. Push index 2. Index 2 has no answer (−1). The stack always holds indices whose values <i>decrease</i> from bottom to top: values still waiting for something bigger.</p>`},
{h:'Templates with a number',body:R`<p>In <code>template &lt;std::size_t N&gt; class RingBuffer</code>, the template parameter is a <b>number</b>, not a type. <code>RingBuffer&lt;64&gt;</code> has capacity 64 fixed at compile time, so its storage can be a <code>std::array&lt;double, N&gt;</code> with no heap allocation, which is common in embedded rover code.</p>`}
]};

L.c08={needs:['g2','c07'],
learn:[
{h:'How a recursive call runs',body:R`<p>A function that calls itself is <b>recursive</b>. Each call gets its own fresh local variables, stored in a <b>frame</b> on the call stack. The call waits until its inner call returns, then continues.</p>`,
code:{py:R`
def factorial(n: int) -> int:
    if n <= 1:                 # base case: stop here
        return 1
    return n * factorial(n - 1)   # smaller problem

# factorial(3)
#   = 3 * factorial(2)
#       = 2 * factorial(1)
#           = 1                  <- base case
#       = 2 * 1 = 2
#   = 3 * 2 = 6
`},
after:R`<p>Two rules: there must be a <b>base case</b> that does not recurse, and every recursive call must move <b>closer</b> to it. Break either rule and you get infinite recursion, which ends in <code>RecursionError</code> (Python) or a stack overflow crash (C++).</p>`},
{h:'Backtracking: choose, explore, un-choose',body:R`<p>Many searches build an answer one decision at a time. At each level: make a choice, recurse to make the remaining choices, then <b>undo</b> the choice so the next option starts from a clean state. Drawing the <b>recursion tree</b> (each node a partial answer, each edge a choice) is the best way to understand any backtracking problem.</p>`},
{h:'Inner functions and lambdas',body:R`<p>In the pattern, <code>go</code> is defined <i>inside</i> <code>subsets</code>, so it can see <code>items</code>, <code>out</code> and <code>cur</code> without passing them. In C++ the same is done with a lambda that <b>captures by reference</b>, <code>[&amp;]</code>. A lambda cannot call itself by name, so we either store it in a <code>std::function</code> (simple, a little slower) or pass it to itself as <code>self</code> using <code>auto&amp;&amp; self</code> (fast; seen in the N-Queens skeleton).</p>`}
],
math:[
{h:'How big are these search spaces?',body:R`<p>A set of \(n\) items has \(2^n\) subsets (each item is in or out). There are \(n!\) orderings. Choosing \(k\) of \(n\) gives \(\binom{n}{k} = \frac{n!}{k!(n-k)!}\). Since \(2^{20} \approx 10^6\) and \(10! \approx 3.6\times 10^6\), plain backtracking works up to about \(n = 20\) for subsets and \(n = 10\) for permutations. Beyond that you need pruning or dynamic programming.</p>`}
]};

L.c09={needs:['c04','c08'],
learn:[
{h:'Merge sort in pictures',body:R`<p>Split the array in half, sort each half recursively, then <b>merge</b>: repeatedly take the smaller front element of the two sorted halves. <code>[5, 2, 4, 1]</code> → <code>[5, 2] [4, 1]</code> → <code>[2, 5] [1, 4]</code> → merge → <code>[1, 2, 4, 5]</code>.</p>`},
{h:'Partition for quicksort',body:R`<p>Pick a pivot. Rearrange so everything smaller is on its left and everything larger on its right; the pivot is now in its final place. Recurse on both sides. Lomuto’s version keeps a boundary <code>i</code>: scan <code>j</code> across the range, and whenever <code>a[j] &lt; pivot</code>, swap it to position <code>i</code> and advance <code>i</code>. A random pivot avoids the O(n²) worst case on already-sorted input.</p>`},
{h:'The binary search invariant',body:R`<p>Keep the statement “the answer is in <code>[lo, hi]</code>” true at every step. Check <code>mid</code>: if <code>a[mid] &lt; x</code>, the answer is to the right, so <code>lo = mid + 1</code>; otherwise it might be <code>mid</code> or to its left, so <code>hi = mid</code>. When <code>lo == hi</code>, that is the answer. In C++ write <code>mid = lo + (hi - lo) / 2</code> to avoid overflow for huge indices.</p>`},
{h:'std::tie for multi-key comparisons',body:R`<p><code>std::tie(a, b)</code> builds a temporary tuple of references. Tuples compare lexicographically, so <code>std::tie(x.battery, x.id) &lt; std::tie(y.battery, y.id)</code> compares battery first, then id. It is the C++ version of Python’s “return a tuple from key”.</p>`}
],
math:[
{h:'Merge sort is n log n',body:R`<p>Let \(T(n)\) be the time to sort \(n\) items. Two half-size sorts plus a linear merge:</p>
\[ T(n) = 2\,T(n/2) + cn. \]
<p>Draw the recursion tree: level \(k\) has \(2^k\) subproblems of size \(n/2^k\), costing \(cn\) in total. There are \(\log_2 n\) levels, so \(T(n) = cn\log_2 n = O(n\log n)\).</p>
<p>Any sort that only compares elements needs \(\Omega(n \log n)\) comparisons: there are \(n!\) possible orderings and each comparison at best halves them, so you need \(\log_2 n! \approx n\log_2 n\) comparisons.</p>`},
{h:'Binary search is log n',body:R`<p>Each step halves the interval: after \(k\) steps it has size \(n/2^k\). It reaches size 1 when \(k = \lceil\log_2 n\rceil\). For a billion elements, that is 30 steps.</p>`}
]};

L.c10={needs:['g4','g5','c08'],
learn:[
{h:'Tree vocabulary',body:R`<p>A <b>tree</b> has one <b>root</b>. Every other node has exactly one <b>parent</b>. Nodes with no children are <b>leaves</b>. The <b>depth</b> of a node is its distance from the root; the <b>height</b> of the tree is the largest depth. In a <b>binary</b> tree each node has at most a left and a right child.</p>`},
{h:'Recursion on trees',body:R`<p>Almost every tree function has the same shape: handle the empty tree (<code>None</code>/<code>nullptr</code>), recurse on the children, combine. For height: empty has height 0; otherwise 1 plus the taller child. Ask yourself: “if my children gave me their answers, how do I build mine?”</p>`},
{h:'Optional children and smart pointers',body:R`<p>In Python, <code>Optional["TreeNode"]</code> means “a TreeNode or None”. In C++, each node <b>owns</b> its children through <code>std::unique_ptr&lt;TreeNode&gt;</code>, so deleting the root deletes the whole tree automatically. Functions that only <i>look</i> at a node take a raw pointer <code>const TreeNode*</code> obtained with <code>.get()</code>: a raw pointer means “I use it, I do not own it”.</p>`},
{h:'The binary search tree rule',body:R`<p>In a BST, everything in a node’s left subtree is smaller and everything in its right subtree is larger. Searching walks one path down: go left if smaller, right if larger. An in-order traversal (left, node, right) visits keys in sorted order.</p>`},
{h:'Tries and k-d trees',body:R`<p>A <b>trie</b> stores strings by their letters: each edge is one character, so all words with the same prefix share a path. A <b>k-d tree</b> stores points: the root splits space by x, its children by y, their children by x again, and so on. Nearest-neighbour search can skip whole half-planes that are farther away than the best point found so far.</p>`}
],
math:[
{h:'Height decides speed',body:R`<p>A binary tree of height \(h\) holds at most \(2^h - 1\) nodes, so a tree with \(n\) nodes has height at least \(\log_2(n+1)\). BST operations take \(O(h)\): \(O(\log n)\) when balanced, but \(O(n)\) if you insert sorted keys into a plain BST (it becomes a linked list). <code>std::map</code> uses a red-black tree, which rebalances to keep \(h \le 2\log_2(n+1)\).</p>`}
]};

L.c11={needs:['c10'],
learn:[
{h:'A heap stored in an array',body:R`<p>A binary heap is a complete binary tree stored level by level in an array, with no pointers at all. For index <code>i</code>, the children are <code>2i+1</code> and <code>2i+2</code>, and the parent is <code>(i−1)//2</code>. The <b>heap property</b>: every parent is ≤ its children, so the minimum is always at index 0.</p>
<ul><li><b>Push:</b> append at the end, then <b>sift up</b>: swap with the parent while smaller.</li>
<li><b>Pop:</b> take index 0, move the last element there, then <b>sift down</b>: swap with the smaller child while bigger.</li></ul>`},
{h:'Using the library heaps',body:R`<p>Python’s <code>heapq</code> works on a plain list: <code>heappush(h, x)</code>, <code>heappop(h)</code>, <code>h[0]</code> to peek. It is a min-heap. Push <code>-x</code> for a max-heap. Push tuples to order by priority; add a counter as the second element so equal priorities never compare the third element (which might not be comparable).</p>
<p>C++’s <code>std::priority_queue&lt;T&gt;</code> is a <b>max</b>-heap with <code>push</code>, <code>top</code>, <code>pop</code>. For a min-heap write <code>std::priority_queue&lt;T, std::vector&lt;T&gt;, std::greater&lt;T&gt;&gt;</code>: the second argument is the storage, the third the comparison.</p>`},
{h:'Event-driven simulation',body:R`<p>Instead of stepping time in fixed ticks, keep a priority queue of future <b>events</b> ordered by time. Repeatedly pop the earliest event, jump the clock to it, update the state, and push any events it causes. Nothing is computed for the quiet time in between. Network simulators and many multi-agent simulators work this way.</p>`}
],
math:[
{h:'Costs',body:R`<p>A complete binary tree with \(n\) nodes has height \(\lfloor\log_2 n\rfloor\), so push and pop are \(O(\log n)\). Building a heap by sifting down from the last parent to the root is only \(O(n)\): about \(n/2^{k+1}\) nodes sit at height \(k\) and each costs \(O(k)\), and \(\sum_k k/2^{k+1} = 1\).</p>`},
{h:'Random arrivals',body:R`<p>If robots arrive independently at an average rate \(\lambda\) per minute, the gaps between arrivals follow the <b>exponential distribution</b> with density \(f(t) = \lambda e^{-\lambda t}\) and mean \(1/\lambda\). <code>random.expovariate(lam)</code> samples it. Queueing theory predicts that a single server with service rate \(\mu \gt \lambda\) has average wait \(\frac{\lambda}{\mu(\mu-\lambda)}\) for exponential service; compare your simulation against such formulas.</p>`}
]};

L.c12={needs:['c07'],
learn:[
{h:'Graphs and how to store them',body:R`<p>A <b>graph</b> is a set of <b>nodes</b> (vertices) joined by <b>edges</b>. Edges can be directed (one-way) or undirected, weighted or not. Roads, task dependencies, social networks and grid maps are all graphs.</p>
<ul><li><b>Adjacency list:</b> for each node, a list of neighbours. Memory O(V + E). Use this almost always.</li>
<li><b>Adjacency matrix:</b> a V×V table of 0/1. Memory O(V²). Only for small, dense graphs.</li></ul>`,
code:{py:R`
from collections import defaultdict
edges = [(0, 1), (0, 2), (1, 2), (2, 3)]
adj = defaultdict(list)
for u, v in edges:
    adj[u].append(v)
    adj[v].append(u)          # undirected: both directions
`,cpp:R`
#include <vector>
int main() {
    int n = 4;
    std::vector<std::vector<int>> adj(n);
    for (auto [u, v] : std::vector<std::pair<int,int>>{{0,1},{0,2},{1,2},{2,3}}) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
}
`}},
{h:'BFS and DFS',body:R`<p><b>BFS</b> explores in rings: all nodes at distance 1, then 2, and so on, using a queue. <b>DFS</b> goes as deep as possible along one path, then backs up, using a stack or recursion. BFS finds shortest paths when all edges cost the same; DFS is natural for cycles, components and orderings. Both visit each node and edge once: O(V + E).</p>`},
{h:'Union-Find',body:R`<p>Union-Find (Disjoint Set Union) keeps groups of nodes. Each group is a tree; its root is the group’s name. <code>find(x)</code> walks up to the root. <code>unite(a, b)</code> hangs one root under the other. Two tricks make it nearly O(1): <b>path compression</b> (point every node on the walk directly to the root) and <b>union by size</b> (hang the smaller tree under the larger).</p>`}
],
math:[
{h:'Why BFS gives shortest paths',body:R`<p>BFS processes nodes in order of distance. Proof sketch by induction: all nodes at distance \(d\) are discovered before any node at distance \(d+1\). A node at distance \(d+1\) has a neighbour at distance \(d\), which was dequeued earlier and discovered it first. So its recorded distance is exactly \(d+1\).</p>`},
{h:'Topological order exists iff no cycle',body:R`<p>A directed graph can be ordered so every edge points forward exactly when it has no directed cycle (it is a DAG). If there is a cycle \(a \to b \to \dots \to a\), then \(a\) would have to come before itself. Kahn’s algorithm detects this: if nodes remain with in-degree \(\gt 0\) when the queue empties, they lie on a cycle.</p>`}
]};

L.c13={needs:['c11','c12'],
learn:[
{h:'Dijkstra step by step',body:R`<p>Keep a best-known distance for every node (start: 0, others: ∞) and a priority queue of <code>(distance, node)</code>. Repeatedly pop the closest node. Its distance is now final. For each neighbour, if going through this node is shorter, <b>relax</b>: update the neighbour’s distance and push it. The queue may hold stale copies of a node with old, larger distances; skip those when popped (“lazy deletion”).</p>`},
{h:'A*: Dijkstra with a sense of direction',body:R`<p>Dijkstra expands in circles around the start, wasting effort behind it. A* orders the queue by \(f(n) = g(n) + h(n)\): the cost so far plus an estimate of the cost remaining. Nodes in the direction of the goal look cheaper and are expanded first. With \(h = 0\), A* is exactly Dijkstra.</p>`},
{h:'Planning in space and time',body:R`<p>For several robots, a state is no longer just a cell but <code>(row, col, time)</code>. “Wait in place” becomes a legal move. A <b>reservation table</b> records which (cell, time) pairs earlier robots already use. This turns multi-robot coordination into ordinary search on a bigger graph.</p>`}
],
math:[
{h:'Heuristics that keep A* optimal',body:R`<p>A heuristic is <b>admissible</b> if it never overestimates: \(h(n) \le h^*(n)\), the true remaining cost. It is <b>consistent</b> if for every edge \(n \to n'\) with cost \(c\), \(h(n) \le c + h(n')\) (a triangle inequality). With a consistent heuristic, A* never needs to reopen a node and returns an optimal path.</p>`},
{h:'Grid distances',body:R`<p>Let \(dx, dy\) be the absolute differences in columns and rows.</p>
<ul><li>4-connected moves: <b>Manhattan</b> \(h = dx + dy\).</li>
<li>8-connected with diagonal cost \(\sqrt{2}\): take \(\min(dx, dy)\) diagonal steps and the rest straight, giving the <b>octile</b> distance \(h = (dx + dy) + (\sqrt{2} - 2)\min(dx, dy)\).</li>
<li>Any-angle motion: <b>Euclidean</b> \(h = \sqrt{dx^2 + dy^2}\).</li></ul>
<p>Each is the exact cost on an empty grid of its type, so each is admissible and consistent there.</p>`},
{h:'Running times',body:R`<p>Dijkstra with a binary heap: \(O((V + E)\log V)\). Bellman–Ford relaxes every edge \(V-1\) times: \(O(VE)\); \(V-1\) rounds suffice because a shortest path without cycles has at most \(V-1\) edges, and a change in round \(V\) proves a negative cycle. Floyd–Warshall: \(O(V^3)\) using \(d_{ij} \leftarrow \min(d_{ij}, d_{ik} + d_{kj})\) with \(k\) as the outer loop.</p>`}
]};

L.c14={needs:['c08'],
learn:[
{h:'From recursion to DP',body:R`<p>The naive recursive Fibonacci recomputes the same values many times: <code>fib(5)</code> calls <code>fib(3)</code> twice and <code>fib(2)</code> three times. <b>Memoisation</b> stores each answer the first time and reuses it. In Python, the <code>@functools.cache</code> <b>decorator</b> does this for you. A decorator is a line starting with <code>@</code> that wraps the function below it with extra behaviour.</p>`,
code:{py:R`
from functools import cache

@cache                        # remember every result by its arguments
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(200))               # instant

# bottom-up: fill a table from small to large, no recursion
def fib_table(n: int) -> int:
    dp = [0, 1] + [0] * max(0, n - 1)
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
`}},
{h:'A recipe for every DP problem',body:R`<ol><li>Write the <b>state</b> in words: “<code>dp[a]</code> = fewest coins to make amount a”.</li>
<li>Write the <b>transition</b>: the last decision you could have made, and what state it came from.</li>
<li>Write the <b>base cases</b>.</li>
<li>Choose a fill <b>order</b> so every state’s dependencies are already filled.</li>
<li>If you need the actual solution (not just its value), store or recompute the choice at each state and walk back from the end.</li></ol>`},
{h:'Bitmasks as sets',body:R`<p>For TSP, a set of visited cities is stored as an integer: bit \(i\) is 1 if city \(i\) is visited. <code>mask &amp; (1 &lt;&lt; i)</code> tests membership, <code>mask | (1 &lt;&lt; i)</code> adds city i. <code>1 &lt;&lt; n</code> is \(2^n\). This lets a whole set act as an array index.</p>`}
],
math:[
{h:'Optimal substructure',body:R`<p>DP works when an optimal solution is built from optimal solutions to subproblems. For coin change: if the best way to make amount \(a\) uses coin \(c\) last, the rest must be the best way to make \(a - c\). Hence</p>
\[ dp[a] = 1 + \min_{c \le a} dp[a - c], \qquad dp[0] = 0. \]
<p>This is Bellman’s <b>principle of optimality</b>. The same equation, with probabilities and rewards, is the Bellman equation of reinforcement learning in Chapter 22.</p>`},
{h:'Recurrences in this chapter',body:R`<p><b>LCS</b> of prefixes \(a_{1..i}\), \(b_{1..j}\):</p>
\[ L_{i,j} = \begin{cases} L_{i-1,j-1} + 1 & a_i = b_j \\ \max(L_{i-1,j},\,L_{i,j-1}) & \text{otherwise} \end{cases} \]
<p><b>0/1 knapsack</b>, best value with the first \(i\) items and capacity \(w\):</p>
\[ K_{i,w} = \max\big(K_{i-1,w},\ v_i + K_{i-1,w-w_i}\big). \]
<p>In the 1D version, row \(i\) overwrites row \(i-1\); iterating \(w\) downward guarantees \(K_{w - w_i}\) is still the old row’s value, so each item is used at most once.</p>
<p><b>Held–Karp TSP:</b> \(D[S][j] = \min_{k \in S\setminus\{j\}} D[S\setminus\{j\}][k] + d_{kj}\), with \(O(2^n n)\) states and \(O(n)\) work each.</p>`}
]};
})();
