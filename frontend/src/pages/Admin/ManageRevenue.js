import React from "react";
import PrintButton from "../../components/Admin/revenue/PrintButton";
import Chart from "../../components/Admin/revenue/Chart";
// import  Card  from "../../components/Admin/revenue/Card";
import Expense from "../../components/Admin/revenue/Expense";

import {TitleTypography} from '../../components/StyledComponents';

const ManageRevenue = () => {
  return (
    <div className="flex flex-col min-h-screen">
          <TitleTypography>
        revenue management
      </TitleTypography>
        <div className="p-4 ml-16 flex justify-between">
          <PrintButton />
        </div>
        <div className="gap-2 mb-4 mx-20">
            <Chart />
        </div>
        <div className="gap-2 mx-[7%]">
            <Expense/>
        </div>
    </div>
  );
};

export default ManageRevenue
