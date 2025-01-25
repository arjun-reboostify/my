const Button = ({ label }: { label: string }) => {
  return (
    <button className="bg-[#FD6F00] text-white py-[16px] px-[18px] text-[16px] font-normal rounded-md">
      {label}
    </button>
  );
};

export default Button;
