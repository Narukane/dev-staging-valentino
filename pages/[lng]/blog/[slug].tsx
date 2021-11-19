import { FC, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { BlogSingle, BlogCategories, useI18n, getBlogHeaderImage } from "@sirclo/nexus";
import Layout from "components/Layout/Layout";
import { useBrand } from "lib/useBrand";
import styles from "public/scss/pages/Blog.module.scss";
import Breadcrumb from "components/Breadcrumb/Breadcrumblink";
import { GRAPHQL_URI } from "components/Constants";

const Popup = dynamic(() => import("components/Popup/Popup"));
const SocialShare = dynamic(() => import("components/SocialShare"));

const classesBlogSingle = {
  blogContainerClassName: styles.blog_detail,
  headerClassName: "d-none",
  headerContentClassName: styles.blog_detailHeaderContent,
  headerDetailClassName: styles.blog_detailMetaWrapper,
  headerEndClassName: "d-none",
  authorPicContainerClassName: "d-none",
  authorPicClassName: "d-none",
  authorInfoClassName: "d-none",
  createdByClassName: `d-flex flex-row align-items-center justify-content-start flex-nowrap w-100`,
  createdByInnerClassName: `${styles.blog_detailMeta} d-flex flex-row align-items-center justify-content-start flex-wrap`,
  authorClassName:
    "d-flex flex-row align-items-center justify-content-start order-2",
  dateClassName:
    "d-flex flex-row align-items-center justify-content-start order-1",
  blogContentClassName: styles.blog_detailContent,
};

const BlogSlug: FC<any> = ({
  lng,
  lngDict,
  slug,
  brand,
  urlSite,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();
  const [showShare, setShowShare] = useState<boolean>(false);
  const toggleShare = () => setShowShare(!showShare);
  const router = useRouter();
  const linksBreadcrumb = [
    `${i18n.t("home.title")}`,
    `${i18n.t("blog.title")}`,
  ];

  return (
    <Layout i18n={i18n} lng={lng} lngDict={lngDict} brand={brand}>
      <Breadcrumb links={linksBreadcrumb} lng={lng} />

      <div className="container">
      <section className="mt-0">
        <div className="container">
          
          <br></br><br></br>
          <div className="row">
            <div className="col-12">
              <BlogSingle
                classes={classesBlogSingle}
                ID={slug.toString()}
              />
              <div className={`${styles.lookbook_nav} ${styles.blog_detailNavigation} d-flex flex-row align-items-center justify-content-center`}>
                <button onClick={() => router.back()}>
                  {i18n.t("global.back")}
                </button>
                <button onClick={() => toggleShare()} className={styles.blog_detailShare}>
                  {i18n.t("product.share")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      

        {showShare && (
          <Popup
            withHeader
            setPopup={toggleShare}
            mobileFull={false}
            classPopopBody
            popupTitle={i18n.t("product.shareProduct")}
          >
            <div className="">
              <SocialShare i18n={i18n} urlSite={urlSite} />
            </div>
          </Popup>
        )}
        </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const { slug } = params;
  const brand = await useBrand(req);
  const defaultLanguage =
    brand?.settings?.defaultLanguage || params.lng || "id";
  const { default: lngDict = {} } = await import(
    `locales/${defaultLanguage}.json`
  );
  const urlSite = `https://${req.headers.host}/${params.lng}/blog/${slug}`;
  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      slug: params.slug,
      brand: brand || "",
      urlSite: urlSite,
    },
  };
};

export default BlogSlug;
