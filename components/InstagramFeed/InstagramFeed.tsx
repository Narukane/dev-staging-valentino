import { FC, useState } from "react";
import { InstagramFeed as InstaFeed } from "@sirclo/nexus";
import Carousel from "@brainhubeu/react-carousel";
import dynamic from "next/dynamic";
import { useI18n } from "@sirclo/nexus";
import styles from "public/scss/components/InstagramFeed.module.scss";
import stylesPlacholder from "public/scss/components/Placeholder.module.scss";

const Placeholder = dynamic(() => import("components/Placeholder"));
const InstagramQuickView = dynamic(() =>
  import("@sirclo/nexus").then((mod) => mod.InstagramQuickView)
);

const classesInstagramQuickView = {
  quickViewBackgroundClassName: styles.instagramFeed_quickviewBackground,
  quickViewContentClassName: styles.instagramFeed_quickviewInner,
  closeButtonClassName: `btn ${styles.instagramFeed_quickviewButton}`,
  quickViewAnchorClassName: styles.instagramFeed_quickviewLink,
  quickViewMediaClassName: styles.instagramFeed_quickviewImage,
};

const classesInstagramFeed = {
  containerClassName: styles.instagramFeed,
  mediaClassName: styles.instagramFeed_media,
  anchorClassName: styles.instagramFeed_mediaLink,
  imageClassName: styles.instagramFeed_mediaImage,
};

const classesPlaceholderInstafeed = {
  placeholderImage: `${stylesPlacholder.placeholderItem} ${stylesPlacholder.placeholderItem__instagramfeed}`,
};

type TSize = {
  width: Number;
};

const InstagramFeed: FC<{ size: TSize }> = ({ size }) => {
  const [instagramQuickView, setInstagramQuickView] = useState<boolean>(false);
  const [instagramMedia, setInstagramMedia] = useState<any>({});

  const i18n: any = useI18n();

  return (
    <div className="container">
      <div className="heading">
        <div className={styles.instagramFeed__title}>
          <span>{i18n.t("instaFeed.titleDesc")}</span>
        </div>
      </div>
      {instagramQuickView && instagramMedia && (
        <InstagramQuickView
          classes={classesInstagramQuickView}
          showQuickView={setInstagramQuickView}
          media={instagramMedia}
          thumborSetting={{
            width: size.width < 575 ? 350 : 500,
            format: "webp",
            quality: 85,
          }}
        />
      )}

      <InstaFeed
        Carousel={Carousel}
        slidesPerPage={size.width < 575 ? 2 : 3}
        slidesPerScroll={1}
        autoPlay={10000}
        infinite
        classes={classesInstagramFeed}
        withQuickview
        showQuickView={setInstagramQuickView}
        getQuickViewMedia={setInstagramMedia}
        loadingComponent={
          <Placeholder classes={classesPlaceholderInstafeed} withImage />
        }
        thumborSetting={{
          width: size.width < 575 ? 250 : 400,
          format: "webp",
          quality: 85,
        }}
      />
    </div>
  );
};

export default InstagramFeed;
