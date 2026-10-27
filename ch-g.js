(function(){
const R=String.raw;
window.BOOK.chapters.push(
/* ================= COMPETITION ARENA ================= */
{id:'a1',part:'PA',n:'A1',title:'How Competitions Are Won',time:'7 days',
goal:'Build the tooling and habits that separate finalists from everyone else, whatever the game.',
needs:['c14'],
math:[
{h:'Elo ratings',body:R`<p>Each bot has a rating \(R\). The expected score of A against B is</p>
\[ E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}, \]
<p>so a 200-point gap means about a 76% expected score. After a game with actual score \(S_A \in \{0, \tfrac12, 1\}\), update \(R_A \leftarrow R_A + K(S_A - E_A)\) with a step size \(K\) (often 16–32). Elo is logistic regression in disguise: it fits win probabilities from rating differences.</p>`},
{h:'TrueSkill and uncertainty',body:R`<p>TrueSkill models each player’s skill as a Gaussian \(\mathcal N(\mu, \sigma^2)\). Wins and losses shift \(\mu\) and shrink \(\sigma\). Leaderboards often rank by the conservative estimate \(\mu - 3\sigma\), so a new bot with few games starts low even if it is strong. Many competition leaderboards use this family of ratings, which is why a new submission needs many games before its rank means anything.</p>`},
{h:'UCT: search guided by bandits',body:R`<p>Monte Carlo Tree Search repeats four steps: <b>select</b> a path down the tree, <b>expand</b> one new node, <b>simulate</b> (rollout or value network), <b>back up</b> the result. Selection treats each node’s children as bandit arms and picks</p>
\[ a^* = \arg\max_a\ \frac{W_a}{N_a} + c\sqrt{\frac{\ln N}{N_a}}, \]
<p>where \(W_a/N_a\) is the child’s average value, \(N\) the parent’s visits and \(c\) the exploration constant. AlphaZero replaces the bonus with a network prior: \(Q(s,a) + c\,P(s,a)\frac{\sqrt{N}}{1 + N_a}\).</p>`},
{h:'Minimax and expectimax',body:R`<p>In two-player zero-sum games, \(V(s) = \max_a\min_b V(s')\): assume the opponent plays its best reply. In multi-player and stochastic games, <b>expectimax</b> averages over opponent actions with a model \(p(b\mid s)\): \(V(s) = \max_a \mathbb{E}_{b\sim p}[V(s')]\). Between the two is <b>pessimistic</b> search, which assumes a small set of dangerous opponent behaviours; it won the NeurIPS 2018 Pommerman competition (Arena A3).</p>`}
],
learn:[
{h:'What winning teams do',body:R`<ul><li><b>Exact local simulator.</b> Reproduce the official environment bit for bit, so thousands of local games predict leaderboard results.</li>
<li><b>Tournament harness.</b> One command plays N games between any bots in parallel and prints ratings with intervals.</li>
<li><b>Replay analysis.</b> They watch their losses, classify why each happened, and fix the most common cause first.</li>
<li><b>Regression tests.</b> Every new version must beat the previous one significantly before submission.</li>
<li><b>Strong heuristics first.</b> In most game competitions, a well-engineered rule-based bot beats a first attempt at RL. Learning comes later, often as imitation of the best rule-based or human play, then improved by search or RL.</li>
<li><b>Read past winners.</b> Winning write-ups and papers tell you which ideas already work.</li></ul>`},
{h:'A two-year competition plan',body:R`<p>Pick <b>two primary competitions</b> that are actually running (Arena A6), and use the inactive ones as training grounds and research benchmarks. Enter early: even a weak first submission teaches you the submission pipeline, time limits and opponent field. Keep a <b>lab notebook</b> per competition: date, change, games played, win rate with interval, decision.</p>`}
],
primer:R`<ul><li>Elo and TrueSkill turn game results into ratings; mind the uncertainty.</li><li>MCTS selects with UCT; AlphaZero adds learned priors and values.</li><li>Build exact simulators, tournament harnesses and replay tools before clever ideas.</li><li>Heuristics first, then search, then learning.</li></ul>`,
drill:'Write an Elo update and a UCT selection function from blank in under <b>5 minutes</b> combined.',
ex:[
{t:'Tournament harness',d:2,tag:'All',q:R`<p>Write <code>tools/tournament.py</code>: given a list of bot classes and a game, play round-robin matches in parallel (<code>multiprocessing</code>), seat orders rotated, and output Elo ratings with bootstrap 95% intervals.</p>`,
py:R`
import itertools, random
from concurrent.futures import ProcessPoolExecutor

def expected(ra: float, rb: float) -> float:
    return 1 / (1 + 10 ** ((rb - ra) / 400))

def update(ra, rb, score_a, k=24):
    # TODO: return new (ra, rb)
    return ra, rb

def play_one(args):
    game_cls, bot_a, bot_b, seed = args
    # TODO: play one game, return (name_a, name_b, score_a)
    return bot_a.__name__, bot_b.__name__, 0.5

def round_robin(game_cls, bots, games_per_pair=100, workers=8):
    jobs = [(game_cls, a, b, s) for a, b in itertools.permutations(bots, 2)
            for s in range(games_per_pair // 2)]
    with ProcessPoolExecutor(workers) as pool:
        results = list(pool.map(play_one, jobs))
    # TODO: compute Elo over shuffled results; bootstrap intervals
    return results
`},
{t:'TrueSkill leaderboard',d:1,tag:'All',q:R`<p>Use the <code>trueskill</code> Python package to rate 6 bots over 2,000 four-player free-for-all games. Plot \(\mu\) and \(\mu - 3\sigma\) as games accumulate. How many games until the ranking stops changing?</p>`},
{t:'Loss taxonomy',d:1,tag:'All',q:R`<p>Watch 30 losses of your best bot. Classify each into a cause (collision, bad timing, ignored threat, wasted resources…). Fix the top cause, rerun the tournament, and record the change in your lab notebook.</p>`},
{t:'Regression gate',d:2,tag:'All',q:R`<p>Add a script that refuses to tag a new submission unless it beats the current champion by a statistically significant margin over 400 games (one-sided binomial test at 5%). Add it to CI.</p>`},
{t:'AlphaZero-lite',d:3,tag:'All',q:R`<p>Combine your MCTS (Chapter 22 arena) with a small policy–value network trained from its own search results on Connect Four. Track Elo of each generation against generation 0 and against your minimax bot.</p>`}
]},

{id:'a2',part:'PA',n:'A2',title:'Halite: Fleets and Economies',time:'14 days',
goal:'Build a top-tier Halite IV bot, and enter the ongoing Softmax Halite league.',
needs:['a1','c13','c15'],
math:[
{h:'Mining yield',body:R`<p>A ship staying on a cell with \(h\) halite collects a fraction \(\rho\) (25% in Halite IV) per turn. After \(k\) turns it has collected \(h\big(1 - (1-\rho)^k\big)\), and the cell holds \(h(1-\rho)^k\). Including travel there (\(d_1\)) and back (\(d_2\)), the rate is</p>
\[ r(k) = \frac{h\big(1 - (1-\rho)^k\big)}{d_1 + k + d_2}. \]
<p>Maximise over \(k\) per candidate cell, then compare cells by their best rate. Rich cells far away can beat poor cells nearby, and the best \(k\) is usually a few turns, not until the cell is empty.</p>`},
{h:'When a ship pays for itself',body:R`<p>A new ship costs \(C\) (500 halite in Halite IV). If an average ship earns about \(\bar r\) halite per turn, a ship built with \(T\) turns left is worth building only if \(\bar r\,(T - t_0) \gt C\), where \(t_0\) is start-up time. Since \(\bar r\) falls as the board is depleted and as your own fleet competes for cells, strong bots build aggressively early and stop well before the end.</p>`},
{h:'Collision risk',body:R`<p>Moving next to an enemy ship with less cargo is dangerous: if it moves onto your cell, you lose your ship and cargo. If each of \(m\) adjacent light enemies independently moves onto your target cell with probability \(q\), the risk is \(1 - (1-q)^m\). Choose moves by expected value: gain from the move minus risk × (cargo + ship value).</p>`}
],
learn:[
{h:'The game',body:R`<p>Halite IV (Kaggle, 2020; now an exact port in the Softmax league): four players on a 21×21 board that wraps around, 400 turns. Ships move or stay; staying mines the cell; returning to a shipyard banks the cargo. Ships can convert into shipyards, and shipyards can spawn ships, both costing halite. When ships collide, the one with the least cargo wins and takes the rest; equal cargo destroys all. Whoever has the most banked halite at the end wins. Check the league’s rules page for exact constants before coding them.</p>`},
{h:'Anatomy of a strong bot',body:R`<ul><li><b>Roles:</b> each turn assign ships to mining, returning, hunting (ramming enemy ships carrying cargo) or guarding shipyards.</li>
<li><b>Global assignment:</b> ship-to-target matching (Hungarian algorithm) instead of greedy choices.</li>
<li><b>Safe movement:</b> resolve your own moves jointly so your ships never collide, and avoid cells enemies can reach.</li>
<li><b>Economy:</b> spawning schedule, shipyard placement near rich regions, and an endgame where every ship returns.</li>
<li><b>Opponent awareness:</b> recognise aggressive and passive opponents and adapt.</li></ul>
<p>Top Halite bots have mostly been carefully engineered rule-based systems with optimisation inside, sometimes combined with learned components. Start there.</p>`},
{h:'Tools',body:R`<p>The <code>kaggle-environments</code> package contains the original Halite IV environment and renderer; use it to validate your own simulator. The Softmax Halite league accepts policy submissions and runs rounds continuously with an MMR leaderboard, so you can measure progress against other people at any time.</p>`}
],
primer:R`<ul><li>Compare mining targets by halite per turn including travel.</li><li>Spawn early, stop spawning late.</li><li>Choose moves by expected value including collision risk.</li><li>Assign globally, move safely, plan the endgame.</li></ul>`,
drill:'From blank, write the mining-rate formula, the best-\(k\) search, and a Hungarian assignment of ships to cells in under <b>15 minutes</b>.',
ex:[
{t:'Validate your simulator',d:2,tag:'Halite',q:R`<p>Upgrade Halite-lite to the full Halite IV rules. Feed identical actions to your simulator and to <code>kaggle-environments</code>’ Halite for 1,000 random games and assert identical states every turn. Fix every mismatch.</p>`},
{t:'Rule-based bot v1',d:2,tag:'Halite',q:R`<p>Miners pick targets by best rate, return when cargo exceeds a threshold or when needed for the endgame, and moves are resolved jointly to avoid self-collision. Beat the built-in example agents in 95% of games.</p>`},
{t:'Economy tuning',d:2,tag:'Halite',q:R`<p>Make spawn cut-off turn, return threshold and maximum fleet size parameters. Tune them with a grid or Bayesian search (e.g. Optuna) using your tournament harness against a pool of your previous versions.</p>`},
{t:'Hunters and guards',d:3,tag:'Halite',q:R`<p>Add hunters that trap heavy enemy ships using two or more of your empty ships, and guards that keep an empty ship on or next to each shipyard when enemies approach. Measure win rate against v1 with intervals.</p>`},
{t:'Learned components',d:3,tag:'Halite',q:R`<p>Train a per-ship imitation policy from top replays (Chapter 21 arena), then use it only where your rules are uncertain, such as choosing among similar targets. Report whether the hybrid beats pure rules.</p>`},
{t:'Enter the Softmax league',d:1,tag:'Halite',q:R`<p>Submit your bot to the Softmax Halite league. Track its MMR over several rounds and keep a lab-notebook entry for each version you submit.</p>`}
]},

{id:'a3',part:'PA',n:'A3',title:'Pommerman: Bombs, Search and Teams',time:'14 days',
goal:'Master survival, search and multi-agent RL in Pommerman, the NeurIPS multi-agent benchmark.',
needs:['a1','c23','c24'],
math:[
{h:'Flame timelines',body:R`<p>For every cell \(x\) and future step \(t\), compute \(F(x, t) \in \{0, 1\}\): will it be in flames? Each bomb \(b\) with timer \(\tau_b\) and strength \(s_b\) contributes flames at \(t = \tau_b\) on its blast cross (stopping at walls), and chain reactions lower the timers of bombs reached by earlier blasts. Safe planning is then BFS over \((x, t)\) avoiding \(F = 1\), exactly the space-time search of Chapter 13.</p>`},
{h:'Pessimistic scenarios',body:R`<p>Full game-tree search over four agents with six actions each branches \(6^4 = 1296\) ways per step, far too many in real time. The 2018 winners instead searched over their own actions against a few <b>pessimistic scenarios</b> of opponent behaviour (for example, opponents moving to block escape routes) and chose the action whose worst-case outcome was best. This is a practical middle ground between minimax and expectimax.</p>`},
{h:'Why RL struggles here',body:R`<p>The reward is sparse (win or lose at the end, often after hundreds of steps), and the easiest early lesson is “bombs kill me”, so agents learn to never bomb. Remedies: <b>reward shaping</b> \(r' = r + \gamma\Phi(s') - \Phi(s)\) with a potential \(\Phi\) (potential-based shaping provably keeps the optimal policy unchanged), <b>curricula</b> against easier opponents, and <b>Backplay</b>, which starts training episodes near the end of a demonstration and moves the start earlier over time.</p>`}
],
learn:[
{h:'The game',body:R`<p>Pommerman is a Bomberman-like environment by the Pommerman team, used for NeurIPS competitions in 2018 and 2019. Four agents on an 11×11 board place bombs that explode after a short timer in a cross shape. Wooden walls can be destroyed and may hide power-ups (extra bomb, larger blast, kick bombs); rigid walls cannot. Modes: free-for-all, 2v2 team (with partial observability), and team radio, where teammates exchange small discrete messages. The open-source <b>playground</b> repository contains the environment and baseline agents such as <code>SimpleAgent</code>.</p>`},
{h:'What worked',body:R`<ul><li>The NeurIPS 2018 winners used <b>real-time tree search with pessimistic scenarios</b> (published in PMLR).</li>
<li><b>Skynet</b> (Borealis AI) was the top deep-RL agent in the inaugural team competition, combining careful reward design, action filtering and curriculum learning.</li>
<li>Research on Pommerman explored hard exploration, imitation-accelerated training and limited-communication teamwork. It is still a good benchmark for papers.</li></ul>`},
{h:'Action filtering',body:R`<p>Almost every strong agent, search or RL, removes actions that lead to certain death before choosing. A learned policy that only chooses among safe actions trains far faster. Implement the safety filter from your flame timeline first; everything else builds on it.</p>`}
],
primer:R`<ul><li>Flame timelines plus space-time BFS give safety.</li><li>Pessimistic search won in 2018; RL needs shaping, curricula and filtering.</li><li>Team modes add partial observability and communication.</li></ul>`,
drill:'Write the flame-timeline computation with chain reactions, and a safe-action filter, from blank in under <b>20 minutes</b>.',
ex:[
{t:'Run the playground',d:1,tag:'Pommerman',q:R`<p>Install the Pommerman playground, run four SimpleAgents in free-for-all with rendering, and record 100 games. Report win rates and average game length.</p>`},
{t:'A survivor bot',d:2,tag:'Pommerman',q:R`<p>Using your flame timeline and safe-action filter, write a rule-based agent that never dies to its own bombs, collects power-ups and bombs wooden walls. Beat SimpleAgent in most free-for-all games.</p>`},
{t:'Pessimistic search',d:3,tag:'Pommerman',q:R`<p>Implement a depth-limited search over your own actions against a few pessimistic opponent scenarios, using your C++ simulator (Chapter 16 arena) for speed. Respect a per-step time limit. Compare with the survivor bot.</p>`},
{t:'PPO with filtering and curriculum',d:3,tag:'Pommerman',q:R`<p>Train PPO with safe-action masking, potential-based shaping and a curriculum from static to SimpleAgent opponents. Plot win rate over training for 3 seeds with intervals.</p>`},
{t:'2v2 with partial observability',d:3,tag:'Pommerman',q:R`<p>Play team mode with your opponent-tracking belief (Chapter 28 arena). Then add a radio channel and test whether learned or hand-designed messages improve the team’s win rate.</p>`},
{t:'Write it up',d:2,tag:'Pommerman',q:R`<p>Pommerman has no running competition, so turn your best result into a workshop paper: a clear question (for example, does communication help against unseen opponent teams?), proper evaluation and released code.</p>`}
]},

{id:'a4',part:'PA',n:'A4',title:'Minecraft Agents: MineRL and Beyond',time:'14 days',
goal:'Learn the techniques of the MineRL competitions: learning from demonstrations, foundation models and human feedback in an open world.',
needs:['a1','c33','c21'],
math:[
{h:'Labelling videos with an inverse dynamics model',body:R`<p>Internet Minecraft videos show what players see but not which keys they press. OpenAI’s VPT trained an <b>inverse dynamics model</b> on a small labelled set: predict the action from frames before <i>and after</i> it, \(p_\phi(a_t\mid o_{t-k}, \dots, o_{t+k})\), which is much easier than predicting it from the past alone. It then labelled 70,000 hours of video and trained a behaviour-cloning foundation model on the pseudo-labels.</p>`},
{h:'Learning from preferences',body:R`<p>BASALT tasks like “build a nice waterfall” have no reward function. With human comparisons between pairs of trajectories, the Bradley–Terry model fits a reward \(r_\psi\):</p>
\[ P(A \succ B) = \frac{e^{R_\psi(A)}}{e^{R_\psi(A)} + e^{R_\psi(B)}} = \sigma\big(R_\psi(A) - R_\psi(B)\big), \]
<p>with \(R_\psi\) the summed reward of a trajectory, trained by cross-entropy on the human labels. RL then optimises the learned reward. This is the same idea used to fine-tune language models from human feedback.</p>`},
{h:'Hierarchy',body:R`<p>Obtaining a diamond needs a long chain of sub-goals: logs, planks, crafting table, wooden pickaxe, stone, stone pickaxe, iron, furnace, iron pickaxe, then diamond. If a flat policy must discover each link by chance, success is a product of small probabilities (Chapter 35). Hierarchical agents pick sub-goals with a high-level policy (scripted, learned, or an LLM planner) and solve each with a low-level skill.</p>`}
],
learn:[
{h:'The competitions',body:R`<p><b>MineRL Diamond</b> (NeurIPS 2019–2021) asked for sample-efficient agents that obtain a diamond, with a large human-demonstration dataset and strict limits on environment samples and compute. <b>BASALT</b> (NeurIPS 2021–2022) posed fuzzy tasks (find a cave, make a waterfall, build an animal pen, build a village house) judged by humans; the 2022 edition provided VPT foundation models to fine-tune. No MineRL competition has run since 2022, but the environments, datasets and VPT models remain open, and Minecraft is still a major embodied-AI research testbed (MineDojo, Voyager).</p>`},
{h:'Fast versus faithful environments',body:R`<p>MineRL and MineDojo run real Minecraft through Java: faithful but slow, and fiddly to install. <b>Craftax</b> is a Minecraft-inspired 2D environment written in JAX that runs millions of steps per second on a GPU, ideal for testing RL ideas quickly before moving to real Minecraft.</p>`}
],
primer:R`<ul><li>Inverse dynamics turns unlabelled video into training data.</li><li>Preference learning builds rewards for fuzzy tasks.</li><li>Long chains of sub-goals call for hierarchy.</li><li>Prototype in Craftax, validate in MineRL or MineDojo.</li></ul>`,
drill:'Explain VPT’s pipeline (labelled data → inverse dynamics → pseudo-labels → behaviour cloning → fine-tuning) on paper, with the loss for each stage, in under <b>8 minutes</b>.',
ex:[
{t:'Install and explore',d:1,tag:'MineRL',q:R`<p>Install MineRL or MineDojo (follow its current documentation; Java is required) and run a random agent with video recording. Install Craftax and run a random agent. Compare steps per second.</p>`},
{t:'PPO in Craftax',d:2,tag:'MineRL',q:R`<p>Train PPO on Craftax-Classic using a JAX implementation (adapt your Chapter 34 arena code or the repository’s baseline). Plot achievement success rates over training for 3 seeds.</p>`},
{t:'An inverse dynamics model',d:3,tag:'MineRL',q:R`<p>In Craftax (where you know true actions), train a model predicting \(a_t\) from frames \(t-2..t+2\). Hide the labels of 95% of your data, pseudo-label them with the model, and train a behaviour-cloning policy. Compare with BC on the 5% labelled data alone.</p>`},
{t:'Reward from preferences',d:3,tag:'MineRL',q:R`<p>Define a fuzzy goal in Craftax (for example “explore new areas”). Generate trajectory pairs, label preferences with a hidden scoring script (standing in for a human), fit a Bradley–Terry reward model, and train PPO on it. Measure the agent with the hidden script.</p>`},
{t:'A hierarchical diamond seeker',d:3,tag:'MineRL',q:R`<p>Write a high-level controller that follows the crafting chain and calls low-level skills (scripted first, then learned by BC). Measure how far along the chain it gets over 50 episodes, and which link fails most.</p>`},
{t:'LLM as a planner',d:2,tag:'MineRL',q:R`<p>Read the Voyager paper. Use an LLM to propose the next sub-goal from a text description of the inventory and surroundings, with your skills executing them. Compare with your fixed scripted chain. Note cost and latency.</p>`}
]},

{id:'a5',part:'PA',n:'A5',title:'AIWolf: Deception and Dialogue',time:'14 days',
goal:'Build a natural-language Werewolf agent for the International AIWolf Contest, combining Bayesian reasoning with an LLM.',
needs:['a1','c18'],
math:[
{h:'Counting worlds',body:R`<p>In the 5-player village (2 villagers, 1 seer, 1 possessed, 1 werewolf), from your point of view as a villager the other 4 players hold {villager, seer, possessed, werewolf} in some order: \(4! = 24\) possible worlds. Keep a probability for each world. Constraints remove worlds (only one seer exists), and evidence reweights the rest by Bayes’ rule:</p>
\[ P(w\mid e) = \frac{P(e\mid w)\,P(w)}{\sum_{w'}P(e\mid w')\,P(w')}. \]
<p>The probability that player \(j\) is the werewolf is the sum over worlds where they are. In the 9-player village there are far more worlds, so enumerate cleverly or sample.</p>`},
{h:'Likelihoods of behaviour',body:R`<p>\(P(e\mid w)\) is a model of how each role behaves: a true seer’s divination results are consistent with the world; a werewolf rarely votes for its partner; the possessed often makes a false seer claim. Estimate these probabilities from game logs and your simulator (Chapter 24 arena), and always keep them below 1 so a single surprising action cannot rule a world out completely.</p>`},
{h:'The value of information',body:R`<p>As seer, choose whom to divine by expected entropy reduction. With belief \(p\) over worlds, entropy is \(H(p) = -\sum_w p_w\log p_w\). Divining player \(j\) gives result \(r\) with probability \(P(r)\); pick the \(j\) that maximises \(H(p) - \sum_r P(r)H(p\mid r)\). The same reasoning decides which question to ask in discussion.</p>`}
],
learn:[
{h:'The game and the contest',body:R`<p>Werewolf (Mafia) is played in days and nights. By day everyone talks and votes to execute one player; by night werewolves attack, the seer divines one player’s team, the bodyguard protects someone and the medium learns whether the executed player was a werewolf. Villagers win by eliminating all werewolves; werewolves win when they are no fewer than the villagers.</p>
<p>The International AIWolf Competition 2026 ran natural-language tracks in English only: a <b>Turn-Based</b> track (5- and 9-player villages; the server asks each agent to speak) and an <b>Anytime Utterance</b> track (5-player; agents may speak at any time, up to 4 utterances per day). Teams had to pass a connection check with the official server. Matches were online in July and August, with papers at the AIWolfDial workshop co-located with INLG 2026. Top teams could be selected using subjective evaluation as well as win rates, so <b>how naturally and convincingly your agent talks matters</b>, not just whether it wins.</p>`},
{h:'Architecture of a strong agent',body:R`<ul><li><b>State tracker:</b> parse every utterance into structured facts (claims, accusations, divination reports, votes).</li>
<li><b>Belief module:</b> the Bayesian world model above, or a classifier (Chapter 18 arena).</li>
<li><b>Strategy module:</b> role-specific decisions: when the seer reveals, whether a wolf fakes a seer claim, whom to vote for.</li>
<li><b>Language module:</b> an LLM writes the utterance from the structured decision and the conversation, in a consistent persona.</li>
<li><b>Consistency checker:</b> rejects utterances that contradict your own earlier claims or the known facts.</li></ul>
<p>Keeping decisions structured and using the LLM for language makes the agent both stronger and easier to debug than asking an LLM to do everything.</p>`},
{h:'Timing and cost',body:R`<p>In the Anytime Utterance track, <i>when</i> you speak is a strategic choice: speaking first sets the agenda, speaking last lets you respond. Measure LLM latency and keep a fast fallback utterance for when generation is too slow. Track API cost per game; local open models avoid cost and rate limits.</p>`}
],
primer:R`<ul><li>Enumerate or sample role assignments; update by Bayes’ rule.</li><li>Choose actions that reduce uncertainty (or, as a wolf, increase it).</li><li>Structured decisions + LLM language + consistency checks.</li><li>Judged on naturalness too: test your agent’s talk with people.</li></ul>`,
drill:'From blank, write the 5-player world enumeration, a Bayes update after a seer claim, and the posterior “werewolf probability” per player, in under <b>15 minutes</b>.',
ex:[
{t:'Belief over worlds',d:2,tag:'AIWolf',q:R`<p>Implement world enumeration for the 5-player village from each role’s point of view, with likelihood functions for votes, claims and divination reports. Test on logged games: how often is the top-probability player actually the werewolf on day 2?</p>`,
py:R`
import itertools
import numpy as np

ROLES_5 = ["VILLAGER", "VILLAGER", "SEER", "POSSESSED", "WEREWOLF"]

def worlds(me: str, my_role: str, players: list[str]):
    others = [p for p in players if p != me]
    remaining = ROLES_5.copy(); remaining.remove(my_role)
    seen = set()
    for perm in itertools.permutations(remaining):
        if perm in seen:
            continue
        seen.add(perm)
        yield dict(zip(others, perm))

def likelihood(world: dict, event: dict) -> float:
    # TODO: P(event | world), e.g. a seer claim by a non-seer is likely only for POSSESSED/WEREWOLF
    return 1.0

def posterior(ws: list[dict], events: list[dict]) -> np.ndarray:
    p = np.ones(len(ws)) / len(ws)
    for e in events:
        # TODO: multiply by likelihoods, renormalise, floor tiny values
        pass
    return p
`},
{t:'A protocol agent first',d:2,tag:'AIWolf',q:R`<p>Before natural language, make your agent play your 5-player simulator with structured messages only (claim, accuse, report). Tune strategy for each role until it beats your scripted agents on every role.</p>`},
{t:'Language from structured decisions',d:2,tag:'AIWolf',q:R`<p>Give an LLM the structured state and the chosen intent (for example “claim seer, report Agent[03] is human, accuse Agent[05] citing their vote”) and ask for one short, natural English utterance in a fixed persona. Parse the output back with your state tracker to check it says what was intended.</p>`},
{t:'Consistency checker',d:2,tag:'AIWolf',q:R`<p>Write rules (and optionally an LLM judge) that reject utterances contradicting your previous claims or known facts. Measure how often your raw LLM output would have contradicted itself over 100 games.</p>`},
{t:'Persuasion experiments',d:3,tag:'AIWolf',q:R`<p>Play your agent against several LLM agent personas you write (gullible, suspicious, aggressive, quiet). Measure vote influence: how often other agents vote with your accusation. Try two accusation styles and compare with intervals.</p>`},
{t:'Enter the contest',d:1,tag:'AIWolf',q:R`<p>Follow the official AIWolf natural-language pages for the next contest’s rules and server. Pass the connection check early, enter the first round, analyse your logs with the official viewer, improve, and enter the second round. Submit a paper to AIWolfDial describing your agent.</p>`}
]},

{id:'a6',part:'PA',n:'A6',title:'Your Competition Calendar',time:'ongoing',
goal:'Choose competitions that are actually running, set targets, and keep improving between them.',
needs:['a1'],
learn:[
{h:'Status of your four competitions (as of October 2026)',body:R`<ul><li><b>International AIWolf Contest:</b> running. The 2026 edition had English natural-language tracks with rounds in July and August. Expect a similar schedule in 2027 and check the AIWolf pages each spring.</li>
<li><b>Halite:</b> Two Sigma’s official seasons ended; Halite IV (Kaggle, 2020) was the last. The Softmax Halite league runs a bit-exact Halite IV port with continuous rounds and an MMR leaderboard, so you can compete any time.</li>
<li><b>Pommerman:</b> NeurIPS competitions ran in 2018 and 2019. The environment is open source; use it for training, research and papers.</li>
<li><b>MineRL:</b> NeurIPS competitions ran 2019–2022 (Diamond, then BASALT). Datasets and VPT models remain available; Minecraft remains a research testbed.</li></ul>`},
{h:'Running alternatives that fit your goals',body:R`<ul><li><b>NeurIPS competitions:</b> the list changes every year and is announced around July. 2026 included RoboSynChallenge on generalisable dexterous manipulation, directly on your robotics path.</li>
<li><b>IJCAI competitions:</b> 2026 included the International Mahjong AI Competition (imperfect information, multi-player), ANAC (automated negotiation agents, a multi-agent classic), and AI Olympics with RealAIGym (RL on a real double pendulum, see the Chapter 27 arena).</li>
<li><b>Kaggle simulation competitions:</b> Kaggle periodically runs game-AI competitions with agents playing each other, like Halite IV did. Watch its competitions page.</li>
<li><b>IEEE Conference on Games:</b> hosts game-AI competitions each year.</li></ul>`},
{h:'A realistic two-year target',body:R`<p>For your master’s years, a strong plan is: <b>AIWolf</b> as the main contest (it runs, it is multi-agent, it fits language-model agents, and it has a workshop for papers), the <b>Softmax Halite league</b> as a continuous benchmark of engineering skill, and one <b>new NeurIPS or IJCAI competition</b> each year that matches your research. Use Pommerman and MineRL as research benchmarks for papers. Aim for a top-3 finish in at least one contest and a workshop paper about it each year.</p>`}
],
primer:R`<ul><li>AIWolf and the Softmax Halite league are running; Pommerman and MineRL are benchmarks now.</li><li>Check NeurIPS (around July), IJCAI and CoG lists every year.</li><li>Two primary competitions, one stretch competition, one paper per year.</li></ul>`,
drill:'Without notes, list your next three competition deadlines and what your bot must achieve by each.',
ex:[
{t:'Build your calendar',d:1,tag:'All',q:R`<p>Make a calendar (in Claude Tasks, a spreadsheet or your phone) with every competition’s registration, connection-check and submission dates for the next 12 months, plus reminders 4 weeks before each.</p>`},
{t:'Pick and justify',d:1,tag:'All',q:R`<p>Choose your two primary competitions and one stretch competition for 2027. For each, write what skill it builds, what result you aim for, and which chapters of this book you need first.</p>`},
{t:'Post-mortem template',d:1,tag:'All',q:R`<p>Write a template for after each contest: final rank, what worked, what failed (with evidence), what the winners did differently (read their write-ups), and three changes for next time.</p>`},
{t:'Watch the new calls',d:1,tag:'All',q:R`<p>When the NeurIPS 2027 and IJCAI 2027 competition lists appear, read every multi-agent, games, RL and robotics entry, and decide within a week whether to enter one.</p>`},
{t:'Find a teammate',d:1,tag:'All',q:R`<p>Many winning entries are small teams. Find one or two collaborators (lab mates, the rover team, online communities around each competition), agree on roles and a repository, and plan a weekly sync.</p>`}
]}
);
})();
