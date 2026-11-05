"use client";
import { M, MD } from "../ui/Tex";
import { Section, Def, Thm, Note, Pitfall, Tip, Example, Exercise, Checklist } from "../ui/blocks";
import { GaussLab } from "../widgets/GaussLab";
import { TransformLab, KernelImageLab } from "../widgets/TransformLab";
import { SubspaceLab, SpanLab, SolutionSpaceLab } from "../widgets/SpaceLabs";

const t = String.raw;

/* ───────────────────────── 6. Espaços vetoriais ───────────────────────── */
export function EspacosVetoriais() {
  return (
    <>
      <Section title="Em resumo">
        <p>
          Um <b>espaço vetorial</b> sobre <M>{t`\mathbb{K}`}</M> (<M>{t`\mathbb{R}`}</M> ou <M>{t`\mathbb{C}`}</M>) é um conjunto <M>V</M> onde se sabe <b>somar</b> elementos e <b>multiplicá-los por escalares</b>, com as regras habituais
          (comutatividade e associatividade da soma, existência de <M>{t`\vec 0`}</M> e de simétricos, distributividade, <M>{t`1\cdot u = u`}</M>). Os elementos chamam-se vetores, mesmo que sejam polinómios ou funções.
        </p>
        <ul className="list-disc pl-6">
          <li><M>{t`\mathbb{R}^n`}</M>; <M>{t`\mathcal{M}_{m\times n}(\mathbb{R})`}</M>;</li>
          <li><M>{t`\mathcal{P}_n`}</M>, polinómios de grau ≤ n; </li>
          <li>funções <M>{t`f:\mathbb{R}\to\mathbb{R}`}</M> (ou só as contínuas, ou só as diferenciáveis…).</li>
        </ul>
      </Section>
      <Section title="Subespaços">
        <Thm title="Critério de subespaço">
          <p>Um subconjunto <M>{t`W \subseteq V`}</M> é <b>subespaço</b> se e só se:</p>
          <ol className="list-decimal pl-6">
            <li><M>{t`\vec 0 \in W`}</M> (equivalentemente, <M>{t`W\neq\emptyset`}</M>);</li>
            <li><M>{t`u, v \in W \Rightarrow u + v \in W`}</M> (fechado para a soma);</li>
            <li><M>{t`u\in W,\ \alpha\in\mathbb{K} \Rightarrow \alpha u \in W`}</M> (fechado para a multiplicação por escalar).</li>
          </ol>
        </Thm>
        <SubspaceLab />
        <Note>
          <p>Os subespaços de <M>{t`\mathbb{R}^2`}</M> são: <M>{t`\{\vec0\}`}</M>, as retas que passam na origem e o próprio <M>{t`\mathbb{R}^2`}</M>. Em <M>{t`\mathbb{R}^3`}</M> juntam-se os planos que passam na origem.</p>
          <p>O conjunto de soluções de um sistema <b>homogéneo</b> <M>{t`Ax = 0`}</M> é sempre um subespaço: é o <b>núcleo</b> <M>{t`N(A)`}</M>.</p>
        </Note>
        <Thm title="Operações com subespaços">
          <p>A <b>interseção</b> <M>{t`W_1\cap W_2`}</M> e a <b>soma</b> <M>{t`W_1 + W_2 = \{w_1 + w_2\}`}</M> são subespaços. A <b>união</b> em geral <b>não</b> é (os dois eixos de <M>{t`\mathbb{R}^2`}</M>: experimenta no laboratório acima).</p>
        </Thm>
      </Section>
      <Section title="Exemplos resolvidos">
        <Example title="Um subespaço de polinómios">
          <p><M>{t`W = \{p \in \mathcal{P}_2 : p(1) = 0\}`}</M>. O polinómio nulo está em W; se <M>{t`p(1) = q(1) = 0`}</M> então <M>{t`(p+q)(1) = 0`}</M> e <M>{t`(\alpha p)(1) = \alpha\cdot 0 = 0`}</M>. É subespaço.</p>
        </Example>
        <Example title="Um que não é">
          <p><M>{t`\{A \in \mathcal{M}_{2\times2} : \det A = 0\}`}</M> não é subespaço: <M>{t`\begin{bmatrix}1&0\\0&0\end{bmatrix}`}</M> e <M>{t`\begin{bmatrix}0&0\\0&1\end{bmatrix}`}</M> têm determinante 0, mas a soma é <M>{t`I`}</M>, com determinante 1.</p>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>Sim: é o núcleo da matriz <M>{t`[1\ \ 1\ \ {-1}]`}</M>, isto é, as soluções de uma equação homogénea. (É um plano pela origem.)</p>}><p><M>{t`\{(x,y,z) \in\mathbb{R}^3 : x + y = z\}`}</M> é subespaço?</p></Exercise>
        <Exercise n={2} solution={<p>Não: <M>{t`(1,0)`}</M> está no conjunto, mas <M>{t`(-1)(1,0) = (-1,0)`}</M> não.</p>}><p><M>{t`\{(x,y) : x \geq 0\}`}</M> é subespaço de <M>{t`\mathbb{R}^2`}</M>?</p></Exercise>
        <Exercise n={3} solution={<p>Sim: a matriz nula é simétrica, e se <M>{t`A^T = A`}</M> e <M>{t`B^T = B`}</M> então <M>{t`(A+B)^T = A+B`}</M> e <M>{t`(\alpha A)^T = \alpha A`}</M>.</p>}><p>As matrizes simétricas 2×2 formam um subespaço de <M>{t`\mathcal{M}_{2\times2}`}</M>?</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p><b>Verificar só o fecho para a soma.</b> As três condições são necessárias (o semiplano é fechado para a soma e não é subespaço).</p></Pitfall>
        <Pitfall><p><b>Esquecer o vetor nulo.</b> É o teste mais rápido: se <M>{t`\vec0\notin W`}</M>, acabou.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Conheço os exemplos principais de espaços vetoriais", "Aplico o critério de subespaço (3 condições)", "Sei dar contra-exemplos para cada condição", "Sei que N(A) é subespaço e a união em geral não é"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 7. Conjuntos linearmente independentes ───────────────────────── */
export function IndependenciaLinear() {
  return (
    <>
      <Section title="Em resumo">
        <Def title="Combinação linear e expansão linear">
          <p><M>{t`w = c_1v_1 + \cdots + c_kv_k`}</M> é uma <b>combinação linear</b> de <M>{t`v_1,\dots,v_k`}</M>. O conjunto de todas as combinações lineares é a <b>expansão linear</b> <M>{t`\mathcal{L}\{v_1,\dots,v_k\}`}</M>, que é sempre um subespaço. Se <M>{t`\mathcal{L}\{v_1,\dots,v_k\} = V`}</M>, o conjunto <b>gera</b> V.</p>
        </Def>
        <Def title="Independência linear">
          <p><M>{t`\{v_1,\dots,v_k\}`}</M> é <b>linearmente independente</b> se <M>{t`c_1v_1+\cdots+c_kv_k = \vec 0 \Rightarrow c_1 = \cdots = c_k = 0`}</M>. Caso contrário é <b>dependente</b>: algum dos vetores é combinação linear dos outros.</p>
        </Def>
        <Def title="Base, dimensão e coordenadas">
          <p>Uma <b>base</b> é um conjunto independente que gera V. Todas as bases têm o mesmo número de vetores: a <b>dimensão</b> de V. Numa base <M>{t`B = (v_1,\dots,v_n)`}</M>, cada <M>u</M> escreve-se de forma <b>única</b> como <M>{t`u = c_1v_1+\cdots+c_nv_n`}</M>; <M>{t`(u)_B = (c_1,\dots,c_n)`}</M> são as suas <b>coordenadas</b>.</p>
        </Def>
      </Section>
      <Section title="Ver no plano">
        <SpanLab />
      </Section>
      <Section title="Como testar em ℝⁿ">
        <Thm>
          <p>Põe os vetores como <b>colunas</b> de uma matriz <M>{t`A = [v_1\ \cdots\ v_k]`}</M> e faz a escada.</p>
          <ul className="list-disc pl-6">
            <li>São <b>independentes</b> ⇔ todas as colunas têm pivô ⇔ <M>{t`N(A) = \{\vec 0\}`}</M>.</li>
            <li><b>Geram</b> <M>{t`\mathbb{R}^n`}</M> ⇔ todas as linhas têm pivô (<M>{t`\operatorname{car} A = n`}</M>).</li>
            <li>Com <M>{t`k = n`}</M> vetores: independentes ⇔ geram ⇔ base ⇔ <M>{t`\det A\neq 0`}</M>.</li>
            <li>Mais de <M>n</M> vetores em <M>{t`\mathbb{R}^n`}</M> são sempre dependentes; menos de <M>n</M> nunca geram.</li>
          </ul>
        </Thm>
        <GaussLab
          title="Que relação de dependência existe?"
          hint="Os vetores estão nas colunas. Cada vetor do núcleo dá os coeficientes de uma combinação linear nula das colunas."
          mode="kernel"
          initial={[[1, 0, 2], [2, 1, 5], [1, 1, 3]]}
          presets={[
            { label: "Exemplo resolvido", value: [[1, 0, 2], [2, 1, 5], [1, 1, 3]] },
            { label: "Independentes", value: [[1, 0, 1], [1, 1, 0], [0, 1, 1]] },
            { label: "4 vetores em ℝ³", value: [[1, 0, 2, 3], [2, 0, 4, 6], [1, 1, 5, 0]] },
          ]}
        />
        <Example title="Dependência e expansão linear">
          <p><M>{t`v_1 = (1,2,1),\ v_2 = (0,1,1),\ v_3 = (2,5,3)`}</M>:</p>
          <MD>{t`\begin{bmatrix}1&0&2\\2&1&5\\1&1&3\end{bmatrix} \xrightarrow[L_3 - L_1]{L_2 - 2L_1} \begin{bmatrix}1&0&2\\0&1&1\\0&1&1\end{bmatrix} \xrightarrow{L_3 - L_2} \begin{bmatrix}1&0&2\\0&1&1\\0&0&0\end{bmatrix}`}</MD>
          <p>A coluna 3 não tem pivô: são <b>dependentes</b>. Pela escada reduzida, <M>{t`v_3 = 2v_1 + v_2`}</M> (confirma: <M>{t`(2,4,2) + (0,1,1) = (2,5,3)`}</M>).</p>
          <p>Logo <M>{t`\mathcal{L}\{v_1,v_2,v_3\} = \mathcal{L}\{v_1,v_2\}`}</M>, um plano. A equação obtém-se pedindo que <M>{t`(x,y,z)`}</M> seja combinação de <M>{t`v_1, v_2`}</M>: <M>{t`x - y + z = 0`}</M>.</p>
        </Example>
        <Example title="Coordenadas numa base">
          <p>Em <M>{t`B = ((1,1),(1,-1))`}</M>, o vetor <M>{t`u = (3,1)`}</M> tem <M>{t`(u)_B = (2,1)`}</M>, porque <M>{t`2(1,1) + 1(1,-1) = (3,1)`}</M>.</p>
        </Example>
      </Section>
      <Section title="Mudança de base">
        <p>Se <M>{t`B_1`}</M> e <M>{t`B_2`}</M> são bases de V, a matriz <M>{t`S_{B_1\to B_2}`}</M> tem como <b>colunas</b> as coordenadas dos vetores de <M>{t`B_1`}</M> na base <M>{t`B_2`}</M>, e</p>
        <MD>{t`(u)_{B_2} = S_{B_1\to B_2}\,(u)_{B_1},\qquad S_{B_2\to B_1} = S_{B_1\to B_2}^{-1}`}</MD>
        <Tip><p>Para a base canónica <M>{t`\mathcal{E}`}</M> é fácil: <M>{t`S_{B\to\mathcal{E}}`}</M> tem os vetores de B nas colunas. Depois <M>{t`S_{\mathcal{E}\to B} = (S_{B\to\mathcal{E}})^{-1}`}</M>.</p></Tip>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>Dependentes: <M>{t`(2,4) = 2(1,2)`}</M>. Geram só a reta <M>{t`\mathcal{L}\{(1,2)\}`}</M>.</p>}><p><M>{t`\{(1,2),(2,4)\}`}</M> é independente? O que gera?</p></Exercise>
        <Exercise n={2} solution={<p>Sim (3 polinómios independentes em <M>{t`\mathcal{P}_2`}</M>, de dimensão 3). De <M>{t`a(1+x) + b(1-x) + cx^2 = 3 + x + 2x^2`}</M>: <M>{t`a + b = 3,\ a - b = 1,\ c = 2`}</M>, logo <M>{t`(p)_B = (2,1,2)`}</M>.</p>}><p><M>{t`B = (1+x,\ 1-x,\ x^2)`}</M> é base de <M>{t`\mathcal{P}_2`}</M>? Quais as coordenadas de <M>{t`p = 3 + x + 2x^2`}</M>?</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`\det\begin{bmatrix}1&k\\k&4\end{bmatrix} = 4 - k^2 \neq 0 \Leftrightarrow k\neq\pm2`}</M>.</p>}><p>Para que <M>k</M> são <M>{t`(1,k)`}</M> e <M>{t`(k,4)`}</M> linearmente independentes?</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p><b>"Dependentes ⇒ cada vetor é combinação dos outros."</b> Só garante que <b>pelo menos um</b> é. Em <M>{t`\{(1,0),(2,0),(0,1)\}`}</M>, o vetor <M>{t`(0,1)`}</M> não é combinação dos outros.</p></Pitfall>
        <Pitfall><p><b>Usar a escada para ler a base de <M>{t`\mathcal{L}\{\dots\}`}</M> nas colunas da escada.</b> As colunas com pivô dizem <b>quais dos vetores originais</b> escolher.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Testo independência pela escada (pivô em todas as colunas)", "Encontro a equação cartesiana de 𝓛{v₁, v₂} em ℝ³", "Calculo coordenadas numa base", "Construo e uso S_{B₁→B₂}"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 8. Transformações lineares ───────────────────────── */
