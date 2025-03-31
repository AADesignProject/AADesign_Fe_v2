import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

//components
import SEOHeaderComponent from '@/components/seo-header';
import HeaderTitlePage from '@/components/header-title-page';
import CardIntroduceComponent from '@/components/card-introduce';

//styles
import styles from '@/scss/construction-page.module.scss';

const fakeData = [
  {
    imgSrc: 'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_2.webp',
    titleCard: 'Private sigondasdas check',
    description:
      '“Private Villa Sài Gòn” một công trình tư nhân do NTK Quách Thái Công thực hiện kiến trúc và nội thất. Với phong cách nội thất mang hơi hướng cổ điển, chất lượng cao, đây là hứa hẹn một công trình mang dấu ấn Thái Công và sẽ xuất hiện trong quyển sách sắp đến.',
  },
  {
    imgSrc: 'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_3.webp',
    titleCard: 'Private sigondasdas check',
    description:
      '“Private Villa Sài Gòn” một công trình tư nhân do NTK Quách Thái Công thực hiện kiến trúc và nội thất. Với phong cách nội thất mang hơi hướng cổ điển, chất lượng cao, đây là hứa hẹn một công trình mang dấu ấn Thái Công và sẽ xuất hiện trong quyển sách sắp đến.',
  },
  {
    imgSrc: 'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_4.webp',
    titleCard: 'Private sigondasdas check',
    description:
      '“Private Villa Sài Gòn” một công trình tư nhân do NTK Quách Thái Công thực hiện kiến trúc và nội thất. Với phong cách nội thất mang hơi hướng cổ điển, chất lượng cao, đây là hứa hẹn một công trình mang dấu ấn Thái Công và sẽ xuất hiện trong quyển sách sắp đến.',
  },
  {
    imgSrc: 'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_1.webp',
    titleCard: 'Private sigondasdas check',
    description:
      '“Private Villa Sài Gòn” một công trình tư nhân do NTK Quách Thái Công thực hiện kiến trúc và nội thất. Với phong cách nội thất mang hơi hướng cổ điển, chất lượng cao, đây là hứa hẹn một công trình mang dấu ấn Thái Công và sẽ xuất hiện trong quyển sách sắp đến.',
  },
  {
    imgSrc: 'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_2.webp',
    titleCard: 'Private sigondasdas check',
    description:
      '“Private Villa Sài Gòn” một công trình tư nhân do NTK Quách Thái Công thực hiện kiến trúc và nội thất. Với phong cách nội thất mang hơi hướng cổ điển, chất lượng cao, đây là hứa hẹn một công trình mang dấu ấn Thái Công và sẽ xuất hiện trong quyển sách sắp đến.',
  },
  {
    imgSrc: 'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_3.webp',
    titleCard: 'Private sigondasdas check',
    description:
      '“Private Villa Sài Gòn” một công trình tư nhân do NTK Quách Thái Công thực hiện kiến trúc và nội thất. Với phong cách nội thất mang hơi hướng cổ điển, chất lượng cao, đây là hứa hẹn một công trình mang dấu ấn Thái Công và sẽ xuất hiện trong quyển sách sắp đến.',
  },
  {
    imgSrc: 'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_4.webp',
    titleCard: 'Private sigondasdas check',
    description:
      '“Private Villa Sài Gòn” một công trình tư nhân do NTK Quách Thái Công thực hiện kiến trúc và nội thất. Với phong cách nội thất mang hơi hướng cổ điển, chất lượng cao, đây là hứa hẹn một công trình mang dấu ấn Thái Công và sẽ xuất hiện trong quyển sách sắp đến.',
  },
  {
    imgSrc: 'https://aa-design.s3.ap-southeast-1.amazonaws.com/design_1.webp',
    titleCard: 'Private sigondasdas check',
    description:
      '“Private Villa Sài Gòn” một công trình tư nhân do NTK Quách Thái Công thực hiện kiến trúc và nội thất. Với phong cách nội thất mang hơi hướng cổ điển, chất lượng cao, đây là hứa hẹn một công trình mang dấu ấn Thái Công và sẽ xuất hiện trong quyển sách sắp đến.',
  },
];

const ConstructionPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEOHeaderComponent
        title={t('seo.title_construction')}
        description={t('seo.description_construction')}
        keywords="construction, design, aa-design construction, aa design construction, la thien phi, công trình la thiên phi, công trình,"
      />
      <div className={styles.wrapperConstructionPage}>
        <div className={styles.containerConstructionPage}>
          <HeaderTitlePage title={t('construction.title')} />

          <div className={styles.wrapperCardConstruction}>
            {fakeData.map((item, index) => (
              <CardIntroduceComponent
                key={index}
                imgSrc={item.imgSrc}
                titleCard={item.titleCard}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ConstructionPage);
