import React, { memo } from 'react';
import Image from 'next/image';

//styles
import styles from '@/scss/card-introduce.module.scss';

interface ICardIntroduceComponent {
  imgSrc: string;
  titleCard: string;
  description: string;
}

const CardIntroduceComponent = ({
  titleCard,
  description,
  imgSrc,
}: ICardIntroduceComponent) => {
  return (
    <div className={styles.wrapperCardIntroduce}>
      <Image src={imgSrc} alt="design_2" width={400} height={250} />
      <h2>{titleCard}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default memo(CardIntroduceComponent);
