import { FC } from "react";
import styles from "./index.module.scss";
import Image from "next/image";
import { CMSContent } from "@/lib/types/cms";

type CardProps = {
  data:CMSContent

};

export const Card: FC<CardProps> = ({ data }) => {
console.log("data:", data);

  return (
    <div className={styles.card}>
      <Image src={data.metadata?.image || ""} alt={ ""} fill sizes="100vw" className={styles.image}/>
      <div className={styles.content}>
        <h2 className={styles.title}>{data.title}</h2>
        <h3 className={styles.subtitle}>{data.metadata?.subtitle}</h3>
        <p className={styles.description}>{data.metadata?.description}</p>
        <a href={data.metadata?.link || ""}>
          <button className={styles.cardButton}>
          Подробнее о проекте

          </button>
          </a>
      </div>
    </div>
  );
};
