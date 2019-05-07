import React from "react";
import {
  SecurityProfiles,
  SecurityProfile,
  UserGroup,
  ListSecurityProfileAssignment
} from "ordercloud-javascript-sdk";
import {
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  TextField,
  withStyles,
  Theme,
  createStyles,
  Button,
  Typography,
  Grid
} from "@material-ui/core";
import Case from "case";
import ContentLoading from "../../Layout/ContentLoading";

interface AdminUserGroupFormProps {
  onSubmit: (userGroup: UserGroup, selectedProfiles: string[]) => Promise<any>;
  disabled?: boolean;
  userGroup: UserGroup;
  assignments?: ListSecurityProfileAssignment;
  classes: any;
  theme: Theme;
}

interface AdminUserGroupFeatures {
  [category: string]: SecurityProfile[];
}

interface AdminUserGroupFormState {
  featureTypes: AdminUserGroupFeatures;
  selectedProfiles: string[];
  userGroup: UserGroup;
  errors: string[];
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing.unit * 3
    },
    formButtons: {
      display: "flex",
      flexFlow: "row nowrap"
    },
    spacer: {
      width: theme.spacing.unit
    }
  });

class AdminUserGroupForm extends React.Component<
  AdminUserGroupFormProps,
  AdminUserGroupFormState
> {
  public componentDidMount = async () => {
    this.setInitialState();
    const featureTypes = await this.getFeatureProfiles();
    this.setState({
      featureTypes
    });
  };

  public componentDidUpdate = (prevProps: AdminUserGroupFormProps) => {
    if (this.props.disabled && this.props.disabled !== prevProps.disabled) {
      this.setInitialState();
    }
  };

  public setInitialState = () => {
    const { userGroup, assignments } = this.props;
    this.setState({
      errors: new Array(),
      userGroup,
      selectedProfiles: assignments
        ? assignments.Items!.map(a => a.SecurityProfileID!)
        : new Array()
    });
  };

  public getFeatureProfiles = async () => {
    return await SecurityProfiles.List({
      page: 1,
      pageSize: 100,
      filters: { ID: "feature-*" }
    }).then(data => {
      const featureTypes: AdminUserGroupFeatures = {};
      data.Items!.forEach(feature => {
        const idSplit = feature!.ID!.split("-");
        let featureCategory: string = "";
        idSplit.forEach((text, index) => {
          if (index > 0 && index < idSplit.length - 1) {
            featureCategory += `${text} `;
          }
        });
        if (featureTypes[featureCategory]) {
          featureTypes[featureCategory].push(feature);
        } else {
          featureTypes[featureCategory] = [feature];
        }
      });
      return featureTypes;
    });
  };

  public handleFeatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { selectedProfiles } = this.state;
    if (event.target.checked) {
      this.setState({
        selectedProfiles: [...selectedProfiles, event.target.value]
      });
    } else {
      this.setState({
        selectedProfiles: selectedProfiles.filter(a => a !== event.target.value)
      });
    }
  };

  public handleInputChange = (fieldName: "Name" | "Description" | "ID") => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { userGroup } = this.state;
    userGroup[fieldName] = event.target.value;
    this.setState({ userGroup });
  };

  public onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { onSubmit } = this.props;
    const { userGroup, selectedProfiles } = this.state;
    if (onSubmit) {
      return onSubmit(userGroup, selectedProfiles).catch(error => {
        console.log(error);
      });
    }
  };

  public render() {
    const { classes, theme, disabled } = this.props;
    return this.state ? (
      <form
        name="AdminUserGroupForm"
        className={classes.root}
        onSubmit={this.onSubmit}
      >
        <Grid container spacing={32}>
          <Grid item md={5}>
            {this.state && this.state.userGroup ? (
              <React.Fragment>
                <TextField
                  label="Identifier"
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  name="ID"
                  required
                  InputProps={{ readOnly: disabled }}
                  onChange={this.handleInputChange("ID")}
                  value={this.state.userGroup.ID}
                />
                <TextField
                  label="Name"
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  name="Name"
                  required
                  InputProps={{ readOnly: disabled }}
                  onChange={this.handleInputChange("Name")}
                  value={this.state.userGroup.Name}
                />
                <TextField
                  label="Description"
                  margin="dense"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  name="Description"
                  InputProps={{ readOnly: disabled }}
                  onChange={this.handleInputChange("Description")}
                  value={this.state.userGroup.Description}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ContentLoading rows={1} height={theme.spacing.unit * 8} />
                <ContentLoading rows={1} height={theme.spacing.unit * 16} />
              </React.Fragment>
            )}
          </Grid>
          <Grid item md={7}>
            <Grid container spacing={16}>
              {this.state &&
              this.state.featureTypes &&
              this.state.selectedProfiles ? (
                Object.entries(this.state.featureTypes).map(
                  ([category, features], index) => (
                    <FormControl margin="normal" key={index}>
                      <FormLabel>{Case.title(category)}</FormLabel>
                      <FormGroup>
                        {features.map(feature => (
                          <FormControlLabel
                            key={feature.ID}
                            disabled={disabled}
                            control={
                              <Checkbox
                                color="primary"
                                checked={this.state.selectedProfiles.includes(
                                  feature.ID!
                                )}
                                value={feature.ID}
                                onChange={this.handleFeatureChange}
                              />
                            }
                            label={feature.Name}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  )
                )
              ) : (
                <React.Fragment>
                  <ContentLoading
                    rows={1}
                    height={theme.spacing.unit * 3}
                    width={200}
                  />
                  <ContentLoading
                    rows={3}
                    height={theme.spacing.unit * 4}
                    width={250}
                  />
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </Grid>
        {!disabled && (
          <FormControl
            margin="normal"
            fullWidth
            className={classes.formButtons}
          >
            <Button
              type="submit"
              size="large"
              color="secondary"
              variant="contained"
            >
              Save Changes
            </Button>
          </FormControl>
        )}
      </form>
    ) : (
      <ContentLoading rows={6} />
    );
  }
}

export default withStyles(styles, { withTheme: true })(AdminUserGroupForm);
