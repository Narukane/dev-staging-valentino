
import { FC } from 'react';
import { BanksAccount as BanksAccountList } from '@sirclo/nexus';
import { toast } from "react-toastify";
import Loader from "components/Loader/Loader";

import stylesBanks from "public/scss/components/BanksAccount.module.scss";

import {
    ChevronUp,
    ChevronDown,
    Copy
  } from "react-feather";

const BanksAccount: FC = () => {

  const classesBankAccount = {
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

  return (
    <BanksAccountList
      classes={classesBankAccount}
      loadingComponent={<Loader color="text-light" />}
      onSuccessMsg={(msg) => toast.success(msg)}
      icon={{
        chevronUp: <ChevronUp/>,
        chevronDown: <ChevronDown />,
        copy: <Copy />
      }}
    />
  )
}

export default BanksAccount;