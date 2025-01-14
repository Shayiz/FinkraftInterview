import express, {
  Application,
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import { StatusCodes } from "http-status-codes";
import type { CreateBooking, CreateVendor } from "./types";
import { createVendor, getListOfVendor } from "./module/vendor-module";
import {
  createBooking,
  deleteBookingById,
  getBookingById,
  getListOfBookinhg,
} from "./module/booking-module";
const app: Application = express();

// Logging
if (process.env.SQL_DIALECT !== "sqlite") {
  app.use(morgan("common"));
}

// Parsing JSON Requests
app.use(express.json());
const swaggerDocument = yaml.load("./apidoc/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .send(
      'Welcome to Users API. Documentation is available <a href="./api-docs/">here</a>.'
    );
});

// creating the vendor
app.post<{}, any, CreateVendor>(
  "/vendor/create-vendor",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      res.status(StatusCodes.OK).send(await createVendor(data));
    } catch (err) {
      next(err);
    }
  }
);

// get the vendors
app.get<{}, any, any>(
  "/vendor/get-vendor",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getListOfVendor());
    } catch (err) {
      next(err);
    }
  }
);

app.post<{}, any, CreateBooking>(
  "/booking/create-booking",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      res.status(StatusCodes.OK).send(await createBooking(data));
    } catch (err) {
      next(err);
    }
  }
);

app.get<{}, any, any>(
  "/booking/get-booking",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, vendor } = req.query;
      res
        .status(StatusCodes.OK)
        .send(await getListOfBookinhg(date as string, vendor as string));
    } catch (err) {
      next(err);
    }
  }
);

app.get<{}, any, any>(
  "/booking/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingId = req.params.id;
      const result = await getBookingById(bookingId);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
);

app.delete<{}, any, any>(
  "/booking/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookingId = req.params.id;
      const result = await deleteBookingById(bookingId);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
);

const errorRequestHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.log(`Error with route ${req.url} : ${err.message}`);
  console.log(err);
  if (err instanceof APIError) {
    res.status(err.statusCode).send({ message: err.message, code: err.code });
  } else {
    res.status(400).send({ message: err.message, code: "ERROR_CODE" });
  }
};

app.use(errorRequestHandler);
export class APIError extends Error {
  public code: string;

  public statusCode: number;

  constructor(
    message: string,
    code: string = "ERROR_CODE",
    statusCode: number = 400
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export default app;