(function(){
const R=String.raw;
const A=window.BOOK.arena=window.BOOK.arena||{};
/* Every chapter adds one piece to a single repository, "arena-kit":
   core/ (game models and simulators), bots/ (agents), tools/ (tournaments, replays, ratings). */

A.g1={intro:R`<p>From today you build one repository, <b>arena-kit</b>, that grows into your competition bots. Every competition is a loop: read the state, decide, send actions, repeat until the game ends. Start by printing a game board.</p>`,ex:[
{t:'Print a Halite-style board',d:1,tag:'Halite',q:R`<p>Halite is played on a grid where each cell holds some halite (an energy resource) and ships collect it. Make a 5×5 board as a list of lists of integers (random 0–500), place one ship at (2, 2) and print the board with the ship shown as <code>S</code>. Do it in Python, then in C++ with <code>std::vector&lt;std::vector&lt;int&gt;&gt;</code>.</p>`},
{t:'A turn counter',d:1,tag:'All',q:R`<p>Write a loop that runs 400 turns (the length of a Halite IV game), prints the turn number every 50 turns, and stops early if the user types <code>q</code>. This is the skeleton of every game loop you will write.</p>`}]};

A.g2={intro:R`<p>Most competition bugs are small geometry mistakes, so test them from day one.</p>`,ex:[
{t:'Distance on a wrap-around board',d:1,tag:'Halite',q:R`<p>The Halite board wraps around: leaving the right edge brings you back on the left. Write <code>wrap_distance(a, b, size)</code> for 1D positions, then <code>toroidal_manhattan((r1,c1), (r2,c2), size)</code>. Write asserts for normal cases, cases across the edge, and the same cell.</p>`,h:['In 1D: <code>d = abs(a - b); return min(d, size - d)</code>.']},
{t:'Blast range check',d:1,tag:'Pommerman',q:R`<p>In Pommerman, a bomb explodes in a plus shape: along its row and column up to its blast strength. Write <code>in_blast(bomb_pos, strength, cell)</code> (ignore walls for now) with at least five asserts.</p>`}]};

A.g3={intro:R`<p>Competition servers send the game state as nested dictionaries and lists (usually JSON). Reading them fluently is the first real skill.</p>`,ex:[
{t:'Parse an observation',d:1,tag:'Halite',q:R`<p>Write a dict that mimics a Halite observation: <code>{"step": 12, "halite": [...flat list of 441 numbers...], "players": [[5000, {"0-1": 0}, {"0-2": [120, 30]}], ...]}</code>, where each player has banked halite, shipyards (id → cell index) and ships (id → [cell index, cargo]). Write functions that return your ships as a list of <code>(id, row, col, cargo)</code> and the total halite on the board.</p>`,h:['Cell index to (row, col): <code>divmod(index, size)</code>.']},
{t:'Count the votes',d:1,tag:'AIWolf',q:R`<p>In Werewolf, players vote each day and the most-voted player is executed. Given a dict <code>{"Agent[01]": "Agent[03]", ...}</code> of who voted for whom, return the vote tally and the executed player, breaking ties by choosing randomly with a seeded generator.</p>`}]};

A.g4={intro:R`<p>Fast simulators are written in C++, and they pass large game states around constantly. References keep that cheap.</p>`,ex:[
{t:'A C++ board passed by reference',d:1,tag:'Pommerman',q:R`<p>Define <code>struct Board { int size; std::vector&lt;int&gt; cells; };</code> for an 11×11 Pommerman board (0 = passage, 1 = rigid wall, 2 = wooden wall). Write <code>int count_wood(const Board&amp; b)</code> and <code>void clear_cell(Board&amp; b, int r, int c)</code>. Explain in a comment why neither copies the board.</p>`}]};

A.g5={intro:R`<p>Every competition framework asks you to write an <b>agent class</b>: the server creates your object and calls one method each turn. Now you know what that means.</p>`,ex:[
{t:'Game objects as classes',d:1,tag:'Halite',q:R`<p>Classes <code>Ship</code> (id, position, cargo), <code>Shipyard</code> (id, position) and <code>Player</code> (banked halite, ships, shipyards), with a <code>Player.from_observation(obs, player_index)</code> class method using your parser from 0.3.</p>`},
{t:'An AIWolf agent skeleton',d:1,tag:'AIWolf',q:R`<p>Write <code>class WerewolfAgent</code> with <code>__init__(self, name)</code>, <code>initialize(self, role, players)</code>, <code>talk(self) -&gt; str</code>, <code>vote(self) -&gt; str</code> and a private <code>_suspicion</code> dict from player to a score. For now <code>vote</code> picks the most suspicious player. You will make it smart in Arena A5.</p>`}]};

A.g6={intro:R`<p>Tournaments need many interchangeable bots. Polymorphism makes that trivial.</p>`,ex:[
{t:'A family of bots',d:2,tag:'All',q:R`<p>Abstract base <code>Agent</code> with <code>act(observation) -&gt; action</code>. Subclasses: <code>RandomAgent</code>, <code>StayAgent</code> (does nothing), and <code>GreedyAgent</code> (moves toward the richest neighbouring cell). Write <code>play_match(agents, game)</code> that works with any of them.</p>`},
{t:'Roles as subclasses',d:1,tag:'AIWolf',q:R`<p>Make <code>Villager</code>, <code>Seer</code> (can divine one player per night), <code>Werewolf</code> (knows its partner, attacks at night) and <code>Possessed</code> (a human who wins with the wolves) subclasses of a <code>Role</code> base with <code>night_action()</code> and <code>team</code>. Decide which methods each must override.</p>`}]};

A.g7={intro:R`<p>Winners study replays obsessively. Saving and loading games is the start.</p>`,ex:[
{t:'Save and replay games',d:1,tag:'All',q:R`<p>Record every turn of a match as JSON (state and every agent’s action) to <code>replays/&lt;date&gt;_&lt;id&gt;.json</code>. Write a replay viewer that prints the board turn by turn, with keys for next, previous and jump.</p>`},
{t:'Read real AIWolf logs',d:2,tag:'AIWolf',q:R`<p>The AIWolf project publishes logs of past natural-language games (see the log viewer linked in Arena A5). Download a few, parse who had which role, what each said each day and how they voted, and print a per-game summary. Handle malformed lines with clear warnings.</p>`}]};

A.g8={intro:R`<p>Set up the repository the way serious competition teams do.</p>`,ex:[
{t:'arena-kit on GitHub',d:1,tag:'All',q:R`<p>Create <code>arena-kit</code> with folders <code>core/</code>, <code>bots/</code>, <code>tools/</code>, <code>tests/</code>, <code>replays/</code> (git-ignored), a README and a CMake project for the C++ parts. Add a GitHub Actions workflow that runs pytest on every push.</p>`}]};

A.c01={intro:R`<p>With loops you can run whole games.</p>`,ex:[
{t:'Halite-lite, the first simulator',d:2,tag:'Halite',q:R`<p>A 1-player Halite-lite: a 10×10 wrapping board, one ship, 100 turns. Each turn the ship either moves (N, E, S, W) or stays. Staying collects 25% of the cell’s halite into the cargo. Moving onto the shipyard deposits the cargo. Cells regrow by 2% per turn. Run <code>RandomAgent</code> and <code>GreedyAgent</code> for 100 games each and compare banked halite.</p>`,h:['Keep state in one place: <code>board</code>, <code>ship_pos</code>, <code>cargo</code>, <code>banked</code>. Write <code>step(state, action) -&gt; state</code> as a single function.']}]};

A.c02={intro:R`<p>Collisions and votes are counting problems.</p>`,ex:[
{t:'Collision resolution',d:2,tag:'Halite',q:R`<p>Several ships may end a turn on the same cell. In Halite IV, the ship with the smallest cargo survives and takes the others’ cargo; if the smallest is tied, all are destroyed. Group ships by cell with a <code>defaultdict(list)</code> and implement this rule with tests for 1, 2 and 3 ships.</p>`},
{t:'Who claimed what?',d:1,tag:'AIWolf',q:R`<p>From parsed talk logs, build a dict from player to the list of roles they claimed and a Counter of how often each player was accused. Flag players whose claim changed during the game.</p>`}]};

A.c03={intro:R`<p>Bots that win are bots you can still change at 3 a.m. before a deadline.</p>`,ex:[
{t:'Observe, decide, act',d:2,tag:'All',q:R`<p>Refactor your Halite-lite bot into three pure functions: <code>observe(raw) -&gt; GameState</code> (a frozen dataclass), <code>decide(state) -&gt; Plan</code>, <code>act(plan) -&gt; actions</code>. Write a unit test for each. Every later bot follows this shape.</p>`}]};

A.c04={intro:R`<p>Competitions give each turn a time limit; a bot that times out loses. Budget your computation.</p>`,ex:[
{t:'A time-budgeted decision',d:2,tag:'All',q:R`<p>Wrap <code>decide</code> so it stops refining and returns its best answer when 80% of a per-turn budget has passed (use <code>time.perf_counter</code>). Profile one full game and report the slowest turn.</p>`}]};

A.c05={intro:R`<p>Where should ships go? Regions, not single cells.</p>`,ex:[
{t:'Find rich regions with 2D prefix sums',d:2,tag:'Halite',q:R`<p>Use your 2D prefix sum (5.7), extended to handle wrap-around by tiling the board, to find the k×k window with the most halite in O(1) per window. Send the ship toward the best window’s centre and measure the gain over <code>GreedyAgent</code>.</p>`}]};

A.c06={intro:R`<p>Search-based bots revisit the same positions many times. Hash them.</p>`,ex:[
{t:'Zobrist hashing',d:3,tag:'Pommerman',q:R`<p>Assign a random 64-bit number to every (cell, content) pair. A board’s hash is the XOR of its cells’ numbers, and a move updates it with two XORs. Implement it in C++ for an 11×11 Pommerman-like board, verify incremental and from-scratch hashes match over 10⁵ random moves, and use it as a key in a transposition table.</p>`}]};

A.c07={intro:R`<p>Opponent modelling starts with remembering what opponents just did.</p>`,ex:[
{t:'Opponent move history',d:1,tag:'Pommerman',q:R`<p>Keep a <code>RingBuffer</code> (7.8) of each opponent’s last 20 actions. Estimate how often each opponent places bombs and how often it moves toward you, and print a one-line profile per opponent at the end of each game.</p>`}]};

A.c08={intro:R`<p>Recursion lets a bot look ahead.</p>`,ex:[
{t:'Chain explosions',d:2,tag:'Pommerman',q:R`<p>A bomb’s blast detonates any other bomb it reaches immediately. Write a recursive <code>explode(board, bomb, visited)</code> that returns every cell hit, including chains, without infinite loops. Test with three bombs in a chain.</p>`},
{t:'Minimax on a tiny game',d:2,tag:'All',q:R`<p>Implement depth-limited minimax with alpha–beta pruning for Connect Four (or tic-tac-toe first). Count nodes searched with and without pruning. This is the ancestor of every game-tree method in Arena A3.</p>`}]};

A.c09={intro:R`<p>Assigning many ships to many targets is a sorting problem first.</p>`,ex:[
{t:'Greedy target assignment',d:2,tag:'Halite',q:R`<p>Score every (ship, target cell) pair by halite ÷ (distance + 1). Sort all pairs by score and assign greedily so no two ships share a target. Compare total banked halite with independent greedy ships on 100 seeds.</p>`}]};

A.c10={intro:R`<p>Monte Carlo Tree Search, the engine behind many game-AI winners, needs a tree.</p>`,ex:[
{t:'An MCTS node class',d:2,tag:'All',q:R`<p>Write <code>Node</code> with state, parent, children (action → Node), visit count and total value, plus <code>is_fully_expanded()</code> and <code>best_child(c)</code>. You will add selection and backpropagation in Chapter 22’s arena.</p>`}]};

A.c11={intro:R`<p>Priority queues pick the best options quickly every turn.</p>`,ex:[
{t:'Top mining targets',d:1,tag:'Halite',q:R`<p>Each turn, push every cell with its score onto a heap and pop the top 2k candidates for your k ships. Compare speed with sorting the whole board on a 32×32 board.</p>`}]};

A.c12={intro:R`<p>Distance maps in Halite and survival in Pommerman are both BFS problems.</p>`,ex:[
{t:'Distance maps on a torus',d:1,tag:'Halite',q:R`<p>BFS from each shipyard on the wrapping board to produce a distance map (with friendly ships as obstacles). Use it to decide when a ship should return: when cargo is high or the remaining turns are close to its distance home.</p>`},
{t:'Find a safe cell before the blast',d:2,tag:'Pommerman',q:R`<p>Given bombs with timers and blast strengths, compute which cells will be in flames at each future step. BFS over (cell, time) to find whether your agent can reach a cell that stays safe until every bomb has exploded. If not, never place that bomb.</p>`,h:['Bombs in Pommerman explode about 10 steps after placement; check the environment code for exact values.']}]};

A.c13={intro:R`<p>Many ships, one board: plan in space and time.</p>`,ex:[
{t:'Collision-free fleet routing',d:3,tag:'Halite',q:R`<p>Use your reservation-table space-time A* (13.7) to route all your ships each turn without self-collisions, planning the highest-cargo ships first. Measure lost ships per game against plain greedy movement.</p>`}]};

A.c14={intro:R`<p>When to stop mining a cell is a precise optimisation.</p>`,ex:[
{t:'How long to mine a cell',d:2,tag:'Halite',q:R`<p>Staying on a cell with halite \(h\) collects \(0.25h\), leaving \(0.75h\). After \(k\) turns you hold \(h(1 - 0.75^k)\). With distance \(d\) to the cell and \(d'\) back to base, choose \(k\) to maximise halite per turn \(h(1 - 0.75^k)/(d + k + d')\). Solve it by DP over a short sequence of cells, then by the closed-form per-cell rule, and compare.</p>`}]};

A.c15={intro:R`<p>Neural bots see the board as stacked feature planes, like images.</p>`,ex:[
{t:'Feature planes',d:2,tag:'All',q:R`<p>Convert a Halite observation into a NumPy array of shape (channels, 21, 21): halite, my ships, my cargo, enemy ships, enemy cargo, my shipyards, enemy shipyards, turns remaining. Centre it on a given ship with <code>np.roll</code>. This is the input format for Arena A2’s neural policy.</p>`},
{t:'Optimal assignment',d:2,tag:'Halite',q:R`<p>Replace greedy assignment (Chapter 9 arena) with <code>scipy.optimize.linear_sum_assignment</code> on a cost matrix of negative scores. Compare results and run time with 30 ships.</p>`}]};

A.c16={intro:R`<p>Search and RL both need millions of simulated games. Speed is a competitive advantage.</p>`,ex:[
{t:'A fast C++ simulator',d:3,tag:'Pommerman',q:R`<p>Port your Pommerman-like step function to C++ with a flat board array and no allocation per step. Measure steps per second against Python. Expose it to Python with pybind11 so your Python bots and training code can call it.</p>`}]};

A.c17={intro:R`<p>An evaluation function scores positions. You can learn its weights.</p>`,ex:[
{t:'Learn evaluation weights',d:2,tag:'Halite',q:R`<p>From 1,000 simulated games, record features at turn 200 (banked halite, cargo, ships, shipyards for each player) and the final score. Fit a linear model predicting the final score. Use it to compare candidate moves.</p>`}]};

A.c18={intro:R`<p>Hidden-role games are classification problems.</p>`,ex:[
{t:'Who is the werewolf?',d:2,tag:'AIWolf',q:R`<p>From parsed AIWolf logs, build per-player features (votes against confirmed villagers, role claims, contradictions, how often they are accused) and train logistic regression to predict “werewolf or not”. Report accuracy and F1 with cross-validation.</p>`},
{t:'Win probability',d:1,tag:'All',q:R`<p>Train a classifier predicting the eventual winner from mid-game features in your Halite-lite. Plot predicted win probability over the course of a few games.</p>`}]};

A.c19={intro:R`<p>Opponents have styles. Discover them.</p>`,ex:[
{t:'Cluster opponent styles',d:2,tag:'Halite',q:R`<p>Compute behaviour features from replays (ships built per 100 turns, average cargo when returning, attack frequency, shipyards built). Cluster with k-means, inspect the clusters, and name them (for example “miners”, “raiders”). Later bots can switch strategy depending on the opponent’s cluster.</p>`}]};

A.c20={intro:R`<p>Your own value network, built by hand.</p>`,ex:[
{t:'A value network from scratch',d:3,tag:'All',q:R`<p>Train your NumPy MLP (Chapter 20) to predict the winner of Connect Four or Halite-lite positions from self-play games. Use it as the leaf evaluation in your minimax (Chapter 8 arena) and measure win rate against plain minimax.</p>`}]};

A.c21={intro:R`<p>Top competition teams often start by imitating the best players.</p>`,ex:[
{t:'Imitation learning from replays',d:3,tag:'Halite',q:R`<p>Download Halite IV top-player episodes (Kaggle published episodes from the competition) or replays from the Softmax league. Build (feature planes, action) pairs per ship and train a small CNN policy in PyTorch. Evaluate it against your rule-based bot.</p>`}]};

A.c22={intro:R`<p>Bandits are the heart of MCTS.</p>`,ex:[
{t:'MCTS with UCT',d:3,tag:'All',q:R`<p>Complete your MCTS: select with UCT (Arena A1 math), expand one child, simulate randomly to the end, back up the result. Play Connect Four against your minimax. Then plug in your value network instead of random rollouts.</p>`},
{t:'Choosing a strategy per opponent',d:2,tag:'All',q:R`<p>You have 4 strategies and face the same opponent for many games. Treat the strategies as bandit arms and use UCB1 to pick one each game. Simulate opponents that each beat some strategies.</p>`}]};

A.c23={intro:R`<p>Reinforcement learning against built-in opponents.</p>`,ex:[
{t:'PPO in Pommerman FFA',d:3,tag:'Pommerman',q:R`<p>Install the open-source Pommerman environment (playground). Train a PPO agent (start from CleanRL) against three SimpleAgents in free-for-all, with feature planes as input. Plot win rate. Expect it to learn to hide and never bomb at first: read about reward shaping and the Backplay curriculum (Arena A3) to fix it.</p>`},
{t:'DQN for MineRL navigation',d:2,tag:'MineRL',q:R`<p>Install MineRL (or MineDojo) and train DQN on a simple navigation task with a discretised action set (forward, turn left, turn right, jump). Record what fails and why exploration is hard in Minecraft.</p>`}]};

A.c24={intro:R`<p>Self-play and teams: where competition AI and multi-agent research meet.</p>`,ex:[
{t:'A self-play league',d:3,tag:'Pommerman',q:R`<p>Keep a pool of past versions of your agent. Each training game samples opponents from the pool (mostly recent, sometimes old) to avoid forgetting how to beat old strategies. Track ratings of all pool members with Elo (Arena A1).</p>`},
{t:'Team play with a radio',d:3,tag:'Pommerman',q:R`<p>In the Pommerman team competition, teammates could send each other a small discrete message every step. Train two agents with a shared policy and a learned message channel, and compare with no communication.</p>`},
{t:'Simulated villagers',d:2,tag:'AIWolf',q:R`<p>Write a 5-player Werewolf simulator (2 villagers, 1 seer, 1 possessed, 1 werewolf) with scripted agents that use simple rules (seers report truthfully, wolves vote for whoever accuses them). Measure each team’s win rate. You will use this to test strategies cheaply before using LLMs.</p>`}]};

A.c25={intro:R`<p>Control loops matter in Minecraft too: aiming the camera is a control problem.</p>`,ex:[
{t:'PID camera aiming',d:2,tag:'MineRL',q:R`<p>In MineRL, the camera action is a change in pitch and yaw. Given a target block’s direction, aim at it with a P or PID controller on angle errors (wrapped!). Compare with jumping straight to the target angle, which looks unnatural and can be penalised in human-judged tasks.</p>`}]};

A.c29={intro:R`<p>Minecraft is a 3D world with yaw and pitch angles.</p>`,ex:[
{t:'From player view to world blocks',d:2,tag:'MineRL',q:R`<p>Given the player’s position, yaw and pitch, compute the ray of sight and find the first solid block it hits on a 3D voxel grid (3D DDA ray marching). This is how an agent knows what it is looking at.</p>`}]};

A.c30={intro:R`<p>AI Olympics with RealAIGym (IJCAI) asks for exactly this chapter’s skills: swing up and stabilise a double pendulum on real hardware.</p>`,ex:[
{t:'Double pendulum swing-up',d:3,tag:'AI Olympics',q:R`<p>Simulate an underactuated double pendulum (only one joint motorised). Swing it up with energy shaping and stabilise it with LQR, then try a trained RL policy. Add torque limits and 10 ms delay to mimic hardware, and report robustness to a 10% mass change.</p>`}]};

A.c31={intro:R`<p>Hidden information is a state estimation problem: track what you cannot see.</p>`,ex:[
{t:'Track hidden opponents',d:2,tag:'Pommerman',q:R`<p>In team mode, each agent sees only part of the board. Keep a particle filter (or grid belief) over each unseen opponent’s position using a motion model, and update it when they appear or bombs explode. Plot the belief.</p>`},
{t:'A Bayes filter over roles',d:2,tag:'AIWolf',q:R`<p>Treat each possible role assignment as a hypothesis. Update the belief after every vote and claim using likelihoods from your simulator (for example, wolves rarely vote for each other). Compare with your logistic classifier from the Chapter 18 arena.</p>`}]};

A.c32={intro:R`<p>Navigation in a 3D voxel world is motion planning.</p>`,ex:[
{t:'Pathfinding in a voxel world',d:2,tag:'MineRL',q:R`<p>On a 3D voxel grid with jump and fall rules (climb 1 block, fall up to 3), run A* from the player to a target. Compare with your RRT ideas: why are grids fine here but not for a 7-joint arm?</p>`}]};

A.c33={intro:R`<p>MineRL’s competitions were built around learning from human demonstrations and feedback.</p>`,ex:[
{t:'Behaviour cloning in Minecraft',d:3,tag:'MineRL',q:R`<p>Use the MineRL human demonstration data (or the VPT models and data) to train a behaviour-cloning policy for a simple task such as collecting logs. Measure success over 50 episodes and analyse failures with your compounding-error lens (30.2).</p>`}]};

A.c34={intro:R`<p>Real-time limits are hardware limits too.</p>`,ex:[
{t:'Never miss a deadline',d:1,tag:'All',q:R`<p>Run your bot under a CPU-limited container (for example <code>docker run --cpus=1</code>) and on a slow laptop. Record the worst-case turn time and add a watchdog fallback that returns a safe default action if thinking overruns.</p>`}]};

A.c26={intro:R`<p>GPU-batched simulation turns days of self-play into hours.</p>`,ex:[
{t:'A batch of games on the GPU',d:3,tag:'Halite',q:R`<p>Rewrite Halite-lite’s step function so the state has a batch dimension and every operation is a tensor op (PyTorch on GPU, or CuPy). Run 4,096 games in parallel and measure games per second against your C++ simulator.</p>`}]};

A.c27={intro:R`<p>Competition servers are networked; your bot is a client that must respond on time.</p>`,ex:[
{t:'A networked client',d:2,tag:'AIWolf',q:R`<p>Write a client that connects to a local game server (write a tiny one with Python’s <code>asyncio</code> or websockets), receives a request, and replies within a time limit, reconnecting cleanly after a dropped connection. AIWolf requires passing a connection check with the official server before each round.</p>`}]};

A.c28={intro:R`<p>Treat each competition submission as an experiment.</p>`,ex:[
{t:'Ablations with confidence intervals',d:2,tag:'All',q:R`<p>For your best bot, turn off one component at a time (assignment, return logic, opponent model) and play 500 games per variant against a fixed pool. Report win rate with 95% intervals. Keep only components that help significantly.</p>`},
{t:'JAX environment',d:3,tag:'Halite',q:R`<p>Write Halite-lite as a pure JAX function and <code>vmap</code> it over thousands of games, then train a policy with a JAX PPO implementation. Compare throughput with the GPU PyTorch version.</p>`}]};

A.c35={intro:R`<p>A ranking is only as good as the number of games behind it.</p>`,ex:[
{t:'How sure is the leaderboard?',d:2,tag:'All',q:R`<p>Simulate two bots with true win rates 52% and 48% head-to-head. How many games are needed before the better one is ranked first 95% of the time? Relate this to how you should judge your own changes and to leaderboard noise near deadlines.</p>`}]};

A.c36={intro:R`<p>Competitions are open worlds: you never know your opponents in advance.</p>`,ex:[
{t:'Robust to unknown opponents',d:3,tag:'All',q:R`<p>Train your bot against a population of diverse opponents (rule-based variants, past versions, imitation policies). Evaluate on held-out opponents it never saw. Compare with a bot trained only by self-play.</p>`},
{t:'Persuading strangers',d:2,tag:'AIWolf',q:R`<p>In natural-language Werewolf, other agents are built by other teams with unknown styles. Design a talk strategy (when to claim, how to accuse with evidence) and test it against three different LLM-based agent personas you write yourself.</p>`}]};

A.c37={intro:R`<p>Winners publish: competition reports are a fast path to your first paper.</p>`,ex:[
{t:'Write your competition paper',d:2,tag:'All',q:R`<p>After a competition, write a 4-page report: the environment, your approach, ablations with intervals, failure analysis. AIWolf has its own workshop (AIWolfDial) for exactly this, and Pommerman’s 2018 winners published in PMLR.</p>`}]};
})();
