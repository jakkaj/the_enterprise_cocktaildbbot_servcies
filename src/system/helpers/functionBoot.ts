

import startup from '../../startup';
import * as contracts from "../../system/contract/contracts";
import { serverTypes } from "../../system/contract/systemEntities";


export default class App {
    run():startup {        
        var appStartup:startup = new startup();       
        return appStartup;    
    }
}

