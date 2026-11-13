// README → Busca → "1. Interpretação dos termos"
// Ex.: "mirage smoke tr jungle" → mapa=mirage, tipo=SMOKE, lado=TR, texto="jungle"

export interface ParsedSearch {
    map?: string;
    side?: string;
    region?: string;
    type?: string;
    words: string[]; // o que sobrou para a busca textual
}

// Usamos Map (e não objeto comum) para evitar que palavras como
// "constructor" ou "toString" sejam confundidas com propriedades internas.
const TYPE_ALIASES = new Map<string, string>([
    ["smoke", "SMOKE"],
    ["smokes", "SMOKE"],
    ["fumaca", "SMOKE"],
    ["flash", "FLASH"],
    ["flashes", "FLASH"],
    ["flashbang", "FLASH"],
    ["molotov", "MOLOTOV"],
    ["molly", "MOLOTOV"],
    ["molo", "MOLOTOV"],
    ["incendiaria", "MOLOTOV"],
    ["he", "HE"],
    ["granada", "HE"],
]);

const SIDE_ALIASES = new Map<string, string>([
    ["tr", "TR"],
    ["t", "TR"],
    ["ct", "CT"],
]);

const REGION_ALIASES = new Map<string, string>([
    ["a", "A"],
    ["b", "B"],
    ["mid", "MID"],
    ["meio", "MID"],
]);

// Palavras que não ajudam a encontrar nada ("smoke PARA a jungle")
const STOPWORDS = new Set([
    "de", "da", "do", "das", "dos", "para", "pra",
    "no", "na", "nos", "nas", "o", "os", "as", "e", "em", "com", "um", "uma",
]);

// "Fumaça" → "fumaca": minúsculas e sem acentos
export function normalizeText(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function parseSearch(
    query: string,
    mapAliases: Map<string, string>,
): ParsedSearch {
    const result: ParsedSearch = { words: [] };

    // Quebra em palavras, descartando pontuação e símbolos
    const tokens = normalizeText(query)
        .split(/[^a-z0-9]+/)
        .filter(Boolean);

    for (const token of tokens) {
        const map = mapAliases.get(token);
        if (map) {
            result.map ??= map; // ??= só preenche se ainda estiver vazio
            continue;
        }

        const type = TYPE_ALIASES.get(token);
        if (type) {
            result.type ??= type;
            continue;
        }

        const side = SIDE_ALIASES.get(token);
        if (side) {
            result.side ??= side;
            continue;
        }

        const region = REGION_ALIASES.get(token);
        if (region) {
            result.region ??= region;
            continue;
        }

        if (!STOPWORDS.has(token)) {
            result.words.push(token);
        }
    }

    return result;
}

// README → Busca → "2. Busca textual"
// ["jungle", "palace"] → "+jungle* +palace*"
//   +  = a palavra é obrigatória
//   *  = aceita o começo da palavra ("jung" encontra "jungle")
// O índice FULLTEXT do MySQL ignora palavras com menos de 3 letras.
export function toFullTextQuery(words: string[]) {
    const terms = words
        .filter((word) => word.length >= 3)
        .map((word) => `+${word}*`);

    return terms.length > 0 ? terms.join(" ") : undefined;
}