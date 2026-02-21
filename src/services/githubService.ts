/**
 * GitHub API Service
 * 
 * Handles communication with the GitHub GraphQL API to fetch user contribution data.
 */

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

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

export interface GitHubContributionResponse {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: ContributionCalendar;
      };
    };
  };
  errors?: any[];
}

const GET_USER_CONTRIBUTIONS_QUERY = `
  query($userName:String!, $from:DateTime, $to:DateTime) {
    user(login: $userName) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetches contribution data for a specific GitHub user
 * @param userName - GitHub username
 * @param token - GitHub Personal Access Token (PAT)
 * @param year - Optional year to fetch data for
 * @returns Contribution calendar data or null if error
 */
export async function fetchUserContributions(
  userName: string,
  token: string,
  year?: number
): Promise<ContributionCalendar | null> {
  if (!token) return null;

  let from = undefined;
  let to = undefined;

  if (year) {
    from = `${year}-01-01T00:00:00Z`;
    to = `${year}-12-31T23:59:59Z`;
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: GET_USER_CONTRIBUTIONS_QUERY,
        variables: { userName, from, to },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GitHubContributionResponse = await response.json();

    if (result.errors) {
      console.error('[GitHubService] GraphQL Errors:', result.errors);
      return null;
    }

    return result.data?.user?.contributionsCollection.contributionCalendar || null;
  } catch (error) {
    console.error('[GitHubService] Error fetching contributions:', error);
    return null;
  }
}

export const githubService = {
  fetchUserContributions,
};
