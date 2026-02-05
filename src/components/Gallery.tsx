"use client";

import { useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import { GalleryPhoto } from "@/data/galleries";

export default function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState(-1);

  return (
    <div>
      <PhotoAlbum
        layout="masonry"
        photos={photos}
        columns={(containerWidth) => {
          if (containerWidth < 640) return 2;
          if (containerWidth < 1024) return 3;
          return 4;
        }}
        onClick={({ index }) => setIndex(index)}
      />
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={photos.map((photo) => ({
          src: photo.src,
          title: photo.alt,
          description: photo.caption,
        }))}
      />
    </div>
  );
}
