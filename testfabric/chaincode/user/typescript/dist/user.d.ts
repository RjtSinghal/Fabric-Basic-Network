import { Context, Contract } from 'fabric-contract-api';
export declare class User extends Contract {
    initLedger(ctx: Context): Promise<void>;
    getPerson(ctx: Context, personNumber: string): Promise<string>;
    getAllPerson(ctx: Context): Promise<string>;
    createPerson(ctx: Context, personNumber: string, name: string, number: string): Promise<void>;
}
