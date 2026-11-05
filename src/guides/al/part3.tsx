"use client";
import { M, MD } from "../ui/Tex";
import { Section, Def, Thm, Note, Pitfall, Tip, Example, Exercise, Checklist } from "../ui/blocks";
import { GaussLab } from "../widgets/GaussLab";
import { EigenLab } from "../widgets/TransformLab";
import { DynamicsLab, MarkovLab, PageRankLab, JordanPowersLab } from "../widgets/AppLabs";
import type { M2 } from "../math/linalg2";

const t = String.raw;

/* ───────────────────────── 11. Valores e vetores próprios ───────────────────────── */
export function ValoresProprios() {
  return (
    <>
      <Section title="Em resumo">
        <Def>
          <p><M>{t`\lambda`}</M> é <b>valor próprio</b> de A (n×n) se existe <M>{t`v \neq \vec 0`}</M> com <M>{t`Av = \lambda v`}</M>; <M>v</M> é um <b>vetor próprio</b> associado. Geometricamente: as direções que A <b>não roda</b>, só estica (ou inverte, ou anula).</p>
        </Def>
        <Thm title="Como calcular">
          <ol className="list-decimal pl-6">
            <li><b>Polinómio característico</b>: <M>{t`p(\lambda) = \det(A - \lambda I)`}</M>. Os valores próprios são as suas raízes.</li>
            <li>Para cada <M>{t`\lambda`}</M>, o <b>espaço próprio</b> é <M>{t`E(\lambda) = N(A - \lambda I)`}</M>; os vetores próprios são os seus elementos não nulos.</li>
          </ol>
          <p>Úteis para verificar: <M>{t`\lambda_1 + \cdots + \lambda_n = \operatorname{tr} A`}</M> e <M>{t`\lambda_1\cdots\lambda_n = \det A`}</M>. Numa matriz triangular, os valores próprios são as entradas da diagonal.</p>
        </Thm>
      </Section>
      <Section title="Encontrar vetores próprios à mão (literalmente)">
        <EigenLab initial={[[4, 1], [2, 3]] as M2} />
      </Section>
      <Section title="Exemplo resolvido">
        <Example>
          <MD>{t`A = \begin{bmatrix}4&1\\2&3\end{bmatrix}:\quad p(\lambda) = (4-\lambda)(3-\lambda) - 2 = \lambda^2 - 7\lambda + 10 = (\lambda - 5)(\lambda - 2)`}</MD>
          <ul className="list-disc pl-6">
            <li><M>{t`\lambda = 5`}</M>: <M>{t`A - 5I = \begin{bmatrix}-1&1\\2&-2\end{bmatrix}`}</M> ⇒ <M>{t`E(5) = \mathcal{L}\{(1,1)\}`}</M>.</li>
            <li><M>{t`\lambda = 2`}</M>: <M>{t`A - 2I = \begin{bmatrix}2&1\\2&1\end{bmatrix}`}</M> ⇒ <M>{t`E(2) = \mathcal{L}\{(1,-2)\}`}</M>.</li>
          </ul>
          <p>Verifica: <M>{t`A(1,-2) = (2,-4) = 2\,(1,-2)`}</M> ✔; <M>{t`5 + 2 = 7 = \operatorname{tr}A`}</M>, <M>{t`5\cdot 2 = 10 = \det A`}</M> ✔</p>
        </Example>
      </Section>
      <Section title="Diagonalização">
        <Thm>
          <p>Se A tem <M>n</M> vetores próprios linearmente independentes <M>{t`v_1,\dots,v_n`}</M>, então</p>
          <MD>{t`A = SDS^{-1},\quad S = [v_1\ \cdots\ v_n],\quad D = \operatorname{diag}(\lambda_1,\dots,\lambda_n)`}</MD>
          <p>e as potências ficam fáceis: <M>{t`A^k = SD^kS^{-1}`}</M>. Valores próprios <b>distintos</b> dão vetores próprios independentes, logo n valores próprios distintos ⇒ diagonalizável.</p>
        </Thm>
        <p>No exemplo: <M>{t`S = \begin{bmatrix}1&1\\1&-2\end{bmatrix}`}</M>, <M>{t`D = \begin{bmatrix}5&0\\0&2\end{bmatrix}`}</M>.</p>
        <GaussLab title="Espaço próprio = núcleo de A − λI" mode="kernel" initial={[[-1, 1], [2, -2]]} presets={[{ label: "A − 5I", value: [[-1, 1], [2, -2]] }, { label: "A − 2I", value: [[2, 1], [2, 1]] }]} />
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>É triangular: <M>{t`\lambda = 1, 4, 6`}</M>.</p>}><p>Valores próprios de <M>{t`\begin{bmatrix}1&2&3\\0&4&5\\0&0&6\end{bmatrix}`}</M>?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`A^2v = A(\lambda v) = \lambda Av = \lambda^2 v`}</M>, com <M>{t`v\neq 0`}</M>.</p>}><p>Mostra que, se <M>{t`\lambda`}</M> é valor próprio de A, então <M>{t`\lambda^2`}</M> é valor próprio de <M>{t`A^2`}</M>.</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`p(\lambda) = \lambda^2 + 1`}</M>: não tem raízes reais (<M>{t`\lambda = \pm i`}</M>). É a rotação de 90°: nenhuma direção real fica fixa.</p>}><p>Valores próprios de <M>{t`\begin{bmatrix}0&-1\\1&0\end{bmatrix}`}</M>? Interpreta.</p></Exercise>
        <Exercise n={4} solution={<p>A não é invertível ⇔ <M>{t`\det A = 0`}</M> ⇔ <M>{t`\det(A - 0I) = 0`}</M> ⇔ 0 é valor próprio.</p>}><p>Mostra que A é invertível se e só se 0 não é valor próprio.</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Aceitar <M>{t`v = \vec 0`}</M> como vetor próprio. Por definição, vetores próprios são não nulos (mas <M>{t`\lambda = 0`}</M> pode ser valor próprio).</p></Pitfall>
        <Pitfall><p>Calcular <M>{t`\det A - \lambda`}</M> em vez de <M>{t`\det(A - \lambda I)`}</M>: o <M>{t`\lambda`}</M> subtrai-se em <b>toda</b> a diagonal antes do determinante.</p></Pitfall>
        <Tip><p>Se <M>{t`A - \lambda I`}</M> não tiver uma linha de zeros depois da escada, enganaste-te no valor próprio (o núcleo tem de ser não trivial).</p></Tip>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Calculo p(λ) e as suas raízes", "Calculo bases dos espaços próprios", "Verifico com traço e determinante", "Diagonalizo e calculo Aᵏ = SDᵏS⁻¹"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 12. Multiplicidade algébrica e geométrica ───────────────────────── */