export function TransformacoesLineares() {
  return (
    <>
      <Section title="Em resumo">
        <Def>
          <p><M>{t`T: U\to V`}</M> é <b>linear</b> se <M>{t`T(u+v) = T(u)+T(v)`}</M> e <M>{t`T(\alpha u) = \alpha T(u)`}</M> para todos os <M>{t`u,v,\alpha`}</M>. Consequência imediata: <M>{t`T(\vec 0) = \vec 0`}</M>.</p>
        </Def>
        <p>Entre espaços de dimensão finita, toda a transformação linear é uma matriz disfarçada: fixando bases, <M>{t`T(u)`}</M> calcula-se como <M>{t`A\,(u)_B`}</M>.</p>
        <Thm title="Matriz de T nas bases canónicas">
          <p>Para <M>{t`T:\mathbb{R}^n\to\mathbb{R}^m`}</M>, a matriz é <M>{t`A = [\,T(e_1)\ \ T(e_2)\ \cdots\ T(e_n)\,]`}</M> (m×n): as <b>colunas</b> são as imagens da base.</p>
          <p>Em bases quaisquer <M>{t`B`}</M> de U e <M>{t`B'`}</M> de V, a coluna <M>j</M> de <M>{t`M(T;B,B')`}</M> é <M>{t`(T(b_j))_{B'}`}</M>.</p>
        </Thm>
      </Section>
      <Section title="Brincar com uma transformação">
        <TransformLab initial={[[0, -1], [1, 0]]} />
        <Note><p>A composição <M>{t`S\circ T`}</M> tem matriz <M>{t`M(S)M(T)`}</M>; T é invertível se e só se a matriz for invertível, e <M>{t`M(T^{-1}) = M(T)^{-1}`}</M>. Mudar de base: <M>{t`A' = S^{-1}AS`}</M> (matrizes <b>semelhantes</b> representam a mesma transformação).</p></Note>
      </Section>
      <Section title="Exemplos resolvidos">
        <Example title="Matriz a partir da fórmula">
          <p><M>{t`T(x,y) = (x + 2y,\ 3x,\ x - y)`}</M>: <M>{t`T(e_1) = (1,3,1)`}</M>, <M>{t`T(e_2) = (2,0,-1)`}</M>, logo <M>{t`A = \begin{bmatrix}1&2\\3&0\\1&-1\end{bmatrix}`}</M>.</p>
        </Example>
        <Example title="A derivada é linear">
          <p><M>{t`D:\mathcal{P}_2\to\mathcal{P}_1,\ D(p) = p'`}</M>, nas bases <M>{t`(1,x,x^2)`}</M> e <M>{t`(1,x)`}</M>: <M>{t`D(1) = 0,\ D(x) = 1,\ D(x^2) = 2x`}</M>, logo <M>{t`M(D) = \begin{bmatrix}0&1&0\\0&0&2\end{bmatrix}`}</M>.</p>
        </Example>
        <Example title="Conhecida em duas imagens">
          <p>Se <M>{t`T(1,1) = (3,1)`}</M> e <M>{t`T(1,-1) = (1,3)`}</M>: escreve <M>{t`(x,y) = \tfrac{x+y}2(1,1) + \tfrac{x-y}2(1,-1)`}</M> e usa a linearidade:</p>
          <MD>{t`T(x,y) = \tfrac{x+y}{2}(3,1) + \tfrac{x-y}{2}(1,3) = (2x + y,\ 2x - y)`}</MD>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>Rotação de 90°: <M>{t`\begin{bmatrix}0&-1\\1&0\end{bmatrix}`}</M>. Reflexão em <M>{t`y = x`}</M> (troca as coordenadas): <M>{t`\begin{bmatrix}0&1\\1&0\end{bmatrix}`}</M>.</p>}><p>Escreve as matrizes da rotação de 90° (sentido direto) e da reflexão na reta <M>{t`y=x`}</M>.</p></Exercise>
        <Exercise n={2} solution={<p>(a) Não: <M>{t`T(0,0) = (1,0)\neq\vec0`}</M>. (b) Não: <M>{t`T(-(1,0)) = (1,0)`}</M>, mas <M>{t`-T(1,0) = (-1,0)`}</M>. (c) Sim: é <M>{t`\begin{bmatrix}0&1\\1&-1\end{bmatrix}`}</M>.</p>}><p>São lineares? (a) <M>{t`T(x,y) = (x+1, y)`}</M> (b) <M>{t`T(x,y) = (|x|, y)`}</M> (c) <M>{t`T(x,y) = (y, x - y)`}</M></p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Pôr as imagens <M>{t`T(e_j)`}</M> nas <b>linhas</b> da matriz em vez das <b>colunas</b>.</p></Pitfall>
        <Tip><p>Para mostrar que T <b>não</b> é linear, começa por <M>{t`T(\vec0)`}</M>; se for 0, procura um contra-exemplo numérico concreto.</p></Tip>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Verifico linearidade (ou dou contra-exemplo)", "Escrevo a matriz de T nas bases canónicas", "Escrevo a matriz de T noutras bases", "Sei que composição ↔ produto de matrizes"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 9. Núcleo e imagem ───────────────────────── */
export function NucleoImagem() {
  return (
    <>
      <Section title="Em resumo">
        <Def>
          <p>Para <M>{t`T: U \to V`}</M> linear: <b>núcleo</b> <M>{t`N(T) = \{u : T(u) = \vec 0\}`}</M> e <b>imagem</b> <M>{t`I(T) = \{T(u) : u\in U\}`}</M>. Ambos são subespaços.</p>
          <p>Para uma matriz A (m×n): <M>{t`N(A) = \{x : Ax = 0\}\subseteq\mathbb{R}^n`}</M>, <b>espaço das colunas</b> <M>{t`C(A)\subseteq\mathbb{R}^m`}</M> (= imagem) e <b>espaço das linhas</b> <M>{t`L(A)\subseteq\mathbb{R}^n`}</M>.</p>
        </Def>
        <Thm title="Teorema das dimensões">
          <MD>{t`\dim N(A) + \dim C(A) = n \qquad\big(\operatorname{nul}(A) + \operatorname{car}(A) = \text{n.º de colunas}\big)`}</MD>
          <p>Além disso <M>{t`\dim C(A) = \dim L(A) = \operatorname{car}(A)`}</M>. T é <b>injetiva</b> ⇔ <M>{t`N(T) = \{\vec 0\}`}</M>; é <b>sobrejetiva</b> ⇔ <M>{t`\operatorname{car} = \dim V`}</M>.</p>
        </Thm>
      </Section>
      <Section title="Ver no plano">
        <KernelImageLab />
      </Section>
      <Section title="Receita para calcular">
        <ol className="list-decimal space-y-1 pl-6">
          <li>Faz a escada (de preferência a reduzida) de A.</li>
          <li><b>N(A)</b>: resolve <M>{t`Ax = 0`}</M>; cada incógnita livre dá um vetor da base.</li>
          <li><b>C(A)</b>: as colunas de <b>A original</b> que correspondem às colunas com pivô formam uma base.</li>
          <li><b>L(A)</b>: as linhas não nulas da escada formam uma base.</li>
        </ol>
        <GaussLab
          title="Núcleo de uma matriz"
          mode="kernel"
          initial={[[1, 2, 0, 1], [2, 4, 1, 4], [3, 6, 1, 5]]}
          presets={[
            { label: "Exemplo 3×4", value: [[1, 2, 0, 1], [2, 4, 1, 4], [3, 6, 1, 5]] },
            { label: "3×3, nul = 1", value: [[-2, 0, 1], [1, 1, 0], [-1, 1, 1]] },
            { label: "Invertível", value: [[1, 2], [3, 4]] },
          ]}
        />
        <Example title="As quatro respostas de uma vez">
          <MD>{t`A = \begin{bmatrix}1&2&0&1\\2&4&1&4\\3&6&1&5\end{bmatrix} \longrightarrow \begin{bmatrix}1&2&0&1\\0&0&1&2\\0&0&0&0\end{bmatrix}`}</MD>
          <ul className="list-disc pl-6">
            <li>Pivôs nas colunas 1 e 3 ⇒ <M>{t`\operatorname{car}(A) = 2`}</M>, <M>{t`\operatorname{nul}(A) = 4 - 2 = 2`}</M>.</li>
            <li><M>{t`x_1 = -2x_2 - x_4,\ x_3 = -2x_4`}</M> ⇒ <M>{t`N(A) = \mathcal{L}\{(-2,1,0,0),\ (-1,0,-2,1)\}`}</M>.</li>
            <li><M>{t`C(A) = \mathcal{L}\{(1,2,3),\ (0,1,1)\}`}</M> — colunas 1 e 3 <b>de A</b>.</li>
            <li><M>{t`L(A) = \mathcal{L}\{(1,2,0,1),\ (0,0,1,2)\}`}</M>.</li>
          </ul>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>A matriz é <M>{t`\begin{bmatrix}1&1&0\\0&1&1\end{bmatrix}`}</M>. <M>{t`N(T) = \mathcal{L}\{(1,-1,1)\}`}</M> (dimensão 1), logo car = 2: T é sobrejetiva (<M>{t`I(T) = \mathbb{R}^2`}</M>) mas não injetiva.</p>}><p><M>{t`T:\mathbb{R}^3\to\mathbb{R}^2,\ T(x,y,z) = (x+y,\ y+z)`}</M>. Calcula N(T) e I(T). T é injetiva? Sobrejetiva?</p></Exercise>
        <Exercise n={2} solution={<p>Não: <M>{t`\dim I(T) = \operatorname{car} \leq 2 < 3`}</M>.</p>}><p>Pode uma transformação linear <M>{t`\mathbb{R}^2\to\mathbb{R}^3`}</M> ser sobrejetiva?</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`\operatorname{nul}(A) = 7 - 3 = 4`}</M>; <M>{t`\dim C(A) = \dim L(A) = 3`}</M>.</p>}><p>A é 5×7 com <M>{t`\operatorname{car}(A) = 3`}</M>. Quais as dimensões de N(A), C(A) e L(A)?</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p><b>Usar as colunas da escada como base de C(A).</b> As operações sobre linhas mudam o espaço das colunas! Usa as colunas de A original nas posições dos pivôs.</p></Pitfall>
        <Pitfall><p>Confundir onde vivem os espaços: <M>{t`N(A), L(A)\subseteq\mathbb{R}^n`}</M>, mas <M>{t`C(A)\subseteq\mathbb{R}^m`}</M>.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Calculo bases de N(A), C(A) e L(A)", "Aplico car + nul = n.º de colunas", "Decido injetividade e sobrejetividade", "Não uso colunas da escada para C(A)"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 10. Espaço de soluções de uma equação linear ───────────────────────── */
