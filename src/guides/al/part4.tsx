"use client";
import { M, MD } from "../ui/Tex";
import { Section, Def, Thm, Note, Pitfall, Tip, Example, Exercise, Checklist } from "../ui/blocks";
import { InnerProductLab, GramSchmidtLab, LeastSquaresLab, SpectralLab, OrthogonalLab, SVDLab, QuadraticFormLab } from "../widgets/GeometryLabs";

const t = String.raw;

/* ───────────────────────── 15. Produto interno ───────────────────────── */
export function ProdutoInterno() {
  return (
    <>
      <Section title="Em resumo">
        <Def>
          <p>Um <b>produto interno</b> num espaço real V é uma função <M>{t`\langle\cdot,\cdot\rangle: V\times V\to\mathbb{R}`}</M> que é:</p>
          <ol className="list-decimal pl-6">
            <li>simétrica: <M>{t`\langle u,v\rangle = \langle v,u\rangle`}</M>;</li>
            <li>linear na 1.ª variável: <M>{t`\langle \alpha u + w, v\rangle = \alpha\langle u,v\rangle + \langle w,v\rangle`}</M>;</li>
            <li>definida positiva: <M>{t`\langle u,u\rangle > 0`}</M> se <M>{t`u\neq\vec0`}</M>.</li>
          </ol>
          <p>Em <M>{t`\mathbb{C}^n`}</M> a simetria passa a <M>{t`\langle u,v\rangle = \overline{\langle v,u\rangle}`}</M>, e o produto usual é <M>{t`\langle u,v\rangle = \sum u_i\overline{v_i}`}</M>.</p>
        </Def>
        <p>Com ele definem-se <b>norma</b> <M>{t`\|u\| = \sqrt{\langle u,u\rangle}`}</M>, <b>distância</b> <M>{t`d(u,v) = \|u - v\|`}</M>, <b>ângulo</b> <M>{t`\cos\theta = \frac{\langle u,v\rangle}{\|u\|\|v\|}`}</M> e <b>ortogonalidade</b> <M>{t`u\perp v \Leftrightarrow \langle u,v\rangle = 0`}</M>.</p>
        <Thm title="Desigualdades">
          <p>Cauchy-Schwarz: <M>{t`|\langle u,v\rangle| \leq \|u\|\|v\|`}</M>. Triangular: <M>{t`\|u + v\| \leq \|u\| + \|v\|`}</M>. Pitágoras: <M>{t`u\perp v\Rightarrow \|u+v\|^2 = \|u\|^2 + \|v\|^2`}</M>.</p>
        </Thm>
      </Section>
      <Section title="Ver no plano">
        <InnerProductLab />
      </Section>
      <Section title="Produtos internos em ℝⁿ e complementos ortogonais">
        <p>Todo o produto interno em <M>{t`\mathbb{R}^n`}</M> é da forma <M>{t`\langle u,v\rangle = u^TGv`}</M>, com <M>G</M> simétrica e definida positiva (a <b>matriz da métrica</b>, <M>{t`G_{ij} = \langle e_i, e_j\rangle`}</M>).</p>
        <Example title="Um produto interno não usual">
          <p><M>{t`\langle x, y\rangle = 2x_1y_1 + x_1y_2 + x_2y_1 + x_2y_2`}</M>, ou seja <M>{t`G = \begin{bmatrix}2&1\\1&1\end{bmatrix}`}</M> (simétrica, <M>{t`2 > 0`}</M>, <M>{t`\det G = 1 > 0`}</M>). Aqui <M>{t`\|e_1\| = \sqrt2`}</M> e <M>{t`\langle e_1, e_2\rangle = 1`}</M>: <b>a base canónica deixa de ser ortogonal</b>.</p>
        </Example>
        <Def title="Complemento ortogonal">
          <p><M>{t`W^\perp = \{v : \langle v, w\rangle = 0,\ \forall w\in W\}`}</M>. Para o produto usual, <M>{t`N(A) = L(A)^\perp`}</M>: as soluções de <M>{t`Ax = 0`}</M> são ortogonais a todas as linhas de A.</p>
        </Def>
        <Example title="Complemento de uma reta em ℝ³">
          <p><M>{t`W = \mathcal{L}\{(1,1,1)\}`}</M> ⇒ <M>{t`W^\perp = \{x + y + z = 0\} = \mathcal{L}\{(1,-1,0),(1,0,-1)\}`}</M>.</p>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>Não: <M>{t`\langle (0,1),(0,1)\rangle = -1 < 0`}</M>, falha a positividade.</p>}><p><M>{t`\langle u,v\rangle = u_1v_1 - u_2v_2`}</M> é produto interno em <M>{t`\mathbb{R}^2`}</M>?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`\cos\theta = \frac{1}{\sqrt2\sqrt2} = \frac12`}</M> ⇒ <M>{t`\theta = 60^\circ`}</M>.</p>}><p>Ângulo entre <M>{t`(1,0,1)`}</M> e <M>{t`(0,1,1)`}</M> (produto usual)?</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`\|x\|^2 = \int_0^1 x^2\,dx = \tfrac13`}</M> ⇒ <M>{t`\|x\| = \tfrac{1}{\sqrt3}`}</M>.</p>}><p>Com <M>{t`\langle p,q\rangle = \int_0^1 p(x)q(x)\,dx`}</M> em <M>{t`\mathcal{P}_2`}</M>, calcula <M>{t`\|x\|`}</M>.</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Esquecer o <b>conjugado</b> em <M>{t`\mathbb{C}^n`}</M>: com <M>{t`\sum u_iv_i`}</M>, o vetor <M>{t`(1, i)`}</M> teria "norma" <M>{t`1 + i^2 = 0`}</M>.</p></Pitfall>
        <Pitfall><p>Assumir que ortogonal no produto usual é ortogonal noutro produto interno.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Verifico os 3 axiomas de produto interno", "Calculo normas, ângulos e projeções", "Escrevo a matriz da métrica G", "Calculo complementos ortogonais"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 16. Gram-Schmidt ───────────────────────── */
