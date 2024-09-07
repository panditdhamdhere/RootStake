import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";

// INTERNAL IMPORTs
import {
  Header,
  Footer,
  Loader,
  ICOSale,
  Statistics,
  Notification,
} from "../Components/index";
import { contractData } from "../Context/index";

const activities = () => {
  const { address } = useAccount();

  const [loader, setLoader] = useState(false);
  const [poolDetails, setPoolDetails] = useState();

  const loadData = async () => {
    if (address) {
      setLoader(true);

      const data = await contractData(address);

      setPoolDetails(data);

      setLoader(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [address]);

  return (
    <div  className="body-backgroundColor">
      <Header page={"activity"} />
      <div className="new-margin"> </div>
      <Statistics poolDetails={poolDetails} />
      <Notification page={"activity"} poolDetails={poolDetails} />
      <Footer />
      <ICOSale setLoader={setLoader} />
      {loader && <Loader />}
    </div>
  );
};

export default activities;
