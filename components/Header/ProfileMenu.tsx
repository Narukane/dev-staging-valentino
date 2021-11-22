import {
  FC,
  useState,
} from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useI18n } from "@sirclo/nexus";
import dynamic from "next/dynamic";
import {
  User,
  ShoppingCart,
  Search as IconSearch
} from 'react-feather';

const Popup = dynamic(() => import("../Popup/Popup"));
const Search = dynamic(() => import("./Search"));
const PrivateComponent = dynamic(() => import("@sirclo/nexus").then((mod) => mod.PrivateComponent));

const ProfileMenu: FC<any> = ({
  lng,
  size,
  totalQuantity,
  styles
}) => {
  const router = useRouter();
  const i18n: any = useI18n();

  const [openSearch, setOpenSearch] = useState<boolean>(false);

  const searchProduct = (val: any) => {
    if (val !== "" && typeof val !== "undefined") {
      Router.push(`/${lng}/products?q=${val}`);
      setOpenSearch(false);
    } else {
      Router.push(`/${lng}/products`);
      setOpenSearch(false);
    }
  };

  const toogleSearch = () => setOpenSearch(!openSearch);



  const classesSearch = {
    searchContainer: styles.search_container,
    searchInputContainer: styles.search_inputContainer,
    searchInput: `form-control ${styles.sirclo_form_input} ${styles.search_inputText}`,
    searchClear: `btn ${styles.search_buttonClear}`,
    searchButton: styles.search_buttonSearch,
    searchForm: styles.search_form
  }

  return (
    <div className={styles.navbar_profile_menu}>
      <a
        className={styles.navbar_profile_menu__cart}
        onClick={(e) => e.preventDefault()}
        href="#"
      >
        <div
          className={`${styles.nav__icon} mr-2 mr-md-4`}
          onClick={toogleSearch}
        >
          <IconSearch
            size={size.width < 575 ? 18 : 24}
            color="white"
          />
        </div>
      </a>
      <PrivateComponent
        Auth={
          <div className=" d-none d-lg-flex">
            <Link href="/[lng]/account" as={`/${lng}/account`}>
              <a>
                <User
                  size={size.width < 575 ? 18 : 24}
                  color="white"
                />
              </a>
            </Link>
          </div>
        }
        NoAuth={
          <button  onClick={() => router.push(`/[lng]/login`, `/${lng}/login`)} className="btn btn-danger d-none d-lg-flex">Login</button>
        }
      />
      <a
        className={styles.navbar_profile_menu__cart}
        onClick={(e) => e.preventDefault()}
        href="#"
      >
        <div
          className={`${styles.nav__icon} ml-2 ml-md-4  d-none
          d-lg-flex`}
        >
          <Link href="/[lng]/cart" as={`/${lng}/cart`}>
          <ShoppingCart
            size={size.width < 575 ? 18 : 24}
            color="white"
          />
          </Link>
          <span className={styles.badge_cart} onClick={() => router.push(`/[lng]/cart`, `/${lng}/cart`)}>{totalQuantity}</span>
        </div>
      </a>
      {openSearch &&
        <Popup
          withHeader
          setPopup={toogleSearch}
          mobileFull
          classPopopBody
          popupTitle={i18n.t("header.searchProduct")}
        >
          <Search
            classes={classesSearch}
            searchProduct={searchProduct}
            visibleState={openSearch}
          />
        </Popup>
      }
    </div>
  )
}

export default ProfileMenu;