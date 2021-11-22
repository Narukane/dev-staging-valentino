/* library Package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  Lookbook,
  isLookbookAllowed,
  useI18n
} from '@sirclo/nexus'

/* library Template */
import useWindowSize from 'lib/useWindowSize'
import { useBrand } from 'lib/useBrand'

/* component */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumblink'
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'

/* styles */
import styles from "public/scss/pages/Lookbook.module.scss";

const classesLookbook = {
  containerClassName: styles.lookbook,
  rowClassName: 'card-columns',
  lookbookContainerClassName: `card ${styles.lookbook_item}`,
  imageClassName: styles.lookbook_itemImage,
  lookbookLabelContainerClassName: styles.lookbook_itemDetail,
  labelClassName: styles.lookbook_itemDetail_label,
  linkClassName: styles.lookbook_itemDetail_links,
};

const classesEmptyComponent = {
  emptyContainer: `${styles.lookbook__empty}`,
  emptyTitle: `${styles.lookbook__emptyTitle}`,
  emptyDesc: `${styles.lookbook__emptyDesc}`,
}

const LookbookCategory: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();
  const size = useWindowSize();
  const LookbookAllowed = isLookbookAllowed();

  const linksBreadcrumb = [`${i18n.t("home.title")}`, `${i18n.t("lookbook.title")}`]

  return (
    <Layout
      i18n={i18n}
      lng={lng}
      lngDict={lngDict}
      brand={brand}
      withAllowed={LookbookAllowed}
    >
      <>
          <Breadcrumb
            links={linksBreadcrumb}
            lng={lng} />
          <section>
            <div className="container">
              <Lookbook
                classes={classesLookbook}
                linkText={i18n.t("lookbook.seeCollection")}
                pathPrefix={`lookbook/categories`}
                thumborSetting={{
                  width: size.width < 768 ? 400 : 600,
                  format: "webp",
                  quality: 85,
                }}
                emptyStateComponent={
                  <EmptyComponent
                    classes={classesEmptyComponent}
                    title={i18n.t("lookbook.isEmpty")}
                    logo={
                      <img className={styles.lookbook__emptyIcon} src="/icon/emptyIcon.svg" />
                    }
                  />
                }
              />
            </div>
          </section>
        </>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const brand = await useBrand(req);
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id';
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`);

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      brand: brand || ''
    },
  };
}

export default LookbookCategory;
