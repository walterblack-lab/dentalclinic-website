/**
 * All clinic copy lives here, so a real client's content can be swapped in
 * without touching components. Lumé is a fictional practice (NOVA Studio demo).
 */

export const clinic = {
  name: "Lumé",
  fullName: "Lumé Fogászati Stúdió",
  city: "Szeged",
  street: "Kárász utca",
  district: "Belváros",
  email: "rendelo@lume-fogaszat.example",
  phone: "+36 62 000 000",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=K%C3%A1r%C3%A1sz+utca+Szeged",
  hours: [
    { days: "Hétfő – Csütörtök", time: "7:30 – 19:30" },
    { days: "Péntek", time: "7:30 – 16:00" },
    { days: "Szombat", time: "9:00 – 13:00" },
    { days: "Vasárnap", time: "Zárva" },
  ],
} as const;

export const navLinks = [
  { href: "#kezelesek", label: "Kezelések" },
  { href: "#rendelo", label: "Rendelő" },
  { href: "#szemleletunk", label: "Szemléletünk" },
  { href: "#gyik", label: "GYIK" },
  { href: "#kapcsolat", label: "Kapcsolat" },
] as const;

export type TreatmentId =
  | "altalanos"
  | "esztetikai"
  | "feherites"
  | "implantologia"
  | "fogszabalyozas"
  | "szajhigienia";

export interface Treatment {
  id: TreatmentId;
  name: string;
  short: string;
  description: string;
  duration: string;
}

export const treatments: Treatment[] = [
  {
    id: "altalanos",
    name: "Általános fogászat",
    short: "Szűrés, tömés, gyökérkezelés",
    description:
      "Évente két alapos átvizsgálás, digitális röntgen és fogszínű tömések. A kis problémákat időben megtaláljuk, mielőtt nagyok lennének.",
    duration: "30–60 perc",
  },
  {
    id: "esztetikai",
    name: "Esztétikai fogászat",
    short: "Héjak, koronák, mosolytervezés",
    description:
      "Digitális mosolytervvel indulunk: a kezelés előtt látja, hogyan fog kinézni. Kerámia héjak és koronák, a saját fogai színéhez és formájához igazítva.",
    duration: "Tervezés: 60 perc",
  },
  {
    id: "feherites",
    name: "Fogfehérítés",
    short: "Rendelői és otthoni fehérítés",
    description: "Kíméletes, zománcbarát gél, akár 4–8 árnyalatnyi különbséggel, egyetlen 90 perces alkalommal.",
    duration: "90 perc",
  },
  {
    id: "implantologia",
    name: "Implantológia",
    short: "Egy foghiánytól a teljes ívig",
    description:
      "3D CBCT-felvétel és sablonnal vezetett beültetés, így a beavatkozás rövidebb, a gyógyulás gyorsabb.",
    duration: "Konzultáció: 45 perc",
  },
  {
    id: "fogszabalyozas",
    name: "Fogszabályozás",
    short: "Láthatatlan sínek, rögzített készülék",
    description: "Átlátszó sínekkel vagy esztétikus rögzített készülékkel, gyermekeknek és felnőtteknek.",
    duration: "Konzultáció: 45 perc",
  },
  {
    id: "szajhigienia",
    name: "Szájhigiéniai kezelések",
    short: "Fogkő-eltávolítás, airflow, polírozás",
    description:
      "Ultrahangos fogkő-eltávolítás, airflow-tisztítás és személyre szabott otthoni ápolási tanácsok dentálhigiénikusunktól.",
    duration: "50 perc",
  },
];

export const treatmentById = (id: string | undefined) => treatments.find((t) => t.id === id);

export const values = [
  {
    title: "Modern technológia",
    text: "Intraorális szkenner lenyomatkanál helyett, 3D CBCT-diagnosztika és mikroszkóppal végzett gyökérkezelés.",
  },
  {
    title: "Személyre szabott terv",
    text: "Írásos kezelési tervet kap, lépésekre és költségekre bontva. Nincs meglepetés a számlán.",
  },
  {
    title: "Kényelem minden percben",
    text: "Zajszűrős fejhallgató, meleg takaró és szünet, amikor kéri. A tempót Ön diktálja.",
  },
  {
    title: "Idő, ami Önnek jár",
    text: "Óránként legfeljebb egy pácienst fogadunk székenként. Senkit sem siettetünk.",
  },
] as const;

