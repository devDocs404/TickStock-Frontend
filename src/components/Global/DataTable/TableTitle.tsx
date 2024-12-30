const TableTitle = ({ title }: { title?: string }) => {
  if (!title) return null
  return <div className="text-2xl font-bold m-0 p-0">{title}</div>
}

export default TableTitle
