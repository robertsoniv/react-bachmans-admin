import ProductIcon from "@material-ui/icons/LocalFlorist";
import EventIcon from "@material-ui/icons/Event";
import CategoryIcon from "@material-ui/icons/Category";
import CustomerIcon from "@material-ui/icons/People";
import OrderIcon from "@material-ui/icons/Receipt";
import DeliveryIcon from "@material-ui/icons/LocalShipping";
import MiscellaneousIcon from "@material-ui/icons/Settings";
import SettingsIcon from "@material-ui/icons/Lock";
import {
  DummyComponent,
  BuildOrder,
  Orders,
  Customers
} from "../DummyComponent";

interface IChildComponent {
  label: string;
  tabLabel?: string;
  $ref?: React.ComponentPropsWithRef<any>;
}

interface IParentComponent {
  label: string;
  icon: any;
  $ref?: React.ComponentPropsWithRef<any>;
  children: {
    [path: string]: IChildComponent;
  };
}

interface IComponentRoutes {
  [path: string]: IParentComponent;
}

const ComponentRoutes: IComponentRoutes = {
  "/orders": {
    label: "Orders",
    icon: OrderIcon,
    $ref: Orders,
    // queryParams: [],
    children: {
      "": {
        label: "Recent Orders",
        tabLabel: "Recent"
      },
      "/wired": {
        label: "Wired Orders",
        tabLabel: "Wired"
      },
      "/exceptions": {
        label: "Exceptions List",
        tabLabel: "Exceptions"
      },
      "/build": {
        label: "Build Order",
        $ref: BuildOrder
      }
    }
  },
  "/customers": {
    label: "Customers",
    icon: CustomerIcon,
    $ref: Customers,
    children: {
      "": {
        label: "All Customers",
        tabLabel: "All"
      },
      "/active": {
        label: "Active Customers",
        tabLabel: "Active"
      },
      "/inactive": {
        label: "Inactive Customers",
        tabLabel: "Inactive"
      },
      "/employees": {
        label: "Employees"
      },
      "/orphaned": {
        label: "Orphaned Accounts",
        tabLabel: "Orphaned"
      }
    }
  },
  "/categories": {
    label: "Categories",
    icon: CategoryIcon,
    $ref: DummyComponent,
    children: {
      "": {
        label: "All Categories"
      },
      "/public": {
        label: "Public Categories"
      },
      "/internal": {
        label: "Internal Categories"
      }
    }
  },
  "/products": {
    label: "Products",
    icon: ProductIcon,
    $ref: DummyComponent,
    children: {
      "": {
        label: "All Products"
      },
      "/new": {
        label: "New Products"
      },
      "/out-of-stock": {
        label: "Out of Stock"
      },
      "/giftcards": {
        label: "Gift Cards"
      }
    }
  },
  "/events": {
    label: "Events",
    icon: EventIcon,
    $ref: DummyComponent,
    children: {
      "": {
        label: "All Events"
      },
      "/awaiting-setup": {
        label: "Awaiting Setup"
      },
      "/ticketed": {
        label: "Ticketed Events"
      },
      "/free": {
        label: "Free Events"
      }
    }
  },
  "/delivery": {
    label: "Delivery",
    icon: DeliveryIcon,
    $ref: DummyComponent,
    children: {
      "/time-slots": {
        label: "Time Slots"
      },
      "/fees": {
        label: "Fees Settings"
      },
      "/dates": {
        label: "Date Settings"
      },
      "/destinations": {
        label: "Destinations"
      }
    }
  },
  "/miscellaneous": {
    label: "Miscellaneous",
    icon: MiscellaneousIcon,
    children: {
      "/redirects": {
        label: "Storefront Redirects",
        $ref: DummyComponent
      },
      "/marketing-emails": {
        label: "Marketing Emails",
        $ref: DummyComponent
      },
      "/employment": {
        label: "Employment",
        $ref: DummyComponent
      }
    }
  },
  "/tools": {
    label: "Admin Tools",
    icon: SettingsIcon,
    $ref: DummyComponent,
    children: {
      "/internal-users": {
        label: "Internal Users"
      },
      "/permissions": {
        label: "Permissions"
      },
      "/stores": {
        label: "Store Management"
      },
      "/wired-services": {
        label: "Wired Services"
      }
    }
  }
};

export default ComponentRoutes;
