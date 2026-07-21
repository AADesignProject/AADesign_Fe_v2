import Image, { ImageProps } from 'next/image';

const preventDefault = (event: React.SyntheticEvent) => {
  event.preventDefault();
};

const ProtectedImage = ({ alt, ...props }: ImageProps) => (
  <Image
    {...props}
    alt={alt}
    draggable={false}
    onContextMenu={preventDefault}
    onDragStart={preventDefault}
  />
);

export default ProtectedImage;
