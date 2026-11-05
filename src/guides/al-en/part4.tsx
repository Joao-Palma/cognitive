"use client";
import { M, MD } from "../ui/Tex";
import { Section, Def, Thm, Pitfall, Tip, Note, Example, Exercise, Checklist } from "../ui/blocks";
import { InnerProductLab, GramSchmidtLab, LeastSquaresLab, SpectralLab, OrthogonalLab, SVDLab, QuadraticFormLab } from "../widgets/GeometryLabs";

const t = String.raw;

/* ───────────────────────── 15. Inner product ───────────────────────── */
export function ProdutoInterno() {
  return (
    <>
      <Section title="In a nutshell">
        <Def>
          <p>An <b>inner product</b> on a real space V is a function <M>{t`\langle\cdot,\cdot\rangle: V\times V\to\mathbb{R}`}</M> that is:</p>
          <ol className="list-decimal pl-6">
            <li>symmetric: <M>{t`\langle u,v\rangle = \langle v,u\rangle`}</M>;</li>
            <li>linear in the 1st argument: <M>{t`\langle \alpha u + w, v\rangle = \alpha\langle u,v\rangle + \langle w,v\rangle`}</M>;</li>
            <li>positive definite: <M>{t`\langle u,u\rangle > 0`}</M> if <M>{t`u\neq\vec0`}</M>.</li>
          </ol>
          <p>On <M>{t`\mathbb{C}^n`}</M> symmetry becomes <M>{t`\langle u,v\rangle = \overline{\langle v,u\rangle}`}</M>, and the standard product is <M>{t`\langle u,v\rangle = \sum u_i\overline{v_i}`}</M>.</p>
        </Def>
        <p>It defines the <b>norm</b> <M>{t`\|u\| = \sqrt{\langle u,u\rangle}`}</M>, <b>distance</b> <M>{t`d(u,v) = \|u - v\|`}</M>, <b>angle</b> <M>{t`\cos\theta = \frac{\langle u,v\rangle}{\|u\|\|v\|}`}</M> and <b>orthogonality</b> <M>{t`u\perp v \Leftrightarrow \langle u,v\rangle = 0`}</M>.</p>
        <Thm title="Inequalities">
          <p>Cauchy-Schwarz: <M>{t`|\langle u,v\rangle| \leq \|u\|\|v\|`}</M>. Triangle: <M>{t`\|u + v\| \leq \|u\| + \|v\|`}</M>. Pythagoras: <M>{t`u\perp v\Rightarrow \|u+v\|^2 = \|u\|^2 + \|v\|^2`}</M>.</p>
        </Thm>
      </Section>
      <Section title="See it in the plane">
        <InnerProductLab />
      </Section>
      <Section title="Inner products on ℝⁿ and orthogonal complements">
        <p>Every inner product on <M>{t`\mathbb{R}^n`}</M> has the form <M>{t`\langle u,v\rangle = u^TGv`}</M>, with <M>G</M> symmetric and positive definite (the <b>Gram matrix</b>, <M>{t`G_{ij} = \langle e_i, e_j\rangle`}</M>).</p>
        <Example title="A non-standard inner product">
          <p><M>{t`\langle x, y\rangle = 2x_1y_1 + x_1y_2 + x_2y_1 + x_2y_2`}</M>, i.e. <M>{t`G = \begin{bmatrix}2&1\\1&1\end{bmatrix}`}</M> (symmetric, <M>{t`2 > 0`}</M>, <M>{t`\det G = 1 > 0`}</M>). Here <M>{t`\|e_1\| = \sqrt2`}</M> and <M>{t`\langle e_1, e_2\rangle = 1`}</M>: <b>the standard basis is no longer orthogonal</b>.</p>
        </Example>
        <Def title="Orthogonal complement">
          <p><M>{t`W^\perp = \{v : \langle v, w\rangle = 0,\ \forall w\in W\}`}</M>. For the standard product, <M>{t`N(A) = L(A)^\perp`}</M>: the solutions of <M>{t`Ax = 0`}</M> are orthogonal to every row of A.</p>
        </Def>
        <Example title="Complement of a line in ℝ³">
          <p><M>{t`W = \operatorname{span}\{(1,1,1)\}`}</M> ⇒ <M>{t`W^\perp = \{x + y + z = 0\} = \operatorname{span}\{(1,-1,0),(1,0,-1)\}`}</M>.</p>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>No: <M>{t`\langle (0,1),(0,1)\rangle = -1 < 0`}</M>, positivity fails.</p>}><p>Is <M>{t`\langle u,v\rangle = u_1v_1 - u_2v_2`}</M> an inner product on <M>{t`\mathbb{R}^2`}</M>?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`\cos\theta = \frac{1}{\sqrt2\sqrt2} = \frac12`}</M> ⇒ <M>{t`\theta = 60^\circ`}</M>.</p>}><p>Angle between <M>{t`(1,0,1)`}</M> and <M>{t`(0,1,1)`}</M> (standard product)?</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`\|x\|^2 = \int_0^1 x^2\,dx = \tfrac13`}</M> ⇒ <M>{t`\|x\| = \tfrac{1}{\sqrt3}`}</M>.</p>}><p>With <M>{t`\langle p,q\rangle = \int_0^1 p(x)q(x)\,dx`}</M> on <M>{t`\mathcal{P}_2`}</M>, compute <M>{t`\|x\|`}</M>.</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Forgetting the <b>conjugate</b> on <M>{t`\mathbb{C}^n`}</M>: with <M>{t`\sum u_iv_i`}</M>, the vector <M>{t`(1, i)`}</M> would have "norm" <M>{t`1 + i^2 = 0`}</M>.</p></Pitfall>
        <Pitfall><p>Assuming that orthogonal for the standard product means orthogonal for another inner product.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I check the 3 inner product axioms", "I compute norms, angles and projections", "I write the Gram matrix G", "I compute orthogonal complements"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 16. Gram-Schmidt ───────────────────────── */
