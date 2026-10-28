import { Truck, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function RoleSelection({ mode }) {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">

            <motion.div

                initial={{ opacity: 0, y: 40 }}

                animate={{ opacity: 1, y: 0 }}

                className="w-full max-w-5xl"

            >

                <div className="text-center mb-12">

                    <h1 className="text-5xl font-extrabold text-slate-900">

                        Choose Your Role

                    </h1>

                    <p className="mt-4 text-slate-500 text-lg">

                        Continue as a Driver or Customer

                    </p>

                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Driver */}

                    <motion.div

                        whileHover={{
                            y: -8,
                            scale: 1.02,
                        }}

                        whileTap={{
                            scale: .98,
                        }}

                        onClick={() =>
                            navigate(`/driver/${mode}`)
                        }

                        className="cursor-pointer bg-white rounded-3xl shadow-xl border border-slate-100 p-10"

                    >

                        <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center">

                            <Truck

                                size={40}

                                className="text-orange-500"

                            />

                        </div>

                        <h2 className="mt-8 text-3xl font-bold">

                            Driver

                        </h2>

                        <p className="mt-3 text-slate-500">

                            Returning with an empty truck?
                            Find nearby loads and earn more.

                        </p>

                    </motion.div>

                    {/* Customer */}

                    <motion.div

                        whileHover={{
                            y: -8,
                            scale: 1.02,
                        }}

                        whileTap={{
                            scale: .98,
                        }}

                        onClick={() =>
                            navigate(`/customer/${mode}`)
                        }

                        className="cursor-pointer bg-white rounded-3xl shadow-xl border border-slate-100 p-10"

                    >

                        <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center">

                            <Package

                                size={40}

                                className="text-blue-600"

                            />

                        </div>

                        <h2 className="mt-8 text-3xl font-bold">

                            Customer

                        </h2>

                        <p className="mt-3 text-slate-500">

                            Need transportation?
                            Book verified drivers instantly.

                        </p>

                    </motion.div>

                </div>

            </motion.div>

        </div>

    );

}