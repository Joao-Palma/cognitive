"use client";
import { M, MD } from "../ui/Tex";
import { Section, Def, Thm, Note, Pitfall, Tip, Example, Exercise, Checklist } from "../ui/blocks";
import { GaussLab } from "../widgets/GaussLab";
import { TransformLab, CompositionLab } from "../widgets/TransformLab";
import { MultiplyLab, LaplaceLab } from "../widgets/MatrixLabs";

const t = String.raw;

/* ───────────────────────── 1. Gaussian and Gauss-Jordan elimination ───────────────────────── */
export function Gauss() {
  return (
    <>
      <Section title="In a nutshell">
        <p>
          Solving a linear system boils down to simplifying its <b>augmented matrix</b> <M>{t`[A\,|\,b]`}</M> without changing the solution set.
          We only use three <b>elementary row operations</b>, all of which can be undone:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li><M>{t`L_i \leftrightarrow L_j`}</M> — swap two rows;</li>
          <li><M>{t`\alpha L_i`}</M> with <M>{t`\alpha \neq 0`}</M> — multiply a row by a non-zero scalar;</li>
          <li><M>{t`L_i + \alpha L_j`}</M> with <M>{t`i\neq j`}</M> — add a multiple of another row.</li>
        </ul>
        <p>
          <b>Gaussian elimination</b> brings the matrix to <b>row echelon form</b>; <b>Gauss-Jordan elimination</b> keeps going until the <b>reduced</b> row echelon form,
          from which the solution can be read off directly.
        </p>
      </Section>

      <Section title="Row echelon form">
        <Def title="Pivot and row echelon form">
          <p>The <b>pivot</b> of a non-zero row is its first non-zero entry. A matrix is in <b>row echelon form</b> if:</p>
          <ol className="list-decimal pl-6">
            <li>all zero rows (if any) are at the bottom;</li>
            <li>each row's pivot is strictly to the right of the pivot of the row above.</li>
          </ol>
          <p>It is in <b>reduced</b> row echelon form if, in addition, every pivot is 1 and is the only non-zero entry in its column.</p>
        </Def>
        <MD>{t`\underbrace{\begin{bmatrix} \boxed{2} & 1 & 3 \\ 0 & \boxed{5} & 1 \\ 0 & 0 & 0 \end{bmatrix}}_{\text{echelon}} \qquad \underbrace{\begin{bmatrix} \boxed{1} & 0 & 2 \\ 0 & \boxed{1} & -1 \\ 0 & 0 & 0 \end{bmatrix}}_{\text{reduced echelon}} \qquad \underbrace{\begin{bmatrix} 0 & \boxed{1} \\ \boxed{3} & 4 \end{bmatrix}}_{\text{not echelon}}`}</MD>
        <Thm title="Why it works">
          <p>Each elementary operation turns the system into an <b>equivalent</b> one (same solutions), because it can be undone by another elementary operation: <M>{t`L_i \leftrightarrow L_j`}</M> undoes itself, <M>{t`\alpha L_i`}</M> is undone by <M>{t`\tfrac1\alpha L_i`}</M> and <M>{t`L_i+\alpha L_j`}</M> by <M>{t`L_i-\alpha L_j`}</M>.</p>
        </Thm>
      </Section>

      <Section title="The algorithm">
        <ol className="list-decimal space-y-1 pl-6">
          <li>Find the leftmost column with a non-zero entry; if needed, swap rows to bring that entry to the top — that is the pivot.</li>
          <li>Clear every entry <b>below</b> the pivot with operations <M>{t`L_i - \frac{a_{ik}}{a_{1k}} L_1`}</M>.</li>
          <li>Ignore the pivot row and repeat on the submatrix below. When done, you have the echelon form (<b>Gauss</b>).</li>
          <li>(<b>Gauss-Jordan</b>) From right to left: divide each row by its pivot and clear the entries <b>above</b> each pivot.</li>
        </ol>
        <GaussLab
          initial={[[1, 2, 1, 4], [2, 5, 3, 10], [-1, 1, 4, 4]]}
          presets={[
            { label: "Worked example", value: [[1, 2, 1, 4], [2, 5, 3, 10], [-1, 1, 4, 4]] },
            { label: "Needs a swap", value: [[0, 1, 2, 3], [1, 1, 1, 2], [2, 0, 1, 1]] },
            { label: "2×2", value: [[1, -1, 1], [2, 1, 8]] },
          ]}
        />
      </Section>

      <Section title="Worked example">
        <Example title="Gauss, then Gauss-Jordan">
          <MD>{t`\begin{cases} x + 2y + z = 4 \\ 2x + 5y + 3z = 10 \\ -x + y + 4z = 4 \end{cases} \;\longrightarrow\; \left[\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\ 2 & 5 & 3 & 10 \\ -1 & 1 & 4 & 4 \end{array}\right]`}</MD>
          <MD>{t`\xrightarrow[L_3 + L_1]{L_2 - 2L_1} \left[\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\ 0 & 1 & 1 & 2 \\ 0 & 3 & 5 & 8 \end{array}\right] \xrightarrow{L_3 - 3L_2} \left[\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\ 0 & 1 & 1 & 2 \\ 0 & 0 & 2 & 2 \end{array}\right]`}</MD>
          <p>That is already echelon form (Gauss). Back-substituting from the bottom: <M>{t`z = 1`}</M>, <M>{t`y = 2 - z = 1`}</M>, <M>{t`x = 4 - 2y - z = 1`}</M>.</p>
          <p>With Gauss-Jordan we continue to the reduced form:</p>
          <MD>{t`\xrightarrow{\frac12 L_3} \left[\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\ 0 & 1 & 1 & 2 \\ 0 & 0 & 1 & 1 \end{array}\right] \xrightarrow[L_1 - L_3]{L_2 - L_3} \left[\begin{array}{ccc|c} 1 & 2 & 0 & 3 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 \end{array}\right] \xrightarrow{L_1 - 2L_2} \left[\begin{array}{ccc|c} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 \end{array}\right]`}</MD>
          <p>We read <M>{t`S = \{(1,1,1)\}`}</M>. <b>Always check</b>: <M>{t`1+2+1 = 4`}</M>, <M>{t`2+5+3=10`}</M>, <M>{t`-1+1+4 = 4`}</M> ✔</p>
        </Example>
      </Section>

      <Section title="Exercises">
        <Exercise n={1} solution={<p>No: the pivot of row 3 (column 2) is to the left of the pivot of row 2 (column 3). A single <M>{t`L_2 \leftrightarrow L_3`}</M> puts it in echelon form.</p>}>
          <p>Is <M>{t`\begin{bmatrix}1&3&0\\0&0&2\\0&1&4\end{bmatrix}`}</M> in row echelon form? If not, which operation puts it there?</p>
        </Exercise>
        <Exercise n={2} solution={<p><M>{t`L_2 - 2L_1`}</M> gives <M>{t`3y = 6`}</M>, so <M>{t`y = 2`}</M> and <M>{t`x = 1 + y = 3`}</M>. <M>{t`S = \{(3,2)\}`}</M>.</p>}>
          <p>Solve by Gaussian elimination: <M>{t`x - y = 1,\ 2x + y = 8`}</M>.</p>
        </Exercise>
        <Exercise n={3} solution={<MD>{t`\begin{bmatrix}2&4&6\\1&3&5\end{bmatrix} \xrightarrow{\frac12 L_1} \begin{bmatrix}1&2&3\\1&3&5\end{bmatrix} \xrightarrow{L_2 - L_1} \begin{bmatrix}1&2&3\\0&1&2\end{bmatrix} \xrightarrow{L_1 - 2L_2} \begin{bmatrix}1&0&-1\\0&1&2\end{bmatrix}`}</MD>}>
          <p>Compute the reduced echelon form of <M>{t`\begin{bmatrix}2&4&6\\1&3&5\end{bmatrix}`}</M>. If it were the augmented matrix of a system, what would the solution be?</p>
        </Exercise>
      </Section>

      <Section title="Common mistakes">
        <Pitfall><p><b>Multiplying a row by 0.</b> That is not an elementary operation: information is lost and the system is no longer equivalent.</p></Pitfall>
        <Pitfall><p><b>Changing two rows "at the same time" using each other</b> (e.g. <M>{t`L_1 \to L_1 - L_2`}</M> and <M>{t`L_2 \to L_2 - L_1`}</M> in the same step, with the old rows). Do one operation at a time.</p></Pitfall>
        <Pitfall><p><b>Forgetting the right-hand-side column</b> when applying an operation. The whole row changes, including after the bar.</p></Pitfall>
        <Tip><p>Before dividing, look for a pivot equal to 1 (swap rows if needed): you will avoid fractions for the rest of the computation.</p></Tip>
      </Section>

      <Section title="Pre-exam checklist">
        <Checklist items={["I know the 3 elementary operations and why they don't change the solutions", "I can recognize echelon and reduced echelon form", "I can do Gaussian elimination on a 3×3 without sign errors", "I always check the solution in the original system"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 2. Application to solving linear systems ───────────────────────── */
export function Sistemas() {
  return (
    <>
      <Section title="In a nutshell">
        <p>
          Once <M>{t`[A\,|\,b]`}</M> is in echelon form, you can classify the system just by looking at the pivots. The <b>rank</b> of a matrix,
          <M>{t`\operatorname{rank}(A)`}</M> (written <M>{t`\operatorname{car}(A)`}</M> at IST), is the number of pivots in any echelon form equivalent to it.
        </p>
      </Section>
      <Section title="Classification">
        <Thm title="Classification of Ax = b (A is m×n)">
          <ul className="list-disc space-y-1 pl-6">
            <li><b>Inconsistent</b> ⇔ there is a pivot in the column of <M>b</M> ⇔ <M>{t`\operatorname{rank}(A) < \operatorname{rank}([A|b])`}</M>. A row <M>{t`[0\ \cdots\ 0\,|\,c]`}</M> with <M>{t`c\neq 0`}</M> appears.</li>
            <li><b>Unique solution</b> ⇔ <M>{t`\operatorname{rank}(A) = \operatorname{rank}([A|b]) = n`}</M>: every column of A has a pivot.</li>
            <li><b>Infinitely many solutions</b> ⇔ <M>{t`\operatorname{rank}(A) = \operatorname{rank}([A|b]) < n`}</M>. Columns without a pivot are the <b>free variables</b>; there are <M>{t`n - \operatorname{rank}(A)`}</M> of them (the <b>degrees of freedom</b>).</li>
          </ul>
        </Thm>
        <Note><p>A <b>homogeneous</b> system (<M>{t`b = 0`}</M>) is always consistent: <M>{t`x = 0`}</M> is a solution. If it has more unknowns than equations (<M>{t`n > m`}</M>), some columns must lack a pivot — it has infinitely many solutions.</p></Note>
        <GaussLab
          title="Classify the system"
          initial={[[1, 2, -1, 3], [2, 4, 1, 9]]}
          presets={[
            { label: "Infinite (1 free)", value: [[1, 2, -1, 3], [2, 4, 1, 9]] },
            { label: "Inconsistent", value: [[1, 1, 1, 1], [1, 2, 1, 2], [1, 1, 1, 3]] },
            { label: "Unique", value: [[1, 1, 1, 1], [1, 2, 3, 2], [1, 1, 2, 3]] },
            { label: "Infinite (2 free)", value: [[1, 2, -1, 1], [2, 4, -2, 2], [-1, -2, 1, -1]] },
          ]}
        />
      </Section>
      <Section title="Writing the general solution">
        <Example title="Parametric form">
          <MD>{t`\left[\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 2 & 4 & 1 & 9 \end{array}\right] \xrightarrow{L_2 - 2L_1} \left[\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 0 & 0 & 3 & 3 \end{array}\right]`}</MD>
          <p>Pivots in columns 1 and 3, so <M>{t`y`}</M> is free. Row 2 gives <M>{t`z = 1`}</M>; row 1 gives <M>{t`x = 3 - 2y + z = 4 - 2y`}</M>. Setting <M>{t`y = s`}</M>:</p>
          <MD>{t`S = \{(4 - 2s,\ s,\ 1) : s \in \mathbb{R}\} = \{(4,0,1) + s(-2,1,0) : s\in\mathbb{R}\}`}</MD>
          <p>It is a <b>line</b> in <M>{t`\mathbb{R}^3`}</M> (one degree of freedom).</p>
        </Example>
      </Section>
      <Section title="Systems with parameters">
        <Example title="Discuss in terms of α and β">
          <MD>{t`\left[\begin{array}{ccc|c} 1 & 1 & 1 & 1 \\ 1 & 2 & \alpha & 2 \\ 1 & 1 & \alpha & \beta \end{array}\right] \xrightarrow[L_3 - L_1]{L_2 - L_1} \left[\begin{array}{ccc|c} 1 & 1 & 1 & 1 \\ 0 & 1 & \alpha - 1 & 1 \\ 0 & 0 & \alpha - 1 & \beta - 1 \end{array}\right]`}</MD>
          <ul className="list-disc pl-6">
            <li><M>{t`\alpha \neq 1`}</M>: three pivots → <b>unique solution</b> (for any β).</li>
            <li><M>{t`\alpha = 1,\ \beta \neq 1`}</M>: the last row is <M>{t`[0\ 0\ 0\,|\,\beta-1]`}</M> → <b>inconsistent</b>.</li>
            <li><M>{t`\alpha = 1,\ \beta = 1`}</M>: the last row is zero → <b>infinitely many</b> solutions, one free variable.</li>
          </ul>
        </Example>
        <Tip><p>When the parameter appears in a pivot, <b>don't divide</b> by it without splitting off the cases where it vanishes.</p></Tip>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<><p><M>{t`L_2 - kL_1`}</M> gives <M>{t`(1-k^2)y = 1 - k`}</M>.</p><ul className="list-disc pl-6"><li><M>{t`k \neq \pm1`}</M>: unique solution <M>{t`x = y = \tfrac{1}{1+k}`}</M>.</li><li><M>{t`k = 1`}</M>: both equations are the same (<M>{t`x+y=1`}</M>) → infinitely many.</li><li><M>{t`k=-1`}</M>: <M>{t`0 = 2`}</M> → inconsistent.</li></ul></>}>
          <p>Discuss, in terms of <M>k</M>, the system <M>{t`x + ky = 1,\ kx + y = 1`}</M>.</p>
        </Exercise>
        <Exercise n={2} solution={<p>A homogeneous system is always consistent. With 3 equations and 5 unknowns there are at most 3 pivots, so at least 2 free variables: infinitely many solutions, with ≥ 2 degrees of freedom.</p>}>
          <p>A homogeneous system has 3 equations and 5 unknowns. What can you guarantee?</p>
        </Exercise>
        <Exercise n={3} solution={<p>(a) Unique (3 pivots, 3 unknowns). (b) Inconsistent (pivot in the b column). (c) Infinitely many, 1 degree of freedom (column 2 has no pivot).</p>}>
          <p>Classify: (a) <M>{t`\left[\begin{array}{ccc|c}1&2&0&1\\0&3&1&2\\0&0&4&0\end{array}\right]`}</M> (b) <M>{t`\left[\begin{array}{cc|c}1&2&1\\0&0&5\end{array}\right]`}</M> (c) <M>{t`\left[\begin{array}{ccc|c}1&2&1&1\\0&0&1&3\end{array}\right]`}</M></p>
        </Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p><b>Thinking a zero row makes the system inconsistent.</b> The row <M>{t`[0\ 0\ 0\,|\,0]`}</M> says <M>{t`0 = 0`}</M>: harmless. Only <M>{t`[0\ \cdots\ 0\,|\,c\neq0]`}</M> means inconsistent.</p></Pitfall>
        <Pitfall><p><b>Picking free variables at random.</b> The free ones are those in columns <b>without a pivot</b> in the echelon form; the others are written in terms of them.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I classify a system just by looking at its echelon form", "I know how this relates to rank(A) and rank([A|b])", "I write the general solution in parametric form", "I discuss systems with parameters without dividing by zero"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 3. Matrices ───────────────────────── */
export function Matrizes() {
  return (
    <>
      <Section title="In a nutshell">
        <p>
          <M>{t`\mathcal{M}_{m\times n}(\mathbb{R})`}</M> is the set of real matrices with <M>m</M> rows and <M>n</M> columns, and <M>{t`a_{ij}`}</M> is the entry in row <M>i</M>, column <M>j</M>.
          Addition and scalar multiplication are entry-wise. The <b>product</b> is the interesting operation:
        </p>
        <MD>{t`A \in \mathcal{M}_{m\times n},\ B\in\mathcal{M}_{n\times p} \;\Rightarrow\; AB \in \mathcal{M}_{m\times p},\qquad [AB]_{ij} = \sum_{k=1}^{n} a_{ik}\,b_{kj}`}</MD>
        <p>That is: entry <M>{t`(i,j)`}</M> of <M>AB</M> is <b>row i of A</b> times <b>column j of B</b>.</p>
      </Section>
      <Section title="The product, by hand">
        <MultiplyLab />
        <Thm title="Properties of the product">
          <ul className="list-disc pl-6">
            <li>Associative: <M>{t`(AB)C = A(BC)`}</M>; distributive: <M>{t`A(B+C) = AB + AC`}</M>.</li>
            <li><M>{t`I_m A = A I_n = A`}</M>, where <M>{t`I`}</M> is the identity.</li>
            <li><b>Not commutative</b>: in general <M>{t`AB \neq BA`}</M>.</li>
            <li><b>No zero-product law</b>: <M>{t`AB = 0`}</M> does not imply <M>{t`A=0`}</M> or <M>{t`B=0`}</M>.</li>
            <li>Transpose: <M>{t`(A^T)_{ij} = a_{ji}`}</M>, <M>{t`(AB)^T = B^TA^T`}</M> (the order flips!).</li>
          </ul>
        </Thm>
      </Section>
      <Section title="Matrices as transformations">
        <p>A <M>{t`2\times2`}</M> matrix transforms vectors of the plane: <M>{t`x \mapsto Ax`}</M>. The 1st column is where <M>{t`e_1 = (1,0)`}</M> goes and the 2nd is where <M>{t`e_2=(0,1)`}</M> goes. Multiplying matrices means <b>composing</b> transformations — which is why order matters.</p>
        <TransformLab showDet={false} />
        <CompositionLab />
      </Section>
      <Section title="Elementary matrices">
        <Def>
          <p>An <b>elementary matrix</b> <M>E</M> is obtained from the identity by <b>one</b> elementary operation. Applying that operation to the rows of <M>A</M> is the same as computing <M>{t`EA`}</M>.</p>
        </Def>
        <MD>{t`E = \begin{bmatrix}1&0&0\\-3&1&0\\0&0&1\end{bmatrix} \;(L_2 - 3L_1):\qquad E\begin{bmatrix}1&2\\3&4\\5&6\end{bmatrix} = \begin{bmatrix}1&2\\0&-2\\5&6\end{bmatrix}`}</MD>
        <p>So Gaussian elimination is <M>{t`E_k\cdots E_2E_1A = U`}</M> (echelon form).</p>
      </Section>
      <Section title="Worked examples">
        <Example title="AB ≠ BA">
          <MD>{t`A = \begin{bmatrix}1&2\\0&1\end{bmatrix},\ B=\begin{bmatrix}1&0\\3&1\end{bmatrix}:\quad AB = \begin{bmatrix}7&2\\3&1\end{bmatrix},\quad BA = \begin{bmatrix}1&2\\3&7\end{bmatrix}`}</MD>
        </Example>
        <Example title="AB = 0 with neither A nor B zero">
          <MD>{t`\begin{bmatrix}1&1\\1&1\end{bmatrix}\begin{bmatrix}1&-1\\-1&1\end{bmatrix} = \begin{bmatrix}0&0\\0&0\end{bmatrix}`}</MD>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p>AB exists and is 2×4. BA does not exist: B has 4 columns and A has 2 rows. <M>{t`A^TA`}</M> is 3×3.</p>}>
          <p>A is 2×3 and B is 3×4. Do AB and BA exist? What size is <M>{t`A^TA`}</M>?</p>
        </Exercise>
        <Exercise n={2} solution={<p><M>{t`(A+B)^2 = A^2 + AB + BA + B^2`}</M>. It equals <M>{t`A^2 + 2AB + B^2`}</M> only if <M>{t`AB = BA`}</M>.</p>}>
          <p>Expand <M>{t`(A+B)^2`}</M>. When is it equal to <M>{t`A^2+2AB+B^2`}</M>?</p>
        </Exercise>
        <Exercise n={3} solution={<MD>{t`\begin{bmatrix}0&0&1\\0&1&0\\1&0&0\end{bmatrix}\ (L_1\leftrightarrow L_3), \qquad \begin{bmatrix}1&0&0\\0&5&0\\0&0&1\end{bmatrix}\ (5L_2)`}</MD>}>
          <p>Write the 3×3 elementary matrices for <M>{t`L_1\leftrightarrow L_3`}</M> and <M>{t`5L_2`}</M>.</p>
        </Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p><b>Multiplying entry by entry.</b> The matrix product is row × column; the entry-wise product is not what is used here.</p></Pitfall>
        <Pitfall><p><b>Cancelling <M>{t`AB = AC \Rightarrow B = C`}</M>.</b> Only valid if A is invertible.</p></Pitfall>
        <Pitfall><p><b><M>{t`(AB)^T = A^TB^T`}</M></b> is wrong: it is <M>{t`B^TA^T`}</M>.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I know when AB exists and what size it is", "I can compute 3×3 products without hesitating", "I can give examples of AB ≠ BA and AB = 0", "I understand that the columns of A are the images of e₁, …, eₙ"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 4. Inverse matrices ───────────────────────── */
export function Inversas() {
  return (
    <>
      <Section title="In a nutshell">
        <Def>
          <p>A square matrix <M>A</M> (n×n) is <b>invertible</b> if there is <M>B</M> with <M>{t`AB = BA = I_n`}</M>. That <M>B</M> is unique and is called the <b>inverse</b>, <M>{t`A^{-1}`}</M>.</p>
        </Def>
        <Thm title="Equivalent criteria (A is n×n)">
          <ul className="list-disc pl-6">
            <li>A is invertible;</li>
            <li><M>{t`\operatorname{rank}(A) = n`}</M> (n pivots) ⇔ the reduced echelon form of A is <M>{t`I_n`}</M>;</li>
            <li><M>{t`Ax = b`}</M> has a unique solution for every <M>b</M> ⇔ <M>{t`Ax = 0`}</M> has only the zero solution;</li>
            <li><M>{t`\det A \neq 0`}</M>;</li>
            <li>A is a product of elementary matrices.</li>
          </ul>
        </Thm>
      </Section>
      <Section title="Computing it with Gauss-Jordan">
        <p>Write <M>{t`[A\,|\,I]`}</M> and run Gauss-Jordan. If the left block reaches <M>{t`I`}</M>, the right block is <M>{t`A^{-1}`}</M>: <M>{t`[A\,|\,I] \to [I\,|\,A^{-1}]`}</M>. If a zero row appears on the left, A is not invertible.</p>
        <GaussLab
          title="Inverse by Gauss-Jordan"
          mode="inverse"
          initial={[[1, 1, 0], [0, 1, 0], [-1, -2, 2]]}
          presets={[
            { label: "3×3 example", value: [[1, 1, 0], [0, 1, 0], [-1, -2, 2]] },
            { label: "2×2", value: [[2, 1], [5, 3]] },
            { label: "Not invertible", value: [[1, 2, 3], [2, 4, 6], [1, 0, 1]] },
          ]}
        />
        <Example title="3×3">
          <MD>{t`\left[\begin{array}{ccc|ccc} 1&1&0&1&0&0\\0&1&0&0&1&0\\-1&-2&2&0&0&1 \end{array}\right] \xrightarrow{L_3+L_1} \left[\begin{array}{ccc|ccc} 1&1&0&1&0&0\\0&1&0&0&1&0\\0&-1&2&1&0&1 \end{array}\right] \xrightarrow{L_3+L_2} \left[\begin{array}{ccc|ccc} 1&1&0&1&0&0\\0&1&0&0&1&0\\0&0&2&1&1&1 \end{array}\right]`}</MD>
          <MD>{t`\xrightarrow{\frac12L_3} \left[\begin{array}{ccc|ccc} 1&1&0&1&0&0\\0&1&0&0&1&0\\0&0&1&\frac12&\frac12&\frac12 \end{array}\right] \xrightarrow{L_1 - L_2} \left[\begin{array}{ccc|ccc} 1&0&0&1&-1&0\\0&1&0&0&1&0\\0&0&1&\frac12&\frac12&\frac12 \end{array}\right] \Rightarrow A^{-1} = \begin{bmatrix}1&-1&0\\0&1&0\\\frac12&\frac12&\frac12\end{bmatrix}`}</MD>
          <p>Check: row 3 of A times each column of <M>{t`A^{-1}`}</M> gives <M>{t`(0,0,1)`}</M> ✔</p>
        </Example>
      </Section>
      <Section title="2×2 formula and properties">
        <MD>{t`\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1} = \frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix} \quad (ad - bc \neq 0)`}</MD>
        <ul className="list-disc pl-6">
          <li><M>{t`(A^{-1})^{-1} = A`}</M>, <M>{t`(A^T)^{-1} = (A^{-1})^T`}</M>, <M>{t`(\alpha A)^{-1} = \tfrac1\alpha A^{-1}`}</M></li>
          <li><M>{t`(AB)^{-1} = B^{-1}A^{-1}`}</M> — the order flips, as with the transpose.</li>
          <li>Matrix equations: <M>{t`AX = B \Rightarrow X = A^{-1}B`}</M>, but <M>{t`XA = B \Rightarrow X = BA^{-1}`}</M>.</li>
        </ul>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<MD>{t`\det = 4 - 6 = -2 \Rightarrow A^{-1} = -\frac12\begin{bmatrix}4&-2\\-3&1\end{bmatrix} = \begin{bmatrix}-2&1\\\frac32&-\frac12\end{bmatrix}`}</MD>}>
          <p>Compute the inverse of <M>{t`\begin{bmatrix}1&2\\3&4\end{bmatrix}`}</M>.</p>
        </Exercise>
        <Exercise n={2} solution={<><p><M>{t`A^{-1} = \begin{bmatrix}1&-1\\0&1\end{bmatrix}`}</M> and <M>{t`X = BA^{-1} = \begin{bmatrix}2&1\\1&0\end{bmatrix}`}</M>.</p><p>Check: <M>{t`XA = \begin{bmatrix}2&3\\1&1\end{bmatrix} = B`}</M> ✔</p></>}>
          <p>Solve <M>{t`XA = B`}</M> with <M>{t`A = \begin{bmatrix}1&1\\0&1\end{bmatrix},\ B = \begin{bmatrix}2&3\\1&1\end{bmatrix}`}</M>.</p>
        </Exercise>
        <Exercise n={3} solution={<p>No: row 2 is twice row 1. <M>{t`L_2 - 2L_1`}</M> gives a zero row, so there is only 1 pivot (and <M>{t`\det = 4-4 = 0`}</M>).</p>}>
          <p>Is <M>{t`\begin{bmatrix}1&2\\2&4\end{bmatrix}`}</M> invertible?</p>
        </Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p><M>{t`(AB)^{-1} = A^{-1}B^{-1}`}</M> — <b>wrong</b>; it is <M>{t`B^{-1}A^{-1}`}</M>.</p></Pitfall>
        <Pitfall><p><M>{t`(A+B)^{-1} = A^{-1} + B^{-1}`}</M> — <b>false</b> in general (A + B may not even be invertible).</p></Pitfall>
        <Pitfall><p>In <M>{t`XA = B`}</M>, writing <M>{t`X = A^{-1}B`}</M>. You multiply on the right: <M>{t`X = BA^{-1}`}</M>.</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I can invert 3×3 matrices with [A|I]", "I know the 2×2 formula by heart", "I know the equivalent invertibility criteria", "I solve AX = B and XA = B without mixing up the order"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 5. Determinants ───────────────────────── */
export function Determinantes() {
  return (
    <>
      <Section title="In a nutshell">
        <p>
          The determinant <M>{t`\det A = |A|`}</M> is a number attached to every square matrix. Geometrically, for 2×2 (3×3) it is the <b>signed area (volume)</b> of the image of the unit square (cube).
          The sign tells you whether orientation is preserved or reversed. The key fact: <M>{t`A`}</M> is invertible <b>if and only if</b> <M>{t`\det A \neq 0`}</M>.
        </p>
        <MD>{t`\begin{vmatrix}a&b\\c&d\end{vmatrix} = ad - bc`}</MD>
      </Section>
      <Section title="The determinant as an area">
        <TransformLab initial={[[2, 1], [0.5, 1.5]]} showVector={false} />
      </Section>
      <Section title="Properties (the ones that come up most)">
        <Thm>
          <ul className="list-disc space-y-1 pl-6">
            <li>Swapping two rows flips the sign: <M>{t`|B| = -|A|`}</M>.</li>
            <li>Multiplying a row by <M>α</M> multiplies the determinant by <M>α</M>. Hence <M>{t`\det(\alpha A) = \alpha^n \det A`}</M> (A n×n).</li>
            <li><M>{t`L_i + \alpha L_j`}</M> <b>does not change</b> the determinant.</li>
            <li>Triangular (or echelon): <M>{t`\det A = a_{11}a_{22}\cdots a_{nn}`}</M>.</li>
            <li>A zero row, or two equal/proportional rows ⇒ <M>{t`\det A = 0`}</M>.</li>
            <li><M>{t`\det(AB) = \det A\,\det B`}</M>, <M>{t`\det A^T = \det A`}</M>, <M>{t`\det A^{-1} = \frac{1}{\det A}`}</M>.</li>
          </ul>
        </Thm>
        <Tip><p>Practical method: reduce A to echelon form while keeping track of row swaps and factors you pulled out. Then multiply the diagonal.</p></Tip>
      </Section>
      <Section title="Laplace expansion">
        <p>Let <M>{t`A_{ij}`}</M> be the submatrix obtained by deleting row <M>i</M> and column <M>j</M>. The <b>cofactor</b> is <M>{t`C_{ij} = (-1)^{i+j}\det A_{ij}`}</M>. For any row <M>i</M> (or column <M>j</M>):</p>
        <MD>{t`\det A = \sum_{j=1}^n a_{ij}C_{ij} = \sum_{i=1}^n a_{ij}C_{ij}`}</MD>
        <LaplaceLab />
        <Example title="Choosing the right column">
          <p>In <M>{t`A = \begin{bmatrix}2&0&1\\1&3&0\\-1&0&4\end{bmatrix}`}</M> column 2 has a single non-zero entry:</p>
          <MD>{t`\det A = 3\cdot(-1)^{2+2}\begin{vmatrix}2&1\\-1&4\end{vmatrix} = 3\,(8+1) = 27`}</MD>
        </Example>
      </Section>
      <Section title="Inverse via cofactors and Cramer's rule">
        <MD>{t`A^{-1} = \frac{1}{\det A}\,\operatorname{cof}(A)^T, \qquad x_k = \frac{\det A_k(b)}{\det A}\ \ \text{(Cramer)}`}</MD>
        <p>where <M>{t`A_k(b)`}</M> is A with column <M>k</M> replaced by <M>b</M>. Cramer only applies if <M>{t`\det A\neq 0`}</M>.</p>
        <Example title="Cramer">
          <p><M>{t`x + 2y = 5,\ 3x + 4y = 6`}</M>: <M>{t`\det A = 4 - 6 = -2`}</M>.</p>
          <MD>{t`x = \frac{\begin{vmatrix}5&2\\6&4\end{vmatrix}}{-2} = \frac{8}{-2} = -4,\qquad y = \frac{\begin{vmatrix}1&5\\3&6\end{vmatrix}}{-2} = \frac{-9}{-2} = \frac92`}</MD>
          <p>Check: <M>{t`-4 + 9 = 5`}</M>, <M>{t`-12 + 18 = 6`}</M> ✔</p>
        </Example>
      </Section>
      <Section title="Exercises">
        <Exercise n={1} solution={<p><M>{t`\det(2A) = 2^3\cdot 5 = 40`}</M>.</p>}><p>A is 3×3 with <M>{t`\det A = 5`}</M>. What is <M>{t`\det(2A)`}</M>?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`\det(A^{-1}B^T) = \frac{1}{\det A}\det B = \frac32`}</M>.</p>}><p>If <M>{t`\det A = 2`}</M> and <M>{t`\det B = 3`}</M>, compute <M>{t`\det(A^{-1}B^T)`}</M>.</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`\det = 4 - k^2 \neq 0 \Leftrightarrow k \neq \pm 2`}</M>.</p>}><p>For which <M>k</M> is <M>{t`\begin{bmatrix}1&k\\k&4\end{bmatrix}`}</M> invertible?</p></Exercise>
      </Section>
      <Section title="Common mistakes">
        <Pitfall><p><M>{t`\det(A+B) = \det A + \det B`}</M> is <b>false</b> (try <M>{t`A = B = I_2`}</M>: 4 ≠ 2).</p></Pitfall>
        <Pitfall><p><M>{t`\det(\alpha A) = \alpha\det A`}</M> is wrong: it is <M>{t`\alpha^n\det A`}</M>.</p></Pitfall>
        <Pitfall><p>Forgetting the signs <M>{t`(-1)^{i+j}`}</M> in Laplace (checkerboard pattern <M>{t`+\,-\,+`}</M>).</p></Pitfall>
      </Section>
      <Section title="Pre-exam checklist">
        <Checklist items={["I compute determinants by row reduction and by Laplace", "I know how each elementary operation affects the determinant", "I use det(AB), det(Aᵀ), det(A⁻¹), det(αA)", "I can apply Cramer's rule"]} />
      </Section>
    </>
  );
}
