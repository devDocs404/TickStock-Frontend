import "./Components.css";

const Loading = () => {
  return (
    <div className="flex justify-center items-center absolute w-full h-full bg-blue-500 z-30 opacity-30">
      <span className="loader backdrop-opacity-70 absolute"></span>
    </div>
  );
};

export default Loading;