export function GramSchmidt() {
  return (
    <>
      <Section title="Em resumo">
        <p>Bases ortogonais tornam tudo fácil (coordenadas e projeções são só produtos internos). O processo de <b>Gram-Schmidt</b> transforma uma base qualquer <M>{t`(v_1,\dots,v_k)`}</M> numa base ortogonal <M>{t`(w_1,\dots,w_k)`}</M> do <b>mesmo</b> subespaço:</p>
        <MD>{t`w_1 = v_1,\qquad w_k = v_k - \sum_{j<k}\frac{\langle v_k, w_j\rangle}{\langle w_j,w_j\rangle}\,w_j`}</MD>
        <p>Ou seja: a cada passo tira-se ao novo vetor a sua projeção sobre os anteriores. No fim pode normalizar-se, <M>{t`q_i = w_i/\|w_i\|`}</M>, para ter uma base <b>ortonormada</b>.</p>
        <Thm title="Para que serve uma base ortonormada">
          <p>Se <M>{t`(q_1,\dots,q_k)`}</M> é base ortonormada de W:</p>
          <ul className="list-disc pl-6">
            <li>coordenadas: <M>{t`u = \sum\langle u,q_i\rangle q_i`}</M> para <M>{t`u\in W`}</M>;</li>
            <li>projeção ortogonal: <M>{t`P_W(u) = \sum\langle u, q_i\rangle q_i`}</M>, e <M>{t`u - P_W(u)\in W^\perp`}</M>.</li>
          </ul>
        </Thm>
      </Section>
      <Section title="Passo a passo no plano">
        <GramSchmidtLab />
      </Section>
      <Section title="Exemplo resolvido em ℝ³">
        <Example>
          <p><M>{t`v_1 = (1,1,0),\ v_2 = (1,0,1),\ v_3 = (0,1,1)`}</M>.</p>
          <MD>{t`w_1 = (1,1,0)`}</MD>
          <MD>{t`w_2 = (1,0,1) - \tfrac{1}{2}(1,1,0) = \left(\tfrac12, -\tfrac12, 1\right)`}</MD>
          <MD>{t`w_3 = (0,1,1) - \tfrac{1}{2}(1,1,0) - \tfrac{1/2}{3/2}\left(\tfrac12,-\tfrac12,1\right) = \left(-\tfrac23, \tfrac23, \tfrac23\right)`}</MD>
          <p>Verifica: <M>{t`\langle w_1,w_3\rangle = -\tfrac23+\tfrac23 = 0`}</M>, <M>{t`\langle w_2,w_3\rangle = -\tfrac13 - \tfrac13 + \tfrac23 = 0`}</M> ✔. Normalizando:</p>
          <MD>{t`q_1 = \tfrac{1}{\sqrt2}(1,1,0),\quad q_2 = \tfrac{1}{\sqrt6}(1,-1,2),\quad q_3 = \tfrac{1}{\sqrt3}(-1,1,1)`}</MD>
        </Example>
        <Tip><p>Podes multiplicar cada <M>{t`w_i`}</M> por um escalar (p.ex. <M>{t`w_2 \to 2w_2 = (1,-1,2)`}</M>) antes de continuar: a ortogonalidade não muda e evitas frações.</p></Tip>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p><M>{t`w_1 = (3,4)`}</M>, <M>{t`w_2 = (1,0) - \tfrac{3}{25}(3,4) = (\tfrac{16}{25}, -\tfrac{12}{25})`}</M>, proporcional a <M>{t`(4,-3)`}</M>. Base ortonormada: <M>{t`\tfrac15(3,4),\ \tfrac15(4,-3)`}</M>.</p>}><p>Aplica Gram-Schmidt a <M>{t`(3,4), (1,0)`}</M>.</p></Exercise>
        <Exercise n={2} solution={<p>Base ortogonal de W: <M>{t`w_1 = (1,1,0)`}</M>, <M>{t`w_2 = (\tfrac12,-\tfrac12,1)`}</M>. <M>{t`\langle u,w_1\rangle = 0`}</M>, <M>{t`\langle u,w_2\rangle = 1`}</M>, <M>{t`\langle w_2,w_2\rangle = \tfrac32`}</M>, logo <M>{t`P_W(u) = \tfrac23 w_2 = (\tfrac13,-\tfrac13,\tfrac23)`}</M>. O resto <M>{t`(-\tfrac13,\tfrac13,\tfrac13)`}</M> é ortogonal a W ✔</p>}><p>Projeta <M>{t`u = (0,0,1)`}</M> no plano <M>{t`W = \mathcal{L}\{(1,1,0),(1,0,1)\}`}</M>.</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Projetar sobre os vetores <b>originais</b> <M>{t`v_j`}</M> em vez dos já ortogonalizados <M>{t`w_j`}</M>. A fórmula usa <M>{t`w_j`}</M>!</p></Pitfall>
        <Pitfall><p>Usar a fórmula da projeção <M>{t`\sum\langle u,w_i\rangle w_i`}</M> sem dividir por <M>{t`\langle w_i,w_i\rangle`}</M> quando a base não está normalizada.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Aplico Gram-Schmidt a 3 vetores de ℝ³", "Normalizo para obter base ortonormada", "Calculo projeções ortogonais sobre subespaços", "Sei que 𝓛 não muda durante o processo"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 17. Mínimos quadrados ───────────────────────── */
export function MinimosQuadrados() {
  return (
    <>
      <Section title="Em resumo">
        <p>Muitas vezes <M>{t`Ax = b`}</M> é <b>impossível</b> (mais equações do que incógnitas, dados com ruído). Procuramos então o <M>{t`\hat x`}</M> que torna <M>{t`A\hat x`}</M> o mais próximo possível de <M>b</M>:</p>
        <MD>{t`\hat x\ \text{minimiza}\ \|b - Ax\|^2 \iff A\hat x = P_{C(A)}(b) \iff A^TA\,\hat x = A^Tb\quad\text{(equações normais)}`}</MD>
        <Thm>
          <p>As equações normais são sempre possíveis. A solução <M>{t`\hat x`}</M> é única se e só se as colunas de A são linearmente independentes (e então <M>{t`\hat x = (A^TA)^{-1}A^Tb`}</M>). O erro <M>{t`b - A\hat x`}</M> é ortogonal a <M>{t`C(A)`}</M>.</p>
        </Thm>
      </Section>
      <Section title="Ajuste de uma reta">
        <LeastSquaresLab />
      </Section>
      <Section title="Exemplo resolvido">
        <Example title="Reta y = α + βx pelos pontos (0,1), (1,1), (2,3)">
          <MD>{t`A = \begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix},\ b = \begin{bmatrix}1\\1\\3\end{bmatrix}:\quad A^TA = \begin{bmatrix}3&3\\3&5\end{bmatrix},\ A^Tb = \begin{bmatrix}5\\7\end{bmatrix}`}</MD>
          <p><M>{t`3\alpha + 3\beta = 5,\ 3\alpha + 5\beta = 7`}</M> ⇒ <M>{t`\beta = 1,\ \alpha = \tfrac23`}</M>. Reta: <M>{t`y = \tfrac23 + x`}</M>.</p>
          <p>Resíduos <M>{t`b - A\hat x = (\tfrac13, -\tfrac23, \tfrac13)`}</M>: confirma que <M>{t`A^T(b - A\hat x) = 0`}</M> ✔. Erro mínimo: <M>{t`\tfrac19 + \tfrac49 + \tfrac19 = \tfrac23`}</M>.</p>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p><M>{t`A = (1,1)^T`}</M>, <M>{t`A^TA = 2`}</M>, <M>{t`A^Tb = 4`}</M> ⇒ <M>{t`\hat x = 2`}</M>, a média.</p>}><p>Solução de mínimos quadrados do "sistema" <M>{t`x = 1,\ x = 3`}</M>?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`A = (1,2)^T`}</M>, <M>{t`b = (2,3)`}</M>: <M>{t`A^TA = 5`}</M>, <M>{t`A^Tb = 8`}</M> ⇒ <M>{t`\beta = \tfrac85`}</M>.</p>}><p>Ajusta <M>{t`y = \beta x`}</M> (reta pela origem) aos pontos <M>{t`(1,2), (2,3)`}</M>.</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`A\hat x = (\tfrac23, \tfrac53, \tfrac83)`}</M>: os valores da reta em <M>{t`x = 0, 1, 2`}</M>.</p>}><p>No exemplo resolvido, qual é a projeção de b em C(A)?</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>"Resolver" um sistema impossível eliminando uma das equações. Isso dá uma solução exata de outro problema, não a melhor aproximação.</p></Pitfall>
        <Pitfall><p>Esquecer a coluna de 1's quando o modelo tem termo independente (α).</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Monto A e b a partir de um modelo e de pontos", "Resolvo as equações normais", "Calculo o erro e verifico Aᵀ(b − Ax̂) = 0", "Sei quando a solução é única"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 18. Teorema espetral ───────────────────────── */
