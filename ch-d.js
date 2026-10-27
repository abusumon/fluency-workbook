(function(){
const R=String.raw;
window.BOOK.chapters.push(
/* ================= PART 8 · CAREER LABS ================= */
{id:'c26',part:'P8',n:32,title:'GPU Programming with CUDA',time:'12 days',
goal:'Write and optimise GPU kernels, and understand why GPU-parallel simulation changed robot learning.',
needs:['g4','c16','c21'],
math:[
{h:'How much can parallelism help?',body:R`<p><b>Amdahl’s law.</b> If a fraction \(p\) of the work can run in parallel on \(N\) processors, the speed-up is</p>
\[ S(N) = \frac{1}{(1 - p) + p/N} \;\le\; \frac{1}{1-p}. \]
<p>Even with infinite GPU cores, a program that is 90% parallel speeds up at most 10×. This is why data transfers between CPU and GPU, which are serial overhead, matter so much.</p>`},
{h:'The roofline: compute or memory bound?',body:R`<p>The <b>arithmetic intensity</b> \(I\) of a kernel is floating-point operations per byte moved from memory. Achievable speed is bounded by</p>
\[ \text{FLOP/s} \le \min\big(\text{peak FLOP/s},\ I \times \text{memory bandwidth}\big). \]
<p>Vector add does 1 FLOP per 12 bytes (read two floats, write one): \(I \approx 0.08\), so it is always memory bound. Multiplying two \(n\times n\) matrices does \(2n^3\) FLOPs on \(3n^2\) numbers: \(I\) grows with \(n\), so a well-tiled matmul can approach peak compute. Tensor cores, flash attention and kernel fusion all exist to raise intensity.</p>`}
],
learn:[
{h:'How a GPU differs from a CPU',body:R`<p>A CPU has a few powerful cores designed to run one thread fast. A GPU has thousands of simpler cores designed to run <b>the same instruction on many data items at once</b>. NVIDIA GPUs group cores into <b>streaming multiprocessors (SMs)</b>. Threads run in groups of 32 called <b>warps</b>; all 32 execute the same instruction together. If threads in a warp take different branches of an <code>if</code>, the branches run one after the other (“divergence”), wasting time.</p>`},
{h:'The CUDA programming model',body:R`<p>You write a <b>kernel</b>: a function marked <code>__global__</code> that runs on the GPU, once per thread. You launch it with a <b>grid</b> of <b>blocks</b>, each block containing many threads. Every thread computes its own index and handles one piece of the data.</p>`,
code:{cpp:R`
// add.cu   compile: nvcc -O2 add.cu -o add      run: ./add
#include <cstdio>
#include <cuda_runtime.h>

__global__ void add(const float* a, const float* b, float* c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   // this thread's global index
    if (i < n) c[i] = a[i] + b[i];                   // guard: grid may be larger than n
}

int main() {
    const int n = 1 << 20;
    float *a, *b, *c;
    cudaMallocManaged(&a, n * sizeof(float));         // memory visible to CPU and GPU
    cudaMallocManaged(&b, n * sizeof(float));
    cudaMallocManaged(&c, n * sizeof(float));
    for (int i = 0; i < n; ++i) { a[i] = 1.0f; b[i] = 2.0f; }

    int threads = 256;
    int blocks = (n + threads - 1) / threads;         // round up
    add<<<blocks, threads>>>(a, b, c, n);             // launch
    cudaDeviceSynchronize();                          // wait for the GPU

    printf("c[0] = %f\n", c[0]);
    cudaFree(a); cudaFree(b); cudaFree(c);
}
`},
after:R`<p><code>threadIdx.x</code> is the thread’s position inside its block, <code>blockIdx.x</code> the block’s position in the grid, <code>blockDim.x</code> the threads per block. <code>&lt;&lt;&lt;blocks, threads&gt;&gt;&gt;</code> is CUDA’s launch syntax. Kernel launches are <b>asynchronous</b>: the CPU continues immediately, so you must synchronise before reading results. Every CUDA call returns an error code; real code checks it with a macro. No NVIDIA GPU? Google Colab offers a free GPU: write the file with <code>%%writefile add.cu</code>, then run <code>!nvcc -arch=sm_75 add.cu -o add &amp;&amp; ./add</code> (sm_75 matches the T4 GPU).</p>`},
{h:'Memory: where speed is won',body:R`<ul><li><b>Global memory</b>: large, slow (hundreds of cycles). Adjacent threads should read adjacent addresses so the hardware can combine them into one transaction: <b>coalesced</b> access.</li>
<li><b>Shared memory</b>: small (tens of KB per block), fast, shared by threads of one block. Declared with <code>__shared__</code>. Used to load a tile once and reuse it many times.</li>
<li><b>Registers</b>: private per thread, fastest.</li>
<li><code>__syncthreads()</code> makes every thread in the block wait until all have reached that point, which you need between writing and reading shared memory.</li></ul>`},
{h:'From Python: CuPy, Numba and Triton',body:R`<p>Researchers rarely write raw CUDA first. <b>CuPy</b> is NumPy on the GPU (often just change <code>import numpy as np</code> to <code>import cupy as cp</code>). <b>Numba</b> compiles Python functions to CUDA kernels with <code>@cuda.jit</code>. <b>Triton</b> lets you write high-performance kernels in Python at the level of blocks rather than threads, and is used inside PyTorch’s compiler. Learn the CUDA model first; then these tools make sense.</p>`},
{h:'Why this matters for embodied AI',body:R`<p>Robot learning needs enormous amounts of experience. NVIDIA’s Isaac Sim and Isaac Lab run thousands of simulated robots in parallel <b>on one GPU</b>, so physics, observations and policy training all stay in GPU memory without copying to the CPU. GEAR’s research on humanoid foundation models (GR00T) depends on this kind of simulation and synthetic-data infrastructure. Understanding kernels, memory and batching is what lets you build and debug such systems.</p>`}
],
primer:R`<ul><li>One kernel, many threads; each computes its index from block and thread ids.</li><li>Launches are asynchronous; synchronise before reading.</li><li>Coalesce global reads; reuse data through shared memory.</li><li>Measure with the roofline in mind: memory bound or compute bound?</li></ul>`,
drill:'Write a vector-add kernel with launch configuration, managed memory and error checking from blank in under <b>8 minutes</b>.',
ex:[
{t:'Hello GPU',d:1,q:R`<p>On Colab or your own GPU: run <code>nvidia-smi</code>, note the GPU model and memory. Type and run the vector-add pattern. Change <code>threads</code> to 32, 128, 1024 and report whether results stay correct.</p>`},
{t:'Error-checking macro',d:1,q:R`<p>Write <code>CUDA_CHECK(call)</code> that prints the file, line and <code>cudaGetErrorString</code> on failure and exits. Then trigger an error on purpose (launch 2048 threads per block) and check <code>cudaGetLastError()</code> after the launch.</p>`},
{t:'SAXPY with a grid-stride loop',d:2,q:R`<p>Compute <code>y = a*x + y</code> for n = 10⁸ with a grid-stride loop (<code>for (int i = idx; i &lt; n; i += blockDim.x * gridDim.x)</code>) so a fixed-size grid handles any n. Time it with <code>cudaEvent_t</code> and compare with a CPU loop. Then use explicit <code>cudaMalloc</code> + <code>cudaMemcpy</code> and report kernel time and copy time separately.</p>`},
{t:'Parallel reduction',d:3,q:R`<p>Sum 10⁸ floats. Version 1: every thread does <code>atomicAdd</code> on one global variable. Version 2: each block reduces its part in shared memory with a tree (halve the active threads each step, <code>__syncthreads()</code> between), then one atomic per block. Compare times and explain the difference.</p>`,
cpp:R`
__global__ void block_sum(const float* x, float* out, int n) {
    extern __shared__ float s[];                 // size given at launch
    int tid = threadIdx.x;
    int i = blockIdx.x * blockDim.x + tid;
    s[tid] = (i < n) ? x[i] : 0.0f;
    __syncthreads();
    for (int stride = blockDim.x / 2; stride > 0; stride /= 2) {
        // TODO: if tid < stride, add s[tid + stride] into s[tid]
        // TODO: synchronise
    }
    // TODO: thread 0 adds s[0] to *out with atomicAdd
}
// launch: block_sum<<<blocks, 256, 256 * sizeof(float)>>>(x, out, n);
`},
{t:'Tiled matrix multiply',d:3,q:R`<p>Naive kernel: one thread per output element, reading a row of A and a column of B from global memory. Tiled kernel: each block loads 16×16 tiles of A and B into shared memory, multiplies, and moves to the next tile. Compare GFLOP/s for N = 2048 against <code>torch.matmul</code> on the same GPU, and relate the gap to the roofline.</p>`},
{t:'A million particles on the GPU',d:2,q:R`<p>Port your NumPy bouncing-particle simulation (15.5) to CuPy, then to a Numba <code>@cuda.jit</code> kernel. Time 1,000 steps of 10⁶ particles for NumPy, CuPy and Numba. Keep data on the GPU between steps.</p>`},
{t:'Your first Triton kernel',d:3,q:R`<p>Follow the official Triton tutorials to write vector add, then a fused row-wise softmax. Benchmark the fused softmax against <code>torch.softmax</code> for several row lengths and explain when fusion helps (hint: memory traffic).</p>`},
{t:'GPU-parallel simulation, explained',d:2,q:R`<p>Read the Isaac Lab documentation’s overview of vectorised environments. If you have a suitable NVIDIA GPU, run one of its example RL training scripts with a few thousand environments. Otherwise, write a one-page explanation of how thousands of environments on one GPU change RL training throughput, with your own back-of-the-envelope numbers from this chapter.</p>`}
]},

{id:'c27',part:'P8',n:33,title:'ROS 2 and Rover Autonomy',time:'14 days',
goal:'Build rover software the way competition teams do: ROS 2 nodes, transforms, GNSS navigation and marker detection.',
needs:['g6','g8','c25'],
math:[
{h:'Distance and bearing between GNSS points',body:R`<p>GNSS gives latitude \(\varphi\) and longitude \(\lambda\) in degrees (convert to radians first). On a sphere of radius \(R \approx 6{,}371{,}000\) m, the <b>haversine</b> distance is</p>
\[ a = \sin^2\!\frac{\Delta\varphi}{2} + \cos\varphi_1\cos\varphi_2\sin^2\!\frac{\Delta\lambda}{2}, \qquad d = 2R\,\operatorname{atan2}\!\big(\sqrt{a}, \sqrt{1-a}\big), \]
<p>and the initial bearing (clockwise from north) is</p>
\[ \theta = \operatorname{atan2}\big(\sin\Delta\lambda\cos\varphi_2,\ \cos\varphi_1\sin\varphi_2 - \sin\varphi_1\cos\varphi_2\cos\Delta\lambda\big). \]
<p>Over a few hundred metres you can instead use a local flat approximation: east \(\approx R\cos\varphi_0\,\Delta\lambda\), north \(\approx R\,\Delta\varphi\), and then do ordinary 2D geometry. Note that compass bearings run clockwise from north, while maths angles run counter-clockwise from east.</p>`},
{h:'Distance from a camera',body:R`<p>The <b>pinhole camera model</b> projects a point at depth \(Z\) and lateral offset \(X\) to image coordinate \(u = f\frac{X}{Z} + c_x\), where \(f\) is the focal length in pixels. An object of real width \(W\) that appears \(w\) pixels wide is therefore at distance \(Z \approx f\,W / w\). Marker libraries solve the full 3D pose from the four corners (a perspective-n-point problem), but this one-line estimate is a good sanity check.</p>`}
],
learn:[
{h:'What ROS 2 is',body:R`<p>ROS 2 (Robot Operating System 2) is not an operating system. It is a set of libraries and tools for building robot software from many small programs called <b>nodes</b> that talk to each other. One node reads the GPS, one runs the camera, one plans, one drives the motors. Most university rover teams and many robotics companies use it. Use an LTS release on Ubuntu (Jazzy, released 2024, or its successor; check docs.ros.org for the current one).</p>
<ul><li><b>Topics:</b> named streams of messages. Many publishers, many subscribers. For sensor data and commands (<code>/gps/fix</code>, <code>/cmd_vel</code>).</li>
<li><b>Services:</b> request–response calls (“set speed limit”).</li>
<li><b>Actions:</b> long tasks with feedback and cancellation (“drive to waypoint”).</li>
<li><b>Parameters:</b> per-node settings changeable at run time.</li>
<li><b>tf2:</b> keeps track of every coordinate frame over time (Chapter 25’s transforms, managed for you).</li></ul>`},
{h:'A publisher node, line by line',body:R`<p>Note how much Part 0 OOP you need here: every node is a subclass of <code>Node</code>.</p>`,
code:{py:R`
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class Talker(Node):
    def __init__(self):
        super().__init__("talker")                                  # node name
        self.pub = self.create_publisher(String, "chatter", 10)     # type, topic, queue size
        self.timer = self.create_timer(0.5, self.tick)              # call tick every 0.5 s
        self.count = 0

    def tick(self):
        msg = String()
        msg.data = f"hello {self.count}"
        self.pub.publish(msg)
        self.count += 1

def main():
    rclpy.init()
    node = Talker()
    rclpy.spin(node)          # process timers and callbacks until Ctrl+C
    node.destroy_node()
    rclpy.shutdown()

if __name__ == "__main__":
    main()
`,cpp:R`
#include <chrono>
#include <memory>
#include <string>
#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"
using namespace std::chrono_literals;

class Talker : public rclcpp::Node {
public:
    Talker() : Node("talker") {
        pub_ = create_publisher<std_msgs::msg::String>("chatter", 10);
        timer_ = create_wall_timer(500ms, [this] {
            std_msgs::msg::String msg;
            msg.data = "hello " + std::to_string(count_++);
            pub_->publish(msg);
        });
    }
private:
    rclcpp::Publisher<std_msgs::msg::String>::SharedPtr pub_;
    rclcpp::TimerBase::SharedPtr timer_;
    int count_ = 0;
};

int main(int argc, char** argv) {
    rclcpp::init(argc, argv);
    rclcpp::spin(std::make_shared<Talker>());
    rclcpp::shutdown();
}
`},
after:R`<p>The node never calls <code>tick</code> itself: <code>spin</code> runs an event loop that calls your <b>callbacks</b> when timers fire or messages arrive. Callbacks must return quickly; never put a long <code>while</code> loop inside one. In C++, <code>[this]</code> lets the lambda use the node’s members, and <code>SharedPtr</code> is a <code>std::shared_ptr</code> (shared ownership). Inspect a running system from the terminal with <code>ros2 node list</code>, <code>ros2 topic list</code>, <code>ros2 topic echo /chatter</code> and <code>ros2 topic hz /chatter</code>.</p>`},
{h:'Packages, builds and launch files',body:R`<p>Code lives in <b>packages</b> inside a workspace’s <code>src/</code> folder. <code>ros2 pkg create --build-type ament_python my_pkg</code> (or <code>ament_cmake</code> for C++) makes one. <code>colcon build</code> builds the workspace; <code>source install/setup.bash</code> makes it visible; <code>ros2 run my_pkg talker</code> runs a node. A <b>launch file</b> (written in Python) starts many nodes with their parameters in one command, which is how a whole rover stack is started.</p>`},
{h:'What a competition rover needs',body:R`<p>The University Rover Challenge, held each year at the Mars Desert Research Station in Utah, scores four missions (science, delivery, equipment servicing, autonomous navigation) plus a design review. The autonomy mission in recent years has asked rovers to drive between GNSS coordinates and find targets such as ArUco-marked posts and objects without a human driving. Always read the current rules at urc.marssociety.org. Software sub-teams typically split into: drive and arm control, sensor drivers, localisation (GNSS + IMU + wheel odometry fusion), perception (cameras, markers, objects), navigation (Nav2 or a custom planner), and a base-station GUI with telemetry.</p>`}
],
primer:R`<ul><li>Nodes communicate over topics, services and actions.</li><li>Callbacks run from <code>spin</code>; keep them short.</li><li>Use tf2 for frames instead of hand-tracking transforms.</li><li>Build with colcon, start systems with launch files.</li><li>Test everything in simulation (turtlesim, Gazebo) before the real rover.</li></ul>`,
drill:'Create a ROS 2 Python package with one publisher and one subscriber node, build it and see messages flowing, from blank, in under <b>15 minutes</b>.',
ex:[
{t:'Install and explore',d:1,q:R`<p>Install ROS 2 on Ubuntu (native or WSL2). Run the demo talker and listener in two terminals. Use <code>ros2 topic list</code>, <code>echo</code>, <code>hz</code> and <code>rqt_graph</code> to see the system. Then run <code>turtlesim</code> and drive the turtle with <code>ros2 topic pub /turtle1/cmd_vel geometry_msgs/msg/Twist ...</code>.</p>`},
{t:'Fake GPS and a logger',d:1,q:R`<p>Node 1 publishes <code>sensor_msgs/msg/NavSatFix</code> at 5 Hz along a small circle near a starting coordinate. Node 2 subscribes and logs distance from the start using your haversine function. Write both in Python, then node 1 in C++.</p>`},
{t:'A custom message',d:2,q:R`<p>Create an interface package with <code>RoverStatus.msg</code> (battery percentage, mode string, a <code>geometry_msgs/Pose2D</code>). Publish it from one node and display it in another. Build with colcon.</p>`},
{t:'Services and parameters',d:2,q:R`<p>Give your drive node a <code>max_speed</code> parameter and a service <code>set_mode</code> (“manual”, “autonomous”, “stop”). In stop mode it must publish zero velocity no matter what it receives. Change both from the terminal with <code>ros2 param set</code> and <code>ros2 service call</code>.</p>`},
{t:'Frames with tf2',d:2,q:R`<p>Broadcast a static transform <code>base_link → camera_link</code> (camera 0.3 m forward, 0.5 m up) and a moving <code>odom → base_link</code> from your differential-drive simulator (25.4). Look up <code>odom → camera_link</code> in another node and check it against the matrix you compute by hand.</p>`},
{t:'GNSS waypoint follower',d:2,q:R`<p>A node that takes a list of GNSS waypoints, subscribes to position and heading, and publishes <code>geometry_msgs/msg/Twist</code> on <code>/cmd_vel</code> using your PID heading controller (25.5). Declare a waypoint reached within 2 m. Test it first by mapping turtlesim coordinates to fake GNSS.</p>`,
py:R`
import math
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from sensor_msgs.msg import NavSatFix

def haversine_m(lat1, lon1, lat2, lon2):
    # TODO: implement from the math section (radians!)
    return 0.0

def bearing_rad(lat1, lon1, lat2, lon2):
    # TODO: clockwise from north
    return 0.0

class WaypointFollower(Node):
    def __init__(self, waypoints):
        super().__init__("waypoint_follower")
        self.waypoints = list(waypoints)
        self.fix = None
        self.heading = 0.0                     # TODO: subscribe to an IMU/heading topic
        self.create_subscription(NavSatFix, "/gps/fix", self.on_fix, 10)
        self.cmd = self.create_publisher(Twist, "/cmd_vel", 10)
        self.create_timer(0.1, self.control)

    def on_fix(self, msg: NavSatFix):
        self.fix = msg

    def control(self):
        if self.fix is None or not self.waypoints:
            return
        # TODO: distance and bearing to current waypoint
        # TODO: pop waypoint if within 2 m
        # TODO: heading error -> angular.z with PID; distance -> linear.x (capped)
`},
{t:'ArUco marker detection',d:3,q:R`<p>With OpenCV (4.7 or later uses <code>cv2.aruco.ArucoDetector</code>), detect markers in webcam frames or saved images. Calibrate your camera with a chessboard, estimate each marker’s distance and bearing, and check the distance against the pinhole formula. Wrap it in a ROS 2 node that publishes detections.</p>`},
{t:'Simulated rover with Nav2',d:3,q:R`<p>Spawn a differential-drive robot in Gazebo, publish odometry and a lidar scan, and run the Nav2 stack to drive to goals clicked in RViz around obstacles. Record a short video for your portfolio.</p>`},
{t:'Work like a team member',d:1,q:R`<p>Write a one-page interface document for your subsystem: topics it publishes and subscribes (names, message types, rates, frames), parameters, and failure behaviour. Then review a classmate’s or an open-source pull request and leave three specific, polite comments. Rover teams run on this kind of communication.</p>`}
]},

{id:'c28',part:'P8',n:34,title:'Research Engineering and JAX',time:'14 days',
goal:'Run experiments the way research labs do: reproducible, statistically honest, written up clearly, in JAX as well as PyTorch.',
needs:['c21','c23'],
math:[
{h:'How sure are you?',body:R`<p>If you run \(n\) seeds with final scores \(x_1, \dots, x_n\), the mean \(\bar x\) has <b>standard error</b> \(\mathrm{SE} = s/\sqrt{n}\), where \(s\) is the sample standard deviation. An approximate 95% confidence interval is \(\bar x \pm t_{n-1}\,\mathrm{SE}\); for large \(n\), \(t \approx 1.96\), but for \(n = 5\) it is about 2.78. With 3 seeds, intervals are often so wide that “method A beats B” means nothing. RL results are especially noisy, which is why careful papers use 10 or more seeds and robust summaries such as the interquartile mean.</p>`},
{h:'The bootstrap',body:R`<p>When you cannot trust a formula, resample: draw \(n\) scores with replacement from your \(n\) results, compute the statistic, repeat 10,000 times, and take the 2.5th and 97.5th percentiles as a 95% interval. It works for medians, IQMs and differences between methods alike.</p>`}
],
learn:[
{h:'What a research engineer does',body:R`<p>At labs like Google DeepMind, research engineers turn ideas into working, scalable experiments: they write training and evaluation code, build infrastructure, run and debug large jobs, and often co-author papers. A recent DeepMind research engineer posting asked for fluency in Python or C++, experience with JAX or a similar ML framework, and solid software engineering, including building reliable model evaluations. Everything in this book points at that combination.</p>`},
{h:'JAX in five ideas',body:R`<ul><li><code>jax.numpy</code> mirrors NumPy, but arrays are <b>immutable</b>: <code>x.at[i].set(v)</code> returns a new array.</li>
<li><b>Pure functions:</b> outputs depend only on inputs, with no hidden state or global random generator. This is what makes the transformations below possible.</li>
<li><code>jax.grad(f)</code> returns a new function computing the gradient of <code>f</code> with respect to its first argument.</li>
<li><code>jax.jit(f)</code> compiles <code>f</code> with XLA for CPU, GPU or TPU.</li>
<li><code>jax.vmap(f)</code> vectorises <code>f</code> over a batch dimension automatically: write code for one example (or one seed), get it for many.</li></ul>
<p>Randomness uses explicit <b>keys</b>: you split a key to get new independent keys, and never reuse one.</p>`,
code:{py:R`
import jax
import jax.numpy as jnp

def loss(w, X, y):
    return jnp.mean((X @ w - y) ** 2)

grad_loss = jax.jit(jax.grad(loss))           # compiled gradient function

key = jax.random.PRNGKey(0)
key, kx, kn = jax.random.split(key, 3)        # three independent keys
X = jax.random.normal(kx, (200, 3))
w_true = jnp.array([1.0, -2.0, 0.5])
y = X @ w_true + 0.1 * jax.random.normal(kn, (200,))

w = jnp.zeros(3)
for _ in range(200):
    w = w - 0.1 * grad_loss(w, X, y)          # no in-place updates
print(w)                                      # close to w_true

# loss for 8 different weight vectors at once, no Python loop
ws = jnp.stack([w + 0.01 * i for i in range(8)])
print(jax.vmap(loss, in_axes=(0, None, None))(ws, X, y))
`}},
{h:'Experiment hygiene',body:R`<ul><li>Every run is defined by a <b>config</b> (a dataclass) that is saved next to its results.</li>
<li>Seed everything, and log the git commit hash with each run.</li>
<li>Log scalars to CSV, TensorBoard or Weights &amp; Biases; never rely on numbers printed to a terminal.</li>
<li>Write the plotting script before you run the big sweep, and test it on a tiny run.</li>
<li>Keep one-file baselines (the CleanRL style) that you trust, and compare every new idea against them.</li></ul>`},
{h:'Reading papers',body:R`<p>Use three passes. <b>First</b> (10 minutes): title, abstract, figures, conclusion. What is the claim? <b>Second</b> (an hour): read everything except proofs, and write the method as pseudocode in your own words. <b>Third</b>: re-derive the key equations and plan how you would reproduce one result. Reproducing papers is the fastest way to become a researcher, and a public reproduction is a strong application piece.</p>`}
],
primer:R`<ul><li>Results need several seeds and confidence intervals.</li><li>JAX = NumPy + grad + jit + vmap, with pure functions and explicit random keys.</li><li>Configs, seeds, commit hashes and logs make results reproducible.</li><li>Read papers in three passes; reproduce one result.</li></ul>`,
drill:'Write a JAX training loop with <code>grad</code>, <code>jit</code> and explicit key splitting for logistic regression from blank in under <b>10 minutes</b>.',
ex:[
{t:'Three-pass a classic',d:1,q:R`<p>Read the DQN paper (Mnih et al., <i>Nature</i> 2015) in three passes. Write a one-page summary: problem, method as pseudocode, key results, and one thing you would test differently.</p>`},
{t:'Reproduce a figure honestly',d:2,q:R`<p>Reproduce the SARSA vs Q-learning cliff-walking figure (from 23.2) with 20 seeds. Plot the mean with a 95% bootstrap confidence band. Then plot what 3 seeds would have shown and comment on the difference.</p>`},
{t:'Logistic regression in JAX',d:2,q:R`<p>Port your NumPy logistic regression (18.1) to JAX using <code>grad</code> and <code>jit</code>. Check the gradients match your NumPy version to 1e-5, and time both on 10⁶ examples.</p>`},
{t:'32 seeds at once with vmap',d:3,q:R`<p>Write a pure-JAX ε-greedy bandit whose whole training run is one function of a key. Use <code>jax.vmap</code> to run 32 seeds in parallel and <code>jax.lax.scan</code> for the time loop. Compare speed against a Python loop over seeds.</p>`},
{t:'Config, logging, sweep',d:2,q:R`<p>Turn your DQN (23.5) into a script driven by a config dataclass parsed from the command line, logging to CSV with the config and git hash. Run a sweep over 3 learning rates × 5 seeds and produce the comparison plot with one command.</p>`},
{t:'Write a mini-paper',d:2,q:R`<p>Pick one experiment from this book, such as initialisation (20.6) or exploration schedules (23.4). Write a 4-page report: introduction, method, experimental setup, results with confidence intervals, limitations. Use LaTeX (Overleaf). This is practice for real papers and for statements of purpose.</p>`},
{t:'Contribute to open source',d:2,q:R`<p>Find a “good first issue” in Gymnasium, PettingZoo, CleanRL or PythonRobotics. Fix it, add a test, and open a pull request following the project’s contributing guide. Respond to review comments.</p>`},
{t:'Interview simulation',d:2,q:R`<p>Once a week: two timed DSA problems in 45 minutes (speaking your reasoning aloud), then explain from memory, on paper, backpropagation through a linear layer and the Bellman optimality equation. Record yourself and review it. Research engineer interviews usually test both coding and ML fundamentals.</p>`}
]}
);
})();
