import { Dimensions } from "react-native";

export const deviceWidth = Dimensions.get("window").width;
export const deviceHeight = Dimensions.get("window").height;

export const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const transparent = "rgba(255, 255, 255, 0)";
export const AQUABLUE = "#2cbbcd";

// //For Production
// export const apiUrl = "https://api.mi.com/v1/";
// For Development
export const apiUrl = "http://192.168.1.104:3000/v1/"

export const tokenKey = "tokenHeaders";