export function TeoremaEspetral() {
  return (
    <>
      <Section title="Em resumo">
        <Thm title="Teorema espetral (caso real)">
          <p>Se A é real e <b>simétrica</b> (<M>{t`A^T = A`}</M>), então:</p>
          <ul className="list-disc pl-6">
            <li>todos os valores próprios são reais;</li>
            <li>vetores próprios de valores próprios distintos são ortogonais;</li>
            <li>A é <b>ortogonalmente diagonalizável</b>: <M>{t`A = QDQ^T`}</M> com Q ortogonal (<M>{t`Q^{-1} = Q^T`}</M>).</li>
          </ul>
          <p>Reciprocamente, se <M>{t`A = QDQ^T`}</M> com Q ortogonal, A é simétrica. No caso complexo: A hermitiana (<M>{t`A^* = A`}</M>) ⇒ <M>{t`A = UDU^*`}</M> com U unitária e D real.</p>
        </Thm>
        <p>Forma equivalente (<b>decomposição espetral</b>): <M>{t`A = \lambda_1q_1q_1^T + \cdots + \lambda_nq_nq_n^T`}</M>, uma soma de projeções ortogonais pesadas pelos valores próprios.</p>
      </Section>
      <Section title="Ver a geometria">
        <SpectralLab />
      </Section>
      <Section title="Exemplos resolvidos">
        <Example title="2×2">
          <p><M>{t`A = \begin{bmatrix}2&1\\1&2\end{bmatrix}`}</M>: <M>{t`\lambda = 3`}</M> com <M>{t`q_1 = \tfrac{1}{\sqrt2}(1,1)`}</M>, e <M>{t`\lambda = 1`}</M> com <M>{t`q_2 = \tfrac{1}{\sqrt2}(1,-1)`}</M>.</p>
          <MD>{t`A = 3\cdot\tfrac12\begin{bmatrix}1&1\\1&1\end{bmatrix} + 1\cdot\tfrac12\begin{bmatrix}1&-1\\-1&1\end{bmatrix} = \begin{bmatrix}2&1\\1&2\end{bmatrix}\ ✔`}</MD>
        </Example>
        <Example title="3×3 com valor próprio repetido">
          <p><M>{t`B = \begin{bmatrix}3&1&1\\1&3&1\\1&1&3\end{bmatrix}`}</M>: <M>{t`E(5) = \mathcal{L}\{(1,1,1)\}`}</M> e <M>{t`E(2) = \{x+y+z=0\}`}</M>. Dentro de <M>{t`E(2)`}</M> é preciso escolher uma base <b>ortogonal</b> (Gram-Schmidt a <M>{t`(1,-1,0),(1,0,-1)`}</M>):</p>
          <MD>{t`q_1 = \tfrac{1}{\sqrt3}(1,1,1),\quad q_2 = \tfrac{1}{\sqrt2}(1,-1,0),\quad q_3 = \tfrac{1}{\sqrt6}(1,1,-2),\qquad B = Q\operatorname{diag}(5,2,2)Q^T`}</MD>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>Não é simétrica, logo não é ortogonalmente diagonalizável (os vetores próprios não são ortogonais). Ainda pode ser diagonalizável no sentido usual.</p>}><p><M>{t`\begin{bmatrix}1&2\\3&4\end{bmatrix}`}</M> é ortogonalmente diagonalizável?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`p(\lambda) = \lambda^2 - 3\lambda - 4 = (\lambda-4)(\lambda+1)`}</M>. <M>{t`E(4) = \mathcal{L}\{(1,2)\}`}</M>, <M>{t`E(-1) = \mathcal{L}\{(2,-1)\}`}</M>, ortogonais ✔. <M>{t`Q = \tfrac{1}{\sqrt5}\begin{bmatrix}1&2\\2&-1\end{bmatrix}`}</M>, <M>{t`D = \operatorname{diag}(4,-1)`}</M>.</p>}><p>Diagonaliza ortogonalmente <M>{t`\begin{bmatrix}0&2\\2&3\end{bmatrix}`}</M>.</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Esquecer de <b>normalizar</b> as colunas de Q: sem norma 1, <M>{t`Q^T\neq Q^{-1}`}</M>.</p></Pitfall>
        <Pitfall><p>Num espaço próprio de dimensão ≥ 2, escolher dois vetores próprios não ortogonais. Aplica Gram-Schmidt dentro desse espaço.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Reconheço quando se aplica o teorema espetral", "Construo Q ortogonal e D", "Escrevo a decomposição espetral Σλqqᵀ", "Trato valores próprios repetidos com Gram-Schmidt"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 19. Transformações ortogonais, unitárias, hermitianas ───────────────────────── */
