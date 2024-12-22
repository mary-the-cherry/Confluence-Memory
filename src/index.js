import Resolver from '@forge/resolver';
import { storage } from '@forge/api';

const resolver = new Resolver();

// Fetch the leaderboard
resolver.define('get-leaderboard', async () => {
    const leaderboardGet = await storage.get('leaderboard1') || [];
    return leaderboardGet;
});

// Save a new leaderboard entry
resolver.define('save-score', async ({ payload }) => {
    const { name, moves, time } = payload.payload;
    const leaderboard = await storage.get('leaderboard1') || [];

    // Add the new entry and sort by moves, then time
    const updatedLeaderboard = [...leaderboard, { name, moves, time }]
        .sort((a, b) => a.moves - b.moves || a.time - b.time)
        .slice(0, 10); // Keep top 10 entries

    // Save updated leaderboard
    await storage.set('leaderboard1', updatedLeaderboard);
    return updatedLeaderboard;
});

export const handler = resolver.getDefinitions();
