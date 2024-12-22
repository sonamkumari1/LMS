import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import React from 'react'
import Course from './Course'

function Profile() {
  const isLoading=false;
  const enrolledCourses=[1];

  return (
    <div className='max-w-4xl mx-auto px-4 my-24'>
      <h1 className='font-bold text-2xl text-center md:text-left'>Profile</h1>
       <div className='flex flex-col md:flex-row items-center md:items-start gap-8 my-5'>
        <div className='flex flex-col items-center'>
        <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
              <AvatarImage
                src="http://github.com/shadcn.png"
                alt="Instructor Avatar"
                className="rounded-full"
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
        </div>
        <div>
          <div>
            <h1 className='font-semibold text-gray-900 dark:bg-gray-100'>
              Name:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>MerStack</span>
            </h1>
          </div>
          <div>
            <h1 className='font-semibold text-gray-900 dark:bg-gray-100'>
              Email:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>sonam@gmail.com</span>
            </h1>
          </div>
          <div>
            <h1 className='font-semibold text-gray-900 dark:bg-gray-100'>
              Role:
              <span className='font-normal text-gray-700 dark:text-gray-300 ml-2'>Instructor</span>
            </h1>
          </div>

          <Dialog>
            <DialogTrigger>
              <Button size="sm" className="mt-2">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you have done.
                </DialogDescription>
              </DialogHeader>

              <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                     <Label>Name</Label>
                     <Input type="text" placeholder="Name" className="col-span-3" />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                     <Label>Profile photo</Label>
                     <Input type="file" accept="image/*" className="col-span-3" />
                  </div>
              </div>
              <DialogFooter>
                <Button disable={isLoading}>
                  {
                    isLoading ? (
                      <>
                       <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                      </>
                     
                    ):"save cahnges"
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
       </div>

       <div>
        <h1 className='font-medium text-lg'>Courses you are enrolled in</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
            {
              enrolledCourses.length===0? <h1>you haven't enrolled yet</h1> :(
                enrolledCourses.map((courses, index)=> <Course key={index} />)
              )
            }
        </div>
       </div>
    </div>
  )
}

export default Profile
