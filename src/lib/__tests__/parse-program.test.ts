import { describe, expect, it } from "vitest";
import { parseProgram, cleanAcronym } from "../parse-program";

describe("parseProgram", () => {
  it("uma linha por tópico (PO)", () => {
    const raw =
      "Introdução aos objectos: definição; classes. \r\nHerança e composição: \"final\". \r\nPolimorfismo; Classes abstractas e interfaces. \r\nTipos paramétricos. \r\n";
    expect(parseProgram(raw)).toEqual([
      "Introdução aos objectos: definição; classes",
      'Herança e composição: "final"',
      "Polimorfismo; Classes abstractas e interfaces",
      "Tipos paramétricos",
    ]);
  });

  it("numeração com sub-tópicos agrega no pai", () => {
    const raw = "1. Processos\n1.1 Escalonamento\n1.2 Sincronização\n2. Memória\n3. Ficheiros";
    expect(parseProgram(raw)).toEqual(["Processos; Escalonamento; Sincronização", "Memória", "Ficheiros"]);
  });

  it("parágrafo único com numeração inline", () => {
    const raw = "1. Descrição do movimento no espaço. 2. Leis de Newton e aplicações. 3. Trabalho e energia.";
    expect(parseProgram(raw)).toEqual(["Descrição do movimento no espaço", "Leis de Newton e aplicações", "Trabalho e energia"]);
  });

  it("parágrafo único com frases (ESof)", () => {
    const raw = "Introdução à Engenharia de Software. Desenho de Software. Escrita de Programas. Testes de software.";
    expect(parseProgram(raw)).toEqual([
      "Introdução à Engenharia de Software",
      "Desenho de Software",
      "Escrita de Programas",
      "Testes de software",
    ]);
  });

  it("HTML e entidades", () => {
    expect(parseProgram("<p>&Aacute;rvores</p><p>Grafos &amp; caminhos</p><p>Fun&ccedil;&otilde;es de dispers&atilde;o</p>")).toEqual([
      "Árvores",
      "Grafos & caminhos",
      "Funções de dispersão",
    ]);
  });

  it("acrónimos", () => {
    expect(cleanAcronym("IAED23610")).toBe("IAED");
    expect(cleanAcronym("CDI18", "Cálculo Diferencial e Integral III")).toBe("CDI-III");
    expect(cleanAcronym("ESof23610-", "Engenharia de Software")).toBe("ESof");
    expect(cleanAcronym("PEstatisticad103610", "Probabilidade e Estatística")).toBe("PE");
    expect(cleanAcronym("Fis9", "Física II")).toBe("Fis-II");
    expect(cleanAcronym("SO")).toBe("SO");
  });
});
