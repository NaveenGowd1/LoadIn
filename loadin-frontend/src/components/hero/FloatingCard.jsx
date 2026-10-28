import { motion } from "framer-motion";

export default function FloatingCard({
    icon,
    title,
    subtitle,
    className = "",
    delay = 0
}) {

    return (

        <motion.div

            initial={{
                opacity:0,
                y:30
            }}

            animate={{
                opacity:1,
                y:[0,-10,0]
            }}

            transition={{
                delay,
                duration:3,
                repeat:Infinity,
                ease:"easeInOut"
            }}

            className={`
                absolute
                bg-white/80
                backdrop-blur-xl
                border
                border-white/40
                rounded-3xl
                shadow-2xl
                px-5
                py-4
                flex
                items-center
                gap-4
                ${className}
            `}

        >

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center pointer-events-none">

                {icon}

            </div>

            <div className="flex flex-col pointer-events-none">

                <h3 className="font-bold text-slate-900">

                    {title}

                </h3>

                <p className="text-sm text-slate-500">

                    {subtitle}

                </p>

            </div>

        </motion.div>

    )

}