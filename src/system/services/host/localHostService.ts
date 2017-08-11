import { inject } from "inversify";
import * as restify from 'restify';

import * as contracts from "../../contract/contracts";
import { serviceBase, configBase } from "../serviceBase";
import * as modelContracts from "../../../model/modelContracts";

import cocktailConverter from "../../helpers/cocktailConverters";
/**
 * Service that hosts the app when running locally in development environment or other that requires restify
 */
export class localHostService extends configBase implements contracts.IHostService {

    private _server: restify.Server;
    private _cocktailService: modelContracts.ICocktailService;

    constructor( @inject(modelContracts.modelSymbols.ICocktailService) cocktailService: modelContracts.ICocktailService) {
        super();
        this._cocktailService = cocktailService;
    }

    /**
     * Fire up the server and handle the post request to upload the image
     */
    init() {

        this.log("Local Context");

        this._server = restify.createServer();

        this._server.use(require('restify-plugins').queryParser());

        this._server.listen(this.config.port, () => {
            console.log(`${this._server.name} listening to ${this._server.url}`);
        });

        this._server.get('/', async (req: restify.Request, res: restify.Response, next: restify.Next) => {

            var result = await this._cocktailService.getRandomCocktail();

            if (result === null) {
                res.send("Nothing")
            } else {

                var c = new cocktailConverter();

                var cocktailCards = c.cocktailToCard(result);

                var serviceRunnerResult: modelContracts.IServiceRunnerResult = {
                    success: true,
                    heroCards: cocktailCards
                }

                res.send(serviceRunnerResult);
            }

            // var query = req.query["ingredient"];

            // var result = await this._cocktailService.getByIngredient(query, 5);

            // if (result === null) {
            //     res.send("Nothing")
            // } else {

            //     var c = new cocktailConverter();

            //     var cocktailCards = c.cocktailToCard(result);

            //     var serviceRunnerResult: modelContracts.IServiceRunnerResult = {
            //         success: true,
            //         heroCards: cocktailCards
            //     }

            //     res.send(serviceRunnerResult);
            // }

            return next();
        });
    }


    /**
     * Log callback that can be used by other components when this host is in play
     * @param  {string} message
     */
    public log(message: string) {
        console.log(message);
    }
    /**
     * Exports will be exposed as modules if non-null. This one is null so it's not exported. 
     * @returns any
     */
    public get export(): any {
        return null;
    }
}