export function GramSchmidt() {
  return (
    <>
      <Section title="In a nutshell">
        <p>Orthogonal bases make everything easy (coordinates and projections are just inner products). The <b>Gram-Schmidt</b> process turns any basis <M>{t`(v_1,\dots,v_k)`}</M> into an orthogonal basis <M>{t`(w_1,\dots,w_k)`}</M> of the <b>same</b> subspace:</p>
        <MD>{t`w_1 = v_1,\qquad w_k = v_k - \sum_{j<k}\frac{\langle v_k, w_j\rangle}{\langle w_j,w_j\rangle}\,w_j`}</MD>
        <p>In words: at each step, subtract from the new vector its projection onto the previous ones. At the end you can normalize, <M>{t`q_i = w_i/\|w_i\|`}</M>, to get an <b>orthonormal</b> basis.</p>
        <Thm title="What an orthonormal basis is good for">
          <p>If <M>{t`(q_1,\dots,q_k)`}</M> is an orthonormal basis of W:</p>
          <ul className="list-disc pl-6">
            <li>coordinates: <M>{t`u = \sum\langle u,q_i\rangle q_i`}</M> for <M>{t`u\in W`}</M>;</li>
            <li>orthogonal projection: <M>{t`P_W(u) = \sum\langle u, q_i\rangle q_i`}</M>, and <M>{t`u - P_W(u)\in W^\perp`}</M>.</li>
          </ul>
        </Thm>
      </Section>
      <Section title="Step by step in the plane">
        <GramSchmidtLab />
      </Section>
      <Section title="Worked example in ℝ³">
        <Example>
          <p><M>{t`v_1 = (1,1,0),\ v_2 = (1,0,1),\ v_3 = (0,1,1)`}</M>.</p>
          <MD>{t`w_1 = (1,1,0)`}</MD>
          <MD>{t`w_2 = (1,0,1) - \tfrac{1}{2}(1,1,0) = \left(\tfrac12, -\tfrac12, 1\right)`}</MD>
          <MD>{t`w_3 = (0,1,1) - \tfrac{1}{2}(1,1,0) - \tfrac{1/2}{3/2}\left(\tfrac12,-\tfrac12,1\right) = \left(-\tfrac23, \tfrac23, \tfrac23\right)`}</MD>
          <p>Check: <M>{t`\langle w_1,w_3\rangle = -\tfrac23+\tfrac23 = 0`}</M>, <M>{t`\langle w_2,w_3\rangle = -\tfrac13 - \tfrac13 + \tfrac23 = 0`}</M> ✔. Normalizing:</p>
          <MD>{t`q_1 = \tfrac{1}{\sqrt2}(1,1,0),\quad q_2 = \tfrac{1}{\sqrt6}(1,-1,2),\quad q_3 = \tfrac{1}{\sqrt3}(-1,1,1)`}</MD>
        </Example>
        <Tip><p>You may rescale each <M>{t`w_i`}</M> (e.g. <M>{t`w_2 \to 2w_2 = (1,-1,2)`}</M>) before continuing: orthogonality is unchanged and you avoid fractions.</p></Tip>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p><M>{t`w_1 = (3,4)`}</M>, <M>{t`w_2 = (1,0) - \tfrac{3}{25}(3,4) = (\tfrac{16}{25}, -\tfrac{12}{25})`}</M>, proportional to <M>{t`(4,-3)`}</M>. Orthonormal basis: <M>{t`\tfrac15(3,4),\ \tfrac15(4,-3)`}</M>.</p>}><p>Apply Gram-Schmidt to <M>{t`(3,4), (1,0)`}</M>.</p></Exercise>
        <Exercise n={2} solution={<p>Orthogonal basis of W: <M>{t`w_1 = (1,1,0)`}</M>, <M>{t`w_2 = (\tfrac12,-\tfrac12,1)`}</M>. <M>{t`\langle u,w_1\rangle = 0`}</M>, <M>{t`\langle u,w_2\rangle = 1`}</M>, <M>{t`\langle w_2,w_2\rangle = \tfrac32`}</M>, so <M>{t`P_W(u) = \tfrac23 w_2 = (\tfrac13,-\tfrac13,\tfrac23)`}</M>. The remainder <M>{t`(-\tfrac13,\tfrac13,\tfrac13)`}</M> is orthogonal to W ✔</p>}><p>Project <M>{t`u = (0,0,1)`}</M> onto the plane <M>{t`W = \operatorname{span}\{(1,1,0),(1,0,1)\}`}</M>.</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Projecting onto the <b>original</b> vectors <M>{t`v_j`}</M> instead of the already orthogonalized <M>{t`w_j`}</M>. The formula uses <M>{t`w_j`}</M>!</p></Pitfall>
        <Pitfall><p>Using the projection formula <M>{t`\sum\langle u,w_i\rangle w_i`}</M> without dividing by <M>{t`\langle w_i,w_i\rangle`}</M> when the basis is not normalized.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I apply Gram-Schmidt to 3 vectors in ℝ³", "I normalize to get an orthonormal basis", "I compute orthogonal projections onto subspaces", "I know the span never changes during the process"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 17. Least squares ───────────────────────── */
export function MinimosQuadrados() {
  return (
    <>
      <Section title="In a nutshell">
        <p>Often <M>{t`Ax = b`}</M> is <b>inconsistent</b> (more equations than unknowns, noisy data). We then look for the <M>{t`\hat x`}</M> that makes <M>{t`A\hat x`}</M> as close as possible to <M>b</M>:</p>
        <MD>{t`\hat x\ \text{minimizes}\ \|b - Ax\|^2 \iff A\hat x = P_{C(A)}(b) \iff A^TA\,\hat x = A^Tb\quad\text{(normal equations)}`}</MD>
        <Thm>
          <p>The normal equations are always consistent. The solution <M>{t`\hat x`}</M> is unique if and only if the columns of A are linearly independent (and then <M>{t`\hat x = (A^TA)^{-1}A^Tb`}</M>). The error <M>{t`b - A\hat x`}</M> is orthogonal to <M>{t`C(A)`}</M>.</p>
        </Thm>
      </Section>
      <Section title="Fitting a line">
        <LeastSquaresLab />
      </Section>
      <Section title="Worked example">
        <Example title="Line y = α + βx through (0,1), (1,1), (2,3)">
          <MD>{t`A = \begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix},\ b = \begin{bmatrix}1\\1\\3\end{bmatrix}:\quad A^TA = \begin{bmatrix}3&3\\3&5\end{bmatrix},\ A^Tb = \begin{bmatrix}5\\7\end{bmatrix}`}</MD>
          <p><M>{t`3\alpha + 3\beta = 5,\ 3\alpha + 5\beta = 7`}</M> ⇒ <M>{t`\beta = 1,\ \alpha = \tfrac23`}</M>. Line: <M>{t`y = \tfrac23 + x`}</M>.</p>
          <p>Residuals <M>{t`b - A\hat x = (\tfrac13, -\tfrac23, \tfrac13)`}</M>: check that <M>{t`A^T(b - A\hat x) = 0`}</M> ✔. Minimum error: <M>{t`\tfrac19 + \tfrac49 + \tfrac19 = \tfrac23`}</M>.</p>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p><M>{t`A = (1,1)^T`}</M>, <M>{t`A^TA = 2`}</M>, <M>{t`A^Tb = 4`}</M> ⇒ <M>{t`\hat x = 2`}</M>, the mean.</p>}><p>Least squares solution of the "system" <M>{t`x = 1,\ x = 3`}</M>?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`A = (1,2)^T`}</M>, <M>{t`b = (2,3)`}</M>: <M>{t`A^TA = 5`}</M>, <M>{t`A^Tb = 8`}</M> ⇒ <M>{t`\beta = \tfrac85`}</M>.</p>}><p>Fit <M>{t`y = \beta x`}</M> (a line through the origin) to the points <M>{t`(1,2), (2,3)`}</M>.</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`A\hat x = (\tfrac23, \tfrac53, \tfrac83)`}</M>: the values of the line at <M>{t`x = 0, 1, 2`}</M>.</p>}><p>In the worked example, what is the projection of b onto C(A)?</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>"Solving" an inconsistent system by dropping one of the equations. That gives the exact solution of a different problem, not the best approximation.</p></Pitfall>
        <Pitfall><p>Forgetting the column of 1s when the model has an intercept (α).</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I set up A and b from a model and data points", "I solve the normal equations", "I compute the error and check Aᵀ(b − Ax̂) = 0", "I know when the solution is unique"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 18. Spectral theorem ───────────────────────── */
