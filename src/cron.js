const repo = require("../src/inventory/repo");
const CronJob = require("cron").CronJob;
const { workerQ } = require("../config/redis").worker;

let createStock = new CronJob("* * * * *", async () => {
  await workerQ("createStock", async (job) => {
    const { payload } = job.data;
    const data = await repo.createStock(payload);
    //notify merchant
    console.log(data);
    return data;
  });
});

let updateStock = new CronJob("* * * * *", async () => {
  await workerQ("createStock", async (job) => {
    const { batchNumber, stockBalance, id } = job.data;
    const data = await repo.updateStock({
      batchNumber,
      stockBalance,
      id,
    });

    return data;
  });
});

createStock.start();
updateStock.start();
