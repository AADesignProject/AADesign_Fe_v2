import React from 'react';
import { FaMobile } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaLocationDot } from 'react-icons/fa6';
import Link from 'next/link';

//constants
import { email, phoneNumber } from '@/constant/general';

//styles
import styles from '@/scss/footer.module.scss';

const FooterComponent = () => {
  return (
    <footer className={styles.wrapperFooter}>
      <div className={styles.containerContent}>
        <div className={styles.columnRight}>
          <h2 className={styles.titleContact}>Contact</h2>
          <Link href={`tel:${phoneNumber}`} className={styles.phoneNumber}>
            <FaMobile />
            <span>{phoneNumber}</span>
          </Link>
          <Link href={`mailto:${email}`} className={styles.email}>
            <MdEmail />
            <span>{email}</span>
          </Link>
          <p className={styles.location}>
            <FaLocationDot />
            <span>Lac hong westlake, Tay ho, HN</span>
          </p>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.7169064245427!2d105.80781677587349!3d21.083966085879066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aa9463936459%3A0x6e366b579f34c4fc!2zTOG6oWMgSOG7k25nIFdlc3RsYWtl!5e0!3m2!1svi!2sus!4v1730779456521!5m2!1svi!2sus"
              title="Google Maps - AA Design Location"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.containerCopyright}>
        <p>AA Design ©. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterComponent;
