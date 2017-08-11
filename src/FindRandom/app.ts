
import startup from '../startup';
import * as contracts from "../system/contract/contracts";
import appBoot from '../system/helpers/functionBoot';


const app = new appBoot();
var appStartup:startup = app.run();

var serverHost = appStartup.container.get<contracts.IFindRandomHostService>(contracts.contractSymbols.IFindRandomHostService);
module.exports = serverHost.export.bind(serverHost);