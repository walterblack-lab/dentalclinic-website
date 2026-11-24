import type { CSSProperties } from "react";
import { treatmentById, type TreatmentId } from "@/content/clinic";
import { Photo } from "../ui/Photo";
import { TreatmentLink } from "../ui/TreatmentLink";
import { ArrowRight } from "../ui/icons";
import styles from "./Services.module.css";

const t = (id: TreatmentId) => treatmentById(id)!;

function TileFooter({ id }: { id: TreatmentId }) {
  const item = t(id);
  return (
    <div className={styles.tileFooter}>
      <span className={styles.duration}>{item.duration}</span>
      <TreatmentLink treatment={id} className={styles.book} aria-label={`Időpontot kérek: ${item.name}`}>
        Időpontot kérek
        <ArrowRight size={14} />
      </TreatmentLink>
    </div>
  );
}

function TileText({ id, as: Tag = "h3" }: { id: TreatmentId; as?: "h3" }) {
  const item = t(id);
  return (
    <>
      <p className={styles.kicker}>{item.short}</p>
      <Tag className={styles.tileTitle}>{item.name}</Tag>
      <p className={styles.tileText}>{item.description}</p>
    </>
  );
}

const SHADES = ["#d9c6a5", "#e0cfb2", "#e6d8bf", "#ebe0cb", "#efe6d6", "#f3ece0", "#f6f1e9", "#faf7f1"];

export function Services() {
  return (
    <section id="kezelesek" className={styles.section} aria-labelledby="services-title">
      <div className="wrap">
        <header className={styles.head} data-reveal>
          <p className="eyebrow">Kezelések</p>
          <h2 id="services-title" className="section-title">
            A szűréstől az <span className="serif">implantátumig.</span>
          </h2>
          <p className="section-lead">
            Minden kezelés azzal kezdődik, hogy alaposan megnézzük, mire van valóban szüksége. A lehetőségekről csak
            ezután beszélünk.
          </p>
        </header>

        <div className={styles.bento}>
          {/* Esztétikai — photo-led, the largest tile */}
          <article className={`${styles.tile} ${styles.aesthetic}`} data-reveal>
            <div className={styles.media}>
              <Photo
                name="curing-light"
                sizes="(max-width: 900px) 92vw, 680px"
                alt="Fogorvos kezében fénypolimerizációs lámpa narancssárga szűrővel"
              />
            </div>
            <div className={styles.body}>
              <TileText id="esztetikai" />
              <TileFooter id="esztetikai" />
            </div>
          </article>

          {/* Fehérítés — photo + glass shade scale */}
          <article className={`${styles.tile} ${styles.whitening}`} data-reveal style={{ "--reveal-delay": "80ms" } as CSSProperties}>
            <div className={styles.media}>
              <Photo
                name="whitening"
                sizes="(max-width: 900px) 92vw, 480px"
                alt="Fogfehérítő gél előkészítése kesztyűs kézzel, mellette színkulcs"
              />
              <div className={`${styles.shades} glass`} aria-hidden>
                <div className={styles.shadeRow}>
                  {SHADES.map((c) => (
                    <span key={c} style={{ background: c }} />
                  ))}
                  <span className={styles.shadeMarker} />
                </div>
                <div className={styles.shadeLabels}>
                  <span>Előtte</span>
                  <span>Utána</span>
                </div>
              </div>
            </div>
            <div className={styles.body}>
              <TileText id="feherites" />
              <TileFooter id="feherites" />
            </div>
          </article>

          {/* Általános — instruments photo */}
          <article className={`${styles.tile} ${styles.general}`} data-reveal>
            <div className={styles.media}>
              <Photo
                name="instruments"
                sizes="(max-width: 900px) 92vw, 380px"
                alt="Sterilizált fogászati kézi műszerek üvegpohárban"
              />
            </div>
            <div className={styles.body}>
              <TileText id="altalanos" />
              <TileFooter id="altalanos" />
            </div>
          </article>

          {/* Implantológia — dark, typographic */}
          <article className={`${styles.tile} ${styles.implant}`} data-reveal style={{ "--reveal-delay": "80ms" } as CSSProperties}>
            <div className={styles.implantVisual} aria-hidden>
              <span className={styles.bigNumber}>3D</span>
              <svg viewBox="0 0 120 160" className={styles.implantSvg}>
                <path d="M38 22c0-9 8-14 22-14s22 5 22 14v10H38z" />
                <rect x="50" y="36" width="20" height="10" rx="2" />
                {Array.from({ length: 7 }, (_, i) => (
                  <path key={i} d={`M44 ${54 + i * 13}h32l-3 9H47z`} style={{ "--i": i } as CSSProperties} />
                ))}
              </svg>
            </div>
            <div className={styles.body}>
              <TileText id="implantologia" />
              <TileFooter id="implantologia" />
            </div>
          </article>

          {/* Fogszabályozás — dots that straighten on hover */}
          <article className={`${styles.tile} ${styles.ortho}`} data-reveal style={{ "--reveal-delay": "160ms" } as CSSProperties}>
            <div className={styles.orthoVisual} aria-hidden>
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} style={{ "--o": `${[10, -8, 14, -4, 6, -12, 9, -6, 12][i]}px`, "--r": `${[8, -6, 10, -3, 4, -9, 7, -5, 8][i]}deg` } as CSSProperties} />
              ))}
            </div>
            <div className={styles.body}>
              <TileText id="fogszabalyozas" />
              <TileFooter id="fogszabalyozas" />
            </div>
          </article>

          {/* Szájhigiénia — wide, calm */}
          <article className={`${styles.tile} ${styles.hygiene}`} data-reveal>
            <div className={styles.body}>
              <TileText id="szajhigienia" />
              <TileFooter id="szajhigienia" />
            </div>
            <div className={styles.hygieneAside} aria-hidden>
              <p className={styles.bigWord}>
                Félévente<span>ennyi kell egy egészséges fogsornak.</span>
              </p>
              <ul className={styles.steps}>
                <li>Fogkő-eltávolítás</li>
                <li>Airflow</li>
                <li>Polírozás</li>
                <li>Fluoridálás</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
