/**
 * GitHub API Service
 * 
 * Fetches contribution data via the server-side proxy at /api/github.
 * The GitHub token is kept server-side and never exposed to the client.
 */

export interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
}

/**
 * Fetches contribution data for a specific GitHub user via server proxy
 * @param userName - GitHub username
 * @param year - Optional year to fetch data for
 * @returns Contribution calendar data or null if error
 */
export async function fetchUserContributions(
  userName: string,
  year?: number
): Promise<ContributionCalendar | null> {
  try {
    const response = await fetch('/api/github', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userName, year }),
    });

    if (!response.ok) {
      console.error('[GitHubService] Proxy error:', response.status);
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('[GitHubService] Error fetching contributions:', error);
    return null;
  }
}

export const githubService = {
  fetchUserContributions,
};