export function OrtogonaisUnitarias() {
  return (
    <>
      <Section title="Em resumo">
        <Def title="Três famílias importantes">
          <ul className="list-disc space-y-1 pl-6">
            <li><b>Ortogonal</b> (real): <M>{t`Q^TQ = I`}</M> ⇔ colunas formam base ortonormada ⇔ <M>{t`\langle Qu,Qv\rangle = \langle u,v\rangle`}</M> (preserva produtos internos, normas e ângulos). <M>{t`\det Q = \pm1`}</M>.</li>
            <li><b>Unitária</b> (complexa): <M>{t`U^*U = I`}</M>, com <M>{t`U^* = \overline{U}^T`}</M>. É a versão complexa da ortogonal.</li>
            <li><b>Hermitiana</b> (autoadjunta): <M>{t`A^* = A`}</M> ⇔ <M>{t`\langle Au, v\rangle = \langle u, Av\rangle`}</M>. Valores próprios reais. (Real e hermitiana = simétrica.)</li>
          </ul>
        </Def>
        <Thm>
          <p>Os valores próprios de uma matriz ortogonal ou unitária têm módulo 1: se <M>{t`Qv = \lambda v`}</M>, então <M>{t`\|v\| = \|Qv\| = |\lambda|\|v\|`}</M>. Em <M>{t`\mathbb{R}^2`}</M>, as transformações ortogonais são exatamente as rotações (<M>{t`\det = 1`}</M>) e as reflexões (<M>{t`\det = -1`}</M>).</p>
        </Thm>
      </Section>
      <Section title="Experimentar">
        <OrthogonalLab />
      </Section>
      <Section title="Exemplos resolvidos">
        <Example title="Uma matriz ortogonal 3×3">
          <MD>{t`Q = \frac13\begin{bmatrix}1&2&2\\2&1&-2\\2&-2&1\end{bmatrix}`}</MD>
          <p>As colunas têm norma <M>{t`\tfrac{\sqrt{1+4+4}}{3} = 1`}</M> e são ortogonais (p.ex. <M>{t`\tfrac{2 + 2 - 4}{9} = 0`}</M>). <M>{t`\det Q = -1`}</M>: inclui uma reflexão.</p>
        </Example>
        <Example title="Hermitiana e unitária">
          <p><M>{t`H = \begin{bmatrix}2&i\\-i&2\end{bmatrix}`}</M>: <M>{t`H^* = \overline{H}^T = H`}</M>. <M>{t`p(\lambda) = (2-\lambda)^2 - 1`}</M> ⇒ <M>{t`\lambda = 1, 3`}</M>, reais como previsto.</p>
          <p><M>{t`U = \tfrac{1}{\sqrt2}\begin{bmatrix}1&i\\i&1\end{bmatrix}`}</M>: <M>{t`U^*U = \tfrac12\begin{bmatrix}1&-i\\-i&1\end{bmatrix}\begin{bmatrix}1&i\\i&1\end{bmatrix} = I`}</M> ✔</p>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>A 2.ª coluna tem de ser unitária e ortogonal a <M>{t`(0.6, 0.8)`}</M>: <M>{t`(a,b) = \pm(-0.8, 0.6)`}</M>.</p>}><p>Completa <M>{t`\begin{bmatrix}0.6&a\\0.8&b\end{bmatrix}`}</M> de forma a ser ortogonal.</p></Exercise>
        <Exercise n={2} solution={<p>Não: <M>{t`\|(0,1)\| = 1`}</M> mas <M>{t`\|A(0,1)\| = \|(1,1)\| = \sqrt2`}</M>.</p>}><p><M>{t`\begin{bmatrix}1&1\\0&1\end{bmatrix}`}</M> é ortogonal?</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`\det(Q^TQ) = (\det Q)^2 = \det I = 1`}</M>.</p>}><p>Mostra que <M>{t`\det Q = \pm1`}</M> se Q é ortogonal.</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>"Colunas ortogonais ⇒ matriz ortogonal": falta a norma 1. <M>{t`\operatorname{diag}(2,2)`}</M> tem colunas ortogonais e não é ortogonal.</p></Pitfall>
        <Pitfall><p>Em <M>{t`\mathbb{C}`}</M>, usar <M>{t`U^T`}</M> em vez de <M>{t`U^* = \overline{U}^T`}</M>.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Verifico QᵀQ = I e U*U = I", "Sei que preservam normas e ângulos", "Sei que hermitianas têm valores próprios reais", "Distingo rotação de reflexão pelo determinante"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 20. Decomposição em valores singulares ───────────────────────── */
