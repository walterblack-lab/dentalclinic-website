import { clinic, navLinks, photoCredits, treatments } from "@/content/clinic";
import { LumeMark } from "../ui/icons";
import { TreatmentLink } from "../ui/TreatmentLink";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.top}>
          <div className={styles.brand}>
            <a href="#top" className={styles.logo} aria-label="Vissza az oldal tetejére">
              <LumeMark size={32} />
              <span>{clinic.fullName}</span>
            </a>
            <p>
              Magánfogászat Szeged belvárosában.
              <br />
              {clinic.street}, {clinic.district}
            </p>
          </div>

          <nav aria-label="Kezelések" className={styles.col}>
            <h2>Kezelések</h2>
            <ul>
              {treatments.map((t) => (
                <li key={t.id}>
                  <TreatmentLink treatment={t.id}>{t.name}</TreatmentLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Oldaltérkép" className={styles.col}>
            <h2>Oldal</h2>
            <ul>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
              <li>
                <a href="#foglalas">Időpontfoglalás</a>
              </li>
            </ul>
          </nav>

          <div className={styles.col}>
            <h2>Kapcsolat</h2>
            <ul>
              <li>
                <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
              </li>
              <li>{clinic.phone}</li>
              <li>H–Cs 7:30–19:30, P 7:30–16:00</li>
              <li>Szo 9:00–13:00</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.demo}>
            A Lumé Fogászati Stúdió fiktív rendelő. Ez az oldal a <strong>NOVA Studio</strong> portfóliójának
            bemutatómunkája, valódi foglalást nem fogad.
          </p>
          <p className={styles.credits}>
            Fotók: Wikimedia Commons:{" "}
            {photoCredits.map((c, i) => (
              <span key={c.url}>
                <a href={c.url} target="_blank" rel="noopener noreferrer">
                  {c.by}
                </a>{" "}
                ({c.licence}){i < photoCredits.length - 1 ? ", " : "."}
              </span>
            ))}
          </p>
          <p className={styles.copy}>© 2026 NOVA Studio</p>
        </div>
      </div>
    </footer>
  );
}
