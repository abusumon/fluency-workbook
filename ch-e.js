(function(){
const R=String.raw;
window.BOOK.chapters.push(
/* ================= PART 7 · ROBOTICS DEEP TRACK ================= */
{id:'c29',part:'P7',n:26,title:'Rigid Bodies in 3D',time:'8 days',
goal:'Represent and compose 3D rotations and poses without getting lost in conventions.',
needs:['c25','c03'],
math:[
{h:'Rotation matrices and SO(3)',body:R`<p>A 3D rotation is a \(3\times 3\) matrix \(R\) whose columns are the rotated unit axes. Valid rotations form the group \(SO(3)\): \(R^\top R = I\) (lengths and angles preserved) and \(\det R = +1\) (no mirror flip). Consequences: \(R^{-1} = R^\top\), and composing rotations is matrix multiplication. Order matters: \(R_1R_2 \ne R_2R_1\) in general. Try rotating a book 90° about x then y, and then the other way round.</p>
\[ R_x(\alpha) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\alpha & -\sin\alpha \\ 0 & \sin\alpha & \cos\alpha \end{pmatrix}, \quad R_z(\gamma) = \begin{pmatrix} \cos\gamma & -\sin\gamma & 0 \\ \sin\gamma & \cos\gamma & 0 \\ 0 & 0 & 1 \end{pmatrix}. \]`},
{h:'Euler angles and gimbal lock',body:R`<p>Roll–pitch–yaw writes a rotation as three elementary rotations, e.g. \(R = R_z(\psi)R_y(\theta)R_x(\phi)\). It is intuitive, but at pitch \(\theta = \pm 90^\circ\) the first and last axes line up and one degree of freedom disappears: <b>gimbal lock</b>. Small changes in orientation can then require huge jumps in the angles. Use Euler angles for display and user input, never for integration or interpolation.</p>`},
{h:'Axis–angle and Rodrigues’ formula',body:R`<p>Every rotation is a rotation by angle \(\theta\) about some unit axis \(\mathbf{u}\). With the <b>skew-symmetric matrix</b></p>
\[ [\mathbf{u}]_\times = \begin{pmatrix} 0 & -u_z & u_y \\ u_z & 0 & -u_x \\ -u_y & u_x & 0 \end{pmatrix}, \qquad [\mathbf{u}]_\times\mathbf{v} = \mathbf{u}\times\mathbf{v}, \]
<p>Rodrigues’ formula gives the matrix:</p>
\[ R = I + \sin\theta\,[\mathbf{u}]_\times + (1 - \cos\theta)\,[\mathbf{u}]_\times^2 = \exp(\theta[\mathbf{u}]_\times). \]
<p>The vector \(\boldsymbol\omega = \theta\mathbf{u}\) is a minimal 3-number description, and \(\exp\) maps it to \(SO(3)\). This <b>exponential map</b> is how modern estimators and optimisers update rotations.</p>`},
{h:'Quaternions',body:R`<p>A unit quaternion \(q = (w, x, y, z) = (\cos\frac\theta2,\ \sin\frac\theta2\,\mathbf{u})\) encodes the same rotation with 4 numbers and no gimbal lock. Rotating a vector: write \(\mathbf{v}\) as \((0, \mathbf{v})\), then \(\mathbf{v}' = q\,\mathbf{v}\,q^{*}\) with conjugate \(q^* = (w, -x, -y, -z)\). Composition is quaternion multiplication:</p>
\[ (w_1, \mathbf{v}_1)(w_2, \mathbf{v}_2) = \big(w_1w_2 - \mathbf{v}_1\cdot\mathbf{v}_2,\ \ w_1\mathbf{v}_2 + w_2\mathbf{v}_1 + \mathbf{v}_1\times\mathbf{v}_2\big). \]
<p>Note that \(q\) and \(-q\) are the same rotation. Smooth interpolation uses <b>slerp</b>: \(q(t) = \frac{\sin((1-t)\Omega)}{\sin\Omega}q_0 + \frac{\sin(t\Omega)}{\sin\Omega}q_1\) with \(\cos\Omega = q_0\cdot q_1\) (flip \(q_1\) if the dot product is negative).</p>`},
{h:'Poses in SE(3) and angular velocity',body:R`<p>A 3D pose is \(T = \begin{pmatrix} R & \mathbf{t} \\ \mathbf{0}^\top & 1 \end{pmatrix} \in SE(3)\), with \(T^{-1} = \begin{pmatrix} R^\top & -R^\top\mathbf{t} \\ \mathbf{0}^\top & 1 \end{pmatrix}\), exactly as in 2D. If a body spins with angular velocity \(\boldsymbol\omega\) (in the world frame), its orientation evolves as \(\dot R = [\boldsymbol\omega]_\times R\). Over a step \(\Delta t\) the exact update is \(R \leftarrow \exp(\Delta t[\boldsymbol\omega]_\times)\,R\); the naive \(R + \Delta t\,\dot R\) slowly stops being a rotation.</p>`}
],
learn:[
{h:'Conventions decide everything',body:R`<p>Most 3D bugs are convention bugs, so write yours at the top of every file.</p>
<ul><li><b>Axes:</b> ROS uses x forward, y left, z up for robot bodies (REP 103). Cameras use z forward, x right, y down. Always right-handed.</li>
<li><b>Quaternion order:</b> SciPy and ROS store <code>(x, y, z, w)</code>, scalar last. Eigen’s constructor takes <code>(w, x, y, z)</code> but stores <code>(x, y, z, w)</code>. Many papers use <code>(w, x, y, z)</code>.</li>
<li><b>Active vs passive:</b> does the matrix move the point, or change the frame it is described in? Name transforms <code>T_world_camera</code> and you rarely get this wrong.</li></ul>`},
{h:'Using SciPy and Eigen',body:R`<p>Write your own implementations first (the exercises), then use well-tested libraries in real projects.</p>`,
code:{py:R`
import numpy as np
from scipy.spatial.transform import Rotation as Rot

r = Rot.from_euler("zyx", [90, 0, 0], degrees=True)   # yaw 90 degrees
print(r.as_matrix().round(3))
print(r.as_quat())                    # [x, y, z, w]
print(r.apply([1, 0, 0]))             # -> [0, 1, 0]
r2 = Rot.from_rotvec([0, 0, np.pi / 2])   # axis-angle as one vector
print(np.allclose(r.as_matrix(), r2.as_matrix()))
`,cpp:R`
#include <Eigen/Geometry>
#include <iostream>

int main() {
    Eigen::Quaterniond q(Eigen::AngleAxisd(M_PI / 2, Eigen::Vector3d::UnitZ()));
    Eigen::Isometry3d T = Eigen::Isometry3d::Identity();
    T.rotate(q);
    T.pretranslate(Eigen::Vector3d(1, 0, 0));      // T = translate * rotate
    Eigen::Vector3d p = T * Eigen::Vector3d(1, 0, 0);
    std::cout << p.transpose() << '\n';            // 1 1 0
    std::cout << T.inverse().matrix() << '\n';
}
`}}
],
primer:R`<ul><li>Rotations: orthogonal, determinant 1, composed by multiplication, order matters.</li><li>Euler angles for humans only; quaternions or matrices for computation.</li><li>Update rotations with the exponential map; re-normalise quaternions.</li><li>Write your axis and quaternion conventions down.</li></ul>`,
drill:'Write Rodrigues’ formula, quaternion multiplication and SE(3) inverse from blank in under <b>12 minutes</b>, with tests against SciPy.',
ex:[
{t:'Rodrigues versus SciPy',d:1,q:R`<p>Implement <code>skew(u)</code> and <code>rodrigues(axis, theta)</code>. For 1,000 random axes and angles, check \(R^\top R = I\), \(\det R = 1\), and agreement with <code>Rot.from_rotvec</code>.</p>`,
py:R`
import numpy as np

def skew(u: np.ndarray) -> np.ndarray:
    # TODO: 3x3 matrix with skew(u) @ v == np.cross(u, v)
    return np.zeros((3, 3))

def rodrigues(axis: np.ndarray, theta: float) -> np.ndarray:
    u = axis / np.linalg.norm(axis)
    K = skew(u)
    # TODO: I + sin(theta) K + (1 - cos(theta)) K @ K
    return np.eye(3)
`},
{t:'See gimbal lock',d:1,q:R`<p>Build \(R_z(\psi)R_y(\theta)R_x(\phi)\) yourself. Set \(\theta = 90^\circ\) and show numerically that changing \(\psi\) and changing \(\phi\) produce the same family of rotations (only \(\psi - \phi\) matters). Plot the three body axes in 3D with matplotlib.</p>`},
{t:'A Quaternion class',d:2,q:R`<p>Write <code>Quaternion</code> with multiplication (<code>__mul__</code>), conjugate, normalise, <code>rotate(v)</code>, <code>to_matrix()</code>, <code>from_axis_angle</code> and <code>slerp</code>. Test against SciPy, minding the scalar-last order. Animate a cube rotating smoothly between two orientations with slerp.</p>`},
{t:'A chain of frames',d:2,q:R`<p>A rover: <code>world → base</code> (pose from odometry), <code>base → mast</code> (fixed, 0.6 m up), <code>mast → camera</code> (pan–tilt joint angles). A marker is seen at <code>(0.2, −0.1, 2.0)</code> in the camera frame (z forward). Compute its world position. Then invert the chain and recover the camera-frame point.</p>`},
{t:'Integrating angular velocity',d:2,q:R`<p>Spin a body with constant \(\boldsymbol\omega = (0.3, -0.2, 1.0)\) rad/s for 60 s at \(\Delta t = 0.01\). Integrate with naive Euler \(R \leftarrow R + \Delta t[\boldsymbol\omega]_\times R\) and with the exponential map. Plot \(\lVert R^\top R - I\rVert\) over time for both, and fix Euler with an SVD re-orthogonalisation step.</p>`},
{t:'Align two point clouds (Kabsch)',d:3,q:R`<p>Given matched points \(P\) and \(Q = RP + \mathbf{t} + \text{noise}\), recover \(R\) and \(\mathbf{t}\): centre both sets, take the SVD of \(H = \sum (\mathbf{p}_i - \bar{\mathbf p})(\mathbf{q}_i - \bar{\mathbf q})^\top = U\Sigma V^\top\), set \(R = V\,\mathrm{diag}(1, 1, \det(VU^\top))\,U^\top\). Explain why the determinant correction is needed. This is the core of ICP scan matching.</p>`},
{t:'Same thing in Eigen',d:2,q:R`<p>Re-do the frame chain (exercise 2) in C++ with <code>Eigen::Isometry3d</code> and <code>Eigen::Quaterniond</code>, built with CMake. Check the numbers match Python to 1e-9.</p>`}
]},

{id:'c30',part:'P7',n:27,title:'Dynamics and Optimal Control',time:'12 days',
goal:'Model how robots move under forces, then control them optimally with LQR and MPC.',
needs:['c29','c17'],
math:[
{h:'Equations of motion from energy',body:R`<p>For complicated mechanisms, forces are hard to track; energy is easy. With kinetic energy \(T\) and potential energy \(V\), the <b>Lagrangian</b> is \(\mathcal{L} = T - V\), and each generalised coordinate \(q_i\) obeys the Euler–Lagrange equation</p>
\[ \frac{d}{dt}\frac{\partial\mathcal{L}}{\partial\dot q_i} - \frac{\partial\mathcal{L}}{\partial q_i} = \tau_i. \]
<p>Pendulum (length \(l\), mass \(m\), angle \(\theta\) from vertical): \(T = \frac12 ml^2\dot\theta^2\), \(V = -mgl\cos\theta\), which gives \(ml^2\ddot\theta + mgl\sin\theta = \tau\). For any robot arm the result has the same structure, the <b>manipulator equation</b>:</p>
\[ M(\mathbf q)\ddot{\mathbf q} + C(\mathbf q, \dot{\mathbf q})\dot{\mathbf q} + \mathbf g(\mathbf q) = \boldsymbol\tau, \]
<p>with mass matrix \(M\) (symmetric, positive definite), Coriolis/centrifugal terms \(C\), and gravity \(\mathbf g\).</p>`},
{h:'State space and linearisation',body:R`<p>Stack positions and velocities into a state \(\mathbf x\); dynamics become \(\dot{\mathbf x} = f(\mathbf x, \mathbf u)\). Near an equilibrium \((\mathbf x^*, \mathbf u^*)\), a Taylor expansion gives the linear model</p>
\[ \dot{\delta\mathbf x} \approx A\,\delta\mathbf x + B\,\delta\mathbf u, \qquad A = \frac{\partial f}{\partial\mathbf x}\Big|_*,\ B = \frac{\partial f}{\partial\mathbf u}\Big|_*. \]
<p>The equilibrium is stable if every eigenvalue of \(A\) has negative real part. For the upright pendulum, \(A\) has a positive eigenvalue \(\sqrt{g/l}\): it falls over unless controlled.</p>`},
{h:'LQR: the optimal linear controller',body:R`<p>Choose weights \(Q \succeq 0\) (how much you care about state error) and \(R \succ 0\) (how much you care about effort), and minimise</p>
\[ J = \int_0^\infty \big(\mathbf x^\top Q\mathbf x + \mathbf u^\top R\mathbf u\big)\,dt \quad\text{subject to}\quad \dot{\mathbf x} = A\mathbf x + B\mathbf u. \]
<p>The optimal control is linear state feedback \(\mathbf u = -K\mathbf x\) with \(K = R^{-1}B^\top P\), where \(P\) solves the continuous algebraic Riccati equation</p>
\[ A^\top P + PA - PBR^{-1}B^\top P + Q = 0. \]
<p>This is Bellman’s principle again: \(V(\mathbf x) = \mathbf x^\top P\mathbf x\) is the optimal cost-to-go, and the Riccati equation is the Bellman equation for quadratic values and linear dynamics.</p>`},
{h:'Model predictive control',body:R`<p>MPC solves a finite-horizon optimisation at every time step, applies only the first action, and re-plans:</p>
\[ \min_{\mathbf u_0..\mathbf u_{N-1}} \sum_{k=0}^{N-1}\big(\lVert\mathbf x_k - \mathbf x^{ref}_k\rVert_Q^2 + \lVert\mathbf u_k\rVert_R^2\big) \ \text{ s.t. } \ \mathbf x_{k+1} = f(\mathbf x_k, \mathbf u_k),\ \ \mathbf u_{min} \le \mathbf u_k \le \mathbf u_{max}. \]
<p>Its power is constraints: motor limits, speed limits and obstacle margins are written directly into the problem. Legged robots and autonomous cars use MPC heavily; learned policies are often compared against it.</p>`}
],
learn:[
{h:'Simulating ODEs properly',body:R`<p>Write the dynamics as a function <code>f(t, x, u)</code> that returns \(\dot{\mathbf x}\). Integrate with your own RK4 for fixed-step control loops, or <code>scipy.integrate.solve_ivp</code> for accurate offline simulation. Always monitor a conserved quantity (energy, with no friction or input) to catch integration bugs.</p>`,
code:{py:R`
import numpy as np

def pendulum(t, x, tau=0.0, g=9.81, l=1.0, m=1.0):
    theta, omega = x
    return np.array([omega, (tau - m * g * l * np.sin(theta)) / (m * l * l)])

def rk4_step(f, t, x, dt, *args):
    k1 = f(t, x, *args)
    k2 = f(t + dt / 2, x + dt / 2 * k1, *args)
    k3 = f(t + dt / 2, x + dt / 2 * k2, *args)
    k4 = f(t + dt, x + dt * k3, *args)
    return x + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
`}},
{h:'Tools: SciPy, CVXPY, MuJoCo',body:R`<ul><li><code>scipy.linalg.solve_continuous_are(A, B, Q, R)</code> returns \(P\) for LQR (<code>solve_discrete_are</code> for discrete time).</li>
<li><b>CVXPY</b> lets you write convex optimisation problems almost as they look on paper, which makes it ideal for prototyping linear MPC.</li>
<li><b>MuJoCo</b> (<code>pip install mujoco</code>) is the physics engine used throughout robot learning research. You describe a robot in an XML file, then step <code>mujoco.mj_step(model, data)</code> and read <code>data.qpos</code>, <code>data.qvel</code> and write <code>data.ctrl</code>.</li></ul>`}
],
primer:R`<ul><li>Lagrangian mechanics gives \(M\ddot q + C\dot q + g = \tau\).</li><li>Linearise around equilibria; check eigenvalues for stability.</li><li>LQR: \(u = -Kx\) from the Riccati equation.</li><li>MPC: re-solve a constrained finite-horizon problem every step.</li></ul>`,
drill:'Linearise the cart-pole at the upright position and compute an LQR gain with SciPy from blank in under <b>15 minutes</b>.',
ex:[
{t:'Pendulum and energy',d:1,q:R`<p>Simulate the frictionless pendulum from 170° for 20 s with Euler, semi-implicit Euler and RK4 at \(\Delta t = 0.01\). Plot total energy \(E = \frac12 ml^2\dot\theta^2 - mgl\cos\theta\) for each.</p>`},
{t:'Double pendulum from the Lagrangian',d:3,q:R`<p>Derive the equations of the double pendulum on paper (or with SymPy’s <code>Lagrange</code> helper, then check by hand). Simulate two starts differing by \(10^{-6}\) rad and plot how fast they separate: this is chaos, and a reason long-horizon prediction is hard.</p>`},
{t:'Balance a cart-pole with LQR',d:2,q:R`<p>Write cart-pole dynamics, linearise around upright (by hand, then check with finite differences), compute \(K\) with <code>solve_continuous_are</code>, and stabilise from a 10° tilt in your nonlinear simulator. Vary \(Q\) and \(R\) and describe the trade-off.</p>`,
py:R`
import numpy as np
from scipy.linalg import solve_continuous_are

def cartpole(x, u, M=1.0, m=0.1, l=0.5, g=9.81):
    pos, vel, th, om = x
    # TODO: standard cart-pole equations (theta = 0 upright)
    return np.zeros(4)

def linearize(f, x0, u0, eps=1e-6):
    n = len(x0)
    A = np.zeros((n, n)); B = np.zeros((n, 1))
    # TODO: central differences on each state and on u
    return A, B

A, B = linearize(cartpole, np.zeros(4), 0.0)
Q, Rm = np.diag([1, 1, 10, 1]), np.array([[0.1]])
P = solve_continuous_are(A, B, Q, Rm)
K = np.linalg.solve(Rm, B.T @ P)
`},
{t:'Swing up, then catch',d:3,q:R`<p>Starting from hanging down, pump energy with an energy-shaping controller until the pole nears upright, then switch to your LQR. Plot the angle and the switching moment.</p>`},
{t:'MPC for path tracking',d:2,q:R`<p>Linearise the differential-drive model along a reference path and track a figure-eight with linear MPC in CVXPY (horizon 20, speed and turn-rate limits). Compare tracking error with your PID from 25.5.</p>`},
{t:'Computed-torque control',d:3,q:R`<p>For the 2-link arm, implement the manipulator equation and the controller \(\boldsymbol\tau = M(\mathbf q)(\ddot{\mathbf q}_d + K_d\dot{\mathbf e} + K_p\mathbf e) + C\dot{\mathbf q} + \mathbf g\). Track a circle with the hand (using IK from 25.3). Then use a mass matrix 20% wrong and observe what breaks.</p>`},
{t:'First steps in MuJoCo',d:2,q:R`<p>Write an XML model of a cart-pole (or use one from the MuJoCo examples), load it with the Python bindings, and apply your LQR gain using MuJoCo’s state. Render with the passive viewer. Compare MuJoCo’s motion with your own simulator.</p>`}
]},

{id:'c31',part:'P7',n:28,title:'State Estimation and SLAM',time:'12 days',
goal:'Know where the robot is, and build the map while finding out.',
needs:['c25','c30'],
math:[
{h:'The Bayes filter',body:R`<p>The robot never knows its state \(x_t\); it keeps a <b>belief</b>, a probability distribution over states, given all controls \(u_{1:t}\) and measurements \(z_{1:t}\). Every filter in this chapter is a version of two steps:</p>
\[ \text{predict: } \overline{bel}(x_t) = \int p(x_t\mid u_t, x_{t-1})\,bel(x_{t-1})\,dx_{t-1}, \]
\[ \text{update: } bel(x_t) = \eta\,p(z_t\mid x_t)\,\overline{bel}(x_t). \]
<p>Prediction blurs the belief through the motion model; the update sharpens it by Bayes’ rule with the measurement likelihood (\(\eta\) normalises). The Kalman filter from Chapter 25 is the exact Bayes filter when everything is linear and Gaussian.</p>`},
{h:'Extended Kalman filter',body:R`<p>Real motion \(x_t = g(u_t, x_{t-1})\) and measurement \(z_t = h(x_t)\) models are nonlinear (sines and cosines of heading, range and bearing to landmarks). The EKF linearises around the current estimate with Jacobians \(G = \partial g/\partial x\) and \(H = \partial h/\partial x\), and then runs the Kalman equations with them:</p>
\[ \bar\mu = g(u, \mu),\ \ \bar\Sigma = G\Sigma G^\top + Q;\quad K = \bar\Sigma H^\top(H\bar\Sigma H^\top + R)^{-1},\ \ \mu = \bar\mu + K(z - h(\bar\mu)),\ \ \Sigma = (I - KH)\bar\Sigma. \]
<p>For a range–bearing measurement of landmark \(\mathbf m\) from pose \((x, y, \theta)\): \(r = \sqrt{(m_x - x)^2 + (m_y - y)^2}\), \(\phi = \operatorname{atan2}(m_y - y, m_x - x) - \theta\). Always wrap the bearing innovation into \([-\pi, \pi]\).</p>`},
{h:'Particle filters',body:R`<p>Represent the belief by \(N\) samples (particles) \(x^{[i]}\). Predict: move each particle with the motion model plus sampled noise. Update: give each a weight \(w^{[i]} \propto p(z\mid x^{[i]})\). Resample: draw a new set with probability proportional to weight (low-variance resampling keeps diversity). Particle filters handle multimodal beliefs, such as “I am in one of three identical corridors”, which a Gaussian cannot. This is Monte Carlo localisation.</p>`},
{h:'Occupancy grids with log-odds',body:R`<p>Each cell stores the log-odds \(\ell = \log\frac{p}{1-p}\) of being occupied. Bayes’ rule becomes addition: for each lidar beam, cells the beam passes through get \(\ell \mathrel{-}= \ell_{free}\), and the cell where it ends gets \(\ell \mathrel{+}= \ell_{occ}\). Recover \(p = 1 - \frac{1}{1 + e^{\ell}}\). Clamp \(\ell\) so the map can still change.</p>`},
{h:'SLAM as least squares',body:R`<p>Modern SLAM is a graph: nodes are robot poses \(\mathbf x_i\), edges are measured relative poses \(\mathbf z_{ij}\) from odometry or loop closures with information matrices \(\Omega_{ij}\). Find all poses at once:</p>
\[ \mathbf x^* = \arg\min_{\mathbf x}\sum_{(i,j)}\mathbf e_{ij}^\top\,\Omega_{ij}\,\mathbf e_{ij}, \qquad \mathbf e_{ij} = \mathbf z_{ij} \ominus (\mathbf x_j \ominus \mathbf x_i). \]
<p><b>Gauss–Newton</b> linearises the errors, \(\mathbf e(\mathbf x + \Delta) \approx \mathbf e + J\Delta\), and solves \((J^\top\Omega J)\Delta = -J^\top\Omega\mathbf e\) repeatedly. The system is sparse, so thousands of poses solve in milliseconds. A <b>loop closure</b> (recognising a place seen before) adds an edge that pulls the whole drifted trajectory back into shape.</p>`}
],
learn:[
{h:'Sensors and their errors',body:R`<ul><li><b>Wheel odometry:</b> smooth but drifts without bound; slips badly on sand, which matters for rovers.</li>
<li><b>IMU:</b> gyroscopes and accelerometers at hundreds of Hz. Integrating them drifts quickly (accelerometer bias is integrated twice into position).</li>
<li><b>GNSS:</b> absolute but noisy (metres) and slow (1–10 Hz); RTK GNSS reaches centimetres.</li>
<li><b>Lidar and cameras:</b> rich geometry; used for scan matching, visual odometry and loop closure.</li></ul>
<p>Good estimation fuses fast-but-drifting sensors with slow-but-absolute ones.</p>`},
{h:'Libraries you will meet',body:R`<p>Research and industry SLAM mostly uses factor-graph libraries: <b>GTSAM</b> (C++ with Python bindings), <b>g2o</b> and <b>Ceres Solver</b>. In ROS 2, <code>robot_localization</code> fuses IMU, odometry and GNSS with an EKF, and <code>slam_toolbox</code> builds 2D lidar maps. Build small versions yourself first, so these libraries are not black boxes.</p>`}
],
primer:R`<ul><li>Belief = probability over states; predict blurs, update sharpens.</li><li>EKF linearises with Jacobians; particle filters handle multiple hypotheses.</li><li>Occupancy grids add log-odds.</li><li>Graph SLAM is sparse nonlinear least squares; loop closures fix drift.</li></ul>`,
drill:'Write a particle-filter predict–weight–resample step from blank in under <b>10 minutes</b>.',
ex:[
{t:'Histogram filter in a corridor',d:1,q:R`<p>A 1D corridor of 50 cells with doors at known cells. The robot moves right one cell per step (with 10% chance of 0 or 2) and senses “door / no door” with 90% accuracy. Implement the discrete Bayes filter and plot the belief every step, starting from uniform.</p>`},
{t:'EKF localisation with landmarks',d:2,q:R`<p>A differential-drive robot drives a loop among 6 known landmarks, measuring range and bearing with noise. Implement EKF predict and update with your own Jacobians (check them by finite differences). Plot the true path, odometry-only path and EKF estimate with 2σ ellipses.</p>`,
py:R`
import numpy as np

def motion(x, u, dt):
    v, w = u
    # TODO: return new [x, y, theta]
    return x

def motion_jacobian(x, u, dt):
    # TODO: G = d motion / d x  (3x3)
    return np.eye(3)

def measure(x, m):
    # TODO: [range, bearing] to landmark m from pose x
    return np.zeros(2)

def measure_jacobian(x, m):
    # TODO: H = d measure / d x  (2x3)
    return np.zeros((2, 3))

def ekf_step(mu, Sigma, u, zs, landmarks, Q, R, dt):
    G = motion_jacobian(mu, u, dt)
    mu = motion(mu, u, dt)
    Sigma = G @ Sigma @ G.T + Q
    for j, z in zs:                       # (landmark index, measurement)
        H = measure_jacobian(mu, landmarks[j])
        # TODO: innovation (wrap the bearing!), gain, update mu and Sigma
    return mu, Sigma
`},
{t:'Monte Carlo localisation',d:3,q:R`<p>Load an occupancy grid. Simulate a robot with an 8-beam lidar using ray casting on the grid. Start 2,000 particles uniformly over free space, and watch the cloud converge. Make the map symmetric and show the belief staying multimodal until a distinguishing feature appears.</p>`},
{t:'Occupancy grid mapping',d:2,q:R`<p>From known poses and simulated lidar scans, build an occupancy grid with log-odds updates and Bresenham ray tracing. Visualise the map as it grows.</p>`},
{t:'Pose-graph optimisation',d:3,q:R`<p>Generate a square trajectory with noisy odometry so it fails to close. Add one loop-closure edge between the first and last pose. Implement 2D Gauss–Newton over all poses (fix the first pose), and plot before and after. Then solve the same graph with GTSAM and compare.</p>`},
{t:'GNSS + IMU + odometry for a rover',d:2,q:R`<p>Simulate a rover with 100 Hz IMU yaw rate, 20 Hz wheel speed (with occasional slip) and 2 Hz noisy GNSS. Build an EKF with state <code>(x, y, θ, v)</code> fusing all three. Report error with and without GNSS, and with GNSS dropouts of 20 s. Then configure ROS 2 <code>robot_localization</code> for the same sensors.</p>`}
]},

{id:'c32',part:'P7',n:29,title:'Motion Planning',time:'10 days',
goal:'Plan collision-free paths in continuous spaces, then turn them into smooth trajectories.',
needs:['c13','c29'],
math:[
{h:'Configuration space',body:R`<p>The <b>configuration</b> \(\mathbf q\) is everything needed to place the robot: \((x, y, \theta)\) for a rover, joint angles for an arm. The configuration space \(\mathcal{C}\) splits into free space \(\mathcal{C}_{free}\) and obstacle space. Planning means finding a continuous path in \(\mathcal{C}_{free}\). A small obstacle in the workspace can become a large, strangely shaped region in an arm’s C-space; plotting it once (exercise 1) builds lasting intuition.</p>`},
{h:'Sampling-based planners',body:R`<p>Grids explode in high dimensions: 100 cells per joint for a 7-joint arm is \(10^{14}\) cells. Sampling-based planners only check random configurations for collisions.</p>
<ul><li><b>RRT</b> grows a tree: sample \(\mathbf q_{rand}\), find the nearest tree node, step toward the sample by \(\eta\), add the node if the segment is collision-free. It is <b>probabilistically complete</b>: if a path exists, the probability of finding it tends to 1.</li>
<li><b>RRT*</b> also chooses the best parent among nearby nodes and <b>rewires</b> neighbours through the new node. With a neighbourhood radius shrinking like \(r_n \propto (\log n / n)^{1/d}\), it is <b>asymptotically optimal</b>: path cost converges to the optimum.</li>
<li><b>PRM</b> samples many free configurations, connects near neighbours, then runs A* on that roadmap; good for many queries in the same environment.</li></ul>`},
{h:'Trajectories',body:R`<p>A path says where; a trajectory says where <i>and when</i>. Minimum-jerk motion between two rest states over time \(T\), with \(s = t/T\), is the quintic</p>
\[ x(t) = x_0 + (x_f - x_0)\,(10s^3 - 15s^4 + 6s^5), \]
<p>which has zero velocity and acceleration at both ends. More generally, <b>trajectory optimisation</b> chooses a discretised trajectory minimising smoothness and obstacle costs, e.g. \(\sum_k \lVert\mathbf x_{k+1} - 2\mathbf x_k + \mathbf x_{k-1}\rVert^2 + \lambda\sum_k c_{obs}(\mathbf x_k)\), by gradient descent. CHOMP and TrajOpt are well-known versions.</p>`}
],
learn:[
{h:'The planning stack',body:R`<p>Real robots layer planners: a <b>global planner</b> finds a coarse route (A* on a grid, PRM), a <b>local planner</b> or trajectory optimiser makes it smooth and dynamically feasible around nearby obstacles, and a <b>controller</b> (PID, MPC) tracks it. ROS 2’s Nav2 and MoveIt 2 follow this structure; the OMPL library implements dozens of sampling-based planners.</p>`},
{h:'Collision checking is most of the cost',body:R`<p>Planners spend most of their time asking “is this configuration or segment free?”. Check segments by sampling points at a resolution smaller than the thinnest obstacle, or use exact geometric tests such as segment–circle distance. Cache results, and use your k-d tree (10.8) for nearest-neighbour queries.</p>`}
],
primer:R`<ul><li>Plan in configuration space.</li><li>RRT is fast and complete in probability; RRT* converges to optimal; PRM is for repeated queries.</li><li>Paths become trajectories through time parameterisation or optimisation.</li><li>Collision checking dominates run time.</li></ul>`,
drill:'Write RRT for a 2D point robot among circular obstacles, with path extraction, from blank in under <b>15 minutes</b>.',
ex:[
{t:'See a C-space',d:1,q:R`<p>For your 2-link arm (25.2) and two circular workspace obstacles, sample a 360×360 grid of \((q_1, q_2)\), test collision of both links, and plot the C-space obstacles. Pick two free configurations and find a path with grid A* (13.3) in C-space; animate the arm.</p>`},
{t:'RRT in 2D',d:2,q:R`<p>Implement RRT with goal biasing (sample the goal 5% of the time) in a 2D world with random circles. Plot the tree and the path. Count iterations over 50 runs.</p>`,
py:R`
import numpy as np

def segment_free(p, q, obstacles, step=0.05) -> bool:
    # TODO: sample along p->q, check distance to each (centre, radius)
    return True

def rrt(start, goal, obstacles, bounds, eta=0.5, iters=5000, goal_bias=0.05, seed=0):
    rng = np.random.default_rng(seed)
    nodes = [np.array(start, float)]
    parent = [-1]
    for _ in range(iters):
        sample = np.array(goal, float) if rng.random() < goal_bias else rng.uniform(bounds[0], bounds[1])
        i_near = int(np.argmin([np.linalg.norm(n - sample) for n in nodes]))
        # TODO: steer from nodes[i_near] toward sample by at most eta
        # TODO: if segment free, append node and parent
        # TODO: if close to goal and segment to goal free, return path
    return None
`},
{t:'RRT*',d:3,q:R`<p>Add best-parent selection and rewiring. Plot path cost against iterations for RRT and RRT* (mean of 20 seeds) and show RRT* keeps improving.</p>`},
{t:'PRM with your A*',d:2,q:R`<p>Build a PRM with 500 samples and k = 10 nearest neighbours (k-d tree), then answer 100 start/goal queries with A*. Compare total time with running RRT 100 times.</p>`},
{t:'Shortcutting and smoothing',d:1,q:R`<p>Take an RRT path, repeatedly try to replace a random sub-path by a straight segment if collision-free, then time-parameterise each segment with the minimum-jerk quintic. Plot position, velocity and acceleration.</p>`},
{t:'Gradient-based trajectory optimisation',d:3,q:R`<p>Start from a straight-line trajectory of 50 points through obstacles. Minimise the smoothness cost plus an obstacle cost that grows inside a safety margin, with fixed endpoints, by gradient descent. Visualise the trajectory bending around obstacles, and show a case where it gets stuck in a local minimum that RRT avoids.</p>`},
{t:'RRT in C++',d:2,q:R`<p>Port RRT to C++ with a k-d tree for nearest neighbours. Compare run time with Python for 10⁵ iterations. Then try the same problem in OMPL through its Python bindings.</p>`}
]},

{id:'c33',part:'P7',n:30,title:'Robot Learning',time:'14 days',
goal:'Train robot policies from demonstrations and simulation, the way current robot foundation models start.',
needs:['c21','c23','c30'],
math:[
{h:'Behaviour cloning is supervised learning',body:R`<p>Given expert demonstrations \(\mathcal{D} = \{(s_i, a_i)\}\), behaviour cloning (BC) fits a policy by maximum likelihood:</p>
\[ \min_\theta\ \mathbb{E}_{(s,a)\sim\mathcal{D}}\big[-\log\pi_\theta(a\mid s)\big], \]
<p>which for a Gaussian policy with fixed variance is just mean squared error on actions.</p>`},
{h:'Why small errors compound',body:R`<p>The policy is trained on states the expert visits, but at test time it visits states produced by its <i>own</i> slightly wrong actions: <b>covariate shift</b>. If the policy errs with probability \(\varepsilon\) per step on expert states, and one error leads to unfamiliar states where it keeps failing, the expected cost over a horizon \(T\) grows like \(O(\varepsilon T^2)\) (Ross &amp; Bagnell). <b>DAgger</b> fixes this by running the learner, asking the expert to label the states the learner actually visits, aggregating the data and retraining; its cost grows like \(O(\varepsilon T)\).</p>`},
{h:'Averaging destroys multimodal behaviour',body:R`<p>If half the demonstrations go left around an obstacle and half go right, the MSE-optimal action is their average: straight into the obstacle. Policies must model the full action distribution. <b>Diffusion policies</b> learn to denoise actions. Training adds Gaussian noise to a demonstrated action chunk \(\mathbf a_0\),</p>
\[ \mathbf a_t = \sqrt{\bar\alpha_t}\,\mathbf a_0 + \sqrt{1 - \bar\alpha_t}\,\boldsymbol\epsilon,\quad \boldsymbol\epsilon\sim\mathcal N(0, I), \qquad \mathcal{L} = \mathbb{E}\big\lVert\boldsymbol\epsilon - \boldsymbol\epsilon_\theta(\mathbf a_t, t, s)\big\rVert^2, \]
<p>and at test time starts from pure noise and repeatedly removes the predicted noise, conditioned on the observation. Different noise samples give different valid modes (left or right), not their average.</p>`},
{h:'Domain randomisation',body:R`<p>To transfer from simulation, train on a <i>distribution</i> of simulators with parameters \(\xi\) (friction, masses, delays, lighting) and maximise \(\mathbb{E}_{\xi\sim p(\xi)}\big[J(\pi;\xi)\big]\). If the real world looks like one more sample from \(p(\xi)\), the policy transfers. Too narrow a range fails to transfer; too wide a range gives an overly cautious policy.</p>`}
],
learn:[
{h:'Where robot data comes from',body:R`<ul><li><b>Teleoperation:</b> a human drives the robot (leader–follower arms, VR) and the robot records observations and actions.</li>
<li><b>Simulation:</b> scripted or RL experts generate unlimited demonstrations.</li>
<li><b>Human video:</b> plentiful, but has no robot actions; methods try to infer them.</li>
<li><b>Cross-embodiment datasets:</b> Open X-Embodiment pooled data from many labs and robots to train shared policies.</li></ul>
<p>Vision-language-action models (VLAs), such as Figure’s Helix and NVIDIA’s GR00T, extend this with large pretrained vision-language backbones and predict action chunks from images and instructions.</p>`},
{h:'Action chunking and LeRobot',body:R`<p>Predicting a short sequence of future actions (a <b>chunk</b>) instead of one action at a time reduces compounding error and jitter; ACT and diffusion policies both do this. Hugging Face’s <b>LeRobot</b> library packages datasets, simulated environments (such as PushT and ALOHA) and implementations of ACT and diffusion policy, and supports low-cost real arms. It is the quickest way to train a modern policy on a laptop GPU or Colab.</p>`},
{h:'Evaluate honestly',body:R`<p>Robot learning results are easy to overstate. Fix the evaluation protocol before training: number of trials, initial conditions, what counts as success, and report success with a confidence interval (see Chapter 35’s math). Include failure videos.</p>`}
],
primer:R`<ul><li>BC = supervised learning on demonstrations; errors compound over the horizon.</li><li>DAgger relabels the learner’s own states.</li><li>Multimodal actions need distribution-modelling policies (diffusion, mixtures).</li><li>Randomise simulation to cross the reality gap.</li></ul>`,
drill:'Write a BC training loop and a DAgger loop for a 2D reaching task from blank in under <b>20 minutes</b>.',
ex:[
{t:'Clone your own controller',d:1,q:R`<p>Use your PID go-to-goal controller (25.5) as the expert. Collect 100 demonstrations, train an MLP policy with MSE, and measure success rate over 200 new starts.</p>`},
{t:'Measure compounding error',d:2,q:R`<p>With the BC policy, plot final position error against task horizon (20 to 400 steps). Add small observation noise at test time only and plot again. Compare the curve’s shape with the \(O(\varepsilon T^2)\) argument.</p>`},
{t:'Implement DAgger',d:2,q:R`<p>Run 10 DAgger iterations: roll out the learner, label every visited state with the expert, aggregate, retrain. Plot success rate per iteration against plain BC trained on the same total number of labels.</p>`,
py:R`
import numpy as np

def rollout(policy, env, steps):
    states = []
    s = env.reset()
    for _ in range(steps):
        states.append(s)
        s, done = env.step(policy(s))
        if done:
            break
    return np.array(states)

def dagger(expert, train, env, iters=10, steps=200):
    S = []; A = []
    policy = expert                      # iteration 0: expert rollouts
    for k in range(iters):
        states = rollout(policy, env, steps)
        # TODO: label with expert, append to S, A
        # TODO: policy = train(np.array(S), np.array(A))
    return policy
`},
{t:'Left or right? Multimodal demos',d:3,q:R`<p>Make demonstrations that pass an obstacle on the left half the time and on the right half the time. Show that the MSE policy drives into the obstacle. Then train a tiny diffusion policy (an MLP that predicts noise from noisy action, step t and state, 50 denoising steps) and show it picks one side per rollout.</p>`},
{t:'Randomise to transfer',d:2,q:R`<p>Train a cart-pole or reaching policy (RL or BC) in your simulator with fixed friction and mass. Test on a “real” simulator with different values. Retrain with randomised parameters and test again. Plot success against the size of the randomisation range.</p>`},
{t:'Train with LeRobot',d:2,q:R`<p>Install LeRobot, train a diffusion policy or ACT on a provided simulated dataset (PushT or ALOHA), and evaluate success rate over 50 episodes with your own fixed protocol. Read the policy’s source and write a one-page explanation of its data flow.</p>`},
{t:'Read a VLA paper',d:1,q:R`<p>Three-pass one recent VLA paper (for example NVIDIA’s GR00T N1 report or the RT-2 paper). Answer: what data, what architecture, how actions are represented, how it was evaluated, and what failure cases are reported or missing.</p>`}
]},

{id:'c34',part:'P7',n:31,title:'Hardware and Embedded Systems',time:'10 days',
goal:'Make real motors and sensors do what your code says, safely, which is the part simulation hides.',
needs:['g4','c25'],
math:[
{h:'The DC motor model',body:R`<p>A brushed DC motor obeys an electrical and a mechanical equation:</p>
\[ V = IR + L\frac{dI}{dt} + K_e\,\omega, \qquad J\dot\omega = K_t I - b\,\omega - \tau_{load}. \]
<p>\(K_e\omega\) is the back-EMF; in SI units \(K_e = K_t\). At steady state with no load, speed is roughly proportional to voltage, which is why PWM duty cycle controls speed. A gearbox with ratio \(N\) multiplies torque by \(N\) and divides speed by \(N\) (minus efficiency losses): rovers trade speed for torque to climb slopes.</p>`},
{h:'Sampling, filtering, quantisation',body:R`<p>Sampling at rate \(f_s\) can only represent frequencies below \(f_s/2\) (Nyquist); faster signals <b>alias</b> into false slow ones, so sample well above what you control. An encoder with \(N\) counts per revolution measures speed as \(\omega \approx \frac{2\pi\,\Delta\text{counts}}{N\,\Delta t}\): at low speed, few counts per interval make this coarse. A first-order low-pass filter \(y_k = y_{k-1} + \alpha(x_k - y_{k-1})\) with \(\alpha = \frac{\Delta t}{\tau + \Delta t}\) smooths noise but adds lag of about \(\tau\). The complementary filter for tilt, \(\theta = \beta(\theta + \omega_{gyro}\Delta t) + (1-\beta)\theta_{accel}\), combines a drifting gyro with a noisy accelerometer.</p>`},
{h:'Power budgets',body:R`<p>Battery energy (Wh) = voltage × capacity (Ah). Runtime ≈ energy ÷ average power. A 24 V, 10 Ah pack holds 240 Wh; with six 30 W drive motors at 50% average load plus 40 W of computers, runtime is about \(240 / (90 + 40) \approx 1.8\) h before derating. Real usable capacity is lower (often 80%), so engineers keep margins.</p>`}
],
learn:[
{h:'The computing layers of a robot',body:R`<ul><li><b>Microcontrollers</b> (Arduino, ESP32, STM32, Teensy) run one hard real-time loop: read encoders, run PID, drive motors. No operating system, microsecond timing.</li>
<li><b>Single-board computers</b> (Raspberry Pi, NVIDIA Jetson) run Linux and ROS 2: planning, perception, networking. Jetson adds a GPU for neural networks on the robot.</li>
<li>They talk over <b>serial (UART)</b>, <b>CAN bus</b> (robust multi-device bus used in cars and many rovers) or Ethernet. Sensors usually connect to microcontrollers by <b>I²C</b> or <b>SPI</b>.</li></ul>`},
{h:'Embedded C++ habits',body:R`<p>Embedded code is C++ with restrictions: avoid heap allocation inside the control loop, use fixed-size buffers (your <code>RingBuffer&lt;N&gt;</code> from Chapter 7), keep interrupt handlers tiny (set a flag or increment a counter), and mark variables shared with interrupts <code>volatile</code>. Use integer or fixed-point math where floating point is slow. <b>micro-ROS</b> brings ROS 2 topics onto microcontrollers.</p>`},
{h:'Safety first',body:R`<p>A real robot can injure people and destroy itself. Every system needs a hardware emergency stop that cuts motor power independently of software, a <b>watchdog</b> that stops motors if commands stop arriving, current limits, and a test procedure that starts with wheels off the ground. Competition rules require these too. No hardware yet? The Wokwi online simulator runs Arduino and ESP32 code with virtual parts.</p>`}
],
primer:R`<ul><li>Motor speed tracks voltage; gears trade speed for torque.</li><li>Sample fast, filter carefully, mind quantisation at low speed.</li><li>Microcontroller for real-time control, Linux computer for ROS 2.</li><li>E-stop, watchdog, current limits before anything moves.</li></ul>`,
drill:'Write a microcontroller loop that reads an encoder through an interrupt, computes speed and runs PID on a PWM output, from blank, in under <b>20 minutes</b>.',
ex:[
{t:'Blink, then PWM',d:1,q:R`<p>In Wokwi or on a real board: blink an LED without <code>delay()</code> (use <code>millis()</code>), then fade it with PWM, then read a potentiometer and map it to PWM duty.</p>`},
{t:'Encoder by interrupt',d:2,q:R`<p>Count quadrature encoder edges in an interrupt handler and compute speed every 10 ms in the main loop. Print speed over serial and plot it in Python. Show the quantisation problem at low speed and fix it by measuring time between edges instead.</p>`,
cpp:R`
// Arduino-style sketch
volatile long counts = 0;
const int PIN_A = 2, PIN_B = 3;

void onEdgeA() {
    // TODO: read PIN_B to decide direction; ++counts or --counts
}

void setup() {
    Serial.begin(115200);
    pinMode(PIN_A, INPUT_PULLUP);
    pinMode(PIN_B, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(PIN_A), onEdgeA, CHANGE);
}

void loop() {
    static unsigned long last = 0;
    static long last_counts = 0;
    unsigned long now = millis();
    if (now - last >= 10) {
        noInterrupts(); long c = counts; interrupts();   // read safely
        // TODO: speed = (c - last_counts) / counts_per_rev / dt
        last_counts = c;
        last = now;
    }
}
`},
{t:'Motor speed PID',d:2,q:R`<p>Simulate the DC motor model in Python at 1 kHz, then add your PID speed controller with PWM saturation and anti-windup. Step the target speed and tune. If you have a motor and driver, run the same controller on hardware and compare.</p>`},
{t:'A serial protocol with a checksum',d:2,q:R`<p>Design a binary packet: start byte, message id, payload length, payload, CRC-8. Write the encoder/decoder in C++ on the microcontroller and in Python with <code>pyserial</code> on the PC. Inject random byte errors and show corrupted packets are rejected and the stream resynchronises.</p>`},
{t:'IMU tilt with a complementary filter',d:2,q:R`<p>Read an MPU-6050 (or simulated data) over I²C. Estimate tilt from the accelerometer alone, the gyro alone, and the complementary filter. Plot all three while shaking and tilting.</p>`},
{t:'The watchdog',d:1,q:R`<p>Make the motor controller stop if no command arrives for 200 ms, and require an explicit “arm” command before moving again. Test by unplugging the serial cable (or stopping the sender) mid-motion.</p>`},
{t:'Rover power budget',d:1,q:R`<p>Build a spreadsheet for a six-wheel rover: every component’s voltage, current and duty cycle; total average and peak power; battery choice; expected runtime with 20% margin; wire gauge for peak current. Present it as you would at a design review.</p>`}
]}
);
})();
