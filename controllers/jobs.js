const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const path = require("path");
const Job = require("../models/Job");
const Bootcamp = require("../models/Bootcamp"); //
// @route POST /api/v1/jobs
// @access Public

exports.getJobs = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const jobs = await Job.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @description Get single job
// @route POST /api/v1/jobs/:id
// @access Public

exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!job) {
    return next(new ErrorResponse(`No job with id of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: job,
  });
});

// @description Create new job
// @route POST /api/v1/jobs/:id
// @access Private
exports.createJob = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`),
      404
    );
  }

  const job = await Job.create(req.body);
  res.status(200).json({
    success: true,
    data: job,
  });
});

// @description Update job
// @route PUT /api/v1/jobs/:id
// @access Private
exports.updateJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id} `, 404)
    );
  }
  res.status(200).json({ success: true, data: job });
});

// @description Delete job
// @route DELETE /api/v1/jobs/:id
// @access Private
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id} `, 404)
    );
  }

  job.remove();
  res.status(200).json({ success: true, data: {}, message: "data deleted" });
});

// @description Get jobs within a radius
// @route GET /api/v1/jobs/radius:postcode/:distance
// @access Private
exports.getJobsInRadius = asyncHandler(async (req, res, next) => {
  const { postcode, distance } = req.params;

  const loc = await geocoder.geocode(postcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc radius using radians
  // Earth radius = 3,963 miles

  const radius = distance / 3963;
  const jobs = await Job.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
    // information found on node-geocoder docs
  });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});
// @description Upload video for job
// @route PUT /api/v1/jobs/:id/photo
// @access Private
exports.jobVideoUpload = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id} `, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files[""];
  console.log(file);
  //make sure the image is a 📲image

  if (!file.mimetype.startsWith("video")) {
    return next(new ErrorResponse(`Please upload a video file`, 400));
  }

  if (file.size > process.env.MAX_VIDEO_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a video less than ${process.env.MAX_VIDEO_UPLOAD}`,
        400
      )
    );
  }

  // create custom filename

  file.name = `video_${job._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Job.findByIdAndUpdate(req.params.id, {
      videoDescription: file.name,
    });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
