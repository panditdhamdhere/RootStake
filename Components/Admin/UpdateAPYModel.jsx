import React, { useState } from "react";

import { IoMdClose } from "../ReactICON";

const UpdateAPYModel = ({ setLoader, modifyPool, modifyPoolId }) => {
  const [amount, setAmount] = useState();

  const callingFunctionModifyPool = async (modifyPoolId, amount) => {
    setLoader(true);
    console.log(modifyPoolId, amount);

    const receipt = await modifyPool(modifyPoolId, amount);

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
      id="modal-apool"
      tabIndex={-1}
      aria-labelledby="modal-apool"
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
            <h4 className="modal__title">Invest</h4>
            <p className="modal__text">
              Update staking pool #00-{modifyPoolId}APY $
            </p>
            <div className="modal__form">
              <label htmlFor="amount2" className="form__label">
                Enter Amount
              </label>
              <input
                type="text"
                id="amount2"
                name="amount2"
                className="apool__input"
                style={{
                  backgroundColor: "transparent",
                }}
                placeholder="Amount in %"
                onChange={(e) => setAmount(e.target.value)}
              />

              <button
                onClick={() => callingFunctionModifyPool(modifyPoolId, amount)}
                className="form__btn"
                type="button"
              >
                Update APY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAPYModel;
