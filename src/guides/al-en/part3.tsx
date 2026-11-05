"use client";
import { M, MD } from "../ui/Tex";
import { Section, Def, Thm, Note, Pitfall, Tip, Example, Exercise, Checklist } from "../ui/blocks";
import { GaussLab } from "../widgets/GaussLab";
import { EigenLab } from "../widgets/TransformLab";
import { DynamicsLab, MarkovLab, PageRankLab, JordanPowersLab } from "../widgets/AppLabs";
import type { M2 } from "../math/linalg2";

const t = String.raw;

/* ───────────────────────── 11. Eigenvalues and eigenvectors ───────────────────────── */
export function ValoresProprios() {
  return (
    <>
      <Section title="In a nutshell">
        <Def>
          <p><M>{t`\lambda`}</M> is an <b>eigenvalue</b> of A (n×n) if there is <M>{t`v \neq \vec 0`}</M> with <M>{t`Av = \lambda v`}</M>; <M>v</M> is an associated <b>eigenvector</b>. Geometrically: the directions A does <b>not rotate</b>, only stretches (or flips, or kills).</p>
        </Def>
        <Thm title="How to compute them">
          <ol className="list-decimal pl-6">
            <li><b>Characteristic polynomial</b>: <M>{t`p(\lambda) = \det(A - \lambda I)`}</M>. The eigenvalues are its roots.</li>
            <li>For each <M>{t`\lambda`}</M>, the <b>eigenspace</b> is <M>{t`E(\lambda) = N(A - \lambda I)`}</M>; the eigenvectors are its non-zero elements.</li>
          </ol>
          <p>Handy checks: <M>{t`\lambda_1 + \cdots + \lambda_n = \operatorname{tr} A`}</M> and <M>{t`\lambda_1\cdots\lambda_n = \det A`}</M>. For a triangular matrix, the eigenvalues are the diagonal entries.</p>
        </Thm>
      </Section>
      <Section title="Find eigenvectors by hand (literally)">
        <EigenLab initial={[[4, 1], [2, 3]] as M2} />
      </Section>
      <Section title="Worked example">
        <Example>
          <MD>{t`A = \begin{bmatrix}4&1\\2&3\end{bmatrix}:\quad p(\lambda) = (4-\lambda)(3-\lambda) - 2 = \lambda^2 - 7\lambda + 10 = (\lambda - 5)(\lambda - 2)`}</MD>
          <ul className="list-disc pl-6">
            <li><M>{t`\lambda = 5`}</M>: <M>{t`A - 5I = \begin{bmatrix}-1&1\\2&-2\end{bmatrix}`}</M> ⇒ <M>{t`E(5) = \operatorname{span}\{(1,1)\}`}</M>.</li>
            <li><M>{t`\lambda = 2`}</M>: <M>{t`A - 2I = \begin{bmatrix}2&1\\2&1\end{bmatrix}`}</M> ⇒ <M>{t`E(2) = \operatorname{span}\{(1,-2)\}`}</M>.</li>
          </ul>
          <p>Check: <M>{t`A(1,-2) = (2,-4) = 2\,(1,-2)`}</M> ✔; <M>{t`5 + 2 = 7 = \operatorname{tr}A`}</M>, <M>{t`5\cdot 2 = 10 = \det A`}</M> ✔</p>
        </Example>
      </Section>
      <Section title="Diagonalization">
        <Thm>
          <p>If A has <M>n</M> linearly independent eigenvectors <M>{t`v_1,\dots,v_n`}</M>, then</p>
          <MD>{t`A = SDS^{-1},\quad S = [v_1\ \cdots\ v_n],\quad D = \operatorname{diag}(\lambda_1,\dots,\lambda_n)`}</MD>
          <p>and powers become easy: <M>{t`A^k = SD^kS^{-1}`}</M>. <b>Distinct</b> eigenvalues give independent eigenvectors, so n distinct eigenvalues ⇒ diagonalizable.</p>
        </Thm>
        <p>In the example: <M>{t`S = \begin{bmatrix}1&1\\1&-2\end{bmatrix}`}</M>, <M>{t`D = \begin{bmatrix}5&0\\0&2\end{bmatrix}`}</M>.</p>
        <GaussLab title="Eigenspace = null space of A − λI" mode="kernel" initial={[[-1, 1], [2, -2]]} presets={[{ label: "A − 5I", value: [[-1, 1], [2, -2]] }, { label: "A − 2I", value: [[2, 1], [2, 1]] }]} />
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>It is triangular: <M>{t`\lambda = 1, 4, 6`}</M>.</p>}><p>Eigenvalues of <M>{t`\begin{bmatrix}1&2&3\\0&4&5\\0&0&6\end{bmatrix}`}</M>?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`A^2v = A(\lambda v) = \lambda Av = \lambda^2 v`}</M>, with <M>{t`v\neq 0`}</M>.</p>}><p>Show that if <M>{t`\lambda`}</M> is an eigenvalue of A, then <M>{t`\lambda^2`}</M> is an eigenvalue of <M>{t`A^2`}</M>.</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`p(\lambda) = \lambda^2 + 1`}</M>: no real roots (<M>{t`\lambda = \pm i`}</M>). It is the 90° rotation: no real direction stays fixed.</p>}><p>Eigenvalues of <M>{t`\begin{bmatrix}0&-1\\1&0\end{bmatrix}`}</M>? Interpret.</p></Exercise>
        <Exercise n={4} solution={<p>A is not invertible ⇔ <M>{t`\det A = 0`}</M> ⇔ <M>{t`\det(A - 0I) = 0`}</M> ⇔ 0 is an eigenvalue.</p>}><p>Show that A is invertible if and only if 0 is not an eigenvalue.</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Accepting <M>{t`v = \vec 0`}</M> as an eigenvector. By definition, eigenvectors are non-zero (but <M>{t`\lambda = 0`}</M> can be an eigenvalue).</p></Pitfall>
        <Pitfall><p>Computing <M>{t`\det A - \lambda`}</M> instead of <M>{t`\det(A - \lambda I)`}</M>: subtract <M>{t`\lambda`}</M> along the <b>whole</b> diagonal before taking the determinant.</p></Pitfall>
        <Tip><p>If <M>{t`A - \lambda I`}</M> does not end up with a zero row after row reduction, you got the eigenvalue wrong (the null space must be non-trivial).</p></Tip>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I compute p(λ) and its roots", "I find bases of the eigenspaces", "I check with the trace and determinant", "I diagonalize and compute Aᵏ = SDᵏS⁻¹"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 12. Algebraic and geometric multiplicity ───────────────────────── */
