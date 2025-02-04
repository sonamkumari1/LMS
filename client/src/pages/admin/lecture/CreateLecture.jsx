import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateLectureMutation, useGetCourseLecturesQuery } from "@/features/api/courseApi";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Lecture from "./Lecture";

function CreateLecture() {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();

  const { data: lectureData, isLoading: lecturesLoading, isSuccess: lecturesSuccess, error: lecturesError, refetch: refetchLectures } = useGetCourseLecturesQuery(courseId);

  const createLectureHandler = async () => {
    try {
      await createLecture({ courseId, lectureTitle });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      refetchLectures();
      toast.success("Lecture created successfully");
      // navigate(`/admin/course/${courseId}`);
    }
    if (error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error, navigate, courseId]);

  return (
    <div className="flex-1 mx-10 pt-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add course, add some basic course details for your new course
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        </p>
      </div>

      <div className="space-y-4 mt-5">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            name="lectureTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title name"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-5">
        <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>
          Back to Course
        </Button>
        <Button disabled={isLoading} onClick={createLectureHandler}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </>
          ) : (
            "Create Lecture"
          )}
        </Button>
      </div>

      <div className="mt-10">
        {lecturesLoading ? (
          <p>Loading...</p>
        ) :
          lecturesError ? (
            <p>Failed to load lectures</p>
          ) : lectureData.lectures.length === 0 ? (
            <p>No lectures found</p>
          ) : (
            lectureData.lectures.map((lecture, index) => (
              <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
            ))
          )
        }
      </div>
    </div>
  );
}

export default CreateLecture;
