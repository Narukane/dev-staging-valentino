/* library Package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { PaymentConfirmation, CheckPaymentOrder, useI18n } from '@sirclo/nexus'
import { toast } from 'react-toastify'
import {
  ChevronUp,
  ChevronDown,
  X,
} from 'react-feather'

/* library Template */
import { useBrand } from 'lib/useBrand'

/* component */
import SEO from 'components/SEO'
import Layout from 'components/Layout/Layout'
import Loader from 'components/Loader/Loader'
import BankAccount from 'components/BankAccount/BankAccount'

/* styles */
import styles from 'public/scss/pages/PaymentNotif.module.scss'
import stylesPopup from 'public/scss/components/CheckPaymentOrder.module.scss'
import stylesBanks from 'public/scss/components/BanksAccount.module.scss'


const classesPaymentConfirmation = {
  paymentConfirmationDivClassName: styles.paymentNotif_form,
  paymentInfoUploadClassName: styles.paymentNotif_info,
  inputContainerClassName: `${styles.sirclo_form_row} ${styles.paymentConfirmation}`,
  inputClassName: `form-control ${styles.sirclo_form_input}`,
  selectClassName: `form-control ${styles.sirclo_form_input}`,

  buttonConfirmClassName: styles.paymentConfirmation_buttonConfirm,
  detailContainerClassName: styles.paymentConfirmation_detailContainer,
  detailContentClassName: styles.paymentConfirmation_detailContent,
  detailHeaderClassName: styles.paymentConfirmation_detailHeader,
  detailTitleClassName: styles.paymentConfirmation_detailTitle,
  detailStatusClassName: styles.paymentConfirmation_detailStatus,
  paymentStatusCancelledClassName: styles.paymentConfirmation_detailStatusCancelled,
  paymentStatusReturnedClassName: styles.paymentConfirmation_detailStatusReturned,
  detailTotalAmountClassName: styles.paymentConfirmation_detailTotalAmount,
  detailDropdownClassName: styles.paymentConfirmation_detailDropdown,
  detailItemClassName: `d-flex`,
  detailItemImgClassName: styles.paymentConfirmation_detailItemImg,
  detailItemLabelClassName: styles.paymentConfirmation_detailItemLabel,
  detailItemPriceClassName: styles.paymentConfirmation_detailItemPrice,
  detailPriceBreakdownClassName: styles.paymentConfirmation_detailPriceBreakdown,
  detailFieldClassName: styles.paymentConfirmation_detailField,
  detailTotalFieldClassName: styles.paymentConfirmation_detailTotalField,
  detailHeaderDropdownClassName: styles.paymentConfirmation_detailHeaderDropdown,
  detailBodyDropdownClassName: styles.paymentConfirmation_detailBodyDropdown,
  labelClassName: styles.paymentConfirmation_label,

  bankAccountInformationClassName: stylesBanks.bank_information,
  bankAccountContainerClassName: stylesBanks.bank_container,
  bankAccountHeaderClassName: stylesBanks.bank_header,
  bankAccountSectionClassName: stylesBanks.bank_section,
  bankAccountLogoClassName: stylesBanks.bank_logoBank,
  bankAccountBodyClassName: stylesBanks.bank_body,
  bankAccountInfoAccountClassName: stylesBanks.bank_infoAccount,
  bankAccountNumberSectionClassname: stylesBanks.bank_numberSection,
  bankAccountCopyButtonClassName: stylesBanks.bank_buttonIcon,
  bankAccountIconCollapseClassName: stylesBanks.bank_buttonIcon,
  bankAccountLabelAccountNameClassName: stylesBanks.bank_name
}


const classesCheckPaymentOrder = {
  checkPaymentOrderHeaderClassName: `d-none`,
  checkPaymentOrderTitleClassName: stylesPopup.checkOrder_title,
  checkPaymentOrderDescriptionClassName: stylesPopup.checkOrder_description,
  checkPaymentOrderContentClassName: stylesPopup.checkOrder_content,
  checkPaymentOrderInputContentClassName: stylesPopup.checkOrder_inputContent,
  checkPaymentOrderInputTitleClassName: stylesPopup.checkOrder_inputTitle,
  checkPaymentOrderInputClassName: stylesPopup.checkOrder_input,
  checkPaymentOrderCloseButtonClassName: stylesPopup.checkOrder_closeButton,
  checkPaymentOrderSubmitButtonClassName: stylesPopup.checkOrder_submitButton
}


const PaymentConfirmationPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();
  const router = useRouter();
  let orderID = "";

  if (router.query.orderID) {
    orderID = router.query.orderID.toString();
  }

  return (
    <Layout
      i18n={i18n}
      lng={lng}
      lngDict={lngDict}
      brand={brand}
    >
      <SEO title={i18n.t("paymentConfirm.heading")} />
      <section>
        <div className="container">
          <div className={styles.paymentNotif_container}>
            <div className={styles.paymentNotif_inner}>
              <div className={styles.paymentNotif_inner_title}>
                <h3>{i18n.t("paymentConfirm.heading")}</h3>
              </div>
              <BankAccount />
              {orderID ?
              <div>
                <PaymentConfirmation
                  orderIDProps={orderID}
                  classes={classesPaymentConfirmation}
                  orderDetailIcon={{
                    chevronUp: <ChevronUp />,
                    chevronDown: <ChevronDown />
                  }}
                  onErrorMsg={(msg) => toast.error(msg)}
                  onSuccessMsg={(msg) => toast.success(msg)}
                  loadingComponent={<Loader color="text-light" />}
                  withOrderDetails
                  thumborSetting={{
                    width: 40,
                    format: "webp",
                    quality: 85
                  }}
                />
                </div>
                :
                <>
                  <CheckPaymentOrder
                    classes={classesCheckPaymentOrder}
                    icon={{
                      loading: <Loader color="text-light" />,
                      close: <X />
                    }}
                    onErrorMsg={(msg) => toast.error(msg)}
                  />
                </>
              }
            </div>
          </div>
        </div>
      </section>
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

export default PaymentConfirmationPage;