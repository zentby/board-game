
export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  played: number;
}

const defaultStats: GameStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  played: 0,
};

export function getStats(key: "othello" | "gomoku"): GameStats {
  try {
    const str = localStorage.getItem(`STATS_${key}`);
    if (str) return JSON.parse(str);
  } catch {}
  return { ...defaultStats };
}

export function saveStats(key: "othello" | "gomoku", stats: GameStats) {
  localStorage.setItem(`STATS_${key}`, JSON.stringify(stats));
}
