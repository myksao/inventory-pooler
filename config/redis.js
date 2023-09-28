const { Redis } = require("ioredis");
const { Queue, Worker } = require("bullmq");

const connection = new Redis();

const createStockQ = new Queue("createStock", {
  connection,
});

const updateStockQ = new Queue("updateStock", {
  connection,
});

const workerQ = async (name, job) => {
  const worker = new Worker(name, job, {
    connection,
    removeOnComplete: true,
    removeOnFail: false,
  });

  worker.on("completed", (job) => {
    console.log(`${job.id} has completed!`);
  });

  worker.on("failed", (job) => {
    console.log(`${job.id} has failed with ${job.failedReason}`);
  });

  await worker.close();
};

module.exports = {
  queue: {
    createStockQ,
    updateStockQ,
  },
  worker: {
    workerQ,
  },
};
