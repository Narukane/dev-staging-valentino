/* library Package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { LookbookSingle, useI18n } from '@sirclo/nexus'

/* library Template */
import useWindowSize from 'lib/useWindowSize'
import { useBrand } from 'lib/useBrand'

/* component */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumblink'

/* styles */
import styles from "public/scss/pages/Lookbook.module.scss";

const classesLookbookSingle = {
  containerClassName: styles.lookbook_detail,
  rowClassName: "card-columns",
  imageClassName: `card ${styles.lookbook_detailItems}`,
}

const LookbookSinglePage: FC<object> = ({
  lng,
  lngDict,
  slug,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();
  const [title, setTitle] = useState<string>("");
  const size = useWindowSize();

  const linksBreadcrumb = [`${i18n.t("home.title")}`, `${i18n.t("lookbook.title")}`, `${title}`]

  return (
    <Layout
      i18n={i18n}
      lng={lng}
      lngDict={lngDict}
      brand={brand}
    >
      <Breadcrumb 
      links={linksBreadcrumb} lng={lng} />
      <section>
        <div className="container">
          <LookbookSingle
            classes={classesLookbookSingle}
            slug={slug}
            getTitle={setTitle}
            thumborSetting={{
              width: size.width < 768 ? 400 : 600,
              format: "webp",
              quality: 85,
            }}
          />
        </div>
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const { default: lngDict = {} } = await import(
    `locales/${params.lng}.json`
  );

  const brand = await useBrand(req);

  return {
    props: {
      lng: params.lng,
      slug: params.slug,
      lngDict,
      brand: brand || ''
    },
  };
}

export default LookbookSinglePage;
