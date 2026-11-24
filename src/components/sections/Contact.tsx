import { clinic } from "@/content/clinic";
import { Photo } from "../ui/Photo";
import { ArrowRight, MailIcon, PhoneIcon, PinIcon } from "../ui/icons";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="kapcsolat" className={styles.section} aria-labelledby="contact-title">
      <div className="wrap">
        <header className={styles.head} data-reveal>
          <p className="eyebrow">Kapcsolat</p>
          <h2 id="contact-title" className="section-title">
            Szeged szívében, <span className="serif">a Dóm tér mellett.</span>
          </h2>
        </header>

        <div className={styles.stage} data-reveal>
          <div className={styles.photo}>
            <Photo
              name="dom-ter"
              sizes="(max-width: 900px) 100vw, 1200px"
              alt="A szegedi Dóm tér téglaárkádjai napsütésben, felhős égbolttal"
            />
          </div>

          <div className={`${styles.card} glass`}>
            <dl className={styles.details}>
              <div>
                <dt>
                  <PinIcon size={18} />
                  Cím
                </dt>
                <dd>
                  {clinic.street}, {clinic.city}
                  <small>{clinic.district}, pár perc sétára a Dóm tértől</small>
                </dd>
              </div>
              <div>
                <dt>
                  <MailIcon size={18} />
                  E-mail
                </dt>
                <dd>
                  <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
                </dd>
              </div>
              <div>
                <dt>
                  <PhoneIcon size={18} />
                  Telefon
                </dt>
                <dd>{clinic.phone}</dd>
              </div>
            </dl>

            <div className={styles.hours}>
              <p className={styles.hoursTitle}>Rendelési idő</p>
              <table>
                <tbody>
                  {clinic.hours.map((h) => (
                    <tr key={h.days}>
                      <th scope="row">{h.days}</th>
                      <td data-closed={h.time === "Zárva"}>{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.actions}>
              <a href={clinic.mapsUrl} className="btn btn--quiet" target="_blank" rel="noopener noreferrer">
                Útvonaltervezés
                <ArrowRight />
              </a>
              <a href="#foglalas" className="btn">
                Időpontfoglalás
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
