import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Link } from "react-router-dom";

function Course({course}) {
   console.log(course,"course");
  return (
    <Link to={`course-detail/${course._id}`}>
    <Card className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src={course.courseThumbnail}
          alt="Course Thumbnail"
          className="w-full h-auto"
        />
      </div>
      <CardContent className="px-5 py-4 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate">
          {course.courseTitle}
        </h1>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={ "http://github.com/shadcn.png"}
                alt="Instructor Avatar"
                className="rounded-full"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
           <h1 className="font-medium text-sm">{course.creator.name}</h1>
          </div>
          <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full'}>
            {course.courseLevel}
          </Badge>
        </div>
        <div className="font-bold text-lg">
            <span>₹{course.coursePrice}</span>
        </div>
      </CardContent>
    </Card>
    </Link>
    
  );
}

export default Course;
