import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";


const BuyCourseButton = ({ courseId }) => {
    const [createCheckoutSession, { data, isError,isSuccess, error, isLoading }] = useCreateCheckoutSessionMutation()


    const purchaseCourseHandler = async () => {
        await createCheckoutSession(courseId)
    }

    useEffect(()=>{
        if(isSuccess){
            if(data?.url){
            window.location.href=data.url
            }else{
                toast.error("Something went wrong")
            }
        }
        if(isError){
            toast.error(error?.data?.message || "Something went wrong")
        }
    },[isSuccess,data, isError,error])



    return (
        <Button disabled={isLoading} className="w-full" onClick={purchaseCourseHandler}>

            {
                isLoading ? (
                    <>
                        <Loader2 className="mr-4 w-4 h-4 animate-spin" /> Please Wait...
                    </>

                ) : (
                    "Purchase Course"
                )
            }
        </Button>
    )
}

export default BuyCourseButton;