export function SVD() {
  return (
    <>
      <Section title="Em resumo">
        <Thm title="Decomposição em valores singulares">
          <p>Toda a matriz A (m×n) se escreve como <M>{t`A = U\Sigma V^T`}</M>, com U (m×m) e V (n×n) ortogonais e Σ "diagonal" m×n com <M>{t`\sigma_1\geq\sigma_2\geq\cdots\geq0`}</M>.</p>
          <ul className="list-disc pl-6">
            <li><M>{t`\sigma_i = \sqrt{\lambda_i(A^TA)}`}</M> são os <b>valores singulares</b>;</li>
            <li>as colunas de V são vetores próprios ortonormados de <M>{t`A^TA`}</M>;</li>
            <li><M>{t`u_i = \frac{1}{\sigma_i}Av_i`}</M> para <M>{t`\sigma_i\neq0`}</M> (completa-se U a base ortonormada);</li>
            <li><M>{t`\operatorname{car}(A)`}</M> = número de valores singulares não nulos.</li>
          </ul>
        </Thm>
        <p>Geometria: qualquer transformação linear é <b>rodar (Vᵀ) → esticar nos eixos (Σ) → rodar (U)</b>. A esfera unitária vai para um elipsoide de semieixos <M>{t`\sigma_i`}</M>.</p>
      </Section>
      <Section title="Ver as três etapas">
        <SVDLab />
      </Section>
      <Section title="Exemplo resolvido">
        <Example>
          <p><M>{t`A = \begin{bmatrix}3&0\\4&5\end{bmatrix}`}</M>: <M>{t`A^TA = \begin{bmatrix}25&20\\20&25\end{bmatrix}`}</M>, com valores próprios 45 e 5.</p>
          <ul className="list-disc pl-6">
            <li><M>{t`\sigma_1 = \sqrt{45} = 3\sqrt5`}</M>, <M>{t`v_1 = \tfrac{1}{\sqrt2}(1,1)`}</M>, <M>{t`u_1 = \tfrac{1}{\sigma_1}Av_1 = \tfrac{1}{\sqrt{10}}(1,3)`}</M>;</li>
            <li><M>{t`\sigma_2 = \sqrt5`}</M>, <M>{t`v_2 = \tfrac{1}{\sqrt2}(1,-1)`}</M>, <M>{t`u_2 = \tfrac{1}{\sigma_2}Av_2 = \tfrac{1}{\sqrt{10}}(3,-1)`}</M>.</li>
          </ul>
          <p>Verificação: <M>{t`\langle u_1,u_2\rangle = 0`}</M> e <M>{t`\sigma_1\sigma_2 = 15 = |\det A|`}</M> ✔</p>
        </Example>
        <Note><p><b>Aplicação</b>: truncar a soma <M>{t`A = \sum\sigma_iu_iv_i^T`}</M> nos primeiros k termos dá a melhor aproximação de característica k (teorema de Eckart-Young). É a base da compressão de imagens e da análise de componentes principais (PCA).</p></Note>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p><M>{t`A^TA = \operatorname{diag}(9, 4)`}</M> ⇒ <M>{t`\sigma = 3, 2`}</M>.</p>}><p>Valores singulares de <M>{t`\operatorname{diag}(3,-2)`}</M>?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`A^TA = \begin{bmatrix}2&2\\2&2\end{bmatrix}`}</M>, valores próprios 4 e 0 ⇒ <M>{t`\sigma = 2, 0`}</M>, car 1. <M>{t`A = 2\,u_1v_1^T`}</M> com <M>{t`u_1 = v_1 = \tfrac{1}{\sqrt2}(1,1)`}</M>.</p>}><p>SVD de <M>{t`\begin{bmatrix}1&1\\1&1\end{bmatrix}`}</M>?</p></Exercise>
        <Exercise n={3} solution={<p>Para A simétrica, <M>{t`A^TA = A^2`}</M> tem valores próprios <M>{t`\lambda_i^2`}</M>, logo <M>{t`\sigma_i = |\lambda_i|`}</M>.</p>}><p>Qual a relação entre valores singulares e valores próprios de uma matriz simétrica?</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Usar os valores próprios de A como valores singulares. Só coincidem (em módulo) se A for simétrica.</p></Pitfall>
        <Pitfall><p>Calcular U e V independentemente (vetores próprios de <M>{t`AA^T`}</M> e <M>{t`A^TA`}</M>) sem acertar os sinais. Usa <M>{t`u_i = Av_i/\sigma_i`}</M>.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Calculo σᵢ a partir de AᵀA", "Construo V e U = AV/σ", "Interpreto geometricamente (rodar · esticar · rodar)", "Leio a característica pelos σ não nulos"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 21. Formas quadráticas ───────────────────────── */