export function TeoremaEspetral() {
  return (
    <>
      <Section title="In a nutshell">
        <Thm title="Spectral theorem (real case)">
          <p>If A is real and <b>symmetric</b> (<M>{t`A^T = A`}</M>), then:</p>
          <ul className="list-disc pl-6">
            <li>all its eigenvalues are real;</li>
            <li>eigenvectors for distinct eigenvalues are orthogonal;</li>
            <li>A is <b>orthogonally diagonalizable</b>: <M>{t`A = QDQ^T`}</M> with Q orthogonal (<M>{t`Q^{-1} = Q^T`}</M>).</li>
          </ul>
          <p>Conversely, if <M>{t`A = QDQ^T`}</M> with Q orthogonal, A is symmetric. Complex case: A Hermitian (<M>{t`A^* = A`}</M>) ⇒ <M>{t`A = UDU^*`}</M> with U unitary and D real.</p>
        </Thm>
        <p>Equivalent form (<b>spectral decomposition</b>): <M>{t`A = \lambda_1q_1q_1^T + \cdots + \lambda_nq_nq_n^T`}</M>, a sum of orthogonal projections weighted by the eigenvalues.</p>
      </Section>
      <Section title="See the geometry">
        <SpectralLab />
      </Section>
      <Section title="Worked examples">
        <Example title="2×2">
          <p><M>{t`A = \begin{bmatrix}2&1\\1&2\end{bmatrix}`}</M>: <M>{t`\lambda = 3`}</M> with <M>{t`q_1 = \tfrac{1}{\sqrt2}(1,1)`}</M>, and <M>{t`\lambda = 1`}</M> with <M>{t`q_2 = \tfrac{1}{\sqrt2}(1,-1)`}</M>.</p>
          <MD>{t`A = 3\cdot\tfrac12\begin{bmatrix}1&1\\1&1\end{bmatrix} + 1\cdot\tfrac12\begin{bmatrix}1&-1\\-1&1\end{bmatrix} = \begin{bmatrix}2&1\\1&2\end{bmatrix}\ ✔`}</MD>
        </Example>
        <Example title="3×3 with a repeated eigenvalue">
          <p><M>{t`B = \begin{bmatrix}3&1&1\\1&3&1\\1&1&3\end{bmatrix}`}</M>: <M>{t`E(5) = \operatorname{span}\{(1,1,1)\}`}</M> and <M>{t`E(2) = \{x+y+z=0\}`}</M>. Inside <M>{t`E(2)`}</M> you must choose an <b>orthogonal</b> basis (Gram-Schmidt on <M>{t`(1,-1,0),(1,0,-1)`}</M>):</p>
          <MD>{t`q_1 = \tfrac{1}{\sqrt3}(1,1,1),\quad q_2 = \tfrac{1}{\sqrt2}(1,-1,0),\quad q_3 = \tfrac{1}{\sqrt6}(1,1,-2),\qquad B = Q\operatorname{diag}(5,2,2)Q^T`}</MD>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>It is not symmetric, so it is not orthogonally diagonalizable (its eigenvectors are not orthogonal). It may still be diagonalizable in the usual sense.</p>}><p>Is <M>{t`\begin{bmatrix}1&2\\3&4\end{bmatrix}`}</M> orthogonally diagonalizable?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`p(\lambda) = \lambda^2 - 3\lambda - 4 = (\lambda-4)(\lambda+1)`}</M>. <M>{t`E(4) = \operatorname{span}\{(1,2)\}`}</M>, <M>{t`E(-1) = \operatorname{span}\{(2,-1)\}`}</M>, orthogonal ✔. <M>{t`Q = \tfrac{1}{\sqrt5}\begin{bmatrix}1&2\\2&-1\end{bmatrix}`}</M>, <M>{t`D = \operatorname{diag}(4,-1)`}</M>.</p>}><p>Orthogonally diagonalize <M>{t`\begin{bmatrix}0&2\\2&3\end{bmatrix}`}</M>.</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Forgetting to <b>normalize</b> the columns of Q: without unit length, <M>{t`Q^T\neq Q^{-1}`}</M>.</p></Pitfall>
        <Pitfall><p>In an eigenspace of dimension ≥ 2, picking two eigenvectors that are not orthogonal. Apply Gram-Schmidt inside that eigenspace.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I recognize when the spectral theorem applies", "I build an orthogonal Q and D", "I write the spectral decomposition Σλqqᵀ", "I handle repeated eigenvalues with Gram-Schmidt"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 19. Orthogonal, unitary and Hermitian transformations ───────────────────────── */
