import { FC, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
  Account,
  useI18n,
  useLogout
} from "@sirclo/nexus";
import { toast } from "react-toastify";
import SEO from "components/SEO";
import Layout from "components/Layout/Layout";
import Loader from "components/Loader/Loader";
import { parseCookies } from "lib/parseCookies";
import { useBrand } from "lib/useBrand";
import { useWhatsAppOTPSetting } from "lib/useWhatsappOtp";
import {
  X as XIcon,
  AlertCircle,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle,
  Crosshair,
  ChevronDown,
  Mail,
  ChevronUp
} from "react-feather";
import styles from "public/scss/pages/Account.module.scss";
import stylesPopupConfirmationOrder from "public/scss/components/popupConfirmationOrder.module.scss";
import stylesPopupCheckPaymentOrder from "public/scss/components/CheckPaymentOrder.module.scss";
import stylesNotif from "public/scss/components/Notification.module.scss";

const ACTIVE_CURRENCY = "IDR";

const classesAccount = {
  containerClassName: styles.account,
  tabClassName: styles.account_tab,
  tabItemClassName: styles.account_tabNav,
  linkTabItemClassName: styles.account_tabNav__link,
  linkTabItemActiveClassName: styles.account_tabNav__linkActive,
  tabPaneClassName: styles.account_tab__pane,
  /* my account classes */
  myAccountClassName: styles.account_info,
  myAccountContentClassName: styles.account_myAccount,
  myAccountBodyClassName: styles.account_myAccount_order,
  myAccountFieldClassName: styles.account_myAccount_order__list,
  loyaltyPointContainerClassName: styles.account_loyalty,
  /* order history classes */
  orderHistoryContainerClassName: styles.table_orderhistory,
  tableClassName: styles.table_history,
  orderedItemDetailNeedReviewClassName: styles.table_itemDetailNeedReview,
  orderedItemDetailDeliveredClassName: styles.table_orderedItemDetailDelivered,
  orderedItemDetailUploadReceiptClassName: styles.table_orderedItemDetailUploadReceipt,
  /* change password clases */
  editAccountClassName: styles.account_edit,
  inputContainerClassName: `${styles.sirclo_form_row} d-md-flex align-items-center`,
  inputLabelClassName: styles.account_edit__label,
  inputClassName: `form-control ${styles.sirclo_form_input} ${styles.size_label}`,
  changePasswordClassName: styles.account_changePassword,
  passwordContainerClassName: `d-flex align-items-center position-relative w-100`,
  passwordInputClassName: `form-control ${styles.sirclo_form_input}`,
  passwordStrengthBarClassName: styles.passwordBar,
  passwordStrengthBarContainerClassName: `${styles.passwordValidation} ${styles.marginAccount}`,
  passwordCriteriaListClassName: `${styles.formPassword} ${styles.marginAccount} ${styles.formPasswordAccount} d-none`,
  passwordCriteriaClassName: styles.formPasswordList,
  buttonClassName: `btn text-uppercase mr-2 ${styles.btn_primary} ${styles.btn_long}`,
  /* map */
  mapAreaClassName: styles.account_mapArea,
  mapSelectAreaClassName: styles.account_buttonLocation,
  mapPopupClassName: styles.account_mapPopup,
  mapPopupBackgroundClassName: styles.account_mapPopupContainer,
  mapClassName: styles.account_mapPopupMaps,
  mapHeaderWrapperClassName: styles.account_mapPopupHeader,
  mapHeaderTitleClassName: styles.account_mapPopupHeaderTitle,
  mapHeaderCloseButtonClassName: styles.account_mapPopupClose,
  mapHeaderNoteClassName: styles.account_mapPopupNote,
  mapLabelAddressClassName: styles.account_mapPopupLabelAddress,
  mapCenterButtonClassName: styles.account_mapPopupCenterButton,
  mapButtonFooterClassName: `btn ${styles.btn_primary} ${styles.btn_long} d-block mx-auto my-3`,
  /* tracking */
  shippingTrackerButton: `btn my-3 ${styles.btn_secondary} ${styles.btn_long}`,
  shipmentTrackingClassName: `${styles.track_shipmentTracking} ${styles.account_shipmentTracking}`,
  shipmentHeaderClassName: `${styles.track_shipmentHeader} ${styles.account_shipmentContainer}`,
  shipmentBodyClassName: `${styles.track_shipmentBody} ${styles.account_shipmentContainer} d-flex justify-content-center`,
  shipmentFooterClassName: `${styles.track_shipmentFooter} ${styles.account_shipmentContainer} d-flex justify-content-center text-center`,
  shipmentHeaderTextClassName: styles.track_shipmentHeaderText,
  shipmentTextClassName: styles.track_shipmentText,
  shipmentNoteClassName: styles.track_shipmentNote,
  shipmentListClassName: styles.track_shipmentList,
  shipmentListWrapperClassName: styles.track_shipmentListWrapper,
  shipmentCloseIconClassName: styles.track_shipmentCloseIcon,
  shipmentTrackButtonClassName: styles.track_shipmentTrackButton,
  /* Membership History */
  membershipStatusClassName: styles.membership_status,
  accordionClassName: styles.membership_accordion,
  accordionToggleClassName: styles.membership_accordionToggle,
  accordionIconClassName: styles.membership_accordionIcon,
  totalPointsClassName: styles.membership_totalPoints,
  membershipProgressClassName: styles.membership_progress,
  membershipPromptClassName: styles.membership_prompt,
  linkContinueClassName: styles.membership_linkContinue,
  membershipHistoryClassName: styles.membership_history,
  pointHistoryItemClassName: styles.membership_historyItem,
  orderIDClassName: styles.membership_orderId,
  transactionTypeClassName: styles.membership_transactionType,
  transactionDateClassName: styles.membership_transactionDate,
  pointDeltaClassName: styles.membership_point,
  membershipPaginationClassName: styles.membership_pagination,
  itemPerPageClassName: styles.membership_itemPerPage,
  itemPerPageLabelClassName: styles.membership_itemPerPageLabel,
  itemPerPageOptionsClassName: styles.membership_itemPerPageOptions,
  buttonContinueClassName: `btn ${styles.btn_primary} ${styles.btn_long}`,
  //datepicker
  datePickerInputClassName: "date-picker__input",
  datePickerCalendarClassName: "date-picker__calendar",
  //popupConfirmationOrder
  popupConfirmationOrderContainerClassName: stylesPopupConfirmationOrder.container,
  popupConfirmationOrderContentClassName: stylesPopupConfirmationOrder.content,
  popupConfirmationOrderTitleClassName: stylesPopupConfirmationOrder.title,
  popupConfirmationOrderNoteClassName: stylesPopupConfirmationOrder.note,
  popupConfirmationOrderDescriptionClassName: stylesPopupConfirmationOrder.description,
  popupConfirmationOrderWrapButtonClassName: stylesPopupConfirmationOrder.wrapButton,
  popupConfirmationOrderButtonConfirmClassName: stylesPopupConfirmationOrder.buttonNo,
  popupConfirmationOrderButtonNoClassName: stylesPopupConfirmationOrder.buttonConfirm,
  //order history info
  orderInfoContainerClassName: styles.membership_info_container,
  OrderInfoIconClassName: styles.membership_info_icon,
  orderInfoLabelClassName: styles.membership_info_label,
  OrderInfoSearchHereClassName: styles.membership_info_button,
  //popupCheckPaymentOrder
  checkPaymentOrderContainerClassName: stylesPopupCheckPaymentOrder.checkOrder_overlay,
  checkPaymentOrderContainerBodyClassName: stylesPopupCheckPaymentOrder.checkOrder_container,
  checkPaymentOrderHeaderClassName: stylesPopupCheckPaymentOrder.checkOrder_header,
  checkPaymentOrderTitleClassName: stylesPopupCheckPaymentOrder.checkOrder_title,
  checkPaymentOrderDescriptionClassName: stylesPopupCheckPaymentOrder.checkOrder_description,
  checkPaymentOrderContentClassName: stylesPopupCheckPaymentOrder.checkOrder_content,
  checkPaymentOrderInputContentClassName: stylesPopupCheckPaymentOrder.checkOrder_inputContent,
  checkPaymentOrderInputTitleClassName: stylesPopupCheckPaymentOrder.checkOrder_inputTitle,
  checkPaymentOrderInputClassName: stylesPopupCheckPaymentOrder.checkOrder_input,
  checkPaymentOrderCloseButtonClassName: stylesPopupCheckPaymentOrder.checkOrder_closeButton,
  checkPaymentOrderSubmitButtonClassName: stylesPopupCheckPaymentOrder.checkOrder_submitButton,
  /* setting notification */
  settingNotifContainer: stylesNotif.notification,
  settingNotifHeader: "d-none",
  settingNotifDescription: stylesNotif.notification_desc,
  settingNotifMediaContainer: stylesNotif.notification_mediaContainer,
  settingNotifMedia: stylesNotif.notification_media,
  settingNotifMediaDisabled: stylesNotif.notification_mediaDisable,
  mediaParent: stylesNotif.notification_mediaParent,
  mediaLabelContainer: stylesNotif.notification_mediaLabel,
  mediaInnerLabelContainer: stylesNotif.notification_mediaInnerLabel,
  mediaDescription: stylesNotif.notification_mediaDesc,
  mediaCheckboxContainer: stylesNotif.notification_mediaCheckboxContainer,
  mediaCheckbox: stylesNotif.notification_mediaCheckbox,
  mediaCheckboxSlider: stylesNotif.notification_mediaCheckboxSlider,
  mediaDetailContainer: stylesNotif.notification_mediaDetailContainer,
  mediaDetailLabel: stylesNotif.notification_mediaDetailLabel,
  mediaDetailCheckboxContainer: stylesNotif.notification_mediaDetailCheckboxContainer,
  mediaDetailCheckbox: stylesNotif.notification_mediaDetailCheckbox,
  mediaDetailCheckboxLabel: stylesNotif.notification_mediaDetailCheckboxLabel,

  //Table 
  tableDetailContainerClassName:styles.table_detail_container,
  tableDetailInfoSectionClassName: styles.table_detail_info_section,
  tableDetailInfoItemClassName: styles.table_detail_info_item,
  tableDetailPriceLineClassName: styles.table_detail_price_line,
  tableDetailItemSectionClassName: styles.table_detail_info_section,
  tableDetailItemLineClassName: styles.table_detail_item_line,
  tableDetailItemImageClassName: styles.table_detail_item_image,
  tableDetailItemDescClassName: styles.table_detail_item_desc,
  tableDetailViewInvoiceClassName: styles.table_detail_buttonInvoice,
  tableDetailTitleClassName: styles.table_detail_title,

  tableDetailLabelNeedReviewClassName: styles.table_detail_buttonNeedReview,
  tableDetailLabelReviewedClassName: styles.table_detail_buttonInvoice,
  tableDetailButtonDeliveredClassName: `btn my-3 ${styles.btn_primary} ${styles.btn_long}`,
  tableDetailButtonNeedReviewClassName: `btn my-3 ${styles.btn_secondary} ${styles.btn_long}`,
  tableDetailButtonDetailClasName: styles.table_detail_buttonInvoice,
  tableDetailUploadReceiptClassName: `btn my-3 ${styles.table_detail_buttonUpload}`,
  paymentStatusUnpaidClassName: styles.table_status,
  paymentStatusPaidClassName: styles.table_status,
  paymentStatusReadyToShipClassName: styles.table_status,
  paymentStatusShippedClassName: styles.table_status,
  paymentStatusDeliveredClassName: styles.table_status,
  paymentStatusNeedReviewClassName: styles.table_status,
  paymentStatusCompletedClassName: styles.table_status,
  paymentStatusCancelledClassName: `${styles.table_status} ${styles.table_status_cancelled}`,
  paymentStatusReturnedClassName: `${styles.table_status} ${styles.table_status_cancelled}`,
};

