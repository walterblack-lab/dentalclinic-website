import type { CSSProperties } from "react";
import { team, values } from "@/content/clinic";
import { Photo } from "../ui/Photo";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="rendelo" className={styles.section} aria-labelledby="about-title">
      <div className="wrap">
        <p className="eyebrow" data-reveal>
          A rendelő
        </p>
        <h2 id="about-title" className={styles.statement} data-reveal>
          Négy kezelőszék, négy orvos és egy elv: <span className={styles.muted}>csak azt javasoljuk, amit a saját
          családunknak is javasolnánk.</span>
        </h2>

        <div className={styles.grid}>
          <figure className={styles.portrait} data-reveal>
            <Photo
              name="portrait"
              sizes="(max-width: 900px) 92vw, 460px"
              alt="Mosolygó, ősz hajú nő világos pulóverben, nyugodt otthoni környezetben"
            />
          </figure>

          <div className={styles.content}>
            <p className={styles.intro} data-reveal>
              A Lumé 2016 óta működik Szeged belvárosában. Kis csapattal dolgozunk, mert így minden páciensünket
              név szerint ismerjük, és a második alkalommal már nem kell elölről elmesélnie a történetét.
            </p>

            <ol className={styles.values}>
              {values.map((v, i) => (
                <li key={v.title} data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as CSSProperties}>
                  <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{v.title}</h3>
                    <p>{v.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className={styles.team} data-reveal>
              <h3 className={styles.teamTitle}>Csapatunk</h3>
              <ul>
                {team.map((m) => (
                  <li key={m.name}>
                    <span className={styles.avatar} aria-hidden>
                      {m.name
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </span>
                    <span>
                      <strong>{m.name}</strong>
                      <small>{m.role}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
