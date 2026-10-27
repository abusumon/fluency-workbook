(function(){
const R=String.raw;
window.BOOK.chapters.push(
/* ================= PART 0 · GROUND SCHOOL ================= */
{id:'g1',part:'P0',n:'0.1',title:'How Code Runs',time:'3 days',
goal:'Know exactly what happens between typing code and seeing output, in both languages.',
learn:[
{h:'Interpreted versus compiled',body:R`<p>A computer only runs machine instructions. Your code has to be translated first, and the two languages do this differently.</p>
<ul><li><b>Python is interpreted.</b> You run <code>python hello.py</code> and the interpreter reads your file and executes it line by line. Errors appear only when Python reaches the broken line.</li>
<li><b>C++ is compiled.</b> You first run a compiler, <code>g++ hello.cpp -o hello</code>. It checks the whole file and turns it into a program file called <code>hello</code>. Then you run that program with <code>./hello</code>. Many errors are caught before the program ever runs.</li></ul>
<p>This is why C++ is fast (translated once, ahead of time) and why Python is quick to experiment with (no compile step).</p>`},
{h:'Your first program, line by line',body:R`<p>Type both versions. Do not copy them.</p>`,
code:{py:R`
# hello.py
name = input("What is your name? ")
print("Hello,", name)
`,cpp:R`
// hello.cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    std::cout << "What is your name? ";
    std::cin >> name;
    std::cout << "Hello, " << name << '\n';
    return 0;
}
`},
after:R`<p><b>Python.</b> <code>#</code> starts a comment, which Python ignores. <code>input(...)</code> shows a message, waits for you to type, and gives back the text. <code>name = ...</code> stores that text in a variable called <code>name</code>. <code>print</code> writes values to the screen, separated by spaces.</p>
<p><b>C++.</b> <code>//</code> starts a comment. <code>#include &lt;iostream&gt;</code> pulls in the input/output library and <code>&lt;string&gt;</code> the text type. Every C++ program starts in a function called <code>main</code>. <code>std::string name;</code> creates an empty text variable. <code>std::cout &lt;&lt;</code> sends text to the screen (“console out”); <code>std::cin &gt;&gt;</code> reads one word from the keyboard into the variable. <code>'\n'</code> is the newline character. <code>return 0;</code> tells the operating system the program finished successfully. <code>std::</code> means “from the standard library”.</p>
<p>Compile and run: <code>g++ -std=c++20 -Wall -Wextra hello.cpp -o hello</code>, then <code>./hello</code> (on Windows: <code>hello.exe</code>). <code>-Wall -Wextra</code> turns on warnings. Always use them.</p>`},
{h:'Variables and types',body:R`<p>A variable is a named box holding a value. Every value has a <b>type</b> that decides what you can do with it.</p>
<ul><li><code>int</code>: whole numbers. <code>float</code> (Python) / <code>double</code> (C++): decimals. <code>bool</code>: <code>True</code>/<code>False</code> (C++: <code>true</code>/<code>false</code>). <code>str</code> / <code>std::string</code>: text.</li>
<li><b>Python is dynamically typed:</b> the box can hold any type and can change. <code>x = 5</code> then <code>x = "hi"</code> is allowed.</li>
<li><b>C++ is statically typed:</b> you declare the type once and it never changes. <code>int x = 5;</code> then <code>x = "hi";</code> is a compile error. <code>auto x = 5;</code> asks the compiler to work out the type for you.</li></ul>`,
code:{py:R`
age = 21            # int
height = 1.72       # float
is_student = True   # bool
print(type(age), type(height), type(is_student))
print(7 / 2, 7 // 2, 7 % 2)   # 3.5  3  1
`,cpp:R`
#include <iostream>
int main() {
    int age = 21;
    double height = 1.72;
    bool is_student = true;
    std::cout << 7 / 2 << ' ' << 7.0 / 2 << ' ' << 7 % 2 << '\n';   // 3 3.5 1
}
`},
after:R`<p>Watch the division. In Python <code>/</code> always gives a decimal and <code>//</code> gives the whole-number part. In C++ dividing two <code>int</code>s throws away the decimal part, so <code>7 / 2</code> is <code>3</code>. Write <code>7.0 / 2</code> to get <code>3.5</code>. <code>%</code> is the remainder in both. Integer overflow also exists in C++: an <code>int</code> holds up to about 2.1 billion, so use <code>long long</code> for bigger numbers.</p>`}
],
primer:R`<ul><li>Python runs your file directly; C++ is compiled into a program first.</li><li>Every C++ program begins in <code>main()</code>.</li><li>Python types live with values; C++ types live with variables.</li><li><code>int / int</code> truncates in C++.</li></ul>`,
drill:'Compile and run a C++ program from the terminal from memory, with warnings on, in under <b>2 minutes</b>.',
ex:[
{t:'Greeting with age',d:1,q:R`<p>Ask for a name and a birth year. Print “Hello NAME, you are about N years old.” In Python, <code>input</code> returns text: convert it with <code>int(...)</code>. In C++, read into an <code>int</code> directly.</p>`,h:['Python: <code>year = int(input("Year? "))</code>.']},
{t:'Temperature converter',d:1,q:R`<p>Read a Celsius temperature and print Fahrenheit using F = C × 9/5 + 32. Try 37. In C++, try it once with <code>9/5</code> and once with <code>9.0/5</code> and explain the difference.</p>`},
{t:'Swap two variables',d:1,q:R`<p>Swap the values of <code>a</code> and <code>b</code> three ways: with a temporary variable, with Python’s <code>a, b = b, a</code>, and in C++ with <code>std::swap(a, b)</code> from <code>&lt;utility&gt;</code>.</p>`},
{t:'Division table',d:1,q:R`<p>For every pair a, b in −3..3 (b ≠ 0) print <code>a / b</code>, <code>a // b</code> and <code>a % b</code> in Python, and <code>a / b</code>, <code>a % b</code> in C++. Note where negative numbers behave differently between the languages.</p>`,h:['Python <code>//</code> rounds down (toward −∞). C++ integer division rounds toward zero.']},
{t:'See an overflow',d:2,q:R`<p>In C++, start with <code>int x = 2'000'000'000;</code> and add 1 billion. Print the result. Then do the same with <code>long long</code>. Then try the same in Python and explain why Python never overflows.</p>`},
{t:'Read an error message',d:1,q:R`<p>Make four deliberate mistakes in your C++ hello program: forget a semicolon, misspell <code>cout</code>, remove the <code>#include &lt;string&gt;</code>, and assign text to an <code>int</code>. Compile each and copy the first line of each error into a comment, with your own explanation. Do the same for two Python mistakes.</p>`}
]},

{id:'g2',part:'P0',n:'0.2',title:'Functions, assert and Testing',time:'4 days',
goal:'Write functions that return values, and prove they work with assert.',
learn:[
{h:'What a function is',body:R`<p>A function is a named, reusable piece of code. It takes <b>inputs</b> (parameters), does some work, and gives back an <b>output</b> (the return value). Functions let you name an idea once and use it many times.</p>`,
code:{py:R`
def area(width: float, height: float) -> float:
    """Return the area of a rectangle."""
    return width * height

a = area(3.0, 4.0)     # a is 12.0
print(a)
`,cpp:R`
#include <iostream>

double area(double width, double height) {
    return width * height;
}

int main() {
    double a = area(3.0, 4.0);
    std::cout << a << '\n';
}
`},
after:R`<p><b>Python.</b> <code>def</code> starts a function. <code>width: float</code> is a <b>type hint</b>: it documents the expected type, but Python does not enforce it. <code>-&gt; float</code> documents the return type. The triple-quoted string is a <b>docstring</b> that explains the function. <code>return</code> ends the function and hands back a value.</p>
<p><b>C++.</b> The return type comes first (<code>double</code>), then the name, then typed parameters. Here the types are enforced by the compiler. A function that returns nothing uses <code>void</code>. A function must be declared before it is used, which is why <code>area</code> is above <code>main</code>.</p>`},
{h:'return is not print',body:R`<p>This is the most common beginner confusion. <code>print</code> shows text to a human. <code>return</code> gives a value back to the code that called the function, so it can be stored and used. A function with no <code>return</code> gives back <code>None</code> in Python.</p>`,
code:{py:R`
def add_print(a, b):
    print(a + b)        # shows 5, returns None

def add_return(a, b):
    return a + b        # returns 5, shows nothing

x = add_print(2, 3)     # x is None
y = add_return(2, 3)    # y is 5
print(y * 10)           # 50
`}},
{h:'Scope: where a variable lives',body:R`<p>Variables created inside a function are <b>local</b>: they exist only while the function runs and are invisible outside it. Parameters are local too. This keeps functions independent. Avoid changing global variables inside functions; pass values in and return results out.</p>`},
{h:'What assert does',body:R`<p><code>assert condition</code> means “this must be true here”. If the condition is true, nothing happens and the program continues. If it is false, the program <b>stops immediately</b> with an error that points to that line.</p>
<p>We use it to write <b>tests</b>: small checks that a function gives the right answer for inputs where we already know the answer. When you later change the function, re-running the asserts tells you at once if you broke something.</p>`,
code:{py:R`
def area(width, height):
    return width * height

assert area(3, 4) == 12          # passes silently
assert area(0, 5) == 0           # passes silently
assert area(2, 2) == 5, "2x2 should be 4"   # fails:
# AssertionError: 2x2 should be 4
print("all tests passed")        # never reached
`,cpp:R`
#include <cassert>
#include <iostream>

int area(int w, int h) { return w * h; }

int main() {
    assert(area(3, 4) == 12);    // passes
    assert(area(2, 2) == 5);     // fails, program aborts:
    // Assertion 'area(2, 2) == 5' failed.
    std::cout << "all tests passed\n";
}
`},
after:R`<p><code>==</code> compares two values and gives <code>True</code> or <code>False</code>; a single <code>=</code> assigns. The text after the comma in Python is an optional message shown on failure. In C++ include <code>&lt;cassert&gt;</code>. Note: C++ removes asserts when compiled with <code>-DNDEBUG</code>, and Python removes them with <code>python -O</code>, so never put real work inside an assert.</p>
<p><b>Comparing decimals:</b> <code>0.1 + 0.2 == 0.3</code> is <code>False</code> because decimals are stored approximately. Use <code>math.isclose(a, b)</code> in Python or <code>std::abs(a - b) &lt; 1e-9</code> in C++.</p>`},
{h:'Test first, then write',body:R`<p>A good habit: before writing a function, write 3 asserts. One normal case, one edge case (empty input, zero, one item), and one tricky case. Then write the function until all three pass. Later you will use <code>pytest</code>, which finds functions named <code>test_...</code> and runs their asserts for you.</p>`,
code:{py:R`
# test_area.py   -> run with:  pytest test_area.py
from geometry import area

def test_normal():
    assert area(3, 4) == 12

def test_zero():
    assert area(0, 4) == 0
`}}
],
primer:R`<ul><li>Functions take parameters and <code>return</code> a value; printing is not returning.</li><li>Local variables disappear when the function ends.</li><li><code>assert x</code> stops the program if <code>x</code> is false. Use it to test.</li><li>Compare floats with a tolerance.</li></ul>`,
drill:'Write a function plus three asserts (normal, edge, tricky) in either language in under <b>4 minutes</b>.',
ex:[
{t:'Max of three',d:1,q:R`<p>Write <code>max3(a, b, c)</code> without using the built-in <code>max</code>. Write at least four asserts, including all three equal and negative numbers.</p>`},
{t:'Is it a leap year?',d:1,q:R`<p>A year is a leap year if divisible by 4, except centuries, which must be divisible by 400. Write <code>is_leap(year) -&gt; bool</code> and asserts for 2024, 2023, 1900, 2000.</p>`},
{t:'Fix the print bug',d:1,q:R`<p>This code prints <code>None</code>. Explain why in a comment and fix it.</p><pre style="font-family:var(--f-code);font-size:.82rem;background:var(--bg);padding:10px;border-radius:8px">def double(x):
    print(x * 2)

result = double(5)
print(result + 1)</pre>`},
{t:'Default arguments',d:1,q:R`<p>Write <code>greet(name, greeting="Hello")</code> returning a string. Test both <code>greet("Sumon")</code> and <code>greet("Sumon", "Assalamu alaikum")</code>. In C++, use a default parameter <code>std::string greeting = "Hello"</code>.</p>`},
{t:'Float comparison',d:2,q:R`<p>Write <code>approx_equal(a, b, tol=1e-9)</code>. Show with asserts that <code>0.1 + 0.2 == 0.3</code> is false but <code>approx_equal(0.1 + 0.2, 0.3)</code> is true. Write the C++ version with <code>std::abs</code> from <code>&lt;cmath&gt;</code>.</p>`},
{t:'Your first pytest file',d:2,q:R`<p>Put three functions (<code>max3</code>, <code>is_leap</code>, <code>approx_equal</code>) in <code>mylib.py</code>. Put tests in <code>test_mylib.py</code>. Install pytest (<code>pip install pytest</code>) and run it. Break one function on purpose and read the failure report.</p>`},
{t:'Overloading in C++',d:2,q:R`<p>C++ allows two functions with the same name if their parameter types differ. Write <code>area(double side)</code> for a square and <code>area(double w, double h)</code> for a rectangle, and test both with <code>assert</code>.</p>`}
]},

{id:'g3',part:'P0',n:'0.3',title:'Strings, Lists and Dictionaries',time:'4 days',
goal:'Store many values, loop over them, and look things up by key.',
learn:[
{h:'Lists and vectors: ordered collections',body:R`<p>A list (Python) or <code>std::vector</code> (C++) holds many values in order. Each value has an <b>index</b> starting at 0.</p>`,
code:{py:R`
scores = [70, 85, 92]
scores.append(60)          # [70, 85, 92, 60]
print(scores[0], scores[-1])   # 70 60   (-1 is the last item)
print(len(scores))         # 4
print(scores[1:3])         # [85, 92]  slice: from 1 up to, not including, 3
for s in scores:           # visit each value
    print(s)
for i, s in enumerate(scores):   # index and value together
    print(i, s)
`,cpp:R`
#include <iostream>
#include <vector>

int main() {
    std::vector<int> scores = {70, 85, 92};
    scores.push_back(60);
    std::cout << scores[0] << ' ' << scores.back() << '\n';
    std::cout << scores.size() << '\n';
    for (int s : scores)               // range-for: visit each value
        std::cout << s << '\n';
    for (std::size_t i = 0; i < scores.size(); ++i)
        std::cout << i << ' ' << scores[i] << '\n';
}
`},
after:R`<p><code>std::vector&lt;int&gt;</code> reads “a vector of ints”. The <code>&lt;int&gt;</code> part is a <b>template argument</b> telling the vector what it stores. <code>push_back</code> adds to the end. <code>std::size_t</code> is the unsigned integer type used for sizes. Accessing an index that does not exist crashes Python with <code>IndexError</code>, but in C++ <code>v[i]</code> silently reads garbage. Use <code>v.at(i)</code> while learning: it checks the index.</p>`},
{h:'Strings',body:R`<p>A string is a sequence of characters. It can be indexed and sliced like a list. In Python strings are <b>immutable</b>: methods return a new string. In C++ <code>std::string</code> can be changed in place.</p>`,
code:{py:R`
s = "Rover One"
print(s.lower(), s.upper(), s.split())   # 'rover one' 'ROVER ONE' ['Rover', 'One']
print(s[0], s[-3:], len(s))              # 'R' 'One' 9
print(f"{s} has {len(s)} characters")    # f-string: values inside {}
words = ["a", "b", "c"]
print("-".join(words))                   # 'a-b-c'
`,cpp:R`
#include <iostream>
#include <string>

int main() {
    std::string s = "Rover One";
    s += "!";                         // changes s
    std::cout << s.size() << ' ' << s[0] << ' ' << s.substr(6, 3) << '\n';
    for (char c : s) std::cout << c << ' ';
}
`}},
{h:'Mutability and aliasing in Python',body:R`<p>In Python, <code>b = a</code> for a list does <b>not</b> copy it. Both names point to the same list, so changing one changes the other. Use <code>b = a.copy()</code> or <code>b = list(a)</code> for a real copy. In C++, <code>std::vector&lt;int&gt; b = a;</code> <b>does</b> copy. This difference causes many bugs when switching languages.</p>`,
code:{py:R`
a = [1, 2, 3]
b = a
b.append(4)
print(a)        # [1, 2, 3, 4]  -- a changed too!
c = a.copy()
c.append(5)
print(a)        # [1, 2, 3, 4]  -- unchanged
`}},
{h:'Dictionaries and maps: look up by key',body:R`<p>A dictionary maps <b>keys</b> to <b>values</b>, like a phone book. Lookup by key is fast no matter how big the dictionary is. A <b>set</b> is a collection of unique values with fast “is x in here?” checks.</p>`,
code:{py:R`
battery = {"rover1": 87, "rover2": 45}
battery["rover3"] = 100              # add or update
print(battery["rover1"])             # 87
print("rover9" in battery)           # False
print(battery.get("rover9", 0))      # 0 (default instead of an error)
for name, level in battery.items():
    print(name, level)

seen = set()
seen.add(3); seen.add(3)
print(len(seen))                     # 1
`,cpp:R`
#include <iostream>
#include <string>
#include <unordered_map>
#include <unordered_set>

int main() {
    std::unordered_map<std::string, int> battery = {{"rover1", 87}, {"rover2", 45}};
    battery["rover3"] = 100;
    std::cout << battery["rover1"] << '\n';
    std::cout << battery.count("rover9") << '\n';     // 0 means not present
    for (const auto& [name, level] : battery)
        std::cout << name << ' ' << level << '\n';

    std::unordered_set<int> seen;
    seen.insert(3); seen.insert(3);
    std::cout << seen.size() << '\n';                 // 1
}
`},
after:R`<p><code>const auto&amp; [name, level]</code> is C++17 “structured binding”: each map entry is a pair, and this unpacks it into two names. <code>const</code> means you promise not to change it; <code>&amp;</code> means “do not copy it” (Chapter 0.4 explains this). Warning: <code>battery["rover9"]</code> in C++ <b>creates</b> the key with value 0 if it is missing. Use <code>count</code> or <code>find</code> to check first.</p>`},
{h:'Comprehensions',body:R`<p>A comprehension builds a list or dict in one readable line. Read <code>[x * x for x in nums if x &gt; 0]</code> as “x squared, for each x in nums, keeping only positive x”.</p>`,
code:{py:R`
nums = [-2, -1, 0, 1, 2, 3]
squares = [x * x for x in nums if x > 0]          # [1, 4, 9]
lengths = {w: len(w) for w in ["go", "rover"]}    # {'go': 2, 'rover': 5}
`}}
],
primer:R`<ul><li>Lists/vectors: ordered, indexed from 0. Dicts/maps: key → value. Sets: unique values.</li><li>Python <code>b = a</code> shares a list; C++ copies a vector.</li><li>Use <code>.at(i)</code> in C++ while learning to catch bad indices.</li></ul>`,
drill:'Count word frequencies of a sentence with a dict in Python and an <code>unordered_map</code> in C++, each in under <b>5 minutes</b>.',
ex:[
{t:'Statistics of a list',d:1,q:R`<p>Write <code>mean</code>, <code>minimum</code>, <code>maximum</code> without built-ins (use a loop), and test them. Then write <code>median</code> using <code>sorted</code> / <code>std::sort</code>.</p>`},
{t:'Reverse words',d:1,q:R`<p><code>"the rover is ready"</code> → <code>"ready is rover the"</code>. Python with <code>split</code> and <code>join</code>; C++ with <code>std::istringstream</code> to read words into a vector, then print backwards.</p>`},
{t:'Palindrome check',d:1,q:R`<p>Ignore spaces and case. <code>"Never odd or even"</code> is a palindrome. Use two indices moving toward each other.</p>`},
{t:'Character counts',d:1,q:R`<p>Count each letter in a string using a dict. Print letters in alphabetical order with counts.</p>`},
{t:'The aliasing trap',d:2,q:R`<p>Create a 3×3 grid in Python with <code>[[0]*3]*3</code>, set <code>grid[0][0] = 1</code> and print it. Explain why three cells changed. Fix it with a comprehension. Then show that C++ <code>std::vector&lt;std::vector&lt;int&gt;&gt; g(3, std::vector&lt;int&gt;(3))</code> does not have this problem.</p>`},
{t:'Student grade book',d:2,q:R`<p>A dict from student name to a list of scores. Write functions to add a score, get a student’s average, and return the top student. Test each with asserts.</p>`}
]},

{id:'g4',part:'P0',n:'0.4',title:'C++ Memory: References and Pointers',time:'5 days',
goal:'Understand where values live in C++ and how to share them without copying.',
learn:[
{h:'Stack and heap',body:R`<p>Your program’s memory has two main regions.</p>
<ul><li>The <b>stack</b> holds local variables. It is very fast. Variables are destroyed automatically when the function ends.</li>
<li>The <b>heap</b> holds data whose size is decided at run time, like the contents of a <code>std::vector</code>. Someone must free it. In modern C++, objects like <code>std::vector</code> and <code>std::unique_ptr</code> free it for you automatically.</li></ul>
<p>Python hides all of this: every value lives on the heap and a garbage collector frees it.</p>`},
{h:'Pass by value copies',body:R`<p>By default, C++ <b>copies</b> arguments into a function. Changing the copy does not change the original, and copying a big vector is slow.</p>`,
code:{cpp:R`
#include <iostream>

void add_one(int x) {      // x is a copy
    x = x + 1;
}

int main() {
    int a = 5;
    add_one(a);
    std::cout << a << '\n';   // still 5
}
`}},
{h:'References: another name for the same thing',body:R`<p>A <b>reference</b>, written with <code>&amp;</code> after the type, is a second name for an existing variable. No copy is made. Changing it changes the original.</p>`,
code:{cpp:R`
#include <iostream>
#include <vector>

void add_one(int& x) {               // x refers to the caller's variable
    x = x + 1;
}

double sum(const std::vector<double>& v) {   // no copy, and we promise not to change v
    double total = 0;
    for (double x : v) total += x;
    return total;
}

int main() {
    int a = 5;
    add_one(a);
    std::cout << a << '\n';          // 6

    std::vector<double> big(1'000'000, 1.0);
    std::cout << sum(big) << '\n';   // fast: big is not copied
}
`},
after:R`<p>Rule of thumb for parameters: small things (<code>int</code>, <code>double</code>, <code>char</code>) by value; big things you only read by <code>const T&amp;</code>; things you must modify by <code>T&amp;</code>. <code>const</code> means the function cannot change it; the compiler enforces this.</p>`},
{h:'Pointers: an address in memory',body:R`<p>A <b>pointer</b> stores the memory address of a value. <code>&amp;a</code> gives the address of <code>a</code>. <code>int* p</code> declares a pointer to an int. <code>*p</code> follows the pointer to reach the value (“dereference”). <code>nullptr</code> means “points to nothing”.</p>`,
code:{cpp:R`
#include <iostream>

int main() {
    int a = 5;
    int* p = &a;          // p holds the address of a
    std::cout << p << '\n';    // some address like 0x7ffc...
    std::cout << *p << '\n';   // 5
    *p = 10;              // change a through the pointer
    std::cout << a << '\n';    // 10

    int* q = nullptr;     // points to nothing
    if (q != nullptr) std::cout << *q;   // always check before using
}
`},
after:R`<p>References versus pointers: a reference must refer to something and can never be re-pointed; a pointer can be <code>nullptr</code> and can be changed to point elsewhere. Prefer references. You need pointers for linked structures (trees, linked lists) and for optional things. Never dereference <code>nullptr</code> or a pointer to a variable that no longer exists: that is undefined behaviour and may crash or silently corrupt data.</p>`},
{h:'Owning heap memory safely',body:R`<p>Old C++ used <code>new</code> and <code>delete</code>, and forgetting <code>delete</code> leaked memory. Modern C++ uses <b>smart pointers</b> that delete automatically. <code>std::unique_ptr&lt;T&gt;</code> has exactly one owner. Ownership can be moved with <code>std::move</code> but not copied. This idea, “an object’s destructor releases what it owns”, is called <b>RAII</b> and is central to good C++.</p>`,
code:{cpp:R`
#include <iostream>
#include <memory>

struct Motor {
    int id;
    explicit Motor(int i) : id(i) { std::cout << "motor " << id << " on\n"; }
    ~Motor() { std::cout << "motor " << id << " off\n"; }     // destructor
};

int main() {
    auto m = std::make_unique<Motor>(1);     // heap object, owned by m
    std::cout << m->id << '\n';              // -> is * then .
    auto m2 = std::move(m);                  // ownership moves to m2; m is now empty
}   // m2 goes out of scope here: "motor 1 off" printed automatically
`}},
{h:'Several files and headers',body:R`<p>Real C++ projects split code into a <b>header</b> (<code>.hpp</code>, declarations: what exists) and a <b>source file</b> (<code>.cpp</code>, definitions: how it works). Other files <code>#include</code> the header. You compile all source files together.</p>`,
code:{cpp:R`
// geometry.hpp
#pragma once                      // include this header only once
double area(double w, double h);

// geometry.cpp
#include "geometry.hpp"
double area(double w, double h) { return w * h; }

// main.cpp
#include <iostream>
#include "geometry.hpp"
int main() { std::cout << area(3, 4) << '\n'; }

// build:  g++ -std=c++20 -Wall main.cpp geometry.cpp -o app
`}}
],
primer:R`<ul><li>Arguments are copied unless you use a reference.</li><li><code>const T&amp;</code> for big read-only inputs; <code>T&amp;</code> to modify.</li><li>Pointers hold addresses; check for <code>nullptr</code>.</li><li>Own heap memory with <code>std::vector</code> and <code>std::unique_ptr</code>, never raw <code>new</code>.</li></ul>`,
drill:'Explain out loud, then show in code, the difference between <code>void f(int x)</code>, <code>void f(int&amp; x)</code>, <code>void f(const int&amp; x)</code> and <code>void f(int* x)</code> in under <b>5 minutes</b>.',
ex:[
{t:'Swap by reference',d:1,q:R`<p>Write your own <code>void my_swap(int&amp; a, int&amp; b)</code> and test it. Then write a version with pointers, <code>void my_swap(int* a, int* b)</code>, and call it with <code>my_swap(&amp;x, &amp;y)</code>.</p>`},
{t:'Measure a copy',d:1,q:R`<p>Write <code>sum_by_value(std::vector&lt;double&gt; v)</code> and <code>sum_by_ref(const std::vector&lt;double&gt;&amp; v)</code>. Call each 1,000 times on a vector of 10⁶ elements and time them with <code>std::chrono</code> (see Chapter 4 pattern).</p>`},
{t:'Pointer walk',d:2,q:R`<p>Given <code>int arr[5] = {1,2,3,4,5};</code>, print every element using only a pointer <code>int* p = arr;</code> and <code>p++</code>. Print the address each time and notice they increase by <code>sizeof(int)</code>.</p>`},
{t:'Return several values',d:2,q:R`<p>Write <code>min_max(const std::vector&lt;int&gt;&amp; v)</code> three ways: two reference output parameters, returning <code>std::pair&lt;int,int&gt;</code>, and returning a small <code>struct MinMax { int lo, hi; };</code>. Which is clearest?</p>`},
{t:'Watch RAII happen',d:2,q:R`<p>Using the <code>Motor</code> struct, create motors in nested blocks <code>{ ... }</code>, inside a vector, and inside <code>unique_ptr</code>s. Predict the order of “on”/“off” messages before running.</p>`},
{t:'Split into files',d:2,q:R`<p>Move your <code>max3</code>, <code>is_leap</code> and <code>approx_equal</code> from Chapter 0.2 into <code>mylib.hpp</code>/<code>mylib.cpp</code>, put asserts in <code>test.cpp</code>, and build with one <code>g++</code> command.</p>`},
{t:'Catch a dangling reference',d:3,q:R`<p>Write a function that returns a reference to a local variable. Compile with <code>-Wall</code> and read the warning. Run with <code>-fsanitize=address -g</code> and read the report. Explain in a comment why this is undefined behaviour.</p>`}
]},

{id:'g5',part:'P0',n:'0.5',title:'Objects I: Classes and Encapsulation',time:'5 days',
goal:'Bundle data with the functions that work on it, and protect its rules.',
learn:[
{h:'Why classes exist',body:R`<p>Imagine tracking a rover: its name, position, battery and speed, and functions to move it and charge it. You could keep four separate variables and pass them all to every function. A <b>class</b> bundles the data and the functions into one new type.</p>
<ul><li>A <b>class</b> is a blueprint (the idea of “a rover”).</li>
<li>An <b>object</b> (or instance) is one thing built from it (“rover1”, “rover2”).</li>
<li><b>Attributes</b> (fields, member variables) are the data each object holds.</li>
<li><b>Methods</b> are functions that belong to the class and act on one object.</li>
<li>The <b>constructor</b> runs once when an object is created and sets up its attributes.</li></ul>
<p>This style is called <b>object-oriented programming</b> (OOP).</p>`},
{h:'Your first class',body:R`<p>Type this, then read the explanation below it line by line.</p>`,
code:{py:R`
class Rover:
    def __init__(self, name: str, battery: float = 100.0):
        self.name = name
        self.battery = battery
        self.x = 0.0

    def drive(self, distance: float) -> None:
        cost = distance * 0.5
        if cost > self.battery:
            raise ValueError("not enough battery")
        self.x += distance
        self.battery -= cost

    def __repr__(self) -> str:
        return f"Rover({self.name!r}, x={self.x}, battery={self.battery})"

r1 = Rover("Opportunity")
r2 = Rover("Spirit", battery=40)
r1.drive(10)
print(r1)      # Rover('Opportunity', x=10.0, battery=95.0)
print(r2.x)    # 0.0 -- r2 has its own data
`,cpp:R`
#include <iostream>
#include <stdexcept>
#include <string>

class Rover {
public:
    Rover(std::string name, double battery = 100.0)
        : name_(std::move(name)), battery_(battery) {}

    void drive(double distance) {
        double cost = distance * 0.5;
        if (cost > battery_) throw std::runtime_error("not enough battery");
        x_ += distance;
        battery_ -= cost;
    }

    double x() const { return x_; }
    double battery() const { return battery_; }
    const std::string& name() const { return name_; }

private:
    std::string name_;
    double battery_;
    double x_ = 0.0;
};

int main() {
    Rover r1("Opportunity");
    r1.drive(10);
    std::cout << r1.name() << ' ' << r1.x() << ' ' << r1.battery() << '\n';
}
`},
after:R`<p><b>Python, line by line.</b> <code>class Rover:</code> defines the blueprint. <code>__init__</code> is the constructor; Python calls it when you write <code>Rover("Opportunity")</code>. <code>self</code> is the object being built or used; Python passes it automatically. <code>self.name = name</code> stores data <b>on this object</b>. In <code>drive</code>, <code>self.x += distance</code> changes only this rover. <code>raise ValueError(...)</code> stops with an error if the rule is broken. <code>__repr__</code> controls how the object prints. <code>!r</code> adds quotes around the name.</p>
<p><b>C++, line by line.</b> <code>public:</code> members can be used by anyone; <code>private:</code> members only inside the class. The constructor has the class’s name and no return type. The part after the colon, <code>: name_(...), battery_(battery)</code>, is the <b>member initialiser list</b>: it sets fields before the body runs. The trailing underscore in <code>name_</code> is a common naming style for private fields. <code>double x() const</code> is a <b>getter</b>; <code>const</code> after the parentheses promises this method does not change the object. <code>throw</code> is C++’s <code>raise</code>.</p>`},
{h:'Encapsulation: protecting the rules',body:R`<p>A class should guarantee its <b>invariants</b>, rules that are always true. For the rover: battery is between 0 and 100. If anyone could write <code>r.battery = -50</code>, the rule breaks. So we hide the data and allow changes only through methods that check the rule.</p>
<ul><li>C++ enforces this with <code>private</code>.</li>
<li>Python has no true private. By convention a leading underscore, <code>self._battery</code>, means “internal, do not touch”. A <code>@property</code> lets you expose a read-only value that looks like an attribute.</li></ul>`,
code:{py:R`
class Battery:
    def __init__(self, level: float = 100.0):
        if not 0 <= level <= 100:
            raise ValueError("level must be in [0, 100]")
        self._level = level

    @property
    def level(self) -> float:        # read with b.level, no parentheses
        return self._level

    def use(self, amount: float) -> None:
        if amount < 0 or amount > self._level:
            raise ValueError("invalid amount")
        self._level -= amount

b = Battery()
b.use(30)
print(b.level)     # 70.0
# b.level = 5      # AttributeError: no setter defined
`}},
{h:'Records: dataclass and struct',body:R`<p>Sometimes an object is just a bundle of data with no rules to protect, like a 2D point. Python’s <code>@dataclass</code> writes <code>__init__</code>, <code>__repr__</code> and <code>__eq__</code> for you. In C++, a <code>struct</code> is a class whose members are public by default.</p>`,
code:{py:R`
from dataclasses import dataclass

@dataclass
class Pose:
    x: float
    y: float
    theta: float = 0.0

p = Pose(1.0, 2.0)
print(p)                     # Pose(x=1.0, y=2.0, theta=0.0)
print(p == Pose(1.0, 2.0))   # True
`,cpp:R`
struct Pose {
    double x = 0, y = 0, theta = 0;
};

Pose p{1.0, 2.0};      // theta stays 0
`}},
{h:'Static members: shared by all objects',body:R`<p>Most attributes belong to one object. A <b>class attribute</b> (Python) or <b>static member</b> (C++) is shared by all objects, for example a counter of how many rovers were made. Use them rarely.</p>`}
],
primer:R`<ul><li>Class = blueprint; object = one instance with its own data.</li><li>Constructor sets up attributes: <code>__init__</code> / same-name function with an initialiser list.</li><li><code>self</code> (Python) and the implicit <code>this</code> (C++) mean “this object”.</li><li>Hide data behind methods that enforce invariants.</li><li>Use dataclass/struct for plain data.</li></ul>`,
drill:'Write a class with a validating constructor, two methods, a getter and a print method, in both languages, in under <b>10 minutes</b> each.',
ex:[
{t:'Counter class',d:1,q:R`<p>A <code>Counter</code> with <code>increment()</code>, <code>reset()</code> and a read-only <code>value</code>. Create two counters and show they are independent with asserts.</p>`},
{t:'Rectangle',d:1,q:R`<p><code>Rectangle(width, height)</code> rejecting non-positive sizes, with <code>area()</code>, <code>perimeter()</code>, <code>scale(factor)</code> and <code>is_square()</code>. Test every method.</p>`},
{t:'Temperature with conversion',d:1,q:R`<p>Store Kelvin internally (must be ≥ 0). Provide properties/getters <code>celsius</code> and <code>fahrenheit</code>, and a <code>from_celsius</code> constructor: <code>@classmethod</code> in Python, a <code>static</code> function in C++.</p>`},
{t:'Finish the Rover',d:2,q:R`<p>Extend the Rover: 2D position and heading; <code>turn(angle)</code>; <code>drive</code> moves along the heading using sin and cos; <code>charge(amount)</code> caps at 100; a log list of every action. Write tests for each rule.</p>`,
py:R`
import math

class Rover:
    def __init__(self, name: str, battery: float = 100.0):
        # TODO: validate battery, set x, y, heading, log
        pass

    def turn(self, angle_rad: float) -> None:
        # TODO: update heading, append to log
        pass

    def drive(self, distance: float) -> None:
        # TODO: check battery, move along heading, append to log
        pass

    def charge(self, amount: float) -> None:
        # TODO: cap at 100
        pass
`},
{t:'Bank account done properly',d:2,q:R`<p>Private balance, <code>deposit</code>, <code>withdraw</code>, <code>history</code> (read-only copy of the transaction list). Rejected operations raise/throw and change nothing.</p>`},
{t:'Count instances',d:2,q:R`<p>Add a class attribute / static member that counts how many Rover objects have been created, and give each rover an automatic id from it.</p>`}
]},

{id:'g6',part:'P0',n:'0.6',title:'Objects II: Inheritance and Polymorphism',time:'5 days',
goal:'Build families of related types, and write code that works with any of them.',
learn:[
{h:'Composition: has-a',body:R`<p>Before inheritance, learn <b>composition</b>: a class that contains other objects. A rover <i>has</i> a battery, <i>has</i> wheels, <i>has</i> sensors. You build big objects out of small ones. This is the default way to reuse code.</p>`,
code:{py:R`
class Wheel:
    def __init__(self, radius: float):
        self.radius = radius

class Rover:
    def __init__(self):
        self.battery = Battery(100)               # has-a Battery (from 0.5)
        self.wheels = [Wheel(0.15) for _ in range(6)]
`}},
{h:'Inheritance: is-a',body:R`<p><b>Inheritance</b> makes a new class (the <b>subclass</b> or derived class) that starts with everything from an existing class (the <b>base</b> or parent class), then adds or changes things. Use it when the new thing truly <i>is a</i> kind of the old one: a lidar <i>is a</i> sensor.</p>
<p>A subclass can <b>override</b> a method: provide its own version with the same name. <code>super()</code> calls the parent’s version.</p>`,
code:{py:R`
class Sensor:
    def __init__(self, name: str, rate_hz: float):
        self.name = name
        self.rate_hz = rate_hz

    def read(self) -> float:
        raise NotImplementedError

    def describe(self) -> str:
        return f"{self.name} @ {self.rate_hz} Hz"

class Thermometer(Sensor):                   # Thermometer is-a Sensor
    def __init__(self, name: str):
        super().__init__(name, rate_hz=1.0)  # run Sensor's constructor

    def read(self) -> float:                 # override
        return 21.5

class Lidar(Sensor):
    def __init__(self, name: str, beams: int):
        super().__init__(name, rate_hz=10.0)
        self.beams = beams

    def read(self) -> float:
        return 3.2                           # nearest obstacle, metres

    def describe(self) -> str:               # extend parent behaviour
        return super().describe() + f", {self.beams} beams"
`},
after:R`<p><code>class Thermometer(Sensor)</code> means Thermometer inherits from Sensor. It gets <code>describe</code> for free. Its <code>read</code> replaces the parent’s. In <code>Lidar.describe</code>, <code>super().describe()</code> runs the parent’s version and adds to it.</p>`},
{h:'Polymorphism: one interface, many forms',body:R`<p>Here is the payoff. Code can work with “any sensor” without knowing which kind. When you call <code>s.read()</code>, the right version runs for that object’s actual type. This is <b>polymorphism</b>. Your control loop never needs an <code>if</code> for each sensor type, and adding a new sensor needs no changes to the loop.</p>`,
code:{py:R`
sensors: list[Sensor] = [Thermometer("temp"), Lidar("front", beams=360)]
for s in sensors:
    print(s.describe(), "->", s.read())
`,cpp:R`
#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Sensor {
public:
    explicit Sensor(std::string name) : name_(std::move(name)) {}
    virtual ~Sensor() = default;                 // always virtual in a base class
    virtual double read() const = 0;             // pure virtual: must be overridden
    virtual std::string describe() const { return name_; }
protected:
    std::string name_;                           // visible to subclasses
};

class Lidar : public Sensor {
public:
    Lidar(std::string name, int beams) : Sensor(std::move(name)), beams_(beams) {}
    double read() const override { return 3.2; }
    std::string describe() const override {
        return Sensor::describe() + " (" + std::to_string(beams_) + " beams)";
    }
private:
    int beams_;
};

int main() {
    std::vector<std::unique_ptr<Sensor>> sensors;
    sensors.push_back(std::make_unique<Lidar>("front", 360));
    for (const auto& s : sensors)
        std::cout << s->describe() << " -> " << s->read() << '\n';
}
`},
after:R`<p><b>C++ details.</b> <code>class Lidar : public Sensor</code> is inheritance. A method must be marked <code>virtual</code> in the base for overriding to work through a base pointer. <code>= 0</code> makes it <b>pure virtual</b>: Sensor becomes an <b>abstract class</b> that cannot be created on its own. <code>override</code> asks the compiler to check you really are overriding something (it catches typos). <code>protected</code> is like private but visible to subclasses. The base class needs a <code>virtual</code> destructor so deleting through a base pointer cleans up the subclass. We store <code>unique_ptr&lt;Sensor&gt;</code> because objects of different sizes cannot sit directly in one vector.</p>
<p>In Python, use <code>from abc import ABC, abstractmethod</code> to get the same “must override” check.</p>`},
{h:'Operator overloading',body:R`<p>You can teach your types to work with <code>+</code>, <code>==</code>, <code>[]</code>, printing and more. In Python you write special “dunder” (double-underscore) methods like <code>__add__</code>; in C++ you write functions named <code>operator+</code>. Use it only where the meaning is obvious, like adding vectors.</p>`,
code:{py:R`
class Vec2:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, other):          # v + w
        return Vec2(self.x + other.x, self.y + other.y)
    def __mul__(self, k):              # v * 3
        return Vec2(self.x * k, self.y * k)
    def __eq__(self, other):           # v == w
        return self.x == other.x and self.y == other.y
    def __repr__(self):
        return f"Vec2({self.x}, {self.y})"

assert Vec2(1, 2) + Vec2(3, 4) == Vec2(4, 6)
`,cpp:R`
#include <iostream>

struct Vec2 {
    double x, y;
    Vec2 operator+(const Vec2& o) const { return {x + o.x, y + o.y}; }
    Vec2 operator*(double k) const { return {x * k, y * k}; }
    bool operator==(const Vec2&) const = default;      // C++20: compare all fields
};

std::ostream& operator<<(std::ostream& os, const Vec2& v) {
    return os << "Vec2(" << v.x << ", " << v.y << ")";
}
`}},
{h:'When not to inherit',body:R`<p>Deep inheritance trees become hard to change. Prefer composition unless the is-a relationship is real and you need polymorphism. A useful test: could every piece of code that uses the base class accept the subclass without surprises? If not, do not inherit. (This is called the Liskov substitution principle.)</p>`}
],
primer:R`<ul><li>Composition (has-a) is the default; inheritance (is-a) when it is real.</li><li>Override methods; call the parent with <code>super()</code> / <code>Base::method()</code>.</li><li>C++ needs <code>virtual</code> for polymorphism, <code>override</code> for safety and a virtual destructor in bases.</li><li>Abstract classes define an interface that subclasses must fill in.</li></ul>`,
drill:'Write an abstract base class with two subclasses and a loop that uses them polymorphically, in C++, in under <b>12 minutes</b>.',
ex:[
{t:'Shape hierarchy',d:1,q:R`<p>Abstract <code>Shape</code> with <code>area()</code> and <code>perimeter()</code>; subclasses <code>Circle</code>, <code>Rectangle</code>, <code>Triangle</code>. Put them in one list and print the total area. Then add <code>Square</code> as a subclass of <code>Rectangle</code> and discuss whether that is a good idea.</p>`},
{t:'Rover sensor suite',d:2,q:R`<p>Base <code>Sensor</code> with <code>read()</code> and <code>is_healthy()</code>. Subclasses: <code>GPS</code> (returns lat, lon with noise), <code>IMU</code> (heading with drift), <code>Camera</code> (returns a small 2D list). A <code>SensorHub</code> (composition!) holds sensors and returns a dict of readings, skipping unhealthy ones.</p>`},
{t:'Controllers you can swap',d:2,q:R`<p>Abstract <code>Controller</code> with <code>command(error, dt) -&gt; float</code>. Implement <code>BangBang</code> (±1) and <code>Proportional(kp)</code>. Write one simulation function that takes any controller and drives a 1D cart to a target. Compare the two.</p>`},
{t:'Vec2 operators',d:2,q:R`<p>Complete Vec2 with <code>-</code>, scalar multiplication on both sides (<code>__rmul__</code>, and a free <code>operator*(double, Vec2)</code> in C++), <code>abs()</code>/<code>norm()</code>, printing. You will reuse this in Chapter 3.</p>`},
{t:'Use abc in Python',d:1,q:R`<p>Rewrite <code>Sensor</code> with <code>ABC</code> and <code>@abstractmethod</code>. Try to create <code>Sensor("x", 1)</code> directly and read the error. Create a subclass that forgets to implement <code>read</code> and see what happens.</p>`},
{t:'Forget override',d:2,q:R`<p>In C++, misspell an overridden method (<code>reed()</code>) without <code>override</code> and observe the wrong behaviour. Add <code>override</code> and read the compile error. Then remove <code>virtual</code> from the base and observe again.</p>`}
]},

{id:'g7',part:'P0',n:'0.7',title:'Errors, Files and Modules',time:'4 days',
goal:'Handle failures cleanly, read and write files, and split code into modules.',
learn:[
{h:'Exceptions',body:R`<p>When something goes wrong at run time (a missing file, bad input), the code <b>raises</b> (Python) or <b>throws</b> (C++) an exception. The exception travels up through the calling functions until something <b>catches</b> it. If nothing does, the program stops with an error report. This separates “normal path” code from “what if it fails” code.</p>`,
code:{py:R`
def parse_speed(text: str) -> float:
    value = float(text)              # raises ValueError for "fast"
    if value < 0:
        raise ValueError(f"speed must be >= 0, got {value}")
    return value

try:
    s = parse_speed("fast")
except ValueError as e:
    print("bad input:", e)
    s = 0.0
finally:
    print("this always runs")
`,cpp:R`
#include <iostream>
#include <stdexcept>
#include <string>

double parse_speed(const std::string& text) {
    double value = std::stod(text);          // throws std::invalid_argument
    if (value < 0) throw std::out_of_range("speed must be >= 0");
    return value;
}

int main() {
    double s = 0;
    try {
        s = parse_speed("fast");
    } catch (const std::exception& e) {      // catches all standard exceptions
        std::cout << "bad input: " << e.what() << '\n';
    }
}
`},
after:R`<p>Catch only exceptions you can actually handle, as close to the problem as makes sense. Never write a bare <code>except:</code> that silently swallows everything: it hides bugs. In C++, catch by <code>const&amp;</code>.</p>`},
{h:'Reading and writing files',body:R`<p>Python’s <code>with</code> statement opens a file and guarantees it is closed even if an error happens. C++ file streams close automatically when they go out of scope (RAII again).</p>`,
code:{py:R`
with open("log.txt", "w") as f:          # "w" write, "a" append, "r" read
    f.write("t,x,y\n")
    f.write("0.0,1.0,2.0\n")

with open("log.txt") as f:
    header = f.readline().strip()
    for line in f:                       # one line at a time
        t, x, y = map(float, line.split(","))
        print(t, x, y)
`,cpp:R`
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>

int main() {
    {
        std::ofstream out("log.txt");
        out << "t,x,y\n" << "0.0,1.0,2.0\n";
    }                                        // file closed here
    std::ifstream in("log.txt");
    if (!in) { std::cerr << "cannot open\n"; return 1; }
    std::string line;
    std::getline(in, line);                  // skip header
    while (std::getline(in, line)) {
        std::istringstream ss(line);
        std::string field;
        while (std::getline(ss, field, ',')) std::cout << std::stod(field) << ' ';
        std::cout << '\n';
    }
}
`}},
{h:'Modules and packages',body:R`<p>A <b>module</b> is just a <code>.py</code> file. <code>import geometry</code> runs <code>geometry.py</code> once and gives you its names as <code>geometry.area</code>. A <b>package</b> is a folder of modules. Code under <code>if __name__ == "__main__":</code> runs only when the file is run directly, not when it is imported, so you can put quick demos there.</p>
<p>Install third-party packages with <code>pip</code> inside a <b>virtual environment</b> so each project has its own versions: <code>python -m venv .venv</code>, activate it, then <code>pip install numpy</code>.</p>
<p>In C++ the equivalent is header files plus <b>namespaces</b>: <code>namespace rover { ... }</code> groups names so <code>rover::Battery</code> does not clash with another library’s <code>Battery</code>.</p>`,
code:{py:R`
# geometry.py
def area(w, h):
    return w * h

if __name__ == "__main__":
    print(area(3, 4))      # runs with "python geometry.py", not on import

# main.py
from geometry import area
print(area(2, 5))
`}}
],
primer:R`<ul><li>Raise/throw on failure; catch only what you can handle.</li><li>Use <code>with open(...)</code> in Python; streams close themselves in C++.</li><li>Modules are files; use a virtual environment per project.</li><li>Group C++ code in namespaces.</li></ul>`,
drill:'Read a CSV of numbers, skip bad lines with a warning, and print their mean, in either language, in under <b>8 minutes</b>.',
ex:[
{t:'Safe integer input',d:1,q:R`<p>Keep asking the user for an integer between 1 and 10 until they enter a valid one. Handle non-numbers and out-of-range values with different messages.</p>`},
{t:'Custom exception',d:2,q:R`<p>Define <code>class BatteryEmpty(Exception)</code> in Python and <code>struct BatteryEmpty : std::runtime_error</code> in C++. Raise it from your Rover and catch it in a mission loop that sends the rover back to base.</p>`},
{t:'Log writer and reader',d:1,q:R`<p>Simulate the rover driving 50 steps and write <code>t,x,y,battery</code> to a CSV. Read it back and print the maximum distance from the origin. Do it in both languages.</p>`},
{t:'Word count tool',d:1,q:R`<p>A command-line program that takes a filename (Python: <code>sys.argv[1]</code>; C++: <code>argv[1]</code> in <code>int main(int argc, char* argv[])</code>) and prints lines, words and characters, like the Unix <code>wc</code>.</p>`},
{t:'Make a package',d:2,q:R`<p>Create a folder <code>roverlib/</code> with <code>__init__.py</code>, <code>battery.py</code>, <code>rover.py</code>. Import them from a <code>main.py</code> outside the folder. Add a <code>tests/</code> folder run by pytest.</p>`},
{t:'Namespaces in C++',d:1,q:R`<p>Put your Rover code in <code>namespace rover</code> across a header and a source file. Use it from <code>main.cpp</code> with <code>rover::Rover</code>, then with a <code>using rover::Rover;</code> declaration inside <code>main</code>.</p>`}
]},

{id:'g8',part:'P0',n:'0.8',title:'Tools: Terminal, Git, Debugger',time:'4 days',
goal:'Use the tools every engineer at NVIDIA, DeepMind or on a rover team uses daily.',
learn:[
{h:'The terminal',body:R`<p>Most robotics and ML work happens in a Linux terminal (robots run Linux; so do GPU servers). On Windows, install <b>WSL2</b> with Ubuntu so you work the same way. Learn these first:</p>
<ul><li><code>pwd</code> (where am I), <code>ls</code> (list), <code>cd folder</code> (move), <code>mkdir</code>, <code>cp</code>, <code>mv</code>, <code>rm</code>.</li>
<li><code>cat file</code>, <code>less file</code>, <code>grep word file</code> (search), <code>head</code>/<code>tail</code>.</li>
<li>Arrow-up for history, Tab to autocomplete, <code>Ctrl+C</code> to stop a program.</li>
<li><code>command &gt; out.txt</code> saves output; <code>a | b</code> sends a’s output into b.</li></ul>`},
{h:'Git: saving history',body:R`<p>Git records snapshots of your project so you can go back, compare and collaborate. Every team uses it, and your GitHub profile is part of your CV.</p>`,
code:{sh:R`
# one-time setup
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# start a project
mkdir fluency && cd fluency
git init
# ... write files ...
git status                  # what changed?
git add ch01_loops.py       # stage a file for the next snapshot
git commit -m "Ch1: configurable FizzBuzz with tests"
git log --oneline           # history

# try something risky on a branch
git switch -c try-sieve
# ... edit, commit ...
git switch main
git merge try-sieve

# publish to GitHub (create the empty repo on github.com first)
git remote add origin https://github.com/<you>/fluency.git
git push -u origin main
`},
after:R`<p>Commit small, working steps with messages that say what changed. Add a <code>.gitignore</code> listing files that should not be saved (<code>.venv/</code>, <code>__pycache__/</code>, build outputs).</p>`},
{h:'Debuggers: stop and look',body:R`<p>A debugger pauses your program at a line (a <b>breakpoint</b>) so you can inspect every variable and step forward one line at a time. This is much faster than adding prints everywhere.</p>
<ul><li>Python: put <code>breakpoint()</code> on a line and run normally. Commands: <code>n</code> next line, <code>s</code> step into a function, <code>p x</code> print x, <code>c</code> continue, <code>q</code> quit.</li>
<li>C++: compile with <code>-g -O0</code>, then <code>gdb ./app</code>. Commands: <code>break main</code>, <code>run</code>, <code>next</code>, <code>step</code>, <code>print x</code>, <code>backtrace</code> (where did it crash?).</li>
<li>VS Code wraps both with a visual interface: click left of a line number to set a breakpoint, then press F5.</li></ul>`},
{h:'Building C++ projects with CMake',body:R`<p>Typing <code>g++</code> commands stops scaling at a few files. <b>CMake</b> is the standard build tool (ROS 2 and most robotics code use it).</p>`,
code:{cmake:R`
# CMakeLists.txt
cmake_minimum_required(VERSION 3.20)
project(fluency CXX)
set(CMAKE_CXX_STANDARD 20)
add_compile_options(-Wall -Wextra -Wpedantic)
add_executable(app main.cpp mylib.cpp)

# build from a terminal:
#   cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
#   cmake --build build
#   ./build/app
`}}
],
primer:R`<ul><li>Work in a Linux terminal (WSL2 on Windows).</li><li>Commit small steps to git and push to GitHub.</li><li>Use a debugger with breakpoints instead of guessing.</li><li>Build C++ with CMake.</li></ul>`,
drill:'From an empty folder: create a repo, a CMake C++ project, a Python file with tests, make two commits and push to GitHub, in under <b>15 minutes</b>.',
ex:[
{t:'Terminal scavenger hunt',d:1,q:R`<p>Without a file manager: create <code>~/fluency/{python,cpp,notes}</code>, create five empty files with <code>touch</code>, move two, find every <code>.py</code> file with <code>find</code>, and count lines in all of them with <code>wc -l</code>.</p>`},
{t:'Your practice repository',d:1,q:R`<p>Create a GitHub repo <code>fluency-workbook</code> with folders per chapter. Commit every exercise you solve from now on, with the chapter and exercise number in the message.</p>`},
{t:'Branch and merge',d:2,q:R`<p>On a branch, rewrite one exercise in a different style. Merge it back. Then create a deliberate merge conflict by editing the same line on two branches, and resolve it by hand.</p>`},
{t:'Debug a Python bug',d:1,q:R`<p>Write a function to compute the average of a list that has an off-by-one bug in its loop. Find it using only <code>breakpoint()</code> and the <code>n</code>/<code>p</code> commands, no prints.</p>`},
{t:'Debug a C++ crash',d:2,q:R`<p>Write a program that dereferences a <code>nullptr</code> inside a nested function call. Compile with <code>-g</code>, run in gdb, and use <code>backtrace</code> to find the line. Then find the same bug with <code>-fsanitize=address</code>.</p>`},
{t:'CMake project with tests',d:2,q:R`<p>Make a CMake project with a library target (<code>add_library</code>), an app, and a test executable. Run the tests with <code>ctest</code> after adding <code>enable_testing()</code> and <code>add_test</code>.</p>`}
]}
);
})();
