import { Html } from "@react-three/drei";

const Loader = () => {
  return (
    <Html center>
      <div className='flex flex-col items-center justify-center p-5 bg-[#F5F5F0]/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#E7E7B7] min-w-[160px]'>
        <div className='w-12 h-12 border-4 border-[#E7E7B7] border-t-[#C97851] rounded-full animate-spin mb-3' />
        <p className='text-xs font-semibold text-[#263746] tracking-wide font-poppins'>
          Loading 3D Sanctuary...
        </p>
      </div>
    </Html>
  );
};

export default Loader;