export function Multiplicidades() {
  return (
    <>
      <Section title="In a nutshell">
        <Def>
          <ul className="list-disc pl-6">
            <li><b>Algebraic multiplicity</b> <M>{t`\operatorname{a.m.}(\lambda)`}</M>: how many times <M>{t`\lambda`}</M> is a root of <M>{t`p`}</M>.</li>
            <li><b>Geometric multiplicity</b> <M>{t`\operatorname{g.m.}(\lambda) = \dim E(\lambda) = n - \operatorname{rank}(A - \lambda I)`}</M>.</li>
          </ul>
        </Def>
        <Thm>
          <p>Always <M>{t`1 \leq \operatorname{g.m.}(\lambda) \leq \operatorname{a.m.}(\lambda)`}</M>. The matrix is <b>diagonalizable</b> if and only if <M>{t`p`}</M> splits into linear factors and <M>{t`\operatorname{g.m.}(\lambda) = \operatorname{a.m.}(\lambda)`}</M> for every eigenvalue.</p>
        </Thm>
        <p>Intuition: <M>{t`\operatorname{a.m.}`}</M> says how many eigenvectors there "should" be; <M>{t`\operatorname{g.m.}`}</M> says how many (independent) ones there really are. When some are missing, the matrix cannot be diagonalized.</p>
      </Section>
      <Section title="Compare the cases">
        <EigenLab
          initial={[[2, 1], [0, 2]] as M2}
          presets={[
            { label: "a.m. 2, g.m. 1", value: [[2, 1], [0, 2]] as M2 },
            { label: "a.m. 2, g.m. 2", value: [[2, 0], [0, 2]] as M2 },
            { label: "Distinct", value: [[3, 1], [0, 2]] as M2 },
            { label: "Nearly double", value: [[2, 1], [0.5, 2]] as M2 },
          ]}
        />
      </Section>
      <Section title="Worked examples">
        <Example title="Not diagonalizable">
          <MD>{t`A = \begin{bmatrix}2&1&0\\0&2&0\\0&0&3\end{bmatrix},\quad p(\lambda) = (2 - \lambda)^2(3 - \lambda)`}</MD>
          <p><M>{t`\operatorname{a.m.}(2) = 2`}</M>. But <M>{t`A - 2I = \begin{bmatrix}0&1&0\\0&0&0\\0&0&1\end{bmatrix}`}</M> has rank 2, so <M>{t`\operatorname{g.m.}(2) = 3 - 2 = 1 < 2`}</M>: <b>not diagonalizable</b>.</p>
        </Example>
        <Example title="Diagonalizable despite a repeated eigenvalue">
          <MD>{t`B = \begin{bmatrix}3&1&1\\1&3&1\\1&1&3\end{bmatrix}:\quad \lambda = 5\ (\text{a.m. }1),\ \lambda = 2\ (\text{a.m. }2)`}</MD>
          <p>All three rows of <M>{t`B - 2I`}</M> equal <M>{t`(1,1,1)`}</M> ⇒ rank 1 ⇒ <M>{t`\operatorname{g.m.}(2) = 2 = \operatorname{a.m.}(2)`}</M>. <b>It is diagonalizable</b>, with <M>{t`E(2) = \{x + y + z = 0\}`}</M> and <M>{t`E(5) = \operatorname{span}\{(1,1,1)\}`}</M>.</p>
          <p>Check: <M>{t`5 + 2 + 2 = 9 = \operatorname{tr}B`}</M> and <M>{t`5\cdot2\cdot2 = 20 = \det B`}</M> ✔</p>
        </Example>
        <GaussLab title="g.m. = number of columns without a pivot in A − λI" mode="kernel" initial={[[0, 1, 0], [0, 0, 0], [0, 0, 1]]} presets={[{ label: "A − 2I (1st example)", value: [[0, 1, 0], [0, 0, 0], [0, 0, 1]] }, { label: "B − 2I (2nd example)", value: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] }]} />
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p><M>{t`\lambda = 1`}</M> with a.m. 2. <M>{t`A - I = \begin{bmatrix}0&a\\0&0\end{bmatrix}`}</M>: if <M>{t`a\neq0`}</M>, rank 1 and g.m. 1 (not diagonalizable); if <M>{t`a = 0`}</M>, A = I is already diagonal. Answer: only <M>{t`a = 0`}</M>.</p>}><p>For which values of <M>a</M> is <M>{t`\begin{bmatrix}1&a\\0&1\end{bmatrix}`}</M> diagonalizable?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`\operatorname{g.m.}(1) = 3 - 1 = 2 < 3 = \operatorname{a.m.}(1)`}</M> ⇒ not diagonalizable.</p>}><p>A is 3×3, <M>{t`p(\lambda) = (1 - \lambda)^3`}</M> and <M>{t`\operatorname{rank}(A - I) = 1`}</M>. Is A diagonalizable?</p></Exercise>
        <Exercise n={3} solution={<p>Yes: 4 distinct eigenvalues give 4 independent eigenvectors.</p>}><p>Is a 4×4 matrix with eigenvalues 1, 2, 3, 4 diagonalizable?</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Concluding "repeated eigenvalue ⇒ not diagonalizable". The second example shows otherwise: you have to compute the g.m.</p></Pitfall>
        <Pitfall><p>Computing the g.m. from A instead of <M>{t`A - \lambda I`}</M>.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I compute the a.m. from p(λ)", "I compute g.m. = n − rank(A − λI)", "I decide whether A is diagonalizable", "I know n distinct eigenvalues ⇒ diagonalizable"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 13. Jordan canonical form ───────────────────────── */
