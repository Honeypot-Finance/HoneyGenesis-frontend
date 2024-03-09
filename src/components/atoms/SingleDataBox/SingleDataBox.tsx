import React from "react";
import "./SingleDataBox.css";

export default function SingleDataGroup({
  dataName,
  dataValue,
}: {
  dataName: string;
  dataValue: string | React.ReactNode;
}) {
  return (
    <div className="data-container">
      <h3 className="data">{dataName}</h3>
      <p className="data-value">{dataValue}</p>
    </div>
  );
}
