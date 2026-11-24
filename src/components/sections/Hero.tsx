import { Photo } from "../ui/Photo";
import { ArrowRight, ClockIcon, ShieldIcon } from "../ui/icons";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={styles.glow} aria-hidden />
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={`${styles.eyebrow} ${styles.enter}`} style={{ "--d": "40ms" } as React.CSSProperties}>
            Magánfogászat · Szeged, Belváros
          </p>
          <h1 id="hero-title" className={`${styles.title} ${styles.enter}`} style={{ "--d": "120ms" } as React.CSSProperties}>
            Fogászat, amitől <span className="serif">nem&nbsp;kell</span> tartani.
          </h1>
          <p className={`${styles.lead} ${styles.enter}`} style={{ "--d": "220ms" } as React.CSSProperties}>
            Pontos diagnózis, fájdalommentes kezelés és mindig annyi idő, amennyire Önnek szüksége van. Rendelőnk
            a Kárász utcában, a Dóm tértől pár perc sétára várja.
          </p>
          <div className={`${styles.ctas} ${styles.enter}`} style={{ "--d": "320ms" } as React.CSSProperties}>
            <a href="#foglalas" className="btn">
              Időpontfoglalás
              <ArrowRight />
            </a>
            <a href="#kezelesek" className="btn btn--ghost">
              Szolgáltatásaink
            </a>
          </div>
          <ul className={`${styles.facts} ${styles.enter}`} style={{ "--d": "420ms" } as React.CSSProperties}>
            <li>
              <strong>7:30</strong>
              <span>hétköznap ilyenkor nyitunk</span>
            </li>
            <li>
              <strong>Szombaton</strong>
              <span>is fogadjuk</span>
            </li>
            <li>
              <strong>Írásos</strong>
              <span>kezelési tervet kap</span>
            </li>
          </ul>
        </div>

        <div className={`${styles.visual} ${styles.enterVisual}`}>
          <div className={styles.frame}>
            <Photo
              name="treatment-room"
              priority
              sizes="(max-width: 900px) 92vw, 46vw"
              alt="Napfényes kezelőhelyiség világos kezelőszékkel és rendezett műszerasztallal"
            />
          </div>

          <div className={`${styles.chip} ${styles.chipTop} glass`} aria-hidden>
            <span className={styles.chipIcon}>
              <ShieldIcon size={18} />
            </span>
            <span>
              <strong>3D diagnosztika</strong>
              <small>alacsony dózisú CBCT</small>
            </span>
          </div>

          <div className={`${styles.chip} ${styles.chipBottom} glass`} aria-hidden>
            <span className={`${styles.chipIcon} ${styles.chipIconBlue}`}>
              <ClockIcon size={18} />
            </span>
            <span>
              <strong>Első konzultáció</strong>
              <small>45 perc, sietség nélkül</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
