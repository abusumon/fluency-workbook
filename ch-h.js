(function(){
const R=String.raw;
window.BOOK.chapters.push(
/* ================= RESEARCH TRACK ================= */
{id:'r1',part:'PR',n:'R1',title:'Research From Day One',time:'start now, ongoing',
goal:'Start thinking, reading and recording like a researcher in your first week, long before your first paper.',
needs:['g2'],
learn:[
{h:'What research actually is',body:R`<p>Research is turning a question nobody has answered into evidence that answers it, and then convincing other experts. Coding, math and competitions are tools. Research skill is the judgment around them: choosing good questions, designing experiments that could prove you wrong, and explaining results honestly. You can practise that judgment from week one, even on tiny problems.</p>`},
{h:'The weekly research rhythm',body:R`<p>Alongside the book (about 2 hours a day, 5 days a week), add:</p>
<ul><li><b>3 papers skimmed, 1 read deeply</b> every week, using the three-pass method from Chapter 34. Start with classics (DQN, AlphaGo, PPO, QMIX, Other-Play), then recent papers in your area.</li>
<li><b>1 small replication</b> every two weeks: reproduce one figure, table or claim, however small.</li>
<li><b>Research journal</b> every day you work: date, what you tried, what happened, what you think it means, next step. Ten lines is enough.</li>
<li><b>1 question log</b>: every time you think “why does that work?” or “would that still work if…?”, write it down. These become your research ideas.</li></ul>`},
{h:'How to read when you do not know enough yet',body:R`<p>Early on, most papers will contain things you have not learned. That is normal. On the first pass, aim only to understand the problem and the claim. Mark every unknown term and look up only the ones the main idea depends on. After a few months of the book, re-read the same papers: seeing how much more you understand is one of the best signs of progress.</p>`},
{h:'Picking your research area early',body:R`<p>Your paper path in this book is <b>hidden-role and open-world multi-agent coordination</b>, with AIWolf as the testbed. It uses your mathematics (Bayesian inference, game theory), it connects to competitions you will actually enter, it fits LLM-agent workshops that exist at NeurIPS, and it leads naturally to multi-robot coordination for your PhD. Keep it unless a supervisor offers a better-supported project; joining a lab’s existing direction is often the faster path.</p>`}
],
primer:R`<ul><li>Read 3 papers a week (1 deeply), replicate something every two weeks.</li><li>Keep a research journal and a question log from day one.</li><li>Default area: hidden-role, open-world multi-agent coordination with AIWolf.</li></ul>`,
drill:'Every Sunday, write five lines: the most interesting thing you read, the most surprising result you got, one new question, and the next step.',
ex:[
{t:'Set up your research system',d:1,q:R`<p>Create a Zotero library (free) with folders for “to read”, “read”, “core”. Create a <code>research-journal</code> repository or notebook with a daily template. Add the first 10 papers from this chapter’s list.</p>`},
{t:'Your first paper, first pass',d:1,q:R`<p>Do a first pass only on “Human-level control through deep reinforcement learning” (DQN, 2015). Write: the problem, the claim, the main figure in your own words, and every term you did not know. Re-read it after Chapter 23 and compare.</p>`},
{t:'Read the AIWolf literature',d:1,q:R`<p>Find the AIWolfDial workshop papers from the last two years (ACL Anthology). Skim five. For each, note the agent design, how it was evaluated, and its stated limitations. These limitations are your first research opportunities.</p>`},
{t:'A tiny replication',d:2,q:R`<p>After Chapter 22, reproduce the ε-greedy 10-armed bandit figure from Sutton &amp; Barto with 2,000 runs. Compare your curve with the book’s and explain any difference. Put the code and figure in your journal repository.</p>`},
{t:'Question log, month one',d:1,q:R`<p>At the end of the first month, review your question log. Pick the three most interesting questions and write, for each, what experiment could answer it and what you would need to learn first.</p>`},
{t:'Find a research mentor',d:2,q:R`<p>Before your master’s starts, identify two or three researchers (at your future university, or authors of papers you liked) working near your area. Read their recent papers, then write short, specific emails asking about their work. Many mentors are found this way.</p>`}
]},

{id:'r2',part:'PR',n:'R2',title:'The NeurIPS 2027 Paper Sprint',time:'Apr – Sep 2027',
goal:'Go from a question to a submitted NeurIPS 2027 workshop paper, with the competition as your testbed.',
needs:['r1','a5','c28'],
math:[
{h:'Comparing two methods properly',body:R`<p>If methods A and B are run on the same seeds or the same opponent pools, use <b>paired</b> comparisons: compute per-seed differences \(d_i = x^A_i - x^B_i\), then the mean difference \(\bar d\) with standard error \(s_d/\sqrt n\). Pairing removes shared noise and usually needs far fewer runs than comparing two independent means. Report effect sizes (how big the difference is), not just whether it is “significant”.</p>`},
{h:'Many comparisons, false discoveries',body:R`<p>If you test 20 ablations at the 5% level, you expect about one “significant” result by pure chance. Correct for it: Bonferroni tests each at \(\alpha/m\); Holm’s method is less conservative. Better still, decide your main comparisons <b>before</b> running experiments and label the rest as exploratory.</p>`},
{h:'How many runs to plan',body:R`<p>To detect a true difference \(\delta\) between two win rates near \(p\) with about 80% power at the 5% level, you need roughly \(n \approx \frac{2(1.96 + 0.84)^2 p(1-p)}{\delta^2}\) games per method. For \(p = 0.5\) and \(\delta = 0.05\) that is about 1,570 games each. Plan compute and time from this before you start, not after.</p>`}
],
learn:[
{h:'Which NeurIPS target',body:R`<p>In 2026, NeurIPS main-track full papers were due on May 6 and workshop contributions were suggested for August 29, with workshops in December. Your realistic first target is a <b>NeurIPS 2027 workshop</b> (expect a similar late-August deadline; check each workshop’s call). Many workshops are <b>non-archival</b>, meaning you can later submit an extended version to a main conference. The main track becomes a goal for 2028, once you have a published result to build on and ideally a co-author with NeurIPS experience.</p>`},
{h:'Anatomy of a strong paper',body:R`<ol><li><b>One clear question</b> with a falsifiable answer, e.g. “Does explicit Bayesian belief tracking make LLM Werewolf agents more robust to unseen opponents?”</li>
<li><b>Strong baselines</b>: the best existing approach, a pure-LLM agent, a pure-rules agent. Weak baselines are the most common reason for rejection.</li>
<li><b>Fair evaluation</b>: held-out opponents, enough games, confidence intervals, and the same budget for all methods.</li>
<li><b>Ablations</b> showing which component matters.</li>
<li><b>Honest limitations</b>.</li>
<li><b>Clear writing</b>: one main figure that tells the story, and an introduction a reviewer can summarise in two sentences.</li></ol>`},
{h:'Writing the paper',body:R`<p>Write in LaTeX on Overleaf with the official NeurIPS style file for that year. Use this order: title and abstract (a draft, rewritten at the end), introduction (problem, why it matters, your contribution as 2–4 bullet points), related work, method, experimental setup, results, limitations, conclusion. Write the introduction and the figure list <b>before</b> running the big experiments; it reveals what evidence you actually need. NeurIPS requires a paper checklist on reproducibility and ethics, so read last year’s checklist at the start.</p>`},
{h:'Double-blind and arXiv',body:R`<p>NeurIPS reviewing is double-blind: remove your name, affiliation and identifying links (use an anonymous code repository). Check the current policy on posting preprints to arXiv during review. After submission, write a short project page and prepare to release clean code with the camera-ready version.</p>`},
{h:'The dated plan',body:R`<ul><li><b>April 2027:</b> fix the question; write a one-page proposal; build the evaluation harness (opponent pool, metrics, seeds).</li>
<li><b>May:</b> implement baselines and your method; first small results; write introduction and figure list.</li>
<li><b>June:</b> main experiments; first full draft; feedback from your supervisor or mentor.</li>
<li><b>July – August:</b> AIWolf contest rounds give real-opponent results; ablations; final figures.</li>
<li><b>Final two weeks:</b> rewrite the abstract and introduction, check every number against the logs, fill in the checklist, anonymise, and submit at least 24 hours early.</li>
<li><b>September – October:</b> extend for AIWolfDial or AAMAS; post on arXiv when allowed.</li></ul>`}
],
primer:R`<ul><li>First target: a NeurIPS 2027 workshop (~late August); main track in 2028.</li><li>One question, strong baselines, fair evaluation, ablations, honest limits.</li><li>Paired comparisons, planned run counts, correction for many tests.</li><li>Write the introduction and figure list before the big experiments.</li></ul>`,
drill:'Explain your paper in three sentences (problem, method, result) to someone outside your field, then answer “why should a reviewer care?” in one more.',
ex:[
{t:'One-page proposal',d:2,q:R`<p>Write: question, why it matters, hypothesis, method, baselines, evaluation (opponents, metrics, number of games from the power formula), risks, and a fallback if the main idea fails. Get feedback from a mentor before writing any experiment code.</p>`},
{t:'Evaluation harness first',d:2,q:R`<p>Build the harness that plays any agent against a fixed pool of held-out opponents for N games, logs everything with seeds and git hashes, and outputs win rates with paired confidence intervals. Freeze it before testing your method.</p>`},
{t:'Baselines that are hard to beat',d:2,q:R`<p>Implement three baselines: a strong rule-based agent, a pure-LLM agent with a careful prompt, and the best published approach you can reproduce. Tune each with the same effort you give your own method.</p>`},
{t:'Introduction and figure list',d:2,q:R`<p>Write the introduction and a list of every figure and table with the claim each will support. Mark which ones you do not yet have evidence for; those are your next experiments.</p>`},
{t:'Ablations and analysis',d:3,q:R`<p>Run your planned ablations with paired comparisons and Holm correction. Add one qualitative analysis: example games where belief tracking changed a decision, and failure cases where it did not help.</p>`},
{t:'Internal review',d:2,q:R`<p>Give the full draft to two people and ask them to review it using the official NeurIPS reviewer form. Fix every point raised by both, and answer the rest in your limitations section.</p>`},
{t:'Submit',d:1,q:R`<p>Final checks: page limit, anonymisation, checklist, every number traced to a log file, figures readable in black and white. Submit at least a day early. Then write a short post-mortem in your journal.</p>`}
]},

{id:'r3',part:'PR',n:'R3',title:'Habits of Elite Researchers',time:'ongoing',
goal:'Build the habits that compound over a career: taste, speed, communication and collaboration.',
needs:['r1'],
learn:[
{h:'Research taste',body:R`<p>The best researchers are not the ones who work the most hours; they choose better problems. Build taste deliberately: for every paper you read, ask why the authors chose this problem now, what made it tractable, and what they left out. Keep a list of problems you think are important but unsolved, and revisit it every month. Your open-problem statement (Chapter 35) is the start of this list.</p>`},
{h:'Fast iteration',body:R`<p>Speed of iteration decides how many ideas you can test. Keep a tiny, fast version of every experiment (a small environment, few seeds, minutes not hours) to kill bad ideas early, and only scale up ideas that survive. This is why the book pushes fast simulators, vectorised code and JAX: they are research tools, not just engineering skills.</p>`},
{h:'Communication',body:R`<p>Research only counts once others understand it. Practise three formats: a 3-minute verbal summary, a 10-minute talk with one key figure, and a written paper. Give a short talk in a reading group or lab meeting every month. Write short blog posts or threads explaining papers you read; teaching is the fastest way to find gaps in your understanding.</p>`},
{h:'Collaboration and mentorship',body:R`<p>Almost all strong papers are collaborations. Be the collaborator people want: reliable on deadlines, honest about results (especially negative ones), generous with credit, and quick to share code. Seek one senior mentor and one peer collaborator in every phase of your career. In return, help newer students; explaining your work to them sharpens it.</p>`},
{h:'Sustainability',body:R`<p>Elite research is a decade-long effort. Protect sleep and exercise, take one full rest day a week, and expect rejections: most strong papers were rejected at least once before acceptance. Track progress by skills and results gained each month, not by any single decision.</p>`}
],
primer:R`<ul><li>Choose problems carefully; keep an open-problem list.</li><li>Iterate fast at small scale; scale only what survives.</li><li>Talk, write and teach regularly.</li><li>Be a reliable, honest collaborator; find mentors.</li><li>Pace yourself for a decade.</li></ul>`,
drill:'Once a month, give a 10-minute talk on a paper or your own work to at least one other person, and note the questions you could not answer.',
ex:[
{t:'Open-problem list',d:1,q:R`<p>Start a document of important unsolved problems in your area, each with one sentence on why it matters and one on why it is hard. Add one per week from your reading.</p>`},
{t:'Reading group',d:1,q:R`<p>Start or join a weekly reading group (online is fine). Each week one person presents a paper in 15 minutes. Keep a shared list of papers covered.</p>`},
{t:'Explain a paper publicly',d:1,q:R`<p>Write a 600-word explanation of one paper you read deeply, with one figure you made yourself. Publish it on a blog or GitHub page.</p>`},
{t:'Kill ideas fast',d:2,q:R`<p>Take one idea from your question log, design the smallest experiment that could show it is wrong, and run it in under a day. Record the result in your journal, whether it worked or not.</p>`},
{t:'Monthly review',d:1,q:R`<p>On the last day of each month, write: skills gained, results produced, papers read, what slowed you down, and one change for next month. Compare with the roadmap and adjust.</p>`}
]}
);
})();
