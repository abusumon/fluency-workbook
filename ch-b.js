window.BOOK.chapters.push(
{id:'c08',part:'P2',n:8,title:'Recursion and Backtracking',time:'6 days',
goal:'Write recursive search confidently: choose, explore, un-choose.',
primer:`<p>Every recursive function needs a <b>base case</b> and a <b>step that shrinks the problem</b>. Backtracking adds one idea: build a partial answer, try each choice, recurse, then undo the choice.</p>
<ul><li>Write the signature first: what does one call receive and return?</li>
<li>Pass the partial answer by reference and undo changes, instead of copying at every level.</li>
<li><b>Prune early:</b> stop exploring as soon as a partial answer cannot succeed.</li>
<li>Python’s default recursion limit is 1000. For deep searches use an explicit stack, or <code>sys.setrecursionlimit</code> carefully.</li></ul>`,
pattern:{py:`
def subsets(items: list[int]) -> list[list[int]]:
    out, cur = [], []
    def go(i: int) -> None:
        if i == len(items):
            out.append(cur.copy())
            return
        go(i + 1)                 # skip items[i]
        cur.append(items[i])      # choose
        go(i + 1)                 # explore
        cur.pop()                 # un-choose
    go(0)
    return out
`,cpp:`
#include <functional>
#include <vector>

std::vector<std::vector<int>> subsets(const std::vector<int>& items) {
    std::vector<std::vector<int>> out;
    std::vector<int> cur;
    std::function<void(int)> go = [&](int i) {
        if (i == (int)items.size()) { out.push_back(cur); return; }
        go(i + 1);
        cur.push_back(items[i]);
        go(i + 1);
        cur.pop_back();
    };
    go(0);
    return out;
}
`},
drill:'Write N-Queens counting (8.3) from blank in under <b>10 minutes</b>; it should return 92 for n = 8.',
ex:[
{t:'Power set by bitmask',d:1,q:`<p>Type the backtracking pattern above. Then generate the same subsets with bitmasks: for <code>mask</code> in 0..2ⁿ−1, bit i set means include item i. Assert both give the same set of subsets.</p>`,
h:['<code>if (mask &gt;&gt; i) &amp; 1</code>.']},
{t:'Permutations',d:2,q:`<p>All permutations of distinct items, using a <code>used</code> boolean array. Then handle duplicates: <code>[1,1,2]</code> gives only 3 permutations.</p>`,
h:['For duplicates: sort first, and skip item i if <code>items[i]==items[i-1]</code> and <code>i-1</code> is not used.']},
{t:'N-Queens',d:2,q:`<p>Count placements of n queens with no two attacking. Track used columns and both diagonals in sets or boolean arrays. n=8 → 92, n=10 → 724. Time n=12 in both languages.</p>`,
h:['Place one queen per row. Diagonals are indexed by <code>r+c</code> and <code>r-c+n-1</code>.'],
cpp:`
#include <vector>

int count_queens(int n) {
    std::vector<char> col(n), d1(2 * n), d2(2 * n);
    int count = 0;
    auto go = [&](auto&& self, int r) -> void {
        if (r == n) { ++count; return; }
        for (int c = 0; c < n; ++c) {
            // TODO: skip if attacked; mark; self(self, r + 1); unmark
        }
    };
    go(go, 0);
    return count;
}
`},
{t:'Sudoku solver',d:3,q:`<p>Solve a 9×9 Sudoku (0 = empty). Keep row, column and box bitmasks of used digits. Always fill the empty cell with the <b>fewest</b> candidates first and measure how much faster that is than left-to-right.</p>`,
h:['Box index = <code>(r // 3) * 3 + c // 3</code>.','Candidate mask = <code>~(row[r] | col[c] | box[b]) &amp; 0x3FE</code> for digits 1–9 as bits 1–9.']},
{t:'Combination sum',d:2,q:`<p>Distinct positive candidates, target T; list all combinations (reuse allowed) that sum to T. <code>[2,3,6,7], 7</code> → <code>[[2,2,3],[7]]</code>.</p>`,
h:['Recurse with a start index so you never go back to smaller candidates; this prevents duplicates like [3,2,2].']},
{t:'Flood fill two ways',d:1,q:`<p>Given a grid and a start cell, fill the connected region of the same colour. Recursive DFS first; then a version with an explicit stack that works on a 2000×2000 grid without crashing.</p>`},
{t:'Word search',d:2,q:`<p>Does a word exist in a letter grid as a path of adjacent cells (no cell used twice)? Mark cells as visited by temporarily overwriting them, then restore.</p>`}
]},

{id:'c09',part:'P2',n:9,title:'Sorting and Binary Search',time:'6 days',
goal:'Implement the classic sorts, and use binary search on both arrays and answers.',
primer:`<p>You will rarely write your own sort in real code, but writing merge sort and quicksort teaches divide and conquer and index discipline. Binary search is the opposite: you will write it constantly, and off-by-one errors are common.</p>
<ul><li>Use the <b>half-open</b> convention <code>[lo, hi)</code> and the loop <code>while lo &lt; hi</code>. It removes most off-by-one bugs.</li>
<li><b>lower_bound</b>: first index with <code>a[i] ≥ x</code>. <b>upper_bound</b>: first index with <code>a[i] &gt; x</code>.</li>
<li><b>Binary search on the answer:</b> if “can we do it with value v?” is monotone in v, search for the smallest v that works.</li>
<li>C++: <code>std::sort</code>, <code>std::stable_sort</code>, <code>std::lower_bound</code>. Python: <code>sorted(key=...)</code>, <code>bisect</code>.</li></ul>`,
pattern:{py:`
def lower_bound(a: list[int], x: int) -> int:
    lo, hi = 0, len(a)          # answer is in [lo, hi]
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid
    return lo
`,cpp:`
#include <vector>

int lower_bound_idx(const std::vector<int>& a, int x) {
    int lo = 0, hi = (int)a.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < x) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
`},
drill:'Write merge sort in C++ from blank in under <b>8 minutes</b> and test it on 1,000 random arrays against <code>std::sort</code>.',
ex:[
{t:'Merge sort',d:2,q:`<p>Implement top-down merge sort with one temporary buffer allocated once. Count inversions as a by-product (pairs i&lt;j with a[i]&gt;a[j]).</p>`,
h:['When you take from the right half during merge, every remaining element in the left half forms an inversion.'],
cpp:`
#include <vector>

long long merge_sort(std::vector<int>& a, std::vector<int>& tmp, int lo, int hi) {
    // sorts a[lo, hi) and returns inversion count
    if (hi - lo <= 1) return 0;
    int mid = lo + (hi - lo) / 2;
    long long inv = merge_sort(a, tmp, lo, mid) + merge_sort(a, tmp, mid, hi);
    // TODO: merge into tmp[lo, hi), count inversions, copy back
    return inv;
}
`},
{t:'Quicksort with random pivot',d:2,q:`<p>Implement in-place quicksort (Lomuto or Hoare partition) with a random pivot. Count comparisons for sorted input with and without randomisation, n = 10⁴.</p>`},
{t:'lower_bound and upper_bound',d:1,q:`<p>Type the pattern, then write <code>upper_bound</code>, and use both to count occurrences of x in a sorted array in O(log n). Compare with <code>bisect</code> and <code>std::equal_range</code> on random tests.</p>`},
{t:'Search a rotated array',d:2,q:`<p>A sorted array was rotated at an unknown pivot, e.g. <code>[4,5,6,7,0,1,2]</code>. Find a target in O(log n).</p>`,
h:['At each step one half is sorted. Check whether the target lies in that sorted half.']},
{t:'Binary search the answer',d:2,q:`<p>Packages with weights must ship in order within D days. Find the smallest ship capacity. <code>[1..10], D=5</code> → 15. Write <code>can_ship(cap)</code> first, then binary search cap between max(w) and sum(w).</p>`},
{t:'Merge intervals',d:1,q:`<p>Merge overlapping intervals. <code>[[1,3],[2,6],[8,10],[15,18]]</code> → <code>[[1,6],[8,10],[15,18]]</code>. Then: given a robot’s busy intervals, list its free slots in a day.</p>`},
{t:'Quickselect',d:2,q:`<p>Find the k-th largest element in average O(n) using the partition from 9.2. Compare speed with sorting and with <code>std::nth_element</code>.</p>`},
{t:'Sorting records with a comparator',d:1,q:`<p>A list of robots with <code>id</code>, <code>battery</code>, <code>name</code>. Sort by battery descending, then id ascending. Python with a key tuple, C++ with a lambda and with <code>std::tie</code>.</p>`,
h:['C++: <code>return std::tie(b.battery, a.id) &lt; std::tie(a.battery, b.id);</code> — note the swapped a/b for descending battery.']}
]},

{id:'c10',part:'P2',n:10,title:'Trees and Tries',time:'7 days',
goal:'Traverse, build and query trees recursively and iteratively.',
primer:`<p>Most tree problems are one recursive function that asks: “if I knew the answer for my left and right children, what is mine?” Write that sentence before coding.</p>
<ul><li>Depth-first: pre-order (node first), in-order (BST gives sorted order), post-order (children first, good for heights and sizes).</li>
<li>Breadth-first: a queue gives level order.</li>
<li>A <b>BST</b> keeps left &lt; node &lt; right. Unbalanced BSTs can degrade to O(n); <code>std::map</code> is a balanced red-black tree.</li>
<li>A <b>k-d tree</b> splits space by alternating coordinates. Robots use it for nearest-neighbour lookups on point clouds.</li></ul>`,
pattern:{py:`
from dataclasses import dataclass
from typing import Optional

@dataclass
class TreeNode:
    val: int
    left: Optional["TreeNode"] = None
    right: Optional["TreeNode"] = None

def height(node: Optional[TreeNode]) -> int:
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))
`,cpp:`
#include <algorithm>
#include <memory>

struct TreeNode {
    int val;
    std::unique_ptr<TreeNode> left, right;
    explicit TreeNode(int v) : val(v) {}
};

int height(const TreeNode* node) {
    if (!node) return 0;
    return 1 + std::max(height(node->left.get()), height(node->right.get()));
}
`},
drill:'Write iterative in-order traversal with an explicit stack from blank in under <b>5 minutes</b>.',
ex:[
{t:'BST insert, search, delete',d:2,q:`<p>Implement a BST class. Deletion has three cases: leaf, one child, two children (replace with the in-order successor). Test by inserting 1,000 random keys, deleting half, and checking in-order traversal is sorted and has the right contents.</p>`},
{t:'All four traversals iteratively',d:2,q:`<p>Pre-, in-, post-order with explicit stacks and level order with a queue. Return level order as a list of lists, one per depth.</p>`,
h:['Post-order trick: do a modified pre-order (node, right, left) and reverse the output.']},
{t:'Depth and diameter',d:1,q:`<p>Max depth, then diameter (longest path between any two nodes, in edges) in one O(n) pass.</p>`,
h:['Return height from the helper and update a running best with <code>left_h + right_h</code>.']},
{t:'Validate a BST',d:2,q:`<p>Check the BST property for the whole tree, not only parent–child. Pass allowed <code>(low, high)</code> bounds down the recursion.</p>`},
{t:'Lowest common ancestor',d:2,q:`<p>LCA of two nodes in a general binary tree, then the faster version for a BST.</p>`},
{t:'Serialise and deserialise',d:3,q:`<p>Turn a tree into a string and back, e.g. pre-order with <code>#</code> for null: <code>"1,2,#,#,3,4,#,#,5,#,#"</code>. Round-trip 100 random trees.</p>`},
{t:'Trie for autocomplete',d:2,q:`<p>Trie with <code>insert</code>, <code>contains</code>, <code>starts_with</code>, and <code>complete(prefix, k)</code> returning up to k words in alphabetical order. Load a word list and time 10⁴ lookups.</p>`,
cpp:`
#include <array>
#include <memory>
#include <string>
#include <vector>

class Trie {
    struct Node {
        std::array<std::unique_ptr<Node>, 26> next{};
        bool end = false;
    };
    Node root_;
public:
    void insert(const std::string& w);
    bool contains(const std::string& w) const;
    bool starts_with(const std::string& p) const;
    std::vector<std::string> complete(const std::string& p, int k) const;
};
`},
{t:'2D k-d tree nearest neighbour',d:3,q:`<p>Build a k-d tree from 10⁵ random 2D points (split on x at even depth, y at odd, median by <code>nth_element</code>). Implement nearest-neighbour search with pruning: skip the far subtree when the splitting line is farther than your current best. Compare against brute force for 1,000 queries.</p>`,
h:['Search the near side first, then the far side only if <code>(q[axis] − node[axis])² &lt; best_dist²</code>.']}
]},

{id:'c11',part:'P2',n:11,title:'Heaps and Priority Queues',time:'4 days',
goal:'Always know the smallest (or largest) item cheaply, and run event-driven simulations.',
primer:`<p>A binary heap is an array where each parent is ≤ its children. Push and pop are O(log n); peek is O(1).</p>
<ul><li>Python <code>heapq</code> is a <b>min</b>-heap on a list. For a max-heap push <code>-x</code>. Push tuples <code>(priority, counter, item)</code> so ties never compare items.</li>
<li>C++ <code>std::priority_queue</code> is a <b>max</b>-heap. For a min-heap: <code>std::priority_queue&lt;T, std::vector&lt;T&gt;, std::greater&lt;T&gt;&gt;</code>.</li>
<li>Index math for array heaps: children of i are <code>2i+1</code> and <code>2i+2</code>, parent is <code>(i−1)/2</code>.</li></ul>`,
pattern:{py:`
import heapq

def k_smallest(nums: list[int], k: int) -> list[int]:
    heap: list[int] = []          # max-heap of size k using negatives
    for x in nums:
        heapq.heappush(heap, -x)
        if len(heap) > k:
            heapq.heappop(heap)
    return sorted(-x for x in heap)
`,cpp:`
#include <algorithm>
#include <queue>
#include <vector>

std::vector<int> k_smallest(const std::vector<int>& nums, int k) {
    std::priority_queue<int> heap;               // max-heap
    for (int x : nums) {
        heap.push(x);
        if ((int)heap.size() > k) heap.pop();
    }
    std::vector<int> out;
    while (!heap.empty()) { out.push_back(heap.top()); heap.pop(); }
    std::reverse(out.begin(), out.end());
    return out;
}
`},
drill:'Write a min-heap class with <code>push</code>, <code>pop</code>, sift-up and sift-down from blank in under <b>10 minutes</b>.',
ex:[
{t:'Binary heap from scratch',d:2,q:`<p>Implement <code>MinHeap</code> over a vector with <code>push</code>, <code>pop</code>, <code>top</code>, and an O(n) <code>heapify</code> constructor. Heap-sort 10⁵ random ints and check against sort.</p>`,
cpp:`
#include <utility>
#include <vector>

class MinHeap {
public:
    MinHeap() = default;
    explicit MinHeap(std::vector<int> v);   // TODO: O(n) heapify
    void push(int x);
    int pop();
    int top() const { return a_.front(); }
    bool empty() const { return a_.empty(); }
private:
    std::vector<int> a_;
    void sift_up(std::size_t i);
    void sift_down(std::size_t i);
};
`},
{t:'Kth largest in a stream',d:1,q:`<p>A class that receives numbers one at a time and returns the current k-th largest after each, in O(log k).</p>`},
{t:'Merge k sorted lists',d:2,q:`<p>Merge k sorted arrays into one in O(N log k) using a heap of <code>(value, list_index, element_index)</code>.</p>`},
{t:'Top-k frequent',d:1,q:`<p>Return the k most frequent elements in O(n log k). Then try bucket sort by frequency for O(n).</p>`},
{t:'Running median',d:3,q:`<p>Return the median after each new number. Two heaps: a max-heap for the lower half and a min-heap for the upper half, balanced so sizes differ by at most 1.</p>`,
h:['Push into the lower heap, move its top to the upper heap, then if the upper heap is bigger move its top back.']},
{t:'Charging-station event simulation',d:3,q:`<p>Robots arrive at a station with 2 chargers at random times (exponential inter-arrival, mean 5 min). Each charge takes uniform 8–15 min. Simulate 1,000 robots with an event queue ordered by time (<code>ARRIVE</code>, <code>FINISH</code>). Report average waiting time. Then try 3 chargers.</p>`,
h:['Event = <code>(time, seq, kind, robot_id)</code>. Pop the earliest, update state, push new events.','Keep a FIFO queue of waiting robots and a count of free chargers.'],
py:`
import heapq, itertools, random

def simulate(n_robots: int, n_chargers: int, seed: int = 0) -> float:
    rng = random.Random(seed)
    seq = itertools.count()
    events: list[tuple[float, int, str, int]] = []
    t = 0.0
    for rid in range(n_robots):
        t += rng.expovariate(1 / 5)
        heapq.heappush(events, (t, next(seq), "ARRIVE", rid))
    free = n_chargers
    waiting: list[tuple[int, float]] = []    # use collections.deque instead
    total_wait = 0.0
    while events:
        now, _, kind, rid = heapq.heappop(events)
        # TODO: handle ARRIVE and FINISH
    return total_wait / n_robots
`}
]},

{id:'c12',part:'P2',n:12,title:'Graphs: BFS, DFS, Union-Find',time:'7 days',
goal:'Model problems as graphs and pick the right traversal immediately.',
primer:`<p>A graph is nodes and edges. Store it as an <b>adjacency list</b>: <code>vector&lt;vector&lt;int&gt;&gt;</code> or <code>dict[int, list[int]]</code>. A grid is an implicit graph: neighbours are the 4 or 8 adjacent cells.</p>
<ul><li><b>BFS</b> (queue) gives shortest paths when every edge costs the same.</li>
<li><b>DFS</b> (stack or recursion) finds components, cycles and topological orders.</li>
<li><b>Union-Find</b> merges sets and answers “same component?” in nearly O(1).</li>
<li>Mark nodes visited <b>when you push them</b>, not when you pop, or BFS may enqueue the same node many times.</li></ul>`,
pattern:{py:`
from collections import deque

def bfs_grid(grid: list[str], start: tuple[int, int]) -> dict[tuple[int, int], int]:
    R, C = len(grid), len(grid[0])
    dist = {start: 0}
    q = deque([start])
    while q:
        r, c = q.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != '#' and (nr, nc) not in dist:
                dist[(nr, nc)] = dist[(r, c)] + 1
                q.append((nr, nc))
    return dist
`,cpp:`
#include <array>
#include <queue>
#include <string>
#include <vector>

std::vector<std::vector<int>> bfs_grid(const std::vector<std::string>& g, int sr, int sc) {
    int R = g.size(), C = g[0].size();
    std::vector<std::vector<int>> dist(R, std::vector<int>(C, -1));
    std::queue<std::pair<int,int>> q;
    dist[sr][sc] = 0; q.push({sr, sc});
    const std::array<int,4> dr{1,-1,0,0}, dc{0,0,1,-1};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int k = 0; k < 4; ++k) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
            if (g[nr][nc] == '#' || dist[nr][nc] != -1) continue;
            dist[nr][nc] = dist[r][c] + 1;
            q.push({nr, nc});
        }
    }
    return dist;
}
`},
drill:'Write grid BFS with path reconstruction in C++ from blank in under <b>10 minutes</b>. Submit CSES “Labyrinth”.',
ex:[
{t:'Adjacency lists',d:1,q:`<p>Read n, m and m undirected edges. Build the adjacency list, print each node’s degree, and check the handshake lemma (sum of degrees = 2m).</p>`},
{t:'Shortest path in a maze',d:2,q:`<p>Grid with <code>S</code>, <code>E</code>, <code>#</code>. Find the shortest path length and print the path by storing each cell’s parent. This is CSES “Labyrinth”.</p>`,
h:['Walk back from E using <code>parent</code>, then reverse.']},
{t:'Count islands',d:1,q:`<p>Count connected groups of land cells. Solve with BFS, then with DFS, then with Union-Find.</p>`},
{t:'Task scheduler (topological sort)',d:2,q:`<p>Robot build tasks with dependencies (“wire motors” before “calibrate”). Output a valid order using Kahn’s algorithm, or report a cycle.</p>`,
h:['Compute in-degrees, queue all nodes with in-degree 0, and decrement neighbours as you pop.']},
{t:'Directed cycle detection',d:2,q:`<p>Detect a cycle with DFS three-colour marking (white, grey, black). Print one cycle if found.</p>`},
{t:'Union-Find',d:2,q:`<p>Implement DSU with path compression and union by size. Process 10⁶ random unions and count components after each 10⁵.</p>`,
cpp:`
#include <numeric>
#include <utility>
#include <vector>

struct DSU {
    std::vector<int> parent, size;
    explicit DSU(int n) : parent(n), size(n, 1) { std::iota(parent.begin(), parent.end(), 0); }
    int find(int x);          // TODO: path compression
    bool unite(int a, int b); // TODO: union by size; return false if already joined
};
`},
{t:'Bipartite check',d:2,q:`<p>Can the nodes be coloured with two colours so every edge joins different colours? BFS colouring. Handle disconnected graphs.</p>`},
{t:'Minimum spanning tree',d:2,q:`<p>Kruskal’s algorithm with your DSU: sort edges by weight, add each edge that joins two components. Use it to connect 200 random charging stations with the least total cable.</p>`}
]},

{id:'c13',part:'P2',n:13,title:'Shortest Paths and Planning',time:'7 days',
goal:'Implement Dijkstra and A*, the planners inside real robots and games.',
primer:`<p>When edges have different costs, BFS is not enough. <b>Dijkstra</b> pops the closest unfinished node from a priority queue. <b>A*</b> adds a heuristic h(n), an underestimate of the remaining cost, and pops by <code>g + h</code>. With a good heuristic A* explores far fewer nodes.</p>
<ul><li>Use “lazy deletion”: when you pop a node whose stored distance is smaller than the popped one, skip it.</li>
<li>Heuristics on grids: Manhattan (4-connected), octile (8-connected), Euclidean (any angle).</li>
<li>Bellman-Ford handles negative edges; Floyd-Warshall gives all pairs in O(n³).</li>
<li>Multi-agent path finding adds <b>time</b> as a dimension: two robots cannot be in the same cell at the same step.</li></ul>`,
pattern:{py:`
import heapq

def dijkstra(adj: dict[int, list[tuple[int, float]]], src: int) -> dict[int, float]:
    dist = {src: 0.0}
    pq = [(0.0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue                      # stale entry
        for v, w in adj.get(u, []):
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist
`,cpp:`
#include <functional>
#include <limits>
#include <queue>
#include <utility>
#include <vector>

using Graph = std::vector<std::vector<std::pair<int, double>>>;

std::vector<double> dijkstra(const Graph& adj, int src) {
    std::vector<double> dist(adj.size(), std::numeric_limits<double>::infinity());
    using Item = std::pair<double, int>;
    std::priority_queue<Item, std::vector<Item>, std::greater<Item>> pq;
    dist[src] = 0; pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : adj[u])
            if (d + w < dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }
    }
    return dist;
}
`},
drill:'Write A* on an 8-connected grid with the octile heuristic from blank in under <b>15 minutes</b>.',
ex:[
{t:'Dijkstra on a road network',d:2,q:`<p>Type the pattern. Read a weighted directed graph and print shortest distances from node 1. Submit CSES “Shortest Routes I”. Note: use <code>long long</code> weights there.</p>`},
{t:'Path reconstruction',d:1,q:`<p>Extend Dijkstra with a <code>parent</code> array and print the actual route from source to any target.</p>`},
{t:'A* versus Dijkstra',d:3,q:`<p>On a 200×200 grid with random obstacles, implement A* with Manhattan distance. Count expanded nodes for A* and Dijkstra on the same 50 start/goal pairs. Plot both counts. Check path lengths are equal.</p>`,
h:['Dijkstra is A* with h = 0, so write one function with a heuristic parameter.'],
py:`
import heapq

def astar(grid, start, goal, h):
    R, C = len(grid), len(grid[0])
    g = {start: 0}
    parent = {start: None}
    pq = [(h(start, goal), 0, start)]
    expanded = 0
    while pq:
        f, gc, cur = heapq.heappop(pq)
        if gc > g[cur]:
            continue
        expanded += 1
        if cur == goal:
            break
        # TODO: neighbours, relax, push (ng + h(nb, goal), ng, nb)
    return g.get(goal), expanded, parent
`},
{t:'Bellman-Ford',d:2,q:`<p>Shortest paths with negative edges, and detect a negative cycle reachable from the source. Explain in a comment why n−1 rounds are enough.</p>`},
{t:'Floyd-Warshall',d:2,q:`<p>All-pairs shortest paths on n ≤ 400. Get the loop order right (k outermost). Compare one row against Dijkstra.</p>`},
{t:'8-connected grids with diagonal cost',d:2,q:`<p>Allow diagonal moves costing √2, but not cutting corners past obstacles. Use the octile heuristic <code>D·(dx+dy) + (√2 − 2D)·min(dx,dy)</code> with D = 1.</p>`},
{t:'Two robots, one corridor',d:3,q:`<p>Prioritised planning: plan robot A with A*. Record its (cell, time) reservations. Plan robot B with space-time A* where a state is <code>(r, c, t)</code>, “wait” is a legal move, and reserved (cell, t) and swaps are forbidden. Demonstrate on a narrow corridor where B must wait.</p>`,
h:['Forbid a vertex conflict (same cell, same t) and an edge conflict (A goes u→v while B goes v→u at the same t).','Cap t at some horizon so the search terminates.']}
]},

{id:'c14',part:'P2',n:14,title:'Dynamic Programming',time:'8 days',
goal:'Define a state, a recurrence and an order, then fill a table.',
primer:`<p>DP is recursion plus memory. Answer three questions in writing before coding:</p>
<ul><li><b>State:</b> what does <code>dp[i]</code> (or <code>dp[i][j]</code>) mean, in one sentence?</li>
<li><b>Transition:</b> how is it computed from smaller states?</li>
<li><b>Order and base cases:</b> which states are filled first?</li></ul>
<p>Start with a memoised recursive version (<code>functools.cache</code> in Python), then convert to a bottom-up table, then reduce memory if only the last row is needed. Bellman’s principle here is the same one behind value iteration in Part VI.</p>`,
pattern:{py:`
def min_coins(coins: list[int], amount: int) -> int:
    INF = float("inf")
    dp = [0] + [INF] * amount          # dp[a] = fewest coins for amount a
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != INF else -1
`,cpp:`
#include <algorithm>
#include <climits>
#include <vector>

int min_coins(const std::vector<int>& coins, int amount) {
    std::vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int a = 1; a <= amount; ++a)
        for (int c : coins)
            if (c <= a && dp[a - c] != INT_MAX)
                dp[a] = std::min(dp[a], dp[a - c] + 1);
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}
`},
drill:'Write LCS with reconstruction (14.3) and 0/1 knapsack with a 1D array (14.4) from blank in under <b>8 minutes each</b>.',
ex:[
{t:'Stairs three ways',d:1,q:`<p>Ways to climb n stairs taking 1, 2 or 3 steps. Recursive with memo, bottom-up table, and O(1) memory. n = 50 should be instant.</p>`},
{t:'Coin change: min and count',d:2,q:`<p>Type the pattern. Then count the number of <b>combinations</b> (order does not matter) to make the amount. Explain in a comment why the loop order coins-outer vs amount-outer changes the answer. CSES “Coin Combinations I and II”.</p>`},
{t:'Longest common subsequence',d:2,q:`<p>LCS length of two strings in O(nm), then reconstruct one LCS by walking back through the table. <code>"ABCBDAB", "BDCABA"</code> → length 4.</p>`,
py:`
def lcs(a: str, b: str) -> str:
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            # TODO
            pass
    # TODO: walk back from (n, m) to build the string
    return ""
`},
{t:'0/1 knapsack',d:2,q:`<p>Items with weights and values, capacity W. 2D table first, then a 1D array iterating capacity <b>downward</b>. Explain why downward matters.</p>`},
{t:'Edit distance',d:2,q:`<p>Minimum insertions, deletions and substitutions to turn one word into another. <code>"kitten" → "sitting"</code> = 3. Print the sequence of operations.</p>`},
{t:'Longest increasing subsequence',d:3,q:`<p>O(n²) DP first, then O(n log n) with patience sorting: keep <code>tails[k]</code> = smallest tail of an increasing subsequence of length k+1, and binary search where each value goes.</p>`},
{t:'Grid paths with obstacles',d:1,q:`<p>Count paths from top-left to bottom-right moving right or down, avoiding obstacles, modulo 10⁹+7. CSES “Grid Paths”.</p>`},
{t:'Exact TSP with bitmask DP',d:3,q:`<p>Held-Karp: <code>dp[mask][j]</code> = shortest path that starts at city 0, visits exactly the cities in mask, and ends at j. O(2ⁿ·n²), feasible for n ≤ 16 in C++. Use it as an exact baseline: generate random instances with n = 12–16 and measure how far a heuristic (nearest neighbour, 2-opt, or a genetic algorithm) is from optimal.</p>`,
h:['Base: <code>dp[1][0] = 0</code>. Transition: for each j in mask and k not in mask, <code>dp[mask | 1&lt;&lt;k][k] = min(…, dp[mask][j] + d[j][k])</code>.','Answer: <code>min over j of dp[full][j] + d[j][0]</code>. Use <code>float</code> and a flat array of size 2ⁿ·n to save memory.'],
cpp:`
#include <cmath>
#include <limits>
#include <vector>

double held_karp(const std::vector<std::vector<double>>& d) {
    const int n = d.size(), FULL = 1 << n;
    const float INF = std::numeric_limits<float>::infinity();
    std::vector<float> dp((size_t)FULL * n, INF);
    auto at = [&](int mask, int j) -> float& { return dp[(size_t)mask * n + j]; };
    at(1, 0) = 0;
    for (int mask = 1; mask < FULL; ++mask) {
        if (!(mask & 1)) continue;
        for (int j = 0; j < n; ++j) {
            // TODO: skip if j not in mask or at(mask, j) == INF
            // TODO: extend to every k not in mask
        }
    }
    double best = INF;
    // TODO: close the tour
    return best;
}
`}
]}
);
