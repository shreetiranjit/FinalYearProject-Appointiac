const express = require("express");
const router = express.Router();
const TimeSlot = require("../models/timeslot");
const TransferModel = require("../models/transfer");
const User = require("../models/user");
const algosdk = require('algosdk');

const algodToken = process.env.ALGOD_TOKEN;
const algodServer = process.env.ALGOD_SERVER;
const algodPort = process.env.ALGOD_PORT;
const client = new algosdk.Algodv2(algodToken, algodServer, algodPort);
const appId = parseInt(process.env.PROFILE_APP_ID, 10);
const TIMESLOT_APP_ID = parseInt(process.env.TIMESLOT_APP_ID);
const GOD_SEED = process.env.GOD_SEED

async function retrieveTimeslotInformation(client, accountAddress, appId) {
  // Get the account information
  const accountInfo = await client.accountInformation(accountAddress).do();
  // Find the local state for the smart contract
  const appLocalState = accountInfo['apps-local-state'].find(app => app.id === appId);
  console.log('hererere', appLocalState);
  if (appLocalState && appLocalState['key-value']) {
    // Extract the key-value pairs from the local state
    const keyValuePairs = appLocalState['key-value'];
    const profile = {};
    keyValuePairs.forEach(pair => {
      const key = Buffer.from(pair.key, 'base64').toString();
      const value = pair.value.bytes ? Buffer.from(pair.value.bytes, 'base64').toString() : pair.value.uint;
      profile[key] = value;
    });
    return profile;
  }
  else if (appLocalState) {
    profile = {
      ts1 : '',
      ts2 : '',
      ts3 : '',
      ts4 : '',
      ts5 : '',
      ts6 : '',
      ts7 : '',
      ts8 : '',
      ts9 : '',
      ts10 : '',
      ts11 : '',
      ts12 : '',
      ts13 : '',
      ts14 : ''
    };
    return profile
  }
  return null;
}

// Create a new time slot
router.post("/", async (req, res) => {
  try {
    const {
      frequency,
      timestamp,
      ownerID,
      amount_per_session,
      auction_price,
      expiry_date,
      for_auction,
      description,
      forsale,
      seed
    } = req.body;

    // const user = await User.findById(ownerID);
    const senderAccount = algosdk.mnemonicToSecretKey(seed);
    // Retrieve the current state of the smart contract
    const existingTimeslot = await retrieveTimeslotInformation(client, senderAccount.addr, TIMESLOT_APP_ID);
    console.log('existing', existingTimeslot);

    if (!existingTimeslot) {
        throw new Error("Failed to retrieve timeslot information or no timeslots found.");
    }

    // Find an empty timeslot
    let emptySlotIndex = -1;
    for (let i = 1; i <= 14; i++) {
        let key = "ts" + i;
        if (!existingTimeslot[key] || existingTimeslot[key] === "") {
            emptySlotIndex = i;
            break;
        }
    }

    if (emptySlotIndex === -1) {
        return res.status(400).json({message: `The timeslot capacity is reached in the blockchain`});
    }
    var newSlot = TimeSlot({
      frequency,
      timestamp,
      owner: senderAccount.addr,
      amount_per_session,
      auction_price,
      expiry_date,
      for_auction,
      description,
      forsale,
    });

    let today = Date.now();
    if (expiry_date < today) {
      return res.status(400).json({ error: "Given Expiry Date is Invalid!" });
    }
    await newSlot.save();
    const newStringId = newSlot._id;
        // Populate the application arguments
        let appArgs = [];
        for (let i = 1; i <= 14; i++) {
            if (i === emptySlotIndex) {
                appArgs.push(new Uint8Array(Buffer.from(newStringId)));
            } else {
                let key = "ts" + i;
                if (existingTimeslot[key]) {
                    appArgs.push(new Uint8Array(Buffer.from(existingTimeslot[key])));
                } else {
                    appArgs.push(new Uint8Array(Buffer.from('')));
                }
            }
        }
    // Get transaction parameters
    const params = await client.getTransactionParams().do();
    // Create and send the transaction
    const txn = algosdk.makeApplicationNoOpTxn(senderAccount.addr, params, TIMESLOT_APP_ID, appArgs);
    const signedTxn = txn.signTxn(senderAccount.sk);
    const txId = txn.txID().toString();
    await client.sendRawTransaction(signedTxn).do();
    const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4);
    res.status(201).json({ newSlot });
  } catch (error) {
    // res.status(500).json({ error: "Server error" });
    res.status(500).json({ error: error.message });
  }
});

