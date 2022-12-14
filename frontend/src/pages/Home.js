import styles from "styles/Home.module.scss";
import Card from "components/Card";
import Title from "components/Title";
import useMakeRequest from "hooks/useMakeRequest";
import { useRef, useState } from "react";

const stringSimilarity = (
  str1,
  str2,
  substringLength = 2,
  caseSensitive = false
) => {
  if (str1.length < substringLength || str2.length < substringLength) return 0;
  str1 = String(str1).toLowerCase();
  str2 = String(str2).toLowerCase();
  const map = new Map();
  for (let i = 0; i < str1.length - (substringLength - 1); i++) {
    const substr1 = str1.substr(i, substringLength);
    map.set(substr1, map.has(substr1) ? map.get(substr1) + 1 : 1);
  }
  let match = 0;
  for (let j = 0; j < str2.length - (substringLength - 1); j++) {
    const substr2 = str2.substr(j, substringLength);
    const count = map.has(substr2) ? map.get(substr2) : 0;
    if (count > 0) {
      map.set(substr2, count - 1);
      match++;
    }
  }

  return parseFloat(
    (match * 2) / (str1.length + str2.length - (substringLength - 1) * 2)
  );
};

const Home = () => {
  const result = useMakeRequest("https://fakestoreapi.com/products/");
  const searchRef = useRef();
  const [searchResult, setResult] = useState(new Array());
  const handleSearchChange = () => {
    const res = new Array();
    const searchTxt = searchRef.current.value;
    for (let i = 0; i < result.data.length; i++) {
      let similarity = stringSimilarity(
        searchTxt,
        result.data[i].title,
        2,
        false
      );
      console.log(similarity);
      if (similarity > 0.3) {
        res.push(result.data[i]);
      }
    }
    setResult(res);
    for (let i = 0; i < searchResult.length; i++)
      console.log(searchResult[i].title, searchResult.length);
  };
  if (!result.data) {
    if (result.error) {
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <Title txt={result.error} size={25} transform="uppercase" />
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <Title txt="Loading..." size={25} transform="uppercase" />
        </div>
      );
    }
  } else {
    return (
      <section className={styles.home}>
        <div className={styles.container}>
          <div className={styles.row}>
            {result.data && (
              <div className={styles.title}>
                <Title
                  txt="all products"
                  color="#171717"
                  size={22}
                  transform="uppercase"
                />
              </div>
            )}
          </div>
          <div className={styles.row + "justify-center"}>
            <input
              type="edit"
              style={{ border: "1px solid black" }}
              onKeyUp={(e) => {
                if (e.key === "Enter") handleSearchChange();
              }}
              ref={searchRef}
              placeholder="Search your favorite"
            />
          </div>
          {searchResult?.length <= 0 ? (
            <div className={styles.row}>
              {result.data ? (
                result.data.map((product, key) => (
                  <Card product={product} key={key} />
                ))
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Title txt={result.error} size={25} transform="uppercase" />
                </div>
              )}
            </div>
          ) : (
            searchResult.map((product, key) => (
              <Card product={product} key={key} />
            ))
          )}
        </div>
      </section>
    );
  }
};

export default Home;
