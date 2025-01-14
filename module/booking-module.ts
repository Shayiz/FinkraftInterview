import { Op } from "sequelize";
import { APIError } from "../app";
import { Booking } from "../models/booking";
import { Vendor } from "../models/vendor";
import {
  CreateBookingRequestValidation,
  CreateVendorRequestValidation,
} from "./validation";
import { StatusCodes } from "http-status-codes";

export async function createBooking(data) {
  try {
    const validatedData = await CreateBookingRequestValidation.validateAsync(
      data
    );
    const isVendorExist = await Vendor.findOne({
      where: { id: validatedData.vendorId },
    });
    if (!isVendorExist) {
      throw new APIError("Vendor with the given id does not exist");
    }
    const lastBookingId = await Booking.findOne({
      order: [["createdAt", "DESC"]],
    });

    const bookingId: number = lastBookingId
      ? parseInt(lastBookingId.bookingId) + 1
      : 0;
    const booking = await Booking.create({
      bookingId: bookingId.toString(),
      bookingDate: validatedData.bookingDate,
      customerName: validatedData.customerName,
      amount: validatedData.amount,
      vendorId: validatedData.vendorId,
    });
    if (booking) {
      return { status: "Success", data: booking };
    }
    return { status: "failed", data: "Unable to create the vendor" };
  } catch (e) {
    throw new APIError((e as APIError).message, (e as APIError).code);
  }
}

export async function getListOfBookinhg(date?: string, vendor?: string) {
  try {
    const whereClause: any = { active: true };

    if (date) {
      whereClause.bookingDate = {
        [Op.between]: [
          `${date} 00:00:00`, // Start of the day
          `${date} 23:59:59`, // End of the day
        ],
      };
    }

    if (vendor) {
      whereClause["$Vendor.id$"] = vendor;
    }

    const bookingList = await Booking.findAll({
      where: whereClause,
      include: [
        {
          model: Vendor,
          as: "Vendor",
          attributes: ["vendorName"],
        },
      ],
      raw: true,
    });

    return { status: "success", data: bookingList };
  } catch (e) {
    throw new APIError((e as APIError).message, (e as APIError).code);
  }
}

export async function getBookingById(bookingId: string) {
  try {
    const booking = await Booking.findOne({
      where: { id: bookingId },
      include: [
        {
          model: Vendor,
          as: "Vendor",
          attributes: ["vendorName"], // Adjust based on Vendor model attributes
        },
      ],
      raw: true,
    });

    if (!booking) {
      throw new APIError("Booking not found", "404");
    }

    return { status: "success", data: booking };
  } catch (e) {
    throw new APIError((e as APIError).message, (e as APIError).code || "500");
  }
}

export async function deleteBookingById(bookingId: string) {
  try {
    const booking = await Booking.findOne({
      where: { id: bookingId, active: true },
      include: [
        {
          model: Vendor,
          as: "Vendor",
          attributes: ["vendorName"], // Adjust based on Vendor model attributes
        },
      ],
      raw: true,
    });

    if (!booking) {
      throw new APIError("Booking not found", "404");
    }

    booking.active = false;
    await booking.save();

    return { status: "success", data: booking };
  } catch (e) {
    throw new APIError((e as APIError).message, (e as APIError).code || "500");
  }
}
