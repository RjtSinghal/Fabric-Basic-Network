import { Context, Contract } from 'fabric-contract-api';
import { Person } from './userdata';

export class User extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const users: Person[] = [
            {
                name: "qwerty",
                number : "789",
            },
            {
                name : "asd",
                number: "123",
            }
        ] ;

        for (let i = 0; i < users.length; i++) {
            users[i].docType = 'person';
            await ctx.stub.putState('PERSON' + i, Buffer.from(JSON.stringify(users[i])));
            console.info('Added <--> ', users[i]);
        }

        console.info('============= END : Initialize Ledger ===========');
    }

    public async getPerson(ctx: Context, personNumber: string): Promise<string> {
        const userAsBytes = await ctx.stub.getState(personNumber); // get the car from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${personNumber} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }

    public async getAllPerson(ctx: Context): Promise<string> {
        const startKey = 'PERSON0';
        const endKey = 'PERSON999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    public async createPerson(ctx: Context, personNumber: string, name: string, number: string) {
        console.info('============= START : Create Person ===========');

        const user: Person = {
            docType: 'user',
            name,
            number
        };

        await ctx.stub.putState(personNumber, Buffer.from(JSON.stringify(user)));
        console.info('============= END : Create Person ===========');
    }

}