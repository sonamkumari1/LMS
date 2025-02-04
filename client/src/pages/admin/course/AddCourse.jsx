import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useCreateCourseMutation } from "@/features/api/courseApi";

function AddCourse() {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { isLoading, isSuccess, error, data }] =
    useCreateCourseMutation();
  const navigate = useNavigate();

  const createCourseHandler = async () => {
    if (!courseTitle || !category) {
      toast.error("Please fill in all fields");
      return;
    }
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course Created Successfully");
      navigate("/admin/course");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to create course");
    }
  }, [isSuccess, error, navigate]);

  return (
    <div className="flex-1 mx-10 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Add a New Course</h1>
        <p className="text-sm text-gray-600">
          Provide basic course details for your new course.
        </p>
      </div>

      <div>
        <Label htmlFor="courseTitle">Title</Label>
        <Input
          id="courseTitle"
          type="text"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          placeholder="Your Course Name"
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={setCategory}>
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {[
                "Next JS",
                "React JS",
                "Angular",
                "Vue JS",
                "Node JS",
                "Python",
                "Java",
                "C++",
                "Machine Learning",
                "Data Science",
                "DevOps",
                "Cloud Computing",
                "Cyber Security",
              ].map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-5 mt-4">
        <Button variant="outline" onClick={() => navigate("/admin/course")}>
          Back
        </Button>
        <Button disabled={isLoading} onClick={createCourseHandler}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </div>
  );
}

export default AddCourse;