export function OrtogonaisUnitarias() {
  return (
    <>
      <Section title="In a nutshell">
        <Def title="Three important families">
          <ul className="list-disc space-y-1 pl-6">
            <li><b>Orthogonal</b> (real): <M>{t`Q^TQ = I`}</M> ⇔ the columns form an orthonormal basis ⇔ <M>{t`\langle Qu,Qv\rangle = \langle u,v\rangle`}</M> (preserves inner products, lengths and angles). <M>{t`\det Q = \pm1`}</M>.</li>
            <li><b>Unitary</b> (complex): <M>{t`U^*U = I`}</M>, with <M>{t`U^* = \overline{U}^T`}</M>. The complex version of orthogonal.</li>
            <li><b>Hermitian</b> (self-adjoint): <M>{t`A^* = A`}</M> ⇔ <M>{t`\langle Au, v\rangle = \langle u, Av\rangle`}</M>. Real eigenvalues. (Real and Hermitian = symmetric.)</li>
          </ul>
        </Def>
        <Thm>
          <p>The eigenvalues of an orthogonal or unitary matrix have modulus 1: if <M>{t`Qv = \lambda v`}</M>, then <M>{t`\|v\| = \|Qv\| = |\lambda|\|v\|`}</M>. In <M>{t`\mathbb{R}^2`}</M>, the orthogonal transformations are exactly the rotations (<M>{t`\det = 1`}</M>) and the reflections (<M>{t`\det = -1`}</M>).</p>
        </Thm>
      </Section>
      <Section title="Try it">
        <OrthogonalLab />
      </Section>
      <Section title="Worked examples">
        <Example title="A 3×3 orthogonal matrix">
          <MD>{t`Q = \frac13\begin{bmatrix}1&2&2\\2&1&-2\\2&-2&1\end{bmatrix}`}</MD>
          <p>Its columns have norm <M>{t`\tfrac{\sqrt{1+4+4}}{3} = 1`}</M> and are orthogonal (e.g. <M>{t`\tfrac{2 + 2 - 4}{9} = 0`}</M>). <M>{t`\det Q = -1`}</M>: it includes a reflection.</p>
        </Example>
        <Example title="Hermitian and unitary">
          <p><M>{t`H = \begin{bmatrix}2&i\\-i&2\end{bmatrix}`}</M>: <M>{t`H^* = \overline{H}^T = H`}</M>. <M>{t`p(\lambda) = (2-\lambda)^2 - 1`}</M> ⇒ <M>{t`\lambda = 1, 3`}</M>, real as predicted.</p>
          <p><M>{t`U = \tfrac{1}{\sqrt2}\begin{bmatrix}1&i\\i&1\end{bmatrix}`}</M>: <M>{t`U^*U = \tfrac12\begin{bmatrix}1&-i\\-i&1\end{bmatrix}\begin{bmatrix}1&i\\i&1\end{bmatrix} = I`}</M> ✔</p>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>The 2nd column must be a unit vector orthogonal to <M>{t`(0.6, 0.8)`}</M>: <M>{t`(a,b) = \pm(-0.8, 0.6)`}</M>.</p>}><p>Complete <M>{t`\begin{bmatrix}0.6&a\\0.8&b\end{bmatrix}`}</M> so that it is orthogonal.</p></Exercise>
        <Exercise n={2} solution={<p>No: <M>{t`\|(0,1)\| = 1`}</M> but <M>{t`\|A(0,1)\| = \|(1,1)\| = \sqrt2`}</M>.</p>}><p>Is <M>{t`\begin{bmatrix}1&1\\0&1\end{bmatrix}`}</M> orthogonal?</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`\det(Q^TQ) = (\det Q)^2 = \det I = 1`}</M>.</p>}><p>Show that <M>{t`\det Q = \pm1`}</M> when Q is orthogonal.</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>"Orthogonal columns ⇒ orthogonal matrix": unit length is missing. <M>{t`\operatorname{diag}(2,2)`}</M> has orthogonal columns and is not orthogonal.</p></Pitfall>
        <Pitfall><p>Over <M>{t`\mathbb{C}`}</M>, using <M>{t`U^T`}</M> instead of <M>{t`U^* = \overline{U}^T`}</M>.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I check QᵀQ = I and U*U = I", "I know they preserve lengths and angles", "I know Hermitian matrices have real eigenvalues", "I tell rotations from reflections by the determinant"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 20. Singular value decomposition ───────────────────────── */
