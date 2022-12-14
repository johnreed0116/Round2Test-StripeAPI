import styles from "styles/BasketSidebar.module.scss";
import emptyCardImg from "images/empty_cart.svg";
import GetIcon from "components/GetIcon";
import Title from "components/Title";
import clsx from "clsx";
import BasketItem from "components/BasketItem";
import { BasketContext } from "context/BasketContext";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const STRIPE_API = `http://localhost:4242/create-checkout-session`;

const BasketSidebar = () => {
  const {
    basketIsOpen,
    setBasketIsOpen,
    basketItems,
    basketTotal: _basketTotal,
  } = useContext(BasketContext);
  const container = useRef();
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);
  const handleCheckOut = async () => {
    // create-checkout-session
    try {
      const link = await axios.post(STRIPE_API, { price: _basketTotal });
      window.location.href = link.data.link;
    } catch (error) {
      console.error("Checkout Error: ", error);
      alert("Error");
    }
  };

  return (
    <div
      className={clsx(
        styles.sidebarContainer,
        basketIsOpen ? styles.show : styles.hide
      )}
      ref={container}
      onClick={(event) =>
        event.target === container.current && setBasketIsOpen(false)
      }
    >
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Title txt="your basket" size={20} transform="uppercase" />
            {<small>your basket has got {basketItems.length} items</small>}
          </div>
          <button
            className={styles.close}
            onClick={() => setBasketIsOpen(false)}
          >
            <GetIcon icon="BsX" size={30} />
          </button>
        </div>
        {basketItems.length > 0 ? (
          <>
            <div className={styles.items}>
              {basketItems?.map((item, key) => (
                <BasketItem data={item} key={key} />
              ))}
            </div>
            <div className={styles.basketTotal}>
              <div className={styles.total}>
                <Title txt="basket summary" size={23} transform="uppercase" />
                <GetIcon icon="BsFillCartCheckFill" size={25} />
              </div>
              <div className={styles.totalPrice}>
                <small>total USD</small>
                <div className={styles.price}>
                  <span>{_basketTotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.confirmBtn}
                onClick={handleCheckOut}
              >
                Confirm the basket
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyBasket}>
            <img src={emptyCardImg} alt="" />
            <Title txt="your basket is empty" size={23} transform="uppercase" />
          </div>
        )}
      </div>
      {message ? <div>{message}</div> : ""}
    </div>
  );
};

export default BasketSidebar;
