"use client";
import { M, MD } from "../ui/Tex";
import { Section, Def, Thm, Note, Pitfall, Tip, Example, Exercise, Checklist } from "../ui/blocks";
import { GaussLab } from "../widgets/GaussLab";
import { TransformLab, KernelImageLab } from "../widgets/TransformLab";
import { SubspaceLab, SpanLab, SolutionSpaceLab } from "../widgets/SpaceLabs";

const t = String.raw;

/* ───────────────────────── 6. Vector spaces ───────────────────────── */
export function EspacosVetoriais() {
  return (
    <>
      <Section title="In a nutshell">
        <p>
          A <b>vector space</b> over <M>{t`\mathbb{K}`}</M> (<M>{t`\mathbb{R}`}</M> or <M>{t`\mathbb{C}`}</M>) is a set <M>V</M> where you can <b>add</b> elements and <b>multiply them by scalars</b>, with the usual rules
          (addition is commutative and associative, there is a <M>{t`\vec 0`}</M> and additive inverses, distributivity, <M>{t`1\cdot u = u`}</M>). Its elements are called vectors, even when they are polynomials or functions.
        </p>
        <ul className="list-disc pl-6">
          <li><M>{t`\mathbb{R}^n`}</M>; <M>{t`\mathcal{M}_{m\times n}(\mathbb{R})`}</M>;</li>
          <li><M>{t`\mathcal{P}_n`}</M>, polynomials of degree ≤ n;</li>
          <li>functions <M>{t`f:\mathbb{R}\to\mathbb{R}`}</M> (or only the continuous ones, or only the differentiable ones…).</li>
        </ul>
      </Section>
      <Section title="Subspaces">
        <Thm title="Subspace test">
          <p>A subset <M>{t`W \subseteq V`}</M> is a <b>subspace</b> if and only if:</p>
          <ol className="list-decimal pl-6">
            <li><M>{t`\vec 0 \in W`}</M> (equivalently, <M>{t`W\neq\emptyset`}</M>);</li>
            <li><M>{t`u, v \in W \Rightarrow u + v \in W`}</M> (closed under addition);</li>
            <li><M>{t`u\in W,\ \alpha\in\mathbb{K} \Rightarrow \alpha u \in W`}</M> (closed under scalar multiplication).</li>
          </ol>
        </Thm>
        <SubspaceLab />
        <Note>
          <p>The subspaces of <M>{t`\mathbb{R}^2`}</M> are: <M>{t`\{\vec0\}`}</M>, lines through the origin, and <M>{t`\mathbb{R}^2`}</M> itself. In <M>{t`\mathbb{R}^3`}</M> you also get the planes through the origin.</p>
          <p>The solution set of a <b>homogeneous</b> system <M>{t`Ax = 0`}</M> is always a subspace: the <b>null space</b> (kernel) <M>{t`N(A)`}</M>.</p>
        </Note>
        <Thm title="Operations on subspaces">
          <p>The <b>intersection</b> <M>{t`W_1\cap W_2`}</M> and the <b>sum</b> <M>{t`W_1 + W_2 = \{w_1 + w_2\}`}</M> are subspaces. The <b>union</b> in general is <b>not</b> (the two axes of <M>{t`\mathbb{R}^2`}</M>: try it in the lab above).</p>
        </Thm>
      </Section>
      <Section title="Worked examples">
        <Example title="A subspace of polynomials">
          <p><M>{t`W = \{p \in \mathcal{P}_2 : p(1) = 0\}`}</M>. The zero polynomial is in W; if <M>{t`p(1) = q(1) = 0`}</M> then <M>{t`(p+q)(1) = 0`}</M> and <M>{t`(\alpha p)(1) = \alpha\cdot 0 = 0`}</M>. It is a subspace.</p>
        </Example>
        <Example title="One that isn't">
          <p><M>{t`\{A \in \mathcal{M}_{2\times2} : \det A = 0\}`}</M> is not a subspace: <M>{t`\begin{bmatrix}1&0\\0&0\end{bmatrix}`}</M> and <M>{t`\begin{bmatrix}0&0\\0&1\end{bmatrix}`}</M> have determinant 0, but their sum is <M>{t`I`}</M>, with determinant 1.</p>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>Yes: it is the null space of the matrix <M>{t`[1\ \ 1\ \ {-1}]`}</M>, i.e. the solutions of a homogeneous equation. (It is a plane through the origin.)</p>}><p>Is <M>{t`\{(x,y,z) \in\mathbb{R}^3 : x + y = z\}`}</M> a subspace?</p></Exercise>
        <Exercise n={2} solution={<p>No: <M>{t`(1,0)`}</M> is in the set, but <M>{t`(-1)(1,0) = (-1,0)`}</M> is not.</p>}><p>Is <M>{t`\{(x,y) : x \geq 0\}`}</M> a subspace of <M>{t`\mathbb{R}^2`}</M>?</p></Exercise>
        <Exercise n={3} solution={<p>Yes: the zero matrix is symmetric, and if <M>{t`A^T = A`}</M> and <M>{t`B^T = B`}</M> then <M>{t`(A+B)^T = A+B`}</M> and <M>{t`(\alpha A)^T = \alpha A`}</M>.</p>}><p>Do the symmetric 2×2 matrices form a subspace of <M>{t`\mathcal{M}_{2\times2}`}</M>?</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p><b>Only checking closure under addition.</b> All three conditions are needed (the half-plane is closed under addition and is not a subspace).</p></Pitfall>
        <Pitfall><p><b>Forgetting the zero vector.</b> It is the quickest test: if <M>{t`\vec0\notin W`}</M>, you are done.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I know the main examples of vector spaces", "I apply the subspace test (3 conditions)", "I can give counterexamples for each condition", "I know N(A) is a subspace and a union generally isn't"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 7. Linearly independent sets ───────────────────────── */
export function IndependenciaLinear() {
  return (
    <>
      <Section title="In a nutshell">
        <Def title="Linear combination and span">
          <p><M>{t`w = c_1v_1 + \cdots + c_kv_k`}</M> is a <b>linear combination</b> of <M>{t`v_1,\dots,v_k`}</M>. The set of all linear combinations is the <b>span</b> <M>{t`\operatorname{span}\{v_1,\dots,v_k\}`}</M> (written <M>{t`\mathcal{L}\{\dots\}`}</M> at IST), which is always a subspace. If <M>{t`\operatorname{span}\{v_1,\dots,v_k\} = V`}</M>, the set <b>spans</b> V.</p>
        </Def>
        <Def title="Linear independence">
          <p><M>{t`\{v_1,\dots,v_k\}`}</M> is <b>linearly independent</b> if <M>{t`c_1v_1+\cdots+c_kv_k = \vec 0 \Rightarrow c_1 = \cdots = c_k = 0`}</M>. Otherwise it is <b>dependent</b>: some vector is a linear combination of the others.</p>
        </Def>
        <Def title="Basis, dimension and coordinates">
          <p>A <b>basis</b> is an independent set that spans V. All bases have the same number of vectors: the <b>dimension</b> of V. In a basis <M>{t`B = (v_1,\dots,v_n)`}</M>, every <M>u</M> can be written <b>uniquely</b> as <M>{t`u = c_1v_1+\cdots+c_nv_n`}</M>; <M>{t`(u)_B = (c_1,\dots,c_n)`}</M> are its <b>coordinates</b>.</p>
        </Def>
      </Section>
      <Section title="See it in the plane">
        <SpanLab />
      </Section>
      <Section title="How to test in ℝⁿ">
        <Thm>
          <p>Put the vectors as <b>columns</b> of a matrix <M>{t`A = [v_1\ \cdots\ v_k]`}</M> and row-reduce.</p>
          <ul className="list-disc pl-6">
            <li><b>Independent</b> ⇔ every column has a pivot ⇔ <M>{t`N(A) = \{\vec 0\}`}</M>.</li>
            <li><b>Span</b> <M>{t`\mathbb{R}^n`}</M> ⇔ every row has a pivot (<M>{t`\operatorname{rank} A = n`}</M>).</li>
            <li>With <M>{t`k = n`}</M> vectors: independent ⇔ spanning ⇔ basis ⇔ <M>{t`\det A\neq 0`}</M>.</li>
            <li>More than <M>n</M> vectors in <M>{t`\mathbb{R}^n`}</M> are always dependent; fewer than <M>n</M> never span.</li>
          </ul>
        </Thm>
        <GaussLab
          title="What dependence relation is there?"
          hint="The vectors are the columns. Each vector in the null space gives the coefficients of a linear combination of the columns that equals zero."
          mode="kernel"
          initial={[[1, 0, 2], [2, 1, 5], [1, 1, 3]]}
          presets={[
            { label: "Worked example", value: [[1, 0, 2], [2, 1, 5], [1, 1, 3]] },
            { label: "Independent", value: [[1, 0, 1], [1, 1, 0], [0, 1, 1]] },
            { label: "4 vectors in ℝ³", value: [[1, 0, 2, 3], [2, 0, 4, 6], [1, 1, 5, 0]] },
          ]}
        />
        <Example title="Dependence and span">
          <p><M>{t`v_1 = (1,2,1),\ v_2 = (0,1,1),\ v_3 = (2,5,3)`}</M>:</p>
          <MD>{t`\begin{bmatrix}1&0&2\\2&1&5\\1&1&3\end{bmatrix} \xrightarrow[L_3 - L_1]{L_2 - 2L_1} \begin{bmatrix}1&0&2\\0&1&1\\0&1&1\end{bmatrix} \xrightarrow{L_3 - L_2} \begin{bmatrix}1&0&2\\0&1&1\\0&0&0\end{bmatrix}`}</MD>
          <p>Column 3 has no pivot: they are <b>dependent</b>. From the reduced form, <M>{t`v_3 = 2v_1 + v_2`}</M> (check: <M>{t`(2,4,2) + (0,1,1) = (2,5,3)`}</M>).</p>
          <p>So <M>{t`\operatorname{span}\{v_1,v_2,v_3\} = \operatorname{span}\{v_1,v_2\}`}</M>, a plane. Its equation comes from requiring <M>{t`(x,y,z)`}</M> to be a combination of <M>{t`v_1, v_2`}</M>: <M>{t`x - y + z = 0`}</M>.</p>
        </Example>
        <Example title="Coordinates in a basis">
          <p>In <M>{t`B = ((1,1),(1,-1))`}</M>, the vector <M>{t`u = (3,1)`}</M> has <M>{t`(u)_B = (2,1)`}</M>, because <M>{t`2(1,1) + 1(1,-1) = (3,1)`}</M>.</p>
        </Example>
      </Section>
      <Section title="Change of basis">
        <p>If <M>{t`B_1`}</M> and <M>{t`B_2`}</M> are bases of V, the matrix <M>{t`S_{B_1\to B_2}`}</M> has as its <b>columns</b> the coordinates of the vectors of <M>{t`B_1`}</M> in the basis <M>{t`B_2`}</M>, and</p>
        <MD>{t`(u)_{B_2} = S_{B_1\to B_2}\,(u)_{B_1},\qquad S_{B_2\to B_1} = S_{B_1\to B_2}^{-1}`}</MD>
        <Tip><p>For the standard basis <M>{t`\mathcal{E}`}</M> it is easy: <M>{t`S_{B\to\mathcal{E}}`}</M> has the vectors of B as its columns. Then <M>{t`S_{\mathcal{E}\to B} = (S_{B\to\mathcal{E}})^{-1}`}</M>.</p></Tip>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>Dependent: <M>{t`(2,4) = 2(1,2)`}</M>. They span only the line <M>{t`\operatorname{span}\{(1,2)\}`}</M>.</p>}><p>Is <M>{t`\{(1,2),(2,4)\}`}</M> independent? What does it span?</p></Exercise>
        <Exercise n={2} solution={<p>Yes (3 independent polynomials in <M>{t`\mathcal{P}_2`}</M>, which has dimension 3). From <M>{t`a(1+x) + b(1-x) + cx^2 = 3 + x + 2x^2`}</M>: <M>{t`a + b = 3,\ a - b = 1,\ c = 2`}</M>, so <M>{t`(p)_B = (2,1,2)`}</M>.</p>}><p>Is <M>{t`B = (1+x,\ 1-x,\ x^2)`}</M> a basis of <M>{t`\mathcal{P}_2`}</M>? What are the coordinates of <M>{t`p = 3 + x + 2x^2`}</M>?</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`\det\begin{bmatrix}1&k\\k&4\end{bmatrix} = 4 - k^2 \neq 0 \Leftrightarrow k\neq\pm2`}</M>.</p>}><p>For which <M>k</M> are <M>{t`(1,k)`}</M> and <M>{t`(k,4)`}</M> linearly independent?</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p><b>"Dependent ⇒ every vector is a combination of the others."</b> Only <b>at least one</b> is. In <M>{t`\{(1,0),(2,0),(0,1)\}`}</M>, the vector <M>{t`(0,1)`}</M> is not a combination of the others.</p></Pitfall>
        <Pitfall><p><b>Reading a basis of the span from the columns of the echelon form.</b> The pivot columns tell you <b>which of the original vectors</b> to keep.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I test independence by row reduction (a pivot in every column)", "I find the equation of span{v₁, v₂} in ℝ³", "I compute coordinates in a basis", "I build and use S_{B₁→B₂}"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 8. Linear transformations ───────────────────────── */
