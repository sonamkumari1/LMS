import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { toast } from "react-toastify";
import { use } from "react";

function CourseTab() {
  const [input, setInput] = useState({
    courseTitle: "",
    description: "",
    subTitle: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const { data: courseByIdData, isLoading: courseByIdLoading } =
    useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

  const course = courseByIdData?.course;
  
  useEffect(() => {
    if (course) {
      setInput({
        courseTitle: course.courseTitle,
        description: course.description,
        subTitle: course.subTitle,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: course.courseThumbnail,
      });
    }
  }, [course]);

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
  const [publishCourse, { data: publishData, refetch, isLoading: publishLoading, isSuccess: publishSuccess, error: publishError }] = usePublishCourseMutation();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewThumbnail(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("description", input.description);
    formData.append("subTitle", input.subTitle);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);

    await editCourse({ courseId, formData });

    console.log(formData);
  };

  const publishStatusHandler = async (action) => {
   try {
    const response = await publishCourse({ courseId, query: action });
    if(response.data){
      refetch();
      toast.success(response.data.message || "Course published successfully");
      navigate("/admin/course");
    }
   } catch (error) {
    toast.error(error?.data?.message || "Something went wrong");
   }
  }

  useEffect(() => {
    if (isSuccess) {

      toast.success(data?.message || "Course updated successfully");
      navigate("/admin/course");
    }
    if (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [isSuccess, error, data, navigate]);


  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your course here. click save when you are done
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={()=>publishStatusHandler(courseByIdData?.course.isPublished ?"false":"true")}>
            {courseByIdData?.course.isPublished ? "Unpublished" : "Publish"}
          </Button>
          <Button>Remove Course</Button>

        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex Fullstack developer"
            />
          </div>
        </div>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Sub Title</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex Become a FullStack developer from zero to hero in 2 month"
            />
          </div>
        </div>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select onValueChange={selectCategory}>
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

            <div>
              <Label>Course Lavel </Label>
              <Select onValueChange={selectCourseLevel}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a Course Lavel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    {["Beginner", "Medium", "Advance"].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="Ex 500"
                className="w-fit"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                alt="course thumbnail"
                className="e-64 my-2"
              />
            )}
          </div>
          <div>
            <Button variant="outline" onClick={() => navigate("/admin/course")}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseTab;
