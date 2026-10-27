(function(){
const R=String.raw;
window.BOOK.chapters.push(
/* ================= CAPSTONES ================= */
{id:'k1',part:'P2',n:'C1',title:'Capstone: A Verified MAPF Engine',time:'Feb – early Apr 2027 (~8 weeks)',
goal:'Build a fast, correct MAPF engine whose results are checked against the public best-known solutions, finished and public before Japanese internship deadlines.',
needs:['g4','g8','c12','c13','c06','c11'],
math:[
{h:'The problem, precisely',body:R`<p>Given a graph \(G = (V, E)\) (a grid map) and \(k\) agents with starts \(s_i\) and goals \(g_i\), find paths \(\pi_i = (\pi_i(0), \pi_i(1), \dots)\) where each step moves along an edge or waits, with no <b>vertex conflict</b> \(\pi_i(t) = \pi_j(t)\) and no <b>swap conflict</b> \(\pi_i(t) = \pi_j(t+1) \wedge \pi_i(t+1) = \pi_j(t)\). The standard objective is the <b>sum of costs</b> \(\mathrm{SOC} = \sum_i T_i\), where \(T_i\) is the arrival time of agent \(i\) (after which it stays at its goal). Solving MAPF optimally is NP-hard, so the interesting engineering is in making exact methods fast and approximate ones good.</p>`},
{h:'Why CBS is optimal, and how to bound it',body:R`<p>Conflict-Based Search keeps a high-level tree of constraint sets. Each node’s cost is the SOC of individually optimal paths under its constraints. Splitting on a conflict adds a constraint to one agent in each child, so every collision-free solution remains consistent with at least one child, and child costs never decrease. Expanding nodes in order of cost therefore finds an optimal solution first. The root’s cost \(\sum_i \mathrm{dist}(s_i, g_i)\) is a <b>lower bound</b> \(L\). For any solution of cost \(S\), the suboptimality ratio \((S - L)/L\) measures quality, which is how the public MAPF tracker compares methods.</p>`},
{h:'Bounded-suboptimal search',body:R`<p>Optimal CBS slows down sharply as agents are added. Focal search (used by ECBS) accepts any node whose cost is within a factor \(w\) of the current minimum, \(f(n) \le w\cdot f_{min}\), and among those prefers nodes with fewer conflicts. The result is guaranteed to cost at most \(w\) times the optimum, often found far faster. Measuring that trade-off on standard benchmarks is a real, publishable kind of evaluation.</p>`}
],
learn:[
{h:'Why this project',body:R`<p>Multi-agent path finding is the core of warehouse robots, multi-robot systems and your own multi-agent research, and it is an active research topic at Japanese labs in robotics and planning. It uses exactly the skills you will have by February 2027 (graphs, search, heaps, hashing, C++). Above all, its results can be <b>checked objectively</b>: a public tracker (tracker.pathfinding.ai) records best-known solutions and lower bounds for the standard MAPF benchmark maps and scenarios from Stern et al. (2019). Your table either matches published numbers or it does not.</p>`},
{h:'Honest note on AI coding tools',body:R`<p>An AI model can write a CBS skeleton in seconds. It cannot make you the person who can explain why your planner is slow on maze maps, why one tie-breaking rule halves the runtime, or why a constraint bug only appears with 80 agents. Interviewers at research labs ask exactly those questions. Use AI tools for boilerplate if you like, but write the search, conflict detection and validator yourself, and make sure every number in your README came from your own runs.</p>`},
{h:'Specification',body:R`<ul><li><b>C++20 core</b> built with CMake: map and scenario loaders for the standard benchmark format; space-time A*; prioritised planning; CBS; ECBS or another bounded-suboptimal variant.</li>
<li><b>Independent validator</b> that checks any plan for conflicts and recomputes its cost.</li>
<li><b>Python bindings</b> with pybind11, plus a command-line tool to run a whole benchmark folder in parallel.</li>
<li><b>Visualiser:</b> a single HTML page animating plans on the map.</li>
<li><b>Results:</b> success rate within a time limit, SOC and suboptimality against the tracker’s lower bounds, runtime, across several map types and agent counts. Plots with intervals over scenarios.</li>
<li><b>One original question</b> answered with an experiment, for example: how robust are plans to random execution delays, and how much does planning with a small safety margin help?</li>
<li><b>README</b> with a GIF, design, results table, how to reproduce, and limitations.</li></ul>`},
{h:'How to use it to get an internship',body:R`<p>Put the repository and a one-page project site at the top of your CV. In emails to researchers, link one specific result (“on the warehouse map with 100 agents, my ECBS implementation reaches X% success at w = 1.1; here is where it fails”). Prepare a 5-minute talk with one figure. Expect to be asked to modify the code live or reason about complexity; that is where having written it yourself shows.</p>`}
],
primer:R`<ul><li>Vertex and swap conflicts; sum of costs; NP-hard.</li><li>CBS is optimal; the root cost is a lower bound.</li><li>Focal search trades bounded suboptimality for speed.</li><li>Validate everything against the public tracker.</li></ul>`,
drill:'From blank, write conflict detection between two time-indexed paths (vertex and swap) and the CBS split step, in under <b>10 minutes</b>.',
ex:[
{t:'Week 1: maps, scenarios, validator',d:2,q:R`<p>Load benchmark maps and scenarios, and write the plan validator first, with tests on hand-made conflicting and valid plans. Everything later is checked by it.</p>`},
{t:'Week 2: space-time A* and prioritised planning',d:2,q:R`<p>Implement space-time A* with a reservation table and goal-occupation handling (an agent parked at its goal blocks later agents). Run prioritised planning on small maps and validate every plan.</p>`},
{t:'Weeks 3–4: CBS',d:3,q:R`<p>Implement optimal CBS with a priority queue of nodes and per-agent replanning under constraints. Test optimality against brute-force joint search on tiny instances. Compare SOC with the tracker’s best-known solutions on instances you solve.</p>`,
cpp:R`
#include <optional>
#include <queue>
#include <vector>

struct Instance;   // your map + scenario loader (week 1)
struct Constraint { int agent, cell, time; bool is_edge; int to_cell; };
struct Conflict  { int a1, a2, cell, time; bool is_swap; int other_cell; };

struct CTNode {
    std::vector<Constraint> constraints;
    std::vector<std::vector<int>> paths;     // paths[agent][t] = cell
    long long soc = 0;
};

std::optional<Conflict> first_conflict(const std::vector<std::vector<int>>& paths);
// TODO: vertex conflicts, swap conflicts, agents waiting at goals after arrival

std::optional<std::vector<std::vector<int>>> cbs(const Instance& inst, double time_limit_s) {
    auto cmp = [](const CTNode* a, const CTNode* b) { return a->soc > b->soc; };
    std::priority_queue<CTNode*, std::vector<CTNode*>, decltype(cmp)> open(cmp);
    // TODO: root = individually optimal paths; push
    // TODO: loop: pop, find first conflict, return if none,
    //       otherwise create two children each with one new constraint,
    //       replan only the constrained agent, push if a path exists
    return std::nullopt;
}
`},
{t:'Week 5: speed',d:3,q:R`<p>Profile with <code>perf</code> or a sampling profiler. Typical wins: flat arrays instead of maps, precomputed distance-to-goal heuristics, avoiding copies of whole constraint lists, better tie-breaking. Report each optimisation’s speed-up in the README.</p>`},
{t:'Week 6: bounded-suboptimal variant',d:3,q:R`<p>Implement ECBS (focal search at both levels) or another bounded-suboptimal method. Plot success rate and suboptimality against agent count for several values of \(w\).</p>`},
{t:'Week 7: your own question',d:3,q:R`<p>Simulate execution with random delays (each agent pauses with probability p per step). Measure how often plans collide or deadlock, then test one remedy (for example k-robust planning or a simple execution policy that waits when ahead of schedule). Report results with intervals.</p>`},
{t:'Week 8: present it',d:2,q:R`<p>Python bindings, visualiser, README with GIF and reproducible commands, a one-page site, and a 5-minute talk. Ask two people to try to reproduce one result from your instructions alone.</p>`}
]},

{id:'k2',part:'P7',n:'C2',title:'Capstone: A Real Robot That Learns',time:'Dec 2027 – Mar 2028 (~12 weeks)',
goal:'Train a manipulation policy on real hardware and evaluate it rigorously: the kind of work robotics labs, Sony AI, OMRON SINIC X and PhD committees take seriously.',
needs:['c33','c34','c35'],
math:[
{h:'Evaluation you can defend',body:R`<p>Run at least \(n = 100\) trials per condition from a fixed set of initial conditions, randomised in order. Report success \(\hat p\) with a Wilson 95% interval, and compare conditions with the same initial conditions as a paired design. With 100 trials, an 80% success rate has an interval of roughly ±8 points, so differences smaller than about 10–15 points need more trials or should not be claimed.</p>`},
{h:'How performance scales with data',body:R`<p>A useful question for any learned policy is how success grows with the number of demonstrations \(N\). Fit success against \(\log N\) for \(N \in \{10, 25, 50, 100, 200\}\): a straight line suggests more data keeps helping; flattening suggests the bottleneck is elsewhere (observation, model, hardware). This is a small, honest version of the scaling questions behind robot foundation models.</p>`}
],
learn:[
{h:'Why this project',body:R`<p>Real hardware is the part of robotics no code generator can do for you: calibration, latency, lighting, wear, data collection and failure analysis all happen in the physical world. A clean real-robot result with an honest evaluation is rare among master’s students and is exactly what robot-learning groups look for.</p>`},
{h:'Hardware options',body:R`<p>Low-cost open-source arms such as the SO-101 are supported by Hugging Face’s LeRobot, including teleoperation with a leader arm, dataset recording and training of ACT and diffusion policies. Check current kit prices. Before buying, ask your lab and Tsukuba’s robotics groups: borrowing an existing robot is often possible and better.</p>`},
{h:'Specification',body:R`<ul><li>One task with clear success criteria, such as picking a specific object from clutter and placing it in a box.</li>
<li>Your own teleoperated dataset, released with a data card.</li>
<li>Two policy types trained (for example ACT and a diffusion policy) with identical data and budgets.</li>
<li>Fixed evaluation protocol: initial-condition list, success definition, 100 trials per condition.</li>
<li>One controlled study: data scaling, or robustness to distractors, lighting or object position shifts.</li>
<li>Failure taxonomy with example videos.</li>
<li>Project page with video, results with intervals, and code.</li></ul>`}
],
primer:R`<ul><li>Physical-world work is the hardest to fake and the most valued.</li><li>100 trials per condition, Wilson intervals, paired designs.</li><li>Answer one controlled question, such as data scaling.</li><li>Release data, code and failure videos.</li></ul>`,
drill:'Explain your evaluation protocol and the meaning of your confidence intervals to a non-specialist in under <b>3 minutes</b>.',
ex:[
{t:'Weeks 1–2: hardware and calibration',d:2,q:R`<p>Assemble or borrow the arm, calibrate it, set up cameras, and measure end-to-end control latency. Document the setup so someone else could rebuild it.</p>`},
{t:'Weeks 3–4: data collection',d:2,q:R`<p>Record 200 teleoperated demonstrations with varied initial positions. Hold out 20 initial conditions for evaluation only. Write the data card.</p>`},
{t:'Weeks 5–7: train two policies',d:3,q:R`<p>Train ACT and a diffusion policy with the same data and compute. Run a 20-trial pilot evaluation to catch bugs before the full evaluation.</p>`},
{t:'Weeks 8–10: full evaluation and study',d:3,q:R`<p>100 trials per policy, then the data-scaling or robustness study. Record every trial on video with its outcome.</p>`},
{t:'Weeks 11–12: analysis and release',d:2,q:R`<p>Failure taxonomy, plots with intervals, project page and a workshop-style write-up. Submit to a robot-learning workshop if the result is interesting.</p>`}
]}
);
})();
