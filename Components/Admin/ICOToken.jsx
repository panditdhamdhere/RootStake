import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";

import { LoadTokenICO } from "../../Context/constants";
import {
  updateToken,
  updateTokenPrice,
  tokenWithdraw,
} from "../../Context/index";

const Currency = process.env.NEXT_PUBLIC_CURRENCY;

import ButtonCmp from "./RegularComp/ButtonCmp";
import InputField from "./RegularComp/InputField";
import ClickButton from "./RegularComp/ClickButton";
import Title from "./RegularComp/Title";

const ICOToken = ({ setLoader }) => {
  const { address } = useAccount();

  const [tokenDetails, setTokenDetails] = useState();
  const [updateTokens, setUpdateTokens] = useState();
  const [updatePrice, setUpdatePrice] = useState();

  useEffect(() => {
    const loadToken = async () => {
      const token = await LoadTokenICO();
      setTokenDetails(token);
      console.log(token);
    };
    loadToken();
  }, [address]);

  const callingFunctionUpdateToken = async (updateToken) => {
    setLoader(true);
    console.log(updateToken);

    const receipt = await updateToken(updateToken);

    if (receipt) {
      console.log(receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };
  const callingFunctionUpdatePrice = async (updatePrice) => {
    setLoader(true);
    console.log(updatePrice);

    const receipt = await updateTokenPrice(updatePrice);

    if (receipt) {
      console.log(receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  const callingFunctionTokenWithdraw = async () => {
    setLoader(true);

    const receipt = await tokenWithdraw();

    if (receipt) {
      console.log(receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  return (
    <div className="tab-pane fade" id="tab-6" role="tabpanel">
      <div className="row">
        <div className="col-12">
          <div className="profile">
            <ul
              className="nav nav-tabs section__tabs section__tabs--left"
              id="section__profile-tabs2"
              role="tablist"
            >
              <ButtonCmp name={"Update Token"} tab={"f9"} styleClass="active" />
              <ButtonCmp name={"Update Token Price"} tab={"f10"} />
              <ButtonCmp name={"Withdraw Token"} tab={"f11"} />
            </ul>

            <div className="tab-content">
              {/* 1 */}
              <div
                className="tab-pane fade show active"
                id="tab-f9"
                role="tabpanel"
              >
                <div className="row">
                  <Title title={"Update Token Address In ICO Contract"} />
                  <InputField
                    size={"12"}
                    type={"text"}
                    title={"Address"}
                    name={"crypto"}
                    placeholder={`${tokenDetails?.token.symbol} ${tokenDetails?.token.name}`}
                    handleChange={(e) => setUpdateTokens(e.target.value)}
                  />

                  <ClickButton
                    name={"Update Token"}
                    handleClick={() => callingFunctionUpdateToken(updateToken)}
                  />
                </div>
              </div>
              {/* 2 */}
              <div className="tab-pane fade" id="tab-f10" role="tabpanel">
                <div className="row">
                  <Title title={"Update Token Price In ICO Contract"} />
                  <InputField
                    size={"12"}
                    type={"text"}
                    title={"Price"}
                    name={"price1"}
                    placeholder={`${tokenDetails?.tokenPrice} ${Currency}`}
                    handleChange={(e) => setUpdatePrice(e.target.value)}
                  />

                  <ClickButton
                    name={"Update Price"}
                    handleClick={() => callingFunctionUpdatePrice(updatePrice)}
                  />
                </div>
              </div>

              {/* 3 */}
              <div className="tab-pane fade" id="tab-f11" role="tabpanel">
                <div className="row">
                  <Title title={"Withdraw tokens from ICO Contract"} />

                  <ClickButton
                    name={"Withdraw all tokens"}
                    handleClick={() => callingFunctionTokenWithdraw()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICOToken;
