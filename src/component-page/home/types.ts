export type Project = {
  _id: string;
  address: string;
  images?: string[];
  name: string;
  thumbnail?: string;
  thumbnailMain?: string;
  type: string;
  typical?: boolean;
};

export type LocalizedProject = Project & {
  displayAddress: string;
  displayName: string;
};

export type LandingItem = {
  description: string;
  title: string;
};
