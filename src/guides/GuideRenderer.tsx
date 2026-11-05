"use client";
import type { ComponentType } from "react";
import { useLang } from "@/i18n/client";
import * as P1 from "./al/part1";
import * as P2 from "./al/part2";
import * as P3 from "./al/part3";
import * as P4 from "./al/part4";
import * as E1 from "./al-en/part1";
import * as E2 from "./al-en/part2";
import * as E3 from "./al-en/part3";
import * as E4 from "./al-en/part4";

type Parts = { P1: typeof P1; P2: typeof P2; P3: typeof P3; P4: typeof P4 };
const al = ({ P1, P2, P3, P4 }: Parts): Record<number, ComponentType> => ({
  1: P1.Gauss,
  2: P1.Sistemas,
  3: P1.Matrizes,
  4: P1.Inversas,
  5: P1.Determinantes,
  6: P2.EspacosVetoriais,
  7: P2.IndependenciaLinear,
  8: P2.TransformacoesLineares,
  9: P2.NucleoImagem,
  10: P2.EspacoSolucoes,
  11: P3.ValoresProprios,
  12: P3.Multiplicidades,
  13: P3.Jordan,
  14: P3.Aplicacoes,
  15: P4.ProdutoInterno,
  16: P4.GramSchmidt,
  17: P4.MinimosQuadrados,
  18: P4.TeoremaEspetral,
  19: P4.OrtogonaisUnitarias,
  20: P4.SVD,
  21: P4.FormasQuadraticas,
});

const REGISTRY = {
  pt: { AL: al({ P1, P2, P3, P4 }) },
  en: { AL: al({ P1: E1, P2: E2, P3: E3, P4: E4 }) },
} as Record<string, Record<string, Record<number, ComponentType>>>;

export function GuideRenderer({ acronym, order }: { acronym: string; order: number }) {
  const lang = useLang();
  const C = REGISTRY[lang]?.[acronym]?.[order] ?? REGISTRY.pt[acronym]?.[order];
  if (!C) return null;
  return (
    <article className="guide" lang={lang}>
      <C />
    </article>
  );
}
