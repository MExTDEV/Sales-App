import de from "@/locales/de.json";
import fr from "@/locales/fr.json";
import nl from "@/locales/nl.json";
import type { Language } from "@/types/sales";

const dictionaries: Record<Language, Record<string, string>> = { nl, fr, de };

export function translate(language: Language, key: string): string {
  return dictionaries[language][key] ?? dictionaries.nl[key] ?? key;
}
