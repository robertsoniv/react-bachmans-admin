import React from "react";
import {
  SecurityProfiles,
  SecurityProfile,
  AdminUserGroups,
  UserGroup,
  SecurityProfileAssignment
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
import { RouteComponentProps } from "react-router";
import ButtonLink from "../../Shared/ButtonLink";
import Case from "case";
import ContentLoading from "../../Layout/ContentLoading";

interface PermissionGroupFormParams {
  groupId?: string;
}

interface PermissionGroupFormProps
  extends RouteComponentProps<PermissionGroupFormParams> {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  classes: any;
  theme: Theme;
}

interface PermissionGroupFeatures {
  [category: string]: SecurityProfile[];
}

interface PermissionGroupFormState {
  featureTypes: PermissionGroupFeatures;
  assignments: SecurityProfileAssignment[];
  profileIds: Array<string>;
  group: UserGroup;
}

const defaultGroupXp = {
  IsPermissionGroup: true
};

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

class PermissionGroupForm extends React.Component<
  PermissionGroupFormProps,
  PermissionGroupFormState
> {
  public componentDidMount = () => {
    SecurityProfiles.List({
      page: 1,
      pageSize: 100,
      filters: { ID: "feature-*" }
    }).then(data => {
      const featureTypes: PermissionGroupFeatures = {};
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
      this.setState({ featureTypes });
    });

    const groupId = this.props.match.params.groupId;
    if (groupId) {
      AdminUserGroups.Get(groupId).then(group => {
        this.setState({ group });
      });
      SecurityProfiles.ListAssignments({
        userGroupID: groupId
      }).then(data => {
        var assignments =
          data.Items && data.Items.length ? data.Items : new Array();
        this.setState({
          assignments,
          profileIds: assignments.map(
            assignment => assignment.SecurityProfileID
          )
        });
      });
    } else {
      this.setState({
        assignments: new Array(),
        profileIds: new Array(),
        group: { Name: "", Description: "" }
      });
    }
  };

  public handleFeatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { profileIds } = this.state;
    if (event.target.checked) {
      this.setState({ profileIds: [...profileIds, event.target.value] });
    } else {
      this.setState({
        profileIds: profileIds.filter(a => a !== event.target.value)
      });
    }
  };

  public handleInputChange = (fieldName: "Name" | "Description" | "ID") => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { group } = this.state;
    group[fieldName] = event.target.value;
    this.setState({ group });
  };

  public onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const groupId = this.props.match.params.groupId;
    const { assignments, profileIds, group } = this.state;
    if (groupId) {
      AdminUserGroups.Save(groupId, group).then(updatedUserGroup => {
        assignments.forEach(assignment => {
          if (profileIds.includes(assignment.SecurityProfileID!)) {
            return;
          }
          SecurityProfiles.DeleteAssignment(assignment.SecurityProfileID!, {
            userGroupID: updatedUserGroup.ID
          });
        });
        profileIds.forEach(id => {
          if (
            assignments.filter(
              assignment => assignment.SecurityProfileID === id
            ).length
          ) {
            return;
          }
          SecurityProfiles.SaveAssignment({
            SecurityProfileID: id,
            UserGroupID: updatedUserGroup.ID
          });
        });
        this.afterSubmit(true);
      });
    } else {
      AdminUserGroups.Create({
        ...group,
        ...{ xp: defaultGroupXp }
      }).then(newUserGroup => {
        profileIds.forEach(id => {
          SecurityProfiles.SaveAssignment({
            SecurityProfileID: id,
            UserGroupID: newUserGroup.ID
          });
        });
        this.afterSubmit();
      });
    }
  };

  public afterSubmit = (update?: boolean) => {
    if (update) {
    } else {
    }
    this.props.history.push("/admin/roles");
  };

  public render() {
    const { classes, theme } = this.props;
    return (
      <form
        name="PermissionGroupForm"
        className={classes.root}
        onSubmit={this.onSubmit}
      >
        {this.state && this.state.group ? (
          <Typography component="legend" variant="h5">{`${
            this.state.group.ID ? "Edit" : "New"
          } User Role`}</Typography>
        ) : (
          <ContentLoading
            rows={1}
            height={theme.typography.h5.fontSize}
            width={250}
          />
        )}

        <Grid container spacing={32}>
          <Grid item md={5}>
            {this.state && this.state.group ? (
              <React.Fragment>
                <TextField
                  label="Identifier"
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  name="ID"
                  required
                  onChange={this.handleInputChange("ID")}
                  value={this.state.group.ID}
                />
                <TextField
                  label="Name"
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  name="Name"
                  required
                  onChange={this.handleInputChange("Name")}
                  value={this.state.group.Name}
                />
                <TextField
                  label="Description"
                  margin="dense"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  name="Description"
                  onChange={this.handleInputChange("Description")}
                  value={this.state.group.Description}
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
              this.state.profileIds ? (
                Object.entries(this.state.featureTypes).map(
                  ([category, features], index) => (
                    <FormControl margin="normal" key={index}>
                      <FormLabel>{Case.title(category)}</FormLabel>
                      <FormGroup>
                        {features.map(feature => (
                          <FormControlLabel
                            key={feature.ID}
                            control={
                              <Checkbox
                                color="primary"
                                checked={this.state.profileIds.includes(
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

        <FormControl margin="normal" fullWidth className={classes.formButtons}>
          <ButtonLink
            type="button"
            size="large"
            color="default"
            variant="outlined"
            to="/admin/roles"
          >
            Cancel
          </ButtonLink>
          <div className={classes.spacer} />
          <Button
            type="submit"
            size="large"
            color="secondary"
            variant="contained"
          >
            Save
          </Button>
        </FormControl>
      </form>
    );
  }
}

export default withStyles(styles, { withTheme: true })(PermissionGroupForm);
