import Image from "next/image";
import React from "react";

import { formatNumber } from "@/lib/utils";
interface Props {
  totalAnswers: number;
  totalQuestions: number;
  badges: BadgeCounts;
}
interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;
  reputationPoints: number;
}
const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => (
  <div className="light-border background-light900_dark300 flex  flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
    <Image src={imgUrl} alt={title} width={40} height={50}></Image>
    <div>
      <p className="paragraph-semibold text-dark200_light900">{value}</p>
      <p className="body-medium text-dark300_light700">{title}</p>
    </div>
  </div>
);

const Stats = ({
  totalAnswers,
  totalQuestions,
  badges,
  reputationPoints,
}: Props) => {
  return (
    <div className="mt-3">
      <h4 className="h3-semibold text-dark200_light900">Stats </h4>
      <span className="small-semibold primary-text-gradient">
        {formatNumber(reputationPoints)}
      </span>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex  flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark200_light900">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark200_light900">Answers</p>
          </div>
        </div>
        <StatsCard
          imgUrl="/icons/gold-medal.svg"
          title="Gold Badges"
          value={badges.GOLD}
        />
        <StatsCard
          imgUrl="/icons/silver-medal.svg"
          title="Silver Badges"
          value={badges.SILVER}
        />
        <StatsCard
          imgUrl="/icons/bronze-medal.svg"
          title="Bronze Badges"
          value={badges.BRONZE}
        />
      </div>
    </div>
  );
};

export default Stats;
