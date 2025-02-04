import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
    const navigate = useNavigate();
    const goToUpdateLecture = () => {
        navigate(`/admin/course/${courseId}/lecture/${lecture._id}`); //navigate to the update lecture page
    }
    return (
        <div className="flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md">
            <h1 className="font-bold text-gray-800 dark:text-gray-200"> Lecture {index + 1}: {lecture.lectureTitle}</h1>
            <Edit onClick={goToUpdateLecture} size={20} className="cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600" />
        </div>
    )
}

export default Lecture;
