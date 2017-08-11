
import * as restify from 'restify';

import {HttpContext, IFunctionRequest, HttpStatusCodes} from 'azure-functions-typescript'

import * as contracts from "../../contract/contracts";
import { serviceBase } from "../serviceBase";
import { injectable, inject } from "inversify";

import * as modelContracts from "../../../model/modelContracts";
import cocktailConverter from "../../helpers/cocktailConverters";


/**
 * Service host that is registered when the system detects it's running inside Azure Functions
 */
export class findIngredientHost extends serviceBase implements contracts.IFindIngredientHost{

    private _cocktailService:modelContracts.ICocktailService;

    /**
     *
     */
    constructor(@inject(modelContracts.modelSymbols.ICocktailService) cocktailService:modelContracts.ICocktailService) {
        super();
        this._cocktailService = cocktailService;
    }

    private _context:HttpContext;
    private _listener; 

    init(){
        
    }
    /**
     * Function that is returned via module export to functions for callbacks when function is triggered
     * @param  {HttpContext} context - Azure Functions context
     * @param  {IFunctionRequest} req - Azure Functions request
     * @returns any
     */
    private _azureFunctionsHead(context:HttpContext, req:IFunctionRequest):any{
        this._context = context;
        this.log("Azure Context");        
        var b:Buffer = req.body;

        var f = async ()=>{
            context.log("Calling up to teh serverz");
            try{

                if(!req.query["ingredient"]){
                    
                    context.res = {
                        status: 400,
                        body: "Please pass a ingredient on the query string"
                    };                   
                    return;
                }

                var ingredient = req.query["ingredient"];

                var result = await this._cocktailService.getByIngredient(ingredient, 5);

                if(!result || result.length == 0){
                    context.res = {
                        status: 400,
                        body: {success:false}
                    };                   
                    return;
                }

                var c = new cocktailConverter();

                var cocktailCards = c.cocktailToCard(result);

                var serviceRunnerResult: modelContracts.IServiceRunnerResult = {
                    success:true, 
                    heroCards: cocktailCards
                }

                context.log("Call complete");
                context.res = {
                    status:200, 
                    body:serviceRunnerResult
                }
               
            }catch(e){
                context.log(`Error: ${e}`);
                context.res = {
                    status:500, 
                    body:e
                }                
            }finally{
                context.done();
            }
            
        }
        f();
    }

    
    /**
     * Log callback for other components to use (such as logger) that works with Azure Functions context
     * @param  {string} message
     */
    public log(message:string){
        if(this._context){
            this._context.log(message);
        }else{
            console.log(message);
        }   
    }

    
    /**
     * Return the _azureFunctionsHead function so it may be exposed as a module as the entry point for Azure Functions. 
     * @returns any
     */
    public get export():any{
        return this._azureFunctionsHead;
    }
}