export function TransformacoesLineares() {
  return (
    <>
      <Section title="In a nutshell">
        <Def>
          <p><M>{t`T: U\to V`}</M> is <b>linear</b> if <M>{t`T(u+v) = T(u)+T(v)`}</M> and <M>{t`T(\alpha u) = \alpha T(u)`}</M> for all <M>{t`u,v,\alpha`}</M>. Immediate consequence: <M>{t`T(\vec 0) = \vec 0`}</M>.</p>
        </Def>
        <p>Between finite-dimensional spaces, every linear transformation is a matrix in disguise: once bases are fixed, <M>{t`T(u)`}</M> is computed as <M>{t`A\,(u)_B`}</M>.</p>
        <Thm title="Matrix of T in the standard bases">
          <p>For <M>{t`T:\mathbb{R}^n\to\mathbb{R}^m`}</M>, the matrix is <M>{t`A = [\,T(e_1)\ \ T(e_2)\ \cdots\ T(e_n)\,]`}</M> (m×n): its <b>columns</b> are the images of the basis.</p>
          <p>In arbitrary bases <M>{t`B`}</M> of U and <M>{t`B'`}</M> of V, column <M>j</M> of <M>{t`M(T;B,B')`}</M> is <M>{t`(T(b_j))_{B'}`}</M>.</p>
        </Thm>
      </Section>
      <Section title="Play with a transformation">
        <TransformLab initial={[[0, -1], [1, 0]]} />
        <Note><p>The composition <M>{t`S\circ T`}</M> has matrix <M>{t`M(S)M(T)`}</M>; T is invertible if and only if its matrix is, and <M>{t`M(T^{-1}) = M(T)^{-1}`}</M>. Changing basis: <M>{t`A' = S^{-1}AS`}</M> (<b>similar</b> matrices represent the same transformation).</p></Note>
      </Section>
      <Section title="Worked examples">
        <Example title="Matrix from the formula">
          <p><M>{t`T(x,y) = (x + 2y,\ 3x,\ x - y)`}</M>: <M>{t`T(e_1) = (1,3,1)`}</M>, <M>{t`T(e_2) = (2,0,-1)`}</M>, so <M>{t`A = \begin{bmatrix}1&2\\3&0\\1&-1\end{bmatrix}`}</M>.</p>
        </Example>
        <Example title="Differentiation is linear">
          <p><M>{t`D:\mathcal{P}_2\to\mathcal{P}_1,\ D(p) = p'`}</M>, in the bases <M>{t`(1,x,x^2)`}</M> and <M>{t`(1,x)`}</M>: <M>{t`D(1) = 0,\ D(x) = 1,\ D(x^2) = 2x`}</M>, so <M>{t`M(D) = \begin{bmatrix}0&1&0\\0&0&2\end{bmatrix}`}</M>.</p>
        </Example>
        <Example title="Known on two vectors">
          <p>If <M>{t`T(1,1) = (3,1)`}</M> and <M>{t`T(1,-1) = (1,3)`}</M>: write <M>{t`(x,y) = \tfrac{x+y}2(1,1) + \tfrac{x-y}2(1,-1)`}</M> and use linearity:</p>
          <MD>{t`T(x,y) = \tfrac{x+y}{2}(3,1) + \tfrac{x-y}{2}(1,3) = (2x + y,\ 2x - y)`}</MD>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>Rotation by 90°: <M>{t`\begin{bmatrix}0&-1\\1&0\end{bmatrix}`}</M>. Reflection in <M>{t`y = x`}</M> (swaps the coordinates): <M>{t`\begin{bmatrix}0&1\\1&0\end{bmatrix}`}</M>.</p>}><p>Write the matrices of the 90° rotation (counter-clockwise) and of the reflection in the line <M>{t`y=x`}</M>.</p></Exercise>
        <Exercise n={2} solution={<p>(a) No: <M>{t`T(0,0) = (1,0)\neq\vec0`}</M>. (b) No: <M>{t`T(-(1,0)) = (1,0)`}</M>, but <M>{t`-T(1,0) = (-1,0)`}</M>. (c) Yes: it is <M>{t`\begin{bmatrix}0&1\\1&-1\end{bmatrix}`}</M>.</p>}><p>Are these linear? (a) <M>{t`T(x,y) = (x+1, y)`}</M> (b) <M>{t`T(x,y) = (|x|, y)`}</M> (c) <M>{t`T(x,y) = (y, x - y)`}</M></p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Putting the images <M>{t`T(e_j)`}</M> in the <b>rows</b> of the matrix instead of the <b>columns</b>.</p></Pitfall>
        <Tip><p>To show T is <b>not</b> linear, start with <M>{t`T(\vec0)`}</M>; if it is 0, look for a concrete numerical counterexample.</p></Tip>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I check linearity (or give a counterexample)", "I write the matrix of T in the standard bases", "I write the matrix of T in other bases", "I know composition ↔ matrix product"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 9. Kernel and image ───────────────────────── */
export function NucleoImagem() {
  return (
    <>
      <Section title="In a nutshell">
        <Def>
          <p>For linear <M>{t`T: U \to V`}</M>: the <b>kernel</b> <M>{t`N(T) = \{u : T(u) = \vec 0\}`}</M> and the <b>image</b> <M>{t`I(T) = \{T(u) : u\in U\}`}</M>. Both are subspaces.</p>
          <p>For a matrix A (m×n): <M>{t`N(A) = \{x : Ax = 0\}\subseteq\mathbb{R}^n`}</M> (null space), the <b>column space</b> <M>{t`C(A)\subseteq\mathbb{R}^m`}</M> (= image) and the <b>row space</b> <M>{t`L(A)\subseteq\mathbb{R}^n`}</M>.</p>
        </Def>
        <Thm title="Rank-nullity theorem">
          <MD>{t`\dim N(A) + \dim C(A) = n \qquad\big(\operatorname{nullity}(A) + \operatorname{rank}(A) = \text{number of columns}\big)`}</MD>
          <p>Also <M>{t`\dim C(A) = \dim L(A) = \operatorname{rank}(A)`}</M>. T is <b>injective</b> ⇔ <M>{t`N(T) = \{\vec 0\}`}</M>; it is <b>surjective</b> ⇔ <M>{t`\operatorname{rank} = \dim V`}</M>.</p>
        </Thm>
      </Section>
      <Section title="See it in the plane">
        <KernelImageLab />
      </Section>
      <Section title="Recipe">
        <ol className="list-decimal space-y-1 pl-6">
          <li>Row-reduce A (preferably to reduced echelon form).</li>
          <li><b>N(A)</b>: solve <M>{t`Ax = 0`}</M>; each free variable gives one basis vector.</li>
          <li><b>C(A)</b>: the columns of the <b>original A</b> in the pivot positions form a basis.</li>
          <li><b>L(A)</b>: the non-zero rows of the echelon form form a basis.</li>
        </ol>
        <GaussLab
          title="Null space of a matrix"
          mode="kernel"
          initial={[[1, 2, 0, 1], [2, 4, 1, 4], [3, 6, 1, 5]]}
          presets={[
            { label: "3×4 example", value: [[1, 2, 0, 1], [2, 4, 1, 4], [3, 6, 1, 5]] },
            { label: "3×3, nullity 1", value: [[-2, 0, 1], [1, 1, 0], [-1, 1, 1]] },
            { label: "Invertible", value: [[1, 2], [3, 4]] },
          ]}
        />
        <Example title="All four answers at once">
          <MD>{t`A = \begin{bmatrix}1&2&0&1\\2&4&1&4\\3&6&1&5\end{bmatrix} \longrightarrow \begin{bmatrix}1&2&0&1\\0&0&1&2\\0&0&0&0\end{bmatrix}`}</MD>
          <ul className="list-disc pl-6">
            <li>Pivots in columns 1 and 3 ⇒ <M>{t`\operatorname{rank}(A) = 2`}</M>, <M>{t`\operatorname{nullity}(A) = 4 - 2 = 2`}</M>.</li>
            <li><M>{t`x_1 = -2x_2 - x_4,\ x_3 = -2x_4`}</M> ⇒ <M>{t`N(A) = \operatorname{span}\{(-2,1,0,0),\ (-1,0,-2,1)\}`}</M>.</li>
            <li><M>{t`C(A) = \operatorname{span}\{(1,2,3),\ (0,1,1)\}`}</M> — columns 1 and 3 <b>of A</b>.</li>
            <li><M>{t`L(A) = \operatorname{span}\{(1,2,0,1),\ (0,0,1,2)\}`}</M>.</li>
          </ul>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>The matrix is <M>{t`\begin{bmatrix}1&1&0\\0&1&1\end{bmatrix}`}</M>. <M>{t`N(T) = \operatorname{span}\{(1,-1,1)\}`}</M> (dimension 1), so rank = 2: T is surjective (<M>{t`I(T) = \mathbb{R}^2`}</M>) but not injective.</p>}><p><M>{t`T:\mathbb{R}^3\to\mathbb{R}^2,\ T(x,y,z) = (x+y,\ y+z)`}</M>. Find N(T) and I(T). Is T injective? Surjective?</p></Exercise>
        <Exercise n={2} solution={<p>No: <M>{t`\dim I(T) = \operatorname{rank} \leq 2 < 3`}</M>.</p>}><p>Can a linear map <M>{t`\mathbb{R}^2\to\mathbb{R}^3`}</M> be surjective?</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`\operatorname{nullity}(A) = 7 - 3 = 4`}</M>; <M>{t`\dim C(A) = \dim L(A) = 3`}</M>.</p>}><p>A is 5×7 with <M>{t`\operatorname{rank}(A) = 3`}</M>. What are the dimensions of N(A), C(A) and L(A)?</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p><b>Using the columns of the echelon form as a basis of C(A).</b> Row operations change the column space! Use the columns of the original A in the pivot positions.</p></Pitfall>
        <Pitfall><p>Mixing up where the spaces live: <M>{t`N(A), L(A)\subseteq\mathbb{R}^n`}</M>, but <M>{t`C(A)\subseteq\mathbb{R}^m`}</M>.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I find bases of N(A), C(A) and L(A)", "I apply rank + nullity = number of columns", "I decide injectivity and surjectivity", "I never use echelon-form columns for C(A)"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 10. Solution space of a linear equation ───────────────────────── */
