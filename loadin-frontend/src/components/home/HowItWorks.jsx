import { motion } from "framer-motion";
import {
    Package,
    Search,
    Truck,
    MapPin,
    CircleCheckBig
} from "lucide-react";

const steps = [

    {
        icon: Package,
        title: "Customer Posts Shipment",
        desc: "Customer enters pickup and destination."
    },

    {
        icon: Search,
        title: "LoadIn Finds Driver",
        desc: "Nearby empty trucks are matched instantly."
    },

    {
        icon: Truck,
        title: "Driver Accepts",
        desc: "Driver confirms shipment."
    },

    {
        icon: MapPin,
        title: "Transportation",
        desc: "Goods move safely to destination."
    },

    {
        icon: CircleCheckBig,
        title: "Delivery Complete",
        desc: "Shipment delivered successfully."
    }

]

function HowItWorks(){

return(

<section  id="how-it-works" className="py-28 bg-white">

<div className="max-w-7xl mx-auto px-6">

<div className="text-center">

<p className="text-blue-600 font-semibold uppercase">

How It Works

</p>

<h2 className="text-5xl font-bold mt-4">

Simple.

Fast.

Reliable.

</h2>

<p className="text-slate-500 mt-6">

LoadIn connects empty returning trucks
with customers needing transportation.

</p>

</div>

<div className="mt-20">

<div className="grid lg:grid-cols-5 gap-8">

{
steps.map((step,index)=>{

const Icon=step.icon

return(

<motion.div

key={index}

initial={{opacity:0,y:40}}

whileInView={{opacity:1,y:0}}

transition={{
duration:.5,
delay:index*.15
}}

viewport={{once:true}}

className="relative"

>

<div className="bg-slate-50 rounded-3xl p-8 shadow hover:shadow-xl transition-all h-full">

<div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">

<Icon
size={30}
className="text-blue-600"
/>

</div>

<h3 className="mt-6 text-xl font-bold">

{step.title}

</h3>

<p className="mt-4 text-slate-500">

{step.desc}

</p>

</div>

{
index<steps.length-1 && (

<div className="hidden lg:block absolute top-16 -right-8 text-blue-400 text-4xl">

→

</div>

)

}

</motion.div>

)

})

}

</div>

</div>

</div>

</section>

)

}

export default HowItWorks;