export function FormasQuadraticas() {
  return (
    <>
      <Section title="Em resumo">
        <p>Uma <b>forma quadrática</b> em <M>{t`\mathbb{R}^n`}</M> é <M>{t`Q(x) = x^TAx`}</M> com A simétrica. Em 2D: <M>{t`ax^2 + 2bxy + cy^2 = \begin{bmatrix}x&y\end{bmatrix}\begin{bmatrix}a&b\\b&c\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}`}</M>.</p>
        <Thm title="Classificação pelos valores próprios">
          <ul className="list-disc pl-6">
            <li><b>definida positiva</b> ⇔ todos <M>{t`\lambda_i > 0`}</M> (<M>{t`Q(x) > 0`}</M> para <M>{t`x\neq0`}</M>);</li>
            <li><b>semidefinida positiva</b> ⇔ todos <M>{t`\lambda_i \geq 0`}</M>;</li>
            <li><b>definida / semidefinida negativa</b> ⇔ todos <M>{t`\lambda_i < 0`}</M> / <M>{t`\leq 0`}</M>;</li>
            <li><b>indefinida</b> ⇔ há valores próprios positivos e negativos.</li>
          </ul>
          <p>Porquê: pelo teorema espetral, com <M>{t`x = Qy`}</M> fica <M>{t`Q(x) = \lambda_1y_1^2 + \cdots + \lambda_ny_n^2`}</M>, sem termos cruzados.</p>
        </Thm>
        <Thm title="Critério dos menores principais (Sylvester)">
          <p>Sejam <M>{t`\Delta_k`}</M> os determinantes das submatrizes k×k do canto superior esquerdo. A é <b>definida positiva</b> ⇔ <M>{t`\Delta_1,\Delta_2,\dots,\Delta_n > 0`}</M>. É <b>definida negativa</b> ⇔ os sinais alternam começando em negativo (<M>{t`\Delta_1 < 0,\ \Delta_2 > 0,\ \Delta_3 < 0,\dots`}</M>).</p>
        </Thm>
      </Section>
      <Section title="Ver as curvas de nível">
        <QuadraticFormLab />
      </Section>
      <Section title="Exemplos resolvidos">
        <Example title="3 variáveis pelo critério dos menores">
          <p><M>{t`Q = 2x^2 + 2y^2 + 2z^2 + 2xy + 2yz`}</M> ⇒ <M>{t`A = \begin{bmatrix}2&1&0\\1&2&1\\0&1&2\end{bmatrix}`}</M>.</p>
          <p><M>{t`\Delta_1 = 2,\ \Delta_2 = 4 - 1 = 3,\ \Delta_3 = \det A = 4`}</M>, todos positivos ⇒ <b>definida positiva</b>. (Os valores próprios são <M>{t`2`}</M> e <M>{t`2\pm\sqrt2`}</M>, todos positivos ✔)</p>
        </Example>
        <Example title="Eliminar o termo cruzado">
          <p><M>{t`Q = x^2 + 4xy + y^2`}</M>, <M>{t`A = \begin{bmatrix}1&2\\2&1\end{bmatrix}`}</M>, valores próprios 3 e −1 ⇒ <b>indefinida</b>. Nos eixos <M>{t`\tfrac{1}{\sqrt2}(1,1)`}</M> e <M>{t`\tfrac{1}{\sqrt2}(1,-1)`}</M>: <M>{t`Q = 3s^2 - t^2`}</M>, e <M>{t`Q = 1`}</M> é uma hipérbole.</p>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p><M>{t`A = \begin{bmatrix}-1&1\\1&-2\end{bmatrix}`}</M>: <M>{t`\Delta_1 = -1 < 0`}</M>, <M>{t`\Delta_2 = 2 - 1 = 1 > 0`}</M> ⇒ definida negativa.</p>}><p>Classifica <M>{t`Q = -x^2 - 2y^2 + 2xy`}</M>.</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`Q = (x+y)^2 \geq 0`}</M> e anula-se em <M>{t`(1,-1)`}</M> ⇒ semidefinida positiva (valores próprios 2 e 0).</p>}><p>Classifica <M>{t`Q = x^2 + 2xy + y^2`}</M>.</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`A = \begin{bmatrix}1&k\\k&4\end{bmatrix}`}</M>: <M>{t`\Delta_1 = 1 > 0`}</M> e <M>{t`\Delta_2 = 4 - k^2 > 0 \Leftrightarrow |k| < 2`}</M>.</p>}><p>Para que <M>k</M> é <M>{t`x^2 + 2kxy + 4y^2`}</M> definida positiva?</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Pôr o coeficiente do termo cruzado inteiro na matriz. Em <M>{t`ax^2 + \mathbf{2b}xy + cy^2`}</M> a entrada fora da diagonal é <b>b</b> (metade do coeficiente de xy).</p></Pitfall>
        <Pitfall><p>Usar o critério de Sylvester para semidefinidas: com algum <M>{t`\Delta_k = 0`}</M> o critério dos menores do canto não decide. Usa os valores próprios.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Escrevo a matriz simétrica de uma forma quadrática", "Classifico por valores próprios", "Classifico pelo critério dos menores", "Elimino termos cruzados com uma mudança de variáveis ortogonal"]} />
      </Section>
    </>
  );
}
