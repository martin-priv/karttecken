/**
 * Vanliga karttecken - Datadefinition för orienteringssymboler
 * Baserad på Svenska Orienteringsförbundets kartnorm och referensarket "Vanliga karttecken"
 */

const CATEGORIES = {
  alla: { id: "alla", name: "Alla tecken", color: "#374151", bg: "#f3f4f6" },
  vit: { id: "vit", name: "Vit (Skog)", color: "#1f2937", bg: "#f9fafb" },
  gul: { id: "gul", name: "Gul (Öppen mark)", color: "#b45309", bg: "#fef3c7" },
  gron: { id: "gron", name: "Grön (Tät skog & tomt)", color: "#15803d", bg: "#dcfce7" },
  bla: { id: "bla", name: "Blå (Vatten & sankmark)", color: "#0369a1", bg: "#e0f2fe" },
  svart: { id: "svart", name: "Svart (Byggt & sten)", color: "#111827", bg: "#f3f4f6" },
  brun: { id: "brun", name: "Brun (Höjdformationer)", color: "#9a3412", bg: "#ffedd5" }
};

const SYMBOLS = [
  // --- VIT & GUL ---
  {
    id: "skog_vit",
    name: "Skog (vit kartfärg)",
    shortName: "Skog",
    category: "vit",
    categoryLabel: "Vit: Skog",
    image: "assets/symbols/skog_vit.png",
    description: "Vit yta på kartan betyder vanlig skog där du kan springa obehindrat (lättlöpt skog).",
    aliases: [
      "skog", "vit", "skog vit", "vit skog", "vanlig skog", "lättlöpt skog",
      "öppen skog", "normal skog", "skogsmark"
    ],
    distractors: ["Äng/öppen gräsyta", "Tät skog", "Tomtmark"]
  },
  {
    id: "ang_oppen_grasyta",
    name: "Äng / öppen gräsyta",
    shortName: "Äng / öppen gräsyta",
    category: "gul",
    categoryLabel: "Gul: Öppen mark",
    image: "assets/symbols/ang_oppen_grasyta.png",
    description: "Gul färg visar öppen mark utan träd, t.ex. ängar, gräsmattor eller fotbollsplaner.",
    aliases: [
      "äng", "öppen gräsyta", "äng/öppen gräsyta", "äng öppen gräsyta", "öppen mark",
      "gräsyta", "fotbollsplan", "öppet", "ängsmark", "gräsmatta", "öppen äng", "fält"
    ],
    distractors: ["Odlad mark (åker)", "Tomtmark", "Skog (vit kartfärg)"]
  },
  {
    id: "odlad_mark_aker",
    name: "Odlad mark (åker)",
    shortName: "Odlad mark (åker)",
    category: "gul",
    categoryLabel: "Gul: Öppen mark",
    image: "assets/symbols/odlad_mark_aker.png",
    description: "Gul yta med svarta punkter betyder odlad mark eller åker. Får ej beträdas under växtsäsong!",
    aliases: [
      "odlad mark", "åker", "odlad mark (åker)", "odlad mark åker", "åkermark",
      "odling", "odlingsmark", "åker mark", "odlad mark/åker"
    ],
    distractors: ["Äng/öppen gräsyta", "Tomtmark", "Sankmark"]
  },

  // --- GRÖN, OLIVGRÖN & BLÅ ---
  {
    id: "tat_skog",
    name: "Tät skog",
    shortName: "Tät skog",
    category: "gron",
    categoryLabel: "Grön: Tät skog",
    image: "assets/symbols/tat_skog.png",
    description: "Grön färg på kartan betyder tät skog där det är svårt att springa och ta sig fram.",
    aliases: [
      "tät skog", "tät vegetation", "tätt", "svårframkomlig skog", "snår",
      "buskage", "grön skog", "tätare skog", "ungskog", "täting"
    ],
    distractors: ["Skog (vit kartfärg)", "Tomtmark", "Äng/öppen gräsyta"]
  },
  {
    id: "tomtmark",
    name: "Tomtmark",
    shortName: "Tomtmark",
    category: "gron",
    categoryLabel: "Olivgrön: Tomtmark",
    image: "assets/symbols/tomtmark.png",
    description: "Olivgrön färg visar privat tomtmark och trädgård. Förbjudet område för orienterare!",
    aliases: [
      "tomtmark", "tomt", "privat tomt", "trädgård", "bebyggd tomt",
      "bostadstomt", "olivgrön tomtmark", "olivgrön"
    ],
    distractors: ["Byggnad", "Tät skog", "Odlad mark (åker)"]
  },
  {
    id: "vatten",
    name: "Vatten",
    shortName: "Vatten",
    category: "bla",
    categoryLabel: "Blå: Vatten",
    image: "assets/symbols/vatten.png",
    description: "Blå yta markerar öppet vatten som sjö, tjärn, damm eller större vattendrag.",
    aliases: [
      "vatten", "sjö", "tärn", "tjärn", "damm", "vattendrag", "hav", "bäck", "vattenyta"
    ],
    distractors: ["Sankmark", "Stor grop", "Tomtmark"]
  },
  {
    id: "sankmark",
    name: "Sankmark",
    shortName: "Sankmark",
    category: "bla",
    categoryLabel: "Blå: Vatten & sankmark",
    image: "assets/symbols/sankmark.png",
    description: "Blå horisontella ränder visar sankmark, myr eller mosse.",
    aliases: [
      "sankmark", "mosse", "myr", "kärr", "sumpmark", "våtmark", "blötmark", "surdrag"
    ],
    distractors: ["Vatten", "Liten stig", "Höjdkurvor"]
  },

  // --- SVART ---
  {
    id: "byggnad",
    name: "Byggnad",
    shortName: "Byggnad",
    category: "svart",
    categoryLabel: "Svart: Bebyggelse & sten",
    image: "assets/symbols/byggnad.png",
    description: "Svart vinklad form visar ett hus eller en byggnad.",
    aliases: [
      "byggnad", "hus", "stuga", "byggnad/hus", "kåk", "lada", "fastighet"
    ],
    distractors: ["Tomtmark", "Grupp av stenar", "Mindre väg"]
  },
  {
    id: "stor_kraftledning",
    name: "(Stor) Kraftledning",
    shortName: "Kraftledning",
    category: "svart",
    categoryLabel: "Svart: Byggda objekt",
    image: "assets/symbols/stor_kraftledning.png",
    description: "Linje med pylonstolpar visar en stor kraftledning genom terrängen.",
    aliases: [
      "kraftledning", "stor kraftledning", "(stor) kraftledning", "(stor)kraftledning",
      "elledning", "högspänningsledning", "ledning", "kraftledningsstolpe", "elstolpe"
    ],
    distractors: ["Väg", "Stor stig", "Mindre väg"]
  },
  {
    id: "liten_stig",
    name: "Liten stig",
    shortName: "Liten stig",
    category: "svart",
    categoryLabel: "Svart: Stigar & vägar",
    image: "assets/symbols/liten_stig.png",
    description: "Tunn streckad linje visar en mindre eller svagare stig.",
    aliases: [
      "liten stig", "stig", "smal stig", "mindre stig", "svag stig", "djurstig"
    ],
    distractors: ["Stor stig", "Mindre väg", "Väg"]
  },
  {
    id: "sten",
    name: "Sten",
    shortName: "Sten",
    category: "svart",
    categoryLabel: "Svart: Sten & berg",
    image: "assets/symbols/sten.png",
    description: "En ensam svart punkt visar en tydlig sten eller ett flyttblock i skogen.",
    aliases: [
      "sten", "stenblock", "flyttblock", "block", "stor sten", "jättesten"
    ],
    distractors: ["Grupp av stenar", "Punkthöjd", "Liten grop (naturlig)"]
  },
  {
    id: "brant",
    name: "Brant",
    shortName: "Brant",
    category: "svart",
    categoryLabel: "Svart: Sten & branter",
    image: "assets/symbols/brant.png",
    description: "Svart linje med kamtaggar (och bruna kurvor ovanför) visar en brant eller ett stup.",
    aliases: [
      "brant", "stup", "bergbrant", "klippa", "klippbrant", "bergstup", "stupbrant"
    ],
    distractors: ["Höjdkurvor", "Stor grop", "Kraftledning"]
  },
  {
    id: "vag",
    name: "Väg",
    shortName: "Väg",
    category: "svart",
    categoryLabel: "Svart: Stigar & vägar",
    image: "assets/symbols/vag.png",
    description: "Dubbellinje med fyllning visar en asfalterad eller större allmän väg.",
    aliases: [
      "väg", "stor väg", "bilväg", "asfalterad väg", "huvudväg", "allmän väg"
    ],
    distractors: ["Mindre väg", "Stor stig", "Liten stig"]
  },
  {
    id: "mindre_vag",
    name: "Mindre väg",
    shortName: "Mindre väg",
    category: "svart",
    categoryLabel: "Svart: Stigar & vägar",
    image: "assets/symbols/mindre_vag.png",
    description: "Mörk heldragen linje visar en mindre grusväg, traktorväg eller skogsbilväg.",
    aliases: [
      "mindre väg", "liten väg", "grusväg", "skogsbilväg", "traktorväg", "körväg"
    ],
    distractors: ["Väg", "Stor stig", "Liten stig"]
  },
  {
    id: "stor_stig",
    name: "Stor stig",
    shortName: "Stor stig",
    category: "svart",
    categoryLabel: "Svart: Stigar & vägar",
    image: "assets/symbols/stor_stig.png",
    description: "Grov streckad linje visar en bred, tydlig och vältrampad stig eller motionsspår.",
    aliases: [
      "stor stig", "bred stig", "tydlig stig", "huvudstig", "motionsspår", "löparspår"
    ],
    distractors: ["Liten stig", "Mindre väg", "Väg"]
  },
  {
    id: "grupp_av_stenar",
    name: "Grupp av stenar",
    shortName: "Grupp av stenar",
    category: "svart",
    categoryLabel: "Svart: Sten & berg",
    image: "assets/symbols/grupp_av_stenar.png",
    description: "Svart triangel markerar en grupp av stenar, stensamling eller ett stenröse.",
    aliases: [
      "grupp av stenar", "stensamling", "stengrupp", "stenröse", "röse", "flera stenar", "blockmark"
    ],
    distractors: ["Sten", "Byggnad", "Liten grop (grävd)"]
  },

  // --- BRUN ---
  {
    id: "hojdkurvor",
    name: "Höjdkurvor",
    shortName: "Höjdkurvor",
    category: "brun",
    categoryLabel: "Brun: Höjdformationer",
    image: "assets/symbols/hojdkurvor.png",
    description: "Bruna linjer som binder samman punkter på samma höjd och visar backar, kullar och åsar.",
    aliases: [
      "höjdkurvor", "höjdkurva", "kulle", "höjd", "nivåkurvor", "backe", "berg", "ås"
    ],
    distractors: ["Stor grop", "Brant", "Sankmark"]
  },
  {
    id: "stor_grop",
    name: "Stor grop",
    shortName: "Stor grop",
    category: "brun",
    categoryLabel: "Brun: Höjdformationer",
    image: "assets/symbols/stor_grop.png",
    description: "Sluten brun ring med lutningsstreck inåt visar en stor grop eller sänka i marken.",
    aliases: [
      "stor grop", "grop", "sänka", "sluten sänka", "sandtag", "grusgrop", "dödisgrop"
    ],
    distractors: ["Höjdkurvor", "Liten grop (naturlig)", "Liten grop (grävd)"]
  },
  {
    id: "liten_grop_gravd",
    name: "Liten grop (grävd)",
    shortName: "Liten grop (grävd)",
    category: "brun",
    categoryLabel: "Brun: Höjdformationer",
    image: "assets/symbols/liten_grop_gravd.png",
    description: "Ett brunt V visar en liten grävd grop eller schaktgrop skapad av människor.",
    aliases: [
      "liten grop (grävd)", "liten grop grävd", "grävd grop", "liten grop", "grop", "schaktgrop", "v-grop"
    ],
    distractors: ["Liten grop (naturlig)", "Stor grop", "Punkthöjd"]
  },
  {
    id: "liten_grop_naturlig",
    name: "Liten grop (naturlig)",
    shortName: "Liten grop (naturlig)",
    category: "brun",
    categoryLabel: "Brun: Höjdformationer",
    image: "assets/symbols/liten_grop_naturlig.png",
    description: "En brun båge / halvmåneform visar en liten naturlig grop eller sänka i terrängen.",
    aliases: [
      "liten grop (naturlig)", "liten grop naturlig", "naturlig grop", "liten grop", "liten sänka", "grop", "sänka"
    ],
    distractors: ["Liten grop (grävd)", "Stor grop", "Punkthöjd"]
  },
  {
    id: "punkthojd",
    name: "Punkthöjd",
    shortName: "Punkthöjd",
    category: "brun",
    categoryLabel: "Brun: Höjdformationer",
    image: "assets/symbols/punkthojd.png",
    description: "En liten brun punkt markerar en punkthöjd (en liten knöl eller kulle i skogen).",
    aliases: [
      "punkthöjd", "liten höjd", "liten kulle", "knöl", "kulle", "höjdpunkt", "höjd"
    ],
    distractors: ["Sten", "Stor grop", "Liten grop (naturlig)"]
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { CATEGORIES, SYMBOLS };
}
