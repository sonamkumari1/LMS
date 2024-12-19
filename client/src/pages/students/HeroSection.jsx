import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-16 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-4">
          Find the best Courses for you
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn and upskills with our wide range of courses
        </p>

        <form action="" className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden">
          <Input
            type="text"
            className="flex-grow bg-white border-none focus-visible:ring-0 px-6 py-3 text-white dark:text-gray-100 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6 "
          />
          <Button className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700">Search</Button>
        </form>
      </div>
    </div>
  );
}

export default HeroSection;
