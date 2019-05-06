import React from "react";
import { Link } from "react-router-dom";
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton";

interface IconButtonLinkProps extends IconButtonProps {
  to: string;
}

const IconButtonLink: React.FunctionComponent<IconButtonLinkProps> = (
  props: IconButtonLinkProps
) => {
  const buildLink = (to: string) => (props: any) => {
    return <Link to={to} {...props} />;
  };
  return <IconButton component={buildLink(props.to)} {...props} />;
};

export default IconButtonLink;
