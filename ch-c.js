window.BOOK.chapters.push(
/* ================= PART 3 ================= */
{id:'c15',part:'P3',n:15,title:'Fast Python with NumPy',time:'6 days',
goal:'Replace Python loops with array operations, and prove the speed-up with a profiler.',
primer:`<p>A Python loop costs about 50–100 ns per iteration. A NumPy operation runs the loop in C, often 50–200× faster. Research code in ML, RL and simulation is written this way.</p>
<ul><li><b>Measure first:</b> <code>python -m cProfile -s cumtime script.py</code>, or <code>%timeit</code> in Jupyter. Optimise only the hot spot.</li>
<li><b>Broadcasting:</b> shapes (N,1,2) and (1,M,2) combine to (N,M,2). This is how you compute all pairwise distances without a loop.</li>
<li><b>Masks:</b> <code>a[a &gt; 0]</code>, <code>np.where(cond, x, y)</code>.</li>
<li><b>Views vs copies:</b> slicing gives a view (no copy); fancy indexing with an index array gives a copy.</li>
<li>Always check <code>.shape</code> and <code>.dtype</code> when something looks wrong.</li></ul>`,
pattern:{py:`
import numpy as np

def pairwise_dist(P: np.ndarray, Q: np.ndarray) -> np.ndarray:
    """P: (N, 2), Q: (M, 2) -> (N, M) Euclidean distances."""
    diff = P[:, None, :] - Q[None, :, :]      # (N, M, 2)
    return np.sqrt((diff ** 2).sum(axis=-1))

rng = np.random.default_rng(0)
P, Q = rng.random((1000, 2)), rng.random((800, 2))
D = pairwise_dist(P, Q)
assert D.shape == (1000, 800)
`},
drill:'Without looking anything up, write a vectorised pairwise distance, a moving average with <code>cumsum</code>, and a boolean filter in under <b>5 minutes</b> total.',
ex:[
{t:'Kill the double loop',d:2,q:`<p>Write a pure-Python double loop for pairwise distances, then type the broadcast version. Assert they match with <code>np.allclose</code>. Time both for N = M = 2,000. Then use the identity ‖p−q‖² = ‖p‖² + ‖q‖² − 2p·q to make it use one matrix multiply, and time again.</p>`,
h:['<code>sq = (P**2).sum(1)[:, None] + (Q**2).sum(1)[None, :] - 2 * P @ Q.T</code>, then <code>np.sqrt(np.maximum(sq, 0))</code>.']},
{t:'Moving average with cumsum',d:1,q:`<p>Window-k moving average of a 10⁶-long noisy signal in O(n) without a Python loop. Compare to <code>np.convolve(x, np.ones(k)/k, "valid")</code>.</p>`,
h:['<code>c = np.cumsum(np.insert(x, 0, 0)); (c[k:] - c[:-k]) / k</code>.']},
{t:'Find the hot spot',d:1,q:`<p>Write a deliberately slow script (string building in a loop, list membership tests, a Python loop over a NumPy array). Run <code>cProfile</code>, find the top three hot spots, fix them one at a time and record the time after each fix in a comment.</p>`},
{t:'Game of Life in NumPy',d:2,q:`<p>A 500×500 toroidal Game of Life. Count neighbours by summing eight <code>np.roll</code> shifts, then apply the rules with boolean algebra. Animate 200 steps with matplotlib. Compare against a pure-Python loop on 100×100.</p>`,
py:`
import numpy as np

def step(board: np.ndarray) -> np.ndarray:
    n = np.zeros_like(board, dtype=np.int8)
    for dr in (-1, 0, 1):
        for dc in (-1, 0, 1):
            if dr or dc:
                n += np.roll(np.roll(board, dr, 0), dc, 1)
    # TODO: born = (n == 3) & ~board ; survive = board & ((n == 2) | (n == 3))
    return board
`},
{t:'10,000 bouncing particles',d:2,q:`<p>Positions <code>(N,2)</code> and velocities <code>(N,2)</code> in a unit box with gravity. One step updates all particles at once; wall collisions use masks to flip velocity components. Run N = 10⁴ for 1,000 steps in under 2 seconds. Check that energy decays when restitution &lt; 1.</p>`,
h:['<code>hit = pos[:, 1] &lt; 0; vel[hit, 1] *= -e; pos[hit, 1] = 0</code>.']},
{t:'Sensor table queries',d:1,q:`<p>A (10⁶, 4) array of (t, x, y, battery). Without loops: keep rows where battery &gt; 20; find the index of the maximum speed between consecutive rows; sort rows by battery with <code>argsort</code>; bin x into 10 bins with <code>np.digitize</code> and count with <code>np.bincount</code>.</p>`},
{t:'Views, copies, in-place',d:2,q:`<p>Predict, then check with <code>np.shares_memory</code>, whether each of these copies: <code>a[2:5]</code>, <code>a[[2,3,4]]</code>, <code>a.T</code>, <code>a.reshape(-1)</code> on a transposed array, <code>a[a&gt;0]</code>. Then compare <code>x = x + 1</code> with <code>x += 1</code> and <code>np.add(x, 1, out=x)</code> on a 10⁸-element array (watch memory).</p>`}
]},

{id:'c16',part:'P3',n:16,title:'C++ That Respects the Machine',time:'6 days',
goal:'Write C++ that avoids hidden copies, uses the cache well, and is checked by tools.',
primer:`<p>Most slow C++ comes from a few causes: copying big objects by accident, reallocating vectors, jumping around memory, and compiling without optimisation. Measure each with <code>std::chrono</code>.</p>
<ul><li>Pass large inputs by <code>const T&amp;</code>; return by value (the compiler elides the copy).</li>
<li><code>reserve()</code> when you know the final size.</li>
<li><b>Cache:</b> walk memory in order. A 2D <code>vector&lt;vector&lt;&gt;&gt;</code> traversed column-first can be 5–10× slower than row-first.</li>
<li><b>Structure of arrays</b> (all x’s together, all y’s together) often beats an array of structs in simulations.</li>
<li>Build debug runs with <code>-g -fsanitize=address,undefined</code> and release runs with <code>-O2</code> (or <code>-O3 -march=native</code>).</li></ul>`,
pattern:{cpp:`
#include <chrono>
#include <iostream>
#include <vector>

struct Particles {               // structure of arrays
    std::vector<float> x, y, vx, vy;
    explicit Particles(std::size_t n) : x(n), y(n), vx(n), vy(n) {}
    void step(float dt) {
        const std::size_t n = x.size();
        for (std::size_t i = 0; i < n; ++i) {
            vy[i] -= 9.81f * dt;
            x[i] += vx[i] * dt;
            y[i] += vy[i] * dt;
        }
    }
};

int main() {
    Particles p(1'000'000);
    auto t0 = std::chrono::steady_clock::now();
    for (int s = 0; s < 100; ++s) p.step(0.01f);
    auto ms = std::chrono::duration<double, std::milli>(std::chrono::steady_clock::now() - t0).count();
    std::cout << ms << " ms" << '\\n';
}
`},
drill:'Explain, with a benchmark you wrote, why row-major traversal is faster than column-major. Do it in under <b>15 minutes</b> including writing the code.',
ex:[
{t:'Value versus const reference',d:1,q:`<p>Pass a <code>std::vector&lt;double&gt;</code> of 10⁶ elements to a sum function 1,000 times by value and by <code>const&amp;</code>. Time both at <code>-O2</code>. Then try <code>std::string</code> of length 10 and explain why the gap is small.</p>`},
{t:'Reallocations you did not ask for',d:1,q:`<p>Push 10⁷ ints into a vector and print every time <code>capacity()</code> changes. Then <code>reserve</code> first and time both. Do the same with a vector of a struct that prints in its copy constructor and move constructor; mark the move constructor <code>noexcept</code> and see what changes.</p>`,
h:['Without <code>noexcept</code> on the move constructor, <code>std::vector</code> copies on reallocation to keep its exception guarantee.']},
{t:'Array of structs vs structure of arrays',d:3,q:`<p>A particle struct with x, y, vx, vy plus 48 bytes of other data (mass, colour, id…). Update only positions for 10⁶ particles, 100 steps. Compare AoS with the SoA pattern above. Write a two-sentence explanation about cache lines (64 bytes).</p>`},
{t:'Row versus column traversal',d:2,q:`<p>Sum a 4096×4096 matrix stored as one flat <code>std::vector&lt;double&gt;</code> (index <code>i*N+j</code>) in row order and column order. Then try <code>vector&lt;vector&lt;double&gt;&gt;</code>. Report all four times.</p>`},
{t:'Rule of five',d:3,q:`<p>Write a <code>Buffer</code> class that owns a raw <code>float*</code> array. Implement destructor, copy constructor, copy assignment (copy-and-swap), move constructor, move assignment. Print a line in each. Write a <code>main</code> that triggers each one exactly once. Then rewrite it with <code>std::unique_ptr&lt;float[]&gt;</code> and notice which ones you no longer need.</p>`,
cpp:`
#include <cstddef>
#include <utility>

class Buffer {
public:
    explicit Buffer(std::size_t n);
    ~Buffer();
    Buffer(const Buffer& other);
    Buffer& operator=(Buffer other);          // copy-and-swap handles both
    Buffer(Buffer&& other) noexcept;
    friend void swap(Buffer& a, Buffer& b) noexcept;
    float& operator[](std::size_t i) { return data_[i]; }
    std::size_t size() const { return n_; }
private:
    std::size_t n_ = 0;
    float* data_ = nullptr;
};
`},
{t:'Let the tools find the bug',d:2,q:`<p>Write a function with an off-by-one write past the end of a vector (<code>v[v.size()]</code>), and one that uses a dangling reference to a temporary. Compile with <code>-O0</code>, <code>-O2</code>, and <code>-g -fsanitize=address,undefined</code>. Record what each build does. Then turn on <code>-Wall -Wextra -Wpedantic -Werror</code> permanently.</p>`},
{t:'Faster matrix multiply',d:2,q:`<p>Naive <code>i,j,k</code> matrix multiply for N = 1024 on flat arrays. Reorder the loops to <code>i,k,j</code> and time again. Then block it with 64×64 tiles. Compare all three with NumPy’s <code>A @ B</code>, and explain why NumPy still wins (BLAS, SIMD, threads).</p>`}
]},

/* ================= PART 4 ================= */
{id:'c17',part:'P4',n:17,title:'Linear Models and Gradient Descent',time:'7 days',
goal:'Fit a model by minimising a loss, first exactly, then with gradient descent.',
primer:`<p>Almost all of machine learning is: choose a model f<sub>θ</sub>, choose a loss L(θ), and move θ against the gradient. Linear regression is the cleanest place to learn this, because you can check your gradient descent against the exact answer.</p>
<ul><li>Model: <code>ŷ = Xw + b</code>. Loss: mean squared error <code>(1/n)‖Xw + b − y‖²</code>.</li>
<li>Gradient: <code>∇w = (2/n) Xᵀ(Xw + b − y)</code>, <code>∇b = (2/n) Σ(Xw + b − y)</code>.</li>
<li>Exact solution: solve <code>XᵀX w = Xᵀy</code> with <code>np.linalg.lstsq</code> (never invert the matrix).</li>
<li><b>Standardise features</b> (zero mean, unit variance) or gradient descent will crawl.</li>
<li>Write every shape in a comment: <code># X: (n, d), w: (d,)</code>.</li></ul>`,
pattern:{py:`
import numpy as np

def fit_gd(X: np.ndarray, y: np.ndarray, lr: float = 0.1, epochs: int = 500):
    n, d = X.shape                     # X: (n, d), y: (n,)
    w, b = np.zeros(d), 0.0
    history = []
    for _ in range(epochs):
        err = X @ w + b - y            # (n,)
        history.append(np.mean(err ** 2))
        w -= lr * (2 / n) * (X.T @ err)
        b -= lr * (2 / n) * err.sum()
    return w, b, history
`},
drill:'Write gradient descent for linear regression with a loss curve from blank in under <b>8 minutes</b>, with shapes commented.',
ex:[
{t:'The exact answer',d:1,q:`<p>Generate <code>y = 3x + 2 + noise</code> for 200 points. Solve with <code>np.linalg.lstsq</code> on <code>[x, 1]</code>. Plot data and line. Your w should be close to 3 and b close to 2.</p>`},
{t:'Batch gradient descent',d:2,q:`<p>Type the pattern. Fit the same data and plot loss per epoch on a log scale. Try learning rates 0.001, 0.01, 0.1, 1.0 and describe what happens at each.</p>`},
{t:'Mini-batch SGD',d:2,q:`<p>Shuffle indices every epoch and update on batches of 32. Compare the loss curve with full-batch for the same number of gradient evaluations.</p>`,
h:['<code>perm = rng.permutation(n); for i in range(0, n, B): idx = perm[i:i+B]</code>.']},
{t:'Many features, standardised',d:2,q:`<p>Use scikit-learn’s California housing data (8 features). Fit with GD on raw features, then on standardised ones. Compare how many epochs each needs to reach the lstsq loss within 1%.</p>`},
{t:'Ridge regression',d:2,q:`<p>Add an L2 penalty λ‖w‖². Derive the gradient on paper, implement it, and also the closed form <code>(XᵀX + λI)w = Xᵀy</code>. Fit degree-12 polynomial features on 20 noisy points for several λ and plot the curves.</p>`},
{t:'Train, validate, test',d:2,q:`<p>Write <code>split(X, y, fractions, seed)</code> from scratch. Plot training and validation error against polynomial degree 1–15. Mark where overfitting starts.</p>`},
{t:'Linear regression in C++',d:3,q:`<p>Implement batch gradient descent in C++ on flat <code>std::vector&lt;double&gt;</code> arrays (no libraries), reading a CSV. Then repeat with the Eigen library. Check both against the Python result to 6 decimals.</p>`}
]},

{id:'c18',part:'P4',n:18,title:'Classification',time:'6 days',
goal:'Build classifiers from scratch and evaluate them honestly.',
primer:`<p>Classification predicts a label. Logistic regression is linear regression passed through a sigmoid and trained with cross-entropy loss. Softmax extends it to many classes. Neat fact: the gradient has the same shape as before, <code>Xᵀ(p − y)/n</code>.</p>
<ul><li>Numerical stability: never compute <code>log(sigmoid(z))</code> directly. Use <code>np.logaddexp</code> or subtract the max before <code>exp</code> in softmax.</li>
<li>Accuracy alone misleads on imbalanced data. Use precision, recall, F1 and the confusion matrix.</li>
<li>Choose hyperparameters with cross-validation, never on the test set.</li></ul>`,
pattern:{py:`
import numpy as np

def softmax(Z: np.ndarray) -> np.ndarray:
    Z = Z - Z.max(axis=1, keepdims=True)       # stability
    E = np.exp(Z)
    return E / E.sum(axis=1, keepdims=True)

def cross_entropy(P: np.ndarray, y: np.ndarray) -> float:
    n = len(y)
    return -np.log(P[np.arange(n), y] + 1e-12).mean()
`},
drill:'Write logistic regression training (forward, loss, gradient, update) from blank in under <b>8 minutes</b>.',
ex:[
{t:'Logistic regression',d:2,q:`<p>Two Gaussian blobs in 2D. Train logistic regression with GD, plot the decision boundary, and report accuracy.</p>`,
py:`
import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))     # TODO: make this stable for large |z|

def train_logreg(X, y, lr=0.1, epochs=1000):
    n, d = X.shape
    w, b = np.zeros(d), 0.0
    for _ in range(epochs):
        p = sigmoid(X @ w + b)
        # TODO: gradients and updates
    return w, b
`},
{t:'Stable sigmoid and log-sum-exp',d:2,q:`<p>Make <code>sigmoid</code> correct for z = ±1000 without warnings. Write <code>logsumexp(z)</code> and a stable binary cross-entropy from logits. Test against <code>scipy.special</code>.</p>`,
h:['For z ≥ 0 use <code>1/(1+exp(−z))</code>; for z &lt; 0 use <code>exp(z)/(1+exp(z))</code>.','BCE from logits: <code>max(z,0) − z·y + log(1+exp(−|z|))</code>.']},
{t:'Softmax regression on digits',d:3,q:`<p>Use <code>sklearn.datasets.load_digits</code> (8×8 images, 10 classes). Train softmax regression from scratch with mini-batches. Reach at least 94% test accuracy. Show the 10 learned weight images.</p>`},
{t:'Metrics by hand',d:1,q:`<p>Write <code>confusion_matrix</code>, <code>precision</code>, <code>recall</code>, <code>f1</code> for multiclass (macro average) from scratch. Check against <code>sklearn.metrics</code>.</p>`},
{t:'Vectorised k-nearest neighbours',d:2,q:`<p>kNN with your pairwise distance from 15.1 and <code>np.argpartition</code>. Plot accuracy against k on the digits data.</p>`},
{t:'k-fold cross-validation',d:2,q:`<p>Write <code>kfold_indices(n, k, seed)</code> and <code>cross_val_score(model_fn, X, y, k)</code>. Use it to pick k for kNN and the learning rate for softmax regression.</p>`}
]},

{id:'c19',part:'P4',n:19,title:'Clustering, PCA, Trees',time:'6 days',
goal:'Implement the unsupervised workhorses and a decision tree.',
primer:`<p>Unsupervised learning finds structure without labels. k-means groups points by nearest centre. PCA finds the directions of greatest variance and is just an SVD of centred data. Decision trees split data greedily to reduce impurity, and are the base of random forests and gradient boosting.</p>
<ul><li>k-means alternates two steps: assign points to the nearest centre, move each centre to the mean of its points.</li>
<li>PCA: <code>U, S, Vt = np.linalg.svd(X − mean, full_matrices=False)</code>. Rows of <code>Vt</code> are the components.</li>
<li>Your linear algebra background is a real advantage in this chapter. Derive before you code.</li></ul>`,
pattern:{py:`
import numpy as np

def kmeans(X: np.ndarray, k: int, iters: int = 100, seed: int = 0):
    rng = np.random.default_rng(seed)
    C = X[rng.choice(len(X), k, replace=False)]      # (k, d)
    for _ in range(iters):
        d2 = ((X[:, None, :] - C[None, :, :]) ** 2).sum(-1)   # (n, k)
        labels = d2.argmin(1)
        newC = np.array([X[labels == j].mean(0) if np.any(labels == j) else C[j]
                         for j in range(k)])
        if np.allclose(newC, C):
            break
        C = newC
    return C, labels
`},
drill:'Write k-means and PCA-via-SVD from blank in under <b>10 minutes</b> combined.',
ex:[
{t:'k-means++',d:2,q:`<p>Type the pattern, then add k-means++ initialisation (pick each next centre with probability proportional to squared distance to the nearest existing centre). Compare final inertia over 20 seeds for random vs k-means++ init.</p>`},
{t:'PCA on digits',d:2,q:`<p>Project the digits data to 2D with your PCA and scatter-plot coloured by label. Plot explained variance ratio. Reconstruct images from 5, 10, 20 components.</p>`},
{t:'Decision tree from scratch',d:3,q:`<p>A classification tree with Gini impurity, max depth and min samples per leaf. Find the best split by sorting each feature once. Test on the Iris data; print the tree as indented text.</p>`,
py:`
import numpy as np

def gini(y: np.ndarray) -> float:
    _, counts = np.unique(y, return_counts=True)
    p = counts / counts.sum()
    return 1 - np.sum(p ** 2)

def best_split(X, y):
    best = (None, None, np.inf)     # (feature, threshold, weighted impurity)
    for f in range(X.shape[1]):
        # TODO: try midpoints between sorted unique values
        pass
    return best
`},
{t:'Check against scikit-learn',d:1,q:`<p>For k-means, PCA, kNN and your tree, run the scikit-learn equivalent on the same data and compare results. Write a short table of differences and why they exist.</p>`},
{t:'Gaussian mixture with EM',d:3,q:`<p>Fit a 1D mixture of 3 Gaussians with the EM algorithm: E-step computes responsibilities, M-step updates means, variances and weights. Plot the log-likelihood per iteration; it must never decrease.</p>`}
]},

/* ================= PART 5 ================= */
{id:'c20',part:'P5',n:20,title:'Neural Networks from Scratch',time:'10 days',
goal:'Understand backpropagation well enough to write it for any small network.',
primer:`<p>A neural network is a chain of simple functions. Backpropagation is the chain rule applied from the loss backward, reusing values saved during the forward pass. If you can write this by hand, PyTorch will never feel like magic.</p>
<ul><li>For every layer write <code>forward(x)</code> that saves what it needs, and <code>backward(dout)</code> that returns <code>dx</code> and stores <code>dW</code>, <code>db</code>.</li>
<li><b>Always gradient-check</b> with central differences <code>(f(θ+ε) − f(θ−ε)) / 2ε</code> on a tiny network.</li>
<li>Watch Karpathy’s “micrograd” video for exercise 20.1, but type everything yourself.</li></ul>`,
pattern:{py:`
import numpy as np

class Linear:
    def __init__(self, d_in: int, d_out: int, rng):
        self.W = rng.normal(0, np.sqrt(2 / d_in), (d_in, d_out))
        self.b = np.zeros(d_out)

    def forward(self, x):            # x: (n, d_in)
        self.x = x
        return x @ self.W + self.b

    def backward(self, dout):        # dout: (n, d_out)
        self.dW = self.x.T @ dout
        self.db = dout.sum(0)
        return dout @ self.W.T

class ReLU:
    def forward(self, x):
        self.mask = x > 0
        return x * self.mask
    def backward(self, dout):
        return dout * self.mask
`},
drill:'Write a 2-layer MLP with forward, backward and SGD in NumPy from blank in under <b>20 minutes</b>, and pass a gradient check.',
ex:[
{t:'Scalar autograd engine',d:3,q:`<p>A <code>Value</code> class holding <code>data</code>, <code>grad</code>, its parents and a <code>_backward</code> closure. Support <code>+ * - ** tanh exp</code>. <code>backward()</code> builds a topological order and runs closures in reverse. Train a tiny MLP on 4 points with it.</p>`,
py:`
import math

class Value:
    def __init__(self, data, _parents=()):
        self.data = data
        self.grad = 0.0
        self._parents = set(_parents)
        self._backward = lambda: None

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other))
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    # TODO: __mul__, __pow__, __neg__, __sub__, __radd__, __rmul__, tanh, exp

    def backward(self):
        order, seen = [], set()
        # TODO: DFS topological sort into order
        self.grad = 1.0
        for v in reversed(order):
            v._backward()
`},
{t:'Gradient check',d:2,q:`<p>Write <code>numerical_grad(f, params, eps=1e-5)</code>. Compare with your layers’ analytic gradients on a 3-4-2 network. Relative error should be below 1e-6. Break your ReLU backward on purpose and watch the check fail.</p>`},
{t:'MLP on two moons',d:3,q:`<p>Using the pattern layers plus a softmax-cross-entropy output, train a 2-64-64-2 MLP on <code>make_moons</code>. Plot the decision boundary every 100 epochs.</p>`},
{t:'Softmax + cross-entropy backward',d:2,q:`<p>Derive on paper that the gradient of mean cross-entropy w.r.t. logits is <code>(P − Y)/n</code>. Implement it as one layer and gradient-check it.</p>`},
{t:'Momentum and Adam',d:2,q:`<p>Implement SGD, SGD with momentum, and Adam as optimiser classes with a <code>step(params, grads)</code> method. Compare their loss curves on the moons task.</p>`,
h:['Adam: <code>m = β1 m + (1−β1) g; v = β2 v + (1−β2) g²; m̂ = m/(1−β1ᵗ); v̂ = v/(1−β2ᵗ); θ −= lr m̂/(√v̂ + ε)</code>.']},
{t:'Initialisation experiments',d:2,q:`<p>Train a 10-layer ReLU MLP with zero, N(0, 1), Xavier and He initialisation. Plot the standard deviation of activations at each layer at step 0, and the loss curves.</p>`},
{t:'MNIST above 95%',d:3,q:`<p>Load MNIST (e.g. via <code>sklearn.datasets.fetch_openml</code>). Train your NumPy MLP 784-256-10 with mini-batches and Adam. Reach &gt; 95% test accuracy in under 5 minutes on CPU.</p>`}
]},

{id:'c21',part:'P5',n:21,title:'PyTorch Done Properly',time:'8 days',
goal:'Write clean, correct, reproducible PyTorch training code from memory.',
primer:`<p>PyTorch does the backward pass for you. What remains is engineering: a clean training loop, correct <code>train()</code>/<code>eval()</code> modes, no gradient leaks, reproducible seeds, and checkpoints.</p>
<ul><li>The five lines of every step: forward, loss, <code>zero_grad</code>, <code>backward</code>, <code>step</code>.</li>
<li>Wrap evaluation in <code>torch.no_grad()</code> and call <code>model.eval()</code> (it changes dropout and batch norm).</li>
<li>Write device-agnostic code: <code>device = "cuda" if torch.cuda.is_available() else "cpu"</code>.</li>
<li><b>Debugging habit:</b> before a long run, make sure the model can overfit one batch to near-zero loss.</li></ul>`,
pattern:{py:`
import torch
from torch import nn

def train_epoch(model, loader, opt, loss_fn, device):
    model.train()
    total = 0.0
    for xb, yb in loader:
        xb, yb = xb.to(device), yb.to(device)
        loss = loss_fn(model(xb), yb)
        opt.zero_grad()
        loss.backward()
        opt.step()
        total += loss.item() * len(xb)
    return total / len(loader.dataset)

@torch.no_grad()
def evaluate(model, loader, device):
    model.eval()
    correct = 0
    for xb, yb in loader:
        correct += (model(xb.to(device)).argmax(1) == yb.to(device)).sum().item()
    return correct / len(loader.dataset)
`},
drill:'Write a full PyTorch script (dataset, model, train, eval, save) for FashionMNIST from blank in under <b>15 minutes</b>.',
ex:[
{t:'Re-do the moons MLP',d:1,q:`<p>Rebuild exercise 20.3 in PyTorch with <code>nn.Sequential</code>. Check that the learned boundary looks the same. Compare lines of code.</p>`},
{t:'Dataset and DataLoader',d:2,q:`<p>Write a custom <code>Dataset</code> that reads your robot log CSV from 3.5 and returns (pose window of 10 steps, next pose). Wrap it in a <code>DataLoader</code> with shuffling and train an MLP to predict the next pose.</p>`},
{t:'A small CNN',d:2,q:`<p>Conv-ReLU-Pool ×2 then two linear layers on FashionMNIST. Reach &gt; 90% test accuracy. Print the output shape after every layer once, by hand-calculating first.</p>`},
{t:'Overfit one batch',d:1,q:`<p>Take a single batch of 64 and train on it until loss &lt; 0.01. If it cannot, there is a bug. Introduce three common bugs on purpose (forgot <code>zero_grad</code>, wrong label dtype, softmax before <code>CrossEntropyLoss</code>) and note how each shows up.</p>`},
{t:'Seeds and checkpoints',d:1,q:`<p>Write <code>set_seed(s)</code> (Python, NumPy, torch). Save model, optimiser state and epoch with <code>torch.save</code>; resume training and show the loss curve continues smoothly. Run twice with the same seed and confirm identical losses.</p>`},
{t:'Self-attention from scratch',d:3,q:`<p>Implement single-head scaled dot-product attention with <code>Q, K, V</code> projections and an optional causal mask. Then multi-head. Check output shapes and compare against <code>nn.MultiheadAttention</code> with copied weights.</p>`,
py:`
import math
import torch
from torch import nn

class SelfAttention(nn.Module):
    def __init__(self, d_model: int):
        super().__init__()
        self.q = nn.Linear(d_model, d_model)
        self.k = nn.Linear(d_model, d_model)
        self.v = nn.Linear(d_model, d_model)

    def forward(self, x: torch.Tensor, causal: bool = False) -> torch.Tensor:
        # x: (B, T, D)
        Q, K, V = self.q(x), self.k(x), self.v(x)
        # TODO: scores = Q @ K^T / sqrt(D)  -> (B, T, T)
        # TODO: mask future positions with -inf if causal
        # TODO: softmax over last dim, multiply by V
        return x
`},
{t:'Device-agnostic and faster',d:2,q:`<p>Make your CNN script run on CPU or GPU with no code changes. Time an epoch with <code>num_workers</code> 0, 2, 4 and with <code>pin_memory</code>. If you have a GPU, try <code>torch.autocast</code> for mixed precision. Free GPUs on Google Colab or Kaggle are fine for this.</p>`}
]},

/* ================= PART 6 ================= */
{id:'c22',part:'P6',n:22,title:'Bandits and MDPs',time:'7 days',
goal:'Implement the exploration–exploitation trade-off and solve MDPs with dynamic programming.',
primer:`<p>Reinforcement learning is an agent choosing actions to maximise long-run reward. Start with <b>bandits</b> (one state, many actions) to learn exploration. Then <b>MDPs</b>: states, actions, transitions P(s′|s,a), rewards, discount γ.</p>
<ul><li>Bellman optimality: <code>V(s) = max<sub>a</sub> Σ<sub>s′</sub> P(s′|s,a)[r + γV(s′)]</code>. Value iteration repeats this update until V stops changing; it is the DP from Chapter 14.</li>
<li>Write environments with a Gym-style API: <code>reset() → state</code>, <code>step(action) → (state, reward, done)</code>. Every later chapter uses it.</li>
<li>Read Sutton &amp; Barto chapters 2–4 alongside this chapter.</li></ul>`,
pattern:{py:`
import numpy as np

class Bandit:
    def __init__(self, k: int = 10, seed: int = 0):
        self.rng = np.random.default_rng(seed)
        self.means = self.rng.normal(0, 1, k)
    def pull(self, a: int) -> float:
        return self.rng.normal(self.means[a], 1)

def eps_greedy(bandit: Bandit, steps: int, eps: float) -> np.ndarray:
    k = len(bandit.means)
    Q, N = np.zeros(k), np.zeros(k)
    rewards = np.empty(steps)
    for t in range(steps):
        a = bandit.rng.integers(k) if bandit.rng.random() < eps else int(Q.argmax())
        r = bandit.pull(a)
        N[a] += 1
        Q[a] += (r - Q[a]) / N[a]          # incremental mean
        rewards[t] = r
    return rewards
`},
drill:'Write value iteration for a gridworld, including printing the policy as arrows, from blank in under <b>15 minutes</b>.',
ex:[
{t:'ε-greedy experiment',d:2,q:`<p>Type the pattern. Average 2,000 runs of 1,000 steps for ε = 0, 0.01, 0.1. Plot average reward and % optimal action against step. This reproduces Figure 2.2 of Sutton &amp; Barto.</p>`},
{t:'UCB1',d:2,q:`<p>Choose <code>argmax Q[a] + c·√(ln t / N[a])</code> (pull each arm once first). Compare with ε-greedy on the same plot.</p>`},
{t:'Gridworld environment',d:2,q:`<p>A class for a 5×5 grid with walls, a goal (+10), a pit (−10), −0.1 per step, and “slippery” moves (80% intended, 10% each side). Provide <code>reset</code>, <code>step</code>, <code>render</code> (ASCII) and a <code>transitions(s, a)</code> method that returns a list of <code>(prob, next_state, reward, done)</code>.</p>`,
py:`
import numpy as np

class GridWorld:
    ACTIONS = [(-1, 0), (0, 1), (1, 0), (0, -1)]     # up, right, down, left

    def __init__(self, layout: list[str], slip: float = 0.2, seed: int = 0):
        self.grid = [list(row) for row in layout]
        self.R, self.C = len(layout), len(layout[0])
        self.slip = slip
        self.rng = np.random.default_rng(seed)
        # TODO: find start 'S'

    def transitions(self, s, a):
        # TODO: return [(prob, s2, reward, done), ...]
        return []

    def reset(self):
        self.s = self.start
        return self.s

    def step(self, a):
        # TODO: sample from transitions(self.s, a)
        pass
`},
{t:'Policy evaluation',d:2,q:`<p>Evaluate the uniform random policy on your gridworld with iterative policy evaluation (γ = 0.9) until max change &lt; 1e-6. Print V as a grid.</p>`},
{t:'Value iteration',d:2,q:`<p>Find V* and the greedy policy. Print the policy as arrows. Change the slip probability to 0 and 0.4 and describe how the policy near the pit changes.</p>`},
{t:'Policy iteration',d:2,q:`<p>Alternate full policy evaluation and greedy improvement until the policy stops changing. Compare the number of sweeps with value iteration.</p>`}
]},

{id:'c23',part:'P6',n:23,title:'Learning from Experience',time:'10 days',
goal:'Implement tabular and deep model-free RL, and read research-grade RL code.',
primer:`<p>Model-free methods learn from sampled transitions without knowing P(s′|s,a). <b>Q-learning</b> updates toward <code>r + γ max Q(s′,·)</code> (off-policy). <b>SARSA</b> updates toward <code>r + γ Q(s′, a′)</code> with the action actually taken (on-policy). <b>DQN</b> replaces the table with a neural network, plus a replay buffer and a target network for stability. <b>Policy gradients</b> (REINFORCE) adjust a policy directly.</p>
<ul><li>Use <code>gymnasium</code> environments: <code>CliffWalking-v0</code>, <code>FrozenLake-v1</code>, <code>CartPole-v1</code>.</li>
<li>RL results are noisy. Always plot the mean over several seeds with a shaded band.</li>
<li>Read the CleanRL single-file implementations as examples of excellent research code.</li></ul>`,
pattern:{py:`
import numpy as np
import gymnasium as gym

env = gym.make("CliffWalking-v0")
nS, nA = env.observation_space.n, env.action_space.n
Q = np.zeros((nS, nA))
alpha, gamma, eps = 0.5, 1.0, 0.1
rng = np.random.default_rng(0)

for episode in range(500):
    s, _ = env.reset(seed=episode)
    done = False
    while not done:
        a = rng.integers(nA) if rng.random() < eps else int(Q[s].argmax())
        s2, r, term, trunc, _ = env.step(a)
        target = r + (0 if term else gamma * Q[s2].max())
        Q[s, a] += alpha * (target - Q[s, a])
        s, done = s2, term or trunc
`},
drill:'Write the DQN update step (sample batch, compute targets with the target network, loss, optimise) from blank in under <b>10 minutes</b>.',
ex:[
{t:'Q-learning on your gridworld',d:2,q:`<p>Run tabular Q-learning on your own <code>GridWorld</code> from 22.3. Compare the learned greedy policy with value iteration’s. Plot episode return over 5 seeds.</p>`},
{t:'SARSA versus Q-learning on the cliff',d:2,q:`<p>Type the pattern. Add SARSA. Plot both returns per episode and draw both final paths. Explain in two sentences why Q-learning walks along the cliff edge and SARSA takes the safe path (Sutton &amp; Barto Example 6.6).</p>`},
{t:'Monte Carlo control on Blackjack',d:2,q:`<p>First-visit MC control with ε-greedy on <code>Blackjack-v1</code>. Plot the learned value function as two heatmaps (usable ace or not).</p>`},
{t:'Exploration schedules',d:1,q:`<p>On FrozenLake, compare constant ε = 0.1, linear decay from 1 to 0.05, and exponential decay. Report the episode at which each first reaches 70% success rate (mean of 10 seeds).</p>`},
{t:'DQN on CartPole',d:3,q:`<p>Replay buffer (NumPy ring buffer of fixed size), MLP Q-network, target network copied every 500 steps, ε decay, Huber loss. Solve CartPole (average return ≥ 475 over 100 episodes). Plot learning curves for 3 seeds.</p>`,
py:`
import numpy as np
import torch
from torch import nn

class ReplayBuffer:
    def __init__(self, capacity: int, obs_dim: int):
        self.s = np.zeros((capacity, obs_dim), np.float32)
        self.a = np.zeros(capacity, np.int64)
        self.r = np.zeros(capacity, np.float32)
        self.s2 = np.zeros((capacity, obs_dim), np.float32)
        self.d = np.zeros(capacity, np.float32)
        self.cap, self.i, self.full = capacity, 0, False

    def add(self, s, a, r, s2, d):
        # TODO: write at self.i, advance, wrap around
        pass

    def sample(self, batch: int, rng):
        n = self.cap if self.full else self.i
        idx = rng.integers(0, n, batch)
        return (torch.as_tensor(self.s[idx]), torch.as_tensor(self.a[idx]),
                torch.as_tensor(self.r[idx]), torch.as_tensor(self.s2[idx]),
                torch.as_tensor(self.d[idx]))

def dqn_loss(q_net, target_net, batch, gamma):
    s, a, r, s2, d = batch
    q = q_net(s).gather(1, a.unsqueeze(1)).squeeze(1)
    with torch.no_grad():
        # TODO: target = r + gamma * (1 - d) * max_a' target_net(s2)
        target = r
    return nn.functional.smooth_l1_loss(q, target)
`},
{t:'REINFORCE with a baseline',d:3,q:`<p>A policy network outputs action probabilities. Collect full episodes, compute discounted returns, and minimise <code>−Σ log π(a|s)·(G − b)</code> with b = mean return of the batch. Compare variance with and without the baseline.</p>`},
{t:'Read CleanRL’s DQN',d:1,q:`<p>Open <code>cleanrl/dqn.py</code> in the CleanRL repository. Copy it by typing (not pasting) into your own file, adding a comment above every block that explains it in your words. List three engineering choices it makes that your 23.5 code did not.</p>`}
]},

{id:'c24',part:'P6',n:24,title:'Many Agents at Once',time:'12 days',
goal:'Simulate interacting agents efficiently and train them with multi-agent RL.',
primer:`<p>Multi-agent systems bring two new problems: <b>scale</b> (N agents interacting is N² pairs unless you are clever) and <b>non-stationarity</b> (each agent’s environment includes other learning agents, so the target keeps moving).</p>
<ul><li>Start with rule-based agents (boids, game-theory strategies) to build simulation skill.</li>
<li>Use your spatial hash from 6.6 to keep neighbour search near O(N).</li>
<li>Independent learners are the simplest MARL baseline; parameter sharing and centralised critics come next.</li>
<li>PettingZoo is the standard API. Its <code>parallel_env</code> returns dicts keyed by agent name.</li>
<li>Read the MARL book (Albrecht, Christianos &amp; Schäfer) chapters 3–5 and 9.</li></ul>`,
pattern:{py:`
import numpy as np

def boids_step(pos, vel, r=1.0, w_sep=1.5, w_ali=1.0, w_coh=1.0, max_speed=2.0, dt=0.1):
    """pos, vel: (N, 2). O(N^2) version — replace neighbour search later."""
    diff = pos[None, :, :] - pos[:, None, :]          # (N, N, 2): j - i
    dist = np.linalg.norm(diff, axis=-1) + np.eye(len(pos)) * 1e9
    near = dist < r                                     # (N, N)
    cnt = near.sum(1, keepdims=True).clip(min=1)

    sep = -(diff / dist[..., None] ** 2 * near[..., None]).sum(1)
    ali = (near[..., None] * vel[None, :, :]).sum(1) / cnt - vel
    coh = (near[..., None] * diff).sum(1) / cnt

    vel = vel + dt * (w_sep * sep + w_ali * ali + w_coh * coh)
    speed = np.linalg.norm(vel, axis=1, keepdims=True).clip(min=1e-9)
    vel = np.where(speed > max_speed, vel / speed * max_speed, vel)
    return pos + vel * dt, vel
`},
drill:'Write the predator–prey environment (24.5) with its <code>reset</code> and <code>step</code> from blank in under <b>20 minutes</b>.',
ex:[
{t:'Boids',d:2,q:`<p>Type the pattern. Animate 300 boids in a wrap-around world with matplotlib <code>FuncAnimation</code>. Vary the three weights and describe the behaviours you see (flocking, scattering, milling).</p>`},
{t:'5,000 boids with spatial hashing',d:3,q:`<p>Replace the O(N²) neighbour search with your grid buckets (6.6), vectorised per cell or in Numba. Show frame time against N for both versions on a log-log plot.</p>`},
{t:'Iterated Prisoner’s Dilemma tournament',d:1,q:`<p>Strategies as classes with <code>move(history)</code>: AlwaysCooperate, AlwaysDefect, TitForTat, Grudger, Random, and one of your own. Round-robin of 200 rounds per match with payoffs (3,3), (0,5), (5,0), (1,1). Rank by total score. Then add 5% noise and re-run.</p>`},
{t:'Two learners in a matrix game',d:2,q:`<p>Two independent Q-learners (stateless) repeatedly play Prisoner’s Dilemma, then a coordination game, then matching pennies. Plot each agent’s action probabilities over time and explain which games converge and which cycle.</p>`},
{t:'Predator–prey gridworld',d:3,q:`<p>A 10×10 grid with 2 predators and 1 prey (moves randomly). Predators get +10 when both are adjacent to the prey, −0.1 per step. Write a PettingZoo-style <code>parallel</code> environment yourself (dicts of observations, rewards, terminations). Train independent tabular Q-learners with relative positions as state and plot capture time.</p>`,
py:`
import numpy as np

class PredatorPrey:
    def __init__(self, size: int = 10, n_pred: int = 2, max_steps: int = 200, seed: int = 0):
        self.size, self.n_pred, self.max_steps = size, n_pred, max_steps
        self.rng = np.random.default_rng(seed)
        self.agents = [f"pred_{i}" for i in range(n_pred)]

    def reset(self):
        self.t = 0
        cells = self.rng.choice(self.size ** 2, self.n_pred + 1, replace=False)
        # TODO: convert to (r, c); last one is the prey
        return self._obs()

    def _obs(self) -> dict[str, tuple]:
        # TODO: each predator sees (prey - self, other_predator - self), clipped
        return {}

    def step(self, actions: dict[str, int]):
        # TODO: move predators, move prey randomly, compute rewards and termination
        return self._obs(), {}, {}, {}
`},
{t:'PettingZoo simple_spread',d:3,q:`<p>Install PettingZoo’s MPE environments. Run random agents in <code>simple_spread_v3</code> and record average return. Then train one shared-parameter policy (REINFORCE or DQN on the agent’s own observation plus a one-hot agent id) and compare. Note: check the current PettingZoo docs, as MPE has been moving to a separate package.</p>`},
{t:'Boids in C++',d:3,q:`<p>Port the boids step with a uniform grid to C++ using structure-of-arrays (16.3). Run 50,000 boids and write positions every 10 steps to a binary file; visualise in Python. Report steps per second against your NumPy version.</p>`}
]},

/* ================= PART 7 ================= */
{id:'c25',part:'P7',n:25,title:'Robots in Code',time:'14 days',
goal:'Implement transforms, kinematics, control, filtering and a full navigation loop.',
primer:`<p>Robotics code is linear algebra, numerical integration and feedback loops, organised carefully. This chapter connects everything: your <code>Vec2</code>, ring buffer, A*, NumPy and simulation loops.</p>
<ul><li><b>Poses</b> in 2D are (x, y, θ), or a 3×3 homogeneous matrix. Composing transforms is matrix multiplication; the order matters.</li>
<li><b>Kinematics</b> maps joint angles to positions (forward) and back (inverse). The Jacobian links joint velocities to end-effector velocities.</li>
<li><b>Control:</b> a PID controller turns error into a command, every step.</li>
<li><b>Estimation:</b> a Kalman filter fuses a motion model with noisy measurements.</li>
<li>Read Modern Robotics ch. 2–4 and browse matching files in PythonRobotics.</li></ul>`,
pattern:{py:`
import numpy as np

def se2(x: float, y: float, theta: float) -> np.ndarray:
    c, s = np.cos(theta), np.sin(theta)
    return np.array([[c, -s, x],
                     [s,  c, y],
                     [0,  0, 1]])

def se2_inv(T: np.ndarray) -> np.ndarray:
    R, t = T[:2, :2], T[:2, 2]
    Ti = np.eye(3)
    Ti[:2, :2] = R.T
    Ti[:2, 2] = -R.T @ t
    return Ti

# a point seen by the robot, expressed in the world frame
T_world_robot = se2(2.0, 1.0, np.pi / 4)
p_robot = np.array([1.0, 0.0, 1.0])
p_world = T_world_robot @ p_robot
`},
drill:'Write a differential-drive simulator with a PID heading controller that drives to a goal, from blank, in under <b>20 minutes</b>.',
ex:[
{t:'2D rigid transforms',d:2,q:`<p>Type the pattern. Verify <code>se2_inv(T) @ T ≈ I</code> for random poses. A lidar on the robot is mounted at (0.2, 0, 0) relative to the robot. Convert 360 lidar ranges into world-frame points and plot them with the robot pose.</p>`},
{t:'Two-link arm: forward kinematics',d:2,q:`<p>Link lengths L1 = 1.0, L2 = 0.7. Write <code>fk(q1, q2)</code> returning elbow and end-effector positions. Draw the arm for several angles and plot the full reachable workspace by sampling.</p>`},
{t:'Two-link arm: inverse kinematics',d:2,q:`<p>Analytic IK with the law of cosines, returning both elbow-up and elbow-down solutions, or none if unreachable. Test: <code>fk(ik(p)) ≈ p</code> for 1,000 random reachable points.</p>`,
h:['<code>cos q2 = (x² + y² − L1² − L2²) / (2 L1 L2)</code>. If |cos q2| &gt; 1 the point is unreachable.','<code>q1 = atan2(y, x) − atan2(L2 sin q2, L1 + L2 cos q2)</code>.']},
{t:'Differential-drive robot',d:2,q:`<p>State (x, y, θ), inputs: left and right wheel speeds, wheel base b. Integrate with dt = 0.01: <code>v = (vr+vl)/2</code>, <code>ω = (vr−vl)/b</code>. Drive a circle and a figure-eight. Compare Euler and RK4 drift after 60 seconds.</p>`},
{t:'PID to a goal',d:2,q:`<p>A PID controller on heading error (wrap to [−π, π]!) and a P controller on distance. Drive to 5 goals in a row. Tune gains and plot the paths for under-damped, well-tuned and over-damped settings. Add integral wind-up protection.</p>`,
py:`
import math

class PID:
    def __init__(self, kp: float, ki: float, kd: float, i_limit: float = 1.0):
        self.kp, self.ki, self.kd, self.i_limit = kp, ki, kd, i_limit
        self.integral = 0.0
        self.prev_err = None

    def __call__(self, err: float, dt: float) -> float:
        # TODO: integral with clamp to [-i_limit, i_limit]
        # TODO: derivative (0 on the first call)
        return 0.0

def wrap_angle(a: float) -> float:
    return math.atan2(math.sin(a), math.cos(a))
`},
{t:'Numerical IK with the Jacobian',d:3,q:`<p>A 3-link planar arm. Compute the 2×3 Jacobian analytically and check it numerically. Move the end-effector to a target with damped least squares: <code>Δq = Jᵀ(JJᵀ + λ²I)⁻¹ e</code>. Animate it tracking a moving circle.</p>`},
{t:'Kalman filter tracking',d:3,q:`<p>1D constant-velocity Kalman filter first (state: position, velocity; measurements: noisy position). Then 2D. Plot truth, measurements and estimate with a ±2σ band. Tune Q and R and explain the effect of each.</p>`,
py:`
import numpy as np

class KalmanCV:
    def __init__(self, dt: float, q: float, r: float):
        self.F = np.array([[1, dt], [0, 1]])
        self.H = np.array([[1.0, 0.0]])
        self.Q = q * np.array([[dt**4 / 4, dt**3 / 2], [dt**3 / 2, dt**2]])
        self.R = np.array([[r]])
        self.x = np.zeros(2)
        self.P = np.eye(2) * 10

    def predict(self):
        # TODO: x = F x ; P = F P F^T + Q
        pass

    def update(self, z: float):
        # TODO: y = z - H x ; S = H P H^T + R ; K = P H^T S^-1
        # TODO: x = x + K y ; P = (I - K H) P
        pass
`},
{t:'Capstone: a fleet that navigates',d:3,q:`<p>Combine everything into one project on GitHub:</p><ol>
<li>An occupancy grid map loaded from a PNG.</li>
<li>A* (13.3) plans a path for each robot; prioritised planning (13.7) avoids robot–robot conflicts.</li>
<li>Each differential-drive robot follows its path with pure pursuit and PID.</li>
<li>Noisy odometry, corrected by a Kalman filter using noisy position fixes.</li>
<li>Write the core simulation step in C++ and expose it to Python with <code>pybind11</code>; train or tune in Python.</li></ol>
<p>Write a README with a GIF, the design, and benchmark numbers. This is a portfolio piece for robotics and multi-agent labs.</p>`,
h:['Pure pursuit: pick a look-ahead point on the path at distance L, then curvature = <code>2 sin(α) / L</code> where α is the angle to that point in the robot frame.','Build in stages: one robot without noise, then noise and the filter, then several robots.']}
]}
);
