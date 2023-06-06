const {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchId,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);

  return res.status(200).json(await getAllLaunches(skip, limit));
}
async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.target ||
    !launch.launchDate
  ) {
    return res.status(400).json({
      error: "missing required launch",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}
async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  if (!(await existLaunchWithId(launchId))) {
    return res.status(400).json({
      error: "launch not found",
    });
  } else {
    const aborted = await abortLaunchId(launchId);
    if (!aborted) {
      return res.status(400).json({
        error: "launch not aborted",
      });
    }
    return res.status(200).json("deleted");
  }
}
module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
