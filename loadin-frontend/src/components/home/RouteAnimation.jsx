import { motion } from "framer-motion";
import {
    Truck,
    MapPin,
    Package,
    CircleCheckBig,
    Sparkles
} from "lucide-react";

function RouteAnimation() {

    return (

<section id="features" className="py-28 bg-slate-50 overflow-hidden">

<div className="max-w-7xl mx-auto px-6">

<div className="text-center">

<p className="text-blue-600 font-semibold uppercase">

Smart Matching

</p>

<h2 className="text-5xl font-bold mt-4">

Watch LoadIn Work

</h2>

<p className="mt-5 text-slate-500 text-lg">

A returning empty truck gets matched with nearby shipments automatically.

</p>

</div>

<div className="mt-24 relative">

<div className="flex justify-between">

<div className="flex flex-col items-center">

<MapPin
size={42}
className="text-red-500"
/>

<h3 className="font-bold mt-3">

Hyderabad

</h3>

</div>

<div className="flex flex-col items-center">

<MapPin
size={42}
className="text-green-600"
/>

<h3 className="font-bold mt-3">

Bangalore

</h3>

</div>

</div>

<div className="relative mt-16">

<div className="h-2 rounded-full bg-slate-300"/>

<motion.div

className="absolute top-0 left-0 h-2 rounded-full bg-blue-600"

initial={{width:0}}

whileInView={{width:"100%"}}

transition={{
duration:4,
repeat:Infinity,
repeatDelay:1
}}

viewport={{once:false}}

/>

<motion.div

className="absolute -top-8"

initial={{x:0}}

whileInView={{x:"92%"}}

transition={{
duration:4,
repeat:Infinity,
repeatDelay:1,
ease:"linear"
}}

viewport={{once:false}}

>

<div className="bg-white p-4 rounded-full shadow-xl">

<Truck

size={42}

className="text-orange-500"

/>

</div>

</motion.div>

<motion.div

className="absolute top-12 left-1/2"

initial={{opacity:0,scale:0}}

whileInView={{
opacity:[0,1,1],
scale:[0,1.2,1]
}}

transition={{
delay:1,
duration:.8,
repeat:Infinity,
repeatDelay:4
}}

>

<div className="bg-white p-3 rounded-full shadow">

<Package
size={28}
className="text-blue-600"
/>

</div>

</motion.div>

<motion.div

className="absolute -right-4 -top-14"

initial={{opacity:0}}

whileInView={{
opacity:[0,0,1]
}}

transition={{
delay:4,
duration:.6,
repeat:Infinity,
repeatDelay:1
}}

>

<div className="bg-green-100 px-4 py-2 rounded-full flex items-center gap-2">

<CircleCheckBig
size={22}
className="text-green-600"
/>

<span className="font-medium">

Delivered

</span>

</div>

</motion.div>

</div>

<div className="grid lg:grid-cols-3 gap-10 mt-24">

<div className="bg-white rounded-3xl p-8 shadow">

<Sparkles className="text-blue-600"/>

<h3 className="font-bold text-xl mt-5">

AI Matching

</h3>

<p className="text-slate-500 mt-3">

Nearby returning trucks are matched automatically.

</p>

</div>

<div className="bg-white rounded-3xl p-8 shadow">

<Truck className="text-orange-500"/>

<h3 className="font-bold text-xl mt-5">

Empty Miles Reduced

</h3>

<p className="text-slate-500 mt-3">

Drivers earn more instead of returning empty.

</p>

</div>

<div className="bg-white rounded-3xl p-8 shadow">

<Package className="text-blue-600"/>

<h3 className="font-bold text-xl mt-5">

Affordable Transport

</h3>

<p className="text-slate-500 mt-3">

Customers save transportation costs.

</p>

</div>

</div>

</div>

</div>

</section>

    )

}

export default RouteAnimation;