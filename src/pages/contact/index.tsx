import React, { memo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

//components
import SEOHeaderComponent from '@/components/seo-header';
import HeaderTitlePage from '@/components/header-title-page';

//styles
import styles from '@/scss/contact-page.module.scss';
import { email, phoneNumber, phoneNumberHref } from '@/constant/general';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SEOHeaderComponent
        title="Liên hệ tư vấn thiết kế nội thất"
        description="Liên hệ AA Design để tư vấn thiết kế kiến trúc, nội thất và thi công trọn gói cho biệt thự, căn hộ, văn phòng, nhà hàng, khách sạn."
        keywords="liên hệ AA Design, tư vấn thiết kế nội thất, thi công nội thất, thiết kế biệt thự"
        breadcrumbs={[
          { name: 'Trang chủ', url: '/' },
          { name: 'Liên hệ', url: '/contact' },
        ]}
      />
      <div className={styles.wrapperContactPage}>
        <div className={styles.containerContactPage}>
          <div className={styles.pageIntro}>
            <HeaderTitlePage title={t('contact.title')} />
            <p>
              Trao đổi trực tiếp với AA Design để bắt đầu định hướng không gian,
              phạm vi thiết kế và lịch tư vấn phù hợp.
            </p>
          </div>

          <div className={styles.wrapperContent}>
            <section className={styles.consultationPanel}>
              <span>Direct contact</span>
              <h2>Bắt đầu cuộc trao đổi về không gian của bạn</h2>
              <p>
                Gọi điện hoặc gửi email ngắn về nhu cầu, hiện trạng và thời gian
                bạn muốn trao đổi. Chúng tôi sẽ phản hồi để sắp xếp buổi tư vấn.
              </p>
              <div className={styles.contactActions}>
                <Link href={`tel:${phoneNumberHref}`}>Gọi {phoneNumber}</Link>
                <Link href={`mailto:${email}`}>Gửi email</Link>
              </div>
              <dl className={styles.contactDetails}>
                <div>
                  <dt>Điện thoại</dt>
                  <dd>
                    <Link href={`tel:${phoneNumberHref}`}>{phoneNumber}</Link>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <Link href={`mailto:${email}`}>{email}</Link>
                  </dd>
                </div>
              </dl>
            </section>

            <section className={styles.boxContent}>
              <h2 className={styles.title}>{t('contact.live')}</h2>
              <div className={styles.description}>
                <p>Mr La Thiên Phi</p>
                <Link href={`tel:${phoneNumberHref}`}>T: {phoneNumber}</Link>
                <Link href={`mailto:${email}`}>E: {email}</Link>
              </div>
            </section>

            <section className={styles.boxContent}>
              <h2 className={styles.title}>{t('contact.office')}</h2>
              <address className={styles.description}>
                <p>{t('contact.office_address_detail')}</p>
                <p>{t('contact.office_address')}</p>
                <p>{t('contact.time_active')}</p>
              </address>
            </section>
          </div>

          <div className={styles.processStrip}>
            <div>
              <span>01</span>
              <p>Lắng nghe</p>
            </div>
            <div>
              <span>02</span>
              <p>Định hướng</p>
            </div>
            <div>
              <span>03</span>
              <p>Đề xuất giải pháp</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ContactPage);
