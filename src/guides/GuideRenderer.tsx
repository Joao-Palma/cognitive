"use client";
import type { ComponentType } from "react";
import * as P1 from "./al/part1";
import * as P2 from "./al/part2";
import * as P3 from "./al/part3";
import * as P4 from "./al/part4";

const AL: Record<number, ComponentType> = {
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
};

const REGISTRY: Record<string, Record<number, ComponentType>> = { AL };

export function GuideRenderer({ acronym, order }: { acronym: string; order: number }) {
  const C = REGISTRY[acronym]?.[order];
  if (!C) return null;
  return (
    <article className="guide">
      <C />
    </article>
  );
}
