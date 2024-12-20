const TableLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className=" tracking-widest mb-2">Loading</p>
      <div className="flex w-20 items-center justify-center">
        <div className="w-[15px] h-[4px] bg-lime-500 rounded-sm mx-1 animate-pulse"></div>
        <div className="w-[15px] h-[4px] bg-lime-500 rounded-sm mx-1 animate-pulse delay-200"></div>
        <div className="w-[15px] h-[4px] bg-lime-500 rounded-sm mx-1 animate-pulse delay-400"></div>
        <div className="w-[15px] h-[4px] bg-lime-500 rounded-sm mx-1 animate-pulse delay-600"></div>
      </div>
    </div>
  )
}

export default TableLoading
