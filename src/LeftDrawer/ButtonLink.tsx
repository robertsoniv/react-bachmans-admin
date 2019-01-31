import React from "react";
import { Link } from "react-router-dom";
import Button, { ButtonProps } from "@material-ui/core/Button";

interface ButtonLinkProps extends ButtonProps {
  to: string;
}

class ButtonLink extends React.Component<ButtonLinkProps> {
  public buildLink = (to: string) => (props: any) => {
    return <Link to={to} {...props} />;
  };
  public render() {
    return <Button component={this.buildLink(this.props.to)} {...this.props} />;
  }
}

export default ButtonLink;
