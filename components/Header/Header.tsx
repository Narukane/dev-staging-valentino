import { FC, useState } from "react";
import { Logo, useCart, Widget, useLogout, Navigation } from "@sirclo/nexus";
import ProfileMenu from "./ProfileMenu";
import Placeholder from "../Placeholder";
import useWindowSize from "lib/useWindowSize";
import MobileNavButton from "./MobileNav";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { X } from "react-feather";
import styles from "public/scss/components/Header.module.scss";

const navClasses = {
  dropdownContainerClassName: styles.dropdown_container,
  navItemClassName: `nav-item ${styles.line_valentino}`,
  navLinkClassName: `nav-link ${styles.nav_link_valentino}`,
  navbarUlClassName: `navbar-nav ${styles.navbar_valentino}`,
  subChildClassName: styles.subchild,
  withChildClassName: styles.withchild,
};

const classesPlaceholderLogo = {
  placeholderImage: `${styles.placeholderItem} ${styles.placeholderItem_header__logo}`,
};
const classesPlaceholderWidget = {
  placeholderTitle: `${styles.placeholderItem} ${styles.placeholderItem_header__widget}`,
};

const classesPlaceholderNav = {
  placeholderList: `${styles.placeholderItem} ${styles.placeholderItem__header__nav}`,
};

const Header: FC<any> = ({ lng }) => {
  const { data: dataCart } = useCart();
  const logout = useLogout("login");
  const size: any = useWindowSize();

  const [showAnnounce, setShowAnnounce] = useState<boolean>(true);
  const [countWidgetAnnouncement, setCountWidgetAnnouncement] = useState(null);

  return (
    <>
      {(countWidgetAnnouncement === null || countWidgetAnnouncement > 0) && (
        <div
          className={styles.announce}
          style={{ display: showAnnounce ? "flex" : "none" }}
        >
          <span className={styles.announce__close}>
            <X
              className={styles.announce__close__icon}
              onClick={() => setShowAnnounce(false)}
            />
          </span>
          <Widget
            getItemCount={(itemCount: number) =>
              setCountWidgetAnnouncement(itemCount)
            }
            pos="header-announcements"
            widgetClassName={styles.announce__items}
            loadingComponent={
              <Placeholder classes={classesPlaceholderWidget} withTitle />
            }
          />
        </div>
      )}
      <header
        className={`${styles.header} d-none d-lg-flex`}
      >
        <nav
          className={`
        navbar 
        navbar-expand-lg
        navbar-light
        d-none
        d-lg-flex
        ${styles.nav_valentino} 
      `}
        >
          <div className="container">
            <div className={styles.navbar_logo}>
              <LazyLoadComponent
                placeholder={
                  <Placeholder
                    classes={classesPlaceholderLogo}
                    withImage={true}
                  />
                }
              >
                <Logo
                  imageClassName={styles.navbar_logo__image}
                  thumborSetting={{
                    width: size.width < 575 ? 200 : 400,
                    quality: 90,
                  }}
                  lazyLoadedImage={false}
                />
              </LazyLoadComponent>
            </div>
            <Navigation
              classes={navClasses}
              loadingComponent={
                <div className="d-flex">
                  <Placeholder
                    classes={classesPlaceholderNav}
                    withList={true}
                    listMany={4}
                  />
                </div>
              }
            />
            <ProfileMenu
              lng={lng}
              size={size}
              totalQuantity={dataCart?.totalItem}
              styles={styles}
            />
          </div>
        </nav>
      </header>
      <MobileNavButton lng={lng} actionLogout={logout} />
    </>
  );
};

export default Header;