export function Multiplicidades() {
  return (
    <>
      <Section title="Em resumo">
        <Def>
          <ul className="list-disc pl-6">
            <li><b>Multiplicidade algébrica</b> <M>{t`\operatorname{m.a.}(\lambda)`}</M>: quantas vezes <M>{t`\lambda`}</M> é raiz de <M>{t`p`}</M>.</li>
            <li><b>Multiplicidade geométrica</b> <M>{t`\operatorname{m.g.}(\lambda) = \dim E(\lambda) = n - \operatorname{car}(A - \lambda I)`}</M>.</li>
          </ul>
        </Def>
        <Thm>
          <p>Sempre <M>{t`1 \leq \operatorname{m.g.}(\lambda) \leq \operatorname{m.a.}(\lambda)`}</M>. A matriz é <b>diagonalizável</b> se e só se <M>{t`p`}</M> se decompõe em fatores lineares e <M>{t`\operatorname{m.g.}(\lambda) = \operatorname{m.a.}(\lambda)`}</M> para todos os valores próprios.</p>
        </Thm>
        <p>Intuição: <M>{t`\operatorname{m.a.}`}</M> diz quantos vetores próprios "deviam" existir; <M>{t`\operatorname{m.g.}`}</M> diz quantos (independentes) existem mesmo. Quando faltam, a matriz não se diagonaliza.</p>
      </Section>
      <Section title="Comparar os casos">
        <EigenLab
          initial={[[2, 1], [0, 2]] as M2}
          presets={[
            { label: "m.a. 2, m.g. 1", value: [[2, 1], [0, 2]] as M2 },
            { label: "m.a. 2, m.g. 2", value: [[2, 0], [0, 2]] as M2 },
            { label: "Distintos", value: [[3, 1], [0, 2]] as M2 },
            { label: "Perto de duplo", value: [[2, 1], [0.5, 2]] as M2 },
          ]}
        />
      </Section>
      <Section title="Exemplos resolvidos">
        <Example title="Não diagonalizável">
          <MD>{t`A = \begin{bmatrix}2&1&0\\0&2&0\\0&0&3\end{bmatrix},\quad p(\lambda) = (2 - \lambda)^2(3 - \lambda)`}</MD>
          <p><M>{t`\operatorname{m.a.}(2) = 2`}</M>. Mas <M>{t`A - 2I = \begin{bmatrix}0&1&0\\0&0&0\\0&0&1\end{bmatrix}`}</M> tem característica 2, logo <M>{t`\operatorname{m.g.}(2) = 3 - 2 = 1 < 2`}</M>: <b>não é diagonalizável</b>.</p>
        </Example>
        <Example title="Diagonalizável apesar do valor próprio repetido">
          <MD>{t`B = \begin{bmatrix}3&1&1\\1&3&1\\1&1&3\end{bmatrix}:\quad \lambda = 5\ (\text{m.a. }1),\ \lambda = 2\ (\text{m.a. }2)`}</MD>
          <p><M>{t`B - 2I`}</M> tem as três linhas iguais a <M>{t`(1,1,1)`}</M> ⇒ característica 1 ⇒ <M>{t`\operatorname{m.g.}(2) = 2 = \operatorname{m.a.}(2)`}</M>. <b>É diagonalizável</b>, com <M>{t`E(2) = \{x + y + z = 0\}`}</M> e <M>{t`E(5) = \mathcal{L}\{(1,1,1)\}`}</M>.</p>
          <p>Verificação: <M>{t`5 + 2 + 2 = 9 = \operatorname{tr}B`}</M> e <M>{t`5\cdot2\cdot2 = 20 = \det B`}</M> ✔</p>
        </Example>
        <GaussLab title="m.g. = número de colunas sem pivô de A − λI" mode="kernel" initial={[[0, 1, 0], [0, 0, 0], [0, 0, 1]]} presets={[{ label: "A − 2I (1.º exemplo)", value: [[0, 1, 0], [0, 0, 0], [0, 0, 1]] }, { label: "B − 2I (2.º exemplo)", value: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] }]} />
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p><M>{t`\lambda = 1`}</M> com m.a. 2. <M>{t`A - I = \begin{bmatrix}0&a\\0&0\end{bmatrix}`}</M>: se <M>{t`a\neq0`}</M>, car 1 e m.g. 1 (não diagonalizável); se <M>{t`a = 0`}</M>, A = I já é diagonal. Resposta: só <M>{t`a = 0`}</M>.</p>}><p>Para que valores de <M>a</M> é <M>{t`\begin{bmatrix}1&a\\0&1\end{bmatrix}`}</M> diagonalizável?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`\operatorname{m.g.}(1) = 3 - 1 = 2 < 3 = \operatorname{m.a.}(1)`}</M> ⇒ não diagonalizável.</p>}><p>A é 3×3, <M>{t`p(\lambda) = (1 - \lambda)^3`}</M> e <M>{t`\operatorname{car}(A - I) = 1`}</M>. A é diagonalizável?</p></Exercise>
        <Exercise n={3} solution={<p>Sim: 4 valores próprios distintos dão 4 vetores próprios independentes.</p>}><p>Uma matriz 4×4 com valores próprios 1, 2, 3, 4 é diagonalizável?</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Concluir "valor próprio repetido ⇒ não diagonalizável". O segundo exemplo mostra que não: é preciso calcular a m.g.</p></Pitfall>
        <Pitfall><p>Calcular a m.g. com a matriz A em vez de <M>{t`A - \lambda I`}</M>.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Calculo m.a. a partir de p(λ)", "Calculo m.g. = n − car(A − λI)", "Decido se A é diagonalizável", "Sei que n valores próprios distintos ⇒ diagonalizável"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 13. Forma canónica de Jordan ───────────────────────── */
