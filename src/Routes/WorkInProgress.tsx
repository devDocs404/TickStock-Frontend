const WorkInProgress = () => {
  return (
    <div className="w-full h-[96vh] p-5 bg-[#f7f9fb] pl-[120px] overflow-y-auto">
      <div className="flex justify-center items-center h-[96vh] text-center">
        <div className="p-8 rounded-lg shadow-md">
          <h1 className="text-2xl text-[#333]">🚧 Work in Progress 🚧</h1>
          <p className="mt-4 text-lg text-[#666]">
            This feature is currently under development. Please check back
            later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkInProgress;
