import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetails = () => {
    const params=useParams()
    const courseId=params.courseId
    const navigate=useNavigate()
    const {data, isLoading, isSuccess, isError}=useGetCourseDetailWithStatusQuery(courseId);

    if(isLoading){
        return <div>Loading...</div>
    }
    if(isError){
        return <div>Error...</div>
    }

    const {course, purchased}=data

    const handleContinueCourse=()=>{
       if(purchased){
        navigate(`/course-progress/${courseId}`)
       }
    }
   
    const purchasedCourse = false
    return (
        <div className="mt-5 space-y-5">
            <div className="bg-[#2D2F31] text-white">
                <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
                    <h1 className="text-2xl font-bold md:text-4xl mt-10">{course?.courseTitle}</h1>
                    <p className="text-sm md:text-base">{course?.courseSubTitle}</p>
                    <p> Created By{" "} <span className="text-[#C0C4FC] underline italic">{course?.creator.name}</span> </p>
                    <div className="flex items-center gap-2">
                        <BadgeInfo size={16} />
                        <p>Last Updated {course?.createdAt.split("T")[0]}</p>
                    </div>
                    <p>Student Enrolled {course?.enrolledStudents.length}</p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between">
                <div className="w-full lg:w-1/2 space-y-5">
                    <h1 className="font-bold text-xl md:text-2xl">Description</h1>
                    <p className="text-sm md:text-base" dangerouslySetInnerHTML={{ __html: course?.description }} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>4 lectures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {
                                course.lectures.map((lecture, index) => {
                                    <div key={index} className="flex items-center gap-3">
                                        <span>{
                                            true ? (<PlayCircle size={16} />) : (<Lock size={16} />)
                                        }
                                        </span>
                                        <p>{lecture.lectureTitle}</p>
                                    </div>
                                })
                            }
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full lg:w-1/3">
                    <Card>
                        <CardContent className="p-4 flex flex-col">
                            <div className="w-full aspect-video mb-5">
                                <ReactPlayer
                                 width="100%"
                                 height="100%"
                                 url={course.lectures[0].videoUrl}
                                 controls={true}
                                />
                            </div>
                            <h1>{course.lectures[0].lectureTitle}</h1>
                            <Separator className="my-2" />
                            <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {
                                purchased ? (<Button className="w-full" onClick={handleContinueCourse}>Continue Lecture</Button>) : (<BuyCourseButton courseId={courseId} />)
                            }
                           
                        </CardFooter>
                    </Card>
                </div>
            </div>

        </div>
    )
};

export default CourseDetails;


