import { FC, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import {
  useI18n,
  Blogs,
  BlogCategories,
  getBlogHeaderImage,
  BlogRecent,
  isBlogAllowed
} from "@sirclo/nexus";
import useWindowSize from "lib/useWindowSize";
import { useBrand } from "lib/useBrand";
import Layout from "components/Layout/Layout";
import { GRAPHQL_URI } from "components/Constants";
import Breadcrumb from 'components/Breadcrumb/Breadcrumblink'
import styles from "public/scss/pages/Blog.module.scss";

const EmptyComponent = dynamic(() => import("components/EmptyComponent/EmptyComponent"));
const Placeholder = dynamic(() => import("components/Placeholder"));

const classesBlogs = {
  blogsContainerClassName: `row ${styles.blog}`,
  blogContainerClassName: `col-12 col-md-12 ${styles.blog_item} row`,
  categoryClassName: styles.blog_itemCategory,
  imageContainerClassName: `${styles.blog_itemImageContainer} col-12 col-md-4 `,
  imageClassName: styles.blog_itemImage,
  descriptionClassName: `col-12 col-md-8 ${styles.blog_itemContent}`,
  titleClassName: styles.blog_itemTitle,
  authorClassName: styles.blog_itemAuthor,
  descriptionInnerFooterClassName: styles.blog_itemInnerFooter,
  dateClassName: styles.blog_itemInnerFooterDate,
  authorPicClassName: "d-none",
  contentContainerClassName: styles.blog_contentContainer,
  buttonClassName: styles.blog_button
}

const classesBlogCategories = {
  containerClassName: styles.blog_category,
  categoryClassName: styles.blog_categoryItem,
  linkClassName: styles.blog_categoryLink,
}

const classesEmptyComponent = {
  emptyContainer: styles.blog_empty,
  emptyTitle: styles.blog_emptyTitle
};

const classesPagination = {
  pagingClassName: `col-12 ${styles.pagination}`,
  activeClassName: styles.pagination_active,
  itemClassName: styles.pagination_item
}

const classesPlaceholderBlogs = {
  placeholderImage: `${styles.placeholderItem} ${styles.placeholderItem_blogsList}`
}

const classesBlogRecent = {
  containerClassName: styles.blog_recent,
  blogRecentClassName: styles.blog_recentItem,
  imageClassName: styles.blog_recentItemImage,
  labelContainerClassName: styles.blog_recentItemContent,
  titleClassName: styles.blog_recentItemContentTitle,
  dateClassName: styles.blog_recentItemContentDate
}

const Blog: FC<any> = ({
  lng,
  lngDict,
  headerImage,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();
  const size = useWindowSize();

  const [totalCategories, setTotalCategories] = useState(null);
  const allowedBlog = isBlogAllowed();

  const linksBreadcrumb = [`${i18n.t("home.title")}`, `${i18n.t("blog.title")}`]

  return (
    <Layout
      i18n={i18n}
      lng={lng}
      lngDict={lngDict}
      brand={brand}
    >
      {allowedBlog &&
        <>
          <Breadcrumb
            links={linksBreadcrumb}
            lng={lng}
          />
          <div className="container">
            <div
              className={`${styles.blog_headerContainer} ${!headerImage && styles.blog_headerWithoutBackground}`}
              style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${headerImage})` }}
            >
              <h1 className={styles.blog_headerTitle}>
                {i18n.t("blog.title")}
              </h1>
            </div>
            <br></br>
            <div className="row">
              <div className="col-12 col-lg-9">
                <Blogs
                  classes={classesBlogs}
                  paginationClasses={classesPagination}
                  withPagination
                  withAuthor
                  itemPerPage={4}
                  withReadMoreButton
                  thumborSetting={{
                    width: size.width < 768 ? 375 : 512,
                    format: "webp",
                    quality: 85,
                  }}
                  LoadingComponent={
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <Placeholder classes={classesPlaceholderBlogs} withImage />
                      </div>
                      <div className="col-12 col-md-6">
                        <Placeholder classes={classesPlaceholderBlogs} withImage />
                      </div>
                    </div>
                  }
                  emptyStateComponent={
                    <EmptyComponent
                      classes={classesEmptyComponent}
                      title={i18n.t("blog.isEmpty")}
                    />
                  }
                />
              </div>
              <div className="col-12 col-lg-3">
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-12">
                    {(totalCategories > 0 || totalCategories === null) &&
                      <>
                        <h1 className={styles.title_side_blogs}>
                          {i18n.t("blog.categories")}
                        </h1>
                        <BlogCategories
                          classes={classesBlogCategories}
                          getCategoriesCount={(categoriesCount) => setTotalCategories(categoriesCount)}
                        />
                      </>
                    }
                  </div>
                  <div className="col-12 col-md-6 col-lg-12">
                    <h2 className={styles.title_side_blogs}>{i18n.t("blog.recentPost")}</h2>
                    <BlogRecent
                      classes={classesBlogRecent}
                      limit={5}
                      linkPrefix="blog"
                      thumborSetting={{
                        width: 100,
                        format: "webp",
                        quality: 85
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const brand = await useBrand(req);
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id';
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`);
  const headerImage = await getBlogHeaderImage(GRAPHQL_URI(req));

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      headerImage,
      brand: brand || ""
    },
  };
}

export default Blog;