import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/placeholder.png',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    let observer;
    let mounted = true;

    if (imgRef.current && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && mounted) {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                if (mounted) {
                  setImageSrc(src);
                  setIsLoaded(true);
                }
              };
              img.onerror = () => {
                if (mounted) {
                  setImageSrc(placeholder);
                  setIsLoaded(true);
                }
              };
              if (observer) {
                observer.disconnect();
              }
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      observer.observe(imgRef.current);
    } else {
      // Fallback for browsers without IntersectionObserver
      setImageSrc(src);
      setIsLoaded(true);
    }

    return () => {
      mounted = false;
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    };
  }, [src, placeholder]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`lazy-image ${isLoaded ? 'loaded' : ''} ${className}`}
      loading="lazy"
      {...props}
    />
  );
};

export default LazyImage;