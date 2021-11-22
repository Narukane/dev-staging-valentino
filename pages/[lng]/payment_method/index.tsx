/* library Package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import {
  ListPaymentMethod,
  PrivateRoute,
  useI18n,
} from '@sirclo/nexus'
import { ArrowLeft, X as XIcon } from 'react-feather'
import { toast } from 'react-toastify'

/* library Template */
import { useBrand } from 'lib/useBrand'
import { useWhatsAppOTPSetting } from 'lib/useWhatsappOtp'

/* component */
import SEO from 'components/SEO'
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Loader from 'components/Loader/Loader'
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'
import LoaderPages from 'components/Loader/LoaderPages'
import Placeholder from 'components/Placeholder'

/* styles */
import styles from 'public/scss/pages/PaymentMethod.module.scss'
import stylesOptIn from 'public/scss/components/OptIn.module.scss'

const classesListPaymentMethod = {
  listPaymentDivClassName: "container",
  paymentItemEnabledClassName: `row ${styles.payment_listItemEnabled}`,
  paymentItemDisabledClassName: `row ${styles.payment_listItemDisabled}`,
  paymentTypeClassName: `align-self-center ${styles.payment_listItemPayment}`,
  radioButtonContainerClassName: styles.payment_listItemPayment__radio,
  paymentImgClassName: `align-self-center ${styles.payment_listItemPayment__image}`,
  paymentWarningTextClassName: styles.payment_listItemPayment__warning,
  paymentMethodDetailsClassName: `col-12 ${styles.payment_listItemBody}`,
  paymentMethodDetailBodyClassName: styles.payment_listItemDetail,
  selectedPaymentMethodClassName: styles.payment_listItemTable,
  paymentDetailsRowClassName: styles.payment_listItemTableRow,
  paymentDetailsLabelClassName: styles.payment_listItemTableRow__label,
  paymentDetailsValueClassName: styles.payment_listItemTableRow__value,
  paymentDetailsDeductionClassName: styles.payment_pointsInsufficient,
  // footer
  paymentMethodDetailFooterClassName: styles.payment_footer,
  promotionButtonGroupClassName: styles.payment_footer__promotion,
  couponButtonClassName: `d-none btn ${styles.btn_black} ${styles.btn_long} ${styles.payment_pointButton} mb-3 px-3`,
  voucherAppliedTextClassName: styles.payment_voucherAppliedText,
  voucherButtonRemoveClassName: styles.payment_voucherAppliedRemove,
  popupClassName: styles.ordersummary_overlay,
  voucherContainerClassName: styles.payment_listItemPopup,
  closeButtonClassName: styles.payment_listItemPopup__close,
  voucherFormContainerClassName: `${styles.payment_listItemPopupForm__body} ${styles.payment_listItemPopup__payment}`,
  voucherFormClassName: `${styles.ordersummary_voucherForm} ${styles.sirclo_form_row}`,
  voucherInputClassName: `form-control ${styles.sirclo_form_input} ${styles.payment_listItemPopupForm__input}`,
  voucherSubmitButtonClassName: `btn ${styles.btn_primary} ${styles.payment_listItemPopupForm__button}`,
  voucherListClassName: styles.ordersummary_popupVoucher,
  voucherListHeaderClassName: styles.ordersummary_popupVoucherTitle,
  voucherClassName: styles.ordersummary_popupVoucherItem,
  voucherDetailClassName: styles.ordersummary_popupVoucherDetail,
  voucherDetailHeaderClassName: styles.ordersummary_popupVoucherDetailHeader,
  voucherDetailCodeClassName: styles.ordersummary_popupVoucherDetailCode,
  voucherDetailTitleClassName: styles.summarycart_popupVoucherDetailTitle,
  voucherDetailDescClassName: styles.summarycart_popupVoucherDetailDesc,
  voucherDetailEstimateClassName: styles.summarycart_popupVoucherDetailEstimate,
  voucherDetailEstimateDescClassName:
    styles.summarycart_popupVoucherDetailEstimateDesc,
  agreementContainerClassName: styles.payment_footer__agreement,
  agreementCheckboxClassName: styles.payment_footer__check,
  buttonContainerClassName: styles.payment_footer__button,
  buttonClassName: `btn ${styles.btn_primary} ${styles.btn_long}`,
  basePriceClassName: styles.payment_listItemTableRow__priceSale,
  salePriceClassName: styles.payment_listItemTableRow__price,
  shippingPriceClassName: styles.payment_listItemTableRow__priceSale,
  shippingDiscountClassName: styles.payment_listItemTableRow__price,
  //point
  pointsContainerClassName: styles.payment_containerPointPopup,
  numberOfPointsClassName: styles.payment_pointsPopup,
  pointsFormContainerClassName: styles.payment_pointsFormContainer,
  pointsFormClassName: styles.payment_pointsForm,
  pointsLabelClassName: styles.payment_pointsPopupLabel,
  pointsValueClassName: styles.payment_pointsPopupValue,
  changePointsClassName: styles.payment_buttonChangePoint,
  pointsInsufficientClassName: styles.payment_pointsInsufficient,
  pointsSubmitButtonClassName: `btn ${styles.btn_primary} ${styles.btn_long} w-100 mt-4 mb-0`,
  pointsWarningClassName: styles.payment_pointsWarning,
  pointButtonClassName: `d-none btn ${styles.btn_black} ${styles.btn_long} ${styles.payment_pointButton} mb-3 px-3`,
  pointAppliedTextClassName: styles.payment_pointAppliedText,
  pointButtonRemoveClassName: styles.payment_pointAppliedRemove,
  /* OPT WA */
  popupContainerClassName: stylesOptIn.popupOpt_popupContainer,
  optInContainer: stylesOptIn.popupOpt_optInContainer,
  optInTitle: stylesOptIn.popupOpt_optInTitle,
  optInDescription: stylesOptIn.popupOpt_optInDescription,
  optInInputContainer: stylesOptIn.popupOpt_optInInputContainer,
  optInInputPrefixContainer: stylesOptIn.popupOpt_optInInputPrefixContainer,
  optInInputPrefix: stylesOptIn.popupOpt_optInInputPrefix,
  optInOptions: stylesOptIn.popupOpt_optInOptions,
  optInOption: stylesOptIn.popupOpt_optInOption,
  optInInputNumber: stylesOptIn.popupOpt_optInInputNumber,
  optInCheckboxContainer: stylesOptIn.popupOpt_optInCheckboxContainer,
  optInCheckbox: stylesOptIn.popupOpt_optInCheckbox,
  optInBtn: `btn ${styles.btn_primary} ${styles.btn_long} w-100 mt-3 mb-0`,
  popupOverlay: stylesOptIn.popupOpt_popupOverlay,
};

