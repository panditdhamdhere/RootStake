import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";

// INTERNAL IMPORTs
import { Header, Footer, Loader, ICOSale } from "../Components/index";
import Admin from "../Components/Admin/Admin";
import AdminHead from "../Components/Admin/AdminHead";
import UpdateAPYModel from "../Components/Admin/UpdateAPYModel";
import Auth from "../Components/Admin/Auth";

import {
  contractData,
  transferToken,
  createPool,
  sweep,
  modifyPool,
} from "../Context/index";

// console.log(contractData);

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

const admin = () => {
  const { address } = useAccount();

  const [loader, setLoader] = useState(false);
  const [checkAdmin, setCheckAdmin] = useState(true);
  const [poolDetails, setPoolDetails] = useState();
  const [modifyPoolId, setModifyPoolId] = useState();

  const loadData = async () => {
    if (address) {
      setLoader(true);

      if (address?.toLowerCase() == ADMIN_ADDRESS?.toLowerCase()) {
        setCheckAdmin(true);
        const data = await contractData(address);
        console.log(data);
        setPoolDetails(data);
      }
      

      setLoader(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="body-backgroundColor">
      <Header page={"admin"} />
      <AdminHead />
      <Admin
        poolDetails={poolDetails}
        transferToken={transferToken}
        address={address}
        setLoader={setLoader}
        createPool={createPool}
        sweep={sweep}
        setModifyPoolId={setModifyPoolId}
      />
      <Footer />

      <UpdateAPYModel
        setLoader={setLoader}
        modifyPool={modifyPool}
        modifyPoolId={modifyPoolId}
      />
      <ICOSale setLoader={setLoader} />

      {checkAdmin && <Auth />}
      {loader && <Loader />}
    </div>
  );
};

export default admin;
