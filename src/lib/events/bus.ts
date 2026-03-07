import { Redis } from '@upstash/redis';
import { SystemEvent } from './schema';

let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
}

export const EventBus = {
    async publish(channel: string, event: SystemEvent) {
        if (!redis) {
            console.warn('⚠️ Upstash Redis is not configured. Falling back to simple logging for event:', event.action_type);
            return;
        }

        try {
            await redis.publish(channel, event);
            // For queue-like processing in MVP (if we run a cron or webhook listener), we can also use lists.
            // But Pub/Sub is best if we have a persistent listener. 
            // Next.js serverless functions often prefer list pushes to act as a queue processed by a cron/webhook.
            await redis.lpush(`queue:${channel}`, event);
        } catch (error) {
            console.error('Failed to publish to redis:', error);
        }
    },

    async isCommsLocked(userId: string): Promise<boolean> {
        if (!redis) return false;

        const lastActiveStr = await redis.get(`last_notified:${userId}`);
        if (!lastActiveStr) return false;

        const lastNotified = new Date(lastActiveStr as string);
        const now = new Date();
        const hoursSince = (now.getTime() - lastNotified.getTime()) / (1000 * 60 * 60);

        return hoursSince < 24;
    },

    async lockComms(userId: string) {
        if (!redis) return;
        await redis.set(`last_notified:${userId}`, new Date().toISOString());
    }
};
