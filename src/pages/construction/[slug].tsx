import { useRouter } from 'next/router';
import React from 'react';

const ConstructionSlug = () => {
  const router = useRouter();
  return <div>Construction Slug {router.query.slug}</div>;
};

export default ConstructionSlug;
