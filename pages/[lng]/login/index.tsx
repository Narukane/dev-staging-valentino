/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Eye, EyeOff, ArrowLeft, User, Mail } from 'react-feather'
import { Login, useI18n, SingleSignOn, WhatsAppOTPInput } from '@sirclo/nexus'

/* library template */
import { parseCookies } from 'lib/parseCookies'
import redirectIfAuthenticated from 'lib/redirectIfAuthenticated'
import { useBrand } from 'lib/useBrand'
import { useGoogleAuth } from 'lib/useGoogleAuth'
import { useFacebookAuth } from 'lib/useFacebookAuth'
import { useWhatsAppOTPSetting } from 'lib/useWhatsappOtp'

/* components */
import SEO from 'components/SEO'
import Layout from 'components/Layout/Layout'
import Loader from 'components/Loader/Loader'
import LoaderPages from 'components/Loader/LoaderPages'

/* styles */
import styles from 'public/scss/pages/Login.module.scss'

const loginClasses = {
  containerClassName: `${styles.login_item} ${styles.login_item__form}`,
  inputContainerClassName: styles.sirclo_form_row,
  inputClassName: `form-control ${styles.sirclo_form_input}`,
  buttonClassName: `btn ${styles.btn_primary} ${styles.btn_long} ${styles.btn_full_width} ${styles.btn_center} text-uppercase mt-4 mb-2`,
  footerClassName: `d-none`,
  forgotPasswordClass: `${styles.login_item} ${styles.login_item__link} text-center`,
  forgotLinkClass: `${styles.login_forgotLink}`,
};

const classesWhatsAppOTP = {
  //form
  inputFormTitleClassName: "d-none",
  inputFormDescriptionClassName: styles.login_descWa,
  inputFormContainerClassName: styles.login_formContainer,
  formWAContainerClassName: styles.login_formWa,
  inputLabelClassName: styles.login_formWaLabel,
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
  chooseAccountContainerClassName: styles.login_accountContainer,
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

const LoginPage: FC<any> = ({
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
      <SEO title={i18n.t("login.title")} />

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
                      <h3>{i18n.t("login.title")}</h3>
                      <span>{i18n.t("login.welcomeEmail")}</span>
                    </div>
                    <Login
                      classes={loginClasses}
                      onCompletedMsg={(msg) => toast.success(msg)}
                      onErrorMsg={(msg) => toast.error(msg)}
                      passwordViewIcon={<Eye />}
                      passwordHideIcon={<EyeOff />}
                      loadingComponent={<Loader color="text-light" />}
                    />
                  </>
                ) : (
                  <>
                    {step === STEPS.WA && (
                      <div
                        className={`${styles.login_item} ${styles.login_item__title} mb-0`}
                      >
                        <h3>{i18n.t("login.titleWA")}</h3>
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
                        continue: i18n.t("login.title"),
                        loginWithAnotherMethod: i18n.t(
                          "login.loginWithAnotherMethod"
                        ),
                        chooseAnyAccountToLogin: i18n.t(
                          "login.chooseAnyAccountToLogin"
                        ),
                        disclaimer: i18n.t("login.disclaimer"),
                        inputWhatsApp: i18n.t("login.inputWhatsApp"),
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
                          buttonText={i18n.t("login.sso")}
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
                              ? i18n.t("login.whatsapp")
                              : i18n.t("login.email")}
                          </span>
                        </button>
                      )}
                      <br />
                    </div>
                    {(step === STEPS.WA || step === STEPS.EMAIL) &&  (
                      <div
                        className={`${styles.login_item} ${styles.login_item__link} text-center`}
                      >
                        {i18n.t("login.dontHaveAccount")}{" "}
                        <Link
                          href={{
                            pathname: "/[lng]/register",
                            query: query,
                          }}
                        >
                          <a>{i18n.t("login.toRegister")}</a>
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
  const defaultLanguage = brand?.settings?.defaultLanguage || params.lng || "id"
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

export default LoginPage;
