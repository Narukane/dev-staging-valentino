import { FC } from "react";
import {
  NewsletterForm,
  isCopyrightAllowed,
  Widget,
  SocialMediaIcons,
  useI18n,
} from "@sirclo/nexus";
import styles from "public/scss/components/Footer.module.scss";
import Version from "components/Version/Version";
import { toast } from "react-toastify";

const socialMediaIcons = {
  facebook: <img src="/images/facebook.svg" alt="facebook" />,
  twitter: <img src="/images/twitter.svg" alt="twitter" />,
  instagram: <img src="/images/instagram.svg" alt="instagram" />,
  youtube: <img src="/images/youtube.svg" alt="youtube" />,
  tiktok: <img src="/images/tiktok.svg" alt="tiktok" />,
};

const newsletterClasses = {
  containerClassName: styles.newsletter,
  labelClassName: styles.newsletter_label,
  inputClassName: styles.newsletter_input,
  buttonClassName: `${styles.btn} ${styles.btn_subscribe}`,
};

const classesMediaSocial = {
  socialMediaIconContainer: styles.socialIcon,
  socialMediaIcon: styles.socialIcon_item,
};

const Footer: FC<any> = ({ brand }) => {
  const i18n: any = useI18n();
  const allowedCopyright = isCopyrightAllowed();

  return (
    <>
      <div className={styles.widgetFooter}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-3">
              <Widget pos="footer-4" widgetClassName={styles.footer__widgetInfo} />
            </div>
            <Widget
              pos="footer-1"
              widgetClassName={`col-md-2 ${styles.footer__widget} ${styles.footer__widgetLinks} d-none d-lg-block`}
            />
            <Widget
              pos="footer-2"
              widgetClassName={`col-md-2 ${styles.footer__widget} ${styles.footer__widgetLinks} d-none d-lg-block`}
            />
            <Widget
              pos="footer-3"
              widgetClassName={`col-md-2 ${styles.footer__widget} ${styles.footer__widgetLinks} d-none d-lg-block`}
            />
            <div className={`col-md-3 ${styles.footer__widget}`}>
              <h3>{i18n.t("footer.newsletter")}</h3>
              <p>{i18n.t("footer.newsletterDesc")}</p>
              <NewsletterForm
                classes={newsletterClasses}
                buttonComponent={<>{i18n.t("footer.subscribe")}</>}
                onComplete={() =>
                  toast.success(i18n.t("newsletter.submitSuccess"))
                }
                onError={() => toast.error(i18n.t("newsletter.submitError"))}
              />
              <SocialMediaIcons
                socialMediaIcons={socialMediaIcons}
                classes={classesMediaSocial}
              />
            </div>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <div className={`container ${styles.footer_bottom} uppercase`}>
          {allowedCopyright ? (
            <>
              {brand?.settings?.websiteTitle || ""}
              {brand?.settings?.websiteTitle && allowedCopyright && ` - `}
              POWERED BY&nbsp;
              <a href="https://store.sirclo.com" target="_blank">
                SIRCLO
              </a>
            </>
          ) : (
            <Widget
              pos="copyright-and-policy"
              thumborSetting={{
                width: 1,
                format: "webp",
                quality: 5,
              }}
            />
          )}
          <Version />
        </div>
      </footer>
    </>
  );
};

export default Footer;
