'use client'
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { translate } from '@/utils/translation';
import { FaArrowRight } from "react-icons/fa";
import { useIsMobile } from "@/hooks/use-mobile";
import { getDirection, placeholderImage } from "@/utils/helpers";
import LightBox from "@/components/commonComponents/lightBox/LightBox";

const PhotoGallery = ({
  galleryPhotos,
  titleImage,
  onImageClick
}) => {

  const isMobile = useIsMobile()
  const [activeImage, setActiveImage] = useState(
    titleImage ||
    (galleryPhotos?.[0]
      ? galleryPhotos[0]?.other_image
      : ''),
  );

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  // Reference to carousel API
  const [api, setApi] = useState(null);

  // Prepare all images for carousel
  const allImages = [titleImage || '']
    .concat(
      galleryPhotos?.map((photo) =>
        photo?.other_image,
      ) || [],
    )
    .filter(Boolean);

  // Calculate total image count (including title image)
  const totalImages = allImages.length;
  // Determine how many thumbnails to show based on total images
  const getThumbnailCount = () => {
    if (totalImages <= 1) return 0;
    if (totalImages === 2) return 1;
    if (totalImages === 3) return 2;
    if (totalImages === 4) return 3;
    return 4; // For 5+ images, show 4 thumbnails
  };

  const thumbnailCount = getThumbnailCount();

  // Handle thumbnail click
  const handleImageClick = (image) => {
    setActiveImage(image);
    const newIndex = allImages.indexOf(image);
    if (newIndex !== -1 && api) {
      api.scrollTo(newIndex);
    }
  };

  // Set up selection handler when api changes
  useEffect(() => {
    if (!api) return;

    // Update active image when carousel changes
    const onSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setActiveImage(allImages[selectedIndex]);
    };

    // Call once to set initial state
    onSelect();

    // Subscribe to select event
    api.on("select", onSelect);

    // Cleanup
    return () => {
      api.off("select", onSelect);
    };
  }, [api, allImages]);

  return (
    <div className="w-full">
      {/* Main image container with Carousel */}
      <div className="relative mb-4 w-full rounded-2xl overflow-hidden">
        <Carousel
          className=""
          setApi={setApi}
          opts={{
            loop: allImages?.length > 1 ? true : false,
            direction: getDirection(),
            align: "center",
            slidesToScroll: "auto",
          }}
        >
          <CarouselContent className={`w-full -ml-2`}>
            {allImages.map((image, index) => (
              <CarouselItem key={index} className={`basis-full ${isMobile ? "flex items-center" : ""}`}>
                <div
                  className="h-full w-full cursor-pointer rounded-2xl"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image || ''}
                    className="w-full h-[176px] sm:h-[400px] lg:h-[800px] rounded-2xl object-cover"
                    alt={`Property view ${index}`}
                    loading="lazy"
                    onError={placeholderImage}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {allImages?.length > 1 ? (
            <>
              <CarouselPrevious className="left-2 z-[9] !h-12 !w-8 rounded-none !bg-white/80 dark:!text-black dark:border-gray-400 !hover:bg-white sm:!h-16 sm:!w-10" />
              <CarouselNext className="right-2 z-[9] !h-12 !w-8 rounded-none !bg-white/80 dark:!text-black dark:border-gray-400 !hover:bg-white sm:!h-16 sm:!w-10" />
            </>
          ) : null}
        </Carousel>
      </div>

      {/* Thumbnails row - Desktop only */}
      {!isMobile && thumbnailCount > 0 && (
        <div className="no-scrollbar relative bottom-14 md:bottom-[60px] left-0 right-0 z-[9] mx-auto justify-center gap-4 flex">
          {/* Title image thumbnail */}
          <div
            className={`h-[60px] md:h-[100px] md:min-w-[110px] lg:min-w-[150px] cursor-pointer rounded-xl ring-4 ring-white ring-offset-2 transition-all ${activeImage === titleImage ? "ring-4 ring-white ring-offset-2" : ""}`}
            onClick={() => openLightbox(0)}
          >
            <img
              src={titleImage || ''}
              className="w-[150px] rounded-xl object-fill h-[60px] md:h-[100px] md:w-[110px] lg:min-w-[150px]"
              alt="Property view"
              loading="lazy"
            />
          </div>

          {/* Gallery images thumbnails */}
          {allImages.slice(1, thumbnailCount + 1).map((image, index) => {
            const actualIndex = index + 1;
            const isLastThumbnail = thumbnailCount === 4 && index === 3 && totalImages > 5;

            return (
              <div
                key={actualIndex}
                className={`h-[60px] w-[150px] md:h-[100px] md:w-[110px] lg:w-[150px] cursor-pointer rounded-xl ring-4 ring-white ring-offset-2 transition-all relative ${activeImage === image ? "ring-4 ring-white ring-offset-2" : ""}`}
                onClick={() => openLightbox(isLastThumbnail ? totalImages - 1 : actualIndex)}
              >
                <img
                  src={image}
                  className="w-[150px] rounded-xl object-fill h-[60px] md:h-[100px] md:w-[110px] lg:w-[150px]"
                  alt={`Property view ${actualIndex + 1}`}
                  loading="lazy"
                />

                {isLastThumbnail && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                    <span className="rounded-lg py-2 px-3 text-sm bg-white font-medium flex items-center gap-1 dark:text-black">
                      <span className="hidden md:block">{translate("viewall")}</span>
                      <FaArrowRight className={`rtl:rotate-180`} />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile thumbnails - Hidden in mobile view */}
      {/* Thumbnails are now hidden in mobile view as requested */}

      {/* Lightbox */}
      <LightBox
        photos={galleryPhotos || []}
        title_image={titleImage}
        viewerIsOpen={lightboxOpen}
        currentImage={currentImage}
        setCurrentImage={setCurrentImage}
        onClose={closeLightbox}
      />
    </div>
  );
};

export default PhotoGallery;
