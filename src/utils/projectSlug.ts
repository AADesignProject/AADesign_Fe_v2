type ProjectSlugSource = {
  _id: string;
  address?: string;
  name: string;
};

const toSlugSegment = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getProjectSlug = (project: ProjectSlugSource) => {
  const readableSlug = toSlugSegment(
    [project.name, project.address].filter(Boolean).join(' ')
  );

  return readableSlug || project._id;
};
