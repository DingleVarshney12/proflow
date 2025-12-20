const Loader = ({ text }: { text?: string }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center space-x-2">
      <div className="border-4 border-gray-200 border-t-blue-500 w-10 h-10 rounded-full animate-spin" />
      <div className="text-lg font-semibold">{text}</div>
    </div>
  );
};

export default Loader;
