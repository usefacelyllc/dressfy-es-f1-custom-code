import React, { useState } from 'react';
import { getImageUrl } from '../utils/imageConfig';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  quality?: number; // 1-100
  priority?: boolean;
}

/**
 * Componente Image que tenta carregar a imagem local primeiro,
 * e se falhar, usa a URL externa configurada
 */
const Image: React.FC<ImageProps> = ({ 
  src, 
  fallbackSrc, 
  onError, 
  quality = 100,
  priority = false,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      // Tenta usar URL externa se configurada
      const externalUrl = getImageUrl(src);
      if (externalUrl !== src) {
        setImageSrc(externalUrl);
        return;
      }
      // Se não houver URL externa, usa fallback se fornecido
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
        return;
      }
    }
    // Chama o onError original se fornecido
    if (onError) {
      onError(e);
    }
  };

  // Adiciona srcset para alta densidade se não estiver definido
  const imageProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    ...props,
    src: imageSrc,
    onError: handleError,
    loading: priority ? 'eager' : 'lazy',
    fetchpriority: priority ? 'high' : 'auto',
  };

  // Se não tiver srcset definido, adiciona para suporte a retina
  if (!imageProps.srcSet) {
    imageProps.srcSet = `${imageSrc} 1x, ${imageSrc} 2x`;
  }

  return <img {...imageProps} />;
};

export default Image;

