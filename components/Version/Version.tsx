import { FC } from "react";
import packageJson from "package.json";

const Version: FC = () => {
  const IS_PROD = process.env.IS_PROD;

  if (IS_PROD === "false") {
    return <div className="pl-2 text-lowercase">(v{packageJson?.dependencies['@sirclo/nexus']})</div>
  }
  return null
}

export default Version;