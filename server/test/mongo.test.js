
/*import { webcrypto } from 'crypto';
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}*/


import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const db = require("../db");
 

/**
 * Vitest test script for the Playlister app's Mongo Database Manager. Testing should verify that the Mongo Database Manager 
 * will perform all necessarily operations properly.
 *  
 * Scenarios we will test:
 *  1) Reading a User from the database
 *  2) Creating a User in the database
 *  3) ...
 * 
 * You should add at least one test for each database interaction. In the real world of course we would do many varied
 * tests for each interaction.
 */

/**
 * Executed once before all tests are performed.
 */

const testEmail = "michael@jackson.com";
let testUser = null;
let playlistId = null;
let createdPlaylistId = null;




beforeAll(async () => {
    // SETUP THE CONNECTION VIA MONGOOSE JUST ONCE - IT IS IMPORTANT TO NOTE THAT INSTEAD
    // OF DOING THIS HERE, IT SHOULD BE DONE INSIDE YOUR Database Manager (WHICHEVER)
    if (db.connect) {
        await db.connect();
    }
});

/**
 * Executed before each test is performed.
 */
beforeEach(() => {
});

/**
 * Executed after each test is performed.
 */
afterEach(() => {
});

/**
 * Executed once after all tests are performed.
 */
afterAll( async () => {

    if (playlistId) {
        await db.deletePlaylist(playlistId);
    }

    if (testUser) {
        
        if (db.deleteUser) {
            await db.deleteUser(testUser.email);
        }
    }

    if (db.disconnect) {
        await db.disconnect();
    }
    
});

/**
 * Vitest test to see if the Database Manager can get a User.
 */
test('Test #1) Reading a User from the Database', async () => {
    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
        firstName: "Michael",
        lastName: "Jackson",
        email: testEmail,
        passwordHash: "$2a$10$dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm.ATbQ4sJk4agGu" 
    };

    // Insert a test user first
    await db.createUser(expectedUser);
    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    const actualUser = await db.findUserByEmail(expectedUser.email);

    // READ THE USER
    // actualUser = dbManager.somethingOrOtherToGetAUser(...)

    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(actualUser.firstName).toBe(expectedUser.firstName);
    expect(actualUser.lastName).toBe(expectedUser.lastName);
    expect(actualUser.email).toBe(expectedUser.email);
    // AND SO ON
});

/**
 * Vitest test to see if the Database Manager can create a User
 */
test('Test #2) Creating a User in the Database', async () => {
    // MAKE A TEST USER TO CREATE IN THE DATABASE
    const testUser = {
        firstName: "Michael",
        lastName: "Jackson",
        email: testEmail,
        passwordHash: "$2a$10$dPEwsAVi1ojv2RfxxTpZjuKSAbep7zEKb5myegm.ATbQ4sJk4agGu"
    // FILL IN TEST DATA, INCLUDE AN ID SO YOU CAN GET IT LATER
    };

    // CREATE THE USER
    // dbManager.somethingOrOtherToCreateAUser(...)
    await db.createUser(testUser);

    // NEXT TEST TO SEE IF IT WAS PROPERLY CREATED

    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
        firstName: "Michael",
        lastName: "Jackson",
        email: testEmail
        // FILL IN EXPECTED DATA
    };

    // THIS WILL STORE THE DATA RETRUNED BY A READ USER
    let actualUser = {};

    // READ THE USER
    // actualUser = dbManager.somethingOrOtherToGetAUser(...)
    actualUser = await db.findUserByEmail(testEmail);

    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(actualUser.firstName).toBe(expectedUser.firstName);
    expect(actualUser.lastName).toBe(expectedUser.lastName);
    expect(actualUser.email).toBe(expectedUser.email);
    // AND SO ON

});



// THE REST OF YOUR TEST SHOULD BE PUT BELOW