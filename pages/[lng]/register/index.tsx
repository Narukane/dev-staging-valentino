/* library Package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { toast } from 'react-toastify'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  Eye,
  EyeOff,
  Calendar,
  CheckCircle,
  Mail,
  User,
  ArrowLeft,
} from 'react-feather'
import {
  Register,
  useI18n,
  SingleSignOn,
  WhatsAppOTPInput,
} from '@sirclo/nexus'

/* library Template */
import { parseCookies } from 'lib/parseCookies'
import redirectIfAuthenticated from 'lib/redirectIfAuthenticated'
import { useBrand } from 'lib/useBrand'
import { useGoogleAuth } from 'lib/useGoogleAuth'
import { useFacebookAuth } from 'lib/useFacebookAuth'
import { useWhatsAppOTPSetting } from 'lib/useWhatsappOtp'

/* component */
import SEO from 'components/SEO'
import Layout from 'components/Layout/Layout'
import Loader from 'components/Loader/Loader'
import LoaderPages from 'components/Loader/LoaderPages'

/* styles */
import styles from 'public/scss/pages/LoginRegister.module.scss'

const classesRegister = {
  containerClassName: `${styles.login_item} ${styles.login_item__form}`,
  basicInfoContainerClassName: "d-block m-0 p-0",
  deliveryAddressContainerClassName: "col-12",
  headerLabelClassName: `${styles.login_label__header} d-flex flex-row align-item-center justify-content-start`,
  inputContainerClassName: `${styles.sirclo_form_row} sirclo_form__city`,
  inputClassName: `form-control ${styles.sirclo_form_input}`,
  datePickerInputClassName: "date-picker__input",
  datePickerCalendarClassName: "date-picker__calendar",
  passwordStrengthBarClassName: styles.passwordBar,
  passwordStrengthBarContainerClassName: styles.passwordValidation,
  passwordCriteriaListClassName: `${styles.formPassword} d-none`,
  passwordCriteriaClassName: styles.formPasswordList,
  labelRequiredClassName: `d-none`,
  verificationContainerClassName: "d-block m-0 p-0",
  buttonClassName: `btn ${styles.btn_primary} ${styles.btn_long} ${styles.btn_full_width} ${styles.btn_center} text-uppercase mt-4`,
};

const classesWhatsAppOTP = {
  //form
  inputFormTitleClassName: "d-none",
  inputFormDescriptionClassName: styles.login_descWa,
  formWAContainerClassName: styles.login_formWa,
  inputLabelClassName: styles.login_formWaLabel,
  inputFormContainerClassName: styles.login_formContainer,
  inputWANumberClassName: `form-control ${styles.sirclo_form_input}`,
  btnSubmitClassName: `btn ${styles.btn_primary} ${styles.btn_long} ${styles.btn_full_width} ${styles.btn_center} mt-4`,
  inputDescriptionClassName: "d-none",
  termsAndConditionClassName: styles.login_formWaPointer,
  privacyPolicyClassName: styles.login_formWaPointer,
  //confirmation
  confirmationContainerClassName: styles.login_confirmContainer,
  confirmationHeaderContainerClassName: styles.login_confirmHeader,
  confirmationBackContainerClassName: styles.login_confirmBack,
  confirmationBackLabelClassName: `${styles.login_confirmBackLabel} ml-2`,
  confirmationHeaderTitleClassName: styles.login_confirmTitle,
  confirmationHeaderSubtitleClassName: styles.login_confirmSubtitle,
  confirmationButtonOTPClassName: `btn ${styles.btn_primary} ${styles.btn_long} ${styles.btn_full_width} ${styles.btn_center}`,
  noWhatsAppLabelClassName: styles.login_confirmQuestion,
  anotherLoginMethodClassName: styles.login_confirmWithOtherMethod,
  //verification
  verificationContainerClassName: styles.login_verifContainer,
  verificationHeaderClassName: styles.login_verifHeader,
  verificationTitleClassName: styles.login_verifTitle,
  verificationBodyClassName: styles.login_verifBody,
  infoLabelClassName: styles.login_verifSubtitle,
  fieldOTPInputContainerClassName: styles.login_verifInputContainer,
  fieldOTPInputClassName: `form-control ${styles.sirclo_form_input} ${styles.login_verifInputOtp}`,
  verificationFooterClassName: styles.login_verifFooter,
  btnResendOTPClassName: `btn ${styles.btn_primary} ${styles.btn_long} ${styles.btn_full_width} ${styles.btn_center} ${styles.login_buttonOtp}`,
  footerLabelClassName: styles.login_verifFooterLabel,
  btnChangeMethodClassName: styles.login_confirmWithOtherMethod,
  //choose account
  chooseAccountHeaderClassName: styles.login_accountHeader,
  chooseAccountTitleClassName: styles.login_accountTitle,
  chooseAccountDescriptionClassName: styles.login_accountDesc,
  accountOptionsContainerClassName: styles.login_accountOptionContainer,
  accountOptionClassName: styles.login_accountOption,
  selectedAccountClassName: styles.login_accountOptionSelected,
  accountContainerClassName: styles.login_accountContainer,
  accountNameClassName: styles.login_accountName,
  accountEmailClassName: styles.login_accountEmail,
  btnChooseAccountClassName: `btn ${styles.btn_primary} ${styles.btn_long} ${styles.btn_full_width} ${styles.btn_center} ${styles.login_buttonOtp}`,
};

