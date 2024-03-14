import React from "react";
import "./SingleDataBox.css";

export default function SingleDataGroup({
  dataName,
  dataValue,
  bgType = "transparent",
}: {
  dataName: string;
  dataValue: string | React.ReactNode;
  bgType?: "transparent" | "solid";
}) {
  console.log("bgType", bgType);

  return (
    <div className={"data-container " + bgType}>
      <h3 className="data">{dataName}</h3>
      <p className="data-value">{dataValue}</p>
    </div>
  );
}
