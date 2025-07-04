import React from "react";

type Detail = { label: string; value: React.ReactNode };

export function DetailGrid({ details }: { details: Detail[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
      {details.map((item, idx) => (
        <React.Fragment key={item.label + idx}>
          <div className="text-sm leading-none font-medium">{item.label}</div>
          <div className="text-muted-foreground text-sm">{item.value}</div>
        </React.Fragment>
      ))}
    </div>
  );
}
