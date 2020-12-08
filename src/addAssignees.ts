import * as core from "@actions/core";
import { Octokit } from "@octokit/rest";
import chunk from "lodash.chunk";

export async function addAssignees(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number,
  assignees: string[]
) {
  core.info(`Assigning ${assignees.join(", ")}.`);
  const chunks = chunk(assignees, 10);

  try {
    await Promise.all(
      chunks.map((batch) =>
        octokit.issues.addAssignees({
          repo,
          owner,
          issue_number: prNumber,
          assignees: batch,
        })
      )
    );
  } catch (err) {
    if (err.status === 403) {
      core.setFailed("Unable to assign users. Token provided does not have write permission.");
    } else {
      throw err;
    }
  }
}
