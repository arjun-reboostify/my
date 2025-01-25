// const SectionHeader = ({
//   title,
//   subHeader,
// }: {
//   title: string;
//   subHeader: string;
// }) => {
//   return (
//     <div className="flex flex-col justify-center items-center gap-4 text-black dark:text-white text-center h-[200px] max-w-[800px] mx-auto">
//       <h1 className="font-semibold text-6xl">{title}</h1>
//       <h2 className="font-normal text-xl">{subHeader}</h2>
//     </div>
//   );
// };

// export default SectionHeader;
const SectionHeader = ({
  title,
  subHeader,
}: {
  title: string;
  subHeader: string;
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 text-black dark:text-white text-center h-[200px] max-w-[800px] mx-auto px-4">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl">{title}</h1>
      <h2 className="font-normal text-lg sm:text-xl">{subHeader}</h2>
    </div>
  );
};

export default SectionHeader;
