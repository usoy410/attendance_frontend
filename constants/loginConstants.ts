import { BASE_CDN_URL } from "./api";

const BASE_CDN = BASE_CDN_URL;
const TRANSFORMS = "c_auto,h_100,w_100";

export const LOGO_SOURCES = {
  ncf: { uri: `${BASE_CDN}/${TRANSFORMS}/ncflogo_esrp4u.png` },
  cyber: { uri: `${BASE_CDN}/${TRANSFORMS}/cyberdevlogo_tysgps.png` },
  ccs: { uri: `${BASE_CDN}/${TRANSFORMS}/ccslogo_hsyi31.png` }
};