export function EspacoSolucoes() {
  return (
    <>
      <Section title="Em resumo">
        <Thm title="Estrutura das soluções">
          <p>Seja <M>{t`T`}</M> linear (p.ex. <M>{t`T(x) = Ax`}</M>) e <M>{t`x_p`}</M> <b>uma</b> solução particular de <M>{t`T(x) = b`}</M>. Então o conjunto de <b>todas</b> as soluções é</p>
          <MD>{t`\{x : T(x) = b\} = x_p + N(T) = \{x_p + u : u\in N(T)\}`}</MD>
          <p>Porque: se <M>{t`T(x) = b`}</M>, então <M>{t`T(x - x_p) = b - b = 0`}</M>, ou seja <M>{t`x - x_p\in N(T)`}</M>.</p>
        </Thm>
        <p>Geometricamente: as soluções de <M>{t`Ax = b`}</M> são o núcleo <b>deslocado</b> por <M>{t`x_p`}</M>. Só formam subespaço se <M>{t`b = 0`}</M>.</p>
      </Section>
      <Section title="Ver no plano">
        <SolutionSpaceLab />
      </Section>
      <Section title="Exemplos resolvidos">
        <Example title="Sistema">
          <p><M>{t`x + y + z = 3,\ x - y + z = 1`}</M>. Com <M>{t`L_2 - L_1`}</M>: <M>{t`-2y = -2`}</M>, logo <M>{t`y = 1`}</M> e <M>{t`x = 2 - z`}</M>.</p>
          <MD>{t`S = \{(2 - s,\ 1,\ s)\} = \underbrace{(2,1,0)}_{x_p} + \underbrace{\mathcal{L}\{(-1,0,1)\}}_{N(A)}`}</MD>
          <p>Confirma: <M>{t`(-1,0,1)`}</M> satisfaz as equações homogéneas (<M>{t`-1+0+1 = 0`}</M> nas duas).</p>
        </Example>
        <Example title="Uma equação diferencial (a mesma ideia!)">
          <p><M>{t`T(y) = y' - 2y`}</M> é linear. Para <M>{t`y' - 2y = 4`}</M>: uma solução particular é a constante <M>{t`y_p = -2`}</M>; o núcleo (<M>{t`y' = 2y`}</M>) é <M>{t`\mathcal{L}\{e^{2t}\}`}</M>. Logo</p>
          <MD>{t`y(t) = -2 + Ce^{2t},\ C\in\mathbb{R}`}</MD>
        </Example>
      </Section>
      <GaussLab
        title="Solução geral de um SPI"
        initial={[[1, 1, 1, 3], [1, -1, 1, 1]]}
        presets={[
          { label: "Exemplo", value: [[1, 1, 1, 3], [1, -1, 1, 1]] },
          { label: "2 livres", value: [[1, 2, -1, 0, 4], [0, 0, 1, 1, 1]] },
        ]}
      />
      <Section title="Exercícios">
        <Exercise n={1} solution={<p><M>{t`S = \{(1,2) + t(1,1) : t\in\mathbb{R}\}`}</M>.</p>}><p>Sabe-se que <M>{t`(1,2)`}</M> é solução de <M>{t`Ax = b`}</M> e que <M>{t`N(A) = \mathcal{L}\{(1,1)\}`}</M>. Quais são todas as soluções?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`A(u - v) = Au - Av = b - b = 0`}</M>.</p>}><p>Mostra que, se <M>u</M> e <M>v</M> são soluções de <M>{t`Ax = b`}</M>, então <M>{t`u - v\in N(A)`}</M>.</p></Exercise>
        <Exercise n={3} solution={<p>Não: não contém o vetor nulo (<M>{t`A\vec0 = \vec0\neq b`}</M>).</p>}><p>Se <M>{t`b\neq0`}</M>, o conjunto de soluções de <M>{t`Ax = b`}</M> pode ser subespaço?</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Escrever <M>{t`S = \mathcal{L}\{x_p, u_1, \dots\}`}</M>: isso inclui múltiplos de <M>{t`x_p`}</M> que <b>não</b> são soluções. O correto é <M>{t`x_p + \mathcal{L}\{u_1,\dots\}`}</M>.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Escrevo solução geral = particular + núcleo", "Sei porque é que só é subespaço se b = 0", "Reconheço a mesma estrutura em equações diferenciais lineares"]} />
      </Section>
    </>
  );
}
