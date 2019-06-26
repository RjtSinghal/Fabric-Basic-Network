"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
class User extends fabric_contract_api_1.Contract {
    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const users = [
            {
                name: "qwerty",
                number: "789",
            },
            {
                name: "asd",
                number: "123",
            }
        ];
        for (let i = 0; i < users.length; i++) {
            users[i].docType = 'person';
            await ctx.stub.putState('PERSON' + i, Buffer.from(JSON.stringify(users[i])));
            console.info('Added <--> ', users[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
    async getPerson(ctx, personNumber) {
        const userAsBytes = await ctx.stub.getState(personNumber); // get the car from chaincode state
        if (!userAsBytes || userAsBytes.length === 0) {
            throw new Error(`${personNumber} does not exist`);
        }
        console.log(userAsBytes.toString());
        return userAsBytes.toString();
    }
    async getAllPerson(ctx) {
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
                }
                catch (err) {
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
    async createPerson(ctx, personNumber, name, number) {
        console.info('============= START : Create Person ===========');
        const user = {
            docType: 'user',
            name,
            number
        };
        await ctx.stub.putState(personNumber, Buffer.from(JSON.stringify(user)));
        console.info('============= END : Create Person ===========');
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map