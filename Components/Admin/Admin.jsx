import React from "react";

// INTERNAL IMPORT
import AdminNav from "../Admin/AdminNav";
import AdminCard from "../Admin/AdminCard";
import Token from "../Admin/Token";
import Investing from "../Admin/Investing";
import Transfer from "../Admin/Transfer";
import Pool from "../Admin/Pool";
import Staking from "../Admin/Staking";
import ICOToken from "../Admin/ICOToken";

const Admin = ({
  poolDetails,
  transferToken,
  address,
  setLoader,
  createPool,
  sweep,
  setModifyPoolId,
}) => {
  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <AdminNav />

          <div className="col-12 col-lg-9">
            <div className="tab-content">
              <div
                className="tab-pane fade show active"
                id="tab-1"
                role="tabpanel"
              >
                <div className="row">
                  {poolDetails?.poolInfoArray.map((pool, index) => (
                    <AdminCard
                      key={index}
                      name={`Curreny APY:${pool.apy} %`}
                      value={`${pool.depositedAmount} ${pool.depositToken.symbol}`}
                    />
                  ))}

                  <AdminCard
                    name={`Token Stake`}
                    value={`${poolDetails?.totalDepositAmount || "0"} ${
                      poolDetails?.depositToken.symbol
                    }`}
                  />

                  <AdminCard
                    name={`Your Balance`}
                    value={`${poolDetails?.depositeToken.balance.slice(0, 8)} ${
                      poolDetails?.depositToken.symbol
                    }`}
                  />

                  <AdminCard
                    name={`Available Supply`}
                    value={`${poolDetails?.contractTokenBalance
                      .toString()
                      .slice(0, 8)} ${poolDetails?.depositToken.symbol}`}
                  />

                  <Token token={poolDetails?.depositToken} />
                </div>
              </div>

              <Investing poolDetails={poolDetails} />
              <Staking
                poolDetails={poolDetails}
                sweep={sweep}
                setLoader={setLoader}
              />
              <Transfer
                poolDetails={poolDetails}
                transferToken={transferToken}
                setLoader={setLoader}
                address={address}
              />
              <Pool
                poolDetails={poolDetails}
                createPool={createPool}
                setLoader={setLoader}
                setModifyPoolId={setModifyPoolId}
              />
              <ICOToken setLoader={setLoader} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
