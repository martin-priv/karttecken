# 🌲 Vanliga karttecken - Orienteringsquiz

Ett interaktivt och snabbt träningsquiz för att lära sig de vanligaste karttecknen och symbolerna på en svensk orienteringskarta.

Appen bygger på referensarket *"Vanliga karttecken"* och presenterar ett tecken i taget utan text.

## 🎯 Funktioner

- **21 isolerade karttecken** i hög kvalitet (inga störande textetiketter):
  - **Vit & Gul:** Skog (vit kartfärg), Äng/öppen gräsyta, Odlad mark (åker)
  - **Grön & Blå:** Tät skog, Tomtmark, Vatten, Sankmark
  - **Svart:** Byggnad, (Stor) Kraftledning, Liten stig, Sten, Brant, Väg, Mindre väg, Stor stig, Grupp av stenar
  - **Brun:** Höjdkurvor, Stor grop, Liten grop (grävd), Liten grop (naturlig), Punkthöjd
- **Två spellägen:**
  1. **1 X 2 (Flerval):** Klassisk tipskupongsstil med 3 alternativ per fråga och tangentbordsstöd (`1`, `X`, `2`).
  2. **Fritext (med stavningstolerans):** Skriv in svaret själv. Inbyggd Levenshtein-algoritm som godkänner mindre stavfel, synonymer och saknade å/ä/ö (t.ex. *kraftlednig*, *bygnad*, *hojdkurvor*).
- **Kategorifilter:** Träna på alla tecken samtidigt eller filtrera på en specifik färgkategori (*Vit*, *Gul*, *Grön*, *Blå*, *Svart*, *Brun*).
- **Direkt återkoppling & beskrivningar:** Lär dig vad symbolen betyder och viktiga orienteringsregler (t.ex. att tomtmark och odlad mark är förbjuden mark).
- **Orienteringslexikon / Uppslagsbok:** Se alla tecken, färger och förklaringar samlade på ett ställe.
- **Poäng, streaks & felträning:** Håll koll på dina rätta svar i rad (🔥) och få möjlighet att öva enbart på tecken du missade.
- **Responsiv & mobilanpassad:** Fungerar lika bra i mobilen ute i skogen som på datorn.

## 🚀 Kom igång lokalt

Appen kräver inga externa bibliotek eller byggsteg – den kan öppnas direkt i en webbläsare eller köras med en enkel lokal HTTP-server:

```bash
# Starta enkel lokal server i projektmappen:
python3 -m http.server 8080
```

Öppna sedan [http://localhost:8080](http://localhost:8080) i din webbläsare.

## ⌨️ Tangentbordsgenvägar

- **1 X 2-läge:** Tryck `1`, `X` eller `2` för att svara.
- **Fritext-läge:** Skriv och tryck `Enter` för att svara.
- **Nästa fråga:** Tryck `Mellanslag` eller `Enter` för att gå vidare.