export function EspacoSolucoes() {
  return (
    <>
      <Section title="In a nutshell">
        <Thm title="Structure of the solutions">
          <p>Let <M>{t`T`}</M> be linear (e.g. <M>{t`T(x) = Ax`}</M>) and <M>{t`x_p`}</M> <b>one</b> particular solution of <M>{t`T(x) = b`}</M>. Then the set of <b>all</b> solutions is</p>
          <MD>{t`\{x : T(x) = b\} = x_p + N(T) = \{x_p + u : u\in N(T)\}`}</MD>
          <p>Because: if <M>{t`T(x) = b`}</M>, then <M>{t`T(x - x_p) = b - b = 0`}</M>, i.e. <M>{t`x - x_p\in N(T)`}</M>.</p>
        </Thm>
        <p>Geometrically: the solutions of <M>{t`Ax = b`}</M> are the null space <b>shifted</b> by <M>{t`x_p`}</M>. They form a subspace only when <M>{t`b = 0`}</M>.</p>
      </Section>
      <Section title="See it in the plane">
        <SolutionSpaceLab />
      </Section>
      <Section title="Worked examples">
        <Example title="A system">
          <p><M>{t`x + y + z = 3,\ x - y + z = 1`}</M>. With <M>{t`L_2 - L_1`}</M>: <M>{t`-2y = -2`}</M>, so <M>{t`y = 1`}</M> and <M>{t`x = 2 - z`}</M>.</p>
          <MD>{t`S = \{(2 - s,\ 1,\ s)\} = \underbrace{(2,1,0)}_{x_p} + \underbrace{\operatorname{span}\{(-1,0,1)\}}_{N(A)}`}</MD>
          <p>Check: <M>{t`(-1,0,1)`}</M> satisfies the homogeneous equations (<M>{t`-1+0+1 = 0`}</M> in both).</p>
        </Example>
        <Example title="A differential equation (same idea!)">
          <p><M>{t`T(y) = y' - 2y`}</M> is linear. For <M>{t`y' - 2y = 4`}</M>: a particular solution is the constant <M>{t`y_p = -2`}</M>; the kernel (<M>{t`y' = 2y`}</M>) is <M>{t`\operatorname{span}\{e^{2t}\}`}</M>. Hence</p>
          <MD>{t`y(t) = -2 + Ce^{2t},\ C\in\mathbb{R}`}</MD>
        </Example>
      </Section>
      <GaussLab
        title="General solution of an underdetermined system"
        initial={[[1, 1, 1, 3], [1, -1, 1, 1]]}
        presets={[
          { label: "Example", value: [[1, 1, 1, 3], [1, -1, 1, 1]] },
          { label: "2 free", value: [[1, 2, -1, 0, 4], [0, 0, 1, 1, 1]] },
        ]}
      />
      <Section title="Exercises">
        <Exercise n={1} solution={<p><M>{t`S = \{(1,2) + t(1,1) : t\in\mathbb{R}\}`}</M>.</p>}><p>You know <M>{t`(1,2)`}</M> solves <M>{t`Ax = b`}</M> and that <M>{t`N(A) = \operatorname{span}\{(1,1)\}`}</M>. What are all the solutions?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`A(u - v) = Au - Av = b - b = 0`}</M>.</p>}><p>Show that if <M>u</M> and <M>v</M> both solve <M>{t`Ax = b`}</M>, then <M>{t`u - v\in N(A)`}</M>.</p></Exercise>
        <Exercise n={3} solution={<p>No: it does not contain the zero vector (<M>{t`A\vec0 = \vec0\neq b`}</M>).</p>}><p>If <M>{t`b\neq0`}</M>, can the solution set of <M>{t`Ax = b`}</M> be a subspace?</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p>Writing <M>{t`S = \operatorname{span}\{x_p, u_1, \dots\}`}</M>: that includes multiples of <M>{t`x_p`}</M> that are <b>not</b> solutions. The correct form is <M>{t`x_p + \operatorname{span}\{u_1,\dots\}`}</M>.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I write general solution = particular + null space", "I know why it is a subspace only when b = 0", "I recognize the same structure in linear differential equations"]} />
      </Section>
    </>
  );
}