const classesEmptyComponent = {
  emptyContainer: styles.payment_empty,
  emptyTitle: styles.payment_empty__title,
};

const classesPlaceholderPayment = {
  placeholderList: `${styles.placeholderItem} ${styles.placeholderItem_paymentMethod}`,
};

type PrivateComponentPropsType = {
  children: any;
};

const PrivateRouteWrapper = ({ children }: PrivateComponentPropsType) => (
  <PrivateRoute page="payment_method" loadingComponent={<LoaderPages />}>
    {children}
  </PrivateRoute>
);

const PaymentMethods: FC<any> = ({
  lng,
  lngDict,
  hasOtp,
  brand,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();
  const router = useRouter();

  return (
    <PrivateRouteWrapper>
      <Layout
        i18n={i18n}
        lng={lng}
        lngDict={lngDict}
        brand={brand}
        withHeader={false}
        withFooter={false}
      >
        <SEO title="Payment Method" />
        <div className={styles.payment}>
          <div className="row mx-0">
            <div className="col-12 p-0">
              <div className={styles.payment_container}>
                <div className="container">
                  <div className={styles.payment_heading}>
                    <div
                      className={styles.payment_headingIcon}
                      onClick={() =>
                        router.push("/[lng]/products", `/${lng}/products`)
                      }
                    >
                      <ArrowLeft color="black" />
                    </div>
                    <h6>{i18n.t("placeOrder.checkOrder")}</h6>
                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-12 col-md-12 col-lg-8 offset-lg-2">
                      <div className={styles.payment_steps}>
                        <Breadcrumb currentStep={3} />
                      </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-6 offset-lg-3">
                      
                      <div className={styles.payment_list}>
                        {/* <h3 className={styles.payment_listTitle}>
                          {i18n.t("payment.title")}
                        </h3> */}
                        <ListPaymentMethod
                          classes={classesListPaymentMethod}
                          withNotificationOptInModal={hasOtp}
                          onErrorMsg={(msg) => toast.error(msg)}
                          onErrorMsgCoupon={(msg) => toast.error(msg)}
                          voucherIcon={
                            <img
                              src="/images/mdi_ticket-percent-black.svg"
                              alt="icon"
                            />
                          }
                          closeButtonIcon={<XIcon />}
                          popupLoader={
                            <div className={styles.payment_popupProcessOverlay}>
                              <div
                                className={styles.payment_popupProcessContainer}
                              >
                                <div
                                  className={styles.payment_popupProcessInner}
                                >
                                  <span
                                    className="spinner-border spinner-border-sm mr-3"
                                    role="status"
                                  ></span>
                                  <span>{i18n.t("payment.prepayment")}</span>
                                </div>
                              </div>
                            </div>
                          }
                          loaderElement={
                            <div className="col-12 text-center mx-auto loader">
                              <Loader color="text-dark" withText />
                            </div>
                          }
                          emptyState={
                            <EmptyComponent
                              classes={classesEmptyComponent}
                              title={i18n.t("payment.isEmpty")}
                            />
                          }
                          loadingComponent={
                            <Placeholder
                              classes={classesPlaceholderPayment}
                              withList
                              listMany={3}
                            />
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </PrivateRouteWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const brand = await useBrand(req);
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || "id"
  const { default: lngDict = {} } = await import(
    `locales/${defaultLanguage}.json`
  );

  const hasOtp = await useWhatsAppOTPSetting(req);

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      hasOtp,
      brand: brand || "",
    },
  };
};

export default PaymentMethods;