export function Jordan() {
  return (
    <>
      <Section title="Em resumo">
        <p>Quando A não é diagonalizável, o melhor que se consegue é uma matriz "quase diagonal": a <b>forma canónica de Jordan</b>.</p>
        <Thm title="Teorema de Jordan">
          <p>Se <M>{t`p`}</M> se decompõe em fatores lineares (sempre verdade em <M>{t`\mathbb{C}`}</M>), existe P invertível com <M>{t`A = PJP^{-1}`}</M>, em que J é diagonal por blocos de Jordan:</p>
          <MD>{t`J_k(\lambda) = \begin{bmatrix}\lambda&1&&\\&\lambda&\ddots&\\&&\ddots&1\\&&&\lambda\end{bmatrix}\ (k\times k)`}</MD>
          <ul className="list-disc pl-6">
            <li>número de blocos associados a <M>{t`\lambda`}</M> = <M>{t`\operatorname{m.g.}(\lambda)`}</M>;</li>
            <li>soma dos tamanhos desses blocos = <M>{t`\operatorname{m.a.}(\lambda)`}</M>.</li>
          </ul>
        </Thm>
        <p>As colunas de P formam <b>cadeias de Jordan</b>: <M>{t`(A - \lambda I)v_1 = 0`}</M>, <M>{t`(A - \lambda I)v_2 = v_1`}</M>, … (<M>{t`v_2, v_3,\dots`}</M> são vetores próprios <b>generalizados</b>).</p>
      </Section>
      <Section title="Porque é que o 1 importa">
        <JordanPowersLab />
        <Note><p>Fórmulas úteis (2×2): <M>{t`J^k = \begin{bmatrix}\lambda^k & k\lambda^{k-1}\\0&\lambda^k\end{bmatrix}`}</M> e <M>{t`e^{tJ} = e^{\lambda t}\begin{bmatrix}1&t\\0&1\end{bmatrix}`}</M> — é daqui que vêm os termos <M>{t`te^{\lambda t}`}</M> nas equações diferenciais.</p></Note>
      </Section>
      <Section title="Exemplo resolvido">
        <Example>
          <p><M>{t`A = \begin{bmatrix}3&1\\-1&1\end{bmatrix}`}</M>: <M>{t`p(\lambda) = (3-\lambda)(1-\lambda) + 1 = (\lambda - 2)^2`}</M>, m.a.(2) = 2.</p>
          <p><M>{t`A - 2I = \begin{bmatrix}1&1\\-1&-1\end{bmatrix}`}</M> tem car 1 ⇒ m.g.(2) = 1 ⇒ um bloco: <M>{t`J = \begin{bmatrix}2&1\\0&2\end{bmatrix}`}</M>.</p>
          <ul className="list-disc pl-6">
            <li><M>{t`v_1\in N(A - 2I)`}</M>: <M>{t`v_1 = (1,-1)`}</M>.</li>
            <li><M>{t`(A - 2I)v_2 = v_1`}</M>: <M>{t`a + b = 1`}</M>, por exemplo <M>{t`v_2 = (1,0)`}</M>.</li>
          </ul>
          <MD>{t`P = [v_1\ v_2] = \begin{bmatrix}1&1\\-1&0\end{bmatrix},\qquad AP = \begin{bmatrix}2&3\\-2&-1\end{bmatrix} = PJ\ ✔`}</MD>
        </Example>
        <Example title="Formas possíveis para um 3×3 com p(λ) = (2 − λ)³">
          <ul className="list-disc pl-6">
            <li>m.g. = 3: <M>{t`\operatorname{diag}(2,2,2)`}</M> (três blocos 1×1);</li>
            <li>m.g. = 2: <M>{t`J_2(2)\oplus J_1(2)`}</M>;</li>
            <li>m.g. = 1: <M>{t`J_3(2)`}</M>.</li>
          </ul>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>As partições de 4: 4, 3+1, 2+2, 2+1+1, 1+1+1+1 → 5 formas. Com m.g. = 2 há duas hipóteses (3+1 ou 2+2), por isso a m.g. sozinha não chega em 4×4: é preciso olhar para <M>{t`\operatorname{car}(A - \lambda I)^2`}</M>.</p>}><p>Quantas formas de Jordan (a menos da ordem dos blocos) tem uma matriz 4×4 com um único valor próprio? A m.g. chega para decidir?</p></Exercise>
        <Exercise n={2} solution={<MD>{t`J^{10} = \begin{bmatrix}3^{10} & 10\cdot 3^{9}\\0&3^{10}\end{bmatrix}`}</MD>}><p>Calcula <M>{t`J^{10}`}</M> para <M>{t`J = \begin{bmatrix}3&1\\0&3\end{bmatrix}`}</M>.</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Trocar a ordem da cadeia em P: o vetor próprio <M>{t`v_1`}</M> vem <b>antes</b> do generalizado <M>{t`v_2`}</M>; com a ordem trocada o 1 aparece abaixo da diagonal.</p></Pitfall>
        <Tip><p>Confirma sempre com <M>{t`AP = PJ`}</M> (evita inverter P).</p></Tip>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Determino o número e o tamanho dos blocos", "Construo cadeias (A − λI)v₂ = v₁", "Verifico AP = PJ", "Calculo Jᵏ e e^{tJ} para blocos 2×2"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 14. Aplicações ───────────────────────── */
export function Aplicacoes() {
  return (
    <>
      <Section title="Em resumo">
        <p>Valores e vetores próprios explicam como um sistema evolui no tempo. A ideia é sempre a mesma: escrever o estado inicial na base de vetores próprios, porque nessa base cada componente evolui sozinha.</p>
        <ul className="list-disc pl-6">
          <li><b>Discreto</b> <M>{t`x_{k+1} = Ax_k`}</M>: <M>{t`x_k = c_1\lambda_1^kv_1 + \cdots + c_n\lambda_n^kv_n`}</M>. Estável (<M>{t`x_k\to0`}</M> para todo o <M>{t`x_0`}</M>) ⇔ <M>{t`|\lambda_i| < 1`}</M> para todos.</li>
          <li><b>Contínuo</b> <M>{t`x'(t) = Ax(t)`}</M>: <M>{t`x(t) = c_1e^{\lambda_1t}v_1 + \cdots + c_ne^{\lambda_nt}v_n`}</M>. Estável ⇔ <M>{t`\operatorname{Re}\lambda_i < 0`}</M> para todos.</li>
          <li><b>Cadeias de Markov</b>: P com entradas ≥ 0 e colunas a somar 1 tem sempre <M>{t`\lambda = 1`}</M>; o estado estacionário é o vetor próprio associado (normalizado para somar 1).</li>
          <li><b>PageRank</b>: a importância das páginas é o vetor estacionário de uma cadeia de Markov na web.</li>
        </ul>
      </Section>
      <Section title="Sistemas dinâmicos discretos">
        <DynamicsLab />
      </Section>
      <Section title="Equações diferenciais lineares">
        <Example title="x' = Ax">
          <p>Com <M>{t`A = \begin{bmatrix}4&1\\2&3\end{bmatrix}`}</M> (valores próprios 5 e 2, vetores <M>{t`(1,1)`}</M> e <M>{t`(1,-2)`}</M>) e <M>{t`x(0) = (3,0)`}</M>:</p>
          <MD>{t`x(t) = c_1e^{5t}\begin{bmatrix}1\\1\end{bmatrix} + c_2e^{2t}\begin{bmatrix}1\\-2\end{bmatrix},\quad \begin{cases}c_1 + c_2 = 3\\ c_1 - 2c_2 = 0\end{cases}\Rightarrow c_1 = 2,\ c_2 = 1`}</MD>
          <p>Ambos os valores próprios são positivos: a origem é <b>instável</b>. Já <M>{t`\begin{bmatrix}-2&1\\1&-2\end{bmatrix}`}</M> (valores próprios −1 e −3) é estável: todas as soluções tendem para 0.</p>
        </Example>
      </Section>
      <Section title="Cadeias de Markov">
        <MarkovLab />
      </Section>
      <Section title="PageRank">
        <PageRankLab />
        <Note><p>Com <M>{t`0 < d < 1`}</M>, a matriz do Google tem todas as entradas positivas. Pelo teorema de Perron-Frobenius, <M>{t`\lambda = 1`}</M> é valor próprio simples e dominante, e o método das potências converge sempre.</p></Note>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>Triangular: valores próprios 0,5 e 0,9, ambos com módulo &lt; 1 ⇒ estável.</p>}><p><M>{t`x_{k+1} = \begin{bmatrix}0.5&0.2\\0&0.9\end{bmatrix}x_k`}</M> é estável?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`p = 0.2,\ q = 0.5`}</M> ⇒ <M>{t`v = (\tfrac{q}{p+q}, \tfrac{p}{p+q}) = (\tfrac57, \tfrac27)`}</M>. Verificação: <M>{t`0.8\cdot\tfrac57 + 0.5\cdot\tfrac27 = \tfrac{4+1}{7} = \tfrac57`}</M> ✔</p>}><p>Estado estacionário de <M>{t`P = \begin{bmatrix}0.8&0.5\\0.2&0.5\end{bmatrix}`}</M>?</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`x(t) = c_1e^{-t}(1,1) + c_2e^{-3t}(1,-1)`}</M>; <M>{t`c_1 + c_2 = 2,\ c_1 - c_2 = 0`}</M> ⇒ <M>{t`c_1 = c_2 = 1`}</M>.</p>}><p>Resolve <M>{t`x' = \begin{bmatrix}-2&1\\1&-2\end{bmatrix}x`}</M> com <M>{t`x(0) = (2,0)`}</M>.</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p>Trocar os critérios: no caso <b>discreto</b> compara-se <M>{t`|\lambda|`}</M> com 1; no <b>contínuo</b>, o sinal de <M>{t`\operatorname{Re}\lambda`}</M>.</p></Pitfall>
        <Tip><p>Numa matriz de Markov, confirma que cada coluna soma 1: se não somar, a convenção pode ser por linhas (<M>{t`x_{k+1}^T = x_k^TP`}</M>).</p></Tip>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Resolvo x' = Ax e xₖ₊₁ = Axₖ com vetores próprios", "Decido estabilidade nos dois casos", "Calculo o estado estacionário de uma cadeia de Markov", "Sei explicar o PageRank como problema de vetores próprios"]} />
      </Section>
    </>
  );
}