const RegisterPage: FC<any> = ({
  lng,
  lngDict,
  brand,
  hasGoogleAuth,
  hasFacebookAuth,
  hasOtp,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const i18n: any = useI18n();
  const router: any = useRouter();
  const query = router?.query || {};

  const STEPS = {
    WA: "whatsapp-input",
    EMAIL: "email",
  };

  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [step, setStep] = useState<string>(STEPS.WA);

  const brandName = (brand: string): string => {
    const lower = brand?.toLowerCase();
    return brand?.charAt(0).toUpperCase() + lower?.slice(1);
  };

  const handleChangeStep = (step: string) => {
    if (step === STEPS.EMAIL) setStep(STEPS.WA);
    if (step === STEPS.WA) setStep(STEPS.EMAIL);
  };

  return (
    <Layout
      i18n={i18n}
      lng={lng}
      lngDict={lngDict}
      brand={brand}
      withFooter={false}
    >
      <SEO title={i18n.t("register.register")} />
      <section className={styles.login_wrapper}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-6 offset-xl-3">
              <div className={styles.login_container}>
                {step === STEPS.EMAIL || !hasOtp ? (
                  <>
                    <div
                      className={`${styles.login_item} ${styles.login_item__title}`}
                    >
                      <h3>{i18n.t("register.newAccount")}</h3>
                      <span>{i18n.t("register.promo")}</span>
                    </div>

                    <Register
                      classes={classesRegister}
                      withHeaderLabel={true}
                      onErrorMsg={(msg) => toast.error(msg)}
                      onSuccessMsg={(msg) => toast.success(msg)}
                      redirectPage={() =>
                        router.push(`/[lng]/login`, `/${lng}/login`)
                      }
                      passwordViewIcon={<Eye />}
                      passwordHideIcon={<EyeOff />}
                      passwordFulfilledCriteriaIcon={
                        <CheckCircle color="green" size={16} />
                      }
                      passwordUnfulfilledCriteriaIcon={
                        <CheckCircle color="gray" size={16} />
                      }
                      datePickerCalendarIcon={<Calendar />}
                      withVerification={true}
                      isVerified={isVerified}
                      loadingComponent={<Loader color="text-light" />}
                      verificationComponent={
                        <ReCAPTCHA
                          sitekey={process.env.NEXT_PUBLIC_SITEKEY_RECAPTCHA}
                          onChange={() => setIsVerified(true)}
                        />
                      }
                    />
                  </>
                ) : (
                  <>
                    {step === STEPS.WA && (
                      <div
                        className={`${styles.login_item} ${styles.login_item__title} mb-0`}
                      >
                        <h3>{i18n.t("register.title")}</h3>
                      </div>
                    )}
                    <WhatsAppOTPInput
                      brandName={brandName(brand?.name)}
                      onStepChange={setStep}
                      classes={classesWhatsAppOTP}
                      loginRedirectPath="account"
                      inputPlaceholder={i18n.t(
                        "whatsAppOTPInput.inputPlaceholder"
                      )}
                      onErrorMsg={(msg) => toast.error(msg)}
                      onCompletedMsg={(msg) => toast.success(msg)}
                      loadingComponent={
                        <div>
                          <LoaderPages />
                        </div>
                      }
                      icons={{
                        account: <User />,
                        back: <ArrowLeft size={16} strokeWidth="3px" />,
                      }}
                      customLocales={{
                        continue: i18n.t("register.title"),
                        disclaimer: i18n.t("register.disclaimer"),
                        inputWhatsApp: i18n.t("register.inputWhatsApp"),
                        loginWithAnotherMethod: i18n.t(
                          "register.loginWithAnotherMethod"
                        ),
                        chooseAnyAccountToLogin: i18n.t(
                          "register.chooseAnyAccountToLogin"
                        ),
                      }}
                    />
                  </>
                )}

                {(step === STEPS.EMAIL || step === STEPS.WA) && (
                  <>
                    <div
                      className={`${styles.login_item} ${styles.login_item__sso}`}
                    >
                      <br />
                      <br />
                      {(hasGoogleAuth || hasFacebookAuth) && (
                        <SingleSignOn
                          className={styles.login_item__ssoButton}
                          buttonText={i18n.t("register.sso")}
                          loadingComponent={
                            <div className={`${styles.popup_overlay}`}>
                              <LoaderPages />
                            </div>
                          }
                        />
                      )}
                      {hasOtp && (
                        <button
                          className={`${styles.login_item__ssoButton} ${styles.login_item__ssoButtonWaMail}`}
                          onClick={() => handleChangeStep(step)}
                        >
                          {step === STEPS.EMAIL ? (
                            <img
                              src="/images/wa.svg"
                              className="mr-2"
                              alt="whatsapp"
                            />
                          ) : (
                            <Mail size={20} className="mr-2" />
                          )}
                          <span>
                            {step === STEPS.EMAIL
                              ? i18n.t("register.whatsapp")
                              : i18n.t("register.emailregis")}
                          </span>
                        </button>
                      )}
                    </div>
                    <br/>
                    {(step === STEPS.WA || step === STEPS.EMAIL) && (
                      <div
                        className={`${styles.login_item} ${styles.login_item__link} text-center`}
                      >
                        {i18n.t("register.haveAccount")}{" "}
                        <Link
                          href={{
                            pathname: "/[lng]/login",
                            query: query,
                          }}
                        >
                          <a>{i18n.t("register.toLogin")}</a>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const brand = await useBrand(req);
  const defaultLanguage =
    brand?.settings?.defaultLanguage || params.lng || "id";
  const { default: lngDict = {} } = await import(
    `locales/${defaultLanguage}.json`
  );

  const cookies = parseCookies(req);
  const hasGoogleAuth = await useGoogleAuth(req);
  const hasFacebookAuth = await useFacebookAuth(req);
  const hasOtp = await useWhatsAppOTPSetting(req);
  redirectIfAuthenticated(res, cookies, "account", defaultLanguage);

  return {
    props: {
      lng: defaultLanguage,
      lngDict,
      hasGoogleAuth,
      hasFacebookAuth,
      hasOtp,
      brand: brand || "",
    },
  };
};

export default RegisterPage;
