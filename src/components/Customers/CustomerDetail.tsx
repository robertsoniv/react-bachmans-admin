import {
  AppBar,
  Button,
  createStyles,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Theme,
  Toolbar,
  Typography,
  withStyles
} from "@material-ui/core";
import {
  AccountBalanceWalletOutlined,
  AccountCircleOutlined,
  AddLocationOutlined,
  Block,
  Check,
  ChevronLeft,
  Clear,
  CreditCardOutlined,
  EditOutlined,
  EmailOutlined,
  ErrorTwoTone,
  EventOutlined,
  InfoOutlined,
  PeopleOutlineOutlined,
  PhoneOutlined,
  StarOutlined,
  SyncOutlined,
  WarningTwoTone
} from "@material-ui/icons";
import moment from "moment";
import {
  ListOrder,
  Order,
  Orders,
  SpendingAccount,
  SpendingAccounts,
  User,
  UserGroup,
  UserGroups,
  Users
} from "ordercloud-javascript-sdk";
import React from "react";
import Currency from "react-currency-formatter";
import { RouteComponentProps } from "react-router";
import ProtectedContent from "../Layout/ProtectedContent";
import EnhancedTable, { EnhancedTableColumn } from "../Shared/EnhancedTable";
import IconButtonLink from "../Shared/IconButtonLink";
import OcConfirmDialog from "../Shared/OcConfirmDialog";
import CustomerService from "./CustomerService";

const customerNoteColumns: EnhancedTableColumn[] = [
  {
    label: "Author",
    value: "author"
  },
  {
    label: "Created",
    value: "date"
  },
  {
    label: "Note",
    value: "text"
  }
];

const orderTableColumns: EnhancedTableColumn[] = [
  {
    label: "Order ID",
    value: "ID"
  },
  {
    label: "Date Submitted",
    value: "DateSubmitted"
  },
  {
    label: "Subtotal",
    value: "Subtotal",
    CellProps: {
      align: "right"
    }
  },
  {
    label: "Shipping",
    value: "ShippingCost",
    CellProps: {
      align: "right"
    }
  },
  {
    label: "Tax",
    value: "TaxCost",
    CellProps: {
      align: "right"
    }
  },
  {
    label: "Total",
    value: "Total",
    CellProps: {
      align: "right"
    }
  }
];

interface CustomerDetailRouteProps {
  id: string;
}

interface CustomerDetailProps
  extends RouteComponentProps<CustomerDetailRouteProps> {
  classes: any;
  theme: Theme;
}

interface CustomerDetailState {
  user: User;
  bachmansCharge: SpendingAccount;
  groups: UserGroup[];
  perksBalance: number;
  orders: ListOrder;
  editing: boolean;
  confirmDeleteOpen: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: "relative"
    },
    infoGrid: {
      background: theme.palette.background.paper
    },
    infoGridItem: {
      "&:not(:first-child)": {
        borderLeft: `1px solid ${theme.palette.divider}`
      }
    },
    appBar: {
      top: theme.spacing.unit * 7,
      background: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    [theme.breakpoints.up("sm")]: {
      appBar: {
        top: theme.spacing.unit * 8
      }
    },
    title: {
      margin: 0,
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
      background: theme.palette.grey[200],
      color: theme.palette.getContrastText(theme.palette.grey[300])
    },
    iconButton: {
      padding: 10
    },
    grow: {
      flexGrow: 1
    },
    spacer: {
      width: theme.spacing.unit
    }
  });

class CustomerDetail extends React.Component<
  CustomerDetailProps,
  CustomerDetailState
