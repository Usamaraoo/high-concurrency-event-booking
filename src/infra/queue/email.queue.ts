import { Queue } from 'bullmq';
import {connection} from './index'

// Create the queue instance
export const emailQueue = new Queue('email-queue', { connection });