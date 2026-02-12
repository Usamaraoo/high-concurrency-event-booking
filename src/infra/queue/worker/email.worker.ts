import { Worker, Job } from 'bullmq';
import envConfig from '../../../config/envConfig';
import {connection} from '../index'
import { sendMail } from '../../../utils/sendMmail';

// This function runs every time a job is added to the queue
const emailWorker = new Worker(
  'email-queue',
  async (job: Job) => {
    const { bookingId, userEmail, eventTitle } = job.data;

    console.log(`✉️ Sending confirmation email for Booking: ${bookingId} to ${userEmail}`);
    sendMail(userEmail, eventTitle);
    

    return { status: 'success' };
  },
  { connection }
);

emailWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});

export default emailWorker;