export function SVD() {
  return (
    <>
      <Section title="In a nutshell">
        <Thm title="Singular value decomposition">
          <p>Every matrix A (m×n) can be written as <M>{t`A = U\Sigma V^T`}</M>, with U (m×m) and V (n×n) orthogonal and Σ an m×n "diagonal" matrix with <M>{t`\sigma_1\geq\sigma_2\geq\cdots\geq0`}</M>.</p>
          <ul className="list-disc pl-6">
            <li><M>{t`\sigma_i = \sqrt{\lambda_i(A^TA)}`}</M> are the <b>singular values</b>;</li>
            <li>the columns of V are orthonormal eigenvectors of <M>{t`A^TA`}</M>;</li>
            <li><M>{t`u_i = \frac{1}{\sigma_i}Av_i`}</M> for <M>{t`\sigma_i\neq0`}</M> (complete U to an orthonormal basis);</li>
            <li><M>{t`\operatorname{rank}(A)`}</M> = number of non-zero singular values.</li>
          </ul>
        </Thm>
        <p>Geometry: every linear map is <b>rotate (Vᵀ) → stretch along the axes (Σ) → rotate (U)</b>. The unit sphere goes to an ellipsoid with semi-axes <M>{t`\sigma_i`}</M>.</p>
      </Section>
      <Section title="See the three stages">
        <SVDLab />
      </Section>
      <Section title="Worked example">
        <Example>
          <p><M>{t`A = \begin{bmatrix}3&0\\4&5\end{bmatrix}`}</M>: <M>{t`A^TA = \begin{bmatrix}25&20\\20&25\end{bmatrix}`}</M>, with eigenvalues 45 and 5.</p>
          <ul className="list-disc pl-6">
            <li><M>{t`\sigma_1 = \sqrt{45} = 3\sqrt5`}</M>, <M>{t`v_1 = \tfrac{1}{\sqrt2}(1,1)`}</M>, <M>{t`u_1 = \tfrac{1}{\sigma_1}Av_1 = \tfrac{1}{\sqrt{10}}(1,3)`}</M>;</li>
            <li><M>{t`\sigma_2 = \sqrt5`}</M>, <M>{t`v_2 = \tfrac{1}{\sqrt2}(1,-1)`}</M>, <M>{t`u_2 = \tfrac{1}{\sigma_2}Av_2 = \tfrac{1}{\sqrt{10}}(3,-1)`}</M>.</li>
          </ul>
          <p>Check: <M>{t`\langle u_1,u_2\rangle = 0`}</M> and <M>{t`\sigma_1\sigma_2 = 15 = |\det A|`}</M> ✔</p>
        </Example>
        <Note><p><b>Application</b>: truncating the sum <M>{t`A = \sum\sigma_iu_iv_i^T`}</M> after k terms gives the best rank-k approximation (Eckart-Young theorem). It is the basis of image compression and principal component analysis (PCA).</p></Note>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p><M>{t`A^TA = \operatorname{diag}(9, 4)`}</M> ⇒ <M>{t`\sigma = 3, 2`}</M>.</p>}><p>Singular values of <M>{t`\operatorname{diag}(3,-2)`}</M>?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`A^TA = \begin{bmatrix}2&2\\2&2\end{bmatrix}`}</M>, eigenvalues 4 and 0 ⇒ <M>{t`\sigma = 2, 0`}</M>, rank 1. <M>{t`A = 2\,u_1v_1^T`}</M> with <M>{t`u_1 = v_1 = \tfrac{1}{\sqrt2}(1,1)`}</M>.</p>}><p>SVD of <M>{t`\begin{bmatrix}1&1\\1&1\end{bmatrix}`}</M>?</p></Exercise>
        <Exercise n={3} solution={<p>For symmetric A, <M>{t`A^TA = A^2`}</M> has eigenvalues <M>{t`\lambda_i^2`}</M>, so <M>{t`\sigma_i = |\lambda_i|`}</M>.</p>}><p>How are the singular values and eigenvalues of a symmetric matrix related?</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Using the eigenvalues of A as singular values. They only coincide (in absolute value) when A is symmetric.</p></Pitfall>
        <Pitfall><p>Computing U and V independently (eigenvectors of <M>{t`AA^T`}</M> and <M>{t`A^TA`}</M>) without matching the signs. Use <M>{t`u_i = Av_i/\sigma_i`}</M>.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I compute σᵢ from AᵀA", "I build V and U = AV/σ", "I interpret it geometrically (rotate · stretch · rotate)", "I read the rank from the non-zero σ"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 21. Quadratic forms ───────────────────────── */
