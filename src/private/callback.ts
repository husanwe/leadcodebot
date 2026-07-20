import { bot } from "../bot.ts";
import { db } from "../db.ts";
import { fetchLeetcodeProfile } from "../leetcode.ts";
import { profilesTable } from "../schema.ts";

const titleSlug = Deno.env.get("TITLE_SLUG") || "add-two-integers";
export const verifySubmissionOnTime = async (
  username: string,
  userId: number,
) => {
  const { data } = await fetchLeetcodeProfile(username, 1);
  const { recentSubmissionList } = data;

  for (const submission of recentSubmissionList) {
    if (
      submission.titleSlug === titleSlug &&
      submission.statusDisplay === "Accepted" &&
      /^(0|1)\s+minutes?$/.test(submission.time)
    ) {
      await db.insert(profilesTable).values({ username, userId });
      await bot.api.sendMessage(userId, "You are successfully registered!");
      return;
    }
  }
  await bot.api.sendMessage(userId, "You haven't solve the problem on time.");
};