> {
  public componentDidMount = () => {
    const userID = this.props.match.params.id;
    Users.Get("Bachmans", userID)
      .then(user => {
        this.setState({
          user,
          confirmDeleteOpen: false,
          editing: false
        });
        if (user.xp.LoyaltyID) {
          CustomerService.PurplePerksBalance(user.xp.LoyaltyID).then(
            perksBalance => {
              this.setState({ perksBalance });
            }
          );
        }
      })
      .catch(error => {
        const { history } = this.props;
        history.push("/admin/users");
      });

    UserGroups.ListUserAssignments("Bachmans", { userID: userID }).then(
      assignmentList => {
        if (
          assignmentList &&
          assignmentList.Items &&
          assignmentList.Items.length
        ) {
          var queue = assignmentList.Items.map(assignment => {
            return UserGroups.Get("Bachmans", assignment.UserGroupID!);
          });
          Promise.all(queue).then(groups => {
            this.setState({ groups });
          });
        }
      }
    );

    SpendingAccounts.ListAssignments("Bachmans", { userID: userID }).then(
      assignmentList => {
        if (
          assignmentList &&
          assignmentList.Items &&
          assignmentList.Items.length
        ) {
          SpendingAccounts.Get(
            "Bachmans",
            assignmentList.Items[0].SpendingAccountID!
          ).then(bachmansCharge => {
            console.log(bachmansCharge);
            this.setState({ bachmansCharge });
          });
        }
      }
    );

    Orders.List("Incoming", {
      buyerID: "Bachmans",
      pageSize: 28,
      filters: { FromUserID: userID, Status: "!Unsubmitted" }
    }).then(orders => {
      this.setState({
        orders
      });
    });
  };

  public editField = (fieldKey: string) => (event: React.MouseEvent) => {
    console.log(fieldKey);
  };

  public handleEditToggle = (event: React.MouseEvent) => {
    this.setState(state => ({ editing: !state.editing }));
  };

  public handleDeleteClick = (event: React.MouseEvent) => {
    this.setState({ confirmDeleteOpen: true });
  };

  public handleDeleteConfirm = () => {
    this.setState({ confirmDeleteOpen: false });
    Users.Delete("Bachmans", this.state.user.ID!).then(() => {
      const { history } = this.props;
      history.push("/admin/users");
    });
  };

  public handleDeleteCancel = () => {
    this.setState({ confirmDeleteOpen: false });
  };

  public renderCustomerNote = (
    row: any,
    col: EnhancedTableColumn,
    value: any
  ) => {
    if (col.value === "date") {
      return (
        <Typography variant="inherit" noWrap>
          {moment(value).fromNow()}
        </Typography>
      );
    }
    return value;
  };
  public renderOrderCell = (
    row: Order,
    col: EnhancedTableColumn,
    value: any
  ) => {
    if (col.value === "DateSubmitted" || col.value === "DateCreated") {
      return (
        <Typography variant="inherit" noWrap>
          {moment(value).format("M/D/YY h:mm a")}
        </Typography>
      );
    }
    if (
      col.value === "Subtotal" ||
      col.value === "ShippingCost" ||
      col.value === "TaxCost" ||
      col.value === "Total"
    ) {
      return <Currency quantity={value || 0} />;
    }
    return value;
  };

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          color="default"
          position="sticky"
          className={classes.appBar}
          elevation={0}
        >
          <Toolbar>
            <IconButtonLink className={classes.iconButton} to="/customers">
              <ChevronLeft />
            </IconButtonLink>
            <div className={classes.spacer} />
            {this.state && this.state.user && (
              <Typography variant="h6">{`${this.state.user.FirstName} ${
                this.state.user.LastName
              }`}</Typography>
            )}
            <div className={classes.grow} />
            <ProtectedContent
              hasAccess={p => p.includes("feature-internal-user-admin")}
            >
              <React.Fragment>
                {this.state && this.state.user && !this.state.user.Active && (
                  <React.Fragment>
                    <Button onClick={this.handleDeleteClick} variant="outlined">
                      Delete
                    </Button>
                    <OcConfirmDialog
                      open={this.state.confirmDeleteOpen}
                      title="Delete Customer"
                      confirmText="Delete Customer"
                      cancelText="Cancel"
                      onConfirm={this.handleDeleteConfirm}
                      onCancel={this.handleDeleteCancel}
                      message={`Are you sure you want to permanently delete ${
                        this.state.user.FirstName
                      } ${
                        this.state.user.LastName
                      }? This action cannot be undone.`}
                    />
                    <div className={classes.spacer} />
                  </React.Fragment>
                )}
              </React.Fragment>
            </ProtectedContent>
          </Toolbar>
        </AppBar>
        {this.state && this.state.user && (
          <Grid container className={classes.infoGrid}>
            <Grid item xs={12} md={3} className={classes.infoGridItem}>
              <Typography variant="button" className={classes.title}>
                Account Info
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    {this.state.user.Active ? (
                      <Check color="secondary" />
                    ) : (
                      <Clear color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={this.state.user.Active ? "Active" : "Inactive"}
                    secondary="Account Status"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <InfoOutlined />
                  </ListItemIcon>
                  <ListItemText
                    secondary="OMS Account Number"
                    primary={this.state.user.ID}
                  />
                  <ListItemSecondaryAction>
                    <IconButton color="primary" onClick={this.editField("ID")}>
                      <EditOutlined />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    {this.state.user.xp.EagleCustomerNumber ? (
                      <InfoOutlined />
                    ) : (
                      <ErrorTwoTone color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    secondary="Eagle Customer Number"
                    primary={this.state.user.xp.EagleCustomerNumber || "N/A"}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <EventOutlined />
                  </ListItemIcon>
                  <ListItemText
                    secondary="Date Created"
                    primary={
                      this.state.user.TermsAccepted
                        ? moment(this.state.user.TermsAccepted).format(
                            "MMMM Do, YYYY"
                          )
                        : "N/A"
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <AddLocationOutlined />
                  </ListItemIcon>
                  <ListItemText
                    secondary="Created From"
                    primary={
                      this.state.user.xp.CreatedFrom === "web"
                        ? "Storefront"
                        : "Eagle"
                    }
                  />
                </ListItem>
                {this.state.user.xp.CreatedFrom === "web" && (
                  <React.Fragment>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        {this.state.user.xp.Four51ToEagleCustomerFileStatus ? (
                          this.state.user.xp.Four51ToEagleCustomerFileStatus ===
                          "Success" ? (
                            <Check color="secondary" />
                          ) : (
                            <WarningTwoTone color="error" />
                          )
                        ) : (
                          <ErrorTwoTone color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        secondary="Customer File Drop"
                        primary={
                          this.state.user.xp.Four51ToEagleCustomerFileStatus
                            ? `${
                                this.state.user.xp
                                  .Four51ToEagleCustomerFileStatus === "Success"
                                  ? "Succeeded"
                                  : "Failed"
                              } on ${moment(
                                this.state.user.xp
                                  .Four51ToEagleCustomerFileTimeStamp
                              ).format("M/D/YY hh:mm a")}`
                            : "Never Sent"
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                )}

                <Divider />
                <ListItem>
                  <ListItemIcon>
                    {this.state.user.xp.EagleToFour51CustomerUpdateTimeStamp ? (
                      <SyncOutlined />
                    ) : (
                      <ErrorTwoTone color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    secondary="Last Customer Sync"
                    primary={
                      this.state.user.xp.EagleToFour51CustomerUpdateTimeStamp
                        ? moment(
                            this.state.user.xp
                              .EagleToFour51CustomerUpdateTimeStamp
                          ).format("MMMM Do, YYYY")
                        : "Never Synced"
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    {this.state.user.xp.LastLoginTimeStamp ? (
                      <EventOutlined />
                    ) : (
                      <WarningTwoTone color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    secondary="Last Login Date"
                    primary={
                      this.state.user.xp.LastLoginTimeStamp
                        ? moment(this.state.user.xp.LastLoginTimeStamp).format(
                            "MMMM Do, YYYY"
                          )
                        : "Never Logged In"
                    }
                  />
                </ListItem>
              </List>
              <Typography variant="button" className={classes.title}>
                Customer Info
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AccountCircleOutlined />
                  </ListItemIcon>
                  <ListItemText
                    secondary="First Name"
                    primary={this.state.user.FirstName}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      color="primary"
                      onClick={this.editField("FirstName")}
                    >
                      <EditOutlined />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <AccountCircleOutlined />
                  </ListItemIcon>
                  <ListItemText
                    secondary="Last Name"
                    primary={this.state.user.LastName}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      color="primary"
                      onClick={this.editField("LastName")}
                    >
                      <EditOutlined />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    {this.state.user.Email === this.state.user.Username ? (
                      <EmailOutlined />
                    ) : (
                      <ErrorTwoTone color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    secondary="Login Email Address"
                    primary={
                      <a
                        target="_blank"
                        href={`mailto:${this.state.user.Email}`}
                      >
                        {this.state.user.Email}
                      </a>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      color="primary"
                      onClick={this.editField("Email")}
                    >
                      <EditOutlined />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <PhoneOutlined />
                  </ListItemIcon>
                  <ListItemText
                    secondary="Telephone"
                    primary={
                      <a target="_blank" href={`tel:${this.state.user.Phone}`}>
                        {this.state.user.Phone}
                      </a>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      color="primary"
                      onClick={this.editField("Phone")}
                    >
                      <EditOutlined />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              {this.state.groups && this.state.groups.length && (
                <React.Fragment>
                  <Typography variant="button" className={classes.title}>
                    {`Customer Group${
                      this.state.groups.length == 1 ? "" : "s"
                    }`}
                  </Typography>
                  <List>
                    {this.state.groups.map((group, index) => (
                      <React.Fragment key={group.ID}>
                        <ListItem>
                          <ListItemIcon>
                            <PeopleOutlineOutlined />
                          </ListItemIcon>
                          <ListItemText primary={group.Name} />
                        </ListItem>
                        {index < this.state.groups.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </React.Fragment>
              )}
              <Typography variant="button" className={classes.title}>
                Tax Info
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    {this.state.user.xp.TaxExemption &&
                    this.state.user.xp.TaxExemption.Enabled ? (
                      <Block />
                    ) : (
                      <Check color="secondary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    secondary="Tax Status"
                    primary={
                      this.state.user.xp.TaxExemption &&
                      this.state.user.xp.TaxExemption.Enabled
                        ? "Exempt"
                        : "Normal"
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      color="primary"
                      onClick={this.editField("TaxExemptionEnabled")}
                    >
                      <EditOutlined />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {this.state.user.xp.TaxExemption &&
                  this.state.user.xp.TaxExemption.Enabled && (
                    <React.Fragment>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          {this.state.user.xp.TaxExemption.TaxExemptionID ? (
                            <InfoOutlined />
                          ) : (
                            <ErrorTwoTone color="error" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          secondary="Tax Exemption ID"
                          primary={
                            this.state.user.xp.TaxExemption.TaxExemptionID ||
                            "N/A"
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            color="primary"
                            onClick={this.editField("TaxExemption")}
                          >
                            <EditOutlined />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </React.Fragment>
                  )}
              </List>
              {this.state.user.xp.Charge === "Y" && (
                <React.Fragment>
                  <Typography variant="button" className={classes.title}>
                    Bachman's Charge
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        {this.state.bachmansCharge ? (
                          <CreditCardOutlined />
                        ) : (
                          <WarningTwoTone color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        secondary="Available Credit"
                        primary={
                          <Currency
                            quantity={
                              this.state.bachmansCharge
                                ? Number(
                                    this.state.bachmansCharge.xp.AvailCredit
                                  )
                                : Number(this.state.user.xp.AvailCredit || 0)
                            }
                          />
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          color="primary"
                          onClick={this.editField("BachmansChargeAvailCredit")}
                        >
                          <EditOutlined />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <AccountBalanceWalletOutlined />
                      </ListItemIcon>
                      <ListItemText
                        secondary="Remaining Balance"
                        primary={
                          <Currency
                            quantity={
                              this.state.bachmansCharge
                                ? this.state.bachmansCharge.Balance!
                                : 0
                            }
                          />
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          color="primary"
                          onClick={this.editField("BachmansChargeBalance")}
                        >
                          <EditOutlined />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </React.Fragment>
              )}
              <Typography variant="button" className={classes.title}>
                Purple Perks
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <InfoOutlined />
                  </ListItemIcon>
                  <ListItemText
                    secondary="Loyalty ID"
                    primary={
                      this.state.user.xp.LoyaltyID
                        ? `777777${this.state.user.xp.LoyaltyID}`
                        : "N/A"
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      color="primary"
                      onClick={this.editField("LoyaltyID")}
                    >
                      <EditOutlined />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {this.state.user.xp.LoyaltyID && (
                  <React.Fragment>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        {typeof this.state.perksBalance === "number" ? (
                          <StarOutlined />
                        ) : (
                          <WarningTwoTone color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        secondary="Points Balance"
                        primary={
                          typeof this.state.perksBalance === "number" ? (
                            <Currency quantity={this.state.perksBalance} />
                          ) : (
                            "Loyalty ID Not Found"
                          )
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                )}
              </List>
              {this.state.user.xp.PO && (
                <React.Fragment>
                  <Typography variant="button" className={classes.title}>
                    Purchase Order
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        {this.state.user.xp.PO.PORequired ? (
                          <Check color="secondary" />
                        ) : (
                          <Clear color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        secondary="PO Number Required"
                        primary={
                          this.state.user.xp.PO.PORequired
                            ? "Required"
                            : "Not Required"
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          color="primary"
                          onClick={this.editField("PORequired")}
                        >
                          <EditOutlined />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        {this.state.user.xp.PO.PONumber ? (
                          <InfoOutlined />
                        ) : (
                          <ErrorTwoTone color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        secondary="Purchase Order No."
                        primary={this.state.user.xp.PO.PONumber || "N/A"}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          color="primary"
                          onClick={this.editField("PONumber")}
                        >
                          <EditOutlined />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </React.Fragment>
              )}
            </Grid>
            <Grid item xs={12} md={9} className={classes.infoGridItem}>
              <Typography variant="button" className={classes.title}>
                Customer Notes
              </Typography>
              <EnhancedTable
                noResults="No Customer Notes."
                data={this.state.user.xp.Notes || []}
                cellRenderer={this.renderCustomerNote}
                columns={customerNoteColumns}
              />
              {this.state && this.state.orders && (
                <React.Fragment>
                  <Typography variant="button" className={classes.title}>
                    Recent Orders
                  </Typography>
                  <EnhancedTable
                    noResults="No Recent Orders."
                    data={this.state.orders.Items}
                    cellRenderer={this.renderOrderCell}
                    columns={orderTableColumns}
                  />
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CustomerDetail);