export function FormasQuadraticas() {
  return (
    <>
      <Section title="In a nutshell">
        <p>A <b>quadratic form</b> on <M>{t`\mathbb{R}^n`}</M> is <M>{t`Q(x) = x^TAx`}</M> with A symmetric. In 2D: <M>{t`ax^2 + 2bxy + cy^2 = \begin{bmatrix}x&y\end{bmatrix}\begin{bmatrix}a&b\\b&c\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}`}</M>.</p>
        <Thm title="Classification by eigenvalues">
          <ul className="list-disc pl-6">
            <li><b>positive definite</b> ⇔ all <M>{t`\lambda_i > 0`}</M> (<M>{t`Q(x) > 0`}</M> for <M>{t`x\neq0`}</M>);</li>
            <li><b>positive semidefinite</b> ⇔ all <M>{t`\lambda_i \geq 0`}</M>;</li>
            <li><b>negative definite / semidefinite</b> ⇔ all <M>{t`\lambda_i < 0`}</M> / <M>{t`\leq 0`}</M>;</li>
            <li><b>indefinite</b> ⇔ there are both positive and negative eigenvalues.</li>
          </ul>
          <p>Why: by the spectral theorem, with <M>{t`x = Qy`}</M> we get <M>{t`Q(x) = \lambda_1y_1^2 + \cdots + \lambda_ny_n^2`}</M>, with no cross terms.</p>
        </Thm>
        <Thm title="Leading principal minors test (Sylvester)">
          <p>Let <M>{t`\Delta_k`}</M> be the determinants of the top-left k×k submatrices. A is <b>positive definite</b> ⇔ <M>{t`\Delta_1,\Delta_2,\dots,\Delta_n > 0`}</M>. It is <b>negative definite</b> ⇔ the signs alternate starting negative (<M>{t`\Delta_1 < 0,\ \Delta_2 > 0,\ \Delta_3 < 0,\dots`}</M>).</p>
        </Thm>
      </Section>
      <Section title="See the level curves">
        <QuadraticFormLab />
      </Section>
      <Section title="Worked examples">
        <Example title="3 variables by the minors test">
          <p><M>{t`Q = 2x^2 + 2y^2 + 2z^2 + 2xy + 2yz`}</M> ⇒ <M>{t`A = \begin{bmatrix}2&1&0\\1&2&1\\0&1&2\end{bmatrix}`}</M>.</p>
          <p><M>{t`\Delta_1 = 2,\ \Delta_2 = 4 - 1 = 3,\ \Delta_3 = \det A = 4`}</M>, all positive ⇒ <b>positive definite</b>. (The eigenvalues are <M>{t`2`}</M> and <M>{t`2\pm\sqrt2`}</M>, all positive ✔)</p>
        </Example>
        <Example title="Removing the cross term">
          <p><M>{t`Q = x^2 + 4xy + y^2`}</M>, <M>{t`A = \begin{bmatrix}1&2\\2&1\end{bmatrix}`}</M>, eigenvalues 3 and −1 ⇒ <b>indefinite</b>. In the axes <M>{t`\tfrac{1}{\sqrt2}(1,1)`}</M> and <M>{t`\tfrac{1}{\sqrt2}(1,-1)`}</M>: <M>{t`Q = 3s^2 - t^2`}</M>, and <M>{t`Q = 1`}</M> is a hyperbola.</p>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p><M>{t`A = \begin{bmatrix}-1&1\\1&-2\end{bmatrix}`}</M>: <M>{t`\Delta_1 = -1 < 0`}</M>, <M>{t`\Delta_2 = 2 - 1 = 1 > 0`}</M> ⇒ negative definite.</p>}><p>Classify <M>{t`Q = -x^2 - 2y^2 + 2xy`}</M>.</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`Q = (x+y)^2 \geq 0`}</M> and it vanishes at <M>{t`(1,-1)`}</M> ⇒ positive semidefinite (eigenvalues 2 and 0).</p>}><p>Classify <M>{t`Q = x^2 + 2xy + y^2`}</M>.</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`A = \begin{bmatrix}1&k\\k&4\end{bmatrix}`}</M>: <M>{t`\Delta_1 = 1 > 0`}</M> and <M>{t`\Delta_2 = 4 - k^2 > 0 \Leftrightarrow |k| < 2`}</M>.</p>}><p>For which <M>k</M> is <M>{t`x^2 + 2kxy + 4y^2`}</M> positive definite?</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Putting the whole cross-term coefficient in the matrix. In <M>{t`ax^2 + \mathbf{2b}xy + cy^2`}</M> the off-diagonal entry is <b>b</b> (half the coefficient of xy).</p></Pitfall>
        <Pitfall><p>Using Sylvester's test for semidefinite forms: if some <M>{t`\Delta_k = 0`}</M> the leading-minors test does not decide. Use the eigenvalues.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I write the symmetric matrix of a quadratic form", "I classify by eigenvalues", "I classify with the minors test", "I remove cross terms with an orthogonal change of variables"]} />
      </Section>
    </>
  );
}
