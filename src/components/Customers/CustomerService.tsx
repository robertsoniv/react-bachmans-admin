import { purple_perks_url } from "../../constants/app.constants";
import axios from "axios";

const PurplePerksBalance = (loyaltyID: string) => {
  var card_number = `777777${loyaltyID}`;
  return axios.post(purple_perks_url, { card_number }).then(response => {
    if (response.data.card_value === "cardNumber not available") {
      return Promise.reject("Card not found");
    }
    return Promise.resolve(Number(response.data.card_value));
  });
};

export default {
  PurplePerksBalance
};
