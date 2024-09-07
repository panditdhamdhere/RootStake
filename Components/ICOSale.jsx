import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

// INTERNAL
import { IoMdClose } from "./ReactICON";
import { LoadTokenICO } from "../Context/constants";
import { buyToken } from "../Context/index";

const Currency = process.env.NEXT_PUBLIC_CURRENCY;

const ICOSale = ({ setLoader }) => {
  const { address } = useAccount();

  const [tokenDetails, setTokenDetails] = useState();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    const loadToken = async () => {
      const token = await LoadTokenICO();
      setTokenDetails(token);
      console.log(token);
    };
    loadToken();
  }, [address]);

  const callingFunctionBuyToken = async (quantity) => {
    setLoader(true);
    console.log(quantity);
    const receipt = await buyToken(quantity);

    if (receipt) {
      console.log(receipt);
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  return (
    <div
      className="modal modal--auto fade"
      id="modal-deposit1"
      tabIndex={-1}
      aria-labelledby="modal-deposit1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal__content">
            <button
              className="modal__close"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i className="ti ti-tx">
                <IoMdClose />
              </i>
            </button>
            <h4 className="modal__title">
              {tokenDetails?.token.symbol} ICO Token
            </h4>
            <p className="modal__text">
              Participate in the <span>Ongoing ICO Token</span> sell
            </p>

            <div className="modal__form">
              <div className="form__group">
                <label className="form__label">
                  ICO Supply:{" "}
                  {`${tokenDetails?.tokenBalance} ${tokenDetails?.token.symbol}`}
                </label>
                <input
                  type="text"
                  className="form__input"
                  placeholder={`${
                    tokenDetails?.token.symbol
                  }${tokenDetails?.token.balance.toString().slice(0, 12)}`}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="form__group">
                <label className="form__label">Pay Amount</label>
                <input
                  type="text"
                  className="form__input"
                  placeholder={`${
                    Number(tokenDetails?.tokenPrice) * quantity
                  }  ${Currency}`}
                  disabled
                />
              </div>

              <button
                className="form__btn"
                type="button"
                onClick={callingFunctionBuyToken(quantity)}
              >
                Buy {`${tokenDetails?.token.symbol}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICOSale;
