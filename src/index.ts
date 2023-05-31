import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;
const jsonParseMiddleware = express.json();
app.use(jsonParseMiddleware);

const HTTP_STATUS_CODES = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  OK: 200,
  NO_CONTENT: 204,
  CREATED: 201,
};

const products = [
  { id: 1, title: "Tomato" },
  { id: 2, title: "Cucumbers" },
];

// * GET requests

// URL params

app.get(
  "/products/:productId",
  (
    req: Request<{
      productId: string;
    }>,
    res: Response
  ) => {
    const currentProduct = products.find(
      (item) => item.id === +req.params.productId
    );

    if (!currentProduct) {
      res.status(HTTP_STATUS_CODES.NOT_FOUND);

      return;
    }

    res.status(HTTP_STATUS_CODES.OK).send(currentProduct);
  }
);

// QUERY params

app.get(
  "/products",
  (req: Request<{}, {}, {}, { title: string }>, res: Response) => {
    const title = req.query.title;

    if (!title) {
      return res.status(HTTP_STATUS_CODES.OK).send(products);
    }

    const currentProducts = products.filter((item) =>
      item.title.includes(req.query.title)
    );

    res.send(currentProducts);
  }
);

// * DELETE requests

app.delete("/products/:productId", (req: Request, res: Response) => {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === +req.params.productId) {
      products.splice(i, 1);
      return res.send(HTTP_STATUS_CODES.NO_CONTENT);
    }
  }

  return res.send(HTTP_STATUS_CODES.NOT_FOUND);
});

// * POST requests

app.post(
  "/products",
  (req: Request<{}, {}, { title: string }>, res: Response) => {
    const title = req.body.title;

    if (!title) {
      return res.send(HTTP_STATUS_CODES.BAD_REQUEST);
    }

    const newProduct = { id: +new Date(), title };
    products.push(newProduct);

    res.status(HTTP_STATUS_CODES.CREATED).json(newProduct);
  }
);

// * PUT requests

app.put(
  "/products/:productId",
  (
    req: Request<{ productId: string }, {}, { title: string }>,
    res: Response
  ) => {
    const title = req.body.title;
    const productId = +req.params.productId;

    const currentProduct = products.find((item) => item.id === productId);

    if (!title || !currentProduct) {
      return res.send(HTTP_STATUS_CODES.BAD_REQUEST);
    }

    currentProduct.title = title;

    res.status(HTTP_STATUS_CODES.OK).json(currentProduct);
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
