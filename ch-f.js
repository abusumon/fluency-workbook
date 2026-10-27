(function(){
const R=String.raw;
window.BOOK.chapters.push(
/* ================= PART 9 · FRONTIERS & THE PHD ROAD ================= */
{id:'c35',part:'P9',n:35,title:'Where Robots Still Fail',time:'10 days',
goal:'Understand the open problems of embodied AI well enough to choose one to work on.',
needs:['c24','c33'],
math:[
{h:'Reliability compounds',body:R`<p>If each step of a task succeeds independently with probability \(p\), a task of \(n\) steps succeeds with probability \(p^n\). At \(p = 0.95\): 10 steps give 0.60, 20 give 0.36, 50 give 0.08. To make a 50-step task succeed 90% of the time you need \(p = 0.9^{1/50} \approx 0.998\) per step. This one formula explains why impressive demos rarely become dependable products, and why recovering from mistakes matters as much as avoiding them.</p>`},
{h:'How many trials do you need?',body:R`<p>With \(k\) successes in \(n\) trials, \(\hat p = k/n\), and an approximate 95% interval is \(\hat p \pm 1.96\sqrt{\hat p(1-\hat p)/n}\) (use the Wilson interval for small \(n\) or \(\hat p\) near 0 or 1). To pin a success rate near 85% within ±5 points you need \(n \approx 1.96^2 \cdot 0.85 \cdot 0.15 / 0.05^2 \approx 196\) trials. Many robot papers report 10–20. Be the researcher who reports intervals.</p>`},
{h:'A safety filter you can prove',body:R`<p>A <b>control barrier function</b> \(h(\mathbf x)\) is positive in the safe set (for example \(h = \lVert\mathbf p - \mathbf p_{obs}\rVert^2 - r^2\)). If every control satisfies</p>
\[ \dot h(\mathbf x, \mathbf u) \ge -\alpha\,h(\mathbf x),\quad \alpha \gt 0, \]
<p>then \(h\) can never cross zero, so the robot provably stays safe. A <b>safety filter</b> takes any proposed action, including one from a neural network, and minimally corrects it: \(\mathbf u^* = \arg\min_{\mathbf u}\lVert\mathbf u - \mathbf u_{nn}\rVert^2\) subject to that constraint, a small quadratic program. Guarantees like this for learned policies are an active research area.</p>`},
{h:'Distribution shift, formally',body:R`<p>A policy trained on states from distribution \(d_{train}\) is deployed on \(d_{test}\). Its error can be bounded by its training error plus a term measuring how different the two distributions are. In robotics, the shift comes from three places at once: the simulator differs from reality, the learner’s own mistakes move it to new states (Chapter 30), and the world changes (new objects, lighting, people). Much of embodied AI research is about shrinking or surviving this shift.</p>`}
],
learn:[
{h:'Moravec’s paradox',body:R`<p>Tasks that are hard for people, like chess, calculus or writing code, turned out to be relatively easy for machines. Tasks a toddler does without thinking, like walking on gravel, opening an unfamiliar door or folding a towel, remain hard. Evolution spent hundreds of millions of years optimising perception and motor control; it spent very little on symbolic reasoning. This is why progress in language models has not automatically produced capable robots.</p>`},
{h:'The open problems',body:R`<ul><li><b>Data.</b> Language models learned from a vast internet of text. No such corpus of robot actions exists. Teams try simulation at scale, teleoperation fleets, human video and cross-robot datasets. Nobody yet knows the right recipe or how much data is enough.</li>
<li><b>Sim-to-real.</b> Contact, friction, deformable objects and sensor noise are hard to simulate faithfully, so policies trained in simulation often break on hardware.</li>
<li><b>Dexterity and touch.</b> Human hands combine many degrees of freedom with dense tactile sensing. Robot hands and tactile sensors are improving but remain far behind, especially for deformable and slippery objects.</li>
<li><b>Long-horizon reliability.</b> The compounding formula above. Detecting and recovering from failure is under-studied.</li>
<li><b>Generalisation.</b> Policies that work in the lab often fail with new objects, rooms or robot bodies.</li>
<li><b>Safety and verification.</b> Proving properties of neural controllers, and keeping robots safe around people.</li>
<li><b>Evaluation.</b> Real-world tests are slow and expensive, results are noisy, and benchmarks are easy to overfit.</li>
<li><b>Coordination.</b> Many robots and people sharing open environments (the whole next chapter).</li></ul>`},
{h:'Why many expect a “GPT moment” for robots, and why it has not happened yet',body:R`<p>The bet behind humanoid companies and labs like GEAR is that the language-model recipe, large pretrained models plus massive data plus scaling, will transfer to physical action. Vision-language-action models are early evidence. What remains unknown is whether scaling laws hold for robot data the way they did for text, how much real-world data is needed beyond simulation and video, and whether hardware cost and reliability can keep up. These unknowns are exactly where a PhD student can contribute.</p>`}
],
primer:R`<ul><li>Per-step reliability compounds; recovery matters.</li><li>Report success rates with confidence intervals and enough trials.</li><li>Safety filters (CBFs) can wrap learned policies.</li><li>Data, sim-to-real, dexterity, reliability, generalisation, safety, evaluation and coordination are open.</li></ul>`,
drill:'Explain from memory, with one formula or number each, four open problems in embodied AI, in under <b>5 minutes</b>, as if in a PhD interview.',
ex:[
{t:'Reliability tables',d:1,q:R`<p>Plot task success \(p^n\) for \(p \in \{0.9, 0.95, 0.99, 0.999\}\) and \(n\) up to 100. Then model recovery: after a failure, the robot retries with probability \(r\) of fixing it. Derive and plot the new success curve. How much does a 50% recovery rate help?</p>`},
{t:'Measure your own sim-to-real gap',d:2,q:R`<p>Treat one simulator setting as “sim” and another (different friction, mass, sensor delay, actuator noise) as “real”. Measure how your best policy from Chapter 27 or 30 degrades as the gap grows. Write down which mismatch hurts most and propose one fix.</p>`},
{t:'Build a safety filter',d:3,q:R`<p>A 2D single-integrator robot \(\dot{\mathbf p} = \mathbf u\) follows a nominal controller (or a learned policy) toward a goal past circular obstacles. Implement the CBF quadratic program with CVXPY and show it never enters an obstacle, even when the nominal controller points straight through. Note where it gets stuck (a known limitation).</p>`,
py:R`
import numpy as np
import cvxpy as cp

def safe_action(p, u_nom, obstacles, alpha=1.0):
    u = cp.Variable(2)
    cons = []
    for c, r in obstacles:
        h = np.sum((p - c) ** 2) - r ** 2
        grad_h = 2 * (p - c)                   # dh/dp
        # TODO: constraint grad_h @ u >= -alpha * h
    prob = cp.Problem(cp.Minimize(cp.sum_squares(u - u_nom)), cons)
    prob.solve()
    return u.value
`},
{t:'How many trials?',d:1,q:R`<p>Write a function returning the Wilson 95% interval for k successes in n trials. Simulate a policy with true success 0.8 and show how often a 10-trial evaluation reports 1.0 or below 0.6. Then decide how many trials your own experiments need.</p>`},
{t:'Map the frontier',d:2,q:R`<p>Pick 6 papers from the latest CoRL, RSS or ICRA proceedings, one per open problem in this chapter. For each write three lines: problem, key idea, what remains unsolved according to the authors’ own limitations section.</p>`},
{t:'Your open-problem statement',d:2,q:R`<p>Write one page in the form: “Robots still cannot X, because Y. Existing approaches A and B fail when Z. I would test idea W by experiment E.” Keep it. You will refine it into your PhD statement of purpose in Chapter 37.</p>`}
]},

{id:'c36',part:'P9',n:36,title:'Coordinating in Open Worlds',time:'14 days',
goal:'Go beyond fixed teams in fixed games: agents that cooperate with strangers, humans and changing populations.',
needs:['c24','c35'],
math:[
{h:'Dec-POMDPs',body:R`<p>A cooperative team with partial observability is a decentralised POMDP \(\langle \mathcal{I}, \mathcal{S}, \{\mathcal{A}_i\}, P, R, \{\Omega_i\}, O, \gamma\rangle\): agents \(i \in \mathcal{I}\) each choose \(a_i\) from their own observation history \(\tau_i\), the joint action \(\mathbf a\) drives the shared state, and all receive the shared reward \(R(s, \mathbf a)\). The goal is a joint policy \(\boldsymbol\pi = (\pi_1, \dots, \pi_n)\) maximising \(\mathbb{E}\big[\sum_t\gamma^t R(s_t, \mathbf a_t)\big]\). Solving Dec-POMDPs exactly is NEXP-complete, so everything practical is approximate.</p>`},
{h:'Value decomposition',body:R`<p>Centralised training, decentralised execution (CTDE) learns with global information but deploys policies that use only local observations. For decentralised greedy actions to also be jointly greedy, the team value should satisfy the <b>IGM</b> condition: \(\arg\max_{\mathbf a}Q_{tot} = (\arg\max_{a_1}Q_1, \dots, \arg\max_{a_n}Q_n)\). <b>VDN</b> assumes \(Q_{tot} = \sum_i Q_i\). <b>QMIX</b> allows any mixing that is monotonic, \(\frac{\partial Q_{tot}}{\partial Q_i} \ge 0\), which is sufficient for IGM. MAPPO, a centralised-critic PPO, is a strong and simple baseline.</p>`},
{h:'Zero-shot coordination',body:R`<p>Self-play trains agents that cooperate superbly with <i>copies of themselves</i>, often through arbitrary conventions (“I always go left”). Paired with an independently trained partner, they can fail completely. Zero-shot coordination asks for policies that do well with partners trained independently by the same method:</p>
\[ \max_\pi\ \mathbb{E}_{\pi_A, \pi_B \sim \text{independent runs}}\big[J(\pi_A, \pi_B)\big]. \]
<p><b>Other-play</b> trains against partners transformed by the game’s symmetries, removing arbitrary conventions. Population-based methods train against diverse partners instead of one.</p>`},
{h:'Ad hoc teamwork as inference',body:R`<p>An agent meeting an unknown teammate can keep a belief over teammate types \(\theta\) and update it from observed actions by Bayes’ rule, \(b'(\theta) \propto \pi_\theta(a_{tm}\mid s)\,b(\theta)\), then best-respond to the mixture. This is the Bayes filter of Chapter 28, applied to other minds.</p>`},
{h:'Multi-robot path finding',body:R`<p>In warehouses, hundreds of robots must reach goals without collisions. <b>Conflict-Based Search</b> (CBS) plans each robot alone with A*, finds the first conflict (two robots in one cell at one time), and branches: in one child robot 1 must avoid that (cell, time); in the other, robot 2 must. The search over constraints is optimal for the sum of path costs, and much faster than planning in the joint space, whose size grows exponentially with the number of robots.</p>`}
],
learn:[
{h:'What makes a world “open”',body:R`<ul><li><b>Unknown teammates:</b> partners not seen in training, including humans (ad hoc teamwork, zero-shot coordination).</li>
<li><b>Changing populations:</b> agents join, leave or fail mid-task (open agent systems).</li>
<li><b>Partial observability and limited communication:</b> bandwidth, delays and dropouts, as on real rover teams.</li>
<li><b>Mixed motives:</b> agents that are neither fully cooperative nor adversarial, like cars at an intersection (social dilemmas).</li>
<li><b>Open-ended tasks:</b> goals and environments that change, so no fixed benchmark captures success.</li></ul>
<p>Most multi-agent RL results assume the opposite of all five. That gap is your research opportunity.</p>`},
{h:'Benchmarks and tools',body:R`<p><b>Overcooked-AI</b> tests cooperation with humans and unseen partners in a cooking game. DeepMind’s <b>Melting Pot</b> evaluates generalisation to new co-players across many social situations. <b>Hanabi</b> is a classic for partial observability and conventions. <b>SMAC/SMACv2</b> and <b>PettingZoo</b> cover cooperative control. For language-model agents, multi-agent coordination is being studied in games and software environments, a fast-moving area worth following.</p>`},
{h:'Key papers to read first',body:R`<ul><li>Stone et al. (2010), ad hoc autonomous agent teams: the problem statement.</li>
<li>Rashid et al. (2018), QMIX.</li>
<li>Carroll et al. (2019), on learning about humans for human–AI coordination (Overcooked).</li>
<li>Hu et al. (2020), “Other-Play” for zero-shot coordination.</li>
<li>Yu et al. (2021), the surprising effectiveness of PPO in cooperative multi-agent games (MAPPO).</li>
<li>Sharon et al. (2015), Conflict-Based Search for multi-agent path finding.</li></ul>`}
],
primer:R`<ul><li>Dec-POMDP is the model; CTDE is the practical recipe.</li><li>Self-play learns conventions that break with strangers; test cross-play.</li><li>Infer unknown teammates with Bayesian beliefs.</li><li>CBS scales coordinated path planning.</li></ul>`,
drill:'Explain, with a small example, why self-play can fail in cross-play, and how other-play addresses it, in under <b>5 minutes</b>.',
ex:[
{t:'The self-play trap',d:2,q:R`<p>Make a two-agent gridworld “cooking” task with two symmetric routes. Train two independent pairs with self-play (different seeds). Report each pair’s self-play score, then swap partners and report cross-play. Show the conventions each pair invented.</p>`},
{t:'Other-play on a lever game',d:2,q:R`<p>Implement the lever coordination game from the Other-Play paper (many symmetric levers paying 1, one distinct lever paying 0.9). Train with self-play and with other-play (random symmetry permutation of the partner), and compare cross-play scores.</p>`},
{t:'VDN versus independent learners',d:3,q:R`<p>On your predator–prey environment (24.5) with a reward that needs both predators, compare independent Q-learners with VDN (\(Q_{tot} = Q_1 + Q_2\) trained on the team reward). Plot capture rate over 10 seeds with confidence bands.</p>`},
{t:'Meeting a stranger',d:2,q:R`<p>Create three scripted teammate types (always-left, always-right, follows-you). Your agent keeps a Bayesian belief over types from observed actions and best-responds. Compare with an agent trained only with one type when paired with each type.</p>`,
py:R`
import numpy as np

TYPES = ["left", "right", "follow"]

def teammate_likelihood(type_name, state, action) -> float:
    # TODO: probability that a teammate of this type takes this action in this state
    return 1.0 / 3

def update_belief(belief: np.ndarray, state, action) -> np.ndarray:
    lik = np.array([teammate_likelihood(t, state, action) for t in TYPES])
    # TODO: Bayes rule with normalisation; guard against all-zero
    return belief

def best_response(belief, state):
    # TODO: choose the action with highest expected team reward under the belief
    return 0
`},
{t:'Conflict-Based Search',d:3,q:R`<p>Implement CBS with space-time A* (13.7) as the low-level planner for 4–8 robots on a warehouse-like grid. Compare solution cost and run time with prioritised planning, and find a case where prioritised planning fails but CBS succeeds.</p>`},
{t:'Agents that invent a language',d:2,q:R`<p>Lewis signalling game: a speaker sees one of 5 objects and sends one of 5 symbols; a listener sees only the symbol and guesses the object; both get +1 if correct. Train both with REINFORCE and show an emergent code. Add noise to the channel and see how the protocol changes.</p>`},
{t:'Open population robustness',d:2,q:R`<p>In your boids or predator–prey world, make agents join and leave at random. Train with a fixed team size and test with changing sizes. Then train with random sizes (shared parameters, 24.6) and compare. Report what breaks.</p>`},
{t:'Run a real benchmark',d:3,q:R`<p>Install Overcooked-AI or Melting Pot, run a provided baseline, and evaluate against held-out partners or co-players. Write a short report on where the baseline fails and one idea to fix it. This can become a first research project.</p>`}
]},

{id:'c37',part:'P9',n:37,title:'Becoming a Robotics Researcher',time:'ongoing',
goal:'Turn skills into research output, and research output into a PhD admission and an industry research career.',
needs:['c34','c35','c36'],
learn:[
{h:'What PhD committees look for',body:R`<p>Top robotics PhD programs (MIT, CMU, and leading Japanese universities) admit students who show they can already do research. In practice that means:</p>
<ul><li><b>Research experience</b> with a clear personal contribution, ideally a paper or preprint (workshops count).</li>
<li><b>Strong letters</b> from researchers who supervised your research and can compare you to others.</li>
<li><b>Fit:</b> named faculty whose current work matches yours, shown through specifics in your statement.</li>
<li><b>Technical depth:</b> math, code and systems, evidenced by projects others can see (GitHub, project page, videos).</li></ul>
<p>Grades and test scores are filters; research is the deciding factor.</p>`},
{h:'Choosing a problem',body:R`<p>Ask three questions: Is it important (would solving it change what robots can do)? Is it tractable in 6–12 months with your resources? Do you have an edge (math background, a simulator you built, access to hardware)? Start small: a clean experiment that answers one question well beats an ambitious system that half-works. Your open-problem statement from Chapter 35 is the seed.</p>`},
{h:'Venues and visibility',body:R`<ul><li><b>Robotics:</b> ICRA and IROS (large, broad), RSS and CoRL (selective; CoRL focuses on robot learning).</li>
<li><b>Learning:</b> NeurIPS, ICML, ICLR, including their robotics and multi-agent workshops.</li>
<li><b>Multi-agent:</b> AAMAS.</li>
<li>Post preprints on arXiv, make a project page with videos, release clean code. Labs like GEAR and companies like Figure notice people through their public work.</li></ul>`},
{h:'Contacting potential advisors',body:R`<p>Read a professor’s last three papers before writing. A good email is short: who you are (mathematics background, current research), one specific connection to their recent paper, one concrete result of yours with a link, and a clear question (are they taking students for a given year?). For Japanese programs, contacting the supervisor first is often required; for example, UTokyo’s Mechano-Informatics doctoral guide says applicants must receive guidance from their prospective advisor before applying.</p>`},
{h:'From PhD to industry research',body:R`<p>Most researchers at labs like NVIDIA GEAR, Google DeepMind robotics and Figure joined after a PhD or through <b>research internships during it</b>. Aim for one or two internships in the middle years of the PhD: NVIDIA Research, Google DeepMind student researcher roles, Toyota Research Institute, the RAI Institute (formerly the Boston Dynamics AI Institute), and in Japan, Sony AI, Preferred Networks and OMRON SINIC X. Publications from those internships are often what leads to a full-time offer.</p>`}
],
primer:R`<ul><li>Research output and letters decide admissions.</li><li>Pick important, tractable problems where you have an edge.</li><li>Publish at ICRA/IROS/RSS/CoRL (and learning venues); make your work visible.</li><li>Internships during the PhD are the bridge to industry labs.</li></ul>`,
drill:'Give a 3-minute spoken summary of your research: problem, why it matters, what you did, what you found, what is next. Record it and repeat until it is clear to a non-expert.',
ex:[
{t:'Know your field',d:1,q:R`<p>List 20 recent papers (last two years) in your chosen problem area with venue, lab and one-line contribution. Note which labs appear repeatedly: those are your candidate advisors.</p>`},
{t:'Reproduce, then extend',d:3,q:R`<p>Reproduce one result from a recent CoRL, RSS or AAMAS paper with code available, with proper seeds and confidence intervals (Chapter 34 habits). Then test it in one condition the authors did not, such as a new partner type, more agents or added noise. Write it up as a 4-page workshop paper.</p>`},
{t:'Project page',d:1,q:R`<p>Build a one-page project site for your best work: title, abstract, a teaser video or GIF, method figure, results with intervals, code link and citation. GitHub Pages is enough.</p>`},
{t:'Advisor shortlist',d:1,q:R`<p>Make a table of 15 faculty across your target universities: name, university, the 2 most relevant recent papers, why your work fits, and whether they appear to be recruiting. Keep it updated every term.</p>`},
{t:'Statement of purpose draft',d:2,q:R`<p>Write a 2-page statement: the problem that drives you (from your open-problem statement), what you have done toward it with concrete results, what you want to do next, and why each named advisor’s lab is the place to do it. Ask two researchers to critique it.</p>`},
{t:'Research talk',d:2,q:R`<p>Prepare a 10-minute talk on your project for a lab meeting or an interview: motivation, one key figure, results, limitations, next steps. Present it to peers and collect three questions you could not answer well.</p>`},
{t:'Internship plan',d:1,q:R`<p>List 8 research internship programs with application windows, eligibility (many require current PhD enrolment), and what kind of publication record their past interns had. Put the windows in your calendar.</p>`}
]}
);
})();
