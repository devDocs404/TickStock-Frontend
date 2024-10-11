import {
  ArrowUpRight,
  Briefcase,
  IndianRupee,
  PieChartIcon,
  Wallet,
} from "lucide-react";
import { MetricCard } from "./Components/MetricCard";
import { PortfolioGraph } from "./Components/PortfolioGraph";
import { OverviewSection } from "./Components/OverviewCard";
import { useFetchPropertyTransactions } from "../../Queries/TestHook";
import { useEffect } from "react";

const Dashboard = ({ isDark }: { isDark: boolean }) => {
  const { data, error, isLoading } = useFetchPropertyTransactions({
    endpoint: "auth/users",
    type: "get",
    queryKey: "loginTest",
  });

  useEffect(() => {
    console.log(data, "dataljalfdlasj");
    console.log(error, "error");
    console.log(isLoading, "isLoading");
  }, [data, error, isLoading]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-[20px] ">
        <MetricCard
          title="Total Assets"
          value={
            <>
              <span style={{ display: "flex" }}>
                <IndianRupee />
                <span>1.2M</span>
              </span>
            </>
          }
          color="text-blue-500"
          icon={PieChartIcon}
          isDark={isDark}
        />

        <MetricCard
          title="Total Invested"
          value="+5%"
          color="text-green-500"
          icon={ArrowUpRight}
          isDark={isDark}
        />
        <MetricCard
          title="Gain/Loss"
          value="$3K"
          color="text-red-500"
          icon={Wallet}
          isDark={isDark}
        />
        <MetricCard
          title="Short Term Return"
          value="$500K"
          color="text-yellow-500"
          icon={Briefcase}
          isDark={isDark}
        />
        <MetricCard
          title="Long Term Return"
          value="$500K"
          color="text-yellow-500"
          icon={Briefcase}
          isDark={isDark}
        />
      </div>
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[calc(100% - 0)]">
          <h1>Hello</h1>
          <div className="">
            <PortfolioGraph isDark={isDark} />
          </div>
        </div>
        <div>
          <OverviewSection />
        </div>
      </div> */}

      <div className="flex justify-between h-[400px] p-4">
        <div
          className={`p-6 w-[65%] h-full rounded-lg ${
            isDark ? "bg-[#212121]" : "bg-[#F4F5FB]"
          }`}
        >
          <h1 className="text-4xl font-medium">Portfolio Graph</h1>
          <div className="h-full py-5">
            <PortfolioGraph isDark={isDark} />
          </div>
        </div>
        <div className="w-[25%]">
          <OverviewSection />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
