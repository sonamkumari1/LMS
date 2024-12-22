import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

function Course() {
   
  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src="https://img-c.udemycdn.com/course/750x422/3873464_403c_3.jpg"
          alt="Course Thumbnail"
          className="w-full h-auto"
        />
      </div>
      <CardContent className="px-5 py-4 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate">
          Next.js Complete Course in Hindi 2024
        </h1>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="http://github.com/shadcn.png"
                alt="Instructor Avatar"
                className="rounded-full"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
           <h1 className="font-medium text-sm">Mernstack</h1>
          </div>
          <Badge className={'bg-blue-600 text-white px-2 py-1 text-xs rounded-full'}>
            Advance
          </Badge>
        </div>
        <div className="font-bold text-lg">
            <span>₹300</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default Course;
