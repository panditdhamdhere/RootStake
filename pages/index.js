import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

// INTERNAL IMPORTS
import {
  Header,
  HeroSection,
  Footer,
  Pools,
  PoolsModel,
  WithdrawModal,
  Withdraw,
  Statistics,
  Token,
  Loader,
  Notification,
  ICOSale,
  Contact,
  Ask,
} from "../Components/index";

import {
  contractData,
  deposit,
  withdraw,
  claimReward,
  addTokenToMetamask,
} from "../Context/index";

const index = () => {
  const { address } = useAccount();
  const [loader, setLoader] = useState(false);
  const [contactUs, setContactUs] = useState(false);
  const [poolID, setPoolID] = useState();
  const [withdrawPoolID, setWithdrawPoolID] = useState();

  const [poolDetails, setPoolDetails] = useState();
  const [selectedPool, setSelectedPool] = useState();
  const [selectedToken, setSelectedToken] = useState();

  const loadData = async () => {
    if (address) {
      setLoader(true);
      const data = await contractData(address);
      console.log(data);
      setPoolDetails(data);

      setLoader(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="body-backgroundColor">
      <Header />
      <HeroSection
        poolDetails={poolDetails}
        addTokenToMetamask={addTokenToMetamask}
      />

      <Statistics poolDetails={poolDetails} />
      <Pools
        setPoolID={setPoolID}
        poolDetails={poolDetails}
        setSelectedPool={setSelectedPool}
        setSelectedToken={setSelectedToken}
      />
      <Token poolDetails={poolDetails} />
      <Withdraw
        setWithdrawPoolID={setWithdrawPoolID}
        poolDetails={poolDetails}
      />
      <Notification poolDetails={poolDetails} />
     
      <Ask />
      <Footer setContactUs={setContactUs} />

      {/* MODAL  */}
      <PoolsModel
        deposit={deposit}
        poolID={poolID}
        address={address}
        selectedPool={selectedPool}
        selectedToken={selectedToken}
        setLoader={setLoader}
      />

      {/* // WITHDRAW MODAL */}

      <WithdrawModal
        withdraw={withdraw}
        withdrawPoolID={withdrawPoolID}
        address={address}
        setLoader={setLoader}
        claimReward={claimReward}
      />

      <ICOSale setLoader={setLoader} />

      {contactUs && <Contact setContactUs={setContactUs} />}
      {loader && <Loader />}
    </div>
  );
};

export default index;
