const express = require("express");
const {
  getJob,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobsInRadius,
  jobVideoUpload,
} = require("../controllers/jobs");
const Job = require("../models/Job");
const advancedResults = require("../middleware/advancedResults");

// include other resource routers

const router = express.Router({ mergeParams: true });

// reroute into other resource routers

router.route("/radius/:postcode/:distance").get(getJobsInRadius);
router.route("/:id/:videoDescription").put(jobVideoUpload);

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Job, {
      path: "bootcamp",
      select: "name description",
    }),
    getJobs
  )
  .post(protect, authorize("recruiter"), createJob);
router
  .route("/:id")
  .get(getJob)
  .put(protect, authorize("recruiter"), updateJob)
  .delete(protect, authorize("recruiter"), deleteJob);

module.exports = router;
