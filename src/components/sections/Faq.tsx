"use client";

import { useId, useState } from "react";
import { clinic, faqs } from "@/content/clinic";
import { PlusIcon } from "../ui/icons";
import styles from "./Faq.module.css";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="gyik" className={styles.section} aria-labelledby="faq-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.intro} data-reveal>
          <p className="eyebrow">Gyakori kérdések</p>
          <h2 id="faq-title" className="section-title">
            Amit az első <span className="serif">időpont előtt</span> kérdezni szoktak.
          </h2>
          <p className="section-lead">
            Ha nem találja a választ, írjon nekünk a{" "}
            <a className={styles.mail} href={`mailto:${clinic.email}`}>
              {clinic.email}
            </a>{" "}
            címre. Munkanapokon egy órán belül válaszolunk.
          </p>
        </div>

        <div className={styles.list}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const btnId = `${base}-q${i}`;
            const panelId = `${base}-a${i}`;
            return (
              <div key={f.q} className={styles.item} data-open={isOpen}>
                <h3 className={styles.q}>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{f.q}</span>
                    <span className={styles.icon} aria-hidden>
                      <PlusIcon size={16} />
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={btnId} className={styles.panel} inert={!isOpen}>
                  <div className={styles.panelInner}>
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
