import { GoogleGenAI, Type } from "@google/genai";
import { GameWord, Difficulty } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FALLBACK_WORDS: GameWord[] = [
  { word: "JAVASCRIPT", category: "Programação", hints: ["Linguagem da web", "Usada com React", "Executa no navegador"] },
  { word: "REACT", category: "Biblioteca", hints: ["Criado pelo Facebook", "Baseado em componentes", "Usa JSX"] },
  { word: "TYPESCRIPT", category: "Linguagem", hints: ["Superset do JS", "Adiciona tipagem estática", "Compila para JS"] },
  { word: "GEMINI", category: "IA", hints: ["Modelo do Google", "Multimodal", "Concorrente do GPT"] },
  { word: "ALGORITMO", category: "Ciência da Computação", hints: ["Sequência de passos", "Resolve problemas", "Fundamental em lógica"] }
];

export const generateWord = async (customTopic?: string, difficulty: Difficulty = Difficulty.MEDIUM): Promise<GameWord> => {
  try {
    const model = "gemini-2.5-flash";
    
    let difficultyPrompt = "";
    switch (difficulty) {
      case Difficulty.EASY:
        difficultyPrompt = "A palavra deve ser comum e fácil de adivinhar.";
        break;
      case Difficulty.MEDIUM:
        difficultyPrompt = "A palavra deve ser de dificuldade moderada, nem muito óbvia nem impossível.";
        break;
      case Difficulty.HARD:
        difficultyPrompt = "A palavra deve ser complexa, rara ou abstrata. Desafie o jogador.";
        break;
    }

    const prompt = customTopic 
      ? `Gere uma palavra para jogo da forca sobre o tema: "${customTopic}". ${difficultyPrompt} Retorne JSON.`
      : `Gere uma palavra aleatória para jogo da forca (geografia, ciência, artes, etc). ${difficultyPrompt} Retorne JSON.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING, description: "A palavra para o jogo (sem espaços, caixa alta)." },
            category: { type: Type.STRING, description: "A categoria da palavra." },
            hints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Uma lista de exatamente 3 dicas, da mais vaga para a mais óbvia." 
            },
          },
          required: ["word", "category", "hints"],
        },
        temperature: 1.0,
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text) as GameWord;
      return {
        ...data,
        word: data.word.toUpperCase().trim().replace(/[^A-ZÃÁÀÂÄÇÉÈÊËÍÌÎÏÕÓÒÔÖÚÙÛÜÑ]/g, ''),
        hints: data.hints.slice(0, 3) // Ensure max 3
      };
    }
    throw new Error("No text returned");
  } catch (error) {
    console.error("Gemini API failed, using fallback:", error);
    return FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
  }
};