(function(){
const R=String.raw;
const L=window.BOOK.lessons=window.BOOK.lessons||{};

L.c15={needs:['g3','c04'],
learn:[
{h:'What a NumPy array is',body:R`<p>A Python list is a list of pointers to separate objects scattered in memory. A NumPy <b>array</b> is one block of memory holding numbers of a single type (<code>dtype</code>, e.g. <code>float64</code>) side by side, plus a <b>shape</b> telling how to read it as rows and columns. Operations on whole arrays run as tight C loops.</p>`,
code:{py:R`
import numpy as np
a = np.array([[1, 2, 3], [4, 5, 6]], dtype=np.float64)
print(a.shape, a.dtype, a.ndim)      # (2, 3) float64 2
print(a[0, 2], a[:, 1], a[1])        # 3.0  [2. 5.]  [4. 5. 6.]
print(a * 10 + 1)                    # element-wise, no loop
print(a.sum(), a.sum(axis=0), a.sum(axis=1))   # 21.0 [5. 7. 9.] [ 6. 15.]
print(np.zeros((3, 2)), np.arange(5), np.linspace(0, 1, 5))
`},
after:R`<p><b>axis</b> is the dimension that gets <i>collapsed</i>. <code>axis=0</code> sums down the rows (one result per column); <code>axis=1</code> sums across columns (one per row). <code>a[:, 1]</code> means “all rows, column 1”.</p>`},
{h:'Broadcasting rules',body:R`<p>When two arrays of different shapes meet in an operation, NumPy compares shapes from the <b>right</b>. Two dimensions are compatible if they are equal or one of them is 1; a size-1 dimension is stretched to match (without copying). <code>None</code> in an index inserts a new size-1 axis.</p>
<p>For pairwise distances: <code>P</code> is (N, 2), <code>Q</code> is (M, 2). <code>P[:, None, :]</code> is (N, 1, 2), <code>Q[None, :, :]</code> is (1, M, 2). Subtracting gives (N, M, 2): every point of P minus every point of Q. Summing the squares over the last axis gives (N, M).</p>`},
{h:'Masks and fancy indexing',body:R`<p>A comparison like <code>a &gt; 0</code> produces a boolean array of the same shape. Using it as an index, <code>a[a &gt; 0]</code>, picks the true positions. Indexing with an integer array, <code>a[[0, 2]]</code>, picks those rows. Both return <b>copies</b>. Plain slices like <code>a[1:3]</code> return <b>views</b> that share memory, so writing to a view changes the original.</p>`},
{h:'Random numbers the modern way',body:R`<p>Use a generator object: <code>rng = np.random.default_rng(seed)</code>, then <code>rng.random(shape)</code>, <code>rng.normal(mean, std, shape)</code>, <code>rng.integers(lo, hi, size)</code>. Passing a seed makes results reproducible, which is essential for research.</p>`}
],
math:[
{h:'Distances through a matrix product',body:R`<p>Expanding the square:</p>
\[ \lVert \mathbf{p} - \mathbf{q} \rVert^2 = \lVert\mathbf{p}\rVert^2 + \lVert\mathbf{q}\rVert^2 - 2\,\mathbf{p}\cdot\mathbf{q}. \]
<p>For all pairs at once, the cross term is the matrix product \(PQ^\top\) (shape \(N\times M\)), which runs on highly optimised BLAS code. Rounding can make tiny results slightly negative, so clip at 0 before the square root.</p>`},
{h:'Moving average with cumulative sums',body:R`<p>With \(C_i = \sum_{j \lt i} x_j\) (and \(C_0 = 0\)), the mean of window \(x_i..x_{i+k-1}\) is \((C_{i+k} - C_i)/k\): the 1D prefix sum from Chapter 5.</p>`}
]};

L.c16={needs:['g4','c04'],
learn:[
{h:'The memory hierarchy',body:R`<p>A CPU can do an addition in under a nanosecond, but reading main memory takes around 100 ns. Caches hide this: small fast memories (L1 ≈ 1 ns, L2 ≈ 4 ns, L3 ≈ 15 ns) holding recently used data. Memory moves in <b>cache lines</b> of 64 bytes. Reading <code>x[0]</code> also brings in <code>x[1]..x[7]</code> for doubles. So code that walks memory in order is fast, and code that jumps around is slow, even with the same number of operations.</p>`},
{h:'Copies, moves and the rule of five',body:R`<p>A class that owns a resource (memory, a file) must define what happens when it is copied, moved and destroyed. Those are five special functions: destructor, copy constructor, copy assignment, move constructor, move assignment. <b>Rule of zero:</b> if you hold resources only through <code>std::vector</code>, <code>std::string</code> and <code>std::unique_ptr</code>, you write none of them, because the members already do the right thing. <b>Rule of five:</b> if you write one, think about all five.</p>
<p>A <b>move</b> leaves the source empty and takes its resources; it is triggered by temporaries and by <code>std::move(x)</code>. Mark move constructors <code>noexcept</code> so <code>std::vector</code> can use them when it grows.</p>`},
{h:'Compiler flags you should know',body:R`<ul><li><code>-O0</code>: no optimisation, best for debugging. <code>-O2</code>: standard release. <code>-O3 -march=native</code>: aggressive, may use your CPU’s SIMD instructions.</li>
<li><code>-g</code>: keep debug information.</li>
<li><code>-fsanitize=address</code>: catches out-of-bounds and use-after-free. <code>-fsanitize=undefined</code>: catches overflow and other undefined behaviour.</li>
<li><code>-Wall -Wextra -Wpedantic</code>: warnings. Treat every warning as a bug.</li></ul>`}
],
math:[
{h:'Estimating bandwidth-bound code',body:R`<p>Updating 1M particles with 4 floats each reads and writes \(10^6 \times 4 \times 4\,\text{B} \times 2 = 32\) MB per step. At about 20 GB/s of memory bandwidth, the lower bound is \(32\text{ MB} / 20\text{ GB/s} \approx 1.6\) ms per step, however clever the arithmetic. If an array-of-structs layout drags 64 extra bytes per particle through the cache, you move about 5× more data and get about 5× slower. Doing this arithmetic before optimising tells you what speed-up is even possible.</p>`}
]};

L.c17={needs:['c15'],
learn:[
{h:'The anatomy of training',body:R`<p>Every learning algorithm in this book is the same loop:</p>
<ol><li><b>Predict</b> with the current parameters.</li><li><b>Measure</b> how wrong the predictions are with a loss.</li><li>Compute the <b>gradient</b>: which direction makes the loss grow fastest.</li><li><b>Step</b> the parameters a little in the opposite direction.</li><li>Repeat, and record the loss so you can see whether it is working.</li></ol>`},
{h:'Matrix operations in NumPy',body:R`<p><code>X @ w</code> is matrix–vector multiplication. <code>X.T</code> is the transpose. For data, the convention is one row per example: <code>X</code> has shape <code>(n, d)</code> for n examples with d features. Always write shapes in comments; most ML bugs are shape bugs.</p>`},
{h:'Plotting a loss curve',body:R`<p><code>import matplotlib.pyplot as plt; plt.plot(history); plt.yscale("log"); plt.xlabel("epoch"); plt.ylabel("MSE"); plt.show()</code>. A healthy curve falls quickly and then flattens. A curve that rises or oscillates means the learning rate is too big.</p>`}
],
math:[
{h:'The model and the loss',body:R`<p>Given \(n\) examples with features \(\mathbf{x}_i \in \mathbb{R}^d\) and targets \(y_i\), linear regression predicts \(\hat y_i = \mathbf{w}^\top\mathbf{x}_i + b\). Stacking examples as rows of \(X \in \mathbb{R}^{n\times d}\):</p>
\[ \hat{\mathbf{y}} = X\mathbf{w} + b, \qquad L(\mathbf{w}, b) = \frac{1}{n}\lVert X\mathbf{w} + b - \mathbf{y}\rVert^2 = \frac{1}{n}\sum_{i=1}^n (\hat y_i - y_i)^2. \]`},
{h:'Deriving the gradient',body:R`<p>Let the error vector be \(\mathbf{e} = X\mathbf{w} + b - \mathbf{y}\). Then \(L = \frac{1}{n}\mathbf{e}^\top\mathbf{e}\). By the chain rule, \(\partial L/\partial \mathbf{e} = \frac{2}{n}\mathbf{e}\), and \(\partial \mathbf{e}/\partial\mathbf{w} = X\), so</p>
\[ \nabla_{\mathbf{w}} L = \frac{2}{n} X^\top\mathbf{e}, \]
\[ \frac{\partial L}{\partial b} = \frac{2}{n}\sum_i e_i. \]
<p>Check with \(d = 1\): \(L = \frac1n\sum(wx_i + b - y_i)^2\), so \(\partial L/\partial w = \frac{2}{n}\sum x_i e_i\), which is exactly \(\frac2n X^\top\mathbf{e}\).</p>`},
{h:'Gradient descent and the exact solution',body:R`<p>Gradient descent repeats \(\mathbf{w} \leftarrow \mathbf{w} - \eta\,\nabla_{\mathbf{w}}L\) with learning rate \(\eta\). The loss is a convex quadratic, so it has one minimum, where the gradient is zero:</p>
\[ X^\top(X\mathbf{w} - \mathbf{y}) = 0 \;\Longrightarrow\; X^\top X\,\mathbf{w} = X^\top\mathbf{y}. \]
<p>These are the <b>normal equations</b> (absorb \(b\) by adding a column of ones to \(X\)). Gradient descent converges if \(\eta \lt 2/\lambda_{\max}\), where \(\lambda_{\max}\) is the largest eigenvalue of \(\frac{2}{n}X^\top X\). Features with very different scales stretch the eigenvalues apart, forcing a tiny \(\eta\). That is why standardising features, \(x \leftarrow (x - \mu)/\sigma\), speeds training dramatically.</p>`},
{h:'Ridge regression',body:R`<p>Adding \(\lambda\lVert\mathbf{w}\rVert^2\) penalises large weights. The gradient gains a \(2\lambda\mathbf{w}\) term, and the closed form becomes \((X^\top X + n\lambda I)\mathbf{w} = X^\top\mathbf{y}\) (the factor \(n\) comes from our \(\frac1n\) scaling). The added \(\lambda I\) also makes the system solvable when \(X^\top X\) is singular.</p>`}
]};

L.c18={needs:['c17'],
learn:[
{h:'Labels as integers and one-hot vectors',body:R`<p>For classes 0..K−1, store labels as integers <code>y</code> of shape (n,). Some formulas need <b>one-hot</b> rows: class 2 of 4 becomes <code>[0, 0, 1, 0]</code>; build it with <code>np.eye(K)[y]</code>. <code>P[np.arange(n), y]</code> picks, for each row i, the probability assigned to its true class <code>y[i]</code>.</p>`},
{h:'Train, validation, test',body:R`<p>Fit parameters on the <b>training</b> set. Choose settings such as learning rate or k on the <b>validation</b> set. Report the final number once on the <b>test</b> set. Touching the test set while choosing settings makes your result optimistic and is a common reason papers fail to reproduce.</p>`}
],
math:[
{h:'From scores to probabilities',body:R`<p>Logistic regression computes a score \(z = \mathbf{w}^\top\mathbf{x} + b\) and squashes it with the sigmoid \(\sigma(z) = \frac{1}{1 + e^{-z}}\), giving \(p = P(y = 1 \mid \mathbf{x})\). Useful facts: \(\sigma(-z) = 1 - \sigma(z)\) and \(\sigma'(z) = \sigma(z)(1 - \sigma(z))\).</p>`},
{h:'Cross-entropy from likelihood',body:R`<p>The probability of observing label \(y \in \{0, 1\}\) is \(p^y(1-p)^{1-y}\). Maximising the likelihood over all examples is the same as minimising the negative log-likelihood:</p>
\[ L = -\frac{1}{n}\sum_i \big[y_i\log p_i + (1 - y_i)\log(1 - p_i)\big]. \]
<p>Differentiate with respect to \(z_i\) using \(\sigma' = p(1-p)\):</p>
\[ \frac{\partial L_i}{\partial z_i} = -\big[y_i(1-p_i) - (1-y_i)p_i\big] = p_i - y_i. \]
<p>So</p>
\[ \nabla_{\mathbf{w}}L = \frac1n X^\top(\mathbf{p} - \mathbf{y}). \]
<p>It is the same shape as linear regression’s gradient. This is not a coincidence: both are “generalised linear models”.</p>`},
{h:'Softmax for many classes',body:R`<p>With \(K\) classes, compute scores \(\mathbf{z} = W^\top\mathbf{x} + \mathbf{b}\) and</p>
\[ p_k = \frac{e^{z_k}}{\sum_j e^{z_j}}, \qquad L = -\log p_{y}. \]
<p>The gradient with respect to the scores is \(\mathbf{p} - \mathbf{e}_y\) (one-hot), so for a batch \(\nabla_W = \frac1n X^\top(P - Y)\). Since softmax does not change when you subtract a constant from every score, subtract \(\max_j z_j\) first so \(e^{z}\) never overflows. The same trick gives a stable <b>log-sum-exp</b>: \(\log\sum_j e^{z_j} = m + \log\sum_j e^{z_j - m}\).</p>`},
{h:'Precision, recall, F1',body:R`<p>For one class, count true positives TP, false positives FP and false negatives FN. Precision \(= \frac{TP}{TP + FP}\) (of what I flagged, how much was right). Recall \(= \frac{TP}{TP + FN}\) (of what was there, how much I found). \(F_1 = \frac{2PR}{P + R}\), their harmonic mean. Macro-averaging takes the mean over classes.</p>`}
]};

L.c19={needs:['c17'],
learn:[
{h:'Using the SVD',body:R`<p><code>U, S, Vt = np.linalg.svd(Xc, full_matrices=False)</code> factorises a centred data matrix as \(X_c = U\,\mathrm{diag}(S)\,V^\top\). The rows of <code>Vt</code> are the principal directions, and <code>S**2 / (n - 1)</code> are the variances along them. Projection to k dimensions: <code>Xc @ Vt[:k].T</code>. Reconstruction: <code>Z @ Vt[:k] + mean</code>.</p>`},
{h:'Reading a decision tree',body:R`<p>Each internal node asks one question, such as “is petal length &lt; 2.45?”, and sends the example left or right. Leaves predict the majority class. Training chooses, at each node, the question that makes the two children as <b>pure</b> as possible, then recurses. Depth limits and minimum leaf sizes stop it from memorising noise.</p>`}
],
math:[
{h:'k-means minimises within-cluster distance',body:R`<p>The objective is \(J = \sum_i \lVert\mathbf{x}_i - \boldsymbol{\mu}_{c(i)}\rVert^2\). The assignment step chooses the nearest centre for each point, which cannot increase \(J\). The update step sets each centre to the mean of its points, which minimises \(\sum_{i \in k}\lVert\mathbf{x}_i - \boldsymbol\mu\rVert^2\) (set the gradient \(-2\sum(\mathbf{x}_i - \boldsymbol\mu)\) to zero). So \(J\) never increases and the algorithm stops, though possibly at a local minimum. Hence k-means++ and several restarts.</p>`},
{h:'PCA as an eigenvalue problem',body:R`<p>Find the unit vector \(\mathbf{u}\) maximising the variance of the projection \(X_c\mathbf{u}\): maximise \(\mathbf{u}^\top S\,\mathbf{u}\) with \(S = \frac{1}{n-1}X_c^\top X_c\) subject to \(\mathbf{u}^\top\mathbf{u} = 1\). A Lagrange multiplier gives \(S\mathbf{u} = \lambda\mathbf{u}\): the best direction is the top eigenvector, and its variance is \(\lambda\). From the SVD, \(S = V\frac{\mathrm{diag}(S)^2}{n-1}V^\top\), so the right singular vectors are exactly these eigenvectors.</p>`},
{h:'Gini impurity',body:R`<p>For a node with class proportions \(p_k\), \(G = 1 - \sum_k p_k^2\): the probability that two random samples from the node have different labels. A split into left and right children is scored by \(\frac{n_L}{n}G_L + \frac{n_R}{n}G_R\); pick the split with the smallest score.</p>`},
{h:'EM for a Gaussian mixture',body:R`<p>The model is \(p(x) = \sum_k \pi_k\,\mathcal{N}(x \mid \mu_k, \sigma_k^2)\). <b>E-step:</b> responsibilities \(r_{ik} = \frac{\pi_k\mathcal{N}(x_i\mid\mu_k,\sigma_k^2)}{\sum_j \pi_j\mathcal{N}(x_i\mid\mu_j,\sigma_j^2)}\). <b>M-step:</b> with \(N_k = \sum_i r_{ik}\), set \(\pi_k = N_k/n\), \(\mu_k = \frac{1}{N_k}\sum_i r_{ik}x_i\), \(\sigma_k^2 = \frac{1}{N_k}\sum_i r_{ik}(x_i - \mu_k)^2\). Each iteration never decreases the log-likelihood. k-means is the limit as all variances shrink to zero.</p>`}
]};

L.c20={needs:['c18'],
learn:[
{h:'A network as layers',body:R`<p>A neural network is a chain of layers. A <b>linear layer</b> computes \(XW + b\). An <b>activation</b> such as ReLU, \(\max(0, z)\), adds non-linearity; without it, stacked linear layers would collapse into one. The last layer produces scores, and softmax plus cross-entropy turns them into a loss.</p>
<p>In code, every layer is a class with two methods: <code>forward</code> computes the output and <b>saves</b> what backward will need; <code>backward</code> receives the gradient of the loss with respect to its output and returns the gradient with respect to its input, storing gradients for its own parameters. This is the OOP from Part 0 doing real work.</p>`},
{h:'Closures, used in autograd',body:R`<p>In <code>Value.__add__</code>, the inner function <code>_backward</code> uses <code>self</code>, <code>other</code> and <code>out</code> from the surrounding function even after it returns. A function that remembers variables from where it was created is a <b>closure</b>. Each operation stores a closure that knows how to push gradients to its inputs; <code>backward()</code> runs them in reverse topological order (children before parents, from the output back).</p>`}
],
math:[
{h:'The chain rule on a graph',body:R`<p>If \(L\) depends on \(z\) and \(z\) depends on \(x\), then \(\frac{\partial L}{\partial x} = \frac{\partial L}{\partial z}\frac{\partial z}{\partial x}\). If \(x\) feeds several nodes, add the contributions: \(\frac{\partial L}{\partial x} = \sum_j \frac{\partial L}{\partial z_j}\frac{\partial z_j}{\partial x}\). That is why autograd uses <code>grad +=</code>, never <code>=</code>. Backpropagation applies this from the loss backwards, reusing each \(\partial L/\partial z\) once.</p>`},
{h:'Backward pass of a linear layer',body:R`<p>Forward: \(Y = XW + \mathbf{b}\), with \(X\) of shape \((n, d_{in})\) and \(W\) of shape \((d_{in}, d_{out})\). Given \(G = \partial L/\partial Y\) of shape \((n, d_{out})\):</p>
\[ \frac{\partial L}{\partial W} = X^\top G, \qquad \frac{\partial L}{\partial \mathbf{b}} = \sum_{i} G_{i,:}, \qquad \frac{\partial L}{\partial X} = G\,W^\top. \]
<p>Shape check: \(X^\top G\) is \((d_{in}, n)(n, d_{out}) = (d_{in}, d_{out})\), the same shape as \(W\). If shapes match, the formula is usually right. Element-wise, \(Y_{ij} = \sum_k X_{ik}W_{kj} + b_j\), so \(\partial L/\partial W_{kj} = \sum_i X_{ik}G_{ij}\), which is \((X^\top G)_{kj}\).</p>
<p>ReLU: \(\partial L/\partial z = G \odot \mathbb{1}[z \gt 0]\). Softmax with cross-entropy (from Chapter 18): \(\partial L/\partial Z = (P - Y)/n\).</p>`},
{h:'Gradient checking',body:R`<p>The central difference \(\frac{f(\theta + \varepsilon) - f(\theta - \varepsilon)}{2\varepsilon}\) has error \(O(\varepsilon^2)\) (Taylor-expand both terms: the \(\varepsilon^2\) terms cancel). Compare with your analytic gradient by relative error \(\frac{|g_a - g_n|}{\max(|g_a| + |g_n|, 10^{-12})}\). Values below \(10^{-6}\) in float64 mean your backward pass is right.</p>`},
{h:'Why initialisation matters',body:R`<p>If inputs to a layer have variance \(v\) and weights are drawn with variance \(\sigma^2\), each output sums \(d_{in}\) terms, so its variance is about \(d_{in}\sigma^2 v\). To keep the signal from exploding or vanishing over many layers you want \(d_{in}\sigma^2 \approx 1\): Xavier/Glorot uses \(\sigma^2 = 1/d_{in}\) (or \(2/(d_{in}+d_{out})\)). ReLU zeroes half its inputs, halving the variance, so He initialisation doubles it: \(\sigma^2 = 2/d_{in}\).</p>`},
{h:'Momentum and Adam',body:R`<p>Momentum keeps a running average of gradients, \(\mathbf{m} \leftarrow \beta\mathbf{m} + \mathbf{g}\), and steps with \(\mathbf{m}\), which smooths out zig-zags. Adam also tracks the average squared gradient \(\mathbf{v}\) and divides by \(\sqrt{\mathbf{v}}\), so every parameter gets its own step size. The bias corrections \(\hat{\mathbf{m}} = \mathbf{m}/(1 - \beta_1^t)\) fix the fact that both averages start at zero.</p>`}
]};

L.c21={needs:['c20','g6'],
learn:[
{h:'Tensors and autograd',body:R`<p>A PyTorch <b>tensor</b> is like a NumPy array that can live on a GPU and can record operations. Create parameters with <code>requires_grad=True</code>; after computing a scalar loss, <code>loss.backward()</code> fills each parameter’s <code>.grad</code>, exactly like your <code>Value</code> class did. Gradients <b>accumulate</b>, which is why every step calls <code>optimizer.zero_grad()</code> first.</p>`,
code:{py:R`
import torch
w = torch.tensor([2.0, -1.0], requires_grad=True)
x = torch.tensor([3.0, 4.0])
loss = ((w * x).sum() - 1.0) ** 2      # ((6 - 4) - 1)^2 = 1
loss.backward()
print(w.grad)                          # tensor([6., 8.]) = 2*(1)*x
`}},
{h:'nn.Module: OOP in practice',body:R`<p>Every PyTorch model is a <b>subclass</b> of <code>nn.Module</code>. You create layers in <code>__init__</code> (after calling <code>super().__init__()</code>) and describe the computation in <code>forward</code>. Calling <code>model(x)</code> runs <code>forward</code>. Layers assigned as attributes are registered automatically, so <code>model.parameters()</code> finds all their weights for the optimiser.</p>`,
code:{py:R`
from torch import nn

class MLP(nn.Module):
    def __init__(self, d_in: int, d_hidden: int, d_out: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d_in, d_hidden), nn.ReLU(),
            nn.Linear(d_hidden, d_out),
        )

    def forward(self, x):
        return self.net(x)

model = MLP(2, 64, 2)
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()       # takes raw scores (logits), not softmax
`}},
{h:'Datasets, loaders, modes and devices',body:R`<p>A <code>Dataset</code> subclass defines <code>__len__</code> and <code>__getitem__(i)</code> returning one example. A <code>DataLoader</code> batches, shuffles and can load in parallel. <code>model.train()</code> and <code>model.eval()</code> switch layers like dropout and batch norm between behaviours. <code>@torch.no_grad()</code> is a decorator that turns off gradient recording inside the function, saving memory during evaluation. Move both the model and every batch to the same device with <code>.to(device)</code>.</p>`}
],
math:[
{h:'Scaled dot-product attention',body:R`<p>Given queries \(Q\), keys \(K\) and values \(V\) (each \(T \times d\) for a sequence of length \(T\)):</p>
\[ \mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d}}\right)V. \]
<p>Row \(t\) of \(QK^\top\) scores how much position \(t\) should look at every other position; softmax turns the scores into weights summing to 1; multiplying by \(V\) takes the weighted average of values. If entries of \(\mathbf{q}\) and \(\mathbf{k}\) have variance 1, their dot product has variance \(d\), which would push softmax into saturation; dividing by \(\sqrt{d}\) restores variance 1. A causal mask sets scores for future positions to \(-\infty\) so their weight becomes 0.</p>`}
]};

L.c22={needs:['c14','c15'],
learn:[
{h:'The RL loop',body:R`<p>An <b>agent</b> observes a <b>state</b>, chooses an <b>action</b>, and the <b>environment</b> returns a <b>reward</b> and the next state. The agent’s rule for choosing actions is its <b>policy</b>. The goal is to maximise total reward over time, not just the next reward. Unlike supervised learning, nobody tells the agent the right action; it must try things.</p>`},
{h:'Designing an environment class',body:R`<p>Use the Gym-style interface everywhere: <code>reset()</code> starts an episode and returns the first state; <code>step(action)</code> applies the action and returns <code>(next_state, reward, done)</code>. Keep the randomness inside the environment with its own seeded generator. For dynamic programming, also expose the model: <code>transitions(s, a)</code> returns every possible outcome with its probability.</p>`}
],
math:[
{h:'Bandits: estimating action values',body:R`<p>Each action \(a\) has an unknown mean reward \(q_*(a)\). The sample average after \(n\) rewards can be updated without storing them:</p>
\[ Q_{n+1} = \frac{1}{n}\sum_{i=1}^{n} R_i = Q_n + \frac{1}{n}\big(R_n - Q_n\big). \]
<p>This form, “estimate += step size × (target − estimate)”, appears in every RL algorithm. UCB adds an exploration bonus \(c\sqrt{\ln t / N(a)}\) that shrinks as an action is tried more.</p>`},
{h:'Markov decision processes',body:R`<p>An MDP is \((\mathcal{S}, \mathcal{A}, P, r, \gamma)\): states, actions, transition probabilities \(P(s' \mid s, a)\), rewards and a discount \(0 \le \gamma \lt 1\). The <b>return</b> from time \(t\) is</p>
\[ G_t = r_{t+1} + \gamma r_{t+2} + \gamma^2 r_{t+3} + \dots = \sum_{k=0}^{\infty}\gamma^k r_{t+k+1}. \]
<p>The value of state \(s\) under policy \(\pi\) is \(V^\pi(s) = \mathbb{E}_\pi[G_t \mid s_t = s]\). Since \(G_t = r_{t+1} + \gamma G_{t+1}\), values satisfy the <b>Bellman expectation equation</b>:</p>
\[ V^\pi(s) = \sum_a \pi(a\mid s)\sum_{s'} P(s'\mid s,a)\big[r(s,a,s') + \gamma V^\pi(s')\big]. \]`},
{h:'Optimality and value iteration',body:R`<p>The best possible values satisfy the <b>Bellman optimality equation</b>:</p>
\[ V^*(s) = \max_a \sum_{s'} P(s'\mid s,a)\big[r(s,a,s') + \gamma V^*(s')\big]. \]
<p>Value iteration applies the right-hand side as an update to every state, repeatedly. The update is a <b>contraction</b> in the max-norm: \(\lVert TV - TU\rVert_\infty \le \gamma\lVert V - U\rVert_\infty\). By the Banach fixed-point theorem, it converges to the unique \(V^*\) from any starting guess, with error shrinking by a factor \(\gamma\) per sweep. The optimal policy is greedy with respect to \(V^*\).</p>`}
]};

L.c23={needs:['c21','c22'],
learn:[
{h:'The Gymnasium API',body:R`<p><code>env = gym.make("CartPole-v1")</code>. <code>obs, info = env.reset(seed=0)</code>. Each step: <code>obs, reward, terminated, truncated, info = env.step(action)</code>. <b>terminated</b> means the task ended (the pole fell); <b>truncated</b> means a time limit cut the episode. The difference matters: do not bootstrap from the next state when terminated, but you should when truncated. <code>env.action_space.sample()</code> picks a random action.</p>`},
{h:'Why DQN needs two tricks',body:R`<p>Training a neural network on consecutive transitions fails: they are highly correlated, and the target moves every time you update. The <b>replay buffer</b> stores many past transitions and trains on random mini-batches, breaking correlation. The <b>target network</b> is a frozen copy of the Q-network, updated only every few hundred steps, so the targets stay still long enough to learn. <code>q_net(s).gather(1, a.unsqueeze(1))</code> picks, for each row, the Q-value of the action actually taken.</p>`}
],
math:[
{h:'Temporal-difference learning',body:R`<p>Instead of waiting for the full return, bootstrap from the current estimate of the next state. The <b>TD error</b> is \(\delta = r + \gamma V(s') - V(s)\), and TD(0) updates \(V(s) \leftarrow V(s) + \alpha\delta\). For action values:</p>
\[ \text{Q-learning: } Q(s,a) \leftarrow Q(s,a) + \alpha\big[r + \gamma\max_{a'}Q(s',a') - Q(s,a)\big] \]
\[ \text{SARSA: } Q(s,a) \leftarrow Q(s,a) + \alpha\big[r + \gamma Q(s',a') - Q(s,a)\big] \]
<p>Q-learning’s target uses the best next action whatever you actually do (<b>off-policy</b>): it learns the optimal policy’s values while exploring. SARSA uses the action you will actually take (<b>on-policy</b>), so it learns the value of the exploring policy, and on the cliff it learns that walking near the edge is dangerous when you sometimes take random steps.</p>`},
{h:'The DQN loss',body:R`<p>With network parameters \(\theta\) and target parameters \(\theta^-\):</p>
\[ y = r + \gamma(1 - d)\max_{a'}Q_{\theta^-}(s', a'), \qquad L(\theta) = \mathbb{E}\big[\ell\big(Q_\theta(s,a) - y\big)\big], \]
<p>where \(d = 1\) if the episode terminated and \(\ell\) is the Huber loss (quadratic near 0, linear far away, which limits the effect of large errors).</p>`},
{h:'The policy gradient',body:R`<p>For a policy \(\pi_\theta(a\mid s)\), we want to maximise \(J(\theta) = \mathbb{E}_{\tau\sim\pi_\theta}[G(\tau)]\). The <b>log-derivative trick</b>, \(\nabla_\theta p_\theta = p_\theta\nabla_\theta\log p_\theta\), gives \(\nabla J = \mathbb{E}[G(\tau)\nabla_\theta\log p_\theta(\tau)]\). The environment’s transition probabilities do not depend on \(\theta\), so they drop out of \(\nabla\log p_\theta(\tau)\), leaving</p>
\[ \nabla_\theta J = \mathbb{E}\Big[\sum_t \nabla_\theta\log\pi_\theta(a_t\mid s_t)\,\big(G_t - b(s_t)\big)\Big]. \]
<p>Subtracting a baseline \(b\) does not change the expectation, because</p>
\[ \mathbb{E}_a[\nabla\log\pi(a\mid s)] = \nabla\sum_a\pi(a\mid s) = \nabla 1 = 0, \]
<p>but it can greatly reduce variance. REINFORCE estimates this from sampled episodes; in code you minimise \(-\sum_t\log\pi(a_t\mid s_t)(G_t - b)\).</p>`}
]};

L.c24={needs:['c06','c23'],
learn:[
{h:'Animating a simulation',body:R`<p><code>matplotlib.animation.FuncAnimation(fig, update, frames=500, interval=20)</code> calls your <code>update(frame)</code> function repeatedly. Inside it, advance the simulation one step and update the plot’s data with <code>scatter.set_offsets(pos)</code> rather than redrawing everything. Return the changed artists. In a notebook, display with <code>HTML(anim.to_jshtml())</code>.</p>`},
{h:'The PettingZoo parallel API',body:R`<p>In a parallel environment every agent acts at once. <code>observations, infos = env.reset(seed=0)</code>; then <code>env.step(actions)</code>, where <code>actions</code> is a dict from agent name to action, returns five dicts keyed by agent name: observations, rewards, terminations, truncations, infos. <code>env.agents</code> lists the agents still active. Writing your own environment with the same shape (exercise 24.5) means you can later swap in library environments without changing your training code.</p>`},
{h:'Parameter sharing',body:R`<p>When agents are interchangeable, train <b>one</b> network for all of them, adding the agent’s id to its observation. Every agent’s experience trains the same weights, which multiplies the data and often learns much faster than separate networks.</p>`}
],
math:[
{h:'Boids as vector equations',body:R`<p>For boid \(i\) with neighbours \(\mathcal{N}_i\) (within radius \(r\)):</p>
\[ \mathbf{f}^{sep}_i = -\sum_{j\in\mathcal{N}_i}\frac{\mathbf{p}_j - \mathbf{p}_i}{\lVert\mathbf{p}_j - \mathbf{p}_i\rVert^2}, \quad \mathbf{f}^{ali}_i = \bar{\mathbf{v}}_{\mathcal{N}_i} - \mathbf{v}_i, \quad \mathbf{f}^{coh}_i = \bar{\mathbf{p}}_{\mathcal{N}_i} - \mathbf{p}_i. \]
<p>Separation pushes away from close neighbours, more strongly the closer they are; alignment steers toward the neighbours’ average velocity; cohesion steers toward their centre. Velocity changes by a weighted sum of the three, then is clipped to a maximum speed. Complex flocking emerges from these three local rules.</p>`},
{h:'Games and equilibria',body:R`<p>In a two-player matrix game, player 1 picks row \(i\), player 2 column \(j\), and they receive \(A_{ij}\) and \(B_{ij}\). A <b>Nash equilibrium</b> is a pair of (possibly random) strategies where neither player gains by changing alone. In the Prisoner’s Dilemma, mutual defection is the only equilibrium even though mutual cooperation pays both more. In matching pennies, the only equilibrium is mixed (50/50), and simple learners keep cycling around it instead of settling.</p>`},
{h:'Why multi-agent learning is harder',body:R`<p>For agent \(i\), the transition and reward depend on the joint action \(\mathbf{a} = (a_1, \dots, a_N)\). When the other agents’ policies \(\pi_{-i}\) change, agent \(i\)’s effective environment changes too:</p>
\[ P(s'\mid s, a_i) = \sum_{\mathbf{a}_{-i}}\pi_{-i}(\mathbf{a}_{-i}\mid s)\,P(s'\mid s, \mathbf{a}). \]
<p> It is no longer a fixed MDP, so the convergence guarantees from Chapter 22 no longer apply. Centralised training with decentralised execution (CTDE) methods address this by letting a critic see all agents during training.</p>`}
]};

L.c25={needs:['c03','c13','c17'],
learn:[
{h:'Sense, plan, act',body:R`<p>Every robot program is a loop running at a fixed rate (say 50 Hz): <b>sense</b> (read sensors and update the state estimate), <b>plan</b> (decide where to go), <b>act</b> (compute motor commands). Keep the time step fixed and pass <code>dt</code> explicitly to every function. Most robot bugs are frame bugs (which coordinate frame is this point in?) or unit bugs (degrees vs radians, mm vs m), so name variables with both: <code>p_world_m</code>, <code>heading_rad</code>.</p>`},
{h:'Frames',body:R`<p>A <b>frame</b> is a coordinate system: the world frame, the robot’s body frame (x forward, y left), the lidar’s frame. A transform \(T_{AB}\) converts coordinates from frame B into frame A. Name transforms that way in code (<code>T_world_robot</code>) and chains become easy to check: \(T_{WL} = T_{WR}\,T_{RL}\); the inner letters must match.</p>`}
],
math:[
{h:'Poses as homogeneous transforms',body:R`<p>A 2D pose \((x, y, \theta)\) maps body coordinates to world coordinates by rotating then translating: \(\mathbf{p}_W = R(\theta)\mathbf{p}_B + \mathbf{t}\). Appending a 1 to every point turns this into one matrix multiply:</p>
\[ T = \begin{pmatrix} \cos\theta & -\sin\theta & x \\ \sin\theta & \cos\theta & y \\ 0 & 0 & 1 \end{pmatrix}, \qquad \begin{pmatrix}\mathbf{p}_W \\ 1\end{pmatrix} = T\begin{pmatrix}\mathbf{p}_B \\ 1\end{pmatrix}. \]
<p>Rotation matrices are orthogonal, \(R^{-1} = R^\top\). Solving \(\mathbf{p}_W = R\mathbf{p}_B + \mathbf{t}\) for \(\mathbf{p}_B\) gives \(\mathbf{p}_B = R^\top\mathbf{p}_W - R^\top\mathbf{t}\), hence \(T^{-1} = \begin{pmatrix} R^\top & -R^\top\mathbf{t} \\ 0 & 1 \end{pmatrix}\).</p>`},
{h:'Two-link arm kinematics',body:R`<p>Forward: \(x = L_1\cos q_1 + L_2\cos(q_1 + q_2)\), \(y = L_1\sin q_1 + L_2\sin(q_1 + q_2)\).</p>
<p>Inverse: the distance \(r^2 = x^2 + y^2\) from the shoulder to the hand forms a triangle with sides \(L_1, L_2\). The law of cosines gives \(\cos q_2 = \frac{r^2 - L_1^2 - L_2^2}{2L_1L_2}\), with two solutions \(q_2 = \pm\arccos(\cdot)\) (elbow down and up). Then</p>
\[ q_1 = \operatorname{atan2}(y, x) - \operatorname{atan2}(L_2\sin q_2,\ L_1 + L_2\cos q_2). \]
<p>Always use <code>atan2</code>, which handles all four quadrants.</p>`},
{h:'The Jacobian',body:R`<p>The Jacobian \(J(\mathbf{q}) = \partial\mathbf{x}/\partial\mathbf{q}\) maps joint velocities to hand velocity: \(\dot{\mathbf{x}} = J\dot{\mathbf{q}}\). For the 2-link arm, with \(s_{12} = \sin(q_1+q_2)\) and so on:</p>
\[ J = \begin{pmatrix} -L_1 s_1 - L_2 s_{12} & -L_2 s_{12} \\ L_1 c_1 + L_2 c_{12} & L_2 c_{12} \end{pmatrix}. \]
<p>To move the hand by a small error \(\mathbf{e}\), solve \(J\Delta\mathbf{q} = \mathbf{e}\). Near singular poses (arm fully stretched, \(\det J = L_1L_2\sin q_2 = 0\)), plain inversion explodes; <b>damped least squares</b> \(\Delta\mathbf{q} = J^\top(JJ^\top + \lambda^2 I)^{-1}\mathbf{e}\) stays bounded.</p>`},
{h:'Differential drive',body:R`<p>Wheel speeds \(v_l, v_r\) and wheel separation \(b\) give forward speed \(v = \frac{v_r + v_l}{2}\) and turn rate \(\omega = \frac{v_r - v_l}{b}\). The pose evolves as \(\dot x = v\cos\theta,\ \dot y = v\sin\theta,\ \dot\theta = \omega\). Euler integration has error \(O(\Delta t)\) per unit time; RK4 averages four slope estimates and has error \(O(\Delta t^4)\), so it drifts far less on long runs.</p>`},
{h:'PID control',body:R`<p>With error \(e(t)\) = desired − measured:</p>
\[ u(t) = K_p\,e(t) + K_i\int_0^t e(\tau)\,d\tau + K_d\,\frac{de}{dt}. \]
<p>P reacts to the present error, I removes steady offsets by accumulating past error, and D damps oscillation by reacting to the trend. In discrete time, the integral is a running sum \(\sum e\,\Delta t\) and the derivative \((e_k - e_{k-1})/\Delta t\). Clamp the integral (anti-windup) so it cannot grow huge while the actuator is saturated. Heading errors must be wrapped into \([-\pi, \pi]\), or the robot will turn the long way round.</p>`},
{h:'The Kalman filter',body:R`<p>State estimate \(\mathbf{x}\) with covariance \(P\) (our uncertainty). Motion model \(\mathbf{x}_{k} = F\mathbf{x}_{k-1} + \mathbf{w}\) with noise covariance \(Q\); measurement \(\mathbf{z} = H\mathbf{x} + \mathbf{v}\) with noise covariance \(R\).</p>
\[ \textbf{Predict: } \mathbf{x} \leftarrow F\mathbf{x}, \qquad P \leftarrow FPF^\top + Q \]
\[ \textbf{Update: } K = PH^\top(HPH^\top + R)^{-1}, \quad \mathbf{x} \leftarrow \mathbf{x} + K(\mathbf{z} - H\mathbf{x}), \quad P \leftarrow (I - KH)P \]
<p>Prediction grows uncertainty; a measurement shrinks it. The gain \(K\) balances the two: in 1D, \(K = \frac{P}{P + R}\), so a precise sensor (small \(R\)) is trusted almost fully and a noisy one barely moves the estimate. For linear models with Gaussian noise, this is the optimal estimate.</p>`}
]};
})();
