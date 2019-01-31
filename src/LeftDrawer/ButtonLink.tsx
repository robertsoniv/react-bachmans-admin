import React from "react";
import { Link } from "react-router-dom";
import Button, { ButtonProps } from "@material-ui/core/Button";

interface ButtonLinkProps extends ButtonProps {
  to: string;
}

const ButtonLink: React.FunctionComponent<ButtonLinkProps> = (
  props: ButtonLinkProps
) => {
  const buildLink = (to: string) => (props: any) => {
    return <Link to={to} {...props} />;
  };
  return <Button component={buildLink(props.to)} {...props} />;
};

export default ButtonLink;
