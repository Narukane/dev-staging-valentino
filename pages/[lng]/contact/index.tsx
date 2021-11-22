/* library Package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  useI18n,
  Contact,
  Widget,
  isEnquiryAllowed
} from '@sirclo/nexus'
import { toast } from 'react-toastify'

/* library Template */
import { useBrand } from 'lib/useBrand'

/* component */
import Breadcrumb from 'components/Breadcrumb/Breadcrumblink'
import Placeholder from 'components/Placeholder'
import Layout from 'components/Layout/Layout'

/* styles */
import styles from 'public/scss/pages/Contact.module.scss'


const classesContact = {
  containerClassName: `${styles.contact_container} d-flex flex-column align-items-start justify-content-start`,
  mapClassName: styles.contact_map,
  formContainerClassName: styles.contact_form,
  titleClassName: "d-none",
  inputContainerClassName: `${styles.sirclo_form_row}`,
  inputClassName: `form-control ${styles.sirclo_form_input}`,
  labelClassName: `d-flex flex-row align-items-center justify-content-start`,
  buttonContainerClassName: `${styles.contact_buttonContainer} d-block mt-4`,
  buttonClassName: `${styles.btn} ${styles.btn_primary} ${styles.btn_long} ${styles.btn_full_width} ${styles.btn_center}`,
  widgetClassName: styles.contact_widget
};

const classesPlaceholderContact = {
  placeholderList: `${styles.placeholderItem} ${styles.placeholderItem_contactWidget}`
}

const ContactPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n();
  const allowedEnquiry = isEnquiryAllowed()
  const linksBreadcrumb = [`${i18n.t("home.title")}`, `${i18n.t("contact.title")}`]

  return (
    <Layout
      i18n={i18n}
      lng={lng}
      lngDict={lngDict}
      brand={brand}
      withAllowed={allowedEnquiry}
    >
      <Breadcrumb
            links={linksBreadcrumb} lng={lng} />
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-10 offset-lg-1">

            <div className={`${styles.contact_info} ${styles.contact_info__top}`}>
              <Widget
                pos="main-content-1"
                widgetClassName={styles.contact_info}
                loadingComponent={
                  <Placeholder
                    classes={classesPlaceholderContact}
                    withList
                    listMany={5}
                  />
                }
              />
            </div>
            <Contact
              classes={classesContact}
              isAddressDetail={false}
              onCompleted={() => toast.success(i18n.t("contact.submitSuccess"))}
              onError={() => toast.error(i18n.t("contact.submitError"))}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

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

export default ContactPage;
