import { useContext } from "react";
import { Grid } from "@material-ui/core";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Product from "../models/Product";
import db from "../utils/db";
import { Store } from "../utils/Store";
import axios from "axios";
import ProductItem from "../components/ProductItem";

export default function Home({ products }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const addToCartHandler = async (product) => {
    const existedItem = state.cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = existedItem ? existedItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  await db.connect();
  const products = await Product.find({}, "-reviews").lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObject),
    },
  };
};