router.get("/allslots/", async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find({});
    let userlist = [];
    let newOwner = {};
    for (let timeSlot of timeSlots) {
      if (timeSlot.booked_users) {
        for (let user_id of timeSlot.booked_users) {
          const user = await User.findById(user_id);
          userlist.push(user);
        }
      }
      if (timeSlot.owned_by) {
        newOwner = await User.findById(timeSlot.owned_by);
      }
    }
    res.status(200).json({ timeSlots, userlist, newOwner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/bookedusers/:timeSlot_id", async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.timeSlot_id);

    if (!timeSlot) {
      return res.status(404).json({ error: "Time slot not found" });
    }

    // Check if the time slot is for sale and has no booked users
    if (timeSlot.forsale && timeSlot.booked_users.length === 0) {
      timeSlot.owned_by = null; // Set owned_by to null as there are no booked users
      timeSlot.is_expired = true;
      timeSlot.is_booked = true;
      await timeSlot.save();
      return res.status(200).json(timeSlot);
    }

    const promises = timeSlot.booked_users.map((user_id) =>
      User.findById(user_id)
    );
    const userList = await Promise.all(promises);

    // Set the owned_by to the last user in booked_users
    if (timeSlot.booked_users.length > 0) {
      const lastUser = userList[userList.length - 1];
      timeSlot.owned_by = lastUser._id;
    } else {
      timeSlot.owned_by = null; // Set owned_by to null if no booked users
    }

    timeSlot.is_expired = true;
    timeSlot.is_booked = true;
    await timeSlot.save();

    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all time slots for a specific user
router.get("/allslots/:user_id", async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find({
      owner: req.params.user_id,
    });
    let userlist = [];
    let newOwner = {};
    for (let timeSlot of timeSlots) {
      if (timeSlot.booked_users) {
        for (let user_id of timeSlot.booked_users) {
          const user = user_id;
          userlist.push(user);
        }
      }
      if (timeSlot.owned_by) {
        newOwner =  timeSlot.owned_by;
      }
    }
    res.status(200).json({ timeSlots, userlist, newOwner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a time slot
router.patch("/:timeSlot_id", async (req, res) => {
  try {
    // Find time slot
    const timeSlot = await TimeSlot.findById(req.params.timeSlot_id);;
    console.log("timeSlot:", timeSlot);
    if (!timeSlot) {
      return res.status(404).json({ error: "Time slot not found" });
    }
    // Update fields and validate overlap
    const updatedFields = { $set: req.body };

    const updatedTimeSlot = await TimeSlot.updateOne(
      { _id: req.params.timeSlot_id },
      updatedFields
    );

    // When using updateOne, mongoose doesn't return the updated document by default
    // so if you want to return the updated document, you have to fetch it again
    const newTimeSlot = await TimeSlot.findById(req.params.timeSlot_id);

    res.status(200).json(newTimeSlot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a time slot
router.delete("/:timeSlot_id", async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.timeSlot_id);

    if (!timeSlot) {
      return res.status(404).json({ error: "Time slot not found" });
    }

    // Check if the user is authorized to delete the time slot
    if (req.user.id !== timeSlot.owner.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await timeSlot.deleteOne();
    res.status(200).json({ message: "Time slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Other imports
const { check, validationResult } = require("express-validator");

// Route to list time slots available for auction or sale
router.get("/listings", async (req, res) => {
  try {
    const listings = await TimeSlot.find({
      $or: [{ for_auction: true }, { forsale: true }],
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Route to bid on a time slot
router.post("/bid/:timeSlot_id",
  [
    check("bidAmount", "Bid amount is required and must be a number")
      .not()
      .isEmpty()
      .isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { bidAmount, addr } = req.body;
      const timeSlot = await TimeSlot.findById(req.params.timeSlot_id);

      if (!timeSlot) {
        return res.status(404).json({ error: "Time slot not found" });
      }

      if (!timeSlot.for_auction) {
        return res
          .status(400)
          .json({ error: "This time slot is not available for auction" });
      }

      if (parseFloat(bidAmount) <= parseFloat(timeSlot.auction_price)) {
        return res.status(400).json({
          error: "Your bid must be higher than the current auction price",
        });
      }

      timeSlot.auction_price = bidAmount;
      timeSlot.booked_users.push(addr);
      await timeSlot.save();

      const userlist = [];
      for (let i = 0; i < timeSlot.booked_users.length; i++) {
        userlist.push(addr);
      }
      newOwner = timeSlot.owner;
      if (timeSlot.owned_by) {
        newOwner = await User.findById(timeSlot.owned_by);
      }
      res.status(200).json({
        message: "Bid placed successfully",
        timeSlot,
        userlist,
        newOwner,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// Route to purchase a time slot
router.post("/purchase/:timeSlot_id", async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.timeSlot_id);
    const { seed, balance } = req.body;
    const newOwner = algosdk.mnemonicToSecretKey(seed).addr
    if (timeSlot.amount_per_session > balance){
      return res.status(400).json({error: "Insufficient funds to purchase this timeslot."})
    }

    if (timeSlot.owner.toString() === newOwner) {
      return res
        .status(400)
        .json({ error: "You cannot purchase your own time slot" });
    }

    if (!timeSlot) {
      return res.status(404).json({ error: "Time slot not found" });
    }

    if (timeSlot.for_auction) {
      return res.status(400).json({ error: "This time slot is for auction" });
    }

    if (!timeSlot.forsale) {
      return res
        .status(400)
        .json({ error: "This time slot is not available for sale" });
    }

    if (timeSlot.purchased_by) {
      return res
        .status(400)
        .json({ error: "This time slot has already been purchased" });
    }
    // Create the transfer record
    const transfer = new TransferModel({
      sold_by: timeSlot.owner,
      purchased_by: newOwner,
      timeSlot_id: req.params.timeSlot_id,
      amount: timeSlot.amount_per_session,
      // Update with the appropriate field containing the purchase amount
    });

    timeSlot.owned_by = newOwner;
    timeSlot.is_owned = true;
    timeSlot.current = newOwner;
    // Save the transfer record
    await transfer.save();

    // Update the time slot to mark it as purchased
    timeSlot.purchased_by = req.params.user_id;
    await timeSlot.save();
    console.log('Transfer from God account');
    const recieverAccount = timeSlot.owner
    const senderSeedPhrase = seed;
    const godAccount = algosdk.mnemonicToSecretKey(senderSeedPhrase);
  
    let params = await client.getTransactionParams().do();
  
    let send_amttxn = algosdk.makePaymentTxnWithSuggestedParams(
      godAccount.addr,
      recieverAccount.addr,
      timeSlot.amount_per_session*1000000,
      undefined,
      undefined,
      params
    );
  
    let sendamt_signedTxn = send_amttxn.signTxn(godAccount.sk);
    let sendamt_sendTx = await client.sendRawTransaction(sendamt_signedTxn).do();
    let sendamt_confirmedTxn = await algosdk.waitForConfirmation(client, sendamt_sendTx.txId, 4);
  
    console.log("Transaction " + sendamt_sendTx.txId + " confirmed in round " + sendamt_confirmedTxn["confirmed-round"]);
    res.status(200).json({
      message: "Time slot purchased successfully",
      timeSlot,
      transfer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resell a time slot
// router.put("/resell/:timeSlot_id", authenticate, async (req, res) => {
//   try {
//     const { listed_price, forsale } = req.body;
//     const timeSlot = await TimeSlot.findById(req.params.timeSlot_id);

//     if (!timeSlot) {
//       return res.status(404).json({ error: "Time slot not found" });
//     }

//     // Check if the user is authorized to resell the time slot
//     if (req.user.id !== timeSlot.purchased_by.toString()) {
//       return res
//         .status(403)
//         .json({ error: "Unauthorized to resell this time slot" });
//     }

//     // Check if the time slot has not expired
//     if (new Date(timeSlot.expiry_date) < new Date()) {
//       return res
//         .status(403)
//         .json({ error: "Expired time slots cannot be resold" });
//     }

//     // Set the new price and mark the time slot as for sale
//     timeSlot.listed_price = listed_price;
//     timeSlot.forsale = forsale;
//     await timeSlot.save();

//     res.status(200).json({
//       message: "Time slot listed for sale successfully",
//       timeSlot,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