const orderHistoryPaginationClasses = {
  pagingClassName: styles.pagination,
  activeClassName: styles.pagination_active,
  itemClassName: styles.pagination_item,
}

const AccountsPage: FC<any> = ({
  lng,
  lngDict,
  hasOtp,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();
  const logout = useLogout('login');

  const [name, setName] = useState<string>("");

  const onError = (msg: string) => toast.error(msg);
  const onSuccessChPass = (msg: string) => toast.success(msg);

  const onSuccess = (msg: string, data: any) => {
    if (data) {
      setName(data?.upsertProfile[0]?.firstName + " " + data?.upsertProfile[0]?.lastName);
    }
    toast.success(msg);
  };

  const onFetchCompleted = (_: string, data: any) => {
    const { firstName, lastName } = data?.members[0];
    setName(`${firstName} ${lastName}`);
  };

  return (
    <Layout
      i18n={i18n}
      lng={lng}
      lngDict={lngDict}
      brand={brand}
    >
      <SEO title={i18n.t("account.myAccount")} />
      <div className="container">
        <div className={styles.account_profile}>
          <h2 className={styles.account_profile_title}>
            {i18n.t("account.hallo")}{", "}
            <span>{name || "Guys"}</span>
            <span
              className={styles.account_profile__logout}
              onClick={logout}
            >
              <LogOut color="red" />
            </span>
          </h2>
        </div>
        <Account
          classes={classesAccount}
          orderHistoryPaginationClasses={orderHistoryPaginationClasses}
          currency={ACTIVE_CURRENCY}
          onFetchCompleted={onFetchCompleted}
          onErrorMsg={onError}
          onSuccessMsg={onSuccess}
          onSuccessChPass={onSuccessChPass}
          orderHistoryIsCallPagination={true}
          orderHistoryItemPerPage={10}
          paymentHrefPrefix="payment_notif"
          showSettingNotification={hasOtp}
          passwordViewIcon={<Eye />}
          passwordHideIcon={<EyeOff />}
          passwordFulfilledCriteriaIcon={<CheckCircle color="green" size={16} />}
          passwordUnfulfilledCriteriaIcon={<CheckCircle color="gray" size={16} />}
          mapButtonCloseIcon={<XIcon />}
          mapCenterIcon={<Crosshair />}
          membershipPaginationClasses={orderHistoryPaginationClasses}
          icons={{
            accordionIcon: <ChevronDown size={20} color="#2296CB" />,
            closeIcon: <XIcon />,
            infoIcon: <AlertCircle />,
            chevronDownIcon: <ChevronDown/>,
            chevronUpIcon: <ChevronUp/>,
            loadingIcon: <Loader color="text-light" />,
            email: <Mail />,
            whatsApp: <img src="/images/wa.svg" alt="whatsapp" />,
            line: <img src="/images/line.svg" alt="line" />,
            iconTracker: <img src="/images/motorcycle.svg" alt="motorcycle" />
          }}
        />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
}) => {
  const brand = await useBrand(req);
  const cookies = parseCookies(req);
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || cookies.ACTIVE_LNG || 'id';
  const hasOtp = await useWhatsAppOTPSetting(req);
  const { default: lngDict = {} } = await import(`locales/${defaultLanguage}.json`);

  if (res) {
    const auth = cookies.AUTH_KEY;

    if (!auth) {
      res.writeHead(301, {
        Location: `/${defaultLanguage}/login`,
      });
      res.end();
    }
  }

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      hasOtp,
      brand: brand || ""
    }
  };
}

export default AccountsPage;
