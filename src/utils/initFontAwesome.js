import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink, faPowerOff, faUser,faGlobe, faCog } from "@fortawesome/free-solid-svg-icons";

function initFontAwesome() {
  library.add(faLink);
  library.add(faUser);
  library.add(faPowerOff);
  library.add(faGlobe);
  library.add(faCog);
}

export default initFontAwesome;
