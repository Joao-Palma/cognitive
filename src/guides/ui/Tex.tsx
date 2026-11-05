import katex from "katex";

/** Fórmula inline. O conteúdo é sempre nosso (não vem de utilizadores). */
export function M({ children }: { children: string }) {
  return <span dangerouslySetInnerHTML={{ __html: katex.renderToString(children, { throwOnError: false }) }} />;
}

/** Fórmula em destaque (display). */
export function MD({ children }: { children: string }) {
  return (
    <div
      className="my-3 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: katex.renderToString(children, { throwOnError: false, displayMode: true }) }}
    />
  );
}
