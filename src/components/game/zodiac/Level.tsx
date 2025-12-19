import Footer from "@/components/Footer";

export default function Level() {
    return (
        <>
            <div className='flex flex-col items-center md:py-10' >
                <div className='bg-stone-100 md:px-3 md:py-3 md:w-1/5 md:rounded-4xl shadow-xl/30 flex flex-row justify-between flex flex-row items-center justify-center md:space-x-2'>
                    <div className="flex items-center justify-center md:size-10 rounded-full shadow-xl/20 border-4 border-white bg-gradient-to-r from-orange-300 via-yellow-500 to-orange-400">
                        <img
                            className="md:size-7"
                            src="https://img.icons8.com/?size=160&id=7uJob2d9mFBS&format=png"
                            alt="avata"
                        />
                    </div>
                    <div className='text-black'>Xin chào {}player</div>
                </div>
                <div className='flex flex-col items-center md:w-3/5 md:my-10 '>
                    <div>
                        Cốt truyện
                    </div>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </div>
                </div>
                <div className='flex flex-row items-center md:my-10'>
                    <a className='flex flex-col items-center hover:scale-105 transition-transform'
                        href="/stage">
                        <div className='relative flex flex-col items-center'>
                            <div className='flex flex-row'>
                                <img
                                    className="md:size-40"
                                    src="https://img.icons8.com/?size=160&id=ghfcv0lVxPzM&format=png"
                                />
                            </div>
                            <div >Stage 1</div>
                            <img
                                className="md:size-20 animate-bounce absolute bottom-0 right-0 rotate-30"
                                src="https://img.icons8.com/?size=96&id=80819&format=png"
                            />
                        </div>
                        <div className='flex flex-row animate-pulse'>
                            <img 
                                src="https://img.icons8.com/?size=160&id=4IZ8RiC9K8go&format=png"
                                className='md:size-10'
                            />
                            <img 
                                src="https://img.icons8.com/?size=160&id=4IZ8RiC9K8go&format=png"
                                className='md:size-10'
                            />
                            <img 
                                src="https://img.icons8.com/?size=160&id=4IZ8RiC9K8go&format=png"
                                className='md:size-10'
                            />
                        </div>
                    </a>
                    <div className=''>
                        <img
                            className="md:w-50 rotate-x-180"
                            src="/line1.png"
                        />
                        
                    </div>
                    <a className='flex flex-col items-center hover:scale-105 transition-transform'
                        href="/stage">
                        <div className='relative flex flex-col items-center'>
                            <div className='flex flex-row'>
                                <img
                                    className="md:size-40"
                                    src="https://img.icons8.com/?size=160&id=CWiIMuMrNSjE&format=png"

                                />
                            </div>
                            <div >Stage 2</div>
                            
                        </div>
                        <div className='flex flex-row animate-pulse'>
                            <img 
                                src="https://img.icons8.com/?size=160&id=4IZ8RiC9K8go&format=png"
                                className='md:size-10'
                            />
                            <img 
                                src="https://img.icons8.com/?size=160&id=4IZ8RiC9K8go&format=png"
                                className='md:size-10'
                            />
                            
                        </div>
                    </a>
                    <div className=''>
                        <img
                            className="md:w-50"
                            src="/line1.png"
                        />
                    </div>
                    <a className='flex flex-col items-center hover:scale-105 transition-transform'
                        href="/stage">
                        <div className='relative flex flex-col items-center'>
                            <div className='flex flex-row'>
                                <img
                                    className="md:size-40 blur-xs"
                                    src="https://img.icons8.com/?size=160&id=zMJ8Fagh9-oE&format=png"

                                />
                            </div>
                            <div >Stage 3</div>
                            <img
                                className="absolute"
                                src="https://img.icons8.com/?size=160&id=112162&format=png"
                            />
                        </div>
                        <div className='flex flex-row animate-pulse'>
                            <img 
                                src="https://img.icons8.com/?size=160&id=4IZ8RiC9K8go&format=png"
                                className='md:size-10'
                            />
                        </div>
                    </a>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}