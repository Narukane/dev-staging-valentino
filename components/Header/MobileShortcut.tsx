/* library Package */
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useI18n, useCart, PrivateComponent } from '@sirclo/nexus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faThLarge,
  faShoppingBag,
  faUser,
} from '@fortawesome/free-solid-svg-icons'

/* styles */
import styles from 'public/scss/components/Header.module.scss'

const MobileShortcut = ({ lng }) => {
  const i18n: any = useI18n();
  const router = useRouter();

  const { data } = useCart();

  return (
    <div
      className={`
      ${styles.navbar_mobile__shortcut} 
      d-lg-none 
      ${(router.pathname === "/[lng]/cart" ||
          router.pathname === "/[lng]/place_order" ||
          router.pathname === "/[lng]/shipping_method") &&
        "d-none"
        }
    `}
    >
      <div className={styles.navbar_mobile__shortcut__inner}>
        <div className={styles.navbar_mobile__shortcut__item}>
          <Link href="/[lng]" as={`/${lng}`}>
            <a>
              <FontAwesomeIcon className={styles.icon_item} icon={faHome} />
              <span className={styles.icon_title}>{i18n.t("header.home")}</span>
            </a>
          </Link>
        </div>
        <div className={styles.navbar_mobile__shortcut__item}>
          <Link href="/[lng]/products" as={`/${lng}/products`}>
            <a>
              <FontAwesomeIcon className={styles.icon_item} icon={faThLarge} />
              <span className={styles.icon_title}>{i18n.t("header.shop")}</span>
            </a>
          </Link>
        </div>
        <div className={styles.navbar_mobile__shortcut__item}>
          <Link href="/[lng]/cart" as={`/${lng}/cart`}>
            <a>
              <span style={{ position: "relative" }}>
                <FontAwesomeIcon className={styles.icon_item} icon={faShoppingBag} />
                <div className={styles.icon_badge}>{data?.totalItem}</div>
              </span>
              <span className={styles.icon_title}>{i18n.t("header.cart")}</span>
            </a>
          </Link>
        </div>
        <div className={styles.navbar_mobile__shortcut__item}>
          <PrivateComponent
            Auth={
              <Link href="/[lng]/account" as={`/${lng}/account`}>
                <a>
                  <FontAwesomeIcon className={styles.icon_item} icon={faUser} />
                  <span className={styles.icon_title}>{i18n.t("header.account")}</span>
                </a>
              </Link>
            }
            NoAuth={
              <Link href="/[lng]/login" as={`/${lng}/login`}>
                <a>
                  <FontAwesomeIcon className={styles.icon_item} icon={faUser} />
                  <span className={styles.icon_title}>{i18n.t("header.login")}</span>
                </a>
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MobileShortcut;
