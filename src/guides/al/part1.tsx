"use client";
import { M, MD } from "../ui/Tex";
import { Section, Def, Thm, Note, Pitfall, Tip, Example, Exercise, Checklist } from "../ui/blocks";
import { GaussLab } from "../widgets/GaussLab";
import { TransformLab, CompositionLab } from "../widgets/TransformLab";
import { MultiplyLab, LaplaceLab } from "../widgets/MatrixLabs";

const t = String.raw;

/* ───────────────────────── 1. Eliminação de Gauss e Gauss-Jordan ───────────────────────── */
export function Gauss() {
  return (
    <>
      <Section title="Em resumo">
        <p>
          Resolver um sistema linear é, no fundo, simplificar a sua <b>matriz aumentada</b> <M>{t`[A\,|\,b]`}</M> sem mudar o conjunto de soluções.
          Para isso só usamos três <b>operações elementares sobre linhas</b>, que são reversíveis:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li><M>{t`L_i \leftrightarrow L_j`}</M> — trocar duas linhas;</li>
          <li><M>{t`\alpha L_i`}</M> com <M>{t`\alpha \neq 0`}</M> — multiplicar uma linha por um escalar não nulo;</li>
          <li><M>{t`L_i + \alpha L_j`}</M> com <M>{t`i\neq j`}</M> — somar a uma linha um múltiplo de outra.</li>
        </ul>
        <p>
          O <b>método de Gauss</b> põe a matriz em <b>escada de linhas</b>; o <b>método de Gauss-Jordan</b> continua até à escada de linhas <b>reduzida</b>,
          de onde a solução se lê diretamente.
        </p>
      </Section>

      <Section title="Escada de linhas">
        <Def title="Pivô e escada de linhas">
          <p>O <b>pivô</b> de uma linha não nula é a sua primeira entrada diferente de zero. Uma matriz está em <b>escada de linhas</b> se:</p>
          <ol className="list-decimal pl-6">
            <li>as linhas nulas (se existirem) estão todas em baixo;</li>
            <li>o pivô de cada linha está estritamente à direita do pivô da linha de cima.</li>
          </ol>
          <p>Está em <b>escada reduzida</b> se, além disso, todos os pivôs são 1 e são as únicas entradas não nulas das suas colunas.</p>
        </Def>
        <MD>{t`\underbrace{\begin{bmatrix} \boxed{2} & 1 & 3 \\ 0 & \boxed{5} & 1 \\ 0 & 0 & 0 \end{bmatrix}}_{\text{escada}} \qquad \underbrace{\begin{bmatrix} \boxed{1} & 0 & 2 \\ 0 & \boxed{1} & -1 \\ 0 & 0 & 0 \end{bmatrix}}_{\text{escada reduzida}} \qquad \underbrace{\begin{bmatrix} 0 & \boxed{1} \\ \boxed{3} & 4 \end{bmatrix}}_{\text{não é escada}}`}</MD>
        <Thm title="Porque é que funciona">
          <p>Cada operação elementar transforma o sistema num sistema <b>equivalente</b> (com as mesmas soluções), porque pode ser desfeita por outra operação elementar: <M>{t`L_i \leftrightarrow L_j`}</M> desfaz-se a si mesma, <M>{t`\alpha L_i`}</M> desfaz-se com <M>{t`\tfrac1\alpha L_i`}</M> e <M>{t`L_i+\alpha L_j`}</M> com <M>{t`L_i-\alpha L_j`}</M>.</p>
        </Thm>
      </Section>

      <Section title="O algoritmo">
        <ol className="list-decimal space-y-1 pl-6">
          <li>Procura a primeira coluna (da esquerda) com alguma entrada não nula; se preciso, troca linhas para pôr essa entrada em cima — é o pivô.</li>
          <li>Anula todas as entradas <b>abaixo</b> do pivô com operações <M>{t`L_i - \frac{a_{ik}}{a_{1k}} L_1`}</M>.</li>
          <li>Esquece a linha do pivô e repete com a submatriz que fica em baixo. Quando acabar, tens a escada (<b>Gauss</b>).</li>
          <li>(<b>Gauss-Jordan</b>) Da direita para a esquerda: divide cada linha pelo seu pivô e anula as entradas <b>acima</b> de cada pivô.</li>
        </ol>
        <GaussLab
          initial={[[1, 2, 1, 4], [2, 5, 3, 10], [-1, 1, 4, 4]]}
          presets={[
            { label: "Exemplo resolvido", value: [[1, 2, 1, 4], [2, 5, 3, 10], [-1, 1, 4, 4]] },
            { label: "Precisa de troca", value: [[0, 1, 2, 3], [1, 1, 1, 2], [2, 0, 1, 1]] },
            { label: "2×2", value: [[1, -1, 1], [2, 1, 8]] },
          ]}
        />
      </Section>

      <Section title="Exemplo resolvido">
        <Example title="Gauss e depois Gauss-Jordan">
          <MD>{t`\begin{cases} x + 2y + z = 4 \\ 2x + 5y + 3z = 10 \\ -x + y + 4z = 4 \end{cases} \;\longrightarrow\; \left[\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\ 2 & 5 & 3 & 10 \\ -1 & 1 & 4 & 4 \end{array}\right]`}</MD>
          <MD>{t`\xrightarrow[L_3 + L_1]{L_2 - 2L_1} \left[\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\ 0 & 1 & 1 & 2 \\ 0 & 3 & 5 & 8 \end{array}\right] \xrightarrow{L_3 - 3L_2} \left[\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\ 0 & 1 & 1 & 2 \\ 0 & 0 & 2 & 2 \end{array}\right]`}</MD>
          <p>Já está em escada (Gauss). Por substituição de baixo para cima: <M>{t`z = 1`}</M>, <M>{t`y = 2 - z = 1`}</M>, <M>{t`x = 4 - 2y - z = 1`}</M>.</p>
          <p>Com Gauss-Jordan continuamos até à escada reduzida:</p>
          <MD>{t`\xrightarrow{\frac12 L_3} \left[\begin{array}{ccc|c} 1 & 2 & 1 & 4 \\ 0 & 1 & 1 & 2 \\ 0 & 0 & 1 & 1 \end{array}\right] \xrightarrow[L_1 - L_3]{L_2 - L_3} \left[\begin{array}{ccc|c} 1 & 2 & 0 & 3 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 \end{array}\right] \xrightarrow{L_1 - 2L_2} \left[\begin{array}{ccc|c} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 \end{array}\right]`}</MD>
          <p>Lê-se <M>{t`S = \{(1,1,1)\}`}</M>. <b>Verifica sempre</b>: <M>{t`1+2+1 = 4`}</M>, <M>{t`2+5+3=10`}</M>, <M>{t`-1+1+4 = 4`}</M> ✔</p>
        </Example>
      </Section>

      <Section title="Exercícios">
        <Exercise n={1} solution={<p>Não: o pivô da linha 3 (coluna 2) está à esquerda do pivô da linha 2 (coluna 3). Basta <M>{t`L_2 \leftrightarrow L_3`}</M> para ficar em escada.</p>}>
          <p>A matriz <M>{t`\begin{bmatrix}1&3&0\\0&0&2\\0&1&4\end{bmatrix}`}</M> está em escada de linhas? Se não, que operação a põe em escada?</p>
        </Exercise>
        <Exercise n={2} solution={<p><M>{t`L_2 - 2L_1`}</M> dá <M>{t`3y = 6`}</M>, logo <M>{t`y = 2`}</M> e <M>{t`x = 1 + y = 3`}</M>. <M>{t`S = \{(3,2)\}`}</M>.</p>}>
          <p>Resolve por Gauss: <M>{t`x - y = 1,\ 2x + y = 8`}</M>.</p>
        </Exercise>
        <Exercise n={3} solution={<MD>{t`\begin{bmatrix}2&4&6\\1&3&5\end{bmatrix} \xrightarrow{\frac12 L_1} \begin{bmatrix}1&2&3\\1&3&5\end{bmatrix} \xrightarrow{L_2 - L_1} \begin{bmatrix}1&2&3\\0&1&2\end{bmatrix} \xrightarrow{L_1 - 2L_2} \begin{bmatrix}1&0&-1\\0&1&2\end{bmatrix}`}</MD>}>
          <p>Calcula a escada reduzida de <M>{t`\begin{bmatrix}2&4&6\\1&3&5\end{bmatrix}`}</M>. Se fosse a matriz aumentada de um sistema, qual seria a solução?</p>
        </Exercise>
      </Section>

      <Section title="Erros comuns">
        <Pitfall><p><b>Multiplicar uma linha por 0.</b> Não é uma operação elementar: perde-se informação e o sistema deixa de ser equivalente.</p></Pitfall>
        <Pitfall><p><b>Alterar duas linhas "ao mesmo tempo" usando-se uma à outra</b> (p.ex. <M>{t`L_1 \to L_1 - L_2`}</M> e <M>{t`L_2 \to L_2 - L_1`}</M> no mesmo passo, com as linhas antigas). Faz uma operação de cada vez.</p></Pitfall>
        <Pitfall><p><b>Esquecer a coluna dos termos independentes</b> quando aplicas a operação. A linha é toda, incluindo depois da barra.</p></Pitfall>
        <Tip><p>Antes de dividir, procura um pivô igual a 1 (troca linhas se for preciso): poupas frações durante o resto das contas.</p></Tip>
      </Section>

      <Section title="Checklist antes do teste">
        <Checklist items={["Sei as 3 operações elementares e porque não mudam as soluções", "Reconheço uma matriz em escada e em escada reduzida", "Consigo fazer Gauss num 3×3 sem me enganar nos sinais", "Verifico sempre a solução no sistema original"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 2. Aplicação à solução de sistemas lineares ───────────────────────── */
export function Sistemas() {
  return (
    <>
      <Section title="Em resumo">
        <p>
          Depois de pôr <M>{t`[A\,|\,b]`}</M> em escada, a classificação do sistema lê-se nos pivôs. Chamamos <b>característica</b> de uma matriz,
          <M>{t`\operatorname{car}(A)`}</M>, ao número de pivôs de uma qualquer escada que lhe seja equivalente.
        </p>
      </Section>
      <Section title="Classificação">
        <Thm title="Classificação de Ax = b (A é m×n)">
          <ul className="list-disc space-y-1 pl-6">
            <li><b>Impossível (SI)</b> ⇔ há um pivô na coluna de <M>b</M> ⇔ <M>{t`\operatorname{car}(A) < \operatorname{car}([A|b])`}</M>. Aparece uma linha <M>{t`[0\ \cdots\ 0\,|\,c]`}</M> com <M>{t`c\neq 0`}</M>.</li>
            <li><b>Possível e determinado (SPD)</b> ⇔ <M>{t`\operatorname{car}(A) = \operatorname{car}([A|b]) = n`}</M>: todas as colunas de A têm pivô.</li>
            <li><b>Possível e indeterminado (SPI)</b> ⇔ <M>{t`\operatorname{car}(A) = \operatorname{car}([A|b]) < n`}</M>. As colunas sem pivô são as <b>incógnitas livres</b>; há <M>{t`n - \operatorname{car}(A)`}</M> delas (o <b>grau de indeterminação</b>).</li>
          </ul>
        </Thm>
        <Note><p>Um sistema <b>homogéneo</b> (<M>{t`b = 0`}</M>) é sempre possível: <M>{t`x = 0`}</M> é solução. Se tiver mais incógnitas do que equações (<M>{t`n > m`}</M>), há necessariamente colunas sem pivô — é SPI.</p></Note>
        <GaussLab
          title="Classifica o sistema"
          initial={[[1, 2, -1, 3], [2, 4, 1, 9]]}
          presets={[
            { label: "SPI (1 livre)", value: [[1, 2, -1, 3], [2, 4, 1, 9]] },
            { label: "SI", value: [[1, 1, 1, 1], [1, 2, 1, 2], [1, 1, 1, 3]] },
            { label: "SPD", value: [[1, 1, 1, 1], [1, 2, 3, 2], [1, 1, 2, 3]] },
            { label: "SPI (2 livres)", value: [[1, 2, -1, 1], [2, 4, -2, 2], [-1, -2, 1, -1]] },
          ]}
        />
      </Section>
      <Section title="Escrever a solução geral (SPI)">
        <Example title="Solução em forma paramétrica">
          <MD>{t`\left[\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 2 & 4 & 1 & 9 \end{array}\right] \xrightarrow{L_2 - 2L_1} \left[\begin{array}{ccc|c} 1 & 2 & -1 & 3 \\ 0 & 0 & 3 & 3 \end{array}\right]`}</MD>
          <p>Pivôs nas colunas 1 e 3, logo <M>{t`y`}</M> é livre. Da 2.ª linha <M>{t`z = 1`}</M>; da 1.ª <M>{t`x = 3 - 2y + z = 4 - 2y`}</M>. Chamando <M>{t`y = s`}</M>:</p>
          <MD>{t`S = \{(4 - 2s,\ s,\ 1) : s \in \mathbb{R}\} = \{(4,0,1) + s(-2,1,0) : s\in\mathbb{R}\}`}</MD>
          <p>É uma <b>reta</b> em <M>{t`\mathbb{R}^3`}</M> (grau de indeterminação 1).</p>
        </Example>
      </Section>
      <Section title="Sistemas com parâmetros">
        <Example title="Discutir em função de α e β">
          <MD>{t`\left[\begin{array}{ccc|c} 1 & 1 & 1 & 1 \\ 1 & 2 & \alpha & 2 \\ 1 & 1 & \alpha & \beta \end{array}\right] \xrightarrow[L_3 - L_1]{L_2 - L_1} \left[\begin{array}{ccc|c} 1 & 1 & 1 & 1 \\ 0 & 1 & \alpha - 1 & 1 \\ 0 & 0 & \alpha - 1 & \beta - 1 \end{array}\right]`}</MD>
          <ul className="list-disc pl-6">
            <li><M>{t`\alpha \neq 1`}</M>: três pivôs → <b>SPD</b> (para qualquer β).</li>
            <li><M>{t`\alpha = 1,\ \beta \neq 1`}</M>: a última linha é <M>{t`[0\ 0\ 0\,|\,\beta-1]`}</M> → <b>SI</b>.</li>
            <li><M>{t`\alpha = 1,\ \beta = 1`}</M>: a última linha é nula → <b>SPI</b> com grau 1.</li>
          </ul>
        </Example>
        <Tip><p>Quando o parâmetro aparece num pivô, <b>não dividas</b> por ele sem separar os casos em que se anula.</p></Tip>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<><p><M>{t`L_2 - kL_1`}</M> dá <M>{t`(1-k^2)y = 1 - k`}</M>.</p><ul className="list-disc pl-6"><li><M>{t`k \neq \pm1`}</M>: SPD, com <M>{t`x = y = \tfrac{1}{1+k}`}</M>.</li><li><M>{t`k = 1`}</M>: as duas equações são iguais (<M>{t`x+y=1`}</M>) → SPI.</li><li><M>{t`k=-1`}</M>: <M>{t`0 = 2`}</M> → SI.</li></ul></>}>
          <p>Discute, em função de <M>k</M>, o sistema <M>{t`x + ky = 1,\ kx + y = 1`}</M>.</p>
        </Exercise>
        <Exercise n={2} solution={<p>Um sistema homogéneo é sempre possível. Com 3 equações e 5 incógnitas há no máximo 3 pivôs, logo pelo menos 2 incógnitas livres: é SPI com grau ≥ 2.</p>}>
          <p>Um sistema homogéneo tem 3 equações e 5 incógnitas. O que se pode garantir?</p>
        </Exercise>
        <Exercise n={3} solution={<p>(a) SPD (3 pivôs em 3 incógnitas). (b) SI (pivô na coluna de b). (c) SPI, grau 1 (a coluna 2 não tem pivô).</p>}>
          <p>Classifica: (a) <M>{t`\left[\begin{array}{ccc|c}1&2&0&1\\0&3&1&2\\0&0&4&0\end{array}\right]`}</M> (b) <M>{t`\left[\begin{array}{cc|c}1&2&1\\0&0&5\end{array}\right]`}</M> (c) <M>{t`\left[\begin{array}{ccc|c}1&2&1&1\\0&0&1&3\end{array}\right]`}</M></p>
        </Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p><b>Achar que uma linha de zeros torna o sistema impossível.</b> A linha <M>{t`[0\ 0\ 0\,|\,0]`}</M> diz <M>{t`0 = 0`}</M>: é inofensiva. Só <M>{t`[0\ \cdots\ 0\,|\,c\neq0]`}</M> dá SI.</p></Pitfall>
        <Pitfall><p><b>Escolher as variáveis livres ao calhas.</b> As livres são as das colunas <b>sem pivô</b> na escada; as outras escrevem-se em função delas.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Classifico SI / SPD / SPI só a olhar para a escada", "Sei a relação com car(A) e car([A|b])", "Escrevo a solução geral em forma paramétrica", "Discuto sistemas com parâmetros sem dividir por zero"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 3. Matrizes ───────────────────────── */
export function Matrizes() {
  return (
    <>
      <Section title="Em resumo">
        <p>
          <M>{t`\mathcal{M}_{m\times n}(\mathbb{R})`}</M> é o conjunto das matrizes reais com <M>m</M> linhas e <M>n</M> colunas, e <M>{t`a_{ij}`}</M> é a entrada da linha <M>i</M>, coluna <M>j</M>.
          Soma e multiplicação por escalar fazem-se entrada a entrada. O <b>produto</b> é a operação interessante:
        </p>
        <MD>{t`A \in \mathcal{M}_{m\times n},\ B\in\mathcal{M}_{n\times p} \;\Rightarrow\; AB \in \mathcal{M}_{m\times p},\qquad [AB]_{ij} = \sum_{k=1}^{n} a_{ik}\,b_{kj}`}</MD>
        <p>Ou seja: a entrada <M>{t`(i,j)`}</M> de <M>AB</M> é o produto da <b>linha i de A</b> pela <b>coluna j de B</b>.</p>
      </Section>
      <Section title="O produto, à mão">
        <MultiplyLab />
        <Thm title="Propriedades do produto">
          <ul className="list-disc pl-6">
            <li>Associativo: <M>{t`(AB)C = A(BC)`}</M>; distributivo: <M>{t`A(B+C) = AB + AC`}</M>.</li>
            <li><M>{t`I_m A = A I_n = A`}</M>, onde <M>{t`I`}</M> é a identidade.</li>
            <li><b>Não é comutativo</b>: em geral <M>{t`AB \neq BA`}</M>.</li>
            <li><b>Não vale a lei do anulamento</b>: <M>{t`AB = 0`}</M> não implica <M>{t`A=0`}</M> ou <M>{t`B=0`}</M>.</li>
            <li>Transposta: <M>{t`(A^T)_{ij} = a_{ji}`}</M>, <M>{t`(AB)^T = B^TA^T`}</M> (a ordem troca!).</li>
          </ul>
        </Thm>
      </Section>
      <Section title="Matrizes como transformações">
        <p>Uma matriz <M>{t`2\times2`}</M> transforma vetores do plano: <M>{t`x \mapsto Ax`}</M>. A 1.ª coluna é para onde vai <M>{t`e_1 = (1,0)`}</M> e a 2.ª para onde vai <M>{t`e_2=(0,1)`}</M>. Multiplicar matrizes é <b>compor</b> transformações — por isso a ordem importa.</p>
        <TransformLab showDet={false} />
        <CompositionLab />
      </Section>
      <Section title="Matrizes elementares">
        <Def>
          <p>Uma <b>matriz elementar</b> <M>E</M> obtém-se da identidade com <b>uma</b> operação elementar. Fazer essa operação sobre as linhas de <M>A</M> é o mesmo que calcular <M>{t`EA`}</M>.</p>
        </Def>
        <MD>{t`E = \begin{bmatrix}1&0&0\\-3&1&0\\0&0&1\end{bmatrix} \;(L_2 - 3L_1):\qquad E\begin{bmatrix}1&2\\3&4\\5&6\end{bmatrix} = \begin{bmatrix}1&2\\0&-2\\5&6\end{bmatrix}`}</MD>
        <p>Assim, a eliminação de Gauss é <M>{t`E_k\cdots E_2E_1A = U`}</M> (escada).</p>
      </Section>
      <Section title="Exemplos resolvidos">
        <Example title="AB ≠ BA">
          <MD>{t`A = \begin{bmatrix}1&2\\0&1\end{bmatrix},\ B=\begin{bmatrix}1&0\\3&1\end{bmatrix}:\quad AB = \begin{bmatrix}7&2\\3&1\end{bmatrix},\quad BA = \begin{bmatrix}1&2\\3&7\end{bmatrix}`}</MD>
        </Example>
        <Example title="AB = 0 sem A ou B nulas">
          <MD>{t`\begin{bmatrix}1&1\\1&1\end{bmatrix}\begin{bmatrix}1&-1\\-1&1\end{bmatrix} = \begin{bmatrix}0&0\\0&0\end{bmatrix}`}</MD>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p>AB existe e é 2×4. BA não existe: B tem 4 colunas e A tem 2 linhas. <M>{t`A^TA`}</M> é 3×3.</p>}>
          <p>A é 2×3 e B é 3×4. Existem AB e BA? Que dimensão tem <M>{t`A^TA`}</M>?</p>
        </Exercise>
        <Exercise n={2} solution={<p><M>{t`(A+B)^2 = A^2 + AB + BA + B^2`}</M>. Só é igual a <M>{t`A^2 + 2AB + B^2`}</M> se <M>{t`AB = BA`}</M>.</p>}>
          <p>Desenvolve <M>{t`(A+B)^2`}</M>. Quando é que é igual a <M>{t`A^2+2AB+B^2`}</M>?</p>
        </Exercise>
        <Exercise n={3} solution={<MD>{t`\begin{bmatrix}0&0&1\\0&1&0\\1&0&0\end{bmatrix}\ (L_1\leftrightarrow L_3), \qquad \begin{bmatrix}1&0&0\\0&5&0\\0&0&1\end{bmatrix}\ (5L_2)`}</MD>}>
          <p>Escreve as matrizes elementares 3×3 que fazem <M>{t`L_1\leftrightarrow L_3`}</M> e <M>{t`5L_2`}</M>.</p>
        </Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p><b>Multiplicar entrada a entrada.</b> O produto matricial é linha × coluna; o produto entrada a entrada não é o que se usa aqui.</p></Pitfall>
        <Pitfall><p><b>Simplificar <M>{t`AB = AC \Rightarrow B = C`}</M>.</b> Só é válido se A for invertível.</p></Pitfall>
        <Pitfall><p><b><M>{t`(AB)^T = A^TB^T`}</M></b> está errado: é <M>{t`B^TA^T`}</M>.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Sei quando o produto AB existe e que dimensão tem", "Calculo produtos 3×3 sem hesitar", "Sei dar exemplos de AB ≠ BA e de AB = 0", "Percebo que as colunas de A são as imagens de e₁, …, eₙ"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 4. Matrizes inversas ───────────────────────── */
export function Inversas() {
  return (
    <>
      <Section title="Em resumo">
        <Def>
          <p>Uma matriz quadrada <M>A</M> (n×n) é <b>invertível</b> se existe <M>B</M> tal que <M>{t`AB = BA = I_n`}</M>. Essa <M>B</M> é única e chama-se <b>inversa</b>, <M>{t`A^{-1}`}</M>.</p>
        </Def>
        <Thm title="Critérios equivalentes (A é n×n)">
          <ul className="list-disc pl-6">
            <li>A é invertível;</li>
            <li><M>{t`\operatorname{car}(A) = n`}</M> (n pivôs) ⇔ a escada reduzida de A é <M>{t`I_n`}</M>;</li>
            <li><M>{t`Ax = b`}</M> é SPD para todo o <M>b</M> ⇔ <M>{t`Ax = 0`}</M> só tem a solução nula;</li>
            <li><M>{t`\det A \neq 0`}</M>;</li>
            <li>A é produto de matrizes elementares.</li>
          </ul>
        </Thm>
      </Section>
      <Section title="Cálculo por Gauss-Jordan">
        <p>Escreve <M>{t`[A\,|\,I]`}</M> e aplica Gauss-Jordan. Se a parte esquerda chegar a <M>{t`I`}</M>, a direita é <M>{t`A^{-1}`}</M>: <M>{t`[A\,|\,I] \to [I\,|\,A^{-1}]`}</M>. Se aparecer uma linha nula à esquerda, A não é invertível.</p>
        <GaussLab
          title="Inversa por Gauss-Jordan"
          mode="inverse"
          initial={[[1, 1, 0], [0, 1, 0], [-1, -2, 2]]}
          presets={[
            { label: "Exemplo 3×3", value: [[1, 1, 0], [0, 1, 0], [-1, -2, 2]] },
            { label: "2×2", value: [[2, 1], [5, 3]] },
            { label: "Não invertível", value: [[1, 2, 3], [2, 4, 6], [1, 0, 1]] },
          ]}
        />
        <Example title="3×3">
          <MD>{t`\left[\begin{array}{ccc|ccc} 1&1&0&1&0&0\\0&1&0&0&1&0\\-1&-2&2&0&0&1 \end{array}\right] \xrightarrow{L_3+L_1} \left[\begin{array}{ccc|ccc} 1&1&0&1&0&0\\0&1&0&0&1&0\\0&-1&2&1&0&1 \end{array}\right] \xrightarrow{L_3+L_2} \left[\begin{array}{ccc|ccc} 1&1&0&1&0&0\\0&1&0&0&1&0\\0&0&2&1&1&1 \end{array}\right]`}</MD>
          <MD>{t`\xrightarrow{\frac12L_3} \left[\begin{array}{ccc|ccc} 1&1&0&1&0&0\\0&1&0&0&1&0\\0&0&1&\frac12&\frac12&\frac12 \end{array}\right] \xrightarrow{L_1 - L_2} \left[\begin{array}{ccc|ccc} 1&0&0&1&-1&0\\0&1&0&0&1&0\\0&0&1&\frac12&\frac12&\frac12 \end{array}\right] \Rightarrow A^{-1} = \begin{bmatrix}1&-1&0\\0&1&0\\\frac12&\frac12&\frac12\end{bmatrix}`}</MD>
          <p>Confirma: a 3.ª linha de A vezes cada coluna de <M>{t`A^{-1}`}</M> dá <M>{t`(0,0,1)`}</M> ✔</p>
        </Example>
      </Section>
      <Section title="Fórmula 2×2 e propriedades">
        <MD>{t`\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1} = \frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix} \quad (ad - bc \neq 0)`}</MD>
        <ul className="list-disc pl-6">
          <li><M>{t`(A^{-1})^{-1} = A`}</M>, <M>{t`(A^T)^{-1} = (A^{-1})^T`}</M>, <M>{t`(\alpha A)^{-1} = \tfrac1\alpha A^{-1}`}</M></li>
          <li><M>{t`(AB)^{-1} = B^{-1}A^{-1}`}</M> — a ordem troca, como na transposta.</li>
          <li>Equações matriciais: <M>{t`AX = B \Rightarrow X = A^{-1}B`}</M>, mas <M>{t`XA = B \Rightarrow X = BA^{-1}`}</M>.</li>
        </ul>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<MD>{t`\det = 4 - 6 = -2 \Rightarrow A^{-1} = -\frac12\begin{bmatrix}4&-2\\-3&1\end{bmatrix} = \begin{bmatrix}-2&1\\\frac32&-\frac12\end{bmatrix}`}</MD>}>
          <p>Calcula a inversa de <M>{t`\begin{bmatrix}1&2\\3&4\end{bmatrix}`}</M>.</p>
        </Exercise>
        <Exercise n={2} solution={<><p><M>{t`A^{-1} = \begin{bmatrix}1&-1\\0&1\end{bmatrix}`}</M> e <M>{t`X = BA^{-1} = \begin{bmatrix}2&1\\1&0\end{bmatrix}`}</M>.</p><p>Verificação: <M>{t`XA = \begin{bmatrix}2&3\\1&1\end{bmatrix} = B`}</M> ✔</p></>}>
          <p>Resolve <M>{t`XA = B`}</M> com <M>{t`A = \begin{bmatrix}1&1\\0&1\end{bmatrix},\ B = \begin{bmatrix}2&3\\1&1\end{bmatrix}`}</M>.</p>
        </Exercise>
        <Exercise n={3} solution={<p>Não: a 2.ª linha é o dobro da 1.ª. <M>{t`L_2 - 2L_1`}</M> dá uma linha nula, só há 1 pivô (e <M>{t`\det = 4-4 = 0`}</M>).</p>}>
          <p><M>{t`\begin{bmatrix}1&2\\2&4\end{bmatrix}`}</M> é invertível?</p>
        </Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p><M>{t`(AB)^{-1} = A^{-1}B^{-1}`}</M> — <b>errado</b>; é <M>{t`B^{-1}A^{-1}`}</M>.</p></Pitfall>
        <Pitfall><p><M>{t`(A+B)^{-1} = A^{-1} + B^{-1}`}</M> — <b>falso</b> em geral (A + B pode nem ser invertível).</p></Pitfall>
        <Pitfall><p>Em <M>{t`XA = B`}</M>, escrever <M>{t`X = A^{-1}B`}</M>. Multiplica-se pela direita: <M>{t`X = BA^{-1}`}</M>.</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Calculo inversas 3×3 com [A|I]", "Sei a fórmula 2×2 de cor", "Conheço os critérios equivalentes de invertibilidade", "Resolvo AX = B e XA = B sem trocar a ordem"]} />
      </Section>
    </>
  );
}

/* ───────────────────────── 5. Determinantes ───────────────────────── */
export function Determinantes() {
  return (
    <>
      <Section title="Em resumo">
        <p>
          O determinante <M>{t`\det A = |A|`}</M> é um número associado a cada matriz quadrada. Geometricamente, em 2×2 (3×3) é a <b>área (volume) com sinal</b> da imagem do quadrado (cubo) unitário.
          O sinal indica se a orientação é preservada ou invertida. O facto mais importante: <M>{t`A`}</M> é invertível <b>se e só se</b> <M>{t`\det A \neq 0`}</M>.
        </p>
        <MD>{t`\begin{vmatrix}a&b\\c&d\end{vmatrix} = ad - bc`}</MD>
      </Section>
      <Section title="O determinante como área">
        <TransformLab initial={[[2, 1], [0.5, 1.5]]} showVector={false} />
      </Section>
      <Section title="Propriedades (as que mais saem)">
        <Thm>
          <ul className="list-disc space-y-1 pl-6">
            <li>Trocar duas linhas muda o sinal: <M>{t`|B| = -|A|`}</M>.</li>
            <li>Multiplicar uma linha por <M>α</M> multiplica o determinante por <M>α</M>. Logo <M>{t`\det(\alpha A) = \alpha^n \det A`}</M> (A n×n).</li>
            <li><M>{t`L_i + \alpha L_j`}</M> <b>não altera</b> o determinante.</li>
            <li>Triangular (ou escada): <M>{t`\det A = a_{11}a_{22}\cdots a_{nn}`}</M>.</li>
            <li>Linha nula ou duas linhas iguais/proporcionais ⇒ <M>{t`\det A = 0`}</M>.</li>
            <li><M>{t`\det(AB) = \det A\,\det B`}</M>, <M>{t`\det A^T = \det A`}</M>, <M>{t`\det A^{-1} = \frac{1}{\det A}`}</M>.</li>
          </ul>
        </Thm>
        <Tip><p>Método prático: põe A em escada contando as trocas de linha e os fatores que tiraste. Depois multiplica a diagonal.</p></Tip>
      </Section>
      <Section title="Regra de Laplace">
        <p>Seja <M>{t`A_{ij}`}</M> a submatriz que se obtém retirando a linha <M>i</M> e a coluna <M>j</M>. O <b>cofator</b> é <M>{t`C_{ij} = (-1)^{i+j}\det A_{ij}`}</M>. Para qualquer linha <M>i</M> (ou coluna <M>j</M>):</p>
        <MD>{t`\det A = \sum_{j=1}^n a_{ij}C_{ij} = \sum_{i=1}^n a_{ij}C_{ij}`}</MD>
        <LaplaceLab />
        <Example title="Escolher a coluna certa">
          <p>Em <M>{t`A = \begin{bmatrix}2&0&1\\1&3&0\\-1&0&4\end{bmatrix}`}</M> a coluna 2 só tem uma entrada não nula:</p>
          <MD>{t`\det A = 3\cdot(-1)^{2+2}\begin{vmatrix}2&1\\-1&4\end{vmatrix} = 3\,(8+1) = 27`}</MD>
        </Example>
      </Section>
      <Section title="Inversa pelos cofatores e regra de Cramer">
        <MD>{t`A^{-1} = \frac{1}{\det A}\,\operatorname{cof}(A)^T, \qquad x_k = \frac{\det A_k(b)}{\det A}\ \ \text{(Cramer)}`}</MD>
        <p>onde <M>{t`A_k(b)`}</M> é A com a coluna <M>k</M> substituída por <M>b</M>. Cramer só se aplica se <M>{t`\det A\neq 0`}</M>.</p>
        <Example title="Cramer">
          <p><M>{t`x + 2y = 5,\ 3x + 4y = 6`}</M>: <M>{t`\det A = 4 - 6 = -2`}</M>.</p>
          <MD>{t`x = \frac{\begin{vmatrix}5&2\\6&4\end{vmatrix}}{-2} = \frac{8}{-2} = -4,\qquad y = \frac{\begin{vmatrix}1&5\\3&6\end{vmatrix}}{-2} = \frac{-9}{-2} = \frac92`}</MD>
          <p>Verificação: <M>{t`-4 + 9 = 5`}</M>, <M>{t`-12 + 18 = 6`}</M> ✔</p>
        </Example>
      </Section>
      <Section title="Exercícios">
        <Exercise n={1} solution={<p><M>{t`\det(2A) = 2^3\cdot 5 = 40`}</M>.</p>}><p>A é 3×3 com <M>{t`\det A = 5`}</M>. Quanto é <M>{t`\det(2A)`}</M>?</p></Exercise>
        <Exercise n={2} solution={<p><M>{t`\det(A^{-1}B^T) = \frac{1}{\det A}\det B = \frac32`}</M>.</p>}><p>Se <M>{t`\det A = 2`}</M> e <M>{t`\det B = 3`}</M>, calcula <M>{t`\det(A^{-1}B^T)`}</M>.</p></Exercise>
        <Exercise n={3} solution={<p><M>{t`\det = 4 - k^2 \neq 0 \Leftrightarrow k \neq \pm 2`}</M>.</p>}><p>Para que valores de <M>k</M> é <M>{t`\begin{bmatrix}1&k\\k&4\end{bmatrix}`}</M> invertível?</p></Exercise>
      </Section>
      <Section title="Erros comuns">
        <Pitfall><p><M>{t`\det(A+B) = \det A + \det B`}</M> é <b>falso</b> (experimenta <M>{t`A = B = I_2`}</M>: 4 ≠ 2).</p></Pitfall>
        <Pitfall><p><M>{t`\det(\alpha A) = \alpha\det A`}</M> está errado: é <M>{t`\alpha^n\det A`}</M>.</p></Pitfall>
        <Pitfall><p>Esquecer os sinais <M>{t`(-1)^{i+j}`}</M> em Laplace (padrão de xadrez <M>{t`+\,-\,+`}</M>).</p></Pitfall>
      </Section>
      <Section title="Checklist antes do teste">
        <Checklist items={["Calculo determinantes por escada e por Laplace", "Sei o efeito de cada operação elementar no determinante", "Uso det(AB), det(Aᵀ), det(A⁻¹), det(αA)", "Aplico a regra de Cramer"]} />
      </Section>
    </>
  );
}
