import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // Legend,
} from "recharts";

const data = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
];
const PortfolioGraph = ({
  isDark,
}: // data,
{
  isDark: boolean;
  // data: [{ name: string; value: number }];
}) => (
  <>
    {/* <div className="w-full h-[400px] "> */}
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? "#444" : "#e0e0e0"}
        />
        <XAxis dataKey="name" stroke={isDark ? "#ccc" : "#555"} />
        <YAxis stroke={isDark ? "#ccc" : "#555"} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke={isDark ? "#00C49F" : "#0088FE"}
        />
      </LineChart>
    </ResponsiveContainer>
    {/* </div> */}
  </>
);

export { PortfolioGraph };
