import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { SVGProps } from 'react'

export default function ProfileCard() {
  return (
    <Card className="w-[300px] overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-64">
          <HeartIcon className="absolute top-4 right-4 text-white h-6 w-6 cursor-pointer" />
          <img
            alt="Profile picture of Andrew Smith"
            className="w-full h-full object-cover"
            height="256"
            src="/placeholder.svg?height=256&width=300"
            style={{
              aspectRatio: "300/256",
              objectFit: "cover",
            }}
            width="300"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 pb-0 text-center">
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Andrew Smith</h2>
          <p className="text-sm text-gray-500">Photographer</p>
          <p className="mt-2 text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non ligula eu felis.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch p-4">
        <div className="flex justify-between items-end text-sm">
          <div>
            <p className="text-xs text-gray-500 mb-1">Hr/rate</p>
            <span className="font-bold">€90</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Reviews</p>
            <span className="flex items-center">
              <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
              4.85 (54)
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
