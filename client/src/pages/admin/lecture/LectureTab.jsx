import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const LectureTab = () => {
    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisabled, setBtnDisabled] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const { courseId, lectureId } = params;

    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
    const [removeLecture, { data: removeData, isLoading: removeLoading, error: removeError, isSuccess: removeSuccess }] = useRemoveLectureMutation();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            setMediaProgress(true);
            try {
                const res = await axios.post("http://localhost:8080/api/v1/media/upload-video", formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        if (total) {
                            setUploadProgress(Math.round((loaded * 100) / total));
                        }
                    }
                });

                if (res.data.success) {
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id });
                    toast.success(res.data.message);
                } else {
                    toast.error("Upload failed");
                }
            } catch (error) {
                console.error(error);
                toast.error("Video upload failed");
            } finally {
                setMediaProgress(false);
            }
        }
    };

    const editLectureHandler = async () => {
        await editLecture({ courseId, lectureId, lectureTitle, videoInfo: uploadVideoInfo, isPreviewFree: isFree });
    }

    const removeLectureHandler = async () => {
        await removeLecture({ lectureId });
    }

    const { data: lectureData } = useGetLectureByIdQuery({ lectureId });
    const lecture = lectureData?.lecture; // lecture is the lecture object

    useEffect(() => {
        if (lecture) {
            setLectureTitle(lecture.lectureTitle);
            setIsFree(lecture.isPreviewFree);
            setUploadVideoInfo(lecture.videoInfo);
        }
    }, [lecture]);


    useEffect(() => {
        if (isSuccess) {
            toast.success("Lecture updated successfully");
            navigate(`/admin/course/${courseId}/lecture`);
        }
        if (error) {
            toast.error("Lecture update failed");
        }
    }, [isSuccess, error]);

    useEffect(() => {
        if (removeSuccess) {
            toast.success("Lecture removed successfully");
        }
    }, [removeSuccess]);

    return (
        <Card>
          <CardHeader>
                <div>
                    <CardTitle>Edit Lecture</CardTitle>
                    <CardDescription>Make changes when your changes are done</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button disabled={removeLoading} variant="destructive" onClick={removeLectureHandler}>{
                        removeLoading ? <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Removing...

                        </> : "Remove Lecture"

                    }
                    </Button>
                </div>

            </CardHeader>

            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        placeholder="Introduction to the course"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                    />
                </div>

                <div>
                    <Label>
                        Video <span className="text-red-500">*</span>
                    </Label>
                    <Input type="file" accept="video/*" className="w-fit" onChange={fileChangeHandler} />
                </div>
                <div className="flex items-center space-x-2 my-5">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="airplane-mode"
                            checked={isFree}
                            onCheckedChange={(checked) => setIsFree(checked)}
                        />
                        <Label htmlFor="airplane-mode">Is this video free?</Label>
                    </div>
                </div>
                {mediaProgress && (
                    <div className="my-4">
                        <Progress value={uploadProgress} />
                        <p>{uploadProgress} % uploaded</p>
                    </div>
                )}
                <div className="mt-4">
                    <Button disabled={isLoading} onClick={editLectureHandler}>
                        {
                            isLoading ? <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Updating...
                            </> : "Update Lecture"
                        }

                    </Button>
                </div>
            </CardContent>

        </Card>

    );
};

export default LectureTab;
