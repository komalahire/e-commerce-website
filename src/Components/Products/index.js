import { useEffect, useState } from "react";
import { addToCart, getAllProducts, getProductByCategory } from "../../API";
import { useParams } from "react-router-dom";

import {
  Card,
  List,
  Image,
  Typography,
  Badge,
  Rate,
  Button,
  message,
  Spin,
} from "antd";

function Products() {
  const [loading, setLoading] = useState(false);
  const param = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    (param?.categoryId
      ? getProductByCategory(param.categoryId)
      : getAllProducts()
    ).then((res) => {
      setItems(res.products);
      setLoading(false);
    });
  }, [param]);
  if (loading) {
    return <Spin spinning />;
  }
  return (
    <div>
      <List
        grid={{ column: 3 }}
        renderItem={(product, index) => {
          return (
            <Badge.Ribbon
              className="itemCardBadge"
              text={product.discountPercentage}
              color="pink">
              <Card
                className="itemCard"
                title={product.title}
                key={index}
                cover={
                  <Image className="itemCardImage" src={product.thumbnail} />
                }
                actions={[
                  <Rate allowHalf disabled value={product.rating} />,
                  <AddToCartButton item={product} />,
                ]}>
                <Card.Meta
                  title={
                    <Typography.Paragraph>
                      {" "}
                      Price: ${product.price} {""}
                      <Typography.Text delete type="danger">
                        $
                        {parseFloat(
                          product.price +
                            (product.price * product.discountPercentage) / 100
                        ).toFixed(2)}
                      </Typography.Text>
                    </Typography.Paragraph>
                  }
                  description={
                    <Typography.Paragraph
                      ellipsis={{ rows: 2, expandable: true, symbol: "more" }}>
                      {product.description}
                    </Typography.Paragraph>
                  }></Card.Meta>
              </Card>
            </Badge.Ribbon>
          );
        }}
        dataSource={items}></List>
    </div>
  );
}

function AddToCartButton({ item }) {
  const [loading, setLoading] = useState(false);
  const addProductToCart = () => {
    setLoading(true);
    addToCart(item.id).then((res) => {
      message.success(`${item.title}  had been added to cart`);
      setLoading(false);
    });
  };
  return (
    <Button
      type="link "
      onClick={() => {
        addProductToCart();
      }}
      loading={loading}>
      {" "}
      Add to cart
    </Button>
  );
}
export default Products;
