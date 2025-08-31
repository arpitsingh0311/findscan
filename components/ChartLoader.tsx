"use client"; 

import dynamic from "next/dynamic";

const ChartComponentWithNoSSR = dynamic(
  () => import("@/components/Chart"), 
  { ssr: false }
);

const ChartLoader = () => {
  return <ChartComponentWithNoSSR />;
};

export default ChartLoader;
