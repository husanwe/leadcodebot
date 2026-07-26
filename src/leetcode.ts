const leetcodeApi = "https://leetcode.com/graphql";
const profileQuery =
  `query getProfileStats($username: String!, $submissionLimit: Int!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum {
          difficulty
          submissions
          count
        }
      }
    }
    recentSubmissionList(username: $username, limit: $submissionLimit) {
      title
      titleSlug
      statusDisplay
      time
    }
  }`;

type SubmissionCount = {
  difficulty: "All" | "Easy" | "Medium" | "Hard";
  submissions: number;
  count: number;
};

type SubmissionList = {
  title: string;
  titleSlug: string;
  statusDisplay: "Accepted" | "Wrong Answer" | "Time Limit Exceeded";
  time: string;
};

type LeetcodeProfileResponse = {
  data: {
    matchedUser: {
      submitStats: {
        acSubmissionNum: SubmissionCount[];
      };
    };
    recentSubmissionList: SubmissionList[];
  };
  errors?: {
    message:
      | "That user does not exist."
      | (string & Record<PropertyKey, never>);
  }[];
};

export const fetchLeetcodeProfile = async (
  username: string,
  submissionLimit = 20,
) => {
  const response = await fetch(leetcodeApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: profileQuery,
      variables: { username, submissionLimit },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as LeetcodeProfileResponse;
};
