import React, { useState } from "react";
import { IoMdClose } from "./ReactICON";
import PopUpInputField from "./Admin/RegularComp/PopUpInputField";
import PupUpButton from "./Admin/RegularComp/PupUpButton";

const WithdrawModal = ({
  withdraw,
  withdrawPoolID,
  address,
  setLoader,
  claimReward,
}) => {
  const [amount, setAmount] = useState();

  const callingFunction = async (withdrawPoolID, amount, address) => {
    setLoader(true);

    const receipt = await withdraw(withdrawPoolID, amount, address);

    if (receipt) {
      setLoader(false);
      window.location.reload();
    }
    setLoader(false);
  };

  // claim fun
  const callingclaimFunction = async (withdrawPoolID) => {
    setLoader(true);

    const receipt = await claimReward(withdrawPoolID);

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
      id="modal-node"
      tabIndex={-1}
      aria-labelledby="modal-node"
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
            <h4 className="modal__title">withdraw tokens</h4>
            <p className="modal__text">Withdraw your tokens</p>
            <div className="modal__form">
              <PopUpInputField
                title={`Amount`}
                placeholder="Amount"
                handleChange={(e) => setAmount(e.target.value)}
              />

              <PupUpButton
                title={"Withdraw"}
                handleClick={() =>
                  callingFunction(withdrawPoolID, amount, address)
                }
              />

              <PupUpButton
                title={"Claim Reward"}
                handleClick={() => callingclaimFunction(withdrawPoolID)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
