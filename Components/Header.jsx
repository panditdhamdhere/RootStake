import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

// INTERNAL IMPORTS
import { MdGeneratingTokens } from "../Components/ReactICON/index";

const Header = ({ page }) => {
  const [tokenBalanceComponent, setTokenBalanceComponent] = useState();

  const navigation = [
    {
      name: "Home",
      link: "#home",
    },
    {
      name: "Staking",
      link: "#staking",
    },
    {
      name: "Crypto",
      link: "#crypto",
    },
    {
      name: "Partners",
      link: "#partners",
    },
  ];

  return (
    <header
      style={{
        backgroundColor: "#17142a",
      }}
      className="header"
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="header__content">
              <button
                className="header__btn"
                type="button"
                aria-label="header__nav"
              >
                <span />
                <span />
                <span />
              </button>

              <a href="/" className="header__logo">
                <img src="img/logo.svg" alt="logo" />
              </a>

              <span className="header__tagline">Root-Staking</span>

              <ul className="header__nav" id="header__nav">
                {navigation.map((item, index) => (
                  <li key={index}>
                    <a
                      href={
                        page == "activity"
                          ? "/"
                          : page == "admin"
                          ? "/"
                          : `${item.link}`
                      }
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              <ConnectButton key={useAccount} />
              <a
                style={{
                  marginLeft: "10px",
                }}
                data-bs-target="#modal-deposit1"
                type="button"
                data-bs-toggle="modal"
                className="header__profile"
              >
                <i className="ti ti-user-circle">
                  <MdGeneratingTokens />
                </i>

                <span className="">Token ICO</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
