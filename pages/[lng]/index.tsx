/* library Package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  Banner,
  getBanner,
  Products,
  useI18n,
  Widget,
} from '@sirclo/nexus'
import { useRouter } from 'next/router'
import Carousel from '@brainhubeu/react-carousel'
import { LazyLoadComponent } from 'react-lazy-load-image-component'

/* library Template */
import useWindowSize from 'lib/useWindowSize'
import { parseCookies } from 'lib/parseCookies'
import { useSizeBanner } from 'lib/useSizeBanner'
import { GRAPHQL_URI } from 'lib/Constants'
import { useBrand } from 'lib/useBrand'

/* component */
import Layout from 'components/Layout/Layout'
import Placeholder from 'components/Placeholder'
import InstagramFeed from 'components/InstagramFeed/InstagramFeed'

/* styles */
import styles from 'public/scss/pages/Home.module.scss'

const classesBanner = {
  imageContainerClassName: styles.bannerCarousel_header,
  linkClassName: styles.bannerCarousel_link,
  imageClassName: styles.bannerCarousel_image,
};

const classesProducts = {
  productContainerClassName: `col-6 col-md-3 product_list ${styles.product}`,
  stickerContainerClassName: styles.product_sticker,
  outOfStockLabelClassName: `${styles.product_stickerLabel} ${styles.product_stickerLabel__outofstock}`,
  saleLabelClassName: `${styles.product_stickerLabel} ${styles.product_stickerLabel__sale}`,
  comingSoonLabelClassName: `${styles.product_stickerLabel} ${styles.product_stickerLabel__comingsoon}`,
  openOrderLabelClassName: `${styles.product_stickerLabel} ${styles.product_stickerLabel__openorder}`,
  preOrderLabelClassName: `${styles.product_stickerLabel} ${styles.product_stickerLabel__preorder}`,
  newLabelClassName: `${styles.product_stickerLabel} ${styles.product_stickerLabel__new}`,
  productImageContainerClassName: styles.product_link,
  productImageClassName: styles.product_link__image,
  productLabelContainerClassName: styles.product_label,
  productTitleClassName: styles.product_label__title,
  productPriceClassName: styles.product_labelPrice,
  salePriceClassName: styles.product_labelPrice__sale,
  priceClassName: styles.product_labelPrice__price,
};

const classesPlaceholderBanner = {
  placeholderImage: `${styles.placeholderItem} ${styles.placeholderItem__banner}`,
};

const classesPlaceholderProduct = {
  placeholderImage: `${styles.placeholderItem} ${styles.placeholderItem_product__card}`,
};

const Home: FC<any> = ({
  lng,
  lngDict,
  brand,
  dataBanners,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();
  const size = useWindowSize();
  const router = useRouter();

  return (
    <Layout i18n={i18n} lng={lng} lngDict={lngDict} brand={brand}>
      <div className={styles.bannerCarousel}>
        <Banner
          data={dataBanners?.data}
          Carousel={Carousel}
          classes={classesBanner}
          autoPlay={5000}
          lazyLoad
          dots
          infinite
          thumborSetting={{
            width: useSizeBanner(size.width),
            format: "webp",
            quality: 85,
          }}
          loadingComponent={
            <Placeholder classes={classesPlaceholderBanner} withImage />
          }
          widthImage={size.width}
        />
      </div>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-12">
              <h3 className={styles.home_product}>
                {i18n.t("home.ourProduct")}
              </h3>
              <div className="row mt-4">
                <LazyLoadComponent>
                  <Products
                    filter={{ openOrderScheduled: false, published: true }}
                    itemPerPage={4}
                    classes={classesProducts}
                    pathPrefix="product"
                    lazyLoadedImage={false}
                    thumborSetting={{
                      width: size.width < 768 ? 512 : 800,
                      format: "webp",
                      quality: 85,
                    }}
                    loadingComponent={
                      <>
                        <div className="col-6 col-md-3">
                          <Placeholder
                            classes={classesPlaceholderProduct}
                            withImage
                          />
                        </div>
                        <div className="col-6 col-md-3">
                          <Placeholder
                            classes={classesPlaceholderProduct}
                            withImage
                          />
                        </div>
                        <div className="col-6 col-md-3">
                          <Placeholder
                            classes={classesPlaceholderProduct}
                            withImage
                          />
                        </div>
                        <div className="col-6 col-md-3">
                          <Placeholder
                            classes={classesPlaceholderProduct}
                            withImage
                          />
                        </div>
                      </>
                    }
                  />
                </LazyLoadComponent>
              </div>
              <div className="text-center mt-4">
                <a
                  className={`btn ${styles.btn_secondary} ${styles.btn_long}`}
                  onClick={() => router.push(`/${lng}/products`)}
                >
                  {i18n.t("product.seeAll")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-12">
              <div className="row">
                <LazyLoadComponent>
                  <Widget
                    pos="main-content-2"
                    containerClassName={styles.widgetHomePage}
                    widgetClassName={styles.widgetItemHomePage}
                    loadingComponent={
                      <>
                        <div className="col-6">
                          <Placeholder
                            classes={classesPlaceholderProduct}
                            withImage
                          />
                        </div>
                        <div className="col-6">
                          <Placeholder
                            classes={classesPlaceholderProduct}
                            withImage
                          />
                        </div>
                      </>
                    }
                    thumborSetting={{
                      width: size.width < 768 ? 576 : 1200,
                      format: "webp",
                      quality: 85,
                    }}
                  />
                </LazyLoadComponent>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        {brand?.socmedSetting?.instagramToken && (
          <LazyLoadComponent threshold={300}>
            <InstagramFeed size={size} />
          </LazyLoadComponent>
        )}
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}: any) => {
  const brand = await useBrand(req);
  const cookies = parseCookies(req);
  const defaultLanguage =
    brand?.settings?.defaultLanguage ||
    params.lng ||
    cookies.ACTIVE_LNG ||
    "id";
  const allowedUri: Array<string> = ["en", "id", "graphql", "favicon.ico"];

  if (allowedUri.indexOf(params.lng.toString()) == -1) {
    res.writeHead(307, {
      Location: `/${defaultLanguage}/` + params.lng,
    });

    res.end();
  }

  const { default: lngDict = {} } = await import(
    `locales/${defaultLanguage}.json`
  );
  const dataBanners = await getBanner(GRAPHQL_URI(req));

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      brand: brand || "",
      dataBanners,
    },
  };
};

export default Home;