export function Jordan() {
  return (
    <>
      <Section title="In a nutshell">
        <p>When A is not diagonalizable, the best you can get is an "almost diagonal" matrix: the <b>Jordan canonical form</b>.</p>
        <Thm title="Jordan's theorem">
          <p>If <M>{t`p`}</M> splits into linear factors (always true over <M>{t`\mathbb{C}`}</M>), there is an invertible P with <M>{t`A = PJP^{-1}`}</M>, where J is block-diagonal with Jordan blocks:</p>
          <MD>{t`J_k(\lambda) = \begin{bmatrix}\lambda&1&&\\&\lambda&\ddots&\\&&\ddots&1\\&&&\lambda\end{bmatrix}\ (k\times k)`}</MD>
          <ul className="list-disc pl-6">
            <li>number of blocks for <M>{t`\lambda`}</M> = <M>{t`\operatorname{g.m.}(\lambda)`}</M>;</li>
            <li>total size of those blocks = <M>{t`\operatorname{a.m.}(\lambda)`}</M>.</li>
          </ul>
        </Thm>
        <p>The columns of P form <b>Jordan chains</b>: <M>{t`(A - \lambda I)v_1 = 0`}</M>, <M>{t`(A - \lambda I)v_2 = v_1`}</M>, … (<M>{t`v_2, v_3,\dots`}</M> are <b>generalized</b> eigenvectors).</p>
      </Section>
      <Section title="Why the 1 matters">
        <JordanPowersLab />
        <Note><p>Useful formulas (2×2): <M>{t`J^k = \begin{bmatrix}\lambda^k & k\lambda^{k-1}\\0&\lambda^k\end{bmatrix}`}</M> and <M>{t`e^{tJ} = e^{\lambda t}\begin{bmatrix}1&t\\0&1\end{bmatrix}`}</M> — this is where the <M>{t`te^{\lambda t}`}</M> terms in differential equations come from.</p></Note>
      </Section>
      <Section title="Worked example">
        <Example>
          <p><M>{t`A = \begin{bmatrix}3&1\\-1&1\end{bmatrix}`}</M>: <M>{t`p(\lambda) = (3-\lambda)(1-\lambda) + 1 = (\lambda - 2)^2`}</M>, a.m.(2) = 2.</p>
          <p><M>{t`A - 2I = \begin{bmatrix}1&1\\-1&-1\end{bmatrix}`}</M> has rank 1 ⇒ g.m.(2) = 1 ⇒ one block: <M>{t`J = \begin{bmatrix}2&1\\0&2\end{bmatrix}`}</M>.</p>
          <ul className="list-disc pl-6">
            <li><M>{t`v_1\in N(A - 2I)`}</M>: <M>{t`v_1 = (1,-1)`}</M>.</li>
            <li><M>{t`(A - 2I)v_2 = v_1`}</M>: <M>{t`a + b = 1`}</M>, e.g. <M>{t`v_2 = (1,0)`}</M>.</li>
          </ul>
          <MD>{t`P = [v_1\ v_2] = \begin{bmatrix}1&1\\-1&0\end{bmatrix},\qquad AP = \begin{bmatrix}2&3\\-2&-1\end{bmatrix} = PJ\ ✔`}</MD>
        </Example>
        <Example title="Possible forms for a 3×3 with p(λ) = (2 − λ)³">
          <ul className="list-disc pl-6">
            <li>g.m. = 3: <M>{t`\operatorname{diag}(2,2,2)`}</M> (three 1×1 blocks);</li>
            <li>g.m. = 2: <M>{t`J_2(2)\oplus J_1(2)`}</M>;</li>
            <li>g.m. = 1: <M>{t`J_3(2)`}</M>.</li>
          </ul>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>The partitions of 4: 4, 3+1, 2+2, 2+1+1, 1+1+1+1 → 5 forms. With g.m. = 2 there are two options (3+1 or 2+2), so for 4×4 the g.m. alone is not enough: you need to look at <M>{t`\operatorname{rank}(A - \lambda I)^2`}</M>.</p>}><p>How many Jordan forms (up to block order) does a 4×4 matrix with a single eigenvalue have? Is the g.m. enough to decide?</p></Exercise>
        <Exercise n={2} solution={<MD>{t`J^{10} = \begin{bmatrix}3^{10} & 10\cdot 3^{9}\\0&3^{10}\end{bmatrix}`}</MD>}><p>Compute <M>{t`J^{10}`}</M> for <M>{t`J = \begin{bmatrix}3&1\\0&3\end{bmatrix}`}</M>.</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Putting the chain in P in the wrong order: the eigenvector <M>{t`v_1`}</M> comes <b>before</b> the generalized one <M>{t`v_2`}</M>; in the other order the 1 ends up below the diagonal.</p></Pitfall>
        <Tip><p>Always check with <M>{t`AP = PJ`}</M> (no need to invert P).</p></Tip>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I find the number and size of the blocks", "I build chains (A − λI)v₂ = v₁", "I check AP = PJ", "I compute Jᵏ and e^{tJ} for 2×2 blocks"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 14. Applications ───────────────────────── */
export function Aplicacoes() {
  return (
    <>
      <Section title="In a nutshell">
        <p>Eigenvalues and eigenvectors explain how a system evolves over time. The idea is always the same: write the initial state in the eigenvector basis, because in that basis each component evolves on its own.</p>
        <ul className="list-disc pl-6">
          <li><b>Discrete</b> <M>{t`x_{k+1} = Ax_k`}</M>: <M>{t`x_k = c_1\lambda_1^kv_1 + \cdots + c_n\lambda_n^kv_n`}</M>. Stable (<M>{t`x_k\to0`}</M> for every <M>{t`x_0`}</M>) ⇔ <M>{t`|\lambda_i| < 1`}</M> for all i.</li>
          <li><b>Continuous</b> <M>{t`x'(t) = Ax(t)`}</M>: <M>{t`x(t) = c_1e^{\lambda_1t}v_1 + \cdots + c_ne^{\lambda_nt}v_n`}</M>. Stable ⇔ <M>{t`\operatorname{Re}\lambda_i < 0`}</M> for all i.</li>
          <li><b>Markov chains</b>: P with entries ≥ 0 and columns summing to 1 always has <M>{t`\lambda = 1`}</M>; the steady state is the associated eigenvector (normalized to sum to 1).</li>
          <li><b>PageRank</b>: the importance of pages is the steady state of a Markov chain on the web.</li>
        </ul>
      </Section>
      <Section title="Discrete dynamical systems">
        <DynamicsLab />
      </Section>
      <Section title="Linear differential equations">
        <Example title="x' = Ax">
          <p>With <M>{t`A = \begin{bmatrix}4&1\\2&3\end{bmatrix}`}</M> (eigenvalues 5 and 2, eigenvectors <M>{t`(1,1)`}</M> and <M>{t`(1,-2)`}</M>) and <M>{t`x(0) = (3,0)`}</M>:</p>
          <MD>{t`x(t) = c_1e^{5t}\begin{bmatrix}1\\1\end{bmatrix} + c_2e^{2t}\begin{bmatrix}1\\-2\end{bmatrix},\quad \begin{cases}c_1 + c_2 = 3\\ c_1 - 2c_2 = 0\end{cases}\Rightarrow c_1 = 2,\ c_2 = 1`}</MD>
          <p>Both eigenvalues are positive: the origin is <b>unstable</b>. By contrast, <M>{t`\begin{bmatrix}-2&1\\1&-2\end{bmatrix}`}</M> (eigenvalues −1 and −3) is stable: every solution tends to 0.</p>
        </Example>
      </Section>
      <Section title="Markov chains">
        <MarkovLab />
      </Section>
      <Section title="PageRank">
        <PageRankLab />
        <Note><p>With <M>{t`0 < d < 1`}</M>, the Google matrix has all entries positive. By the Perron-Frobenius theorem, <M>{t`\lambda = 1`}</M> is a simple, dominant eigenvalue, and power iteration always converges.</p></Note>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>Triangular: eigenvalues 0.5 and 0.9, both with modulus &lt; 1 ⇒ stable.</p>}><p>Is <M>{t`x_{k+1} = \begin{bmatrix}0.5&0.2\\0&0.9\end{bmatrix}x_k`}</M> stable?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`p = 0.2,\ q = 0.5`}</M> ⇒ <M>{t`v = (\tfrac{q}{p+q}, \tfrac{p}{p+q}) = (\tfrac57, \tfrac27)`}</M>. Check: <M>{t`0.8\cdot\tfrac57 + 0.5\cdot\tfrac27 = \tfrac{4+1}{7} = \tfrac57`}</M> ✔</p>}><p>Steady state of <M>{t`P = \begin{bmatrix}0.8&0.5\\0.2&0.5\end{bmatrix}`}</M>?</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`x(t) = c_1e^{-t}(1,1) + c_2e^{-3t}(1,-1)`}</M>; <M>{t`c_1 + c_2 = 2,\ c_1 - c_2 = 0`}</M> ⇒ <M>{t`c_1 = c_2 = 1`}</M>.</p>}><p>Solve <M>{t`x' = \begin{bmatrix}-2&1\\1&-2\end{bmatrix}x`}</M> with <M>{t`x(0) = (2,0)`}</M>.</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Mixing up the criteria: in the <b>discrete</b> case compare <M>{t`|\lambda|`}</M> with 1; in the <b>continuous</b> case look at the sign of <M>{t`\operatorname{Re}\lambda`}</M>.</p></Pitfall>
        <Tip><p>For a Markov matrix, check that each column sums to 1: if it doesn't, the convention may be by rows (<M>{t`x_{k+1}^T = x_k^TP`}</M>).</p></Tip>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I solve x' = Ax and xₖ₊₁ = Axₖ with eigenvectors", "I decide stability in both cases", "I compute the steady state of a Markov chain", "I can explain PageRank as an eigenvector problem"]} />
      </Section>
    </>
  );
}
