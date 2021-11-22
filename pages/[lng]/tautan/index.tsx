/* library Package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Links, useI18n } from '@sirclo/nexus'

/* library Template */
import { useBrand } from 'lib/useBrand'

/* component */
import Layout from 'components/Layout/Layout'

/* styles */
import styles from 'public/scss/pages/Tautan.module.scss'


const classesLinks = {
  containerClassName: styles.tautan,
  logoImage: styles.tautan_logo,
  titleClassName: styles.tautan_title,
  description: styles.tautan_description,
  linksSection: styles.tautan_linkSection,
  labelText: styles.tautan_labelText,
  labelImage: styles.tautan_labelImage,
}

const TautanPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();

  return (
    <Layout
      i18n={i18n}
      lng={lng}
      lngDict={lngDict}
      brand={brand}
      withHeader={false}
      withFooter={false}
    >
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-8 offset-sm2 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <Links classes={classesLinks} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const brand = await useBrand(req);
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || 'id';
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`);

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      brand: brand || ""
    }
  };
}

export default TautanPage;