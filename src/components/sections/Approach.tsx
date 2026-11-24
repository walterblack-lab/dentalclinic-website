import type { CSSProperties } from "react";
import { steps } from "@/content/clinic";
import { Photo } from "../ui/Photo";
import styles from "./Approach.module.css";

export function Approach() {
  return (
    <section id="szemleletunk" data-nav-tone="dark" className={styles.section} aria-labelledby="approach-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.lead}>
          <p className="eyebrow">Szemléletünk</p>
          <h2 id="approach-title" className="section-title" data-reveal>
            Előbb megértjük, <span className="serif">aztán kezelünk.</span>
          </h2>
          <p className="section-lead" data-reveal>
            Nem kínálunk csomagokat, és nem sürgetünk döntést. Minden kezelés négy, előre ismert lépésből áll, így
            mindig tudja, hol tartunk.
          </p>
          <figure className={styles.photo} data-reveal>
            <Photo
              name="procedure"
              sizes="(max-width: 900px) 92vw, 520px"
              alt="Fogorvos kezelés közben, nagyító szemüvegben, a monitoron a páciens fogainak képe"
            />
          </figure>
        </div>

        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.title} data-reveal style={{ "--reveal-delay": `${i * 60}ms` } as CSSProperties}>
              <span className={styles.num} aria-hidden>
                {i + 1}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
