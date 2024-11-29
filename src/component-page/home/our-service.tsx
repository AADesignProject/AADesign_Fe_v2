import React, { useEffect, useRef, useState } from 'react';
import { SiVorondesign } from 'react-icons/si';
import { motion } from 'framer-motion';

//styles
import styles from '@/scss/home-page.module.scss';

const listOurService = [
  {
    icon: <SiVorondesign />,
    title: 'Design Consultation',
    description:
      'This service is perfect for multiple rooms or rooms that require more than just a refresh. We can visit your home to create a complete design scheme.',
  },
  {
    icon: <SiVorondesign />,
    title: 'Design Consultation',
    description:
      'This service is perfect for multiple rooms or rooms that require more than just a refresh. We can visit your home to create a complete design scheme.',
  },
  {
    icon: <SiVorondesign />,
    title: 'Design Consultation',
    description:
      'This service is perfect for multiple rooms or rooms that require more than just a refresh. We can visit your home to create a complete design scheme.',
  },
  {
    icon: <SiVorondesign />,
    title: 'Design Consultation',
    description:
      'This service is perfect for multiple rooms or rooms that require more than just a refresh. We can visit your home to create a complete design scheme.',
  },
];

const OurServiceComponentPage = () => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={styles.ourService}
    >
      <h2 className={styles.title}>Meet</h2>
      <h2 className={styles.title2}>Our services</h2>
      <p className={styles.description}>
        With a team of highly skilled and accredited interior designers, we are
        equipped to undertake projects of any size
      </p>

      <motion.div
        variants={containerVariants}
        className={styles.serviceWrapper}
      >
        {listOurService?.map((item, index) => (
          <motion.div
            variants={itemVariants}
            key={index}
            className={styles.serviceBox}
          >
            <div className={styles.icon}>{item.icon}</div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default OurServiceComponentPage;
