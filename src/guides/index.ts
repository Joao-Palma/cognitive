/** Índice (server-safe) dos guias interativos escritos à mão: acrónimo → ordens dos tópicos com guia. */
export const GUIDE_INDEX: Record<string, number[]> = {
  AL: Array.from({ length: 21 }, (_, i) => i + 1),
};

/** Tópicos com guia que qualquer utilizador pode ver (amostra grátis). */
export const FREE_PREVIEW: Record<string, number[]> = { AL: [1] };

export const hasGuide = (acronym: string, order: number) => GUIDE_INDEX[acronym]?.includes(order) ?? false;
export const isFreePreview = (acronym: string, order: number) => FREE_PREVIEW[acronym]?.includes(order) ?? false;