export const team = [
  { name: "Dr. Halász Réka", role: "Implantológus, rendelővezető" },
  { name: "Dr. Fekete Bence", role: "Fogszabályozó szakorvos" },
  { name: "Dr. Szűcs Dóra", role: "Esztétikai fogorvos" },
  { name: "Varga Lilla", role: "Dentálhigiénikus" },
] as const;

export const steps = [
  {
    title: "Ismerkedés",
    text: "Az első alkalommal főleg beszélgetünk: elmondja, mi zavarja és mit szeretne elérni.",
  },
  {
    title: "Pontos diagnózis",
    text: "Digitális szkennelés és alacsony dózisú röntgen. A felvételeket a képernyőn együtt nézzük át.",
  },
  {
    title: "Átlátható terv",
    text: "Írásban kapja meg a lehetőségeket, előnyeikkel, időigényükkel és pontos áraikkal.",
  },
  {
    title: "Kezelés és gondozás",
    text: "A kezelés után is figyelünk Önre: egy héten belül visszahívjuk, és emlékeztetjük a kontrollra.",
  },
] as const;

export const faqs = [
  {
    q: "Fájdalmas lesz a kezelés?",
    a: "A legtöbb beavatkozás érzéstelenítésben, teljesen fájdalommentesen történik. A szúrás előtt felületi érzéstelenítő gélt használunk, így már a tűt sem érzi. Ha szorong, mondja el nyugodtan: lassabban haladunk, és bármikor szünetet tartunk.",
  },
  {
    q: "Mennyi idő alatt kapok időpontot?",
    a: "Új pácienseknek általában egy héten belül tudunk konzultációt adni. Akut fájdalom esetén aznapra is igyekszünk helyet találni. Ilyenkor kérjük, telefonon keressen.",
  },
  {
    q: "Mit hozzak magammal az első alkalomra?",
    a: "A személyi igazolványát, a TAJ-kártyáját és ha van, a korábbi röntgenfelvételeit vagy leleteit. A szedett gyógyszerek listája is sokat segít.",
  },
  {
    q: "Elfogadják az egészségpénztári kártyát?",
    a: "Igen, a legtöbb hazai egészségpénztár kártyájával fizethet, emellett bankkártyával és átutalással is.",
  },
  {
    q: "Gyermekeket is fogadnak?",
    a: "Hatéves kortól szívesen látjuk a gyerekeket. Az első alkalom inkább játékos ismerkedés, hogy a fogorvosi szék ne legyen ijesztő.",
  },
  {
    q: "Mi a teendő, ha le kell mondanom az időpontot?",
    a: "Kérjük, legalább 24 órával korábban jelezze e-mailben vagy telefonon, hogy az időpontot másnak adhassuk.",
  },
] as const;

export const photoCredits = [
  { by: "Shixart1985", licence: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Dental_treatment_room_featuring_equipment_and_a_chair_in_a_modern_clinic.jpg" },
  { by: "Shixart1985", licence: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Dental_tools_and_equipment_arranged_neatly_on_a_clinical_workstation_at_a_modern_dental_clinic.jpg" },
  { by: "Shixart1985", licence: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:A_dental_professional_in_protective_gear_is_preparing_to_use_an_orange_dental_device.jpg" },
  { by: "Shixart1985", licence: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Smiling_senior_woman_with_curly_hair_portrait.jpg" },
  { by: "Jameswasswa", licence: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Preparing_Teeth_Whitening_Materials_for_Dental_Treatment.jpg" },
  { by: "Jameswasswa", licence: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Precision_and_Care,_A_Dental_Procedure_in_Progress.jpg" },
  { by: "Botulitisz", licence: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:D%C3%B3m_t%C3%A9r_l%C3%A1tk%C3%A9p.jpg" },
] as const;
