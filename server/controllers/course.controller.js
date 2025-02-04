import { Course } from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course title and category are required",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id, // assuming `req.id` is set by isAuthenticated middleware
    });

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const searchCourses = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;
    console.log(categories);

    // create search query
    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ]
    }

    // if categories selected
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    // define sorting order
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1;//sort by price in ascending
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1; // descending
    }

    let courses = await Course.find(searchCriteria).populate({ path: "creator", select: "name photoUrl" }).sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || []
    });

  } catch (error) {
    console.log(error);

  }
}

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name PhotoURL" });
    if (!courses) {
      return res.status(404).json({ success: false, message: "No courses found" });
    }
    return res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
}
export const getCreateCourse = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        courses: [],
        success: false,
        message: "No course found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};



export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let courseThumbnail = course.courseThumbnail;

    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      const uploadedImage = await uploadMedia(thumbnail.path);
      courseThumbnail = uploadedImage.secure_url;
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    return res.status(200).json({ success: true, course });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required"
      })
    };

    // create lecture
    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);
    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(201).json({
      lecture,
      message: "Lecture created successfully."
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create lecture"
    })
  }
}
export const getCourseLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      })
    }
    return res.status(200).json({
      lectures: course.lectures
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get lectures"
    })
  }
}
export const editLecture = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // ✅ Debugging log
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    console.log("Received videoInfo:", videoInfo); // ✅ Debugging log
    console.log("Full request body:", req.body);

    if (!videoInfo) {
      return res.status(400).json({ success: false, message: "Missing videoInfo in request body" });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found!" });
    }

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      lecture: {
        _id: lecture._id,
        lectureTitle: lecture.lectureTitle,
        videoUrl: lecture.videoUrl,
        publicId: lecture.publicId,
        isPreviewFree: lecture.isPreviewFree,
        createdAt: lecture.createdAt,
        updatedAt: lecture.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit lecture",
      error: error.message,
    });
  }
};



export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    //delete lecture from cloudinary
    if (lecture.publicId) {
      await deleteMediaFromCloudinary(lecture.publicId);
    }
    await Course.updateOne(lecture.lectureId, { $pull: { lectures: lectureId } });
    return res.status(200).json({ success: true, message: "Lecture deleted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
}

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }
    return res.status(200).json({ success: true, lecture });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
}

//publish and unpublish course logic

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    //publish status based query parameter
    course.isPublished = publish === "true"; //if publish is true then course is published else course is unpublished
    await course.save();

    const statusMessage = course.isPublished ? "Course published successfully" : "Course unpublished successfully";
    return res.status(200).json({ success: true, message: statusMessage });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
}


